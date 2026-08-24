alter table public.customer_orders add column if not exists currency text not null default 'INR';
alter table public.customer_orders add column if not exists upi_id text;
alter table public.customer_orders add column if not exists payment_submitted_at timestamptz;
alter table public.customer_orders add column if not exists payment_verified_at timestamptz;
alter table public.customer_orders add column if not exists cancelled_at timestamptz;

create index if not exists orders_payment_status_idx on public.customer_orders(payment_status, created_at desc);

create or replace function public.submit_payment_reference(p_order_id uuid, p_reference text)
returns public.customer_orders
language plpgsql
security invoker
set search_path = public
as $$
declare result public.customer_orders;
begin
  if trim(coalesce(p_reference, '')) = '' then
    raise exception 'Payment reference is required';
  end if;

  update public.customer_orders
  set payment_reference = trim(p_reference),
      payment_status = 'submitted',
      status = case when status = 'pending' then 'payment_pending' else status end,
      payment_submitted_at = now(),
      updated_at = now()
  where id = p_order_id and user_id = auth.uid()
  returning * into result;

  if result.id is null then raise exception 'Order not found'; end if;
  return result;
end;
$$;

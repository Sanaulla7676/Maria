alter table public.orders add column if not exists payment_status text not null default 'pending' check (payment_status in ('pending','submitted','verified','failed','refunded'));
alter table public.orders add column if not exists payment_reference text;
alter table public.orders add column if not exists payment_submitted_at timestamptz;
alter table public.orders add column if not exists payment_verified_at timestamptz;
alter table public.orders add column if not exists payment_rejected_at timestamptz;
alter table public.orders add column if not exists payment_rejection_reason text;
alter table public.orders add column if not exists paid_at timestamptz;

create or replace function public.submit_customer_payment_reference(p_order_id uuid, p_utr text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order orders%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(p_utr) = '' then raise exception 'UTR is required'; end if;
  select o.* into v_order from orders o join customers c on c.id=o.customer_id where o.id=p_order_id and c.id=auth.uid() for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status not in ('pending','failed') then raise exception 'Payment reference cannot be submitted in current state'; end if;
  update orders set payment_status='submitted', payment_reference=trim(p_utr), payment_submitted_at=now(), payment_rejection_reason=null, updated_at=now() where id=p_order_id;
  return jsonb_build_object('order_id',p_order_id,'payment_status','submitted');
end;
$$;

create or replace function public.admin_verify_customer_payment(p_order_id uuid, p_utr text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order orders%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(p_utr) = '' then raise exception 'UTR is required'; end if;
  select * into v_order from orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status <> 'submitted' then raise exception 'Payment must be submitted before verification'; end if;
  update orders set payment_status='verified', status='confirmed', payment_reference=trim(p_utr), paid_at=now(), payment_verified_at=now(), updated_at=now() where id=p_order_id;
  return jsonb_build_object('order_id',p_order_id,'payment_status','verified','status','confirmed');
end;
$$;

create or replace function public.admin_reject_customer_payment(p_order_id uuid, p_reason text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order orders%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(coalesce(p_reason,''))='' then raise exception 'Rejection reason is required'; end if;
  select * into v_order from orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status <> 'submitted' then raise exception 'Payment must be submitted before rejection'; end if;
  update orders set payment_status='failed', status='new', payment_rejected_at=now(), payment_rejection_reason=trim(p_reason), updated_at=now() where id=p_order_id;
  return jsonb_build_object('order_id',p_order_id,'payment_status','failed','status','new');
end;
$$;

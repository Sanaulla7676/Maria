alter table public.customer_orders add column if not exists tracking_number text;
alter table public.customer_orders add column if not exists carrier text;
alter table public.customer_orders add column if not exists shipped_at timestamptz;
alter table public.customer_orders add column if not exists delivered_at timestamptz;
alter table public.customer_orders add column if not exists fulfillment_note text;

create or replace function public.update_order_fulfillment(p_order_id uuid, p_status text, p_tracking_number text default null, p_carrier text default null, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order customer_orders%rowtype;
begin
  if auth.uid() is null then raise exception 'Unauthorized'; end if;
  if p_status not in ('processing','shipped','delivered','cancelled') then raise exception 'Invalid fulfillment status'; end if;
  select * into v_order from customer_orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status <> 'verified' and p_status <> 'cancelled' then raise exception 'Payment must be verified before fulfillment'; end if;

  update customer_orders set
    status=p_status,
    tracking_number=coalesce(nullif(trim(p_tracking_number),''), tracking_number),
    carrier=coalesce(nullif(trim(p_carrier),''), carrier),
    fulfillment_note=coalesce(nullif(trim(p_note),''), fulfillment_note),
    shipped_at=case when p_status='shipped' and shipped_at is null then now() else shipped_at end,
    delivered_at=case when p_status='delivered' and delivered_at is null then now() else delivered_at end,
    cancelled_at=case when p_status='cancelled' and cancelled_at is null then now() else cancelled_at end,
    updated_at=now()
  where id=p_order_id;

  return jsonb_build_object('order_id',p_order_id,'status',p_status,'tracking_number',coalesce(nullif(trim(p_tracking_number),''),v_order.tracking_number));
end;
$$;

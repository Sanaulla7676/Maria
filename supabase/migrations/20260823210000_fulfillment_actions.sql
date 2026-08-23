alter table public.customer_orders add column if not exists carrier text;
alter table public.customer_orders add column if not exists tracking_number text;
alter table public.customer_orders add column if not exists fulfillment_note text;
alter table public.customer_orders add column if not exists shipped_at timestamptz;
alter table public.customer_orders add column if not exists delivered_at timestamptz;

create or replace function public.ship_customer_order(p_order_id uuid, p_carrier text, p_tracking_number text, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order customer_orders%rowtype; v_notification uuid;
begin
  if auth.uid() is null then raise exception 'Unauthorized'; end if;
  if trim(p_carrier) = '' or trim(p_tracking_number) = '' then raise exception 'Carrier and tracking number are required'; end if;
  select * into v_order from customer_orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status <> 'verified' then raise exception 'Payment must be verified before shipping'; end if;
  if v_order.status <> 'processing' then raise exception 'Order must be processing before shipping'; end if;
  update customer_orders set status='shipped', carrier=trim(p_carrier), tracking_number=trim(p_tracking_number), fulfillment_note=nullif(trim(coalesce(p_note,'')),''), shipped_at=now(), updated_at=now() where id=p_order_id;
  select public.create_order_status_notification(p_order_id,'order_shipped') into v_notification;
  return jsonb_build_object('order_id',p_order_id,'status','shipped','notification_id',v_notification);
end;
$$;

create or replace function public.deliver_customer_order(p_order_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order customer_orders%rowtype; v_notification uuid;
begin
  if auth.uid() is null then raise exception 'Unauthorized'; end if;
  select * into v_order from customer_orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.status <> 'shipped' then raise exception 'Order must be shipped before delivery'; end if;
  update customer_orders set status='delivered', delivered_at=now(), updated_at=now() where id=p_order_id;
  select public.create_order_status_notification(p_order_id,'order_delivered') into v_notification;
  return jsonb_build_object('order_id',p_order_id,'status','delivered','notification_id',v_notification);
end;
$$;

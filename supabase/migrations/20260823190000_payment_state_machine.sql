alter table public.customer_orders add column if not exists paid_at timestamptz;
alter table public.customer_orders add column if not exists cancelled_at timestamptz;
alter table public.customer_orders add column if not exists payment_verified_by uuid references auth.users(id);
alter table public.customer_orders add column if not exists payment_verified_at timestamptz;

create or replace function public.verify_customer_payment(p_order_id uuid, p_utr text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_order customer_orders%rowtype;
  v_item record;
begin
  if auth.uid() is null then raise exception 'Unauthorized'; end if;
  if trim(p_utr) = '' then raise exception 'UTR is required'; end if;

  select * into v_order from customer_orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status = 'verified' then raise exception 'Payment already verified'; end if;
  if v_order.payment_status not in ('submitted','pending') then raise exception 'Payment cannot be verified from current state'; end if;

  update customer_orders
  set payment_status = 'verified', status = 'processing', payment_reference = trim(p_utr),
      paid_at = now(), payment_verified_by = auth.uid(), payment_verified_at = now(), updated_at = now()
  where id = p_order_id;

  for v_item in select * from customer_order_items where order_id = p_order_id loop
    update inventory_items
    set quantity = quantity - v_item.quantity,
        reserved_quantity = greatest(0, reserved_quantity - v_item.quantity),
        updated_at = now()
    where product_id = v_item.product_id and variant_key = coalesce(v_item.variant_name, 'default');
  end loop;

  return jsonb_build_object('order_id', p_order_id, 'status', 'processing', 'payment_status', 'verified');
end;
$$;

create or replace function public.reject_customer_payment(p_order_id uuid, p_reason text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_item record;
begin
  if auth.uid() is null then raise exception 'Unauthorized'; end if;
  if trim(coalesce(p_reason, '')) = '' then raise exception 'Rejection reason is required'; end if;

  update customer_orders set payment_status='failed', status='pending', payment_reference = null, updated_at=now()
  where id=p_order_id and payment_status in ('submitted','pending');
  if not found then raise exception 'Order cannot be rejected from current state'; end if;

  for v_item in select * from customer_order_items where order_id=p_order_id loop
    update inventory_items set reserved_quantity=greatest(0,reserved_quantity-v_item.quantity), updated_at=now()
    where product_id=v_item.product_id and variant_key=coalesce(v_item.variant_name,'default');
  end loop;

  return jsonb_build_object('order_id',p_order_id,'status','pending','payment_status','failed','reason',trim(p_reason));
end;
$$;

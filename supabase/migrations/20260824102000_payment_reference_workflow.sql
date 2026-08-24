alter table public.customer_orders add column if not exists payment_submitted_at timestamptz;
alter table public.customer_orders add column if not exists payment_rejected_at timestamptz;
alter table public.customer_orders add column if not exists payment_rejection_reason text;

create or replace function public.submit_customer_payment_reference(p_order_id uuid, p_utr text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order customer_orders%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(p_utr) = '' then raise exception 'UTR is required'; end if;
  select * into v_order from customer_orders where id=p_order_id and user_id=auth.uid() for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status not in ('pending','failed') then raise exception 'Payment reference cannot be submitted in current state'; end if;
  update customer_orders
  set payment_status='submitted', payment_reference=trim(p_utr), payment_submitted_at=now(), payment_rejection_reason=null, updated_at=now()
  where id=p_order_id;
  return jsonb_build_object('order_id',p_order_id,'payment_status','submitted');
end;
$$;

create or replace function public.admin_verify_customer_payment(p_order_id uuid, p_utr text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order customer_orders%rowtype; v_item record;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(p_utr) = '' then raise exception 'UTR is required'; end if;
  select * into v_order from customer_orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status <> 'submitted' then raise exception 'Payment must be submitted before verification'; end if;

  update customer_orders
  set payment_status='verified', status='processing', payment_reference=trim(p_utr), paid_at=now(), payment_verified_by=auth.uid(), payment_verified_at=now(), updated_at=now()
  where id=p_order_id;

  for v_item in select * from customer_order_items where order_id=p_order_id loop
    update inventory_items
    set quantity=quantity-v_item.quantity, reserved_quantity=greatest(0,reserved_quantity-v_item.quantity), updated_at=now()
    where product_id=v_item.product_id and variant_key=v_item.variant_name;
  end loop;

  perform public.create_order_status_notification(p_order_id,'payment_verified');
  perform public.create_order_status_notification(p_order_id,'order_processing');
  return jsonb_build_object('order_id',p_order_id,'payment_status','verified','status','processing');
end;
$$;

create or replace function public.admin_reject_customer_payment(p_order_id uuid, p_reason text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order customer_orders%rowtype; v_item record;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(coalesce(p_reason,''))='' then raise exception 'Rejection reason is required'; end if;
  select * into v_order from customer_orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status <> 'submitted' then raise exception 'Payment must be submitted before rejection'; end if;

  update customer_orders
  set payment_status='failed', status='payment_pending', payment_rejected_at=now(), payment_rejection_reason=trim(p_reason), updated_at=now()
  where id=p_order_id;

  for v_item in select * from customer_order_items where order_id=p_order_id loop
    update inventory_items set reserved_quantity=greatest(0,reserved_quantity-v_item.quantity), updated_at=now()
    where product_id=v_item.product_id and variant_key=v_item.variant_name;
  end loop;

  perform public.create_order_status_notification(p_order_id,'payment_failed');
  return jsonb_build_object('order_id',p_order_id,'payment_status','failed','status','payment_pending');
end;
$$;

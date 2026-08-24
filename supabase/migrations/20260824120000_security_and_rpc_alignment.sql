-- Migration: 20260824120000_security_and_rpc_alignment.sql
-- Description: Align RPC function names, enforce owner security checks, setup storage policies, and secure RLS rules.

-- 1. Ensure owner check helper exists
create or replace function public.is_owner()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.owner_profiles
    where id = auth.uid()
  );
$$;

-- 2. View/Table compatibility for orders
do $$
begin
  if not exists (select 1 from pg_tables where schemaname='public' and tablename='orders') then
    create or replace view public.orders as select * from public.customer_orders;
  end if;
end $$;

-- 3. Admin list orders RPC
create or replace function public.admin_list_orders(
  p_query text default null,
  p_payment_status text default null
)
returns table (
  id uuid,
  order_code text,
  customer_name text,
  total numeric(12,2),
  payment_status text,
  payment_reference text,
  status text,
  created_at timestamptz,
  notes text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_owner() then raise exception 'Owner access required'; end if;

  return query
  select 
    co.id,
    co.id::text as order_code,
    coalesce(p.full_name, 'Guest Customer') as customer_name,
    co.total,
    co.payment_status,
    co.payment_reference,
    co.status,
    co.created_at,
    null::text as notes
  from public.customer_orders co
  left join public.profiles p on p.id = co.user_id
  where (p_payment_status is null or co.payment_status = p_payment_status)
    and (
      p_query is null or trim(p_query) = '' 
      or co.id::text i-like '%' || trim(p_query) || '%'
      or coalesce(p.full_name,'') i-like '%' || trim(p_query) || '%'
      or coalesce(co.payment_reference,'') i-like '%' || trim(p_query) || '%'
    )
  order by co.created_at desc;
end;
$$;

-- 4. Admin get single order RPC
create or replace function public.admin_get_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_items jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_owner() then raise exception 'Owner access required'; end if;

  select co.*, coalesce(p.full_name, 'Guest Customer') as customer_name, p.phone as customer_phone
  into v_order
  from public.customer_orders co
  left join public.profiles p on p.id = co.user_id
  where co.id = p_order_id;

  if not found then raise exception 'Order not found'; end if;

  select coalesce(jsonb_agg(to_jsonb(i)), '[]'::jsonb)
  into v_items
  from public.customer_order_items i
  where i.order_id = p_order_id;

  return jsonb_build_object(
    'id', v_order.id,
    'order_code', v_order.id::text,
    'user_id', v_order.user_id,
    'customer_name', v_order.customer_name,
    'customer_phone', v_order.customer_phone,
    'subtotal', v_order.subtotal,
    'shipping', v_order.shipping,
    'total', v_order.total,
    'status', v_order.status,
    'payment_status', v_order.payment_status,
    'payment_reference', v_order.payment_reference,
    'shipping_address', v_order.shipping_address,
    'carrier', coalesce(v_order.shipping_address->>'carrier', ''),
    'tracking_number', coalesce(v_order.shipping_address->>'tracking_number', ''),
    'tracking_url', coalesce(v_order.shipping_address->>'tracking_url', ''),
    'created_at', v_order.created_at,
    'items', v_items
  );
end;
$$;

-- 5. Admin verify order payment RPC
create or replace function public.admin_verify_order_payment(p_order_id uuid, p_reference text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order customer_orders%rowtype;
  v_ref text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_owner() then raise exception 'Owner access required'; end if;

  select * into v_order from public.customer_orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  v_ref := coalesce(nullif(trim(coalesce(p_reference,'')), ''), v_order.payment_reference);

  update public.customer_orders
  set payment_status = 'verified',
      status = 'confirmed',
      payment_reference = v_ref,
      updated_at = now()
  where id = p_order_id;

  return jsonb_build_object('order_id', p_order_id, 'payment_status', 'verified', 'status', 'confirmed');
end;
$$;

create or replace function public.admin_verify_customer_payment(p_order_id uuid, p_utr text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.admin_verify_order_payment(p_order_id, p_utr);
end;
$$;

-- 6. Admin reject order payment RPC
create or replace function public.admin_reject_order_payment(p_order_id uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order customer_orders%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_owner() then raise exception 'Owner access required'; end if;

  if trim(coalesce(p_reason, '')) = '' then raise exception 'Rejection reason is required'; end if;

  select * into v_order from public.customer_orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  update public.customer_orders
  set payment_status = 'failed',
      status = 'pending',
      updated_at = now()
  where id = p_order_id;

  return jsonb_build_object('order_id', p_order_id, 'payment_status', 'failed', 'status', 'pending');
end;
$$;

create or replace function public.admin_reject_customer_payment(p_order_id uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.admin_reject_order_payment(p_order_id, p_reason);
end;
$$;

-- 7. Admin update order status RPC
create or replace function public.admin_update_order_status(p_order_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order customer_orders%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_owner() then raise exception 'Owner access required'; end if;

  if p_status not in ('pending','payment_pending','paid','confirmed','processing','shipped','delivered','cancelled') then
    raise exception 'Invalid status value';
  end if;

  select * into v_order from public.customer_orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  update public.customer_orders
  set status = p_status,
      updated_at = now()
  where id = p_order_id;

  return jsonb_build_object('order_id', p_order_id, 'status', p_status);
end;
$$;

-- 8. Admin update shipping RPC
create or replace function public.admin_update_shipping(
  p_order_id uuid,
  p_carrier text,
  p_tracking_number text,
  p_tracking_url text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order customer_orders%rowtype;
  v_address jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_owner() then raise exception 'Owner access required'; end if;

  select * into v_order from public.customer_orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  v_address := coalesce(v_order.shipping_address, '{}'::jsonb);
  v_address := jsonb_set(v_address, '{carrier}', to_jsonb(trim(p_carrier)));
  v_address := jsonb_set(v_address, '{tracking_number}', to_jsonb(trim(p_tracking_number)));
  if p_tracking_url is not null and trim(p_tracking_url) <> '' then
    v_address := jsonb_set(v_address, '{tracking_url}', to_jsonb(trim(p_tracking_url)));
  end if;

  update public.customer_orders
  set status = 'shipped',
      shipping_address = v_address,
      updated_at = now()
  where id = p_order_id;

  return jsonb_build_object('order_id', p_order_id, 'status', 'shipped');
end;
$$;

-- 9. Storage Buckets Creation & Security Policies
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true),
       ('product-images', 'product-images', true),
       ('workshop-media', 'workshop-media', true)
on conflict (id) do update set public = true;

-- Bucket Storage RLS
create policy "Public Read Product Media" on storage.objects for select using (bucket_id in ('product-media', 'product-images', 'workshop-media'));
create policy "Owner Insert Product Media" on storage.objects for insert to authenticated with check (bucket_id in ('product-media', 'product-images', 'workshop-media') and public.is_owner());
create policy "Owner Update Product Media" on storage.objects for update to authenticated using (bucket_id in ('product-media', 'product-images', 'workshop-media') and public.is_owner());
create policy "Owner Delete Product Media" on storage.objects for delete to authenticated using (bucket_id in ('product-media', 'product-images', 'workshop-media') and public.is_owner());

-- 10. Security Grants
revoke execute on function public.admin_list_orders(text,text) from public, anon;
revoke execute on function public.admin_get_order(uuid) from public, anon;
revoke execute on function public.admin_verify_order_payment(uuid,text) from public, anon;
revoke execute on function public.admin_verify_customer_payment(uuid,text) from public, anon;
revoke execute on function public.admin_reject_order_payment(uuid,text) from public, anon;
revoke execute on function public.admin_reject_customer_payment(uuid,text) from public, anon;
revoke execute on function public.admin_update_order_status(uuid,text) from public, anon;
revoke execute on function public.admin_update_shipping(uuid,text,text,text) from public, anon;

grant execute on function public.admin_list_orders(text,text) to authenticated;
grant execute on function public.admin_get_order(uuid) to authenticated;
grant execute on function public.admin_verify_order_payment(uuid,text) to authenticated;
grant execute on function public.admin_verify_customer_payment(uuid,text) to authenticated;
grant execute on function public.admin_reject_order_payment(uuid,text) to authenticated;
grant execute on function public.admin_reject_customer_payment(uuid,text) to authenticated;
grant execute on function public.admin_update_order_status(uuid,text) to authenticated;
grant execute on function public.admin_update_shipping(uuid,text,text,text) to authenticated;

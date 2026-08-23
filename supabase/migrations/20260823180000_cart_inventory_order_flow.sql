create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_key text not null,
  quantity integer not null default 0 check (quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  updated_at timestamptz not null default now(),
  unique(product_id, variant_key),
  check (reserved_quantity <= quantity)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_key text not null,
  product_name text not null,
  variant_name text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id, variant_key)
);

create index if not exists cart_items_user_idx on public.cart_items(user_id);
create index if not exists inventory_product_idx on public.inventory_items(product_id);

alter table public.inventory_items enable row level security;
alter table public.cart_items enable row level security;

create policy "customers read inventory" on public.inventory_items for select to authenticated using (true);
create policy "customers manage own cart" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.reserve_cart_inventory(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  item record;
  available integer;
  result jsonb := '[]'::jsonb;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then raise exception 'Unauthorized'; end if;

  for item in select * from cart_items where user_id = p_user_id for update loop
    select (quantity - reserved_quantity) into available
    from inventory_items
    where product_id = item.product_id and variant_key = item.variant_key
    for update;

    if available is null or available < item.quantity then
      raise exception 'Insufficient inventory for %', item.product_name;
    end if;

    update inventory_items
    set reserved_quantity = reserved_quantity + item.quantity, updated_at = now()
    where product_id = item.product_id and variant_key = item.variant_key;

    result := result || jsonb_build_array(jsonb_build_object('product_id', item.product_id, 'variant_key', item.variant_key, 'quantity', item.quantity));
  end loop;

  return result;
end;
$$;

create or replace function public.create_order_from_cart(p_user_id uuid, p_shipping_address jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_order_id uuid;
  total_amount numeric(12,2);
  item record;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then raise exception 'Unauthorized'; end if;
  if not exists (select 1 from cart_items where user_id = p_user_id) then raise exception 'Cart is empty'; end if;

  perform public.reserve_cart_inventory(p_user_id);
  select coalesce(sum(unit_price * quantity), 0) into total_amount from cart_items where user_id = p_user_id;

  insert into customer_orders(user_id, status, payment_status, subtotal, total, shipping_address)
  values (p_user_id, 'payment_pending', 'pending', total_amount, total_amount, p_shipping_address)
  returning id into new_order_id;

  for item in select * from cart_items where user_id = p_user_id loop
    insert into customer_order_items(order_id, product_id, product_name, variant_name, quantity, unit_price)
    values (new_order_id, item.product_id, item.product_name, item.variant_name, item.quantity, item.unit_price);
  end loop;

  delete from cart_items where user_id = p_user_id;
  return new_order_id;
end;
$$;

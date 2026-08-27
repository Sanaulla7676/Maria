-- Maria Perfumes: storefront baseline
-- Creates everything the app code references that does not exist yet in the live
-- database (cart, wishlist, orders, customer profiles), fixes RLS on event_enquiries
-- so the booking form can actually save a lead, and adds owner-gated write policies
-- to the existing catalog tables (products/product_variants/product_images) so the
-- admin dashboard can write to them directly instead of via RPCs that were never
-- created. Safe to run once; every statement is idempotent (create-if-not-exists /
-- drop-then-create-policy) so re-running it does nothing destructive.
--
-- Run this whole file in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.

-- ============================================================================
-- 1. profiles — one row per signed-up customer, auto-created on signup
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select
  using (auth.uid() = id or public.is_owner());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 2. wishlists
-- ============================================================================
create table if not exists public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.wishlists enable row level security;

drop policy if exists "wishlists_owner_rw" on public.wishlists;
create policy "wishlists_owner_rw" on public.wishlists for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 3. cart_items
-- ============================================================================
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  product_name text not null,
  variant_label text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0 and quantity <= 20),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, variant_id)
);

create index if not exists cart_items_user_idx on public.cart_items(user_id);

alter table public.cart_items enable row level security;

drop policy if exists "cart_items_owner_rw" on public.cart_items;
create policy "cart_items_owner_rw" on public.cart_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 4. customer_orders + customer_order_items
-- ============================================================================
create table if not exists public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'placed'
    check (status in ('placed','confirmed','processing','shipped','delivered','cancelled')),
  subtotal numeric(10,2) not null check (subtotal >= 0),
  shipping_fee numeric(10,2) not null default 0 check (shipping_fee >= 0),
  total numeric(10,2) not null check (total >= 0),
  currency text not null default 'INR',
  payment_status text not null default 'pending'
    check (payment_status in ('pending','submitted','verified','failed','refunded')),
  payment_reference text,
  upi_id text,
  shipping_address jsonb not null,
  notes text,
  carrier text,
  tracking_number text,
  tracking_url text,
  created_at timestamptz not null default now(),
  payment_submitted_at timestamptz,
  payment_verified_at timestamptz,
  payment_verified_by uuid references auth.users(id),
  paid_at timestamptz,
  cancelled_at timestamptz
);

create index if not exists customer_orders_user_idx on public.customer_orders(user_id, created_at desc);
create index if not exists customer_orders_status_idx on public.customer_orders(status, created_at desc);

alter table public.customer_orders enable row level security;

drop policy if exists "orders_select_own_or_owner" on public.customer_orders;
create policy "orders_select_own_or_owner" on public.customer_orders for select
  using (auth.uid() = user_id or public.is_owner());

drop policy if exists "orders_update_own" on public.customer_orders;
create policy "orders_update_own" on public.customer_orders for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "orders_update_owner" on public.customer_orders;
create policy "orders_update_owner" on public.customer_orders for update
  using (public.is_owner()) with check (public.is_owner());

create table if not exists public.customer_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.customer_orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name text not null,
  variant_label text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists customer_order_items_order_idx on public.customer_order_items(order_id);

alter table public.customer_order_items enable row level security;

drop policy if exists "order_items_select_via_order" on public.customer_order_items;
create policy "order_items_select_via_order" on public.customer_order_items for select
  using (
    exists (
      select 1 from public.customer_orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_owner())
    )
  );

-- ============================================================================
-- 5. create_order_from_cart — atomic checkout (stock check + decrement + order
--    + items + cart clear in one transaction). Runs as SECURITY DEFINER so it
--    can update product_variants regardless of that table's RLS.
-- ============================================================================
create or replace function public.create_order_from_cart(
  p_shipping_address jsonb,
  p_upi_id text default null,
  p_notes text default null
)
returns public.customer_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order public.customer_orders;
  v_subtotal numeric(10,2) := 0;
  v_item record;
  v_stock integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (select 1 from public.cart_items where user_id = v_user_id) then
    raise exception 'Cart is empty';
  end if;

  select coalesce(sum(unit_price * quantity), 0) into v_subtotal
  from public.cart_items where user_id = v_user_id;

  insert into public.customer_orders (user_id, subtotal, shipping_fee, total, upi_id, shipping_address, notes)
  values (v_user_id, v_subtotal, 0, v_subtotal, p_upi_id, p_shipping_address, p_notes)
  returning * into v_order;

  for v_item in select * from public.cart_items where user_id = v_user_id loop
    select stock into v_stock from public.product_variants where id = v_item.variant_id for update;
    if v_stock is null or v_stock < v_item.quantity then
      raise exception 'Insufficient stock for %', v_item.product_name;
    end if;

    update public.product_variants set stock = stock - v_item.quantity, updated_at = now()
    where id = v_item.variant_id;

    insert into public.customer_order_items (order_id, product_id, variant_id, product_name, variant_label, unit_price, quantity)
    values (v_order.id, v_item.product_id, v_item.variant_id, v_item.product_name, v_item.variant_label, v_item.unit_price, v_item.quantity);
  end loop;

  delete from public.cart_items where user_id = v_user_id;

  return v_order;
end;
$$;

revoke all on function public.create_order_from_cart(jsonb, text, text) from public, anon;
grant execute on function public.create_order_from_cart(jsonb, text, text) to authenticated;

-- ============================================================================
-- 6. event_enquiries — table already exists with RLS enabled and zero policies
--    (default-deny). Add insert-only for the booking form + owner read.
-- ============================================================================
drop policy if exists "event_enquiries_insert_public" on public.event_enquiries;
create policy "event_enquiries_insert_public" on public.event_enquiries for insert
  to anon, authenticated with check (true);

drop policy if exists "event_enquiries_select_owner" on public.event_enquiries;
create policy "event_enquiries_select_owner" on public.event_enquiries for select
  using (public.is_owner());

drop policy if exists "event_enquiries_update_owner" on public.event_enquiries;
create policy "event_enquiries_update_owner" on public.event_enquiries for update
  using (public.is_owner()) with check (public.is_owner());

-- ============================================================================
-- 7. Catalog tables — public can read active items, owner has full write.
--    (Admin CRUD is being rewritten to write these tables directly instead of
--    calling RPCs that were never created.)
-- ============================================================================
alter table public.products enable row level security;
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products for select
  using (active = true or public.is_owner());
drop policy if exists "products_write_owner" on public.products;
create policy "products_write_owner" on public.products for all
  using (public.is_owner()) with check (public.is_owner());

alter table public.product_variants enable row level security;
drop policy if exists "variants_select_public" on public.product_variants;
create policy "variants_select_public" on public.product_variants for select
  using (active = true or public.is_owner());
drop policy if exists "variants_write_owner" on public.product_variants;
create policy "variants_write_owner" on public.product_variants for all
  using (public.is_owner()) with check (public.is_owner());

alter table public.product_images enable row level security;
drop policy if exists "images_select_public" on public.product_images;
create policy "images_select_public" on public.product_images for select
  using (true);
drop policy if exists "images_write_owner" on public.product_images;
create policy "images_write_owner" on public.product_images for all
  using (public.is_owner()) with check (public.is_owner());

alter table public.categories enable row level security;
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public" on public.categories for select
  using (true);
drop policy if exists "categories_write_owner" on public.categories;
create policy "categories_write_owner" on public.categories for all
  using (public.is_owner()) with check (public.is_owner());

alter table public.product_media enable row level security;
drop policy if exists "media_select_public" on public.product_media;
create policy "media_select_public" on public.product_media for select
  using (true);
drop policy if exists "media_write_owner" on public.product_media;
create policy "media_write_owner" on public.product_media for all
  using (public.is_owner()) with check (public.is_owner());

-- ============================================================================
-- Verification queries — run these after the script above to sanity check.
-- ============================================================================
-- select count(*) from public.profiles;               -- 0 until someone signs up
-- select count(*) from public.wishlists;               -- 0
-- select count(*) from public.cart_items;              -- 0
-- select count(*) from public.customer_orders;         -- 0
-- select proname from pg_proc where proname = 'create_order_from_cart';
-- select policyname from pg_policies where tablename = 'event_enquiries';

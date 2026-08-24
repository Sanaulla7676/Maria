create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  size_ml integer not null check (size_ml in (30,50,100)),
  price numeric(12,2) not null check (price >= 0),
  sku text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_id, size_ml)
);

create index if not exists product_variants_product_idx on public.product_variants(product_id);
alter table public.product_variants enable row level security;
create policy "public read active variants" on public.product_variants for select using (is_active = true);

insert into public.product_variants (product_id, name, size_ml, price, sku)
select p.id, p.name || ' 30ml', 30, 600, 'MAR-' || upper(replace(p.name,' ','-')) || '-30'
from public.products p
where not exists (select 1 from public.product_variants v where v.product_id=p.id and v.size_ml=30);

insert into public.product_variants (product_id, name, size_ml, price, sku)
select p.id, p.name || ' 50ml', 50, 1000, 'MAR-' || upper(replace(p.name,' ','-')) || '-50'
from public.products p
where not exists (select 1 from public.product_variants v where v.product_id=p.id and v.size_ml=50);

insert into public.product_variants (product_id, name, size_ml, price, sku)
select p.id, p.name || ' 100ml', 100, 1800, 'MAR-' || upper(replace(p.name,' ','-')) || '-100'
from public.products p
where not exists (select 1 from public.product_variants v where v.product_id=p.id and v.size_ml=100);

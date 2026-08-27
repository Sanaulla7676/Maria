-- Lets each product variant carry its own image (for genuinely different-looking
-- variants, not just size differences) and confirms categories are fully owner-writable
-- for a categories management screen in admin. Idempotent, safe to run once.

alter table public.product_variants
  add column if not exists image_url text;

-- Already covered by 20260825120000's products_write_owner/categories_write_owner
-- policies, but re-asserted here defensively in case this runs standalone.
alter table public.categories enable row level security;
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public" on public.categories for select using (true);
drop policy if exists "categories_write_owner" on public.categories;
create policy "categories_write_owner" on public.categories for all
  using (public.is_owner()) with check (public.is_owner());

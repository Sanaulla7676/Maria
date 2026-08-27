-- Adds the structured fragrance-profile fields needed for a Fragrantica-style
-- product detail page (main accords, longevity, sillage, day/night, seasons).
-- All nullable/defaulted so existing products keep working; admin fills them in
-- via ProductManager. Safe to run once, idempotent.

alter table public.products
  add column if not exists main_accords jsonb not null default '[]'::jsonb,
  add column if not exists longevity_hours numeric,
  add column if not exists sillage text
    check (sillage is null or sillage in ('Light','Moderate','Strong','Very Strong')),
  add column if not exists best_daytime text
    check (best_daytime is null or best_daytime in ('day','night','both')),
  add column if not exists best_season text[] not null default '{}'::text[];

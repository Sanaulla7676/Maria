-- Site-wide theme/branding settings, editable from the admin dashboard
-- (Admin -> Settings). Single-row table (id is always 1).

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  primary_color text not null default '#6b1d2f',
  accent_color text not null default '#d4af37',
  button_radius text not null default 'pill' check (button_radius in ('pill','rounded','soft','sharp')),
  heading_font text not null default 'cormorant' check (heading_font in ('cormorant','playfair','marcellus','dmserif')),
  body_font text not null default 'jakarta' check (body_font in ('jakarta','inter','poppins','manrope')),
  site_name text not null default 'Maria Perfumes',
  tagline text not null default 'Luxury Atelier & Events',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public" on public.site_settings for select
  using (true);

drop policy if exists "site_settings_write_owner" on public.site_settings;
create policy "site_settings_write_owner" on public.site_settings for update
  using (public.is_owner()) with check (public.is_owner());

grant execute on function public.is_owner() to anon, authenticated;

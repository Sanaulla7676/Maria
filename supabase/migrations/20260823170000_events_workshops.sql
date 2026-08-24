create extension if not exists pgcrypto;

create table if not exists public.event_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  event_type text not null,
  event_date date,
  guest_count integer check (guest_count is null or guest_count > 0),
  venue text,
  customization text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','quoted','approved','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Sunday Perfumery Workshop',
  price_per_person integer not null default 1200 check (price_per_person >= 0),
  location text not null default 'Maria Perfumes, Bengaluru',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.workshop_sessions (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  session_date date not null,
  start_time time not null,
  capacity integer check (capacity is null or capacity > 0),
  status text not null default 'open' check (status in ('open','full','cancelled','completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.workshop_bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workshop_sessions(id) on delete restrict,
  name text not null,
  phone text not null,
  email text,
  participants integer not null check (participants > 0),
  total_amount integer not null check (total_amount >= 0),
  payment_status text not null default 'pending' check (payment_status in ('pending','submitted','verified','failed','refunded')),
  booking_status text not null default 'pending' check (booking_status in ('pending','confirmed','cancelled','attended','no_show')),
  utr text,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.workshop_bookings(id) on delete cascade,
  certificate_number text not null unique,
  issued_at timestamptz not null default now()
);

create index if not exists event_enquiries_status_idx on public.event_enquiries(status, created_at desc);
create index if not exists workshop_sessions_date_idx on public.workshop_sessions(session_date, status);
create index if not exists workshop_bookings_session_idx on public.workshop_bookings(session_id, booking_status);

alter table public.event_enquiries enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_sessions enable row level security;
alter table public.workshop_bookings enable row level security;
alter table public.certificates enable row level security;

-- Public creation is intentionally handled by server-side API routes using the service role.
-- Customer records should not receive direct table-write permissions.

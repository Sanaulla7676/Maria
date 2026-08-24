create table if not exists public.workshop_sessions (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  start_time time not null,
  location text not null default 'Maria Perfumes, Bengaluru',
  price_per_person numeric(12,2) not null default 1200 check (price_per_person > 0),
  capacity integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(session_date, start_time)
);

create table if not exists public.workshop_bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workshop_sessions(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  participants integer not null check (participants > 0),
  amount numeric(12,2) not null check (amount > 0),
  payment_status text not null default 'pending' check (payment_status in ('pending','submitted','verified','failed','refunded')),
  payment_reference text,
  status text not null default 'reserved' check (status in ('reserved','confirmed','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.event_enquiries(id) on delete cascade,
  note text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.workshop_sessions enable row level security;
alter table public.workshop_bookings enable row level security;
alter table public.event_enquiry_notes enable row level security;

create policy "public read active workshop sessions" on public.workshop_sessions for select using (active = true);
create policy "users create own workshop bookings" on public.workshop_bookings for insert to authenticated with check (user_id = auth.uid());
create policy "users read own workshop bookings" on public.workshop_bookings for select to authenticated using (user_id = auth.uid());
create policy "users update own booking payment ref" on public.workshop_bookings for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.create_workshop_booking(
  p_session_id uuid,
  p_full_name text,
  p_phone text,
  p_email text,
  p_participants integer
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_session workshop_sessions%rowtype;
  v_amount numeric(12,2);
  v_booked integer;
  v_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_participants <= 0 then raise exception 'Participants must be positive'; end if;
  select * into v_session from workshop_sessions where id = p_session_id and active = true for update;
  if not found then raise exception 'Workshop session unavailable'; end if;
  select coalesce(sum(participants),0) into v_booked from workshop_bookings where session_id=p_session_id and status in ('reserved','confirmed');
  if v_session.capacity is not null and v_booked + p_participants > v_session.capacity then raise exception 'Not enough seats available'; end if;
  v_amount := v_session.price_per_person * p_participants;
  insert into workshop_bookings(session_id,user_id,full_name,phone,email,participants,amount)
  values(p_session_id,auth.uid(),trim(p_full_name),trim(p_phone),nullif(trim(coalesce(p_email,'')),''),p_participants,v_amount)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.submit_workshop_payment_reference(p_booking_id uuid, p_reference text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update workshop_bookings set payment_status='submitted', payment_reference=trim(p_reference), updated_at=now()
  where id=p_booking_id and user_id=auth.uid() and payment_status in ('pending','failed');
  if not found then raise exception 'Booking unavailable'; end if;
  return jsonb_build_object('booking_id',p_booking_id,'payment_status','submitted');
end;
$$;

insert into workshop_sessions(session_date,start_time,price_per_person,active)
select (current_date + ((7 - extract(dow from current_date)::int) % 7))::date, '11:00', 1200, true
where extract(dow from current_date)::int <> 0
on conflict do nothing;

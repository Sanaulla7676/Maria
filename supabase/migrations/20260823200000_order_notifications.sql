create table if not exists public.order_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.customer_orders(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  channel text not null check (channel in ('in_app','email','whatsapp')),
  event_type text not null check (event_type in ('payment_verified','payment_failed','order_processing','order_shipped','order_delivered','order_cancelled')),
  title text not null,
  message text not null,
  read_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists order_notifications_user_idx on public.order_notifications(user_id, created_at desc);
create index if not exists order_notifications_order_idx on public.order_notifications(order_id, created_at desc);

alter table public.order_notifications enable row level security;
create policy "users read own notifications" on public.order_notifications for select using (auth.uid() = user_id);
create policy "users mark own notifications read" on public.order_notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.create_order_status_notification(p_order_id uuid, p_event_type text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_order customer_orders%rowtype;
  v_title text;
  v_message text;
  v_id uuid;
begin
  select * into v_order from customer_orders where id=p_order_id;
  if not found then raise exception 'Order not found'; end if;

  case p_event_type
    when 'payment_verified' then v_title := 'Payment verified'; v_message := 'Your Maria payment has been verified and your order is moving to processing.';
    when 'payment_failed' then v_title := 'Payment needs attention'; v_message := 'Your Maria payment could not be verified. Please review the payment details.';
    when 'order_processing' then v_title := 'Order processing'; v_message := 'Your Maria order is now being prepared.';
    when 'order_shipped' then v_title := 'Order shipped'; v_message := 'Your Maria order has shipped. Tracking details are available in your account.';
    when 'order_delivered' then v_title := 'Order delivered'; v_message := 'Your Maria order has been marked delivered. Enjoy your fragrance.';
    when 'order_cancelled' then v_title := 'Order cancelled'; v_message := 'Your Maria order has been cancelled.';
    else raise exception 'Unsupported notification event';
  end case;

  insert into order_notifications(order_id,user_id,channel,event_type,title,message,sent_at)
  values(v_order.id,v_order.user_id,'in_app',p_event_type,v_title,v_message,now()) returning id into v_id;
  return v_id;
end;
$$;

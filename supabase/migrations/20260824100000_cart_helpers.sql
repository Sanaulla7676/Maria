create or replace function public.upsert_cart_item(p_product_id uuid, p_variant_id uuid, p_quantity integer)
returns public.cart_items language plpgsql security definer set search_path = public as $$
declare v_item public.cart_items%rowtype; v_variant public.product_variants%rowtype; v_product public.products%rowtype;
begin
  if auth.uid() is null then raise exception 'Unauthorized'; end if;
  if p_quantity < 1 or p_quantity > 20 then raise exception 'Invalid quantity'; end if;
  select * into v_variant from product_variants where id=p_variant_id and product_id=p_product_id and is_active=true;
  if not found then raise exception 'Variant not found'; end if;
  select * into v_product from products where id=p_product_id;
  if not found then raise exception 'Product not found'; end if;
  insert into cart_items(user_id,product_id,variant_key,product_name,variant_name,unit_price,quantity,updated_at)
  values(auth.uid(),p_product_id,v_variant.id::text,v_product.name,v_variant.name,v_variant.price,p_quantity,now())
  on conflict(user_id,product_id,variant_key)
  do update set quantity=excluded.quantity, unit_price=excluded.unit_price, product_name=excluded.product_name, variant_name=excluded.variant_name, updated_at=now()
  returning * into v_item;
  return v_item;
end;
$$;

create or replace function public.remove_cart_item(p_product_id uuid, p_variant_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Unauthorized'; end if;
  delete from cart_items where user_id=auth.uid() and product_id=p_product_id and variant_key=p_variant_id::text;
  return found;
end;
$$;

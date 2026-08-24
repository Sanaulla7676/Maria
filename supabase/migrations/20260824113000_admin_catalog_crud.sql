create or replace function public.admin_create_product(
  p_slug text,
  p_name text,
  p_category_id uuid,
  p_description text,
  p_notes text[],
  p_featured boolean default false,
  p_badge text default '40% PURE OIL'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.owner_profiles where id = auth.uid()) then raise exception 'Owner access required'; end if;
  insert into public.products(slug,name,category_id,description,notes,featured,badge,active)
  values(trim(p_slug),trim(p_name),p_category_id,nullif(trim(p_description),''),coalesce(p_notes,'{}'),coalesce(p_featured,false),coalesce(nullif(trim(p_badge),''),'40% PURE OIL'),true)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.admin_upsert_variant(
  p_variant_id uuid,
  p_product_id uuid,
  p_size_ml integer,
  p_label text,
  p_price numeric,
  p_stock integer,
  p_sku text,
  p_active boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.owner_profiles where id = auth.uid()) then raise exception 'Owner access required'; end if;
  if p_size_ml not in (30,50,100) then raise exception 'Invalid size'; end if;
  if p_price < 0 or p_stock < 0 then raise exception 'Price and stock must be non-negative'; end if;
  if p_variant_id is null then
    insert into public.product_variants(product_id,size_ml,label,name,price,stock,sku,active)
    values(p_product_id,p_size_ml,trim(p_label),trim(p_label),p_price,p_stock,nullif(trim(p_sku),''),coalesce(p_active,true))
    returning id into v_id;
  else
    update public.product_variants
    set product_id=p_product_id,size_ml=p_size_ml,label=trim(p_label),name=trim(p_label),price=p_price,stock=p_stock,sku=nullif(trim(p_sku),''),active=p_active,updated_at=now()
    where id=p_variant_id returning id into v_id;
    if v_id is null then raise exception 'Variant not found'; end if;
  end if;
  return v_id;
end;
$$;

create or replace function public.admin_set_product_image(p_product_id uuid, p_image_url text, p_alt_text text, p_sort_order integer default 0)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.owner_profiles where id = auth.uid()) then raise exception 'Owner access required'; end if;
  insert into public.product_images(product_id,image_url,alt_text,sort_order)
  values(p_product_id,trim(p_image_url),nullif(trim(p_alt_text),''),greatest(0,p_sort_order))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.admin_adjust_variant_stock(p_variant_id uuid, p_delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_stock integer;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.owner_profiles where id = auth.uid()) then raise exception 'Owner access required'; end if;
  update public.product_variants
  set stock = greatest(0, stock + p_delta), updated_at=now()
  where id=p_variant_id
  returning stock into v_stock;
  if v_stock is null then raise exception 'Variant not found'; end if;
  return v_stock;
end;
$$;

revoke all on function public.admin_create_product(text,text,uuid,text,text[],boolean,text) from public, anon, authenticated;
revoke all on function public.admin_upsert_variant(uuid,uuid,integer,text,numeric,integer,text,boolean) from public, anon, authenticated;
revoke all on function public.admin_set_product_image(uuid,text,text,integer) from public, anon, authenticated;
revoke all on function public.admin_adjust_variant_stock(uuid,integer) from public, anon, authenticated;
grant execute on function public.admin_create_product(text,text,uuid,text,text[],boolean,text) to authenticated;
grant execute on function public.admin_upsert_variant(uuid,uuid,integer,text,numeric,integer,text,boolean) to authenticated;
grant execute on function public.admin_set_product_image(uuid,text,text,integer) to authenticated;
grant execute on function public.admin_adjust_variant_stock(uuid,integer) to authenticated;

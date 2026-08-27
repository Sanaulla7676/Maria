-- URGENT FIX: RLS policies that call public.is_owner() (products, product_variants,
-- product_images, categories, event_enquiries, customer_orders, etc.) were failing
-- for anonymous/authenticated visitors with "permission denied for function is_owner"
-- because those roles were never granted EXECUTE on the function. This made the whole
-- product catalog unreadable to anonymous storefront visitors. Safe to run immediately.

grant execute on function public.is_owner() to anon, authenticated;

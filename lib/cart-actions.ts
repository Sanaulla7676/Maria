'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/lib/types'

export async function getCart(): Promise<CartItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, variant_id, product_name, variant_label, unit_price, quantity, image_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as CartItem[]
}

export async function addToCart(productId: string, variantId: string, quantity = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const { data: variant, error: variantError } = await supabase
    .from('product_variants')
    .select('id, label, price, active, product_id')
    .eq('id', variantId)
    .eq('product_id', productId)
    .single()
  if (variantError || !variant || !variant.active) throw new Error('This fragrance is currently unavailable')

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, product_images(image_url, sort_order)')
    .eq('id', productId)
    .single()
  if (productError || !product) throw new Error('Product unavailable')

  const image = [...(product.product_images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order)[0]

  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('variant_id', variantId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: Math.min(20, existing.quantity + quantity), updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: productId,
      variant_id: variantId,
      product_name: product.name,
      variant_label: variant.label,
      unit_price: Number(variant.price),
      quantity,
      image_url: image?.image_url ?? null,
    })
    if (error) throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  if (quantity <= 0) {
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId).eq('user_id', user.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: Math.min(20, quantity), updated_at: new Date().toISOString() })
      .eq('id', cartItemId)
      .eq('user_id', user.id)
    if (error) throw new Error(error.message)
  }
  revalidatePath('/', 'layout')
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId).eq('user_id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/', 'layout')
}

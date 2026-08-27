'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { Product } from '@/lib/types'

const inputSchema = z.object({ productId: z.string().uuid() })

export async function toggleWishlist(input: unknown) {
  const parsed = inputSchema.parse(input)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { data: existing } = await supabase.from('wishlists').select('user_id').eq('user_id', user.id).eq('product_id', parsed.productId).maybeSingle()
  if (existing) await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', parsed.productId)
  else await supabase.from('wishlists').insert({ user_id: user.id, product_id: parsed.productId })
  revalidatePath('/', 'layout')
  return { saved: !existing }
}

export async function getWishlistProductIds(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', user.id)
  return (data ?? []).map((r) => r.product_id)
}

export async function getWishlistProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('wishlists')
    .select('products(*, product_images(*), product_variants(*))')
    .eq('user_id', user.id)
  if (error) throw new Error(error.message)
  return ((data ?? []).map((r: any) => r.products).filter(Boolean)) as Product[]
}

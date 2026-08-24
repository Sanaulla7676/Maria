'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const productSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().uuid(),
  description: z.string().trim().max(2000).default(''),
  notes: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  featured: z.boolean().default(false),
})

const variantSchema = z.object({
  variantId: z.string().uuid().nullable().optional(),
  productId: z.string().uuid(),
  sizeMl: z.union([z.literal(30), z.literal(50), z.literal(100)]),
  label: z.string().trim().min(1).max(80),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  sku: z.string().trim().max(80).optional().or(z.literal('')),
  active: z.boolean(),
})

export async function createProduct(input: unknown) {
  const value = productSchema.parse(input)
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Authentication required')
  const { data, error } = await supabase.rpc('admin_create_product', {
    p_slug: value.slug,
    p_name: value.name,
    p_category_id: value.categoryId,
    p_description: value.description,
    p_notes: value.notes,
    p_featured: value.featured,
  })
  if (error) throw new Error(error.message)
  return data as string
}

export async function upsertVariant(input: unknown) {
  const value = variantSchema.parse(input)
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Authentication required')
  const { data, error } = await supabase.rpc('admin_upsert_variant', {
    p_variant_id: value.variantId ?? null,
    p_product_id: value.productId,
    p_size_ml: value.sizeMl,
    p_label: value.label,
    p_price: value.price,
    p_stock: value.stock,
    p_sku: value.sku ?? '',
    p_active: value.active,
  })
  if (error) throw new Error(error.message)
  return data as string
}

export async function adjustStock(variantId: string, delta: number) {
  const id = z.string().uuid().parse(variantId)
  const change = z.number().int().min(-100000).max(100000).parse(delta)
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Authentication required')
  const { data, error } = await supabase.rpc('admin_adjust_variant_stock', { p_variant_id: id, p_delta: change })
  if (error) throw new Error(error.message)
  return data as number
}

export async function attachProductImage(productId: string, imageUrl: string, altText = '', sortOrder = 0) {
  const id = z.string().uuid().parse(productId)
  const url = z.string().url().parse(imageUrl)
  const alt = z.string().trim().max(200).parse(altText)
  const order = z.number().int().min(0).max(100).parse(sortOrder)
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Authentication required')
  const { data, error } = await supabase.rpc('admin_set_product_image', { p_product_id: id, p_image_url: url, p_alt_text: alt, p_sort_order: order })
  if (error) throw new Error(error.message)
  return data as string
}

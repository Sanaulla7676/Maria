'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const productSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().uuid(),
  family: z.string().trim().max(120).optional().or(z.literal('')),
  gender: z.string().trim().max(40).optional().or(z.literal('')),
  badge: z.string().trim().max(60).optional().or(z.literal('')),
  description: z.string().trim().max(2000).default(''),
  notes: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  featured: z.boolean().default(false),
})

const variantSchema = z.object({
  variantId: z.string().uuid().nullable().optional(),
  productId: z.string().uuid(),
  sizeMl: z.number().positive().nullable().optional(),
  label: z.string().trim().min(1).max(80),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  sku: z.string().trim().max(80).optional().or(z.literal('')),
  active: z.boolean(),
})

async function requireOwnerClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) throw new Error('Owner access required')
  return supabase
}

export async function createProduct(input: unknown) {
  const value = productSchema.parse(input)
  const supabase = await requireOwnerClient()
  const { data, error } = await supabase
    .from('products')
    .insert({
      slug: value.slug,
      name: value.name,
      category_id: value.categoryId,
      family: value.family || null,
      gender: value.gender || null,
      badge: value.badge || null,
      description: value.description || null,
      notes: value.notes,
      featured: value.featured,
      active: true,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  return data.id as string
}

export async function upsertVariant(input: unknown) {
  const value = variantSchema.parse(input)
  const supabase = await requireOwnerClient()
  const payload = {
    product_id: value.productId,
    size_ml: value.sizeMl ?? null,
    label: value.label,
    name: value.label,
    price: value.price,
    stock: value.stock,
    sku: value.sku || null,
    active: value.active,
  }
  if (value.variantId) {
    const { error } = await supabase.from('product_variants').update(payload).eq('id', value.variantId)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/products')
    return value.variantId
  }
  const { data, error } = await supabase.from('product_variants').insert(payload).select('id').single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  return data.id as string
}

export async function adjustStock(variantId: string, delta: number) {
  const id = z.string().uuid().parse(variantId)
  const change = z.number().int().min(-100000).max(100000).parse(delta)
  const supabase = await requireOwnerClient()
  const { data: variant, error: readError } = await supabase.from('product_variants').select('stock').eq('id', id).single()
  if (readError) throw new Error(readError.message)
  const nextStock = Math.max(0, variant.stock + change)
  const { error } = await supabase.from('product_variants').update({ stock: nextStock }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  return nextStock
}

export async function createCategory(name: string) {
  const value = z.string().trim().min(1).max(80).parse(name)
  const supabase = await requireOwnerClient()
  const { data, error } = await supabase.from('categories').insert({ name: value, active: true }).select('id,name,active').single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
  return data
}

export async function renameCategory(id: string, name: string) {
  const categoryId = z.string().uuid().parse(id)
  const value = z.string().trim().min(1).max(80).parse(name)
  const supabase = await requireOwnerClient()
  const { error } = await supabase.from('categories').update({ name: value }).eq('id', categoryId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function toggleCategoryActive(id: string, active: boolean) {
  const categoryId = z.string().uuid().parse(id)
  const supabase = await requireOwnerClient()
  const { error } = await supabase.from('categories').update({ active }).eq('id', categoryId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  const categoryId = z.string().uuid().parse(id)
  const supabase = await requireOwnerClient()
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function attachProductImage(productId: string, imageUrl: string, altText = '', sortOrder = 0) {
  const id = z.string().uuid().parse(productId)
  const url = z.string().url().parse(imageUrl)
  const alt = z.string().trim().max(200).parse(altText)
  const order = z.number().int().min(0).max(100).parse(sortOrder)
  const supabase = await requireOwnerClient()
  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id: id, image_url: url, alt_text: alt || null, sort_order: order })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  return data.id as string
}

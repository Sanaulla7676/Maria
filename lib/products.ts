import { createClient } from '@/lib/supabase/server'
import type { Product, Category } from '@/lib/types'

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data as Product | null
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').eq('active', true).order('name')
  if (error) throw new Error(error.message)
  return (data ?? []) as Category[]
}

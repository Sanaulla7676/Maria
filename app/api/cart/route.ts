import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const cartMutation = z.object({
  action: z.enum(['add', 'update', 'remove']),
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().max(20),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data, error } = await supabase.from('cart_items').select('*').eq('user_id', user.id).order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: Request) {
  const parsed = cartMutation.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid cart request' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { action, productId, variantId, quantity } = parsed.data
  const { data: variant, error: variantError } = await supabase.from('product_variants').select('id, name, price, is_active, product_id').eq('id', variantId).eq('product_id', productId).single()
  if (variantError || !variant || !variant.is_active) return NextResponse.json({ error: 'Variant unavailable' }, { status: 400 })

  const { data: product, error: productError } = await supabase.from('products').select('id, name').eq('id', productId).single()
  if (productError || !product) return NextResponse.json({ error: 'Product unavailable' }, { status: 400 })

  if (action === 'remove') {
    const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId).eq('variant_key', variantId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, action })
  }

  const { error } = await supabase.from('cart_items').upsert({
    user_id: user.id,
    product_id: product.id,
    variant_key: variant.id,
    product_name: product.name,
    variant_name: variant.name,
    unit_price: Number(variant.price),
    quantity,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,product_id,variant_key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, action, quantity })
}

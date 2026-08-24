import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const updateSchema = z.object({
  productId: z.string().uuid(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  variantId: z.string().uuid().optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  variantActive: z.boolean().optional(),
})

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid product update' }, { status: 400 })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: owner, error: ownerError } = await supabase.rpc('is_owner')
  if (ownerError || !owner) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  const { productId, active, featured, variantId, price, stock, variantActive } = parsed.data

  if (active !== undefined || featured !== undefined) {
    const payload: Record<string, boolean> = {}
    if (active !== undefined) payload.active = active
    if (featured !== undefined) payload.featured = featured
    const { error } = await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', productId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (variantId) {
    const payload: Record<string, number | boolean | string> = { updated_at: new Date().toISOString() }
    if (price !== undefined) payload.price = price
    if (stock !== undefined) payload.stock = stock
    if (variantActive !== undefined) payload.active = variantActive
    const { error } = await supabase.from('product_variants').update(payload).eq('id', variantId).eq('product_id', productId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

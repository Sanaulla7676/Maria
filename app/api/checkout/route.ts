import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkoutRequestSchema } from '@/lib/real-checkout'

export async function POST(request: Request) {
  const parsed = checkoutRequestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid delivery details' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data: order, error } = await supabase.rpc('create_order_from_cart', {
    p_shipping_address: parsed.data.shippingAddress,
    p_upi_id: process.env.MARIA_UPI_ID || process.env.NEXT_PUBLIC_MARIA_UPI_ID || null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!order) return NextResponse.json({ error: 'Unable to create order' }, { status: 400 })

  return NextResponse.json({ order })
}

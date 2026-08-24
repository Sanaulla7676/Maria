import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkoutRequestSchema } from '@/lib/real-checkout'

export async function POST(request: Request) {
  const parsed = checkoutRequestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid delivery details' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data: orderId, error } = await supabase.rpc('create_order_from_cart', {
    p_user_id: user.id,
    p_shipping_address: parsed.data.shippingAddress,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!orderId) return NextResponse.json({ error: 'Unable to create order' }, { status: 400 })

  const { data: order } = await supabase
    .from('customer_orders')
    .select('id,total,status,payment_status')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ order })
}

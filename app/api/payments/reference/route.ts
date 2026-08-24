import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ orderId: z.string().uuid(), reference: z.string().trim().min(4).max(64) })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payment reference' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data, error } = await supabase
    .from('customer_orders')
    .update({ payment_status: 'submitted', payment_reference: parsed.data.reference.trim(), updated_at: new Date().toISOString() })
    .eq('id', parsed.data.orderId)
    .eq('user_id', user.id)
    .in('payment_status', ['pending', 'submitted'])
    .select('id,payment_status,payment_reference')
    .single()

  if (error || !data) return NextResponse.json({ error: error?.message ?? 'Order not found' }, { status: 400 })
  return NextResponse.json({ ok: true, payment: data })
}

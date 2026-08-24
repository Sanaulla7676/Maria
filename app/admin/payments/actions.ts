'use server'

import { createClient } from '@/lib/supabase/server'
import { rejectPaymentSchema, verifyPaymentSchema } from '@/lib/admin-payment-actions'

export async function verifyPayment(input: unknown) {
  const parsed = verifyPaymentSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid payment data' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Authentication required' }
  const { data, error } = await supabase.rpc('admin_verify_customer_payment', { p_order_id: parsed.data.orderId, p_utr: parsed.data.utr })
  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}

export async function rejectPayment(input: unknown) {
  const parsed = rejectPaymentSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid rejection data' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Authentication required' }
  const { data, error } = await supabase.rpc('admin_reject_customer_payment', { p_order_id: parsed.data.orderId, p_reason: parsed.data.reason })
  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

async function requireOwnerClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) throw new Error('Owner access required')
  return supabase
}

const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export async function verifyOrderPayment(orderId: string) {
  const id = z.string().uuid().parse(orderId)
  const supabase = await requireOwnerClient()
  const { error } = await supabase
    .from('customer_orders')
    .update({
      payment_status: 'verified',
      payment_verified_at: new Date().toISOString(),
      status: 'confirmed',
      paid_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('payment_status', 'submitted')
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}

export async function rejectOrderPayment(orderId: string, reason: string) {
  const id = z.string().uuid().parse(orderId)
  const trimmedReason = z.string().trim().min(1).max(500).parse(reason)
  const supabase = await requireOwnerClient()
  const { error } = await supabase
    .from('customer_orders')
    .update({
      payment_status: 'failed',
      notes: trimmedReason,
      cancelled_at: new Date().toISOString(),
      status: 'cancelled',
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}

export async function updateOrderStatus(orderId: string, status: string) {
  const id = z.string().uuid().parse(orderId)
  const parsedStatus = z.enum(statuses).parse(status)
  const supabase = await requireOwnerClient()
  const { error } = await supabase.from('customer_orders').update({ status: parsedStatus }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}

export async function updateShipping(orderId: string, carrier: string, trackingNumber: string, trackingUrl: string) {
  const id = z.string().uuid().parse(orderId)
  const supabase = await requireOwnerClient()
  const { error } = await supabase
    .from('customer_orders')
    .update({
      carrier: carrier || null,
      tracking_number: trackingNumber || null,
      tracking_url: trackingUrl || null,
      status: 'shipped',
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}

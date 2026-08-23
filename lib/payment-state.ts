import { z } from 'zod'

export const paymentActionSchema = z.object({
  orderId: z.string().uuid(),
  utr: z.string().trim().min(4).max(64).optional(),
  reason: z.string().trim().min(3).max(500).optional(),
})

export type PaymentAction = z.infer<typeof paymentActionSchema>

export type PaymentStatus = 'pending' | 'submitted' | 'verified' | 'failed' | 'refunded'
export type OrderStatus = 'pending' | 'payment_pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export function canVerifyPayment(status: PaymentStatus) {
  return status === 'pending' || status === 'submitted'
}

export function canRejectPayment(status: PaymentStatus) {
  return status === 'pending' || status === 'submitted'
}

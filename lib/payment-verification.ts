import { z } from 'zod'

export const paymentVerificationSchema = z.object({
  orderId: z.string().uuid(),
  action: z.enum(['verify', 'reject', 'refund']),
  utr: z.string().trim().min(6).max(40).optional(),
  note: z.string().trim().max(500).optional(),
})

export type PaymentVerificationInput = z.infer<typeof paymentVerificationSchema>

export const paymentStatusLabel: Record<string, string> = {
  pending: 'Awaiting payment',
  submitted: 'UTR submitted',
  verified: 'Verified',
  failed: 'Rejected',
  refunded: 'Refunded',
}

import { z } from 'zod'

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  utr: z.string().trim().min(4).max(64),
})

export const rejectPaymentSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().trim().min(3).max(500),
})

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>
export type RejectPaymentInput = z.infer<typeof rejectPaymentSchema>

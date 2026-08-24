import { z } from 'zod'

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  utr: z.string().trim().min(6).max(100),
})

export const rejectPaymentSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().trim().min(2).max(1000),
})

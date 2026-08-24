import { z } from 'zod'

export const paymentReferenceSchema = z.object({
  orderId: z.string().uuid(),
  utr: z.string().trim().min(6).max(64),
})

export type PaymentReferenceInput = z.infer<typeof paymentReferenceSchema>

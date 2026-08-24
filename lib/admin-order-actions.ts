import { z } from 'zod'

export const shipOrderSchema = z.object({
  orderId: z.string().uuid(),
  carrier: z.string().trim().min(2).max(80),
  trackingNumber: z.string().trim().min(3).max(120),
  note: z.string().trim().max(500).optional(),
})

export const deliverOrderSchema = z.object({ orderId: z.string().uuid() })
export const cancelOrderSchema = z.object({ orderId: z.string().uuid(), reason: z.string().trim().min(3).max(500) })

export type ShipOrderInput = z.infer<typeof shipOrderSchema>
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>

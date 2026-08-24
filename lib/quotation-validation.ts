import { z } from 'zod'

export const quotationItemSchema = z.object({
  description: z.string().trim().min(1).max(200),
  quantity: z.number().int().min(1).max(100000),
  unitPrice: z.number().min(0).max(10000000),
})

export const quotationSchema = z.object({
  customerId: z.string().uuid().nullable().optional(),
  eventType: z.enum(['return_gifts', 'private_workshop', 'corporate_workshop', 'event_stall']),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']).default('draft'),
  notes: z.string().trim().max(2000).optional(),
  validUntil: z.string().date().nullable().optional(),
  items: z.array(quotationItemSchema).min(1).max(100),
})

export function quotationTotal(items: Array<{ quantity: number; unitPrice: number }>) {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
}

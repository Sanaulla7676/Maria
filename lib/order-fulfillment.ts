import { z } from 'zod'

export const fulfillmentSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(['processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().trim().max(120).optional(),
  carrier: z.string().trim().max(80).optional(),
  note: z.string().trim().max(500).optional(),
})

export type FulfillmentInput = z.infer<typeof fulfillmentSchema>

export const fulfillmentSteps = [
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
] as const

export function canMoveFulfillment(current: string, next: FulfillmentInput['status']) {
  if (next === 'cancelled') return current !== 'delivered'
  const order = ['processing', 'shipped', 'delivered']
  return order.includes(current) && order.indexOf(next) >= order.indexOf(current)
}

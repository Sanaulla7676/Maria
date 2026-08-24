import { z } from 'zod'

export const checkoutRequestSchema = z.object({
  shippingAddress: z.object({
    recipient_name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/),
    line1: z.string().trim().min(3).max(160),
    line2: z.string().trim().max(160).optional().or(z.literal('')),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    postal_code: z.string().trim().regex(/^\d{6}$/),
    country: z.string().trim().default('India'),
  }),
})

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>

type UpiIntentInput = { upiId?: string; merchantUpiId?: string; payeeName: string; amount: number; orderId: string }
export function buildUpiIntent({ upiId, merchantUpiId, payeeName, amount, orderId }: UpiIntentInput) {
  const pa = upiId || merchantUpiId || ''
  if (!pa) return '#'
  const params = new URLSearchParams({ pa, pn: payeeName, am: amount.toFixed(2), cu: 'INR', tn: `Maria Order ${orderId}` })
  return `upi://pay?${params.toString()}`
}

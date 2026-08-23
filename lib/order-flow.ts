import { z } from 'zod'

export const checkoutSchema = z.object({
  recipient_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/),
  line1: z.string().trim().min(3).max(160),
  line2: z.string().trim().max(160).optional().or(z.literal('')),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postal_code: z.string().trim().regex(/^\d{6}$/),
})

export type CheckoutAddress = z.infer<typeof checkoutSchema>

export function calculateTotal(items: Array<{ unit_price: number; quantity: number }>, shipping = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  return { subtotal, shipping, total: subtotal + shipping }
}

export function createUpiIntent({ upiId, payeeName, amount, orderId }: { upiId: string; payeeName: string; amount: number; orderId: string }) {
  const params = new URLSearchParams({ pa: upiId, pn: payeeName, am: amount.toFixed(2), cu: 'INR', tn: `Maria Order ${orderId}` })
  return `upi://pay?${params.toString()}`
}

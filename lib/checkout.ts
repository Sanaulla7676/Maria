import { z } from 'zod'

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  productName: z.string().min(1),
  variantName: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
})

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  shippingAddress: z.object({
    recipientName: z.string().min(2),
    phone: z.string().min(10),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().regex(/^\d{6}$/),
    country: z.string().default('India'),
  }),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export function calculateCheckoutTotal(items: CheckoutInput['items'], shipping = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  return { subtotal, shipping, total: subtotal + shipping }
}

export function createUpiIntent(params: { upiId: string; payeeName: string; amount: number; orderId: string }) {
  const query = new URLSearchParams({
    pa: params.upiId,
    pn: params.payeeName,
    am: params.amount.toFixed(2),
    cu: 'INR',
    tn: `Maria Order ${params.orderId}`,
  })
  return `upi://pay?${query.toString()}`
}

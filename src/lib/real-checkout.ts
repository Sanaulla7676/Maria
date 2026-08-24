import { z } from 'zod'

export type UpiIntentInput = {
  amount: number
  upiId?: string
  merchantUpiId?: string
  payeeName?: string
  orderId?: string
  orderCode?: string
  note?: string
}

export const checkoutRequestSchema = z.object({
  shippingAddress: z.string().trim().min(10).max(2000),
})

/** Build a UPI deep-link for manual payment. */
export function buildUpiIntent({ amount, orderCode, note }: UpiIntentInput): string {
  const upiId = process.env.NEXT_PUBLIC_MARIA_UPI_ID ?? ''
  if (!upiId) throw new Error('Maria UPI ID is not configured.')

  const params = new URLSearchParams({
    pa: upiId,
    pn: 'Maria Perfumes',
    am: Math.max(0, Number(amount)).toFixed(2),
    cu: 'INR',
  })

  const transactionNote = [note, orderCode ? `Order ${orderCode}` : undefined]
    .filter(Boolean)
    .join(' · ')
  if (transactionNote) params.set('tn', transactionNote)

  return `upi://pay?${params.toString()}`
}

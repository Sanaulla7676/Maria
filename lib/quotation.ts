import { z } from 'zod'

export const quotationItemSchema = z.object({
  description: z.string().trim().min(1).max(200),
  quantity: z.number().int().positive().max(100000),
  unit_price: z.number().nonnegative().max(10000000),
})

export const quotationSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_email: z.string().email().max(180).optional().or(z.literal('')),
  customer_phone: z.string().trim().min(10).max(20),
  event_type: z.string().trim().min(2).max(80),
  valid_until: z.string().date(),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
  items: z.array(quotationItemSchema).min(1).max(100),
})

export type QuotationInput = z.infer<typeof quotationSchema>

export function calculateQuotationTotal(items: Array<{ quantity: number; unit_price: number }>) {
  return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
}

export function buildWhatsAppShareUrl(phone: string, quoteCode: string, total: number) {
  const digits = phone.replace(/\D/g, '')
  const message = `Maria quotation ${quoteCode}: ₹${total.toLocaleString('en-IN')}. Please review the quotation details.`
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

import { z } from 'zod'

export const quotationItemSchema = z.object({
  description: z.string().trim().min(1).max(500),
  quantity: z.coerce.number().int().min(1).max(100000),
  unit_price: z.coerce.number().finite().min(0).max(100000000),
})

export const quotationSchema = z.object({
  customer_name: z.string().trim().min(1).max(200),
  customer_email: z.string().trim().email().max(320).optional().or(z.literal('')),
  customer_phone: z.string().trim().min(7).max(30),
  event_type: z.string().trim().min(1).max(100),
  valid_until: z.string().trim().min(8).max(30),
  notes: z.string().trim().max(5000).optional().or(z.literal('')),
  items: z.array(quotationItemSchema).min(1).max(200),
})

export type QuotationItem = z.infer<typeof quotationItemSchema>
export type QuotationInput = z.infer<typeof quotationSchema>

export function calculateQuotationTotal(items: QuotationItem[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unit_price, 0)
}

export function buildWhatsAppShareUrl(phone: string, quoteCode: string, total: number): string {
  const normalized = phone.replace(/\D/g, '')
  const message = `Maria Perfumes quotation ${quoteCode}: ₹${total.toLocaleString('en-IN')}. Please contact us for confirmation.`
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

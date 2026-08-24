import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { quotationSchema, calculateQuotationTotal } from '@/lib/quotation'

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const body = await request.formData()
  const itemsRaw = String(body.get('items') || '[]')
  let items: unknown
  try { items = JSON.parse(itemsRaw) } catch { return NextResponse.json({ error: 'Invalid items' }, { status: 400 }) }
  const parsed = quotationSchema.safeParse({
    customer_name: String(body.get('customer_name') || ''),
    customer_email: String(body.get('customer_email') || ''),
    customer_phone: String(body.get('customer_phone') || ''),
    event_type: String(body.get('event_type') || ''),
    valid_until: String(body.get('valid_until') || ''),
    notes: String(body.get('notes') || ''),
    items,
  })
  if (!parsed.success) return NextResponse.json({ error: 'Invalid quotation data', details: parsed.error.flatten() }, { status: 400 })
  const total = calculateQuotationTotal(parsed.data.items)
  const { data: quote, error } = await supabase.from('quotations').insert({
    customer_name: parsed.data.customer_name,
    customer_email: parsed.data.customer_email || null,
    customer_phone: parsed.data.customer_phone,
    event_type: parsed.data.event_type,
    valid_until: parsed.data.valid_until,
    notes: parsed.data.notes || null,
    subtotal: total,
    total,
    status: 'draft',
  }).select('id,quote_code').single()
  if (error || !quote) return NextResponse.json({ error: error?.message || 'Could not save quotation' }, { status: 500 })
  const { error: itemError } = await supabase.from('quotation_items').insert(parsed.data.items.map((item) => ({ quotation_id: quote.id, description: item.description, quantity: item.quantity, unit_price: item.unit_price, line_total: item.quantity * item.unit_price })))
  if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 })
  return NextResponse.redirect(new URL(`/admin/quotations/${quote.id}`, request.url))
}

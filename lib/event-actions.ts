'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { serviceOptions } from '@/lib/event-options'
import { buildMariaWhatsAppUrl } from '@/lib/whatsapp'

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(20),
  eventType: z.enum(serviceOptions),
})

function generateEnquiryCode() {
  return `EVQ-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`
}

export async function submitEventEnquiry(input: unknown) {
  const parsed = enquirySchema.safeParse(input)
  if (!parsed.success) throw new Error('Please provide your name, phone and a service option.')

  const supabase = await createClient()
  const { error } = await supabase.from('event_enquiries').insert({
    enquiry_code: generateEnquiryCode(),
    name: parsed.data.name,
    phone: parsed.data.phone,
    event_type: parsed.data.eventType,
    requirements: parsed.data.eventType,
    status: 'new',
  })
  if (error) throw new Error(error.message)

  const message = [
    'Hello Maria Perfumes, I would like to enquire about an event booking.',
    `Name: ${parsed.data.name}`,
    `Contact: ${parsed.data.phone}`,
    `Service: ${parsed.data.eventType}`,
    'Please share availability and booking details.',
  ].join(String.fromCharCode(10))

  return { ok: true, whatsappUrl: buildMariaWhatsAppUrl(message) }
}

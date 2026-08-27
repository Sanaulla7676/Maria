import { NextResponse } from 'next/server'
import { eventTypes } from '@/lib/maria-business'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const form = await request.formData()
  const eventType = String(form.get('eventType') || '')
  const name = String(form.get('name') || '').trim()
  const phone = String(form.get('phone') || '').trim()
  const email = String(form.get('email') || '').trim()
  const eventDate = String(form.get('eventDate') || '').trim()
  const guestCountRaw = String(form.get('guestCount') || '').trim()
  const venue = String(form.get('venue') || '').trim()
  const customization = String(form.get('customization') || '').trim()
  const message = String(form.get('message') || '').trim()

  if (!name || !phone || !eventTypes.includes(eventType as (typeof eventTypes)[number])) {
    return NextResponse.json({ error: 'Please provide name, phone and a valid event type.' }, { status: 400 })
  }

  const requirements = [venue && `Venue: ${venue}`, customization && `Customization: ${customization}`, message]
    .filter(Boolean)
    .join(' | ')
  const enquiryCode = `EVQ-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`

  const supabase = await createClient()
  const { error } = await supabase.from('event_enquiries').insert({
    enquiry_code: enquiryCode,
    name,
    phone,
    email: email || null,
    event_type: eventType,
    event_date: eventDate || null,
    guest_count: guestCountRaw ? Number(guestCountRaw) : null,
    requirements: requirements || null,
    status: 'new',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const origin = new URL(request.url).origin
  return NextResponse.redirect(new URL('/events?submitted=1', origin), 303)
}

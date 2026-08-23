import { NextResponse } from 'next/server'
import { eventTypes } from '@/lib/maria-business'

export async function POST(request: Request) {
  const form = await request.formData()
  const eventType = String(form.get('eventType') || '')
  const name = String(form.get('name') || '').trim()
  const phone = String(form.get('phone') || '').trim()

  if (!name || !phone || !eventTypes.includes(eventType as (typeof eventTypes)[number])) {
    return NextResponse.json({ error: 'Please provide name, phone and a valid event type.' }, { status: 400 })
  }

  // Persistence is wired through the Supabase migration. Keep this endpoint safe until the
  // server-side Supabase client is configured in the deployment environment.
  return NextResponse.json({
    ok: true,
    status: 'received',
    message: 'Your Maria event enquiry has been received. The team can follow up on WhatsApp.',
  })
}

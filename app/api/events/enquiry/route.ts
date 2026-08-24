import { NextResponse } from 'next/server'
import { eventTypes } from '@/lib/maria-business'

export async function POST(request: Request) {
  const form = await request.formData()
  const eventType = String(form.get('eventType') || '')
  const name = String(form.get('name') || '').trim()
  const phone = String(form.get('phone') || '').trim()
  if (!name || !phone || !eventTypes.includes(eventType as (typeof eventTypes)[number])) return NextResponse.json({ error: 'Please provide name, phone and a valid event type.' }, { status: 400 })
  const origin = new URL(request.url).origin
  return NextResponse.redirect(new URL('/events?submitted=1', origin), 303)
}

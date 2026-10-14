import { NextResponse } from 'next/server'
import { upcomingWorkshop } from '@/lib/maria-business'
import { buildMariaWhatsAppUrl } from '@/lib/whatsapp'

export async function POST(request: Request) {
  const form = await request.formData()
  const name = String(form.get('name') || '').trim()
  const phone = String(form.get('phone') || '').trim()
  const email = String(form.get('email') || '').trim()
  const participants = Number(form.get('participants') || 0)
  const notes = String(form.get('notes') || '').trim()

  if (!name || !phone || !Number.isInteger(participants) || participants < 1) {
    return NextResponse.json({ error: 'Please provide valid booking details.' }, { status: 400 })
  }

  const amount = participants * upcomingWorkshop.pricePerPerson
  const message = [
    'Hello Maria Perfumes, I would like to book the perfume-making workshop.',
    `Name: ${name}`,
    `Contact: ${phone}`,
    email ? `Email: ${email}` : '',
    `Session: ${upcomingWorkshop.day} · ${upcomingWorkshop.date} · ${upcomingWorkshop.time}`,
    `Location: ${upcomingWorkshop.location}`,
    `Participants: ${participants}`,
    `Estimated total: ₹${amount.toLocaleString('en-IN')}`,
    notes ? `Notes: ${notes}` : '',
    'Please confirm seat availability and booking details.',
  ].filter(Boolean).join(String.fromCharCode(10))
  const whatsappUrl = buildMariaWhatsAppUrl(message)

  if (request.headers.get('accept')?.includes('application/json')) {
    return NextResponse.json({ ok: true, whatsappUrl })
  }
  return NextResponse.redirect(whatsappUrl, 303)
}

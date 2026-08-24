import { NextResponse } from 'next/server'
import { upcomingWorkshop } from '@/lib/maria-business'

const UPI_ID = process.env.MARIA_UPI_ID || 'YOUR-UPI-ID@upi'
const PAYEE_NAME = process.env.MARIA_UPI_NAME || 'Maria Perfumes'

export async function POST(request: Request) {
  const form = await request.formData()
  const name = String(form.get('name') || '').trim()
  const phone = String(form.get('phone') || '').trim()
  const email = String(form.get('email') || '').trim()
  const participants = Number(form.get('participants') || 0)

  if (!name || !phone || !Number.isInteger(participants) || participants < 1) {
    return NextResponse.json({ error: 'Please provide valid booking details.' }, { status: 400 })
  }

  const amount = participants * upcomingWorkshop.pricePerPerson
  const note = `Maria Workshop ${upcomingWorkshop.date} ${name}`
  const upi = new URL('upi://pay')
  upi.searchParams.set('pa', UPI_ID)
  upi.searchParams.set('pn', PAYEE_NAME)
  upi.searchParams.set('am', String(amount))
  upi.searchParams.set('cu', 'INR')
  upi.searchParams.set('tn', note)

  return NextResponse.json({
    ok: true,
    booking: { name, phone, email, participants, amount, status: 'pending_payment' },
    payment: { method: 'upi', deepLink: upi.toString(), upiId: UPI_ID },
    message: 'Continue to your UPI app. The booking remains pending until Maria verifies the payment.',
  })
}

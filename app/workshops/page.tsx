'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Copy, MapPin, ShieldCheck, Loader2 } from 'lucide-react'
import { workshopCurriculum, upcomingWorkshop } from '@/lib/maria-business'
import { Reveal } from '@/app/_components/ui/Reveal'

export default function WorkshopPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [people, setPeople] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [payment, setPayment] = useState<{ deepLink: string; upiId: string; amount: number } | null>(null)

  const total = useMemo(() => Math.max(1, people) * upcomingWorkshop.pricePerPerson, [people])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setBusy(true)
    setError('')
    try {
      const form = new FormData()
      form.set('name', name)
      form.set('phone', phone)
      form.set('email', email)
      form.set('participants', String(people))
      const res = await fetch('/api/workshops/book', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not reserve your spot')
      setPayment({ deepLink: data.payment.deepLink, upiId: data.payment.upiId, amount: data.booking.amount })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reserve your spot')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="bg-[#fbf8f3]">
      {/* HERO */}
      <section className="relative w-full h-[70vh] min-h-[480px] flex items-center overflow-hidden bg-wine-950">
        <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover opacity-45">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-wine-950 via-wine-950/85 to-wine-950/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-5">
          <span className="text-champagne-300 font-semibold text-xs uppercase tracking-[0.3em] glass-dark px-4 py-1.5 rounded-full border border-champagne-400/40 inline-block">
            Every Sunday · Bengaluru
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-white leading-tight">
            Create a fragrance that is <span className="gold-text-gradient font-semibold">entirely yours</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
            ₹{upcomingWorkshop.pricePerPerson.toLocaleString('en-IN')} per person. Learn perfume basics, fragrance notes and blending, then create your personal fragrance and take it home.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-champagne-300">
            <MapPin className="h-3.5 w-3.5" /> {upcomingWorkshop.location} · Next session {upcomingWorkshop.date} at {upcomingWorkshop.time}
          </div>
          <a href="#reserve" className="inline-flex items-center gap-2 gold-button-gradient text-wine-950 px-7 py-3.5 rounded-full shadow-xl hover:scale-105 transition text-xs font-bold uppercase tracking-wider">
            Reserve Your Seat <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
        <Reveal className="text-center max-w-xl mx-auto space-y-3 mb-14">
          <span className="text-champagne-600 font-semibold text-xs uppercase tracking-[0.2em]">Workshop Journey</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wine-950">What you'll experience</h2>
        </Reveal>
        <div className="space-y-4">
          {workshopCurriculum.map((step, i) => (
            <Reveal key={step} delay={i * 0.08}>
              <div className="flex items-center gap-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <span className="w-10 h-10 rounded-full wine-gradient text-champagne-300 font-serif font-bold flex items-center justify-center shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif font-semibold text-lg text-wine-950">{step}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section id="reserve" className="wine-gradient py-20 border-y border-champagne-500/20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <span className="text-champagne-400 font-semibold text-xs uppercase tracking-[0.2em]">Reserve Your Place</span>
            <h2 className="text-3xl font-serif font-bold text-white mt-2 mb-6">Sunday workshop booking</h2>
            {!payment ? (
              <form onSubmit={submit} className="space-y-4 text-xs">
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-champagne-400" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="WhatsApp / phone" className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-champagne-400" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (optional)" className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-champagne-400" />
                <input value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))} type="number" min="1" placeholder="Number of people" className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-champagne-400" />
                {error && <p className="text-rose-300">{error}</p>}
                <button disabled={busy} className="w-full flex items-center justify-center gap-2 gold-button-gradient text-wine-950 font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-md disabled:opacity-60">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Reserve · ₹{total.toLocaleString('en-IN')}
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-white">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                <span>Booking captured. Complete UPI payment and keep the transaction reference.</span>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-dark border border-champagne-400/30 rounded-3xl p-7 text-white">
              <span className="text-champagne-400 font-semibold text-xs uppercase tracking-[0.2em]">Payment</span>
              <h3 className="text-2xl font-serif font-bold mt-2 mb-3">UPI reservation</h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
                Pay the exact amount and keep your UTR/reference. Booking confirmation follows manual verification.
              </p>
              {payment ? (
                <>
                  <div className="flex items-center justify-between rounded-xl border border-white/15 p-4 mb-4">
                    <strong className="text-sm">{payment.upiId}</strong>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(payment.upiId)} className="text-champagne-300">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <a href={payment.deepLink} className="block text-center rounded-full border border-champagne-400/50 px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition">
                    Pay ₹{payment.amount.toLocaleString('en-IN')} via UPI
                  </a>
                </>
              ) : (
                <p className="text-xs text-slate-400 font-light">Your UPI payment link appears here once you submit the booking form.</p>
              )}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-6">
                <ShieldCheck className="h-3.5 w-3.5" /> Manual verification protects the booking flow.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="text-center py-10">
        <Link href="/" className="text-xs text-slate-500 hover:text-wine-800 transition">← Back to Maria Perfumes</Link>
      </div>
    </main>
  )
}

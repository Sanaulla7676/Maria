'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Copy, Loader2, MapPin, ShieldCheck } from 'lucide-react'
import { workshopCurriculum, upcomingWorkshop } from '@/lib/maria-business'

const HERO_IMAGE =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/a419dd78-f24b-4e0e-a04a-45b4f600034c.png'

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

      const res = await fetch('/api/workshops/book', {
        method: 'POST',
        body: form,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not reserve your spot')

      setPayment({
        deepLink: data.payment.deepLink,
        upiId: data.payment.upiId,
        amount: data.booking.amount,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reserve your spot')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#120000] text-white">
      <header className="sticky top-0 z-50 border-b border-[#f2cf80]/15 bg-[#120000]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="group shrink-0" aria-label="Maria Perfumes home">
            <div className="font-serif text-[25px] font-semibold leading-none tracking-[0.08em] text-[#f3d487]">
              MARIA
            </div>
            <div className="mt-1 text-[7px] font-bold uppercase tracking-[0.5em] text-white/70">
              PERFUMES
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              ['Overview', '#overview'],
              ['Experience', '#experience'],
              ['Workshop', '#workshop'],
              ['Reserve', '#reserve'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 transition hover:text-[#f3d487]"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#reserve"
            className="inline-flex items-center gap-2 rounded-full border border-[#f3d487]/60 bg-[#f3d487] px-5 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#250900] shadow-[0_8px_25px_rgba(243,212,135,.16)] transition hover:-translate-y-0.5 hover:bg-[#ffe6a8]"
          >
            Book Your Spot <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </header>

      <section id="overview" className="bg-[radial-gradient(circle_at_50%_15%,rgba(182,20,20,.18),transparent_28rem),linear-gradient(180deg,#1b0000_0%,#120000_100%)]">
        <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#f3d487]">Maria Perfumes · Workshop</p>
              <h1 className="mt-1 font-serif text-xl font-semibold text-white sm:text-2xl">
                Create. Blend. Experience.
              </h1>
            </div>
            <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/45 sm:flex">
              <MapPin className="h-3.5 w-3.5" />
              {upcomingWorkshop.location}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-[#f3d487]/20 bg-black shadow-[0_35px_100px_rgba(0,0,0,.38)]">
            <img
              src={HERO_IMAGE}
              alt="Maria Perfumes perfume making workshop"
              className="block aspect-[16/9] h-auto w-full object-cover"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120000]/55 to-transparent" />
            <a
              href="#reserve"
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-[#f3d487]/70 bg-[#f3d487] px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#250900] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffe6a8] sm:bottom-7 sm:left-7 sm:px-6"
            >
              Reserve Your Seat <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      <section id="experience" className="border-y border-[#f3d487]/10 bg-[#170000]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#f3d487]">Why this workshop</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.03] sm:text-5xl">
              Step away from the noise.
              <span className="block text-[#f3d487]">Make something yours.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
              Take a break from the usual rush and spend time exploring fragrance, blending notes and creating something personal in a relaxed, hands-on session.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Unwind', 'Slow down, sample scents and enjoy a creative experience away from the everyday rush.'],
              ['02', 'Learn & Blend', 'Follow guided steps, understand fragrance notes and blend your own composition.'],
              ['03', 'Take It Home', 'Bottle your finished creation and take your signature fragrance home with you.'],
            ].map(([number, title, copy]) => (
              <article key={number} className="rounded-[24px] border border-[#f3d487]/15 bg-gradient-to-br from-[#2b0707] to-[#170000] p-7 shadow-[0_20px_60px_rgba(0,0,0,.2)]">
                <div className="text-3xl font-serif font-semibold text-[#f3d487]">{number}</div>
                <h3 className="mt-8 font-serif text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-white/55">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="border-y border-[#f3d487]/10 bg-[#140000]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#f3d487]">Inside the experience</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] sm:text-5xl">
                A creative break,
                <span className="block text-[#f3d487]">made by you.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-white/60">
              You are guided from the first fragrance note to your final bottle. Explore different scents, learn how they work together, experiment with blends and leave with a perfume you created yourself.
            </p>
          </div>

          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01', 'Slow Down', 'Step away from the everyday rush and settle into a relaxed fragrance experience.'],
              ['02', 'Explore', 'Smell, compare and understand the character of different fragrance notes.'],
              ['03', 'Create', 'Follow guided blending steps and shape a fragrance around your own preferences.'],
              ['04', 'Keep It', 'Finish your personal perfume and take your creation home with you.'],
            ].map(([number, title, copy]) => (
              <article key={number} className="group rounded-[24px] border border-[#f3d487]/12 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#f3d487]/30 hover:bg-white/[0.055]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f3d487]/45 text-[10px] font-bold text-[#f3d487]">
                    {number}
                  </span>
                  <span className="h-px w-10 bg-[#f3d487]/30 transition-all duration-300 group-hover:w-16" />
                </div>
                <h3 className="mt-9 font-serif text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-white/50">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workshop" className="bg-[#100000]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#f3d487]">The session</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold text-white">From first note to final bottle.</h2>
            </div>
            <p className="max-w-md text-xs leading-6 text-white/45">
              A guided journey through the fundamentals of perfume creation, with room to experiment and make the final blend your own.
            </p>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-5">
            {workshopCurriculum.map((step, i) => {
              const details = [
                'Start with the foundations of perfume and how a fragrance is structured.',
                'Understand fragrance notes and how they influence the character of a scent.',
                'Learn how different notes can be combined into a balanced blend.',
                'Use what you have learned to create your own personal fragrance.',
                'Bottle the finished creation and take your own perfume home.',
              ][i]

              return (
                <div key={step} className="rounded-[20px] border border-[#f3d487]/12 bg-[#1d0505] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#f3d487]/30">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f3d487]/45 text-[10px] font-bold text-[#f3d487]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 min-h-12 font-serif text-lg font-semibold leading-tight text-white">{step}</h3>
                  <p className="mt-3 text-[11px] leading-5 text-white/45">{details}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>


      <section className="border-t border-[#f3d487]/10 bg-[#170000]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#f3d487]">Need to know</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl">Workshop FAQ.</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">
              The essentials, without making you read a novel before smelling a perfume.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              ['What happens in the workshop?', 'You learn perfume basics, understand fragrance notes, work through blending and create your own personal fragrance.'],
              ['Do I get to make my own perfume?', 'Yes. The workshop is built around guided creation, so your final fragrance is the blend you make during the session.'],
              ['Can I take my perfume home?', 'Yes. The final step of the workshop is to take your created perfume home with you.'],
              ['Where is the workshop held?', upcomingWorkshop.location],
              ['When is the next session?', upcomingWorkshop.day + ' · ' + upcomingWorkshop.date + ' · ' + upcomingWorkshop.time],
              ['What is the price?', '₹' + upcomingWorkshop.pricePerPerson.toLocaleString('en-IN') + ' per person.'],
            ].map(([question, answer]) => (
              <details key={question} className="group rounded-[22px] border border-[#f3d487]/12 bg-[#1d0505] px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold text-white">
                  {question}
                  <span className="text-xl font-light text-[#f3d487] transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-xl pt-4 text-xs leading-6 text-white/50">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="reserve" className="border-t border-[#f3d487]/10 bg-[#f7f1e7] text-[#24120c]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#8b5a25]">Reserve your place</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Your workshop.
                <span className="block text-[#9a651f]">Your fragrance.</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-black/60">
                {upcomingWorkshop.date} · {upcomingWorkshop.time} · {upcomingWorkshop.location}
              </p>

              {!payment ? (
                <form onSubmit={submit} className="mt-8 space-y-3">
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" className="w-full rounded-xl border border-black/10 bg-white px-5 py-3.5 text-sm text-black outline-none focus:border-[#b7894d] focus:ring-2 focus:ring-[#d8bb8b]/30" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="WhatsApp / phone" className="w-full rounded-xl border border-black/10 bg-white px-5 py-3.5 text-sm text-black outline-none focus:border-[#b7894d] focus:ring-2 focus:ring-[#d8bb8b]/30" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (optional)" className="w-full rounded-xl border border-black/10 bg-white px-5 py-3.5 text-sm text-black outline-none focus:border-[#b7894d] focus:ring-2 focus:ring-[#d8bb8b]/30" />
                  <input value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))} type="number" min="1" placeholder="Number of people" className="w-full rounded-xl border border-black/10 bg-white px-5 py-3.5 text-sm text-black outline-none focus:border-[#b7894d] focus:ring-2 focus:ring-[#d8bb8b]/30" />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button disabled={busy} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#24120c] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f3d487] shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Reserve · ₹{total.toLocaleString('en-IN')}
                  </button>
                </form>
              ) : (
                <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-600/20 bg-emerald-50 p-5 text-sm text-emerald-900">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span>Booking captured. Complete UPI payment and keep the transaction reference.</span>
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-[#24120c] p-7 text-white shadow-[0_30px_80px_rgba(36,18,12,.22)] sm:p-9">
              <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#f3d487]">Payment</p>
              <h3 className="mt-2 font-serif text-3xl font-semibold">UPI reservation</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Pay the exact amount and keep your UTR/reference. Booking confirmation follows manual verification.
              </p>

              {payment ? (
                <>
                  <div className="mt-7 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                    <strong className="text-sm">{payment.upiId}</strong>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(payment.upiId)} className="text-[#f3d487]">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <a href={payment.deepLink} className="mt-4 block rounded-full border border-[#f3d487]/55 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#f3d487] transition hover:bg-[#f3d487] hover:text-[#24120c]">
                    Pay ₹{payment.amount.toLocaleString('en-IN')} via UPI
                  </a>
                </>
              ) : (
                <p className="mt-7 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/45">
                  Your UPI payment link appears here once you submit the booking form.
                </p>
              )}

              <div className="mt-7 flex items-center gap-2 text-[11px] text-white/35">
                <ShieldCheck className="h-3.5 w-3.5" /> Manual verification protects the booking flow.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#f3d487]/10 bg-[#120000]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <div className="font-serif text-lg text-[#f3d487]">MARIA</div>
            <div className="text-[7px] uppercase tracking-[0.45em] text-white/35">PERFUMES</div>
          </div>
          <Link href="/" className="text-xs text-white/45 transition hover:text-white">← Back to Maria Perfumes</Link>
        </div>
      </footer>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { Reveal } from '@/app/_components/ui/Reveal'
import { TiltCard } from '@/app/_components/ui/TiltCard'

const cards = [
  { title: 'Return Gift Counters', body: 'Elegant, customized return gifts with premium scents.' },
  { title: 'Live Custom Blending', body: 'Create a signature fragrance with our experts.' },
  { title: 'Weddings & Receptions', body: 'A royal scent experience for your big day.' },
  { title: 'Birthdays & Galas', body: 'Make every celebration unforgettable.' },
]

export function EditorialEventsTeaser() {
  return (
    <section id="event-stalls-section" className="editorial relative overflow-hidden text-white min-h-[470px]" style={{ background: '#2b1a0f' }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(36,20,7,.92), rgba(36,20,7,.45), rgba(36,20,7,.18)), radial-gradient(circle at 70% 32%, rgba(226,187,106,.35) 0 13%, transparent 14%), linear-gradient(135deg, #6d4827, #241710 60%, #6f4b2a)',
        }}
      />
      <div className="relative z-10 min-h-[470px] px-[5vw] py-20 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-11 items-end">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: '#e9c98d' }}>
            Scents for life&rsquo;s special moments
          </div>
          <h2 className="font-editorial-serif" style={{ fontWeight: 500, fontSize: 'clamp(38px,5vw,70px)', lineHeight: 0.87 }}>
            Live Fragrance
            <br />
            Stalls &amp; Return Gifts
          </h2>
          <p className="max-w-[510px] mt-4 text-sm leading-[1.7]" style={{ color: 'rgba(255,255,255,.82)' }}>
            From weddings and birthdays to corporate events, we create memorable fragrance experiences tailored just for you.
          </p>
          <Link
            href="/events"
            className="inline-block mt-6 px-6 py-4 rounded-full text-[10px] uppercase tracking-[0.08em] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#c59a50,#8b641d)' }}
          >
            Book Your Event Stall →
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <TiltCard max={3} className="p-[18px] min-h-[130px]" style={{ border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(7px)' }}>
                <b className="block font-editorial-serif mb-2" style={{ fontWeight: 500, fontSize: 24, lineHeight: 1.05 }}>{c.title}</b>
                <span className="text-[10px] leading-[1.45]" style={{ color: 'rgba(255,255,255,.8)' }}>{c.body}</span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

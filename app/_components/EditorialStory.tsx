'use client'

import { Reveal } from '@/app/_components/ui/Reveal'

const features = [
  { title: 'Premium Quality', body: 'Refined materials and careful finishing.' },
  { title: 'Long Lasting', body: 'Concentrated fragrances for lasting wear.' },
  { title: 'Every Occasion', body: 'From everyday rituals to celebrations.' },
  { title: 'Pure Attars', body: 'Attars & oils curated for depth.' },
]

export function EditorialStory() {
  return (
    <section id="about-section" className="editorial grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
      <div
        className="editorial-sheen relative overflow-hidden min-h-[320px]"
        style={{ background: 'linear-gradient(135deg,#6a451f,#2a190d 55%,#9e6a2c)' }}
      >
        <div
          className="absolute"
          style={{
            inset: '15% 15% 14% 8%',
            background:
              'radial-gradient(circle at 44% 39%, rgba(253,236,203,.9) 0 6%, transparent 7%), radial-gradient(circle at 66% 42%, rgba(220,149,48,.48) 0 9%, transparent 10%), linear-gradient(160deg, rgba(255,255,255,.06), rgba(0,0,0,.23))',
            filter: 'blur(1px)',
          }}
        />
        <Reveal className="absolute left-[7%] top-[8%] text-white max-w-[270px]">
          <div className="text-[9px] uppercase tracking-[0.28em] opacity-80">Crafted with nature. Perfected by art.</div>
          <h3 className="font-editorial-serif my-4" style={{ fontWeight: 500, fontSize: 44, lineHeight: 0.9 }}>
            The Maria
            <br />
            Difference
          </h3>
          <a href="#matches-section" className="text-[11px] uppercase tracking-[0.1em]" style={{ color: '#e7c992' }}>
            Our ingredients →
          </a>
        </Reveal>
      </div>

      <div className="p-8 sm:p-12 grid gap-7" style={{ background: '#f8f3e9' }}>
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.34em] mb-3" style={{ color: '#765020' }}>The Maria difference</div>
          <h3 className="font-editorial-serif" style={{ fontWeight: 500, fontSize: 'clamp(32px,4vw,52px)', lineHeight: 0.92 }}>
            Made to feel <em className="not-italic">beautiful.</em>
          </h3>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {features.map((f, i) => (
              <div key={f.title} className="pt-4 text-[11px] leading-[1.45]" style={{ borderTop: '1px solid var(--editorial-line)', color: '#5b5247', transitionDelay: `${i * 60}ms` }}>
                <b className="block text-[13px] mb-1.5" style={{ color: '#17130e' }}>{f.title}</b>
                {f.body}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="pl-6 flex items-center" style={{ borderLeft: '1px solid var(--editorial-line)' }}>
          <div>
            <p className="font-editorial-serif italic m-0" style={{ fontSize: 28, lineHeight: 1 }}>
              &ldquo;Perfume is the art that makes memory speak.&rdquo;
            </p>
            <span className="block mt-4 text-[9px] uppercase tracking-[0.16em]" style={{ color: '#7a5625' }}>— Maria Perfumes</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

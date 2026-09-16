'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const FRAME_COUNT = 72
const frameUrl = (i: number) => `/hero-frames/frame-${String(i + 1).padStart(3, '0')}.jpg`

export function ScrollScrubHero({ productCount }: { productCount: number }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const currentFrame = useRef(-1)
  const [progressPct, setProgressPct] = useState(0)
  const [step, setStep] = useState('01')
  const [endFade, setEndFade] = useState(0)
  const [copyOpacity, setCopyOpacity] = useState(1)

  useEffect(() => {
    // Preload every frame once so scrubbing never shows a blank/flash.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameUrl(i)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const img = imgRef.current
    if (!hero || !img) return

    const draw = (i: number) => {
      i = Math.max(0, Math.min(FRAME_COUNT - 1, i))
      if (i === currentFrame.current) return
      currentFrame.current = i
      img.src = frameUrl(i)
      const p = i / (FRAME_COUNT - 1)
      img.style.transform = `scale(${1.04 - p * 0.03})`
      setProgressPct(p * 100)
      setStep(String(Math.min(3, Math.floor(p * 3) + 1)).padStart(2, '0'))
    }

    const update = () => {
      const rect = hero.getBoundingClientRect()
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, -rect.top / travel))
      draw(Math.round(p * (FRAME_COUNT - 1)))

      const start = 0.88
      const t = Math.min(1, Math.max(0, (p - start) / (1 - start)))
      const eased = t * t * (3 - 2 * t)
      setEndFade(eased)
      setCopyOpacity(Math.max(0, 1 - t * 1.2))
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section id="video-hero" ref={heroRef} className="relative" style={{ height: '210vh' }}>
      <div className="sticky top-0 h-screen min-h-[560px] overflow-hidden bg-[#191d22]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            alt="Maria Perfumes"
            className="h-full w-full object-cover opacity-100 transition-transform duration-700 ease-out"
            style={{ filter: 'saturate(0.92) contrast(0.98)' }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(244,237,225,.96) 0%, rgba(244,237,225,.80) 29%, rgba(244,237,225,.18) 60%, rgba(20,16,11,.04) 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-[8] pointer-events-none"
          style={{
            background: 'var(--editorial-paper, #f8f4ec)',
            opacity: endFade,
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[18%]"
            style={{ background: 'linear-gradient(to bottom, rgba(247,243,235,0), rgba(247,243,235,.55) 55%, var(--editorial-paper, #f8f4ec))' }}
          />
        </div>

        <div className="relative z-[2] h-full flex items-center px-[6vw]" style={{ opacity: copyOpacity }}>
          <div className="max-w-[560px]">
            <div className="text-[10px] uppercase tracking-[0.34em] mb-4" style={{ color: '#6f4a1d' }}>
              More than a scent
            </div>
            <h1
              className="font-serif m-0"
              style={{ fontWeight: 500, fontSize: 'clamp(52px,7vw,108px)', lineHeight: 0.86, letterSpacing: '-0.05em', color: '#17130e' }}
            >
              A Feeling
              <br />
              That <em className="not-italic" style={{ color: '#77511f' }}>Stays</em>
            </h1>
            <p className="max-w-[530px] mt-6 text-[15px] leading-[1.7]" style={{ color: '#352d24' }}>
              Luxury fragrances, designer-inspired perfumes and pure attars — crafted to leave a lasting impression.
            </p>
            <div className="flex gap-3.5 flex-wrap mt-7">
              <a href="#matches-section" className="px-6 py-4 rounded-full text-[11px] font-medium" style={{ background: '#151310', color: '#fff' }}>
                Explore Collection →
              </a>
              <Link href="/events" className="px-6 py-4 rounded-full text-[11px] font-medium" style={{ border: '1px solid rgba(28,23,16,.24)', background: 'rgba(255,255,255,.18)' }}>
                Discover Our Story
              </Link>
            </div>
            <div className="flex gap-5 flex-wrap mt-8">
              {[
                ['40%', 'Pure Oil Concentration'],
                [String(productCount), 'Fragrances Curated'],
                ['4.7 ★', 'Google Reviews'],
                ['∞', 'Moments Remembered'],
              ].map(([b, label], i, arr) => (
                <div key={label} className="pr-5" style={{ borderRight: i === arr.length - 1 ? 'none' : '1px solid rgba(35,28,19,.18)', minWidth: 90 }}>
                  <b className="block font-serif" style={{ fontWeight: 600, fontSize: 27, lineHeight: 1 }}>{b}</b>
                  <span className="block mt-1.5 text-[9px] uppercase tracking-[0.11em] leading-tight" style={{ color: '#62584c' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="hidden md:block absolute right-[5vw] top-1/4 z-[3] w-[125px] text-center text-[9px] leading-[1.55] uppercase tracking-[0.27em]"
          style={{ color: '#533a20', opacity: copyOpacity }}
        >
          Fragrance
          <br />
          lives longer
          <br />
          than words
          <span className="block w-[42px] h-px mx-auto mt-3.5" style={{ background: '#8b6735' }} />
        </div>

        <div
          className="absolute right-[5vw] bottom-8 z-[3] flex items-center gap-2.5 text-[9px] tracking-[0.08em]"
          style={{ color: '#4c4338', opacity: copyOpacity }}
        >
          <span>{step}</span>
          <div className="w-[72px] h-px relative" style={{ background: 'rgba(42,35,26,.32)' }}>
            <span className="absolute left-0 top-0 h-px" style={{ width: `${progressPct}%`, background: '#2a1e11' }} />
          </div>
          <span>03</span>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, GlassWater, GraduationCap, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const stages = [
  {
    eyebrow: 'The Collection',
    title: 'Signature Fragrances',
    body: '40% pure-oil perfumes crafted for lasting wear — designer-inspired, boutique-priced, made in Kammanahalli.',
    icon: Sparkles,
    href: '#matches-section',
    cta: 'Explore the Catalog',
    bg: 'from-wine-950 via-wine-900 to-wine-950',
  },
  {
    eyebrow: 'For Your Celebration',
    title: 'Live Event Stalls',
    body: 'A live fragrance bar at your wedding, birthday or corporate event — guests blend and take home their own scent.',
    icon: GlassWater,
    href: '/events',
    cta: 'Explore Event Stalls',
    bg: 'from-[#26050e] via-[#3d0c18] to-[#26050e]',
  },
  {
    eyebrow: 'Every Sunday',
    title: 'Perfume-Making Workshop',
    body: 'Learn fragrance notes and blending hands-on, then create and take home a fragrance that is entirely yours.',
    icon: GraduationCap,
    href: '/workshops',
    cta: 'Explore the Workshop',
    bg: 'from-[#150106] via-[#26050e] to-[#150106]',
  },
]

export function PillarsStory() {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<HTMLDivElement[]>([])
  const smokeRefs = useRef<HTMLDivElement[]>([])
  const dotRefs = useRef<HTMLSpanElement[]>([])

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const panels = panelRefs.current
      const count = panels.length

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${(count - 1) * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Horizontal march of the whole track
      tl.to(track.current, { xPercent: -100 * (count - 1), ease: 'none' }, 0)

      // Smoke-puff dissolve at each hand-off: outgoing panel blurs+fades,
      // a soft champagne "puff" blooms and clears, incoming panel sharpens in.
      panels.forEach((_, i) => {
        if (i === count - 1) return
        const at = i
        tl.to(panels[i], { filter: 'blur(18px)', opacity: 0.15, scale: 1.06, ease: 'power1.in', duration: 0.5 }, at + 0.55)
        tl.fromTo(smokeRefs.current[i], { opacity: 0, scale: 0.6 }, { opacity: 0.9, scale: 1.6, ease: 'power1.out', duration: 0.5 }, at + 0.6)
        tl.to(smokeRefs.current[i], { opacity: 0, scale: 2.1, ease: 'power1.in', duration: 0.45 }, at + 0.95)
        tl.fromTo(panels[i + 1], { filter: 'blur(18px)', opacity: 0.15, scale: 1.06 }, { filter: 'blur(0px)', opacity: 1, scale: 1, ease: 'power2.out', duration: 0.5 }, at + 0.85)
        tl.to(dotRefs.current[i], { backgroundColor: 'rgba(212,175,55,0.35)', duration: 0.2 }, at + 0.5)
        tl.to(dotRefs.current[i + 1], { backgroundColor: 'rgba(212,175,55,1)', duration: 0.2 }, at + 0.9)
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100dvh] w-full overflow-hidden bg-wine-950">
      <div ref={track} className="flex h-full" style={{ width: `${stages.length * 100}%` }}>
        {stages.map((stage, i) => {
          const Icon = stage.icon
          return (
            <div
              key={stage.title}
              ref={(el) => { if (el) panelRefs.current[i] = el }}
              className={`relative h-full shrink-0 flex items-center justify-center bg-gradient-to-br ${stage.bg}`}
              style={{ width: `${100 / stages.length}%` }}
            >
              <div
                ref={(el) => { if (el) smokeRefs.current[i] = el }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
                style={{ mixBlendMode: 'screen' }}
              >
                <div className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-champagne-400/40 blur-[80px]" />
              </div>

              <div className="relative z-10 max-w-2xl text-center px-6">
                <div className="w-20 h-20 rounded-full gold-button-gradient text-wine-950 flex items-center justify-center mx-auto mb-7 shadow-2xl">
                  <Icon className="h-9 w-9" />
                </div>
                <p className="text-champagne-400 text-xs uppercase tracking-[0.4em] font-semibold mb-4">{stage.eyebrow}</p>
                <h2 className="text-5xl sm:text-7xl font-serif font-bold text-white leading-tight mb-6">{stage.title}</h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">{stage.body}</p>
                <Link
                  href={stage.href}
                  className="inline-flex items-center gap-2.5 gold-button-gradient text-wine-950 px-9 py-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition"
                >
                  {stage.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <span className="absolute bottom-8 right-8 text-champagne-400/60 font-serif text-sm">
                {String(i + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
              </span>
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {stages.map((stage, i) => (
          <span
            key={stage.title}
            ref={(el) => { if (el) dotRefs.current[i] = el }}
            className="w-10 h-1.5 rounded-full"
            style={{ backgroundColor: i === 0 ? 'rgba(212,175,55,1)' : 'rgba(212,175,55,0.35)' }}
          />
        ))}
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-champagne-300/70 text-[10px] uppercase tracking-[0.3em] animate-pulse">
        Scroll to explore
      </div>
    </section>
  )
}

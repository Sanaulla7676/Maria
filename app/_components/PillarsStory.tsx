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
    cta: 'Plan Your Event',
    bg: 'from-[#26050e] via-[#3d0c18] to-[#26050e]',
  },
  {
    eyebrow: 'Every Sunday',
    title: 'Perfume-Making Workshop',
    body: 'Learn fragrance notes and blending hands-on, then create and take home a fragrance that is entirely yours.',
    icon: GraduationCap,
    href: '/workshops',
    cta: 'Reserve Your Seat',
    bg: 'from-[#150106] via-[#26050e] to-[#150106]',
  },
]

export function PillarsStory() {
  const root = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<HTMLDivElement[]>([])
  const dotRefs = useRef<HTMLButtonElement[]>([])

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const panels = panelRefs.current
      gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 })
      gsap.set(dotRefs.current.slice(1), { opacity: 0.35 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${panels.length * 100}%`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      })

      panels.forEach((panel, i) => {
        if (i === 0) return
        tl.to(panels[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 }, i)
        tl.to(panel, { autoAlpha: 1, y: 0, duration: 0.4 }, i)
        tl.to(dotRefs.current[i - 1], { opacity: 0.35, duration: 0.2 }, i)
        tl.to(dotRefs.current[i], { opacity: 1, duration: 0.2 }, i)
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden bg-wine-950">
      {stages.map((stage, i) => {
        const Icon = stage.icon
        return (
          <div
            key={stage.title}
            ref={(el) => { if (el) panelRefs.current[i] = el }}
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${stage.bg}`}
          >
            <div className="max-w-2xl text-center px-6">
              <div className="w-16 h-16 rounded-full gold-button-gradient text-wine-950 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Icon className="h-7 w-7" />
              </div>
              <p className="text-champagne-400 text-xs uppercase tracking-[0.35em] font-semibold mb-3">{stage.eyebrow}</p>
              <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight mb-5">{stage.title}</h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">{stage.body}</p>
              <Link
                href={stage.href}
                className="inline-flex items-center gap-2.5 gold-button-gradient text-wine-950 px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition"
              >
                {stage.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )
      })}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {stages.map((stage, i) => (
          <button
            key={stage.title}
            ref={(el) => { if (el) dotRefs.current[i] = el }}
            aria-label={stage.title}
            className="w-8 h-1.5 rounded-full bg-champagne-400"
          />
        ))}
      </div>
    </section>
  )
}

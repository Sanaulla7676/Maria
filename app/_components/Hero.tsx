'use client'

import { useState } from 'react'
import { Sparkles, Store, MapPin, Droplet, Star } from 'lucide-react'
import { useUI } from '@/app/_components/ui/UIProvider'

const slides = [
  {
    headline: (
      <>
        Maria <span className="gold-text-gradient font-semibold">Perfumes</span>
      </>
    ),
    subtext:
      'Discover luxury fragrances, designer-inspired perfumes, & pure attars. Impressive longevity, unbeatable value, and rich lingering notes in Kammanahalli.',
    cta: { label: 'Explore Fragrance Catalog', icon: Sparkles, action: 'scroll' as const, target: '#matches-section' },
  },
  {
    headline: (
      <>
        Live Fragrance <span className="gold-text-gradient font-semibold">Event Stalls</span>
      </>
    ),
    subtext:
      'Elevate Marriage Functions, Birthday Parties & Corporate Celebrations with Live Scent Blending Bars & Custom Perfume Return Gifts for Guests!',
    cta: { label: 'Book Live Event Stall', icon: Store, action: 'booking' as const },
  },
  {
    headline: (
      <>
        Pure Non-Alcoholic <span className="gold-text-gradient font-semibold">Attars</span>
      </>
    ),
    subtext:
      'Concentrated perfume oils crafted from pure Sandalwood, Royal Musk, and Oud — a 40% pure-oil formulation designed to last.',
    cta: { label: 'View Pure Attars', icon: Droplet, action: 'scroll' as const, target: '#matches-section' },
  },
  {
    headline: (
      <>
        4.7 ★ Rated <span className="gold-text-gradient font-semibold">On Google</span>
      </>
    ),
    subtext:
      'Read real verified customer reviews praising our affordable luxury alternatives, long scent projection, and warm event hospitality.',
    cta: { label: 'View Customer Reviews', icon: Star, action: 'scroll' as const, target: '#success-stories' },
  },
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const { open } = useUI()
  const slide = slides[index]
  const Icon = slide.cta.icon

  const handleCta = () => {
    if (slide.cta.action === 'booking') return open({ name: 'booking' })
    document.querySelector(slide.cta.target!)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="video-hero" className="relative w-full h-[calc(100vh-64px)] flex items-center overflow-hidden bg-wine-950">
      <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover opacity-50 z-0">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-wine-950 via-wine-950/80 to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 w-full flex flex-col justify-center items-start text-left">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-3 transition-all duration-500" style={{ opacity: 1 }}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-white tracking-wide leading-tight">
              {slide.headline}
            </h1>
            <p className="text-sm sm:text-base font-light text-slate-300 leading-relaxed tracking-wide font-sans">
              {slide.subtext}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4 text-xs uppercase tracking-wider font-bold">
            <button
              onClick={handleCta}
              className="gold-button-gradient text-wine-950 px-7 py-3.5 rounded-full shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:scale-105 transition-all duration-300 flex items-center gap-2.5"
            >
              <Icon className="h-3.5 w-3.5" /> {slide.cta.label}
            </button>

            <button
              onClick={() => open({ name: 'booking' })}
              className="glass-dark text-white px-7 py-3.5 rounded-full border border-champagne-400/50 hover:border-champagne-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:bg-wine-900/90 transition-all duration-300 flex items-center gap-2.5"
            >
              <Store className="h-3.5 w-3.5 text-champagne-400" /> Book Event Fragrance Stall
            </button>

            <a
              href="https://maps.google.com/?q=Maria+Perfumes+Kammanahalli+Bengaluru"
              target="_blank"
              rel="noreferrer"
              className="glass-dark text-slate-200 px-6 py-3.5 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <MapPin className="h-3.5 w-3.5 text-champagne-400" /> Kammanahalli Store
            </a>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center gap-2.5 text-[11px] uppercase tracking-widest font-semibold text-slate-400 flex-wrap">
            <span className="text-champagne-400 text-[10px] tracking-widest">Fragrance Highlights:</span>
            {['Catalog', 'Event Stalls', 'Scent Matcher', 'Reviews'].map((label, i) => (
              <button
                key={label}
                onClick={() => setIndex(i)}
                className={`px-3 py-1 rounded-full border transition ${
                  i === index
                    ? 'border-champagne-500 text-champagne-300 bg-white/10'
                    : 'border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {String(i + 1).padStart(2, '0')} {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

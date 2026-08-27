'use client'

import { Gift, SprayCan, Gem, Cake } from 'lucide-react'
import { useUI } from '@/app/_components/ui/UIProvider'

const pillars = [
  { icon: Gift, title: 'Return Gift Counters', body: 'Delight your guests with elegant, custom-monogrammed perfume return gift bottles filled with long-lasting designer scents or pure attars.' },
  { icon: SprayCan, title: 'Live Custom Blending', body: "Our expert Scent Artisans blend custom perfume notes live at the stall according to each guest's individual scent preference." },
  { icon: Gem, title: 'Weddings & Receptions', body: 'Add a luxurious Royal Scent Experience to wedding receptions, Sangeet functions, and Haldi celebrations for a royal touch.' },
  { icon: Cake, title: 'Birthdays & Galas', body: 'Make milestone birthdays, anniversary galas, and corporate celebrations unforgettable with fragrant live return favors.' },
]

export function EventStallsSection() {
  const { open } = useUI()

  return (
    <section
      id="event-stalls-section"
      className="relative w-full min-h-[70vh] flex items-center justify-center py-20 overflow-hidden bg-wine-950 border-b border-champagne-500/20"
    >
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-champagne-300 font-semibold text-xs uppercase tracking-[0.3em] glass-dark px-4 py-1.5 rounded-full border border-champagne-400/40 inline-block shadow-xl">
            Premium Event Attraction
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-normal text-white leading-tight">
            Live Fragrance Stalls &amp; <span className="gold-text-gradient font-semibold">Return Gift Bars</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Just like live ice cream counters or fruit stalls,{' '}
            <strong className="text-champagne-300 font-semibold">Maria Perfumes</strong> sets up a captivating Live
            Fragrance Stall at Marriages, Birthday Parties, Anniversaries, and Corporate Events. Guests experience
            live scent bar blending and receive personalized, luxury perfume return gifts right on the spot!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-left">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="p-6 rounded-3xl glass-dark border border-champagne-400/30 space-y-3 hover:border-champagne-400 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl gold-button-gradient text-wine-950 flex items-center justify-center text-xl shadow-lg">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">{title}</h3>
              <p className="text-slate-300 font-light leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => open({ name: 'booking' })}
            className="gold-button-gradient text-wine-950 px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition duration-300 flex items-center gap-2"
          >
            Reserve Live Event Stall Counter
          </button>
          <a
            href="tel:+919916032291"
            className="glass-dark border border-champagne-400/50 text-white hover:bg-wine-900 px-8 py-4 rounded-full transition flex items-center gap-2"
          >
            Event Helpline: +91 99160 32291
          </a>
        </div>
      </div>
    </section>
  )
}

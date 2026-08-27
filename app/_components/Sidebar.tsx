'use client'

import { ShieldCheck, Sparkles } from 'lucide-react'
import { useUI } from '@/app/_components/ui/UIProvider'

export function Sidebar({
  bestSellersOnly,
  setBestSellersOnly,
}: {
  bestSellersOnly: boolean
  setBestSellersOnly: (v: boolean) => void
}) {
  const { open } = useUI()

  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-center relative overflow-hidden">
        <div className="bg-champagne-100 text-champagne-700 text-[10px] font-bold py-1 px-3 absolute top-0 right-0 rounded-bl-xl uppercase tracking-wider">
          Maria Fragrance
        </div>
        <div className="relative inline-block mt-2">
          <div className="w-20 h-20 rounded-full mx-auto wine-gradient flex items-center justify-center ring-4 ring-champagne-200 shadow-md">
            <span className="font-serif text-champagne-300 font-bold text-2xl">MP</span>
          </div>
          <span className="absolute bottom-0 right-0 bg-emerald-500 ring-2 ring-white w-4 h-4 rounded-full" />
        </div>
        <h3 className="font-serif font-bold text-lg text-slate-900 mt-3">Kammanahalli Boutique</h3>
        <p className="text-xs text-slate-500">Shop No. 55, Ramaiah Layout</p>

        <div className="mt-5 text-left border-t border-slate-100 pt-4">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Customer Satisfaction</span>
            <span className="text-wine-800 font-bold">98%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-wine-800 h-2 rounded-full" style={{ width: '98%' }} />
          </div>
          <button
            onClick={() => open({ name: 'guarantee' })}
            className="text-[11px] text-wine-800 font-semibold mt-2.5 hover:underline flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Quality &amp; Authenticity Guarantee
          </button>
        </div>
      </div>

      <div className="bg-wine-50 rounded-2xl p-5 border border-wine-100 space-y-3">
        <div className="flex items-center gap-2 text-wine-900 font-serif font-bold text-base">
          Event Return Gifts
        </div>
        <p className="text-xs text-slate-600 font-light leading-relaxed">
          Planning a Marriage, Birthday or Corporate Gala? Book a live perfume bar for custom favors.
        </p>
        <button
          onClick={() => open({ name: 'booking' })}
          className="w-full bg-wine-900 hover:bg-wine-950 text-white font-semibold text-xs py-2.5 rounded-xl transition"
        >
          Book Event Stall
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h4 className="font-serif font-bold text-base text-wine-950">Refine Collection</h4>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={bestSellersOnly}
            onChange={(e) => setBestSellersOnly(e.target.checked)}
            className="rounded text-wine-800 focus:ring-wine-600"
          />
          Best-Sellers Only
        </label>
      </div>

      <div className="wine-gradient rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-champagne-400/30">
        <Sparkles className="text-champagne-400/10 h-24 w-24 absolute -bottom-4 -right-4" />
        <h5 className="font-serif font-bold text-lg text-champagne-400">Maria Atelier VIP</h5>
        <p className="text-xs text-slate-300 font-light mt-1.5 leading-relaxed">
          Custom scent blending &amp; personalized fragrance consultations directly at our Kammanahalli store.
        </p>
        <button
          onClick={() => open({ name: 'packages' })}
          className="mt-5 gold-button-gradient text-wine-950 font-bold text-xs px-4 py-3 rounded-xl shadow-lg hover:opacity-95 transition w-full uppercase tracking-wider"
        >
          Book Scent Specialist
        </button>
      </div>
    </aside>
  )
}

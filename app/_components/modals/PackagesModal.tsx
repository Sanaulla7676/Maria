'use client'

import { Check } from 'lucide-react'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Modal } from '@/app/_components/ui/Modal'

export function PackagesModal() {
  const { modal, close, open } = useUI()
  const isOpen = modal?.name === 'packages'

  const goToBooking = (preset: string) => {
    close()
    open({ name: 'booking', preset })
  }

  return (
    <Modal open={isOpen} onClose={close} size="xl">
      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-wine-950">Maria Event Stalls &amp; Gifting Packages</h3>
          <p className="text-xs text-slate-500 mt-1">Marriage Return Gifts, Live Fragrance Bar &amp; Custom Blending</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="border border-slate-200 rounded-2xl p-5 text-center hover:border-wine-800 transition">
            <h4 className="font-serif font-bold text-base text-slate-900">Party Return Gifts Pack</h4>
            <p className="text-2xl font-serif font-bold text-wine-900 my-3">
              Custom <span className="text-[10px] font-sans font-normal text-slate-400">/ Bulk Favors</span>
            </p>
            <ul className="text-slate-600 space-y-2 text-left my-4 font-light">
              <li><Check className="inline h-3 w-3 text-emerald-600 mr-1.5" /> Custom Name Bottle Print</li>
              <li><Check className="inline h-3 w-3 text-emerald-600 mr-1.5" /> Velvet Gift Pouching</li>
            </ul>
            <button
              onClick={() => goToBooking('Event Return Gifts Bulk Order')}
              className="w-full bg-wine-900 hover:bg-wine-950 text-white font-semibold py-2.5 rounded-xl transition"
            >
              Order Gifts
            </button>
          </div>

          <div className="border-2 border-champagne-500 rounded-2xl p-5 text-center bg-champagne-100/30 relative shadow-lg">
            <span className="gold-button-gradient text-wine-950 text-[9px] font-bold px-3 py-1 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 uppercase tracking-wider">
              MOST POPULAR
            </span>
            <h4 className="font-serif font-bold text-base text-champagne-700">Live Fragrance Stall</h4>
            <p className="text-2xl font-serif font-bold text-champagne-700 my-3">
              Full Setup <span className="text-[10px] font-sans font-normal text-slate-400">/ Weddings</span>
            </p>
            <ul className="text-slate-700 space-y-2 text-left my-4 font-light">
              <li><Check className="inline h-3 w-3 text-emerald-600 mr-1.5" /> Scent Artisan Live Bar</li>
              <li><Check className="inline h-3 w-3 text-emerald-600 mr-1.5" /> On-site Blended Favors</li>
            </ul>
            <button
              onClick={() => goToBooking('Live Fragrance Stall for Marriage / Wedding Reception')}
              className="w-full gold-button-gradient text-wine-950 font-bold py-2.5 rounded-xl uppercase tracking-wider transition"
            >
              Book Event Stall
            </button>
          </div>

          <div className="border border-wine-950 rounded-2xl p-5 text-center bg-wine-950 text-white shadow-xl">
            <h4 className="font-serif font-bold text-base text-champagne-400">VIP Wedding Box</h4>
            <p className="text-2xl font-serif font-bold text-white my-3">
              Royal Box <span className="text-[10px] font-sans font-normal text-slate-400">/ Premium</span>
            </p>
            <ul className="text-slate-300 space-y-2 text-left my-4 font-light">
              <li><Check className="inline h-3 w-3 text-champagne-400 mr-1.5" /> Pure Oud &amp; Attar Sets</li>
              <li><Check className="inline h-3 w-3 text-champagne-400 mr-1.5" /> Engraved Wooden Box</li>
            </ul>
            <button
              onClick={() => goToBooking('VIP Wedding Box Consultation')}
              className="w-full bg-champagne-500 hover:bg-champagne-600 text-wine-950 font-bold py-2.5 rounded-xl uppercase tracking-wider transition"
            >
              Inquire VIP
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

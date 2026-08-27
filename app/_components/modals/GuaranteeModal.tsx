'use client'

import { HeartHandshake } from 'lucide-react'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Modal } from '@/app/_components/ui/Modal'

export function GuaranteeModal() {
  const { modal, close } = useUI()
  const isOpen = modal?.name === 'guarantee'

  return (
    <Modal open={isOpen} onClose={close} size="sm">
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl mb-3">
          <HeartHandshake className="h-5 w-5" />
        </div>
        <h3 className="font-serif font-bold text-xl text-slate-900">100% Quality &amp; Longevity</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5 font-light">
          Skin-friendly, IFRA certified, premium perfume oils blended to perfection.
        </p>

        <div className="space-y-3 text-xs text-left">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block">High Oil Concentration</span>
            <span className="text-slate-500 text-[11px]">Ensures hours of linger on clothes and skin.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block">Live Event Stall Service</span>
            <span className="text-slate-500 text-[11px]">Bring high-end fragrance live blending to your wedding or birthday party guests.</span>
          </div>
          <button onClick={close} className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl mt-2 transition">
            Got It
          </button>
        </div>
      </div>
    </Modal>
  )
}

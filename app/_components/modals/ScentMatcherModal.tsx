'use client'

import { useMemo, useState } from 'react'
import { Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Modal } from '@/app/_components/ui/Modal'
import { AddToCartButton } from '@/app/_components/ui/AddToCartButton'
import type { Product } from '@/lib/types'
import { primaryImage, cheapestActiveVariant } from '@/lib/product-helpers'
import { addToCart } from '@/lib/cart-actions'

export function ScentMatcherModal({ products, isLoggedIn }: { products: Product[]; isLoggedIn: boolean }) {
  const { modal, close, open } = useUI()
  const isOpen = modal?.name === 'scent-matcher'

  const notes = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => (p.notes ?? []).forEach((n) => set.add(n)))
    return Array.from(set).sort()
  }, [products])

  const [selectedNote, setSelectedNote] = useState(notes[0] ?? '')
  const [match, setMatch] = useState<Product | null>(null)

  const runMatch = () => {
    const candidates = products.filter((p) => (p.notes ?? []).includes(selectedNote))
    const pool = candidates.length ? candidates : products
    const best = [...pool].sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)[0] ?? null
    setMatch(best)
  }

  const addMatchToBag = async () => {
    if (!match) return
    if (!isLoggedIn) {
      close()
      return open({ name: 'auth', mode: 'sign-in' })
    }
    const variant = cheapestActiveVariant(match)
    if (!variant || variant.stock <= 0) {
      toast.error('This fragrance is currently unavailable')
      throw new Error('unavailable')
    }
    try {
      await addToCart(match.id, variant.id, 1)
      toast.success(`${match.name} added to your bag`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not add to bag')
      throw e
    }
  }

  const handleClose = () => {
    setMatch(null)
    close()
  }

  return (
    <Modal open={isOpen} onClose={handleClose} size="sm">
      <div className="p-8 relative">
        <div className="text-center mb-6">
          <div className="w-12 h-12 gold-button-gradient text-wine-950 rounded-full flex items-center justify-center mx-auto text-xl mb-3 shadow-md">
            <Wand2 className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-wine-950">Fragrance Personality Matcher</h3>
          <p className="text-xs text-slate-500 mt-1">Maria Perfumes Note Recommendation Engine</p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Which note draws you in?</label>
            <select
              value={selectedNote}
              onChange={(e) => setSelectedNote(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs"
            >
              {notes.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <button
            onClick={runMatch}
            className="w-full gold-button-gradient text-wine-950 font-bold py-3.5 rounded-xl shadow-md hover:opacity-95 transition uppercase tracking-wider"
          >
            Find My Signature Fragrance
          </button>

          {match && (
            <div className="bg-champagne-100/60 border border-champagne-300 p-5 rounded-2xl text-center space-y-3 mt-4">
              <p className="text-xs font-semibold text-slate-700">Your Recommended Fragrance</p>
              {(() => {
                const image = primaryImage(match)
                return image ? (
                  <img src={image} alt={match.name} className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-champagne-400" />
                ) : null
              })()}
              <div className="text-xl font-serif font-bold text-wine-900">{match.name}</div>
              <p className="text-[11px] text-slate-600">
                {(match.notes ?? []).join(', ') || match.family}
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => { setMatch(null); close(); open({ name: 'product', product: match }) }}
                  className="bg-white border border-champagne-400 text-wine-900 text-[11px] px-4 py-2 rounded-lg font-semibold"
                >
                  View Fragrance
                </button>
                <AddToCartButton
                  onAdd={addMatchToBag}
                  idleLabel="Add to Bag"
                  className="text-[11px] px-4 py-2 rounded-lg font-semibold"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

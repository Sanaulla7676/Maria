'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Clock, Radar, Sun, Moon, Snowflake, Flower2, Leaf, Sparkles, Droplet, Wind, Flame } from 'lucide-react'
import { toast } from 'sonner'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Modal } from '@/app/_components/ui/Modal'
import { AddToCartButton } from '@/app/_components/ui/AddToCartButton'
import { primaryImage } from '@/lib/product-helpers'
import { addToCart } from '@/lib/cart-actions'

const noteIcons = [Sparkles, Leaf, Droplet, Flame, Wind, Star]

const seasons: { key: string; label: string; icon: typeof Snowflake; className: string }[] = [
  { key: 'Winter', label: 'Winter', icon: Snowflake, className: 'bg-sky-100 text-sky-700' },
  { key: 'Spring', label: 'Spring', icon: Flower2, className: 'bg-emerald-100 text-emerald-700' },
  { key: 'Summer', label: 'Summer', icon: Sun, className: 'bg-amber-100 text-amber-700' },
  { key: 'Autumn', label: 'Autumn', icon: Leaf, className: 'bg-orange-100 text-orange-700' },
]

export function ProductModal({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { modal, close, open } = useUI()
  const isOpen = modal?.name === 'product'
  const product = modal?.name === 'product' ? modal.product : null

  const variants = product?.product_variants?.filter((v) => v.active) ?? []
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const activeVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null

  if (!product) return <Modal open={isOpen} onClose={close} size="xl" children={null} />

  const image = activeVariant?.image_url || primaryImage(product)
  const hasAccords = product.main_accords?.length > 0
  const hasRating = product.review_count > 0
  const hasSeasons = product.best_season?.length > 0

  const handleOrder = async () => {
    if (!isLoggedIn) {
      close()
      return open({ name: 'auth', mode: 'sign-in' })
    }
    if (!activeVariant || activeVariant.stock <= 0) return
    try {
      await addToCart(product.id, activeVariant.id, 1)
      toast.success(`${product.name} added to your bag`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not add to bag')
      throw e
    }
  }

  return (
    <Modal open={isOpen} onClose={close} size="xl">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="max-h-[85vh] overflow-y-auto custom-scroll"
          >
            <div className="p-6 sm:p-9 pb-4">
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] uppercase tracking-[0.25em] text-champagne-600 font-semibold"
              >
                {product.family || 'Signature Perfume'}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-3xl sm:text-4xl font-serif font-bold text-wine-950 leading-tight mt-1"
              >
                {product.name}
              </motion.h2>
              <p className="text-xs text-slate-500 mt-1">Maria Perfumes · for {(product.gender || 'unisex').toLowerCase()}</p>

              {hasRating && (
                <div className="flex items-center gap-1.5 mt-3 text-sm">
                  <div className="flex text-champagne-500">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className="h-4 w-4" fill={n <= Math.round(product.rating) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-800">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-xs">({product.review_count})</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 sm:px-9 pb-8">
              {/* LEFT: bottle image + notes */}
              <div className="space-y-6">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={image || 'placeholder'}
                      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                      animate={{ clipPath: 'circle(75% at 50% 50%)' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className="absolute inset-0"
                    >
                      {image ? (
                        <img src={image} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full wine-gradient flex flex-col items-center justify-center text-champagne-200 gap-2">
                          <span className="font-serif text-2xl tracking-wide px-6 text-center">{product.name}</span>
                          <span className="text-[10px] uppercase tracking-widest text-champagne-400/80">Photo coming soon</span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-wine-950 mb-3">Notes</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(product.notes?.length ? product.notes : ['Signature Blend']).map((note, i) => {
                      const Icon = noteIcons[i % noteIcons.length]
                      return (
                        <motion.div
                          key={note}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.04 }}
                          className="flex flex-col items-center text-center gap-1.5 p-2"
                        >
                          <div className="w-12 h-12 rounded-full bg-champagne-100 text-champagne-700 flex items-center justify-center">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-[11px] font-medium text-slate-700 leading-tight">{note}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT: accords, profile, day/night, seasons, variants */}
              <div className="space-y-6 text-xs">
                {hasAccords && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-wine-950 mb-3">Main Accords</h4>
                    <div className="space-y-2">
                      {product.main_accords.map((accord, i) => (
                        <div key={accord.name} className="relative h-9 rounded-lg overflow-hidden bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.max(8, accord.percent))}%` }}
                            transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                            className="absolute inset-y-0 left-0 rounded-lg"
                            style={{ backgroundColor: accord.color }}
                          />
                          <span className="relative z-10 flex h-full items-center px-3 font-semibold text-white mix-blend-difference">
                            {accord.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(product.longevity_hours || product.sillage) && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-wine-950 mb-3">Fragrance Profile</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {product.longevity_hours && (
                        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
                          <Clock className="h-4 w-4 text-wine-800 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">{product.longevity_hours}h</div>
                            <div className="text-[10px] text-slate-500">Longevity</div>
                          </div>
                        </div>
                      )}
                      {product.sillage && (
                        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
                          <Radar className="h-4 w-4 text-wine-800 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">{product.sillage}</div>
                            <div className="text-[10px] text-slate-500">Sillage</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {product.best_daytime && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-wine-950 mb-3">Day / Night</h4>
                    <div className="flex h-9 rounded-lg overflow-hidden text-white font-semibold">
                      <motion.div
                        initial={{ flexGrow: 0 }}
                        animate={{ flexGrow: product.best_daytime === 'day' ? 3 : product.best_daytime === 'night' ? 1 : 1 }}
                        className="bg-sky-400 flex items-center justify-center gap-1.5"
                      >
                        <Sun className="h-3.5 w-3.5" /> Day
                      </motion.div>
                      <motion.div
                        initial={{ flexGrow: 0 }}
                        animate={{ flexGrow: product.best_daytime === 'night' ? 3 : product.best_daytime === 'day' ? 1 : 1 }}
                        className="bg-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <Moon className="h-3.5 w-3.5" /> Night
                      </motion.div>
                    </div>
                  </div>
                )}

                {hasSeasons && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-wine-950 mb-3">Seasons</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {seasons.map((s) => {
                        const active = product.best_season.includes(s.key)
                        const Icon = s.icon
                        return (
                          <div
                            key={s.key}
                            className={`flex items-center gap-2 rounded-xl p-2.5 font-semibold transition ${
                              active ? s.className : 'bg-slate-50 text-slate-300'
                            }`}
                          >
                            <Icon className="h-4 w-4" /> {s.label}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {variants.length > 0 && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-wine-950 mb-3">Choose a Variant</h4>
                    <div className="flex flex-wrap gap-2.5 mb-3">
                      {variants.map((v) => {
                        const isActive = (activeVariant?.id ?? variants[0]?.id) === v.id
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariantId(v.id)}
                            disabled={v.stock <= 0}
                            title={v.size_ml ? `${v.size_ml}ml` : v.label}
                            className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 transition disabled:opacity-30 ring-offset-2 ${
                              isActive ? 'ring-2 ring-wine-800' : 'ring-1 ring-slate-200 hover:ring-wine-300'
                            }`}
                          >
                            {v.image_url ? (
                              <img src={v.image_url} alt={v.label} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full wine-gradient flex items-center justify-center text-champagne-200 text-[10px] font-bold">
                                {v.size_ml ? `${v.size_ml}` : v.label.charAt(0)}
                              </div>
                            )}
                            {v.stock <= 0 && <span className="absolute inset-0 bg-white/60" />}
                          </button>
                        )
                      })}
                    </div>
                    <AnimatePresence mode="wait">
                      {activeVariant && (
                        <motion.div
                          key={activeVariant.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-baseline gap-2"
                        >
                          <span className="font-serif font-bold text-lg text-wine-900">
                            {activeVariant.size_ml ? `${activeVariant.size_ml}ml` : activeVariant.label}
                          </span>
                          <span className="text-slate-500">₹{Number(activeVariant.price).toLocaleString('en-IN')}</span>
                          {activeVariant.stock <= 0 && <span className="text-[10px] font-bold text-rose-600 uppercase">Sold Out</span>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {product.description && <p className="text-slate-600 font-light leading-relaxed">{product.description}</p>}
              </div>
            </div>

            <div className="bg-slate-50 px-6 sm:px-9 py-5 flex justify-end space-x-3 border-t border-slate-100 sticky bottom-0">
              <button onClick={close} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium bg-white">
                Close
              </button>
              <AddToCartButton
                onAdd={handleOrder}
                soldOut={!activeVariant || activeVariant.stock <= 0}
                idleLabel="Order Perfume"
                className="px-6 py-2.5 rounded-xl shadow-md font-semibold disabled:opacity-50 min-w-[170px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

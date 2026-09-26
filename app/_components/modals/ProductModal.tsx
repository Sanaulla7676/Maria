"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star, Clock, Radar, Sun, Moon, Snowflake, Flower2, Leaf, Sparkles,
  Droplet, Wind, Flame, Shirt, CalendarDays
} from "lucide-react"
import { toast } from "sonner"
import { useUI } from "@/app/_components/ui/UIProvider"
import { Modal } from "@/app/_components/ui/Modal"
import { AddToCartButton } from "@/app/_components/ui/AddToCartButton"
import { primaryImage } from "@/lib/product-helpers"
import { addToCart } from "@/lib/cart-actions"

const noteIcons = [Sparkles, Leaf, Droplet, Flame, Wind, Star]

const seasons = [
  { key: "Winter", label: "Winter", icon: Snowflake, active: "bg-sky-100 text-sky-700 border-sky-200" },
  { key: "Spring", label: "Spring", icon: Flower2, active: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { key: "Summer", label: "Summer", icon: Sun, active: "bg-amber-100 text-amber-700 border-amber-200" },
  { key: "Autumn", label: "Autumn", icon: Leaf, active: "bg-orange-100 text-orange-700 border-orange-200" },
]

function getTextColor(hex: string) {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return "#fff"
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.64 ? "#17120f" : "#fff"
}

function ProductVisual({
  image,
  name,
  family,
}: {
  image: string | null
  name: string
  family: string | null
}) {
  if (image) {
    return <img src={image} alt={name} className="h-full w-full object-cover" />
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#101321]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(212,175,55,0.24),transparent_32%),radial-gradient(circle_at_75%_75%,rgba(111,29,47,0.55),transparent_40%)]" />
      <div className="absolute inset-x-7 top-6 flex items-start justify-between">
        <div className="text-[9px] uppercase tracking-[0.3em] text-champagne-300/80">Maria Perfumes</div>
        <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-white/60">Signature</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className="relative h-[70%] w-[48%] min-w-[160px] max-w-[245px]">
          <div className="absolute left-1/2 top-0 h-[17%] w-[36%] -translate-x-1/2 rounded-t-[18px] rounded-b-[8px] border border-[#d4af37]/35 bg-gradient-to-b from-[#2b261c] via-[#0c0b0a] to-[#3a2b16] shadow-2xl" />
          <div className="absolute left-1/2 top-[13%] h-[11%] w-[46%] -translate-x-1/2 rounded-[12px] border border-[#d4af37]/25 bg-gradient-to-b from-[#3d301b] to-[#090909] shadow-xl" />
          <div className="absolute inset-x-[13%] bottom-0 top-[20%] rounded-[18px] border border-white/10 bg-gradient-to-r from-black via-[#292014] to-[#090909] shadow-[0_30px_50px_rgba(0,0,0,0.5)]" />
          <div className="absolute left-1/2 top-[43%] w-[66%] -translate-x-1/2 rounded-[8px] border border-[#9b6f1f]/50 bg-gradient-to-br from-[#f1cb75] via-[#d4af37] to-[#9f7621] px-3 py-5 text-center shadow-lg">
            <div className="text-[8px] uppercase tracking-[0.25em] text-black/65">MARIA</div>
            <div className="mt-2 font-serif text-sm font-bold leading-tight text-black/80 sm:text-base">{name}</div>
            <div className="mt-2 text-[7px] uppercase tracking-[0.18em] text-black/60">Eau de Parfum</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-7 bottom-6">
        <div className="text-[9px] uppercase tracking-[0.22em] text-white/45">{family || "Signature fragrance"}</div>
        <div className="mt-1 font-serif text-xl text-white">{name}</div>
      </div>
    </div>
  )
}

export function ProductModal({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { modal, close, open } = useUI()
  const isOpen = modal?.name === "product"
  const product = modal?.name === "product" ? modal.product : null

  const variants = product?.product_variants?.filter((v) => v.active) ?? []
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const activeVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null

  if (!product) return <Modal open={isOpen} onClose={close} size="2xl" children={null} />

  const image = activeVariant?.image_url || primaryImage(product)
  const accords = product.main_accords ?? []
  const notes = product.notes?.length ? product.notes : ["Signature Blend"]
  const gender = (product.gender || "Unisex").toLowerCase()

  const handleOrder = async () => {
    if (!isLoggedIn) {
      close()
      return open({ name: "auth", mode: "sign-in" })
    }
    if (!activeVariant || activeVariant.stock <= 0) return
    try {
      await addToCart(product.id, activeVariant.id, 1)
      toast.success(product.name + " added to your bag")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add to bag")
      throw e
    }
  }

  return (
    <Modal open={isOpen} onClose={close} size="2xl">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="max-h-[90vh] overflow-y-auto custom-scroll"
          >
            <div className="px-6 pb-5 pt-7 sm:px-10 sm:pt-9">
              <div className="pr-10">
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-champagne-700"
                >
                  {product.family || "Signature Perfumes"}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="mt-1 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-5xl"
                >
                  {product.name}
                </motion.h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>Maria Perfumes</span>
                  <span className="text-slate-300">·</span>
                  <span>for {gender}</span>
                  {product.badge && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold uppercase tracking-wider text-wine-800">{product.badge}</span>
                    </>
                  )}
                </div>
                {product.review_count > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <div className="flex text-champagne-500">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className="h-4 w-4" fill={n <= Math.round(product.rating) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="font-semibold text-slate-800">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">({product.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 px-6 pb-7 sm:px-10 md:grid-cols-[minmax(300px,0.94fr)_minmax(360px,1.06fr)]">
              <div className="space-y-7">
                <motion.div
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05, duration: 0.35 }}
                  className="relative aspect-[0.9] overflow-hidden rounded-[26px] bg-slate-100 shadow-inner"
                >
                  <ProductVisual image={image} name={product.name} family={product.family} />
                </motion.div>

                <section>
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-serif text-xl font-bold text-slate-950">Notes</h4>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">{notes.length} listed</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {notes.map((note, i) => {
                      const Icon = noteIcons[i % noteIcons.length]
                      return (
                        <motion.div
                          key={note + i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 + i * 0.035 }}
                          className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm"
                        >
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-champagne-100 text-champagne-700">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="mt-2 block text-[10px] font-semibold leading-tight text-slate-700">{note}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                {accords.length > 0 && (
                  <section>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-xl font-bold text-slate-950">Main Accords</h4>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">Scent character</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">{accords.length} accords</span>
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {accords.map((accord, i) => {
                        const percent = Math.min(100, Math.max(8, Number(accord.percent) || 0))
                        const textColor = getTextColor(accord.color)
                        return (
                          <div key={accord.name + i} className="relative h-10 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/70">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: percent + "%" }}
                              transition={{ duration: 0.7, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-y-0 left-0 rounded-xl"
                              style={{ backgroundColor: accord.color }}
                            />
                            <div className="relative z-10 flex h-full items-center justify-between gap-3 px-3.5 text-[11px] font-bold">
                              <span style={{ color: textColor }}>{accord.name}</span>
                              <span style={{ color: textColor }} className="tabular-nums opacity-75">{Math.round(percent)}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )}

                {(product.longevity_hours || product.sillage) && (
                  <section>
                    <h4 className="font-serif text-xl font-bold text-slate-950">Fragrance Profile</h4>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {product.longevity_hours && (
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"><Clock className="h-4 w-4 text-wine-800" /></div>
                          <div><div className="font-bold text-slate-900">{product.longevity_hours}h</div><div className="text-[10px] uppercase tracking-wider text-slate-400">Longevity</div></div>
                        </div>
                      )}
                      {product.sillage && (
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"><Radar className="h-4 w-4 text-wine-800" /></div>
                          <div><div className="font-bold text-slate-900">{product.sillage}</div><div className="text-[10px] uppercase tracking-wider text-slate-400">Sillage</div></div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {product.best_daytime && (
                  <section>
                    <h4 className="font-serif text-xl font-bold text-slate-950">Day / Night</h4>
                    <div className="mt-3 flex h-11 overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                      <motion.div
                        initial={{ flexGrow: 0 }}
                        animate={{ flexGrow: product.best_daytime === "day" ? 3 : product.best_daytime === "night" ? 1 : 2 }}
                        transition={{ duration: 0.55 }}
                        className="flex items-center justify-center gap-1.5 bg-sky-400 px-3 text-[11px] font-bold text-white"
                      ><Sun className="h-3.5 w-3.5" />Day</motion.div>
                      <motion.div
                        initial={{ flexGrow: 0 }}
                        animate={{ flexGrow: product.best_daytime === "night" ? 3 : product.best_daytime === "day" ? 1 : 2 }}
                        transition={{ duration: 0.55 }}
                        className="flex items-center justify-center gap-1.5 bg-slate-800 px-3 text-[11px] font-bold text-white"
                      ><Moon className="h-3.5 w-3.5" />Night</motion.div>
                    </div>
                  </section>
                )}

                {product.best_season?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2"><h4 className="font-serif text-xl font-bold text-slate-950">Seasons</h4><CalendarDays className="h-4 w-4 text-slate-400" /></div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {seasons.map((season) => {
                        const active = product.best_season.includes(season.key)
                        const Icon = season.icon
                        return (
                          <div
                            key={season.key}
                            className={"flex items-center gap-2 rounded-2xl border p-3 text-[11px] font-bold " + (active ? season.active : "border-slate-200 bg-slate-50 text-slate-300")}
                          ><Icon className="h-4 w-4" />{season.label}</div>
                        )
                      })}
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400"><Shirt className="h-3.5 w-3.5" />Fragrance details</div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div><div className="font-semibold text-slate-400">Family</div><div className="mt-1 font-bold text-slate-800">{product.family || "Signature"}</div></div>
                    <div><div className="font-semibold text-slate-400">Gender</div><div className="mt-1 font-bold capitalize text-slate-800">{gender}</div></div>
                  </div>
                  {product.description && <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-600">{product.description}</p>}
                </section>

                {variants.length > 0 && (
                  <section>
                    <h4 className="font-serif text-xl font-bold text-slate-950">Choose a Variant</h4>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {variants.map((v) => {
                        const isActive = (activeVariant?.id ?? variants[0]?.id) === v.id
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariantId(v.id)}
                            disabled={v.stock <= 0}
                            className={"relative flex h-12 items-center gap-2 rounded-full border px-3 transition disabled:opacity-35 " + (isActive ? "border-wine-800 bg-wine-950 text-white shadow-md" : "border-slate-200 bg-white text-slate-700 hover:border-wine-300")}
                          >
                            {v.image_url ? <img src={v.image_url} alt={v.label} className="h-8 w-8 rounded-full object-cover" /> : <div className={"flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-bold " + (isActive ? "bg-white/15 text-champagne-300" : "bg-wine-950 text-white")}>{v.size_ml || v.label.charAt(0)}</div>}
                            <span className="text-[10px] font-bold">{v.size_ml ? v.size_ml + "ml" : v.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    {activeVariant && <div className="mt-3 font-serif text-xl font-bold text-wine-900">₹{Number(activeVariant.price).toLocaleString("en-IN")}</div>}
                  </section>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-xl sm:px-10">
              <div className="hidden min-w-0 sm:block">
                <div className="truncate text-sm font-bold text-slate-900">{product.name}</div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{product.family || "Signature fragrance"}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={close} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300">Close</button>
                <AddToCartButton
                  onAdd={handleOrder}
                  soldOut={!activeVariant || activeVariant.stock <= 0}
                  idleLabel="Order Perfume"
                  className="min-w-[165px] rounded-xl px-6 py-2.5 font-semibold shadow-md disabled:opacity-50"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

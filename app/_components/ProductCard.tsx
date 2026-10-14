/* editorial product card */
"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Clock, Heart, Radar, ShoppingBag, Star } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { cheapestActiveVariant, MARIA_BOTTLE_IMAGE, MARIA_VARIANT_PRICES } from "@/lib/product-helpers"
import { useUI } from "@/app/_components/ui/UIProvider"
import { toggleWishlist } from "@/app/account/wishlist/actions"

function ImageStage({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4efe8]">
      <div className="absolute inset-0 flex justify-center">
        <div className="relative h-full aspect-[9/16] max-w-full">
          <img
            src={MARIA_BOTTLE_IMAGE}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.018]"
            draggable={false}
          />
          <div className="absolute left-[27%] right-[27%] top-[66.5%] h-[8.4%] flex items-center justify-center overflow-hidden px-2">
            <span className="max-w-full text-center text-[9px] font-semibold leading-tight tracking-[0.01em] text-[#171226] sm:text-[10px]">
              {name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductCard({
  product,
  isLoggedIn,
  isWishlisted,
  index,
  featured = false,
}: {
  product: Product
  isLoggedIn: boolean
  isWishlisted: boolean
  index: number
  featured?: boolean
}) {
  const { open } = useUI()
  const [saved, setSaved] = useState(isWishlisted)
  const [pending, startTransition] = useTransition()

  const variant = cheapestActiveVariant(product)
  const accords = product.main_accords?.slice(0, 3) ?? []

  const handleBookmark = () => {
    if (!isLoggedIn) return open({ name: "auth", mode: "sign-in" })
    setSaved((v) => !v)
    startTransition(async () => {
      try {
        await toggleWishlist({ productId: product.id })
      } catch (e) {
        setSaved((v) => !v)
        toast.error(e instanceof Error ? e.message : "Could not update wishlist")
      }
    })
  }

  return (
    <article className={"group relative overflow-hidden rounded-[28px] border border-[#dbe6f0] bg-white shadow-[0_16px_45px_rgba(16,36,58,.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,36,58,.12)] max-sm:rounded-[18px] " + (featured ? "md:row-span-2" : "")}>
      <div className={"relative overflow-hidden " + (featured ? "h-[360px] max-sm:h-[190px] sm:h-[440px]" : "h-[260px] max-sm:h-[190px] sm:h-[310px]")}>
        <ImageStage name={product.name} />
        <div className="absolute left-5 top-5 flex items-center gap-2 max-sm:left-3 max-sm:top-3 max-sm:gap-1">
          <span className="font-display text-2xl font-extrabold tracking-[-0.06em] text-white drop-shadow-md max-sm:text-xl">{String(index + 1).padStart(2, "0")}</span>
          {product.badge && <span className="rounded-full bg-[#167bd1] px-3 py-1 text-[8px] font-extrabold uppercase tracking-[0.18em] text-white shadow-lg max-sm:px-2 max-sm:py-0.5 max-sm:text-[7px]">{product.badge}</span>}
        </div>
        <button onClick={handleBookmark} disabled={pending} aria-label={"Save " + product.name} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#10243a] shadow-lg backdrop-blur-sm transition hover:scale-105 hover:text-[#167bd1] max-sm:right-3 max-sm:top-3 max-sm:h-8 max-sm:w-8">
          <Heart className={"h-4 w-4 " + (saved ? "fill-[#167bd1] text-[#167bd1]" : "")} />
        </button>
        {variant && <div className="absolute bottom-5 left-5 rounded-full bg-[#10243a]/88 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white max-sm:bottom-3 max-sm:left-3 max-sm:px-2 max-sm:py-1 max-sm:text-[7px]">{variant.size_ml ? variant.size_ml + "ml" : variant.label}</div>}
      </div>

      <div className="p-6 sm:p-7 max-sm:p-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-wine-600">{product.family || "Signature Perfumes"}</p>
            <h3 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.04em] text-[#10243a] sm:text-3xl max-sm:text-[15px]">{product.name}</h3>
          </div>
          {product.review_count > 0 && <div className="flex items-center gap-1 rounded-full bg-[#eef7ff] px-2.5 py-1 text-[9px] font-bold text-wine-700"><Star className="h-3 w-3 fill-current" />{product.rating.toFixed(1)}</div>}
        </div>

        <p className="mt-4 line-clamp-3 text-[12px] leading-6 text-slate-500 max-sm:mt-2 max-sm:line-clamp-2 max-sm:text-[10px] max-sm:leading-4">{product.description || (product.notes?.length ? product.notes.join(", ") : "A signature Maria Perfumes composition.")}</p>

        {accords.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 max-sm:mt-3 max-sm:gap-1">
            {accords.map((accord) => <span key={accord.name} className="rounded-full border border-[#dbe6f0] bg-[#fbfdff] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#526b83] max-sm:px-1.5 max-sm:py-0.5 max-sm:text-[7px]">{accord.name}</span>)}
          </div>
        )}

        <div className="mt-6 border-t border-slate-100 pt-5 max-sm:mt-4 max-sm:pt-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {product.longevity_hours && <span className="flex items-center gap-1.5 max-sm:text-[7px]"><Clock className="h-3.5 w-3.5 text-wine-500" />{product.longevity_hours}h longevity</span>}
            {product.sillage && <span className="flex items-center gap-1.5 max-sm:text-[7px]"><Radar className="h-3.5 w-3.5 text-wine-500" />{product.sillage}</span>}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => open({ name: "product", product })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#167bd1] px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-[#10243a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167bd1] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-4 w-4" /> Buy Now
            </button>
            <div className="rounded-2xl border border-[#e7c76b]/75 bg-[#fff8e7] px-3 py-3 text-center shadow-sm">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#85621d]">Standard sizes · Every fragrance</p>
              <p className="mt-1 font-display text-xl font-extrabold tracking-[-0.03em] text-[#10243a]">Prices from ₹600</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] font-bold text-[#526b83]">
                {MARIA_VARIANT_PRICES.map((size) => <span key={size.sizeMl}>{size.label} · ₹{size.price.toLocaleString("en-IN")}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

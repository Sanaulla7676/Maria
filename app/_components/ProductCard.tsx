"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Clock, Heart, Radar, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { cheapestActiveVariant, MARIA_BOTTLE_IMAGE, MARIA_VARIANT_PRICES, primaryImage } from "@/lib/product-helpers"
import { useUI } from "@/app/_components/ui/UIProvider"
import { toggleWishlist } from "@/app/account/wishlist/actions"

const swatches = ["#7b5232", "#e0b98d", "#d9a441"]

export function ProductCard({ product, isLoggedIn, isWishlisted, index }: {
  product: Product; isLoggedIn: boolean; isWishlisted: boolean; index: number
}) {
  const { open } = useUI()
  const [saved, setSaved] = useState(isWishlisted)
  const [pending, startTransition] = useTransition()
  const variant = cheapestActiveVariant(product)
  const image = primaryImage(product) ?? MARIA_BOTTLE_IMAGE
  const accords = product.main_accords?.length
    ? product.main_accords.slice(0, 3)
    : (product.notes ?? []).slice(0, 3).map((name, i) => ({ name, color: swatches[i % swatches.length], percent: 100 }))

  const handleBookmark = () => {
    if (!isLoggedIn) return open({ name: "auth", mode: "sign-in" })
    setSaved(v => !v)
    startTransition(async () => {
      try { await toggleWishlist({ productId: product.id }) }
      catch (error) {
        setSaved(v => !v)
        toast.error(error instanceof Error ? error.message : "Could not update wishlist")
      }
    })
  }

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#e8e0d1] bg-[#fffdfa] shadow-[0_8px_28px_rgba(35,25,12,.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_38px_rgba(35,25,12,.13)] sm:rounded-[26px]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#130d0a]">
        <img src={image} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" draggable={false} />
        {image === MARIA_BOTTLE_IMAGE && (
          <div className="absolute left-[27%] right-[27%] top-[72%] flex h-[11%] items-center justify-center overflow-hidden border-y border-[#d6b15c] bg-[#f8efdc]/95 px-1.5">
            <span className="max-w-full text-center text-[8px] font-extrabold leading-tight text-[#15110d] sm:text-[10px]">{product.name}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-[10px] bg-[#167bd1] px-1.5 text-sm font-extrabold text-white shadow-md sm:left-4 sm:top-4 sm:h-11 sm:min-w-11 sm:text-lg">{String(index + 1).padStart(2, "0")}</span>
        <span className="absolute left-3 top-[21%] rounded-full border border-[#e0c36f] bg-[#050505]/85 px-2.5 py-1.5 text-[7px] font-extrabold uppercase tracking-[0.15em] text-[#f6dc8a] sm:left-4 sm:top-[20%] sm:px-3.5 sm:text-[9px]">40% PURE OIL</span>
        <button type="button" onClick={handleBookmark} disabled={pending} aria-label={saved ? "Remove from wishlist" : "Save fragrance"} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white text-[#17120d] shadow-lg transition hover:scale-105 hover:text-[#b58a2c] disabled:opacity-60 sm:right-4 sm:top-4 sm:h-11 sm:w-11">
          <Heart className={"h-4 w-4 sm:h-5 sm:w-5 " + (saved ? "fill-[#d3ad4e] text-[#a27c23]" : "")} />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full border border-[#dfc46f] bg-[#050505]/90 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white sm:bottom-4 sm:left-4 sm:px-3.5 sm:text-[10px]">{variant?.size_ml ? variant.size_ml + "ML" : "30ML"}</span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[7px] font-extrabold uppercase tracking-[0.25em] text-[#76612f] sm:text-[9px] sm:tracking-[0.28em]">Signature Perfumes</p>
        <h3 className="maria-product-title mt-1 line-clamp-2 text-[17px] font-bold uppercase leading-[0.98] tracking-[-0.035em] text-[#101015] sm:text-[23px]">{product.name}</h3>
        <p className="mt-2 line-clamp-3 text-[9px] leading-[1.5] text-[#353239] sm:mt-3 sm:text-[12px] sm:leading-[1.55]">{product.description || ((product.notes ?? []).length ? product.notes.join(", ") : "Maria 40% pure-oil interpretation with a distinctive, lasting scent.")}</p>

        {accords.length > 0 && <div className="mt-3 flex flex-wrap gap-1 sm:mt-3.5 sm:gap-1.5">
          {accords.map(accord => <span key={accord.name} className="inline-flex min-w-0 items-center gap-1 rounded-full border border-[#e8e2d9] bg-white py-0.5 pl-0.5 pr-1.5 text-[7px] font-extrabold uppercase leading-none text-[#302a22] sm:gap-1.5 sm:pr-2.5 sm:text-[8px]">
            <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border border-black/5 sm:h-7 sm:w-7" style={{ backgroundColor: accord.color || "#7b5232" }} />
            <span className="max-w-[68px] truncate sm:max-w-[82px]">{accord.name}</span>
          </span>)}
        </div>}

        <div className="mt-3 flex items-center border-t border-[#e9e3d9] pt-3 sm:mt-4 sm:pt-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2 sm:gap-2.5 sm:pr-3">
            <Clock className="h-4 w-4 shrink-0 text-[#171717] sm:h-5 sm:w-5" />
            <div className="min-w-0"><p className="text-[8px] font-extrabold leading-none text-[#171717] sm:text-[10px]">{product.longevity_hours ? String(product.longevity_hours) + "H" : "LONG"}</p><p className="mt-1 text-[6px] font-bold uppercase tracking-[0.08em] text-[#363239] sm:text-[8px]">Longevity</p></div>
          </div>
          <div className="h-8 w-px shrink-0 bg-[#d9cdb6] sm:h-10" />
          <div className="flex min-w-0 flex-1 items-center gap-1.5 pl-2 sm:gap-2.5 sm:pl-3">
            <Radar className="h-4 w-4 shrink-0 text-[#171717] sm:h-5 sm:w-5" />
            <div className="min-w-0"><p className="truncate text-[8px] font-extrabold leading-none text-[#171717] sm:text-[10px]">{(product.sillage || "Strong").toUpperCase()}</p><p className="mt-1 text-[6px] font-bold uppercase tracking-[0.08em] text-[#363239] sm:text-[8px]">Projection</p></div>
          </div>
        </div>

        <div className="mt-auto pt-3 sm:pt-4">
          <button type="button" onClick={() => open({ name: "product", product })} className="flex w-full items-center rounded-full border border-[#167bd1] bg-[#167bd1] px-2.5 py-3 text-white shadow-[0_5px_16px_rgba(22,123,209,.22)] transition hover:bg-[#1268b4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167bd1] focus-visible:ring-offset-2 sm:px-3.5 sm:py-3.5">
            <ShoppingBag className="h-4 w-4 shrink-0 text-white sm:h-[18px] sm:w-[18px]" /><span className="mx-2 h-5 w-px shrink-0 bg-white/50 sm:mx-3 sm:h-6" /><span className="flex-1 text-center text-[9px] font-extrabold uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.22em]">Buy Now</span><ArrowRight className="h-4 w-4 shrink-0 text-white sm:h-[18px] sm:w-[18px]" />
          </button>
          <div className="mt-3 rounded-[15px] border border-[#e2c77d] bg-gradient-to-b from-[#fff8e5] to-[#ffefc7] px-2 py-3 text-center shadow-[0_4px_13px_rgba(156,115,34,.09)] sm:mt-3.5 sm:rounded-[18px] sm:px-3 sm:py-3.5">
            <p className="text-[6px] font-extrabold uppercase tracking-[0.18em] text-[#68542c] sm:text-[8px] sm:tracking-[0.24em]">Standard sizes · Every fragrance</p>
            <p className="maria-price-title mt-1 text-[16px] font-bold leading-tight tracking-[-0.035em] text-[#15131a] sm:mt-1.5 sm:text-[21px]">Prices from ₹600</p>
            <div className="mt-2 grid grid-cols-3 border-t border-[#ddc888] pt-2 sm:mt-3 sm:pt-2.5">
              {MARIA_VARIANT_PRICES.map((size, i) => <div key={size.sizeMl} className={i ? "border-l border-[#d8c99f] px-0.5" : "px-0.5"}><p className="text-[7px] font-bold text-[#29251f] sm:text-[9px]">{size.label}</p><p className="mt-0.5 text-[10px] font-extrabold tracking-tight text-[#17130c] sm:text-[14px]">₹{size.price.toLocaleString("en-IN")}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

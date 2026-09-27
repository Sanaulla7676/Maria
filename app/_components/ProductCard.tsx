/* editorial product card */
"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Clock, Heart, Radar, Star } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { primaryImage, cheapestActiveVariant } from "@/lib/product-helpers"
import { useUI } from "@/app/_components/ui/UIProvider"
import { toggleWishlist } from "@/app/account/wishlist/actions"

function ImageStage({ image, name }: { image: string | null; name: string }) {
  if (image) return <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#eef7ff]">
      <div className="absolute -left-16 top-10 h-72 w-72 rounded-full border-[64px] border-[#167bd1]/10" />
      <div className="absolute right-[-12%] top-[-18%] h-[72%] w-[70%] rounded-bl-[55%] rounded-tl-[55%] bg-[#167bd1]" />
      <div className="absolute right-[10%] top-[7%] h-[36%] w-[42%] rounded-bl-[50%] rounded-tr-[50%] bg-white/75" />
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <div className="absolute inset-x-7 bottom-7">
        <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-wine-600">Maria Perfumes</span>
        <div className="mt-2 max-w-[80%] font-display text-2xl font-extrabold uppercase leading-[0.92] tracking-[-0.05em] text-[#10243a] sm:text-3xl">{name}</div>
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

  const image = primaryImage(product)
  const variant = cheapestActiveVariant(product)
  const inStock = !!variant && variant.stock > 0
  const original = variant ? Number(variant.price) * 2 : null
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
    <article className={"group relative overflow-hidden rounded-[28px] border border-[#dbe6f0] bg-white shadow-[0_16px_45px_rgba(16,36,58,.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,36,58,.12)] " + (featured ? "md:row-span-2" : "")}>
      <div className={"relative overflow-hidden " + (featured ? "h-[360px] sm:h-[440px]" : "h-[260px] sm:h-[310px]")}>
        <ImageStage image={image} name={product.name} />
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="font-display text-2xl font-extrabold tracking-[-0.06em] text-white drop-shadow-md">{String(index + 1).padStart(2, "0")}</span>
          {product.badge && <span className="rounded-full bg-[#167bd1] px-3 py-1 text-[8px] font-extrabold uppercase tracking-[0.18em] text-white shadow-lg">{product.badge}</span>}
        </div>
        <button onClick={handleBookmark} disabled={pending} aria-label={"Save " + product.name} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#10243a] shadow-lg backdrop-blur-sm transition hover:scale-105 hover:text-[#167bd1]">
          <Heart className={"h-4 w-4 " + (saved ? "fill-[#167bd1] text-[#167bd1]" : "")} />
        </button>
        {variant && <div className="absolute bottom-5 left-5 rounded-full bg-[#10243a]/88 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white">{variant.size_ml ? variant.size_ml + "ml" : variant.label}</div>}
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-wine-600">{product.family || "Signature Perfumes"}</p>
            <h3 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.04em] text-[#10243a] sm:text-3xl">{product.name}</h3>
          </div>
          {product.review_count > 0 && <div className="flex items-center gap-1 rounded-full bg-[#eef7ff] px-2.5 py-1 text-[9px] font-bold text-wine-700"><Star className="h-3 w-3 fill-current" />{product.rating.toFixed(1)}</div>}
        </div>

        <p className="mt-4 line-clamp-3 text-[12px] leading-6 text-slate-500">{product.description || (product.notes?.length ? product.notes.join(", ") : "A signature Maria Perfumes composition.")}</p>

        {accords.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {accords.map((accord) => <span key={accord.name} className="rounded-full border border-[#dbe6f0] bg-[#fbfdff] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#526b83]">{accord.name}</span>)}
          </div>
        )}

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {product.longevity_hours && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-wine-500" />{product.longevity_hours}h longevity</span>}
            {product.sillage && <span className="flex items-center gap-1.5"><Radar className="h-3.5 w-3.5 text-wine-500" />{product.sillage}</span>}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-end gap-2">
              {variant ? <><span className="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#10243a]">₹{Number(variant.price).toLocaleString("en-IN")}</span>{original && <span className="pb-0.5 text-xs text-slate-400 line-through">₹{original.toLocaleString("en-IN")}</span>}</> : <span className="font-display text-xl font-extrabold text-[#10243a]">Price on request</span>}
            </div>
            <button onClick={() => open({ name: "product", product })} className="inline-flex items-center gap-2.5 rounded-full border border-[#167bd1] bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#167bd1] transition hover:bg-[#167bd1] hover:text-white">
              View Details <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

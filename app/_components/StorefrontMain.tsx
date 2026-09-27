"use client"

import { useMemo, useState } from "react"
import { ArrowRight, CalendarDays, ChevronDown, Gift, Search, Sparkles, SlidersHorizontal, Star, Wand2 } from "lucide-react"
import type { Product } from "@/lib/types"
import { cheapestActiveVariant } from "@/lib/product-helpers"
import { ProductCard } from "@/app/_components/ProductCard"
import { useUI } from "@/app/_components/ui/UIProvider"

export function StorefrontMain({
  products,
  isLoggedIn,
  wishlistIds,
}: {
  products: Product[]
  isLoggedIn: boolean
  wishlistIds: string[]
}) {
  const { open } = useUI()
  const [family, setFamily] = useState("all")
  const [gender, setGender] = useState("all")
  const [query, setQuery] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [bestOnly, setBestOnly] = useState(false)

  const families = useMemo(() => {
    const counts = new Map<string, number>()
    products.forEach((p) => {
      const key = p.family || "Other"
      counts.set(key, (counts.get(key) || 0) + 1)
    })
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [products])

  const genders = useMemo(
    () => Array.from(new Set(products.map((p) => p.gender).filter(Boolean))) as string[],
    [products],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const priceVariant = cheapestActiveVariant(p)
      const price = priceVariant ? Number(priceVariant.price) : 0
      const matchesFamily = family === "all" || (p.family || "Other") === family
      const matchesGender = gender === "all" || p.gender === gender
      const matchesPrice = price >= minPrice
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.notes || []).some((n) => n.toLowerCase().includes(q)) ||
        (p.description || "").toLowerCase().includes(q)
      const matchesBest = !bestOnly || p.featured
      return matchesFamily && matchesGender && matchesPrice && matchesQuery && matchesBest
    })
  }, [products, family, gender, minPrice, query, bestOnly])

  const curated = filtered.slice(0, 4)
  const remainder = filtered.slice(4)

  return (
    <section id="matches-section" className="editorial-shell relative overflow-hidden border-t border-slate-200">
      <span className="editorial-watermark left-[-2rem] top-[18rem] rotate-[-90deg] hidden xl:block">SCENT</span>

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid items-end gap-10 border-b border-slate-200 pb-10 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <span className="editorial-kicker">Maria Perfumes · The Collection</span>
            <h2 className="mt-5 max-w-5xl font-display text-6xl font-extrabold uppercase leading-[.86] tracking-[-0.065em] text-[#10243a] sm:text-7xl lg:text-[8rem]">
              Find your
              <span className="block text-[#167bd1]">Signature</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Discover a curated world of captivating scents, crafted around moods, memories, personalities and moments.
            </p>
          </div>
          <div className="lg:pb-1">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-wine-600">
              <span className="h-2.5 w-2.5 rounded-full bg-[#167bd1]" />
              Premium fragrances for every personality
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-[#eef7ff] p-4">
                <div className="font-display text-4xl font-extrabold tracking-[-0.06em] text-[#10243a]">{products.length}</div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Signature fragrances</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="font-display text-4xl font-extrabold tracking-[-0.06em] text-[#167bd1]">03</div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Ways to experience Maria</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 xl:flex-row xl:items-stretch">
          <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-[#167bd1]/40 bg-white px-4 shadow-sm">
            <Search className="h-5 w-5 text-[#167bd1]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search perfumes, notes, accords..."
              className="w-full bg-transparent text-sm font-medium text-[#10243a] outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="flex min-h-14 min-w-[210px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
            <div>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-wine-600">Fragrance family</span>
              <select value={family} onChange={(e) => setFamily(e.target.value)} className="mt-1 w-full appearance-none bg-transparent text-sm font-semibold text-[#10243a] outline-none">
                <option value="all">All Fragrances</option>
                {families.map(([name, count]) => <option key={name} value={name}>{name} · {count}</option>)}
              </select>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </label>

          <label className="flex min-h-14 min-w-[190px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
            <div>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-wine-600">For</span>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 w-full appearance-none bg-transparent text-sm font-semibold text-[#10243a] outline-none">
                <option value="all">Unisex / Men / Women</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </label>

          <label className="flex min-h-14 min-w-[160px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
            <div>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-wine-600">Price</span>
              <select value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="mt-1 w-full appearance-none bg-transparent text-sm font-semibold text-[#10243a] outline-none">
                <option value={0}>All prices</option>
                <option value={600}>₹600+</option>
                <option value={1000}>₹1,000+</option>
                <option value={1500}>₹1,500+</option>
              </select>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </label>

          <button
            onClick={() => setBestOnly((v) => !v)}
            className={"min-h-14 rounded-2xl border px-5 text-left text-[9px] font-extrabold uppercase tracking-[0.18em] transition " + (bestOnly ? "border-[#167bd1] bg-[#167bd1] text-white" : "border-slate-200 bg-white text-[#10243a] hover:border-[#167bd1]")}
          >
            <SlidersHorizontal className="mb-1.5 h-4 w-4" />
            Best sellers
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
          <div className="flex items-center gap-4 overflow-x-auto px-4 py-3">
            <div className="shrink-0 border-r border-slate-200 pr-5">
              <div className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Categories</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#10243a]">Curated by character</div>
            </div>
            <button
              onClick={() => setFamily("all")}
              className={"shrink-0 rounded-full px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition " + (family === "all" ? "bg-[#167bd1] text-white" : "bg-[#eef7ff] text-[#526b83] hover:bg-[#dff0ff]")}
            >
              All Fragrances <span className="ml-1 opacity-70">{products.length}</span>
            </button>
            {families.slice(0, 9).map(([name, count]) => (
              <button
                key={name}
                onClick={() => setFamily(name)}
                className={"shrink-0 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] transition " + (family === name ? "border-[#167bd1] bg-[#167bd1] text-white" : "border-slate-200 bg-white text-[#526b83] hover:border-[#167bd1] hover:text-[#167bd1]")}
              >
                {name} <span className="ml-1 opacity-60">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.26em] text-wine-600">01 · Curated collection</span>
            <h3 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[-0.04em] text-[#10243a] sm:text-3xl">Featured fragrances</h3>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl font-extrabold tracking-[-0.05em] text-[#167bd1]">{filtered.length}</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Results</div>
          </div>
        </div>

        {curated.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
            {curated.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                featured={i < 2}
                isLoggedIn={isLoggedIn}
                isWishlisted={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[30px] border border-dashed border-slate-300 bg-white py-24 text-center">
            <p className="font-display text-4xl font-extrabold uppercase tracking-[-0.05em] text-[#10243a]">No fragrances found</p>
            <p className="mt-3 text-sm text-slate-500">Clear a filter or search a different note.</p>
          </div>
        )}

        {remainder.length > 0 && (
          <>
            <div className="mt-16 flex items-end justify-between border-b border-slate-200 pb-5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.26em] text-wine-600">02 · Full collection</span>
                <h3 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[-0.04em] text-[#10243a]">Explore every scent</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{remainder.length} more</span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {remainder.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i + 4}
                  isLoggedIn={isLoggedIn}
                  isWishlisted={wishlistIds.includes(product.id)}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 grid overflow-hidden rounded-[28px] border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
            <div className="text-[#167bd1]"><Sparkles className="h-6 w-6" /></div>
            <div className="mt-4 font-display text-lg font-extrabold uppercase text-[#10243a]">100% Curated</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">Signature fragrances chosen for character and wear.</div>
          </div>
          <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
            <div className="text-[#167bd1]"><Gift className="h-6 w-6" /></div>
            <div className="mt-4 font-display text-lg font-extrabold uppercase text-[#10243a]">Premium Quality</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">Thoughtful fragrance experiences for gifting and everyday wear.</div>
          </div>
          <button onClick={() => open({ name: "booking" })} className="border-b border-slate-200 p-6 text-left transition hover:bg-[#eef7ff] lg:border-b-0 lg:border-r">
            <div className="text-[#167bd1]"><CalendarDays className="h-6 w-6" /></div>
            <div className="mt-4 font-display text-lg font-extrabold uppercase text-[#10243a]">Live Events</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">Turn weddings and celebrations into interactive scent experiences.</div>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#167bd1]">Book an event <ArrowRight className="h-3.5 w-3.5" /></div>
          </button>
          <button onClick={() => open({ name: "scent-matcher" })} className="p-6 text-left transition hover:bg-[#eef7ff]">
            <div className="text-[#167bd1]"><Wand2 className="h-6 w-6" /></div>
            <div className="mt-4 font-display text-lg font-extrabold uppercase text-[#10243a]">Workshops</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">Learn, blend and create your own signature fragrance.</div>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#167bd1]">Find your scent <ArrowRight className="h-3.5 w-3.5" /></div>
          </button>
        </div>
      </div>
    </section>
  )
}

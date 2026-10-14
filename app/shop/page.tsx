import Link from 'next/link'
import { Heart, Search, ShoppingBag, Clock, Radar, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MARIA_BOTTLE_IMAGE, MARIA_VARIANT_PRICES } from '@/lib/product-helpers'

const fallbackColors = ['#7b5232', '#e0b98d', '#d9a441']

export default async function ShopPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products')
    .select('id,slug,name,description,badge,featured,rating,review_count,notes,main_accords,longevity_hours,sillage,product_images(image_url,alt_text,sort_order),product_variants(id,label,price,stock,active,size_ml)')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('name')

  const products = (data ?? []).map((product) => ({
    ...product,
    variants: (product.product_variants ?? []).filter((v) => v.active).sort((a, b) => (a.size_ml ?? 999) - (b.size_ml ?? 999)),
    image: (product.product_images ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0] ?? null,
  }))

  return (
    <main className="mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-[24px] border border-[#e8e0d1] bg-gradient-to-br from-[#fffaf0] via-white to-[#f7edda] px-5 py-7 sm:mb-8 sm:rounded-[30px] sm:px-9 sm:py-10">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.28em] text-[#826528]">Maria Signature</span>
        <h1 className="maria-product-title mt-2 text-4xl font-bold tracking-tight text-[#0a0908] sm:text-6xl">Find your signature.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5b5449] sm:text-base">40% concentration, pure oil perfumes crafted for lasting wear and expressive projection.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b5b35]">
          <span className="rounded-full border border-[#d8c27e] bg-white/80 px-3 py-2">{products.length} fragrances</span>
          <span className="rounded-full border border-[#d8c27e] bg-white/80 px-3 py-2">30 ml · ₹600</span>
          <span className="rounded-full border border-[#d8c27e] bg-white/80 px-3 py-2">50 ml · ₹1,000</span>
          <span className="rounded-full border border-[#d8c27e] bg-white/80 px-3 py-2">100 ml · ₹1,800</span>
        </div>
      </section>

      <section className="mb-6 flex items-center gap-3 rounded-2xl border border-[#e8e0d1] bg-white px-4 py-3 sm:mb-8">
        <Search className="h-4 w-4 shrink-0 text-[#92732b]" />
        <input aria-label="Search fragrances" placeholder="Search perfumes, notes, accords..." className="w-full bg-transparent text-sm text-[#17130c] outline-none placeholder:text-[#9b9384]" />
      </section>

      <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => {
          const imageUrl = product.image?.image_url ?? MARIA_BOTTLE_IMAGE
          const accords: { name: string; color?: string; percent?: number }[] = product.main_accords?.length
            ? (product.main_accords as { name: string; color?: string; percent?: number }[]).slice(0, 3)
            : ((product.notes as string[] | null) ?? []).slice(0, 3).map((name: string, i: number) => ({ name, color: fallbackColors[i % fallbackColors.length], percent: 100 }))
          const variant = product.variants[0]

          return (
            <article className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#e8e0d1] bg-[#fffdfa] shadow-[0_8px_28px_rgba(35,25,12,.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_38px_rgba(35,25,12,.13)] sm:rounded-[26px]" key={product.id}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#130d0a]">
                <img src={imageUrl} alt={product.image?.alt_text ?? product.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                {imageUrl === MARIA_BOTTLE_IMAGE && <div className="absolute left-[27%] right-[27%] top-[72%] flex h-[11%] items-center justify-center overflow-hidden border-y border-[#d6b15c] bg-[#f8efdc]/95 px-1.5"><span className="max-w-full text-center text-[8px] font-extrabold leading-tight text-[#15110d] sm:text-[10px]">{product.name}</span></div>}
                <span className="absolute left-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#f9e7a6] to-[#d6ad4e] px-1.5 text-sm font-extrabold text-[#17120a] shadow-md sm:left-4 sm:top-4 sm:h-11 sm:min-w-11 sm:text-lg">{String(index + 1).padStart(2, '0')}</span>
                <span className="absolute left-3 top-[21%] rounded-full border border-[#e0c36f] bg-[#050505]/85 px-2.5 py-1.5 text-[7px] font-extrabold uppercase tracking-[0.15em] text-[#f6dc8a] shadow-md sm:left-4 sm:top-[20%] sm:px-3.5 sm:text-[9px]">40% PURE OIL</span>
                <button type="button" aria-label={'Save ' + product.name} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white text-[#17120d] shadow-lg sm:right-4 sm:top-4 sm:h-11 sm:w-11"><Heart className="h-4 w-4 sm:h-5 sm:w-5" /></button>
                <span className="absolute bottom-3 left-3 rounded-full border border-[#dfc46f] bg-[#050505]/90 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white sm:bottom-4 sm:left-4 sm:px-3.5 sm:text-[10px]">{variant?.size_ml ? variant.size_ml + 'ML' : '30ML'}</span>
              </div>

              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <p className="text-[7px] font-extrabold uppercase tracking-[0.25em] text-[#76612f] sm:text-[9px] sm:tracking-[0.28em]">Signature Perfumes</p>
                <h2 className="maria-product-title mt-1 line-clamp-2 text-[17px] font-bold uppercase leading-[0.98] tracking-[-0.035em] text-[#101015] sm:text-[23px]">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-[9px] leading-[1.5] text-[#353239] sm:mt-3 sm:text-[12px] sm:leading-[1.55]">{product.description ?? ((product.notes ?? []).length ? product.notes.slice(0, 5).join(', ') : 'A Maria 40% pure-oil interpretation crafted for lasting wear.')}</p>
                {accords.length > 0 && <div className="mt-3 flex flex-wrap gap-1 sm:mt-3.5 sm:gap-1.5">{accords.map((accord: { name: string; color?: string }) => <span key={accord.name} className="inline-flex min-w-0 items-center gap-1 rounded-full border border-[#e8e2d9] bg-white py-0.5 pl-0.5 pr-1.5 text-[7px] font-extrabold uppercase leading-none text-[#302a22] sm:gap-1.5 sm:pr-2.5 sm:text-[8px]"><span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border border-black/5 sm:h-7 sm:w-7" style={{backgroundColor: accord.color || '#7b5232'}} /><span className="max-w-[68px] truncate sm:max-w-[82px]">{accord.name}</span></span>)}</div>}

                <div className="mt-3 flex items-center border-t border-[#e9e3d9] pt-3 sm:mt-4 sm:pt-4">
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2 sm:gap-2.5 sm:pr-3"><Clock className="h-4 w-4 shrink-0 text-[#171717] sm:h-5 sm:w-5" /><div className="min-w-0"><p className="text-[8px] font-extrabold leading-none text-[#171717] sm:text-[10px]">{product.longevity_hours ? String(product.longevity_hours) + 'H' : 'LONG'}</p><p className="mt-1 text-[6px] font-bold uppercase tracking-wider text-[#363239] sm:text-[8px]">Longevity</p></div></div>
                  <div className="h-8 w-px shrink-0 bg-[#d9cdb6] sm:h-10" />
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 pl-2 sm:gap-2.5 sm:pl-3"><Radar className="h-4 w-4 shrink-0 text-[#171717] sm:h-5 sm:w-5" /><div className="min-w-0"><p className="truncate text-[8px] font-extrabold leading-none text-[#171717] sm:text-[10px]">{(product.sillage || 'Strong').toUpperCase()}</p><p className="mt-1 text-[6px] font-bold uppercase tracking-wider text-[#363239] sm:text-[8px]">Projection</p></div></div>
                </div>

                <div className="mt-auto pt-3 sm:pt-4">
                  <Link href={'/product/' + product.slug} className="flex w-full items-center rounded-full border border-[#d7b65a] bg-[#030303] px-2.5 py-3 text-white shadow-[0_5px_16px_rgba(30,20,2,.16)] transition hover:bg-[#17130d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b65a] focus-visible:ring-offset-2 sm:px-3.5 sm:py-3.5">
                    <ShoppingBag className="h-4 w-4 shrink-0 text-[#e3c66d] sm:h-[18px] sm:w-[18px]" /><span className="mx-2 h-5 w-px shrink-0 bg-[#bd9b43] sm:mx-3 sm:h-6" /><span className="flex-1 text-center text-[9px] font-extrabold uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.22em]">Buy Now</span><ArrowRight className="h-4 w-4 shrink-0 text-[#e3c66d] sm:h-[18px] sm:w-[18px]" />
                  </Link>
                  <div className="mt-3 rounded-[15px] border border-[#e2c77d] bg-gradient-to-b from-[#fff8e5] to-[#ffefc7] px-2 py-3 text-center shadow-[0_4px_13px_rgba(156,115,34,.09)] sm:mt-3.5 sm:rounded-[18px] sm:px-3 sm:py-3.5">
                    <p className="text-[6px] font-extrabold uppercase tracking-[0.18em] text-[#68542c] sm:text-[8px] sm:tracking-[0.24em]">Standard sizes · Every fragrance</p>
                    <p className="maria-price-title mt-1 text-[16px] font-bold leading-tight tracking-[-0.035em] text-[#15131a] sm:mt-1.5 sm:text-[21px]">Prices from ₹600</p>
                    <div className="mt-2 grid grid-cols-3 border-t border-[#ddc888] pt-2 sm:mt-3 sm:pt-2.5">{MARIA_VARIANT_PRICES.map((size, i) => <div key={size.sizeMl} className={i ? 'border-l border-[#d8c99f] px-0.5' : 'px-0.5'}><p className="text-[7px] font-bold text-[#29251f] sm:text-[9px]">{size.label}</p><p className="mt-0.5 text-[10px] font-extrabold text-[#17130c] sm:text-[14px]">₹{size.price.toLocaleString('en-IN')}</p></div>)}</div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

import Link from 'next/link'
import { Heart, Search, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MARIA_VARIANT_PRICES } from '@/lib/product-helpers'

export default async function ShopPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('id,slug,name,description,badge,featured,rating,review_count,product_images(image_url,alt_text,sort_order),product_variants(id,label,price,stock,active,size_ml)').eq('active', true).order('featured', { ascending: false }).order('name')
  const products = (data ?? []).map((product) => ({ ...product, variants: (product.product_variants ?? []).filter((v) => v.active).sort((a,b) => (a.size_ml ?? 999) - (b.size_ml ?? 999)), image: (product.product_images ?? []).sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0] }))

  return <main className="container shop-page">
    <section className="shop-hero"><span className="kicker">Maria Signature</span><h1>Find your signature.</h1><p>40% concentration, pure oil perfumes crafted for lasting wear and expressive projection.</p></section>
    <section className="shop-toolbar"><label className="search-box"><Search size={17}/><input placeholder="Search fragrances" /></label><span className="button">{products.length} fragrances</span></section>
    <div className="product-grid">
      {products.map((product) => <article className="product-card" key={product.id}>
        <div className="product-media"><span className="product-badge">{product.badge ?? '40% PURE OIL'}</span><button aria-label={`Save ${product.name}`}><Heart size={18}/></button>{product.image?.image_url ? <img src={product.image.image_url} alt={product.image.alt_text ?? product.name} /> : <div className="product-placeholder">MARIA</div>}</div>
        <div className="product-copy"><span>{product.featured ? 'Featured' : 'Signature Perfume'}</span><h2>{product.name}</h2><p>{product.description ?? '12h long lasting · Good projection'}</p><Link href={`/product/${product.slug}`} className="button primary"><ShoppingBag size={15}/> Buy Now</Link><div className="mt-3 rounded-2xl border border-[#e7c76b]/75 bg-[#fff8e7] px-3 py-3 text-center shadow-sm"><p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#85621d]">Standard sizes · Every fragrance</p><strong className="mt-1 block text-lg font-extrabold text-[#10243a]">Prices from ₹600</strong><div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-bold text-[#526b83]">{MARIA_VARIANT_PRICES.map((size) => <span key={size.sizeMl}>{size.label} · ₹{size.price.toLocaleString('en-IN')}</span>)}</div></div></div>
      </article>)}
    </div>
  </main>
}

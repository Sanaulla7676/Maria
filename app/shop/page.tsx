import Link from 'next/link'
import { Heart, Search, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function ShopPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('id,slug,name,description,badge,featured,rating,review_count,product_images(image_url,alt_text,sort_order),product_variants(id,label,price,stock,active)').eq('active', true).order('featured', { ascending: false }).order('name')
  const products = (data ?? []).map((product) => ({ ...product, variants: (product.product_variants ?? []).filter((v) => v.active).sort((a,b) => (a.price ?? 0) - (b.price ?? 0)), image: (product.product_images ?? []).sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0] }))

  return <main className="container shop-page">
    <section className="shop-hero"><span className="kicker">Maria Signature</span><h1>Find your signature.</h1><p>40% concentration, pure oil perfumes crafted for lasting wear and expressive projection.</p></section>
    <section className="shop-toolbar"><label className="search-box"><Search size={17}/><input placeholder="Search fragrances" /></label><span className="button">{products.length} fragrances</span></section>
    <div className="product-grid">
      {products.map((product) => <article className="product-card" key={product.id}>
        <div className="product-media"><span className="product-badge">{product.badge ?? '40% PURE OIL'}</span><button aria-label={`Save ${product.name}`}><Heart size={18}/></button>{product.image?.image_url ? <img src={product.image.image_url} alt={product.image.alt_text ?? product.name} /> : <div className="product-placeholder">MARIA</div>}</div>
        <div className="product-copy"><span>{product.featured ? 'Featured' : 'Signature Perfume'}</span><h2>{product.name}</h2><p>{product.description ?? '12h long lasting · Good projection'}</p><strong>From ₹{Number(product.variants[0]?.price ?? 0).toLocaleString('en-IN')}</strong><Link href={`/product/${product.slug}`} className="button primary"><ShoppingBag size={15}/> View fragrance</Link></div>
      </article>)}
    </div>
  </main>
}

import Link from 'next/link'
import { Package, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import '../admin.css'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('id, name, slug, active, featured, badge, product_variants(id, label, size_ml, sku, price, stock, active)').order('created_at', { ascending: false })
  const rows = products ?? []
  const lowStock = rows.flatMap((p) => p.product_variants ?? []).filter((v) => v.stock <= 5).length

  return (
    <main className="container admin-page">
      <section className="admin-header">
        <div><span className="kicker">Maria catalog operations</span><h1>Products & inventory</h1><p>Manage fragrances, variants, prices and stock from one workspace.</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link className="button" href="/admin/categories">Categories</Link>
          <Link className="button primary" href="/admin/products/new"><Plus size={16}/> New product</Link>
        </div>
      </section>
      <section className="admin-toolbar">
        <label className="search-box"><Search size={17}/><input placeholder="Search product or SKU" /></label>
        <select defaultValue="all"><option value="all">All products</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="featured">Featured</option></select>
        <button className="button"><SlidersHorizontal size={16}/> Filters</button>
      </section>
      <section className="ops-kpi-grid">
        <div><span>Products</span><strong>{rows.length}</strong></div>
        <div><span>Active</span><strong>{rows.filter((p) => p.active).length}</strong></div>
        <div><span>Low stock variants</span><strong>{lowStock}</strong></div>
      </section>
      <section className="admin-table-wrap">
        <div className="admin-table-head"><h2>Catalog</h2><span>Live database</span></div>
        {rows.length ? rows.map((product) => {
          const variants = product.product_variants ?? []
          return <article className="admin-product-row" key={product.id}>
            <div className="admin-product-main"><div className="admin-product-thumb">MARIA</div><div><strong>{product.name}</strong><span>{product.badge ?? 'Signature perfume'} · {product.slug}</span></div></div>
            <div className="variant-pills">{variants.map((v) => <span key={v.id} className={v.stock <= 5 ? 'variant-pill low' : 'variant-pill'}>{v.size_ml ?? v.label} · ₹{Number(v.price).toLocaleString('en-IN')} · {v.stock} stock</span>)}</div>
            <div className="row-status"><span className={product.active ? 'status success' : 'status'}>{product.active ? 'Active' : 'Hidden'}</span>{product.featured && <span className="status">Featured</span>}</div>
            <Link className="button" href={`/admin/products/${product.id}`}>Manage</Link>
          </article>
        }) : <div className="empty-state"><Package size={40}/><h2>No catalog data yet</h2><p>Add your first Maria fragrance to start inventory management.</p><Link className="button primary" href="/admin/products/new">Create product</Link></div>}
      </section>
    </main>
  )
}

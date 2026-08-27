import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoriesClient } from './CategoriesClient'
import '../admin.css'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id,name,active').order('name')
  const { data: products } = await supabase.from('products').select('category_id')
  const counts = (products ?? []).reduce<Record<string, number>>((acc, p) => {
    if (p.category_id) acc[p.category_id] = (acc[p.category_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <main className="container admin-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px' }}>
      <Link className="back-link" href="/admin/products"><ArrowLeft size={16} /> Products</Link>
      <section className="admin-header">
        <div>
          <span className="kicker">Catalog management</span>
          <h1>Categories</h1>
          <p>Organize your fragrances into browsable collections.</p>
        </div>
      </section>
      <CategoriesClient initialCategories={categories ?? []} counts={counts} />
    </main>
  )
}

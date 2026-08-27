import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import '../../admin.css'
import ProductManager from '../../ProductManager'

export default async function ProductManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="admin-shell">
      <header className="admin-header compact">
        <div>
          <Link className="back-link" href="/admin/products"><ArrowLeft size={16} /> Products</Link>
          <span className="kicker">Product manager</span>
          <h1>Manage fragrance</h1>
          <p>Upload photos, edit variants, notes, pricing and stock.</p>
        </div>
      </header>
      <ProductManager initialProductId={id} />
    </main>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import { primaryImage } from '@/lib/product-helpers'
import ProductDetail from './ProductDetail'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <main className="container py-16">
      <div className="flex items-center gap-2 text-sm text-black/50 mb-8">
        <Link href="/shop" className="hover:text-black/80">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <ProductDetail product={product} image={primaryImage(product)} />
    </main>
  )
}

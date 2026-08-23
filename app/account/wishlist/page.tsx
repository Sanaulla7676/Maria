import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'

export default function WishlistPage() {
  return (
    <main className="container account-page">
      <Link className="back-link" href="/account">← My Maria</Link>
      <section className="account-hero compact"><span className="kicker">Wishlist</span><h1>Fragrances worth remembering.</h1><p>Your saved perfumes will live here once your account is connected to Supabase.</p></section>
      <section className="empty-state"><Heart size={40} strokeWidth={1.4}/><h2>Your wishlist is empty</h2><p>Save a fragrance from any product page and it will appear here.</p><Link className="button primary" href="/shop"><ShoppingBag size={16}/> Browse perfumes</Link></section>
    </main>
  )
}

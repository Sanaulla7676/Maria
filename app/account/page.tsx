'use client'

import Link from 'next/link'
import { Heart, MapPin, Package, Sparkles, UserRound } from 'lucide-react'

const cards = [
  { href: '/account/orders', icon: Package, title: 'My Orders', text: 'Track purchases and payment status.' },
  { href: '/account/wishlist', icon: Heart, title: 'Wishlist', text: 'Keep your favourite fragrances close.' },
  { href: '/account/addresses', icon: MapPin, title: 'Addresses', text: 'Manage delivery addresses.' },
  { href: '/account/profile', icon: UserRound, title: 'Profile', text: 'Update your personal details.' },
  { href: '/account/workshops', icon: Sparkles, title: 'Workshops', text: 'View your Sunday workshop bookings.' },
]

export default function AccountPage() {
  return (
    <main className="container account-page">
      <section className="account-hero">
        <span className="kicker">My Maria</span>
        <h1>Your fragrance journey, in one place.</h1>
        <p>Orders, saved fragrances, addresses and workshop bookings are organised here.</p>
      </section>
      <section className="account-grid">
        {cards.map(({ href, icon: Icon, title, text }) => (
          <Link href={href} className="account-card" key={href}>
            <Icon size={22} strokeWidth={1.7} />
            <h2>{title}</h2>
            <p>{text}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}

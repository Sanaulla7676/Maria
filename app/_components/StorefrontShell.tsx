'use client'

import { UIProvider } from '@/app/_components/ui/UIProvider'
import { Navbar } from '@/app/_components/Navbar'
import { Hero } from '@/app/_components/Hero'
import { BestSellersCarousel } from '@/app/_components/BestSellersCarousel'
import { AboutCredentials } from '@/app/_components/AboutCredentials'
import { EventStallsSection } from '@/app/_components/EventStallsSection'
import { StorefrontMain } from '@/app/_components/StorefrontMain'
import { SuccessStories } from '@/app/_components/SuccessStories'
import { Footer } from '@/app/_components/Footer'
import { ChatWidget } from '@/app/_components/ChatWidget'
import { AuthModal } from '@/app/_components/modals/AuthModal'
import { ProductModal } from '@/app/_components/modals/ProductModal'
import { ScentMatcherModal } from '@/app/_components/modals/ScentMatcherModal'
import { BagModal } from '@/app/_components/modals/BagModal'
import { PackagesModal } from '@/app/_components/modals/PackagesModal'
import { BookingModal } from '@/app/_components/modals/BookingModal'
import { GuaranteeModal } from '@/app/_components/modals/GuaranteeModal'
import type { CartItem, Product } from '@/lib/types'

export function StorefrontShell({
  products,
  userEmail,
  isOwnerUser,
  cart,
  wishlistIds,
  wishlistProducts,
}: {
  products: Product[]
  userEmail: string | null
  isOwnerUser: boolean
  cart: CartItem[]
  wishlistIds: string[]
  wishlistProducts: Product[]
}) {
  const isLoggedIn = !!userEmail

  return (
    <UIProvider>
      <Navbar userEmail={userEmail} isOwnerUser={isOwnerUser} bagCount={cart.length} />
      <Hero />
      <BestSellersCarousel products={products} />
      <AboutCredentials />
      <EventStallsSection />
      <StorefrontMain products={products} isLoggedIn={isLoggedIn} wishlistIds={wishlistIds} />
      <SuccessStories />
      <Footer />
      <ChatWidget />

      <AuthModal />
      <ProductModal isLoggedIn={isLoggedIn} />
      <ScentMatcherModal products={products} isLoggedIn={isLoggedIn} />
      <BagModal cart={cart} wishlist={wishlistProducts} />
      <PackagesModal />
      <BookingModal />
      <GuaranteeModal />
    </UIProvider>
  )
}

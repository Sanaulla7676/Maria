'use client'

import { UIProvider } from '@/app/_components/ui/UIProvider'
import { Navbar } from '@/app/_components/Navbar'
import { ScrollScrubHero } from '@/app/_components/ScrollScrubHero'
import { EditorialCollection } from '@/app/_components/EditorialCollection'
import { EditorialStory } from '@/app/_components/EditorialStory'
import { EditorialEventsTeaser } from '@/app/_components/EditorialEventsTeaser'
import { EditorialMatcherTeaser } from '@/app/_components/EditorialMatcherTeaser'
import { StorefrontMain } from '@/app/_components/StorefrontMain'
import { SuccessStories } from '@/app/_components/SuccessStories'
import { EditorialFooter } from '@/app/_components/EditorialFooter'
import { ChatWidget } from '@/app/_components/ChatWidget'
import { CursorGlow } from '@/app/_components/ui/CursorGlow'
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
      <ScrollScrubHero productCount={products.length} />
      <EditorialCollection products={products} />
      <EditorialStory />
      <EditorialEventsTeaser />
      <EditorialMatcherTeaser />
      <StorefrontMain products={products} isLoggedIn={isLoggedIn} wishlistIds={wishlistIds} />
      <SuccessStories />
      <EditorialFooter />
      <ChatWidget />
      <CursorGlow />

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

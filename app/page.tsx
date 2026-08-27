import { TrustStrip } from '@/app/_components/TrustStrip'
import { StorefrontShell } from '@/app/_components/StorefrontShell'
import { getActiveProducts } from '@/lib/products'
import { getCurrentUser, isOwner } from '@/lib/auth'
import { getCart } from '@/lib/cart-actions'
import { getWishlistProductIds, getWishlistProducts } from '@/app/account/wishlist/actions'

export default async function Home() {
  const [products, user, cart] = await Promise.all([
    getActiveProducts().catch(() => []),
    getCurrentUser().catch(() => null),
    getCart().catch(() => []),
  ])
  const [ownerUser, wishlistIds, wishlistProducts] = await Promise.all([
    user ? isOwner().catch(() => false) : Promise.resolve(false),
    user ? getWishlistProductIds().catch(() => []) : Promise.resolve([]),
    user ? getWishlistProducts().catch(() => []) : Promise.resolve([]),
  ])

  return (
    <>
      <TrustStrip />
      <StorefrontShell
        products={products}
        userEmail={user?.email ?? null}
        isOwnerUser={ownerUser}
        cart={cart}
        wishlistIds={wishlistIds}
        wishlistProducts={wishlistProducts}
      />
    </>
  )
}

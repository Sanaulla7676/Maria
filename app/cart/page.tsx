import { getCart } from '@/lib/cart-actions'
import CartClient from './CartClient'

export default async function CartPage() {
  const items = await getCart()
  return <CartClient initialItems={items} />
}

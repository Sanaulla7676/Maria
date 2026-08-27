import { getCart } from '@/lib/cart-actions'
import CheckoutClient from './CheckoutClient'

export default async function CheckoutPage() {
  const items = await getCart()
  return <CheckoutClient initialItems={items} />
}

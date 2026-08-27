export type ProductImage = {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
}

export type Variant = {
  id: string
  product_id: string
  label: string
  name: string | null
  sku: string | null
  price: number
  stock: number
  active: boolean
  size_ml: number | null
  image_url: string | null
}

export type MainAccord = {
  name: string
  color: string
  percent: number
}

export type Product = {
  id: string
  slug: string
  name: string
  category_id: string | null
  gender: string | null
  family: string | null
  badge: string | null
  description: string | null
  notes: string[]
  active: boolean
  featured: boolean
  rating: number
  review_count: number
  main_accords: MainAccord[]
  longevity_hours: number | null
  sillage: 'Light' | 'Moderate' | 'Strong' | 'Very Strong' | null
  best_daytime: 'day' | 'night' | 'both' | null
  best_season: string[]
  product_images: ProductImage[]
  product_variants: Variant[]
}

export type Category = {
  id: string
  name: string
  active: boolean
}

export type CartItem = {
  id: string
  product_id: string
  variant_id: string
  product_name: string
  variant_label: string
  unit_price: number
  quantity: number
  image_url: string | null
}

export type CustomerOrder = {
  id: string
  user_id: string
  status: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping_fee: number
  total: number
  currency: string
  payment_status: 'pending' | 'submitted' | 'verified' | 'failed' | 'refunded'
  payment_reference: string | null
  upi_id: string | null
  shipping_address: ShippingAddress
  created_at: string
}

export type ShippingAddress = {
  recipient_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
}

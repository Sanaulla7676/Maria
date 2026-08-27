import { getCategories } from '@/lib/products'
import '../../admin.css'
import NewProductForm from './NewProductForm'

export default async function NewProductPage() {
  const categories = await getCategories()
  return <NewProductForm categories={categories} />
}

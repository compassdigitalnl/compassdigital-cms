import ProductDetailPage from './ProductDetailPage'
import type { Product } from '@/payload-types'

export default function ProductDetailWrapper({ product }: { product: Product }) {
  return <ProductDetailPage product={product} />
}

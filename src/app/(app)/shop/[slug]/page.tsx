import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import ProductTemplate1 from './ProductTemplate1'
import type { Product } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 0,
    limit: 1,
    select: {
      title: true,
      shortDescription: true,
      meta: true,
    },
  })

  const product = products[0]

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title:
      (typeof product.meta === 'object' && product.meta?.title) ||
      `${product.title} | Shop`,
    description:
      (typeof product.meta === 'object' && product.meta?.description) ||
      product.shortDescription ||
      `Buy ${product.title} - Professional equipment`,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch product with depth for relationships
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2, // Resolve childProducts, relatedProducts, and their images
    limit: 1,
  })

  const product = products[0] as Product

  if (!product || product.status !== 'published') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar Shop
          </Link>
        </div>
      </div>

      {/* Product Template 1 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductTemplate1 product={product} />
      </div>
    </div>
  )
}

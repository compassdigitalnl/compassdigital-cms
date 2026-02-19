import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import ProductTemplate1 from './ProductTemplate1'
import ProductTemplate2 from './ProductTemplate2'
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

  // Get global template setting from Settings
  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 0,
  })

  // Determine which template to use (from Settings global)
  const template = (settings as any)?.defaultProductTemplate || 'template1'

  // Debug: Log template selection
  console.log('🎨 Product:', product.title)
  console.log('📋 Global template setting:', (settings as any)?.defaultProductTemplate)
  console.log('✅ Using template:', template)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DEBUG: Template Indicator */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          background: template === 'template2' ? '#10B981' : '#3B82F6',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {template === 'template2' ? '🎨 Template 2 - Minimal' : '🏢 Template 1 - Enterprise'}
      </div>

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

      {/* Product Template Switcher */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {template === 'template2' ? (
          <ProductTemplate2 product={product} />
        ) : (
          <ProductTemplate1 product={product} />
        )}
      </div>
    </div>
  )
}

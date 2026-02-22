import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import ProductTemplate1 from './ProductTemplate1'
import ProductTemplate2 from './ProductTemplate2'
import ProductTemplate3 from './ProductTemplate3'
import ShopArchiveTemplate1 from '../ShopArchiveTemplate1'
import type { Product } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugArray } = await params
  const slug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config })

  // 1. Probeer product
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    select: { title: true, shortDescription: true, meta: true },
  })

  if (products[0]) {
    const product = products[0]
    return {
      title:
        (typeof product.meta === 'object' && product.meta?.title) ||
        `${product.title} | Shop`,
      description:
        (typeof product.meta === 'object' && product.meta?.description) ||
        product.shortDescription ||
        `${product.title}`,
    }
  }

  // 2. Probeer categorie
  const { docs: categories } = await payload.find({
    collection: 'product-categories',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })

  if (categories[0]) {
    const category = categories[0]
    return {
      title: `${category.name} | Shop`,
      description: category.description || `Bekijk alle ${category.name} producten`,
    }
  }

  return { title: 'Niet gevonden' }
}

export default async function ShopDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugArray } = await params
  const slug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config })

  // ── 1. Probeer product te vinden ──────────────────────────────
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const product = products[0] as Product | undefined

  if (product && product.status === 'published') {
    // Product gevonden → render product detail page
    let template = 'template1'
    try {
      const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
      template = (settings as any)?.defaultProductTemplate || 'template1'
    } catch (error) {
      console.error('Error fetching settings:', error)
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 transition-colors hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Shop
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {template === 'template3' ? (
            <ProductTemplate3 product={product} />
          ) : template === 'template2' ? (
            <ProductTemplate2 product={product} />
          ) : (
            <ProductTemplate1 product={product} />
          )}
        </div>
      </div>
    )
  }

  // ── 2. Probeer categorie te vinden ────────────────────────────
  const { docs: categories } = await payload.find({
    collection: 'product-categories',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const category = categories[0]

  if (category) {
    // Categorie gevonden → render shop archive gefilterd op categorie
    const { docs: categoryProducts, totalDocs } = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'published' },
        categories: { contains: category.id },
      },
      depth: 2,
      limit: 24,
      sort: '-createdAt',
    })

    return (
      <div className="min-h-screen bg-gray-50">
        <ShopArchiveTemplate1
          products={categoryProducts as Product[]}
          category={category}
          totalProducts={totalDocs}
        />
      </div>
    )
  }

  // ── 3. Niets gevonden ─────────────────────────────────────────
  notFound()
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/branches/shared/components/seo/JsonLdSchema'
import { generateMeta } from '@/utilities/generateMeta'
import type { Page, Product } from '@/payload-types'
import ProductDetailWrapper from '@/branches/ecommerce/components/ProductDetailWrapper'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Try to find a product first
  const products = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (products.docs[0]) {
    const product = products.docs[0]
    return {
      title: `${product.title} - MedEquip Shop`,
      description: product.title,
    }
  }

  // Try to find a category
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (categories.docs[0]) {
    const category = categories.docs[0]
    return {
      title: `${category.name} - MedEquip Shop`,
      description: `Browse ${category.name} products`,
    }
  }

  // Fallback to CMS page
  const pages = await payload.find({
    collection: 'pages',
    limit: 1,
    where: {
      slug: {
        equals: slug === undefined ? 'home' : slug,
      },
    },
  })

  const page = pages.docs[0]

  if (!page) {
    return {}
  }

  return generateMeta({ doc: page })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug = 'home' } = await params
  const payload = await getPayload({ config: configPromise })

  // Try to find a product first (priority 1)
  const products = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  // REDIRECT products to /shop/[slug] for full enterprise template with grouped support
  if (products.docs[0]) {
    const { redirect } = await import('next/navigation')
    redirect(`/shop/${slug}`)
  }

  // Try to find a category (priority 2)
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (categories.docs[0]) {
    // Render category page (redirect to shop for now)
    const category = categories.docs[0]
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-gray-600 mb-8">Browse products in this category</p>
          <a
            href="/shop/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            View All Products
          </a>
        </div>
      </div>
    )
  }

  // Fallback to CMS page (priority 3)
  const pages = await payload.find({
    collection: 'pages',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = pages.docs[0] as Page

  if (!page) {
    return notFound()
  }

  return (
    <article className="pt-16 pb-24">
      <JsonLdSchema page={page} />
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}

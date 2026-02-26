import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/branches/shared/components/seo/JsonLdSchema'
import { generateMeta } from '@/utilities/generateMeta'
import type { Page, Product } from '@/payload-types'
import ProductTemplate1 from '@/branches/ecommerce/templates/products/ProductTemplate1'
import ProductTemplate2 from '@/branches/ecommerce/templates/products/ProductTemplate2'
import ProductTemplate3 from '@/branches/ecommerce/templates/products/ProductTemplate3'
import ShopArchiveTemplate1 from '@/branches/ecommerce/templates/shop/ShopArchiveTemplate1'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TrackRecentlyViewed } from '@/branches/ecommerce/components/shop/RecentlyViewed/TrackRecentlyViewed'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // 1. Try product first (HIGHEST PRIORITY - WooCommerce style)
  const products = await payload.find({
    collection: 'products',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
    select: { title: true, shortDescription: true, meta: true },
  })

  if (products.docs[0]) {
    const product = products.docs[0]
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

  // 2. Try category
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
  })

  if (categories.docs[0]) {
    const category = categories.docs[0]
    return {
      title: `${category.name} | Shop`,
      description: category.description || `Bekijk alle ${category.name} producten`,
    }
  }

  // 3. Try CMS page last (LOWEST PRIORITY - prevents blocking products)
  const pages = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
    select: { title: true, meta: true },
  })

  if (pages.docs[0]) {
    return generateMeta({ doc: pages.docs[0] })
  }

  return { title: 'Niet gevonden' }
}

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug = 'home' } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: configPromise })

  // ── 1. Try Product FIRST (HIGHEST PRIORITY - WooCommerce style) ──
  // This prevents CMS pages from blocking product URLs (e.g. CMS page "laptop" blocking product "laptop")
  const products = await payload.find({
    collection: 'products',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 2,
  })

  const product = products.docs[0] as Product | undefined

  if (product && product.status === 'published') {
    // Get template setting
    let template = 'template1'

    try {
      const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
      template = (settings as any)?.defaultProductTemplate || 'template1'
    } catch (error) {}

    const ProductComponent = template === 'template3'
      ? ProductTemplate3
      : template === 'template2'
        ? ProductTemplate2
        : ProductTemplate1

    const firstImage = product.images?.[0]
    const productImageObj = typeof firstImage === 'object' && firstImage !== null
      ? (typeof (firstImage as any).image === 'object' && (firstImage as any).image !== null
          ? (firstImage as any).image
          : null)
      : null
    const productImageUrl = productImageObj?.url || undefined

    return (
      <div className="min-h-screen">
        <TrackRecentlyViewed
          product={{
            id: String(product.id),
            title: product.title,
            slug: product.slug || slug,
            price: product.price,
            image: productImageUrl,
          }}
        />
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
          <ProductComponent product={product} />
        </div>
      </div>
    )
  }

  // ── 2. Try Category ────────────────────────────────────────────
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const category = categories.docs[0]

  if (category) {
    const categoryPage = parseInt(resolvedSearchParams.page || '1')

    // Fetch products in this category
    const { docs: categoryProducts, totalDocs, totalPages } = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'published' },
        categories: { contains: category.id },
      },
      depth: 2,
      limit: 24,
      page: categoryPage,
      sort: '-createdAt',
    })

    // Fetch subcategories (children of this category)
    let subcategories: Array<{ name: string; slug: string; count: number }> = []
    try {
      const { docs: subcats } = await payload.find({
        collection: 'product-categories',
        where: { parent: { equals: category.id } },
        depth: 0,
        limit: 50,
        sort: 'name',
      })
      subcategories = await Promise.all(
        subcats.map(async (sub: any) => {
          const { totalDocs: count } = await payload.find({
            collection: 'products',
            where: {
              status: { equals: 'published' },
              categories: { contains: sub.id },
            },
            depth: 0,
            limit: 0,
          })
          return { name: sub.name, slug: sub.slug, count }
        }),
      )
      subcategories = subcategories.filter((s) => s.count > 0)
    } catch (error) {}

    // Build breadcrumbs (Home is auto-added by Breadcrumb component)
    const breadcrumbs = [
      { label: 'Shop', href: '/shop' },
    ]

    return (
      <div className="min-h-screen">
        <ShopArchiveTemplate1
          products={categoryProducts as Product[]}
          category={category}
          subcategories={subcategories}
          totalProducts={totalDocs}
          currentPage={categoryPage}
          totalPages={totalPages}
          breadcrumbs={breadcrumbs}
        />
      </div>
    )
  }

  // ── 3. Try CMS Page LAST (LOWEST PRIORITY - fallback) ─────────
  const pages = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const page = pages.docs[0] as Page | undefined

  if (page) {
    return (
      <article className="pt-16 pb-24">
        <JsonLdSchema page={page} />
        <RenderBlocks blocks={page.layout} />
      </article>
    )
  }

  // ── 4. Nothing found ───────────────────────────────────────────
  notFound()
}

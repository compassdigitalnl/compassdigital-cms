import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/branches/shared/components/seo/JsonLdSchema'
import { generateMeta } from '@/utilities/generateMeta'
import type { Page, Product } from '@/payload-types'
import ProductTemplate1 from '@/app/(ecommerce)/shop/[slug]/ProductTemplate1'
import ProductTemplate2 from '@/app/(ecommerce)/shop/[slug]/ProductTemplate2'
import ProductTemplate3 from '@/app/(ecommerce)/shop/[slug]/ProductTemplate3'
import ShopArchiveTemplate1 from '@/app/(ecommerce)/shop/ShopArchiveTemplate1'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Providers } from '@/providers'
import { ThemeProvider } from '@/branches/shared/components/utilities/ThemeProvider'
import { SearchProvider } from '@/branches/shared/components/features/search/search/SearchProvider'
import { MiniCartProvider } from '@/branches/shared/components/ui/MiniCart'
import { ToastProvider } from '@/branches/shared/components/ui/Toast'
import { HeaderClient } from '@/branches/shared/components/layout/header/Header/index.client'
import { Footer } from '@/branches/shared/components/layout/footer/Footer'
import { AdminBar } from '@/branches/shared/components/admin/AdminBar'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // 1. Try CMS page first (highest priority)
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

  // 2. Try product
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

  // 3. Try category
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

  return { title: 'Niet gevonden' }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug = 'home' } = await params
  const payload = await getPayload({ config: configPromise })

  // ── 1. Try CMS Page first (highest priority) ──────────────────
  const pages = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { slug: { equals: slug } },
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

  // ── 2. Try Product ─────────────────────────────────────────────
  const products = await payload.find({
    collection: 'products',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 2,
  })

  const product = products.docs[0] as Product | undefined

  if (product && product.status === 'published') {
    // Get template setting + globals for layout
    let template = 'template1'
    let themeGlobal = null
    let settingsGlobal = null
    let headerGlobal = null

    try {
      const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
      template = (settings as any)?.defaultProductTemplate || 'template1'
      settingsGlobal = settings
    } catch (error) {}

    try {
      themeGlobal = await payload.findGlobal({ slug: 'theme' })
    } catch (error) {}

    try {
      headerGlobal = await payload.findGlobal({ slug: 'header' })
    } catch (error) {}

    const ProductComponent = template === 'template3'
      ? ProductTemplate3
      : template === 'template2'
        ? ProductTemplate2
        : ProductTemplate1

    return (
      <Providers>
        <ThemeProvider theme={themeGlobal}>
          <SearchProvider>
            <ToastProvider>
              <MiniCartProvider>
                <AdminBar />
                <HeaderClient header={headerGlobal} theme={themeGlobal} settings={settingsGlobal} />
                <main className="bg-gray-50">
                  <div className="min-h-screen">
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
                </main>
                <Footer />
              </MiniCartProvider>
            </ToastProvider>
          </SearchProvider>
        </ThemeProvider>
      </Providers>
    )
  }

  // ── 3. Try Category ────────────────────────────────────────────
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const category = categories.docs[0]

  if (category) {
    // Fetch products in this category
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

    // Get globals for layout
    let themeGlobal = null
    let settingsGlobal = null
    let headerGlobal = null

    try {
      themeGlobal = await payload.findGlobal({ slug: 'theme' })
    } catch (error) {}

    try {
      settingsGlobal = await payload.findGlobal({ slug: 'settings' })
    } catch (error) {}

    try {
      headerGlobal = await payload.findGlobal({ slug: 'header' })
    } catch (error) {}

    return (
      <Providers>
        <ThemeProvider theme={themeGlobal}>
          <SearchProvider>
            <ToastProvider>
              <MiniCartProvider>
                <AdminBar />
                <HeaderClient header={headerGlobal} theme={themeGlobal} settings={settingsGlobal} />
                <main className="bg-gray-50">
                  <div className="min-h-screen">
                    <ShopArchiveTemplate1
                      products={categoryProducts as Product[]}
                      category={category}
                      totalProducts={totalDocs}
                    />
                  </div>
                </main>
                <Footer />
              </MiniCartProvider>
            </ToastProvider>
          </SearchProvider>
        </ThemeProvider>
      </Providers>
    )
  }

  // ── 4. Nothing found ───────────────────────────────────────────
  notFound()
}

import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import BrandDetailTemplate1 from '@/branches/ecommerce/templates/brands/BrandDetailTemplate1'
import type { Brand, Product, Media } from '@/payload-types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ============================================
// METADATA
// ============================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'brands',
      where: { slug: { equals: slug } },
      depth: 0,
      limit: 1,
    })

    const brand = docs[0]
    if (!brand) return { title: 'Merk niet gevonden' }

    return {
      title: (brand as any).meta?.title || `${brand.name} - Merken`,
      description: (brand as any).meta?.description || `Ontdek het volledige ${brand.name} assortiment.`,
    }
  } catch {
    return { title: 'Merk niet gevonden' }
  }
}

// ============================================
// HELPERS
// ============================================

function extractPlainText(richText: any): string | null {
  if (!richText?.root?.children) return null
  const texts: string[] = []

  function walk(nodes: any[]) {
    for (const node of nodes) {
      if (node.text) texts.push(node.text)
      if (node.children) walk(node.children)
    }
  }

  walk(richText.root.children)
  return texts.join(' ') || null
}

// ============================================
// PAGE
// ============================================

export default async function MerkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!isFeatureEnabled('brands')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch brand
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: slug } },
    depth: 1, // populate logo + certifications
    limit: 1,
  })

  const brand = docs[0]
  if (!brand) notFound()

  // Fetch product count for this brand
  const { totalDocs: productCount } = await payload.count({
    collection: 'products',
    where: { brand: { equals: brand.id } },
  })

  // Fetch products to determine categories and popular items
  const { docs: brandProducts } = await payload.find({
    collection: 'products',
    where: { brand: { equals: brand.id } },
    depth: 1,
    limit: 100,
    sort: '-createdAt',
  })

  // Extract unique categories from products
  const categoryMap = new Map<string, { name: string; slug: string; icon?: string; productCount: number }>()
  for (const product of brandProducts) {
    const cats = (product as any).categories || []
    for (const cat of cats) {
      if (cat && typeof cat === 'object' && cat.name) {
        const existing = categoryMap.get(String(cat.id))
        if (existing) {
          existing.productCount++
        } else {
          categoryMap.set(String(cat.id), {
            name: cat.name,
            slug: cat.slug || String(cat.id),
            icon: cat.icon || undefined,
            productCount: 1,
          })
        }
      }
    }
  }
  const categories = Array.from(categoryMap.values()).sort((a, b) => b.productCount - a.productCount)

  // Calculate in-stock percentage
  const inStockCount = brandProducts.filter(
    (p: any) => p.stock > 0 || p.stockStatus === 'in-stock',
  ).length
  const inStockPercent = brandProducts.length > 0
    ? Math.round((inStockCount / brandProducts.length) * 100)
    : 0

  // Popular products (first 4 with images)
  const popularProducts = brandProducts.slice(0, 4).map((p: any) => {
    const image = p.featuredImage || p.images?.[0]?.image
    const imageObj = image && typeof image === 'object' ? { url: image.url || '', alt: image.alt || p.name } : undefined

    return {
      id: String(p.id),
      name: p.name,
      slug: p.slug,
      sku: p.sku || '',
      brand: { name: brand.name, slug: brand.slug },
      image: imageObj,
      price: p.price ?? null,
      compareAtPrice: p.compareAtPrice || undefined,
      stock: p.stock ?? 0,
      stockStatus: (p.stockStatus as any) || 'in-stock',
      badges: p.badges || [],
    }
  })

  // Plain text description for hero
  const descriptionPlainText = extractPlainText(brand.description)

  return (
    <BrandDetailTemplate1
      brand={brand as any}
      productCount={productCount}
      categoryCount={categories.length}
      inStockPercent={inStockPercent}
      categories={categories}
      popularProducts={popularProducts}
      descriptionPlainText={descriptionPlainText}
    />
  )
}

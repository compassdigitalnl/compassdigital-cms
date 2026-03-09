import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import BrandDetailTemplate1 from '@/branches/shared/templates/brands/BrandDetailTemplate1'
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

/** Determine stock status for a product, including grouped product logic */
function resolveStockStatus(product: any): 'in-stock' | 'low' | 'out' | 'on-backorder' {
  // For grouped products: check childProducts[].product
  if (product.productType === 'grouped' && product.childProducts?.length > 0) {
    const children = product.childProducts
      .map((c: any) => (typeof c?.product === 'object' ? c.product : null))
      .filter(Boolean)

    if (children.length === 0) return 'out'

    // If ANY child is in stock, the parent is in stock
    const anyInStock = children.some((c: any) => (c.stock ?? 0) > 0)
    if (anyInStock) return 'in-stock'

    // If any child allows backorders
    const anyBackorder = children.some((c: any) => c.backordersAllowed)
    if (anyBackorder) return 'on-backorder'

    return 'out'
  }

  // Simple products
  if (product.stockStatus === 'on-backorder' || (product.backordersAllowed && (product.stock ?? 0) <= 0)) return 'on-backorder'
  if ((product.stock ?? 0) <= 0) return 'out'
  if ((product.stock ?? 0) <= 5) return 'low'
  return 'in-stock'
}

/** Get the effective (lowest) price for a product, including grouped children */
function resolvePrice(product: any): { price: number | null; priceLabel?: string; compareAtPrice?: number } {
  if (product.productType === 'grouped' && product.childProducts?.length > 0) {
    const children = product.childProducts
      .map((c: any) => (typeof c?.product === 'object' ? c.product : null))
      .filter(Boolean)

    const prices = children
      .map((c: any) => c.price ?? null)
      .filter((p: any): p is number => p !== null)

    if (prices.length === 0) return { price: product.price ?? null }

    const lowestPrice = Math.min(...prices)
    return { price: lowestPrice, priceLabel: 'Vanaf' }
  }

  return {
    price: product.price ?? null,
    compareAtPrice: product.compareAtPrice || undefined,
  }
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
    depth: 1,
    limit: 1,
  })

  const brand = docs[0]
  if (!brand) notFound()

  // Fetch product lines (child brands, level 1)
  const { docs: childBrands } = await payload.find({
    collection: 'brands',
    where: {
      parent: { equals: brand.id },
      visible: { equals: true },
    },
    depth: 0,
    limit: 50,
    sort: 'name',
  })

  // Get product counts for product lines
  const productLines = await Promise.all(
    childBrands.map(async (child: any) => {
      try {
        const { totalDocs } = await payload.count({
          collection: 'products',
          where: { brand: { equals: child.id } },
        })
        return {
          id: child.id,
          name: child.name,
          slug: child.slug,
          logo: child.logo,
          productCount: totalDocs,
        }
      } catch {
        return {
          id: child.id,
          name: child.name,
          slug: child.slug,
          logo: child.logo,
          productCount: 0,
        }
      }
    }),
  )

  // Fetch product count for this brand (including child brand products)
  const brandIds = [brand.id, ...childBrands.map((c: any) => c.id)]
  const { totalDocs: productCount } = await payload.count({
    collection: 'products',
    where: {
      brand: { in: brandIds },
    },
  })

  // Fetch products for categories and popular items (depth 2 to get grouped children)
  const { docs: brandProducts } = await payload.find({
    collection: 'products',
    where: {
      brand: { in: brandIds },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  // Extract unique top-level categories from products (max 8)
  const categoryMap = new Map<string, { name: string; slug: string; icon?: string; productCount: number }>()
  for (const product of brandProducts) {
    const cats = (product as any).categories || []
    for (const cat of cats) {
      if (cat && typeof cat === 'object' && cat.name) {
        // Only include top-level categories (no parent)
        if (cat.parent) continue
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
  const categories = Array.from(categoryMap.values())
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 8)

  // Calculate in-stock percentage
  const inStockCount = brandProducts.filter((p: any) => {
    const status = resolveStockStatus(p)
    return status === 'in-stock' || status === 'low'
  }).length
  const inStockPercent = brandProducts.length > 0
    ? Math.round((inStockCount / brandProducts.length) * 100)
    : 0

  // Popular products (first 4)
  const popularProducts = brandProducts.slice(0, 4).map((p: any) => {
    const image = p.featuredImage || p.images?.[0]?.image
    const imageObj = image && typeof image === 'object' ? { url: image.url || '', alt: image.alt || p.name } : undefined
    const { price, priceLabel, compareAtPrice } = resolvePrice(p)
    const stockStatus = resolveStockStatus(p)

    return {
      id: String(p.id),
      name: p.title,
      slug: p.slug,
      sku: p.sku || '',
      brand: { name: brand.name, slug: brand.slug },
      image: imageObj,
      price,
      priceLabel,
      compareAtPrice,
      stock: p.stock ?? 0,
      stockStatus,
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
      productLines={productLines}
      popularProducts={popularProducts}
      descriptionPlainText={descriptionPlainText}
    />
  )
}

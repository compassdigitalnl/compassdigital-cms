import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/features/seo/components/JsonLdSchema'
import { generateMeta } from '@/features/seo/lib/generateMeta'
import type { Page, Product } from '@/payload-types'
import ProductTemplate1 from '@/branches/ecommerce/shared/templates/products/ProductTemplate1'
import ProductTemplate2 from '@/branches/ecommerce/shared/templates/products/ProductTemplate2'
import ProductTemplate3 from '@/branches/ecommerce/shared/templates/products/ProductTemplate3'
import ProductTemplate4 from '@/branches/ecommerce/shared/templates/products/ProductTemplate4'
import ShopArchiveTemplate1 from '@/branches/ecommerce/shared/templates/shop/ShopArchiveTemplate1'
import { TrackRecentlyViewed } from '@/branches/ecommerce/shared/components/shop/RecentlyViewed/TrackRecentlyViewed'
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { isFeatureEnabled } from '@/lib/tenant/features'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ── Helper: get category ancestor chain ────────────────────────────
async function getCategoryAncestors(
  payload: any,
  categoryId: number | string,
): Promise<Array<{ id: number; name: string; slug: string }>> {
  const chain: Array<{ id: number; name: string; slug: string }> = []
  let currentId: number | string | null = categoryId
  const seen = new Set<number | string>() // prevent infinite loops

  while (currentId && !seen.has(currentId)) {
    seen.add(currentId)
    try {
      const cat: any = await payload.findByID({
        collection: 'product-categories',
        id: currentId,
        depth: 0,
      })
      if (!cat) break
      chain.unshift({ id: cat.id, name: cat.name, slug: cat.slug })
      currentId = cat.parent || null
    } catch {
      break
    }
  }

  return chain
}

// ── Helper: build full category URL from ancestors ─────────────────
function buildCategoryUrl(ancestors: Array<{ slug: string }>): string {
  return '/' + ancestors.map((a) => a.slug).join('/')
}

// ── Helper: build breadcrumbs from category ancestors ──────────────
function buildCategoryBreadcrumbs(
  ancestors: Array<{ name: string; slug: string }>,
): Array<{ label: string; href: string }> {
  return ancestors.map((ancestor, idx) => ({
    label: ancestor.name,
    href: '/' + ancestors.slice(0, idx + 1).map((a) => a.slug).join('/'),
  }))
}

// ── Helper: get experiences route config from settings ───────────────
async function getExperiencesRouteConfig(payload: any): Promise<{
  slug: string
  label: string
} | null> {
  if (!isFeatureEnabled('experiences')) return null
  try {
    const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
    const slug = (settings as any)?.experiencesRouteSlug
    if (!slug) return null
    return {
      slug,
      label: (settings as any)?.experiencesRouteLabel || slug.charAt(0).toUpperCase() + slug.slice(1),
    }
  } catch {
    return null
  }
}

// ── METADATA ───────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug: slugSegments } = await params
  const lastSlug = slugSegments[slugSegments.length - 1]
  const payload = await getPayload({ config: configPromise })

  // 0. Try Experiences (configurable route prefix)
  const expConfig = await getExperiencesRouteConfig(payload)
  if (expConfig && slugSegments[0] === expConfig.slug) {
    if (slugSegments.length === 1) {
      // Archive page
      return {
        title: `${expConfig.label} | ${(await payload.findGlobal({ slug: 'settings', depth: 0 }) as any)?.companyName || ''}`.trim(),
        description: `Bekijk alle ${expConfig.label.toLowerCase()}`,
      }
    }
    if (slugSegments.length === 2) {
      // Detail page
      const experiences = await payload.find({
        collection: 'experiences',
        limit: 1,
        where: { slug: { equals: slugSegments[1] } },
        depth: 0,
        select: { title: true, shortDescription: true, meta: true },
      })
      if (experiences.docs[0]) {
        const exp = experiences.docs[0] as any
        const meta = typeof exp.meta === 'object' ? exp.meta : null
        return {
          title: meta?.title || `${exp.title} | ${expConfig.label}`,
          description: meta?.description || exp.shortDescription || exp.title,
        }
      }
    }
  }

  // 1. Try product (only single-segment URLs)
  if (slugSegments.length === 1) {
    const products = await payload.find({
      collection: 'products',
      limit: 1,
      where: { slug: { equals: lastSlug } },
      depth: 0,
      select: { title: true, shortDescription: true, meta: true, hideFromCatalog: true },
    })

    if (products.docs[0]) {
      const product = products.docs[0]
      const meta = typeof product.meta === 'object' ? product.meta : null

      // Determine canonical URL
      let canonicalUrl = meta?.canonicalUrl || undefined
      if (!canonicalUrl) {
        // Auto-canonical: if this product is a child of a grouped product, point to parent
        // Use raw SQL via drizzle since Payload's array.relationship filter is unreliable
        try {
          const parentResult: any = await (payload.db as any).drizzle.execute(
            (await import('drizzle-orm')).sql`
              SELECT p.slug FROM products p
              INNER JOIN products_child_products cp ON cp._parent_id = p.id
              WHERE cp.product_id = ${product.id}
                AND p.product_type = 'grouped'
                AND p.status = 'published'
              LIMIT 1
            `
          )
          const parentSlug = parentResult?.rows?.[0]?.slug
          if (parentSlug) {
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
            canonicalUrl = `${baseUrl}/${parentSlug}`
          }
        } catch (e) {
          // Silently fail — canonical is optional
        }
      }

      return {
        title: meta?.title || `${product.title} | Shop`,
        description: meta?.description || product.shortDescription || `${product.title}`,
        ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
      }
    }
  }

  // 2. Try category (by last slug segment)
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 1,
    where: { slug: { equals: lastSlug } },
    depth: 0,
  })

  if (categories.docs[0]) {
    const category = categories.docs[0]
    return {
      title: `${category.name} | Shop`,
      description: category.description || `Bekijk alle ${category.name} producten`,
    }
  }

  // 3. Try CMS page (only single-segment URLs)
  if (slugSegments.length === 1) {
    const pages = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: lastSlug } },
      depth: 0,
      select: { title: true, meta: true },
    })

    if (pages.docs[0]) {
      return generateMeta({ doc: pages.docs[0] as any })
    }
  }

  return { title: 'Niet gevonden' }
}

// ── PAGE ───────────────────────────────────────────────────────────
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug: slugSegments } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: configPromise })

  const lastSlug = slugSegments[slugSegments.length - 1]

  // ── 0. Try Experiences (configurable route prefix) ─────────────
  const expRouteConfig = await getExperiencesRouteConfig(payload)
  if (expRouteConfig && slugSegments[0] === expRouteConfig.slug) {
    if (slugSegments.length === 1) {
      // Archive page
      const { ExperienceArchiveTemplate } = await import(
        '@/branches/experiences/templates/ExperienceArchive'
      )
      return (
        <ExperienceArchiveTemplate
          routeSlug={expRouteConfig.slug}
          routeLabel={expRouteConfig.label}
        />
      )
    }

    if (slugSegments.length === 2) {
      // Detail page
      const experiences = await payload.find({
        collection: 'experiences',
        limit: 1,
        where: {
          slug: { equals: slugSegments[1] },
          status: { equals: 'published' },
        },
        depth: 2,
      })

      const experience = experiences.docs[0]
      if (experience) {
        const { ExperienceDetailTemplate } = await import(
          '@/branches/experiences/templates/ExperienceDetail'
        )
        return (
          <ExperienceDetailTemplate
            experience={experience}
            routeSlug={expRouteConfig.slug}
            routeLabel={expRouteConfig.label}
          />
        )
      }
    }

    // No match under experiences prefix → 404
    notFound()
  }

  // ── 1. Try Product FIRST (only single-segment URLs) ──────────────
  if (slugSegments.length === 1) {
    const products = await payload.find({
      collection: 'products',
      limit: 1,
      where: { slug: { equals: lastSlug } },
      depth: 2,
    })

    const product = products.docs[0] as Product | undefined

    if (product && product.status === 'published') {
      // Get template setting
      let template = 'template1'
      try {
        const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
        template = (settings as any)?.defaultProductTemplate || 'template1'
      } catch {}

      const ProductComponent =
        template === 'template4'
          ? ProductTemplate4
          : template === 'template3'
            ? ProductTemplate3
            : template === 'template2'
              ? ProductTemplate2
              : ProductTemplate1

      // Extract image URL
      const firstImage = product.images?.[0]
      let productImageUrl: string | undefined =
        typeof firstImage === 'object' && firstImage !== null
          ? (firstImage as any)?.url || undefined
          : undefined

      // Fallback: extract image URL from tags
      if (!productImageUrl && Array.isArray(product.tags)) {
        for (const tagEntry of product.tags) {
          const tag =
            typeof tagEntry === 'object' && tagEntry !== null ? (tagEntry as any).tag : tagEntry
          if (typeof tag === 'string' && tag.startsWith('img:')) {
            productImageUrl = tag.slice(4)
            break
          }
        }
      }

      // Check if this product is a child of a grouped product
      let parentGroupedProduct: Product | null = null
      if (product.productType === 'simple') {
        try {
          // Find parent via join table (Payload's array.relationship filter is unreliable)
          const { sql } = await import('drizzle-orm')
          const parentResult: any = await (payload.db as any).drizzle.execute(
            sql`SELECT p.id FROM products p
                INNER JOIN products_child_products cp ON cp._parent_id = p.id
                WHERE cp.product_id = ${product.id}
                  AND p.product_type = 'grouped'
                  AND p.status = 'published'
                LIMIT 1`
          )
          const parentId = parentResult?.rows?.[0]?.id
          if (parentId) {
            const parentDoc = await payload.findByID({
              collection: 'products',
              id: parentId,
              depth: 2,
            })
            if (parentDoc) {
              parentGroupedProduct = parentDoc as Product
            }
          }
        } catch (e) {
          // Silently fail — grouped table is optional enhancement
        }
      }

      // Build breadcrumbs from product's DEEPEST category hierarchy
      let productBreadcrumbs: Array<{ label: string; href: string }> = []
      // Use parent product's categories for breadcrumbs if this is a child
      const breadcrumbSource = parentGroupedProduct || product
      if (breadcrumbSource.categories && Array.isArray(breadcrumbSource.categories)) {
        let deepestChain: Array<{ id: number; name: string; slug: string }> = []
        for (const catRef of breadcrumbSource.categories) {
          const catId = typeof catRef === 'object' && catRef !== null ? (catRef as any).id : catRef
          if (catId) {
            const ancestors = await getCategoryAncestors(payload, catId)
            if (ancestors.length > deepestChain.length) {
              deepestChain = ancestors
            }
          }
        }
        if (deepestChain.length > 0) {
          productBreadcrumbs = buildCategoryBreadcrumbs(deepestChain)
        }
      }

      // If child of grouped product, add parent to breadcrumbs
      if (parentGroupedProduct) {
        productBreadcrumbs.push({
          label: parentGroupedProduct.title,
          href: `/${parentGroupedProduct.slug}`,
        })
      }

      return (
        <div className="min-h-screen">
          <TrackRecentlyViewed
            product={{
              id: String(product.id),
              title: product.title,
              slug: product.slug || lastSlug,
              price: product.price ?? 0,
              image: productImageUrl,
            }}
          />
          <div className="px-4" style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}>
            <Breadcrumbs items={productBreadcrumbs} currentPage={product.title} />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            {parentGroupedProduct ? (
              <ProductComponent product={parentGroupedProduct} defaultSelectedChildId={product.id} />
            ) : (
              <ProductComponent product={product} />
            )}
          </div>
        </div>
      )
    }
  }

  // ── 2. Try Category (by last slug segment) ───────────────────────
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 1,
    where: { slug: { equals: lastSlug } },
    depth: 1,
  })

  const category = categories.docs[0]

  if (category) {
    const categoryPage = parseInt(resolvedSearchParams.page || '1')

    // Get full ancestor chain for this category
    const ancestors = await getCategoryAncestors(payload, category.id)
    const categoryFullPath = buildCategoryUrl(ancestors)

    // Fetch products in this category (exclude hidden from catalog)
    const { docs: categoryProducts, totalDocs, totalPages } = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'published' },
        categories: { contains: category.id },
        hideFromCatalog: { not_equals: true },
      },
      depth: 1,
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
          // Subcategory link = current category path + sub slug
          return { name: sub.name, slug: `${categoryFullPath}/${sub.slug}`.replace(/^\//, ''), count }
        }),
      )
      subcategories = subcategories.filter((s) => s.count > 0)
    } catch {}

    // Build breadcrumbs from ancestor chain (exclude current category — it's the currentPage)
    const breadcrumbAncestors = ancestors.slice(0, -1)
    const breadcrumbs = buildCategoryBreadcrumbs(breadcrumbAncestors)

    return (
      <div className="min-h-screen">
        <ShopArchiveTemplate1
          products={categoryProducts as Product[]}
          category={{
            id: String(category.id),
            name: category.name,
            slug: categoryFullPath.replace(/^\//, ''),
            description: category.description || undefined,
            icon: category.icon || undefined,
          }}
          subcategories={subcategories}
          totalProducts={totalDocs}
          currentPage={categoryPage}
          totalPages={totalPages}
          breadcrumbs={breadcrumbs}
          categoryContent={(category as any).content || undefined}
        />
      </div>
    )
  }

  // ── 3. Try CMS Page LAST (only single-segment URLs) ──────────────
  if (slugSegments.length === 1) {
    const pages = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: lastSlug } },
      depth: 1,
    })

    const page = pages.docs[0] as Page | undefined

    if (page) {
      return (
        <article className="pt-16 pb-24">
          <JsonLdSchema page={page} />
          <RenderBlocks blocks={page.layout || []} />
        </article>
      )
    }
  }

  // ── 4. Nothing found ─────────────────────────────────────────────
  notFound()
}

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Product } from '@/payload-types'
import ShopArchiveTemplate1 from '@/branches/ecommerce/templates/shop/ShopArchiveTemplate1'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Shop - Professional Equipment',
  description: 'Browse our complete equipment catalog',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>
}) {
  if (!isFeatureEnabled('shop')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })

  // Build query
  const where: any = { status: { equals: 'published' } }
  if (params.category) {
    where.categories = { contains: params.category }
  }
  if (params.search) {
    where.or = [
      { title: { contains: params.search } },
      { shortDescription: { contains: params.search } },
      { sku: { contains: params.search } },
    ]
  }

  // Pagination
  const page = parseInt(params.page || '1')
  const limit = 24

  // Fetch products
  const { docs: products, totalDocs, totalPages } = await payload.find({
    collection: 'products',
    where,
    depth: 2,
    limit,
    page,
    sort: '-createdAt',
  })

  // Fetch category if filtered
  let category = null
  if (params.category) {
    try {
      category = await payload.findByID({
        collection: 'product-categories',
        id: params.category,
        depth: 1,
      })
    } catch (error) {
      console.log('Category not found:', params.category)
    }
  }

  // Fetch subcategories (children of current category, or top-level if no category)
  let subcategories: Array<{ name: string; slug: string; count: number }> = []
  try {
    const subcatWhere: any = params.category
      ? { parent: { equals: params.category } }
      : { parent: { exists: false } }

    const { docs: subcats } = await payload.find({
      collection: 'product-categories',
      where: subcatWhere,
      depth: 0,
      limit: 50,
      sort: 'name',
    })

    // Get product count per subcategory
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

    // Filter out empty subcategories
    subcategories = subcategories.filter((s) => s.count > 0)
  } catch (error) {
    console.warn('Error fetching subcategories:', error)
  }

  // Build breadcrumbs
  // If no category: breadcrumbs=[] and currentPage='Shop' (rendered by template)
  // If category: breadcrumbs=[Shop] and currentPage=category.name
  const breadcrumbs = category ? [{ label: 'Shop', href: '/shop' }] : []

  // Fetch settings for filter ordering
  let shopFilterOrder: any[] = []
  try {
    const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
    shopFilterOrder = (settings as any)?.shopFilterOrder || []
  } catch (error) {
    console.warn('Could not fetch shop filter order settings:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopArchiveTemplate1
        products={products as Product[]}
        category={category ? {
          id: String(category.id),
          name: category.name,
          slug: category.slug,
          description: category.description || undefined,
          icon: category.icon || undefined,
        } : undefined}
        subcategories={subcategories}
        totalProducts={totalDocs}
        currentPage={page}
        totalPages={totalPages}
        breadcrumbs={breadcrumbs}
        shopFilterOrder={shopFilterOrder}
      />
    </div>
  )
}

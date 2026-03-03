import { getPayload } from 'payload'
import config from '@payload-config'
import ShopArchiveTemplate1 from '@/branches/ecommerce/templates/shop/ShopArchiveTemplate1'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  // Product search is handled client-side via Meilisearch.
  // Server only provides: category info + subcategory names + settings.

  // Fetch category if filtered
  let category = null
  if (params.category) {
    try {
      category = await payload.findByID({
        collection: 'product-categories',
        id: params.category,
        depth: 0,
      })
    } catch (error) {
      console.log('Category not found:', params.category)
    }
  }

  // Fetch subcategories (names only — no product count queries!)
  // Counts will come from Meilisearch categoryIds facet on client side
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

    // No per-category count queries — just pass names with count=0
    // The template/Meilisearch will handle counts
    subcategories = subcats.map((sub: any) => ({
      name: sub.name,
      slug: sub.slug,
      count: 0,
    }))
  } catch (error) {
    console.warn('Error fetching subcategories:', error)
  }

  // Breadcrumbs
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
        products={[]}
        category={category ? {
          id: String(category.id),
          name: category.name,
          slug: category.slug,
          description: category.description || undefined,
          icon: category.icon || undefined,
        } : undefined}
        subcategories={subcategories}
        totalProducts={0}
        breadcrumbs={breadcrumbs}
        shopFilterOrder={shopFilterOrder}
      />
    </div>
  )
}

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Product } from '@/payload-types'
import ShopArchiveTemplate1 from './ShopArchiveTemplate1'

export const metadata = {
  title: 'Shop - Professional Equipment',
  description: 'Browse our complete equipment catalog',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>
}) {
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
  const offset = (page - 1) * limit

  // Fetch products
  const { docs: products, totalDocs } = await payload.find({
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
        depth: 0,
      })
    } catch (error) {
      console.log('Category not found:', params.category)
    }
  }

  // Get global template setting from Settings
  let settings
  let template = 'shoparchivetemplate1' // Default fallback

  try {
    settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })
    // Safely get template setting with fallback
    template = (settings as any)?.defaultShopArchiveTemplate || 'shoparchivetemplate1'
  } catch (error) {
    console.error('⚠️ Error fetching settings, using default template:', error)
    template = 'shoparchivetemplate1'
  }

  // Debug: Log template selection
  console.log('🛒 Shop Archive Page')
  console.log('📋 Global shop archive template setting:', (settings as any)?.defaultShopArchiveTemplate)
  console.log('✅ Using template:', template)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Archive Template Switcher */}
      {/* Template 2 and 3 will be added here later */}
      <ShopArchiveTemplate1 products={products as Product[]} category={category} totalProducts={totalDocs} />
    </div>
  )
}

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireFeature } from '@/lib/tenant/featureGuard'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { VendorDetailTemplate } from '@/branches/marketplace/templates/VendorDetailTemplate'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const vendor = await payload.find({
    collection: 'vendors',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!vendor.docs[0]) {
    return { title: 'Leverancier niet gevonden' }
  }

  const v = vendor.docs[0]

  return {
    title: v.meta?.title || `${v.name} — Leverancier`,
    description:
      v.meta?.description || v.tagline || `Ontdek ${v.name}, een van onze partners.` || undefined,
    openGraph: {
      title: v.meta?.title || v.name,
      description: v.meta?.description || v.tagline || undefined,
      images: v.meta?.image
        ? [
            {
              url:
                typeof v.meta.image === 'string'
                  ? v.meta.image
                  : typeof v.meta.image === 'object' && v.meta.image !== null && 'url' in v.meta.image
                    ? (v.meta.image.url ?? '/og-image.jpg')
                    : '/og-image.jpg',
            },
          ]
        : undefined,
    },
  }
}

export default async function VendorDetailPage({ params }: Props) {
  const { slug } = await params
  if (!isFeatureEnabled('shop')) notFound()
  requireFeature('vendors')

  const payload = await getPayload({ config })

  const vendorData = await payload.find({
    collection: 'vendors',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  if (!vendorData.docs[0]) {
    notFound()
  }

  const vendor = vendorData.docs[0]

  // Fetch products with this vendor
  let products: any[] = []
  try {
    const productsData = await payload.find({
      collection: 'products',
      where: { vendor: { equals: vendor.id } },
      depth: 1,
      limit: 6,
      sort: '-featured,title',
    })
    products = productsData.docs
  } catch {
    // vendor field may not exist yet
  }

  // Fetch approved reviews
  const reviewsData = await payload.find({
    collection: 'vendor-reviews',
    where: {
      vendor: { equals: vendor.id },
      isApproved: { equals: true },
    },
    depth: 0,
    limit: 10,
    sort: '-createdAt',
  })

  // Fetch upcoming workshops
  let workshops: any[] = []
  try {
    const workshopsData = await payload.find({
      collection: 'workshops',
      where: {
        vendor: { equals: vendor.id },
        status: { in: ['upcoming', 'open', 'almost-full'] },
      },
      depth: 0,
      limit: 5,
      sort: 'date',
    })
    workshops = workshopsData.docs
  } catch {
    // Workshops collection might not exist
  }

  return (
    <VendorDetailTemplate
      vendor={vendor}
      products={products}
      reviews={reviewsData.docs}
      workshops={workshops}
    />
  )
}

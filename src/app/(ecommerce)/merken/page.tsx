import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import BrandsArchiveTemplate1 from '@/branches/ecommerce/templates/brands/BrandsArchiveTemplate1'
import type { Brand, Media } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Merken - Alle merken in ons assortiment',
  description: 'Ontdek alle merken in ons assortiment. Van toonaangevende fabrikanten tot gespecialiseerde productlijnen.',
}

export default async function MerkenPage() {
  if (!isFeatureEnabled('brands')) notFound()

  const payload = await getPayload({ config })

  // Fetch all visible brands (level 0 = manufacturers)
  const { docs: allBrands } = await payload.find({
    collection: 'brands',
    where: {
      visible: { equals: true },
      level: { equals: 0 },
    },
    depth: 1, // populate logo
    limit: 500,
    sort: 'name',
  })

  // Fetch featured brands
  const featuredBrands = allBrands.filter((b: any) => b.featured)

  // Get product counts per brand (batch query)
  const brandsWithCounts = await Promise.all(
    allBrands.map(async (brand: any) => {
      try {
        const { totalDocs } = await payload.count({
          collection: 'products',
          where: {
            brand: { equals: brand.id },
          },
        })
        return { ...brand, productCount: totalDocs }
      } catch {
        return { ...brand, productCount: 0 }
      }
    }),
  )

  const featuredWithCounts = brandsWithCounts.filter((b) => b.featured)

  return (
    <BrandsArchiveTemplate1
      brands={brandsWithCounts}
      featuredBrands={featuredWithCounts}
    />
  )
}

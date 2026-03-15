import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireFeature } from '@/lib/tenant/featureGuard'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { VendorArchiveTemplate } from '@/branches/marketplace/templates/VendorArchiveTemplate'

export const metadata: Metadata = {
  title: 'Leveranciers — Overzicht van onze partners',
  description:
    'Ontdek onze leveranciers en partners. Vind uw leverancier, bekijk hun assortiment en bestel direct via ons platform.',
}

export default async function VendorsPage() {
  if (!isFeatureEnabled('shop')) notFound()
  requireFeature('vendors')

  const payload = await getPayload({ config })

  const vendorsData = await payload.find({
    collection: 'vendors',
    depth: 2,
    limit: 100,
    sort: '-isFeatured,-isPremium,order,name',
  })

  const allVendors = vendorsData.docs
  const totalVendors = allVendors.length
  const totalProducts = allVendors.reduce((sum, v) => sum + (v.stats?.productCount || 0), 0)
  const averageRating =
    allVendors.reduce((sum, v) => sum + (v.stats?.rating || 0), 0) / (totalVendors || 1)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" style={{ color: 'var(--color-text-muted)' }}>
            Home
          </Link>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Leveranciers</span>
        </nav>
      </div>

      <VendorArchiveTemplate
        vendors={allVendors}
        totalVendors={totalVendors}
        totalProducts={totalProducts}
        averageRating={averageRating}
      />
    </div>
  )
}

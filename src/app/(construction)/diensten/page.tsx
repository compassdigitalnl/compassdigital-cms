/**
 * Construction Services Overview Page
 *
 * Displays all active construction services with filtering and search.
 * Route: /diensten
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { ConstructionService } from '@/payload-types'
import { ServiceCard } from '@/branches/construction/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onze Diensten - Bouwbedrijf',
  description: 'Ontdek ons complete aanbod van bouwdiensten. Van nieuwbouw tot renovatie en aanbouw.',
}

interface DienstenPageProps {
  searchParams: Promise<{
    type?: string
    search?: string
  }>
}

export default async function DienstenPage({ searchParams }: DienstenPageProps) {
  const params = await searchParams
  const payload = await getPayload({ config })

  // Build query
  const where: any = { status: { equals: 'active' } }

  // Filter by service type
  if (params.type) {
    where.serviceType = { equals: params.type }
  }

  // Search in title/description
  if (params.search) {
    where.or = [
      { title: { contains: params.search } },
      { shortDescription: { contains: params.search } },
      { description: { contains: params.search } },
    ]
  }

  // Fetch services
  const { docs: services } = await payload.find({
    collection: 'construction-services',
    where,
    depth: 1,
    limit: 50,
    sort: 'order',
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Onze Diensten</h1>
        <p className="text-xl text-gray-600">
          Van nieuwbouw tot renovatie - wij helpen u bij elk bouwproject
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <FilterButton label="Alle diensten" value="" currentType={params.type} />
          <FilterButton label="Particulier" value="residential" currentType={params.type} />
          <FilterButton label="Zakelijk" value="commercial" currentType={params.type} />
          <FilterButton label="Beiden" value="both" currentType={params.type} />
        </div>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service as ConstructionService}
                variant="default"
                showCTA
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Geen diensten gevonden</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-16 p-8 bg-gray-100 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Niet gevonden wat u zoekt?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Vraag vrijblijvend een offerte aan en bespreek uw project met onze specialisten.
        </p>
        <a
          href="/offerte-aanvragen/"
          className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Offerte aanvragen
        </a>
      </div>
    </div>
  )
}

// Filter button component
function FilterButton({
  label,
  value,
  currentType,
}: {
  label: string
  value: string
  currentType?: string
}) {
  const isActive = currentType === value || (!currentType && !value)
  const href = value ? `/diensten?type=${value}` : '/diensten'

  return (
    <a
      href={href}
      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </a>
  )
}

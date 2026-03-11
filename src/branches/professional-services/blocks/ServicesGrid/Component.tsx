/**
 * ProfessionalServicesGridComponent - Services grid block (SERVER COMPONENT)
 */

import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Icon } from '@/branches/shared/components/common/Icon'
import { ServiceCard } from '@/branches/professional-services/components/ServiceCard'
import type { ServicesGridProps, ProfessionalService } from './types'

export async function ProfessionalServicesGridComponent(props: ServicesGridProps) {
  const {
    heading,
    servicesSource = 'auto',
    services: manualServices,
    limit = 6,
    columns = '3',
  } = props

  let services: ProfessionalService[] = []

  if (servicesSource === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'professional-services',
      where: { status: { equals: 'published' } },
      limit: limit || 6,
      sort: 'title',
    })
    services = result.docs
  } else if (servicesSource === 'manual' && manualServices) {
    if (Array.isArray(manualServices)) {
      services = manualServices.filter(
        (service): service is ProfessionalService =>
          typeof service === 'object' && service !== null,
      )

      if (services.length === 0 && manualServices.length > 0) {
        const payload = await getPayload({ config })
        const ids = manualServices.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'professional-services',
            where: { id: { in: ids } },
          })
          services = result.docs
        }
      }
    }
  }

  if (services.length === 0) {
    return null
  }

  const gridColsClasses = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  const gridClass = gridColsClasses[columns || '3'] || gridColsClasses['3']

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4">
      <div className="container mx-auto">
        {heading && (
          <div className="text-center mb-12">
            {heading.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-glow border border-primary/20 rounded-full text-sm text-primary font-semibold mb-4">
                {heading.badgeIcon && <Icon name={heading.badgeIcon as any} size={16} />}
                <span>{heading.badge}</span>
              </div>
            )}

            {heading.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-color mb-4">
                {heading.title}
              </h2>
            )}

            {heading.description && (
              <p className="text-lg text-grey-mid max-w-3xl mx-auto">{heading.description}</p>
            )}
          </div>
        )}

        <div className={`grid ${gridClass} gap-6`}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} showCTA={true} />
          ))}
        </div>
      </div>
    </section>
  )
}

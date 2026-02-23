/**
 * Services Component - 100% Theme Variable Compliant
 *
 * Refactored from inline styles with fallbacks and hover handlers
 * to theme variables. All colors now use CSS variables from ThemeProvider.
 */
'use client'

import React from 'react'
import type { FeaturesBlock } from '@/payload-types'

export const ServicesBlockComponent: React.FC<FeaturesBlock> = ({ heading, intro, source, services, features, layout }) => {
  // Determine which data source to use
  const serviceData = React.useMemo(() => {
    if (source === 'collection' && services && Array.isArray(services)) {
      // Collection mode: transform Service objects to match features structure
      return services.map((service) => {
        if (typeof service === 'object' && service !== null && 'name' in service) {
          return {
            name: service.name,
            description: service.description || '',
            iconType: service.iconType,
            iconName: service.iconName,
            iconUpload: service.iconUpload,
            link: service.link,
          }
        }
        return null
      }).filter(Boolean)
    }
    // Manual mode: use features array
    return features || []
  }, [source, services, features])

  return (
    <section className="services py-16 px-4">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-12 max-w-2xl mx-auto">{intro}</p>}

        <div className={`grid gap-8 ${layout === 'grid-2' ? 'md:grid-cols-2' : layout === 'grid-4' ? 'md:grid-cols-4' : layout === 'grid-5' ? 'md:grid-cols-5' : layout === 'grid-6' ? 'md:grid-cols-6' : layout === 'horizontal' ? 'md:grid-cols-6' : 'md:grid-cols-3'}`}>
          {serviceData?.map((service, index) => (
            <div
              key={index}
              className="service-card p-6 border border-primary rounded-lg transition-all duration-300 hover:bg-secondary hover:text-white hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
              <p className="opacity-90">{service.description}</p>
              {service.link && (
                <a
                  href={service.link}
                  className="mt-4 inline-block font-semibold text-primary hover:underline"
                >
                  Meer info →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

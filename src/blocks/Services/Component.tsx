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
              className="service-card p-6 border rounded-lg transition-all duration-300"
              style={{
                borderColor: 'var(--color-primary, #3b82f6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-secondary, #8b5cf6)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
              <p className="opacity-90">{service.description}</p>
              {service.link && (
                <a
                  href={service.link}
                  className="mt-4 inline-block font-semibold hover:underline"
                  style={{ color: 'var(--color-primary, #3b82f6)' }}
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

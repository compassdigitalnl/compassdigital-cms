import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ExperienceCard } from '@/branches/experiences/components/archive/ExperienceCard'

export async function ExperienceGridComponent(props: any) {
  const {
    heading,
    source = 'auto',
    experiences: manualExperiences,
    category: filterCategory,
    showFilters = false,
    columns = '3',
    limit = 12,
  } = props

  const payload = await getPayload({ config })
  let experiences: any[] = []

  if (source === 'manual' && manualExperiences) {
    experiences = Array.isArray(manualExperiences)
      ? manualExperiences.filter((e: any) => typeof e === 'object' && e !== null)
      : []
    // Resolve IDs if needed
    if (experiences.length === 0 && Array.isArray(manualExperiences) && manualExperiences.length > 0) {
      const ids = manualExperiences.filter((id: any) => typeof id === 'number')
      if (ids.length > 0) {
        const result = await payload.find({ collection: 'experiences', where: { id: { in: ids } } })
        experiences = result.docs
      }
    }
  } else if (source === 'featured') {
    const result = await payload.find({
      collection: 'experiences',
      where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
      limit,
      sort: '-createdAt',
    })
    experiences = result.docs
  } else if (source === 'category' && filterCategory) {
    const catId = typeof filterCategory === 'object' ? filterCategory.id : filterCategory
    const result = await payload.find({
      collection: 'experiences',
      where: { and: [{ status: { equals: 'published' } }, { category: { equals: catId } }] },
      limit,
      sort: '-createdAt',
    })
    experiences = result.docs
  } else {
    // auto
    const result = await payload.find({
      collection: 'experiences',
      where: { status: { equals: 'published' } },
      limit,
      sort: '-createdAt',
    })
    experiences = result.docs
  }

  if (experiences.length === 0) return null

  const gridCols = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  const gridClass = gridCols[columns as keyof typeof gridCols] || gridCols['3']

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto">
        {/* Heading */}
        {heading && (heading.badge || heading.title || heading.description) && (
          <div className="text-center mb-12">
            {heading.badge && (
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
                style={{
                  backgroundColor: 'var(--color-teal-glow, rgba(0,163,155,0.1))',
                  color: 'var(--color-teal, #00a39b)',
                }}
              >
                {heading.badge}
              </span>
            )}
            {heading.title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                }}
              >
                {heading.title}
              </h2>
            )}
            {heading.description && (
              <p className="text-grey-dark max-w-2xl mx-auto">{heading.description}</p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {experiences.map((exp: any) => {
            const categoryObj = typeof exp.category === 'object' ? exp.category : null
            const thumbnail = typeof exp.featuredImage === 'object' ? exp.featuredImage?.url : undefined

            return (
              <ExperienceCard
                key={exp.id}
                title={exp.title}
                slug={exp.slug}
                category={categoryObj?.name}
                thumbnail={thumbnail}
                duration={exp.duration}
                minPersons={exp.minPersons}
                maxPersons={exp.maxPersons}
                rating={0}
                reviewCount={0}
                pricePerPerson={exp.pricePerPerson || 0}
                priceType={exp.priceType}
                popular={exp.popular}
                featured={exp.featured}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

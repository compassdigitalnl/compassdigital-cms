import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function ExperienceCategoryGridComponent(props: any) {
  const {
    heading,
    source = 'auto',
    categories: manualCategories,
    columns = '4',
    limit = 8,
    showCount = true,
  } = props

  const payload = await getPayload({ config })
  let categories: any[] = []

  if (source === 'manual' && manualCategories) {
    categories = Array.isArray(manualCategories)
      ? manualCategories.filter((c: any) => typeof c === 'object' && c !== null)
      : []
  } else {
    const result = await payload.find({
      collection: 'experience-categories',
      limit,
      sort: 'name',
    })
    categories = result.docs
  }

  if (categories.length === 0) return null

  const gridCols = {
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-4',
    '6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }
  const gridClass = gridCols[columns as keyof typeof gridCols] || gridCols['4']

  return (
    <section className="py-12 md:py-16 px-4" style={{ backgroundColor: 'var(--color-grey-light, #f9fafb)' }}>
      <div className="container mx-auto">
        {heading && (heading.badge || heading.title) && (
          <div className="text-center mb-10">
            {heading.badge && (
              <span
                className="inline-flex px-4 py-2 rounded-full text-sm font-semibold mb-4"
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
                className="text-3xl md:text-4xl font-bold mb-3"
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

        <div className={`grid ${gridClass} gap-4`}>
          {categories.slice(0, limit).map((cat: any) => (
            <Link
              key={cat.id}
              href={`/ervaringen/categorie/${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl bg-white border p-6 text-center no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
            >
              {cat.icon && <span className="text-3xl">{cat.icon}</span>}
              <span
                className="text-sm font-bold"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                {cat.name}
              </span>
              {showCount && cat.experienceCount !== undefined && (
                <span className="text-xs text-grey-mid">{cat.experienceCount} ervaringen</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

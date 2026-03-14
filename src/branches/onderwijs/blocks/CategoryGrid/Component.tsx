import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CategoryCard } from '../../components/CategoryCard'
import type { CategoryGridProps } from './types'

export async function CategoryGridComponent(props: CategoryGridProps) {
  const {
    heading,
    limit = 6,
    columns = '6',
    showCount = true,
  } = props

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'course-categories',
    limit: limit || 6,
    sort: '-courseCount',
  })

  const categories = result.docs

  if (categories.length === 0) return null

  const gridCols: Record<string, string> = {
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-4',
    '6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl">
              {heading}
            </h2>
          </div>
        )}

        <div className={`grid gap-4 ${gridCols[columns] || gridCols['6']}`}>
          {categories.map((category: any) => (
            <CategoryCard
              key={category.id}
              category={{
                id: category.id,
                name: category.name,
                slug: category.slug,
                icon: category.icon,
                color: category.color,
                courseCount: showCount ? category.courseCount : undefined,
                description: category.description,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

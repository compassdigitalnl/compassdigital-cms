import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CourseCard } from '../../components/CourseCard'
import type { FeaturedCoursesProps } from './types'

export async function FeaturedCoursesComponent(props: FeaturedCoursesProps) {
  const {
    heading,
    limit = 6,
    columns = '3',
    categoryFilter,
    showPrice = true,
    showRating = true,
  } = props

  const payload = await getPayload({ config })

  const whereConditions: any[] = [{ status: { equals: 'published' } }]

  // Apply category filter
  if (categoryFilter) {
    const categoryId =
      typeof categoryFilter === 'object' && categoryFilter !== null
        ? categoryFilter.id
        : categoryFilter
    if (categoryId) {
      whereConditions.push({ category: { equals: categoryId } })
    }
  }

  const result = await payload.find({
    collection: 'courses',
    where: { and: whereConditions },
    limit: limit || 6,
    sort: '-studentCount',
  })

  const courses = result.docs

  if (courses.length === 0) return null

  const gridCols: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
              Cursussen
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}

        <div className={`grid gap-6 ${gridCols[columns] || gridCols['3']}`}>
          {courses.map((course: any) => (
            <CourseCard
              key={course.id}
              course={{
                id: course.id,
                title: course.title,
                slug: course.slug,
                thumbnail: course.thumbnail,
                category: course.category,
                instructor: course.instructor,
                level: course.level,
                price: showPrice ? course.price : 0,
                originalPrice: showPrice ? course.originalPrice : undefined,
                rating: showRating ? course.rating : undefined,
                reviewCount: showRating ? course.reviewCount : undefined,
                studentCount: course.studentCount,
                duration: course.duration,
                totalLessons: course.totalLessons,
                featured: course.featured,
                createdAt: course.createdAt,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SearchHero } from '../../components/SearchHero'
import type { CourseSearchHeroProps } from './types'

export async function CourseSearchHeroComponent(props: CourseSearchHeroProps) {
  const {
    heading,
    subheading,
    showSearch = true,
    showStats = true,
    backgroundStyle = 'dark',
  } = props

  const payload = await getPayload({ config })

  // Fetch categories for the search dropdown
  const categoriesResult = await payload.find({
    collection: 'course-categories',
    limit: 20,
    sort: 'name',
  })

  const categories = categoriesResult.docs.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }))

  return (
    <SearchHero
      heading={heading}
      subheading={subheading}
      categories={categories}
      showSearch={showSearch}
      showStats={showStats}
      backgroundStyle={backgroundStyle}
    />
  )
}

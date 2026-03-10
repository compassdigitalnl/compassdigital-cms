import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb/Component'
import { ExperienceArchiveClient } from './ExperienceArchiveClient'

export async function ExperienceArchiveTemplate() {
  const payload = await getPayload({ config })

  // Fetch all published experiences
  const experiencesResult = await payload.find({
    collection: 'experiences',
    where: { status: { equals: 'published' } },
    limit: 100,
    sort: '-createdAt',
    depth: 2,
  })

  // Fetch categories for filter
  const categoriesResult = await payload.find({
    collection: 'experience-categories',
    limit: 50,
    sort: 'name',
  })

  const categories = categoriesResult.docs.map((cat: any) => ({
    label: cat.name,
    value: cat.slug,
  }))

  // Extract unique locations
  const locationSet = new Set<string>()
  experiencesResult.docs.forEach((exp: any) => {
    if (exp.location) locationSet.add(exp.location)
  })
  const locations = Array.from(locationSet).map((loc) => ({
    label: loc,
    value: loc,
  }))

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg, #f9fafb)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Ervaringen' },
          ]}
        />
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{
            color: 'var(--color-navy, #1a2b4a)',
            fontFamily: 'var(--font-serif, Georgia, serif)',
          }}
        >
          Alle ervaringen
        </h1>
        <p className="text-gray-600">
          {experiencesResult.totalDocs} ervaringen beschikbaar
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        <ExperienceArchiveClient
          initialExperiences={experiencesResult.docs}
          categories={categories}
          locations={locations}
        />
      </div>
    </div>
  )
}

export default ExperienceArchiveTemplate

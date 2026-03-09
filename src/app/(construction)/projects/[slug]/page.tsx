/**
 * Construction Project Detail Page
 *
 * Displays detailed information about a specific project with before/after images.
 * Route: /projecten/[slug]
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { ConstructionProject } from '@/payload-types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ServiceCard } from '@/branches/construction/components'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { serializeLexical } from '@/utilities/serializeLexical'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'construction-projects',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const project = docs[0]

  if (!project) {
    return {
      title: 'Project niet gevonden',
    }
  }

  return {
    title: `${project.title} - Onze Projecten`,
    description: project.shortDescription,
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  if (!isFeatureEnabled('construction')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch project
  const { docs } = await payload.find({
    collection: 'construction-projects',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 3,
    limit: 1,
  })

  const project = docs[0] as ConstructionProject

  if (!project) {
    notFound()
  }

  // Get image URLs
  const beforeImageUrl =
    project.beforeAfter?.before && typeof project.beforeAfter.before === 'object' && project.beforeAfter.before !== null
      ? project.beforeAfter.before.url
      : null
  const afterImageUrl =
    project.beforeAfter?.after && typeof project.beforeAfter.after === 'object' && project.beforeAfter.after !== null
      ? project.beforeAfter.after.url
      : null
  const featuredImageUrl =
    typeof project.featuredImage === 'object' && project.featuredImage !== null
      ? project.featuredImage.url
      : null

  // Get related data
  const categoryData = typeof project.category === 'object' && project.category !== null ? project.category : null
  const testimonial = project.testimonial

  // Format year
  const formattedDate = project.year
    ? `${project.year}`
    : null

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            {categoryData && (
              <div className="inline-block px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm mb-4">
                {categoryData.title}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-gray-300 mb-6">
              {project.location && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.location}
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formattedDate}
                </div>
              )}
              {categoryData && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {categoryData.title}
                </div>
              )}
            </div>

            {/* Short Description */}
            {project.shortDescription && (
              <p className="text-xl text-gray-300">{project.shortDescription}</p>
            )}
          </div>
        </div>
      </div>

      {/* Before/After Images */}
      {(beforeImageUrl || afterImageUrl) && (
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Voor & Na</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {beforeImageUrl && (
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold">
                      Voor
                    </div>
                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                      <Image
                        src={beforeImageUrl}
                        alt={`${project.title} - Voor`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
                {afterImageUrl && (
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
                      Na
                    </div>
                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                      <Image
                        src={afterImageUrl}
                        alt={`${project.title} - Na`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Image (if no before/after) */}
      {!beforeImageUrl && !afterImageUrl && featuredImageUrl && (
        <div className="relative w-full h-[500px]">
          <Image src={featuredImageUrl} alt={project.title} fill className="object-cover" />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Long Description */}
              {project.longDescription && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">Over dit project</h2>
                  <div className="prose prose-lg max-w-none">
                    {serializeLexical({ nodes: project.longDescription })}
                  </div>
                </div>
              )}

              {/* Project Details - Built from available fields */}
              {(project.location || project.year || project.size || project.duration || project.budget || testimonial?.clientName) && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Projectdetails</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.location && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Locatie</h3>
                        <p className="text-lg font-medium text-gray-900">{project.location}</p>
                      </div>
                    )}
                    {project.year && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Jaar</h3>
                        <p className="text-lg font-medium text-gray-900">{project.year}</p>
                      </div>
                    )}
                    {project.size && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Oppervlakte</h3>
                        <p className="text-lg font-medium text-gray-900">{project.size}</p>
                      </div>
                    )}
                    {project.duration && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Doorlooptijd</h3>
                        <p className="text-lg font-medium text-gray-900">{project.duration}</p>
                      </div>
                    )}
                    {project.budget && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Budget</h3>
                        <p className="text-lg font-medium text-gray-900">{project.budget}</p>
                      </div>
                    )}
                    {testimonial?.clientName && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Klant</h3>
                        <p className="text-lg font-medium text-gray-900">{testimonial.clientName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Result/Highlights */}
              {project.result && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Resultaat</h2>
                  <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl">
                    <div className="prose prose-lg max-w-none">
                      {serializeLexical({ nodes: project.result })}
                    </div>
                  </div>
                </div>
              )}

              {/* Challenge & Solution */}
              {(project.challenge || project.solution) && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Uitdaging & Oplossing</h2>
                  <div className="border-l-4 border-gray-900 pl-6 space-y-4">
                    {project.challenge && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Uitdaging:</h3>
                        <div className="prose prose-lg max-w-none mb-4">
                          {serializeLexical({ nodes: project.challenge })}
                        </div>
                      </>
                    )}
                    {project.solution && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Oplossing:</h3>
                        <div className="prose prose-lg max-w-none">
                          {serializeLexical({ nodes: project.solution })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Testimonial */}
              {testimonial?.quote && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Wat de klant zegt</h2>
                  <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-gray-900">
                    <svg
                      className="w-10 h-10 text-gray-400 mb-4"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                    </svg>
                    <p className="text-xl text-gray-800 italic mb-6">"{testimonial.quote}"</p>
                    {(testimonial.clientName || testimonial.clientRole) && (
                      <div className="border-t border-gray-200 pt-4">
                        {testimonial.clientName && (
                          <p className="font-semibold text-gray-900">{testimonial.clientName}</p>
                        )}
                        {testimonial.clientRole && (
                          <p className="text-sm text-gray-600">{testimonial.clientRole}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-gray-900 text-white p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Ook zo'n mooi project?</h3>
                  <p className="text-gray-300 mb-6">
                    Vraag vrijblijvend een offerte aan en bespreek de mogelijkheden.
                  </p>
                  <a
                    href="/offerte-aanvragen/"
                    className="block w-full text-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Offerte aanvragen
                  </a>
                </div>

                {/* Project Stats */}
                {(project.budget || project.duration || project.size) && (
                  <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                    <h3 className="text-lg font-bold mb-4">Project informatie</h3>

                    {project.duration && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Doorlooptijd</p>
                        <p className="text-lg font-semibold">{project.duration}</p>
                      </div>
                    )}

                    {project.size && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Oppervlakte</p>
                        <p className="text-lg font-semibold">{project.size}</p>
                      </div>
                    )}

                    {project.budget && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Budget</p>
                        <p className="text-lg font-semibold">{project.budget}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Share */}
                <div className="border-2 border-gray-200 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Deel dit project</h3>
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Facebook
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      X
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Projects */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Bekijk ook onze andere projecten</h2>
            <p className="text-xl text-gray-600 mb-8">
              Laat u inspireren door onze gerealiseerde projecten
            </p>
            <a
              href="/projecten/"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Alle projecten bekijken
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

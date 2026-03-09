/**
 * Construction Service Detail Page
 *
 * Displays detailed information about a specific service.
 * Route: /diensten/[slug]
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { ConstructionService } from '@/payload-types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ServiceCard, ProjectCard } from '@/branches/construction/components'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { serializeLexical } from '@/utilities/serializeLexical'

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'construction-services',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const service = docs[0]

  if (!service) {
    return {
      title: 'Dienst niet gevonden',
    }
  }

  return {
    title: `${service.title} - Onze Diensten`,
    description: service.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  if (!isFeatureEnabled('construction')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch service
  const { docs } = await payload.find({
    collection: 'construction-services',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  const service = docs[0] as ConstructionService

  if (!service) {
    notFound()
  }

  // Fetch related projects
  const { docs: relatedProjects } = await payload.find({
    collection: 'construction-projects',
    where: {
      category: { equals: service.id },
      status: { equals: 'published' },
    },
    depth: 1,
    limit: 6,
    sort: '-year',
  })

  // Get image URLs
  const heroImageUrl =
    typeof service.heroImage === 'object' && service.heroImage !== null
      ? service.heroImage.url
      : null

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            {service.icon && (
              <div className="mb-6 text-6xl">
                {service.icon}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>

            {/* Short Description */}
            {service.shortDescription && (
              <p className="text-xl text-gray-300 mb-6">{service.shortDescription}</p>
            )}

            {/* Service Types Badge */}
            {service.serviceTypes && service.serviceTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.serviceTypes.map((type, index) => (
                  <div key={index} className="inline-block px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    {type.icon && <span className="mr-2">{type.icon}</span>}
                    {type.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {heroImageUrl && (
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image src={heroImageUrl} alt={service.title} fill className="object-cover" />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Long Description */}
              {service.longDescription && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">Over deze dienst</h2>
                  <div className="prose prose-lg max-w-none">
                    {serializeLexical({ nodes: service.longDescription })}
                  </div>
                </div>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Wat krijgt u?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <svg
                          className="flex-shrink-0 w-6 h-6 text-green-600 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-800">{feature.feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Steps */}
              {service.processSteps && service.processSteps.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Hoe werkt het?</h2>
                  <div className="space-y-6">
                    {service.processSteps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* USPs */}
              {service.usps && service.usps.length > 0 && (
                <div className="mb-12 p-6 bg-blue-50 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6">Waarom voor ons kiezen?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.usps.map((usp, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg
                          className="flex-shrink-0 w-6 h-6 text-blue-600 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-900 font-semibold mb-1">{usp.title}</p>
                          <p className="text-gray-600 text-sm">{usp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {service.faq && service.faq.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Veelgestelde vragen</h2>
                  <div className="space-y-4">
                    {service.faq.map((faqItem, index) => (
                      <details
                        key={index}
                        className="group bg-white border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <summary className="flex justify-between items-center p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                          {faqItem.question}
                          <svg
                            className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <div className="p-4 pt-0 text-gray-600">{faqItem.answer}</div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-gray-900 text-white p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Interesse in deze dienst?</h3>
                  <p className="text-gray-300 mb-6">
                    Vraag vrijblijvend een offerte aan en ontvang binnen 24 uur een reactie.
                  </p>
                  <a
                    href="/offerte-aanvragen/"
                    className="block w-full text-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Offerte aanvragen
                  </a>
                </div>

                {/* Contact Info */}
                <div className="border-2 border-gray-200 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Vragen?</h3>
                  <p className="text-gray-600 mb-4">Bel of mail ons gerust voor meer informatie.</p>
                  <div className="space-y-2 text-sm">
                    <a
                      href="tel:+31201234567"
                      className="flex items-center gap-2 text-gray-900 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      020 123 4567
                    </a>
                    <a
                      href="mailto:info@bouwbedrijf.nl"
                      className="flex items-center gap-2 text-gray-900 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      info@bouwbedrijf.nl
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Gerealiseerde projecten</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} variant="default" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Services */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Bekijk ook onze andere diensten</h2>
            <p className="text-xl text-gray-600 mb-8">
              Wij bieden een breed scala aan bouwdiensten
            </p>
            <a
              href="/diensten/"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Alle diensten bekijken
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

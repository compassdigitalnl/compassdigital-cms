import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  if (isFeatureEnabled('beauty')) {
    return { title: 'Afspraak maken', description: 'Boek eenvoudig online een afspraak bij onze salon' }
  }
  if (isFeatureEnabled('tourism')) {
    return { title: 'Reis Boeken', description: 'Boek uw droomreis eenvoudig en snel online' }
  }
  return { title: 'Boeken' }
}

/**
 * Shared /boeken route — resolves to beauty booking or toerisme booking
 */
export default async function BoekenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const payload = await getPayload({ config })

  if (isFeatureEnabled('beauty')) {
    const { default: Template } = await import('@/branches/beauty/templates/BookingWizard')
    const [servicesResult, stylistsResult] = await Promise.all([
      payload.find({
        collection: 'content-services',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { branch: { equals: 'beauty' } },
          ],
        },
        limit: 100,
        sort: 'title',
        depth: 0,
      }),
      payload.find({
        collection: 'content-team',
        where: {
          and: [
            { status: { equals: 'published' } },
            { branch: { equals: 'beauty' } },
            { bookable: { equals: true } },
          ],
        },
        limit: 50,
        sort: 'name',
        depth: 1,
      }),
    ])
    return (
      <Template
        services={servicesResult.docs}
        stylists={stylistsResult.docs}
        preselectedService={params.service}
        preselectedStylist={params.stylist}
      />
    )
  }

  if (isFeatureEnabled('tourism')) {
    const { BookingWizardTemplate } = await import('@/branches/toerisme/templates')
    let tours: any[] = []
    let accommodations: any[] = []
    try {
      const tourResult = await payload.find({
        collection: 'tours',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { availability: { not_equals: 'uitverkocht' } },
          ],
        },
        limit: 100,
        sort: 'title',
        depth: 1,
      })
      tours = tourResult.docs
    } catch {}
    try {
      const accResult = await payload.find({
        collection: 'accommodations',
        where: { _status: { equals: 'published' } },
        limit: 100,
        sort: 'name',
        depth: 1,
      })
      accommodations = accResult.docs
    } catch {}

    const preselectedTour = params.reis ? tours.find((t: any) => t.slug === params.reis) || null : null
    const preselectedAccommodation = params.accommodatie ? accommodations.find((a: any) => a.slug === params.accommodatie) || null : null

    return (
      <BookingWizardTemplate
        tours={tours}
        accommodations={accommodations}
        preselectedTour={preselectedTour}
        preselectedAccommodation={preselectedAccommodation}
      />
    )
  }

  notFound()
}

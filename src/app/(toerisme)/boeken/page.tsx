import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { BookingWizardTemplate } from '@/branches/toerisme/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Reis Boeken',
    description: 'Boek uw droomreis eenvoudig en snel online',
  }
}

export default async function BoekenPage({
  searchParams,
}: {
  searchParams: Promise<{
    reis?: string
    accommodatie?: string
  }>
}) {
  if (!isFeatureEnabled('tourism')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })

  // Fetch available tours for selection
  let tours: any[] = []
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

  // Fetch available accommodations for selection
  let accommodations: any[] = []
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

  // Preselection support via query params
  let preselectedTour = null
  if (params.reis) {
    preselectedTour = tours.find((t: any) => t.slug === params.reis) || null
  }

  let preselectedAccommodation = null
  if (params.accommodatie) {
    preselectedAccommodation = accommodations.find((a: any) => a.slug === params.accommodatie) || null
  }

  return (
    <BookingWizardTemplate
      tours={tours}
      accommodations={accommodations}
      preselectedTour={preselectedTour}
      preselectedAccommodation={preselectedAccommodation}
    />
  )
}

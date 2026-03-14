import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { WorkshopBookingTemplate } from '@/branches/automotive/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Afspraak Maken',
    description: 'Plan eenvoudig online een werkplaatsafspraak in',
  }
}

export default async function AfspraakMakenPage({
  searchParams,
}: {
  searchParams: Promise<{ dienst?: string; voertuig?: string }>
}) {
  if (!isFeatureEnabled('automotive')) notFound()

  const params = await searchParams
  const payload = await getPayload({ config })

  // Fetch workshop services for the booking form
  const { docs: serviceDocs } = await payload.find({
    collection: 'content-services',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { branch: { equals: 'automotive' } },
      ],
    },
    limit: 100,
    sort: 'title',
  })

  // Map to WorkshopService format expected by the form
  const services = serviceDocs.map((s: any) => ({
    id: s.id,
    title: s.title,
    price: s.price ?? null,
    duration: s.duration ?? null,
  }))

  return (
    <WorkshopBookingTemplate
      services={services}
      preselectedService={params.dienst}
      preselectedVehicle={params.voertuig}
    />
  )
}

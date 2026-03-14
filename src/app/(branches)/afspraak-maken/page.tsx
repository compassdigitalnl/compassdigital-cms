import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  if (isFeatureEnabled('zorg')) {
    return { title: 'Afspraak Maken', description: 'Maak eenvoudig online een afspraak bij onze praktijk' }
  }
  if (isFeatureEnabled('automotive')) {
    return { title: 'Werkplaats Afspraak', description: 'Plan een afspraak in bij onze werkplaats' }
  }
  return { title: 'Afspraak Maken' }
}

/**
 * Shared /afspraak-maken route — resolves to zorg or automotive template
 */
export default async function AfspraakMakenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const payload = await getPayload({ config })

  if (isFeatureEnabled('zorg')) {
    const { default: Template } = await import('@/branches/zorg/templates/AppointmentWizard')
    const [servicesResult, teamResult] = await Promise.all([
      payload.find({
        collection: 'content-services',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { branch: { equals: 'zorg' } },
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
            { branch: { equals: 'zorg' } },
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
        practitioners={teamResult.docs}
        preselectedService={params.dienst}
      />
    )
  }

  if (isFeatureEnabled('automotive')) {
    const { default: Template } = await import('@/branches/automotive/templates/WorkshopBooking')
    let services: any[] = []
    try {
      const result = await payload.find({
        collection: 'content-services',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { branch: { equals: 'automotive' } },
          ],
        },
        limit: 100,
        sort: 'title',
        depth: 0,
      })
      services = result.docs.map((s: any) => ({
        id: s.id,
        title: s.title,
        price: s.price,
        duration: s.duration,
      }))
    } catch {}
    return (
      <Template
        services={services}
        preselectedService={params.dienst}
        preselectedVehicle={params.voertuig}
      />
    )
  }

  notFound()
}

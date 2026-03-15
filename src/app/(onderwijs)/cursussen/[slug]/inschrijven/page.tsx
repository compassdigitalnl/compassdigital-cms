import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { EnrollmentWizardTemplate } from '@/branches/onderwijs/templates/EnrollmentWizard'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'courses',
      where: {
        and: [
          { slug: { equals: slug } },
        ],
      },
      limit: 1,
      depth: 1,
    })

    if (docs[0]) {
      const course = docs[0] as any
      return {
        title: `Inschrijven — ${course.title}`,
        description: `Schrijf je in voor ${course.title}`,
      }
    }
  } catch {}

  return { title: 'Inschrijven' }
}

export default async function EnrollmentPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('education')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'courses',
    where: {
      and: [
        { slug: { equals: slug } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const course = docs[0]
  if (!course) notFound()

  return <EnrollmentWizardTemplate course={course} />
}

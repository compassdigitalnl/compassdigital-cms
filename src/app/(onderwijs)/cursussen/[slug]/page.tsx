import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { CourseDetailTemplate } from '@/branches/onderwijs/templates/CourseDetail'

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
        title: course.title,
        description: course.shortDescription || `Bekijk cursus ${course.title}`,
      }
    }
  } catch {}

  return { title: 'Cursus' }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('education')) notFound()

  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'courses',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const course = docs[0]
  if (!course) notFound()

  return <CourseDetailTemplate course={course} />
}

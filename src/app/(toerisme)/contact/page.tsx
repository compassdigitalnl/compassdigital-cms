import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { ContactTemplate } from '@/branches/toerisme/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Contact',
    description: 'Neem contact op met ons reisbureau voor persoonlijk reisadvies',
  }
}

export default async function ContactPage() {
  if (!isFeatureEnabled('tourism')) notFound()

  const payload = await getPayload({ config })

  let settings = null
  try {
    settings = await payload.findGlobal({ slug: 'settings' })
  } catch { /* use defaults */ }

  // Fetch team members for the contact page
  let teamMembers: any[] = []
  try {
    const { docs } = await payload.find({
      collection: 'content-team',
      where: {
        and: [
          { branch: { equals: 'toerisme' } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 10,
      sort: 'name',
      depth: 1,
    })
    teamMembers = docs
  } catch { /* no team members */ }

  return <ContactTemplate settings={settings} teamMembers={teamMembers} />
}

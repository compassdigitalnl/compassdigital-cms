import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import ContactTemplate from '@/branches/zorg/templates/ContactTemplate'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Contact',
    description: 'Neem contact met ons op',
  }
}

export default async function ContactPage() {
  if (!isFeatureEnabled('zorg')) notFound()

  let settings = null
  try {
    const payload = await getPayload({ config })
    settings = await payload.findGlobal({ slug: 'settings' })
  } catch { /* use defaults */ }

  return <ContactTemplate settings={settings} />
}

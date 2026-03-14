import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { TradeInTemplate } from '@/branches/automotive/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Auto Inruilen',
    description: 'Ontvang een vrijblijvende taxatie van uw huidige voertuig',
  }
}

export default async function InruilenPage() {
  if (!isFeatureEnabled('automotive')) notFound()

  let settings = null
  try {
    const payload = await getPayload({ config })
    settings = await payload.findGlobal({ slug: 'settings' })
  } catch { /* use defaults */ }

  return <TradeInTemplate settings={settings} />
}

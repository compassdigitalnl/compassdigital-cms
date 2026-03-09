import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import LoginTemplate1 from '@/branches/ecommerce/shared/templates/login-register/LoginTemplate1'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Inloggen | Shop',
  description: 'Log in op uw account, maak een nieuw account aan of bestel als gast.',
}

export default async function InloggenPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const payload = await getPayload({ config })

  let siteConfig = { companyName: '', phone: '', email: '' }
  try {
    const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
    const s = settings as any
    siteConfig = {
      companyName: s?.companyName || '',
      phone: s?.phone || '',
      email: s?.email || '',
    }
  } catch {
    // use defaults
  }

  return <LoginTemplate1 defaultTab="login" siteConfig={siteConfig} />
}

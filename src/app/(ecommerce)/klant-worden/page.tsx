import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import RegisterTemplate1 from '@/branches/ecommerce/templates/login-register/RegisterTemplate1'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Klant worden | Shop',
  description: 'Word klant en profiteer van exclusieve B2B-prijzen, bestellijsten en persoonlijk advies.',
}

export default async function KlantWordenPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const payload = await getPayload({ config })

  // Fetch settings + ecommerce settings in parallel
  const [settings, ecommerceSettings] = await Promise.all([
    payload.findGlobal({ slug: 'settings', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'e-commerce-settings', depth: 0 }).catch(() => null),
  ])

  const s = settings as any
  const e = ecommerceSettings as any

  // Build siteConfig from Settings global
  const siteConfig = {
    companyName: s?.companyName || '',
    phone: s?.phone || '',
    phoneFormatted: s?.phone ? s.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1\u2011$2\u2011$3') : '',
    email: s?.email || '',
  }

  // Benefits from CMS (or undefined for fallback)
  const benefits = e?.b2bBenefits?.length
    ? e.b2bBenefits.map((b: any) => ({
        icon: b.icon || 'Gift',
        iconColor: b.iconColor || 'var(--color-teal, #00897B)',
        iconBg: b.iconBg || 'rgba(0,137,123,0.12)',
        title: b.title,
        description: b.description || '',
      }))
    : undefined

  // Trust items from CMS (or undefined for fallback)
  const trustItems = e?.registrationTrustItems?.length
    ? e.registrationTrustItems.map((t: any) => ({ text: t.text }))
    : undefined

  const freeShippingThreshold = e?.freeShippingThreshold ?? 150

  // Fetch branches (visible, sorted)
  let branches: Array<{ id: string; name: string; icon?: string }> = []
  try {
    const branchesResult = await payload.find({
      collection: 'branches',
      where: { visible: { equals: true } },
      sort: 'order',
      limit: 50,
      depth: 0,
    })
    branches = branchesResult.docs.map((b: any) => ({
      id: String(b.id),
      name: b.name,
      icon: b.icon || undefined,
    }))
  } catch {
    // branches collection may not exist yet
  }

  return (
    <RegisterTemplate1
      siteConfig={siteConfig}
      benefits={benefits}
      trustItems={trustItems}
      branches={branches.length > 0 ? branches : undefined}
      freeShippingThreshold={freeShippingThreshold}
    />
  )
}

import { getPayload } from 'payload'
import config from '@payload-config'
import CartPageClient from './CartPageClient'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { CHECKOUT_FLOWS, resolveFlowFromLegacy } from '@/branches/ecommerce/lib/checkoutFlows'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Winkelwagen | Shop',
  description: 'Bekijk uw winkelwagen',
}

export default async function CartPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const payload = await getPayload({ config })

  let defaultTemplate = 'template1'
  let contactPhone = ''

  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })

    const s = settings as any
    contactPhone = s?.phone || ''

    // New: resolve via checkoutFlow
    if (s?.checkoutFlow && CHECKOUT_FLOWS[s.checkoutFlow]) {
      defaultTemplate = CHECKOUT_FLOWS[s.checkoutFlow].cartTemplate
    } else {
      // Backward compat: resolve from old separate fields
      const flow = resolveFlowFromLegacy(s?.defaultCartTemplate, s?.defaultCheckoutTemplate)
      defaultTemplate = CHECKOUT_FLOWS[flow].cartTemplate
    }
  } catch (error) {
    console.error('⚠️ Error fetching cart template setting, using default:', error)
  }

  return <CartPageClient defaultTemplate={defaultTemplate} contactPhone={contactPhone} />
}

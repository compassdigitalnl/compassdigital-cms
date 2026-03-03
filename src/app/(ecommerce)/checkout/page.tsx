import { getPayload } from 'payload'
import config from '@payload-config'
import CheckoutTemplate1 from '@/branches/ecommerce/templates/checkout/CheckoutTemplate1'
import CheckoutTemplate2 from '@/branches/ecommerce/templates/checkout/CheckoutTemplate2'
import CheckoutTemplate4 from '@/branches/ecommerce/templates/checkout/CheckoutTemplate4'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { CHECKOUT_FLOWS, resolveFlowFromLegacy } from '@/branches/ecommerce/lib/checkoutFlows'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Afrekenen | Shop',
  description: 'Veilig afrekenen',
}

export default async function CheckoutPageWrapper() {
  if (!isFeatureEnabled('shop')) notFound()

  const payload = await getPayload({ config })

  let template = 'checkouttemplate1'

  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })

    const s = settings as any

    // New: resolve via checkoutFlow
    if (s?.checkoutFlow && CHECKOUT_FLOWS[s.checkoutFlow]) {
      template = CHECKOUT_FLOWS[s.checkoutFlow].checkoutTemplate
    } else {
      // Backward compat: resolve from old separate fields
      const flow = resolveFlowFromLegacy(s?.defaultCartTemplate, s?.defaultCheckoutTemplate)
      template = CHECKOUT_FLOWS[flow].checkoutTemplate
    }
  } catch (error) {
    console.error('⚠️ Error fetching settings, using default template:', error)
    template = 'checkouttemplate1'
  }

  // Template switcher based on resolved flow
  if (template === 'template4') {
    return <CheckoutTemplate4 />
  }

  if (template === 'checkouttemplate2') {
    return <CheckoutTemplate2 />
  }

  // Default to template 1
  return <CheckoutTemplate1 />
}

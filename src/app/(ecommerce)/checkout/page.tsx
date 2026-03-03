import { getPayload } from 'payload'
import config from '@payload-config'
import CheckoutTemplate1 from '@/branches/ecommerce/templates/checkout/CheckoutTemplate1'
import CheckoutTemplate2 from '@/branches/ecommerce/templates/checkout/CheckoutTemplate2'
import CheckoutTemplate4 from '@/branches/ecommerce/templates/checkout/CheckoutTemplate4'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Afrekenen | Shop',
  description: 'Veilig afrekenen',
}

export default async function CheckoutPageWrapper() {
  if (!isFeatureEnabled('shop')) notFound()

  const payload = await getPayload({ config })

  // Get global template setting from Settings
  let settings
  let template = 'checkouttemplate1' // Default fallback

  try {
    settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })
    // Safely get template setting with fallback
    template = (settings as any)?.defaultCheckoutTemplate || 'checkouttemplate1'
  } catch (error) {
    console.error('⚠️ Error fetching settings, using default template:', error)
    template = 'checkouttemplate1'
  }

  // Template switcher based on settings
  if (template === 'template4') {
    return <CheckoutTemplate4 />
  }

  if (template === 'checkouttemplate2') {
    return <CheckoutTemplate2 />
  }

  // Default to template 1
  return <CheckoutTemplate1 />
}

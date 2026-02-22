import { getPayload } from 'payload'
import config from '@payload-config'
import CheckoutTemplate1 from './CheckoutTemplate1'

export const metadata = {
  title: 'Afrekenen | Shop',
  description: 'Veilig afrekenen',
}

export default async function CheckoutPageWrapper() {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Checkout Template Switcher */}
      {/* Template 2 will be added here later */}
      <CheckoutTemplate1 />
    </div>
  )
}

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

  // Debug: Log template selection
  console.log('🛒 Checkout Page')
  console.log('📋 Global checkout template setting:', (settings as any)?.defaultCheckoutTemplate)
  console.log('✅ Using template:', template)

  // Badge color and label based on template
  const getBadgeStyle = () => {
    // Template 2 will be added later (one-page checkout)
    return { background: '#3B82F6', label: '🏢 Checkout Template 1 - Enterprise' }
  }

  const badgeStyle = getBadgeStyle()

  return (
    <div className="min-h-screen">
      {/* DEBUG: Template Indicator */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          background: badgeStyle.background,
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {badgeStyle.label}
      </div>

      {/* Checkout Template Switcher */}
      {/* Template 2 will be added here later */}
      <CheckoutTemplate1 />
    </div>
  )
}

import { getPayload } from 'payload'
import config from '@payload-config'
import MyAccountTemplate1 from './MyAccountTemplate1'

export const metadata = {
  title: 'Mijn Account | Dashboard',
  description: 'Beheer uw account en bestellingen',
}

export default async function MyAccountPage() {
  const payload = await getPayload({ config })

  // Get global template setting from Settings
  let settings
  let template = 'myaccounttemplate1' // Default fallback

  try {
    settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })
    // Safely get template setting with fallback
    template = (settings as any)?.defaultMyAccountTemplate || 'myaccounttemplate1'
  } catch (error) {
    console.error('⚠️ Error fetching settings, using default template:', error)
    template = 'myaccounttemplate1'
  }

  // Debug: Log template selection
  console.log('👤 My Account Page')
  console.log('📋 Global my-account template setting:', (settings as any)?.defaultMyAccountTemplate)
  console.log('✅ Using template:', template)

  // Badge color and label based on template
  const getBadgeStyle = () => {
    // Template 2 will be added later (simpler list view)
    return { background: '#3B82F6', label: '🏢 My Account Template 1 - Enterprise' }
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

      {/* My Account Template Switcher */}
      {/* Template 2 will be added here later */}
      <MyAccountTemplate1 />
    </div>
  )
}

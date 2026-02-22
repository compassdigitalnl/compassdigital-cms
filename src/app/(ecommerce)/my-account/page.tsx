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

  return (
    <div className="min-h-screen">
      {/* My Account Template Switcher */}
      {/* Template 2 will be added here later */}
      <MyAccountTemplate1 />
    </div>
  )
}

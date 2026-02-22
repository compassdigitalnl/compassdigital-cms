import { getPayload } from 'payload'
import config from '@payload-config'
import CartTemplate1 from './CartTemplate1'

export const metadata = {
  title: 'Winkelwagen | Shop',
  description: 'Bekijk uw winkelwagen',
}

export default async function CartPage() {
  const payload = await getPayload({ config })

  // Get global template setting from Settings
  let settings
  let template = 'carttemplate1' // Default fallback

  try {
    settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })
    // Safely get template setting with fallback
    template = (settings as any)?.defaultCartTemplate || 'carttemplate1'
  } catch (error) {
    console.error('⚠️ Error fetching settings, using default template:', error)
    template = 'carttemplate1'
  }

  return (
    <div className="min-h-screen">
      {/* Cart Template Switcher */}
      {/* Template 2 will be added here later */}
      <CartTemplate1 />
    </div>
  )
}

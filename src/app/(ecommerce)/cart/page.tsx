import { getPayload } from 'payload'
import config from '@payload-config'
import CartPageClient from './CartPageClient'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Winkelwagen | Shop',
  description: 'Bekijk uw winkelwagen',
}

export default async function CartPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const payload = await getPayload({ config })

  // Get global template setting from Settings (fallback for when no A/B test is running)
  let defaultTemplate = 'template1' // Default fallback

  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })

    // Get ecommerce settings with proper typing
    const ecommerceSettings = (settings as any)?.ecommerce
    defaultTemplate = ecommerceSettings?.defaultCartTemplate || 'template1'
  } catch (error) {
    console.error('⚠️ Error fetching cart template setting, using default:', error)
  }

  return <CartPageClient defaultTemplate={defaultTemplate} />
}

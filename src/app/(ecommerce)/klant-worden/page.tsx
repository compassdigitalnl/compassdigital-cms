import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import RegisterTemplate1 from '@/branches/ecommerce/templates/login-register/RegisterTemplate1'

export const metadata = {
  title: 'Klant worden | Shop',
  description: 'Word klant en profiteer van exclusieve B2B-prijzen, bestellijsten en persoonlijk advies.',
}

export default function KlantWordenPage() {
  if (!isFeatureEnabled('shop')) notFound()

  return <RegisterTemplate1 />
}

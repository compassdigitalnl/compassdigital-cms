import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import LoginTemplate1 from '@/branches/ecommerce/templates/login-register/LoginTemplate1'

export const metadata = {
  title: 'Inloggen | Shop',
  description: 'Log in op uw account, maak een nieuw account aan of bestel als gast.',
}

export default function InloggenPage() {
  if (!isFeatureEnabled('shop')) notFound()

  return <LoginTemplate1 defaultTab="login" />
}

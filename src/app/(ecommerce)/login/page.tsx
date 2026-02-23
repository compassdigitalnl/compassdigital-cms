import AuthTemplate from './AuthTemplate'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Inloggen | Shop',
  description: 'Log in op uw account',
}

export default function LoginPage() {
  if (!isFeatureEnabled('shop')) notFound()

  return <AuthTemplate defaultTab="login" />
}

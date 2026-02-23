import AuthTemplate from '../login/AuthTemplate'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Registreren | Shop',
  description: 'Maak een account aan',
}

export default function RegisterPage() {
  if (!isFeatureEnabled('shop')) notFound()

  return <AuthTemplate defaultTab="register" />
}

/**
 * Example: Login Page using AuthTemplate
 *
 * This example shows how to integrate AuthTemplate into a Next.js page
 * with Payload CMS authentication.
 *
 * File location: src/app/(ecommerce)/login/page.tsx
 */

import AuthTemplate from '@/branches/ecommerce/shared/templates/auth/AuthTemplate'
import type { Metadata } from 'next'

// ═════════════════════════════════════════════════════════════════════════════
// METADATA
// ═════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Inloggen | SiteForge',
  description: 'Log in op uw SiteForge account voor toegang tot uw bestellingen en persoonlijke gegevens.',
  robots: 'noindex, nofollow', // Don't index auth pages
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-grey-light">
      {/* Optional: Add header/navigation */}
      {/* <Header /> */}

      {/* AuthTemplate - defaults to login tab */}
      <AuthTemplate defaultTab="login" />

      {/* Optional: Add footer */}
      {/* <Footer /> */}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// SERVER-SIDE REDIRECT (OPTIONAL)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Uncomment this to redirect logged-in users away from login page
 */

/*
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  // Check if user is already logged in
  const cookieStore = cookies()
  const token = cookieStore.get('payload-token')

  if (token) {
    // User is logged in, redirect to dashboard
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-grey-light">
      <AuthTemplate defaultTab="login" />
    </div>
  )
}
*/

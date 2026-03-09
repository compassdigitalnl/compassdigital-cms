/**
 * Example: Registration Page using AuthTemplate
 *
 * This example shows how to create a dedicated registration page.
 *
 * File location: src/app/(ecommerce)/register/page.tsx
 */

import AuthTemplate from '@/branches/ecommerce/shared/templates/auth/AuthTemplate'
import type { Metadata } from 'next'

// ═════════════════════════════════════════════════════════════════════════════
// METADATA
// ═════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Account Aanmaken | SiteForge',
  description: 'Maak een account aan bij SiteForge en profiteer van sneller afrekenen, ordergeschiedenis en exclusieve aanbiedingen.',
  robots: 'noindex, nofollow', // Don't index auth pages
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* AuthTemplate - starts on register tab */}
      <AuthTemplate defaultTab="register" />
    </div>
  )
}

/**
 * Example: Guest Checkout Page using AuthTemplate
 *
 * This example shows how to create a guest checkout page,
 * typically used during the checkout process.
 *
 * File location: src/app/(ecommerce)/checkout/login/page.tsx
 */

import AuthTemplate from '@/branches/ecommerce/templates/auth/AuthTemplate'
import type { Metadata } from 'next'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// ═════════════════════════════════════════════════════════════════════════════
// METADATA
// ═════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Inloggen of Doorgaan als Gast | SiteForge',
  description: 'Log in op uw account of ga door als gast om uw bestelling af te ronden.',
  robots: 'noindex, nofollow',
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function CheckoutLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Checkout Progress Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back to Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar winkelwagen
            </Link>

            {/* Checkout Steps */}
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">1. Inloggen</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-400">2. Verzending</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-400">3. Betaling</span>
            </div>
          </div>
        </div>
      </div>

      {/* AuthTemplate - starts on guest tab for quick checkout */}
      <AuthTemplate defaultTab="guest" />
    </div>
  )
}

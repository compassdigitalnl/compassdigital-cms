'use client'

/**
 * AuthLayout - Master 2-column layout for authentication pages
 *
 * Features:
 * - 2-column grid: Branding panel (left) + Form panel (right)
 * - Responsive: Branding hidden on mobile (<900px)
 * - Min-height: calc(100vh - 140px) for header/footer space
 * - Optional custom branding content
 * - Form wrapper with 440px max-width
 *
 * @component
 * @example
 * <AuthLayout>
 *   <AuthTabSwitcher />
 *   <LoginForm />
 * </AuthLayout>
 *
 * @example
 * <AuthLayout hideBranding>
 *   <GuestCheckoutForm />
 * </AuthLayout>
 */

import { AuthBrandingPanel } from '../AuthBrandingPanel'

export interface AuthLayoutProps {
  children: React.ReactNode // Form content (right panel)
  brandingContent?: React.ReactNode // Custom branding (optional, replaces default)
  hideBranding?: boolean // Force hide branding panel
  className?: string
}

export function AuthLayout({
  children,
  brandingContent,
  hideBranding = false,
  className = '',
}: AuthLayoutProps) {
  return (
    <div
      className={`grid lg:grid-cols-2 ${className}`}
      style={{
        minHeight: 'calc(100vh - 140px)',
      }}
    >
      {/* LEFT: Branding Panel (hidden on mobile, optional on all) */}
      {!hideBranding && (
        <div className="hidden lg:block">
          {brandingContent || <AuthBrandingPanel />}
        </div>
      )}

      {/* RIGHT: Form Panel */}
      <div
        className="flex items-center justify-center px-10 py-10 lg:px-10 lg:py-16 max-lg:px-6 max-lg:py-6"
        style={{
          background: 'var(--color-background)',
        }}
      >
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
    </div>
  )
}

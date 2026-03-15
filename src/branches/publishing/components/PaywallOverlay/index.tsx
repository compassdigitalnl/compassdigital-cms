'use client'

/**
 * Sprint 7: Paywall Overlay Component
 *
 * Displays a paywall overlay for premium content that requires a subscription
 */

import React from 'react'
import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import { getAccessDenialMessage } from '@/branches/publishing/utils/checkContentAccess'
import type { ContentAccessResult } from '@/branches/publishing/utils/checkContentAccess'

export interface PaywallOverlayProps {
  /**
   * Access denial reason (from checkContentAccess)
   */
  reason: ContentAccessResult['reason']

  /**
   * Custom message override (from BlogPost.contentAccess.lockMessage)
   */
  customMessage?: string

  /**
   * Show as inline card instead of overlay
   */
  variant?: 'overlay' | 'card'

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Paywall Overlay Component
 *
 * Shows a gradient overlay with lock icon and upgrade CTA
 * for premium content that requires a subscription
 *
 * @example
 * ```tsx
 * <PaywallOverlay
 *   reason="no_subscription"
 *   customMessage="Upgrade voor toegang tot 40+ expertgidsen"
 * />
 * ```
 */
export function PaywallOverlay({
  reason,
  customMessage,
  variant = 'overlay',
  className = '',
}: PaywallOverlayProps) {
  // Get default message based on reason
  const defaultMessage = getAccessDenialMessage(reason)
  const message = customMessage || defaultMessage

  // Determine CTA based on reason
  const isNotLoggedIn = reason === 'not_logged_in'
  const ctaPrimary = isNotLoggedIn
    ? { text: 'Inloggen', href: '/inloggen' }
    : { text: 'Upgrade naar Pro', href: '/abonnementen' }

  const ctaSecondary = isNotLoggedIn ? { text: 'Account aanmaken', href: '/inloggen?tab=register' } : null

  if (variant === 'card') {
    return (
      <div
        className={`
          relative rounded-2xl border-2 border-dashed border-grey-light dark:border-navy
          bg-gradient-to-b from-white/50 to-grey-light/50 dark:from-navy/50 dark:to-navy/50
          backdrop-blur-sm p-12 text-center
          ${className}
        `}
      >
        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
          {/* Lock Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber to-amber-600 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-amber to-amber-600 rounded-full p-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-navy dark:text-white">Premium Content</h3>
            <p className="text-grey-dark dark:text-grey-mid text-lg">{message}</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 text-left w-full">
            <p className="text-sm font-medium text-grey-dark dark:text-grey-mid">
              Met een Pro abonnement krijg je:
            </p>
            <ul className="space-y-1 text-sm text-grey-dark dark:text-grey-mid">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Toegang tot alle premium artikelen
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Expertgidsen en tutorials
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Downloadbare resources
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild className="flex-1" size="lg">
              <Link href={ctaPrimary.href}>{ctaPrimary.text}</Link>
            </Button>
            {ctaSecondary && (
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href={ctaSecondary.href}>{ctaSecondary.text}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Overlay variant (default)
  return (
    <div
      className={`
        relative -mt-24 pt-24
        ${className}
      `}
    >
      {/* Gradient Overlay */}
      <div
        className="
          absolute inset-0 z-10
          bg-gradient-to-b from-transparent via-white/80 to-white
          dark:via-navy/80 dark:to-navy
        "
      />

      {/* Content Lock Card */}
      <div className="relative z-20 pt-32 pb-12">
        <div
          className="
            max-w-2xl mx-auto
            rounded-2xl border-2 border-dashed border-grey-light dark:border-navy
            bg-white/90 dark:bg-navy/90 backdrop-blur-md
            shadow-2xl p-8 sm:p-12
            text-center
          "
        >
          <div className="flex flex-col items-center space-y-6">
            {/* Lock Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber to-amber-600 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-amber to-amber-600 rounded-full p-5">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-navy dark:text-white">
                Premium Content
              </h3>
              <p className="text-grey-dark dark:text-grey-mid text-xl max-w-lg">{message}</p>
            </div>

            {/* Benefits List */}
            <div className="bg-grey-light dark:bg-navy rounded-xl p-6 w-full max-w-md">
              <p className="text-sm font-semibold text-grey-dark dark:text-grey-mid mb-3">
                Met een Pro abonnement krijg je:
              </p>
              <ul className="space-y-2 text-left">
                <li className="flex items-center gap-3 text-grey-dark dark:text-grey-mid">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Toegang tot 40+ premium artikelen</span>
                </li>
                <li className="flex items-center gap-3 text-grey-dark dark:text-grey-mid">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Expertgidsen en tutorials</span>
                </li>
                <li className="flex items-center gap-3 text-grey-dark dark:text-grey-mid">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Downloadbare PDF resources</span>
                </li>
                <li className="flex items-center gap-3 text-grey-dark dark:text-grey-mid">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Exclusieve e-learning modules</span>
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
              <Button asChild className="flex-1" size="lg">
                <Link href={ctaPrimary.href}>{ctaPrimary.text}</Link>
              </Button>
              {ctaSecondary && (
                <Button asChild variant="outline" className="flex-1" size="lg">
                  <Link href={ctaSecondary.href}>{ctaSecondary.text}</Link>
                </Button>
              )}
            </div>

            {/* Small Print */}
            <p className="text-xs text-grey-mid dark:text-grey-mid pt-4">
              Vanaf €9,99/maand • Altijd opzegbaar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

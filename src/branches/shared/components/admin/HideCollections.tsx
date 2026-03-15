'use client'

import { useEffect, useState } from 'react'

/**
 * Feature Toggle → Collection slug mapping
 *
 * Two sources checked in e-commerce settings:
 * 1. featureToggles.* — shop features (client-level, Feature Toggles tab)
 * 2. b2bFeatures.*   — B2B features (client-level, B2B Instellingen tab)
 *
 * Branch/content visibility is controlled at admin-level via ENV flags
 * (set per client on cms.compassdigital.nl), NOT by the client themselves.
 */
const ECOMMERCE_TOGGLE_MAP: Record<string, string[]> = {
  // Shop features
  enableReviews: ['product-reviews'],
  enableWishlist: ['wishlists'],
  enablePromotions: ['promotions'],
  enableRecentlyViewed: ['recently-viewed'],

  // Account features
  enableReturns: ['returns'],
  enableOrderLists: ['order-lists'],
  enableRecurringOrders: ['recurring-orders'],
  enableNotifications: ['notifications'],

  // Extra modules
  enableLoyalty: ['loyalty-tiers', 'loyalty-rewards', 'loyalty-transactions'],
  enableSubscriptions: ['subscription-plans', 'user-subscriptions', 'payment-methods', 'subscription-pages'],
  enableGiftVouchers: ['gift-vouchers'],
  enableLicenses: ['licenses', 'license-activations'],
}

const B2B_TOGGLE_MAP: Record<string, string[]> = {
  enableCustomerGroups: ['customer-groups'],
  enableCompanyAccounts: ['company-invites'],
  enableApprovalWorkflow: ['approval-requests'],
  enableQuotes: ['quotes'],
}

/**
 * HideCollections — Client-side component that hides admin sidebar items
 *
 * Two sources of hidden collections:
 * 1. Cookie/API — disabled collections per tenant (ENV-based feature flags)
 * 2. E-commerce Settings — featureToggles stored in database
 *
 * Both are merged. Empty nav groups are also hidden.
 */
export function HideCollections() {
  const [css, setCss] = useState('')

  useEffect(() => {
    const fullHostname = window.location.hostname

    // Platform zelf — nooit verbergen
    if (!fullHostname || fullHostname === 'cms.compassdigital.nl') {
      return
    }

    resolveHiddenCollections(fullHostname)
  }, [])

  async function resolveHiddenCollections(fullHostname: string) {
    const allDisabled: string[] = []

    // Source 1: Cookie-based disabled collections (ENV feature flags)
    const cookieDisabled = getDisabledFromCookie()
    if (cookieDisabled) {
      allDisabled.push(...cookieDisabled)
    } else {
      // Source 1b: NEXT_PUBLIC_DISABLED_COLLECTIONS env var (standalone deployments)
      const envDisabled = (process.env.NEXT_PUBLIC_DISABLED_COLLECTIONS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (envDisabled.length > 0) {
        allDisabled.push(...envDisabled)
      } else {
        // Fallback: API-based lookup (platform mode)
        const apiDisabled = await fetchDisabledFromAPI(fullHostname)
        allDisabled.push(...apiDisabled)
      }
    }

    // Source 2: E-commerce settings feature toggles (database)
    const featureDisabled = await fetchDisabledFromFeatureToggles()
    allDisabled.push(...featureDisabled)

    // Deduplicate and apply
    const unique = [...new Set(allDisabled)]
    if (unique.length > 0) {
      applyHiddenStyles(unique)
      // Wait for CSS to apply, then hide empty nav groups
      requestAnimationFrame(() => hideEmptyNavGroups())
    }
  }

  function getDisabledFromCookie(): string[] | null {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    const raw = cookies['x-tenant-disabled-collections']
    if (!raw) return null

    try {
      return JSON.parse(decodeURIComponent(raw))
    } catch {
      return null
    }
  }

  async function fetchDisabledFromAPI(fullHostname: string): Promise<string[]> {
    const subdomain = fullHostname.endsWith('.compassdigital.nl')
      ? fullHostname.replace('.compassdigital.nl', '')
      : null

    const searchParams = new URLSearchParams()
    searchParams.set('where[or][0][domain][equals]', fullHostname)
    if (subdomain) {
      searchParams.set('where[or][1][domain][equals]', subdomain)
    }

    try {
      const response = await fetch(`/api/platform/clients?${searchParams}`)
      const data = await response.json()
      const client = data?.docs?.[0]
      return client?.disabledCollections ?? []
    } catch {
      return []
    }
  }

  async function fetchDisabledFromFeatureToggles(): Promise<string[]> {
    try {
      const response = await fetch('/api/globals/e-commerce-settings?depth=0')
      if (!response.ok) return []
      const settings = await response.json()

      const disabled: string[] = []

      // E-commerce feature toggles (Feature Toggles tab)
      const toggles = settings?.featureToggles
      if (toggles) {
        for (const [key, slugs] of Object.entries(ECOMMERCE_TOGGLE_MAP)) {
          if (toggles[key] === false) {
            disabled.push(...(slugs as string[]))
          }
        }
      }

      // B2B feature toggles (B2B Instellingen tab)
      const b2b = settings?.b2bFeatures
      if (b2b) {
        for (const [key, slugs] of Object.entries(B2B_TOGGLE_MAP)) {
          if (b2b[key] === false) {
            disabled.push(...(slugs as string[]))
          }
        }
      }

      // Legacy features group (backwards compatibility)
      const legacy = settings?.features
      if (legacy && !toggles) {
        if (legacy.enableReviews === false) disabled.push('product-reviews')
        if (legacy.enableWishlist === false) disabled.push('wishlists')
        if (legacy.enableOrderLists === false) disabled.push('order-lists')
      }

      return disabled
    } catch {
      return []
    }
  }

  function applyHiddenStyles(disabled: string[]) {
    if (disabled.length === 0) return

    const styles = disabled
      .map((slug) => {
        // Hide both collections and globals (globals use /admin/globals/<slug>)
        return (
          `a[href="/admin/collections/${slug}"], ` +
          `a[href="/admin/collections/${slug}/"], ` +
          `a[href*="/admin/collections/${slug}/"], ` +
          `li:has(> a[href="/admin/collections/${slug}/"]), ` +
          `a[href="/admin/globals/${slug}"], ` +
          `a[href="/admin/globals/${slug}/"], ` +
          `li:has(> a[href="/admin/globals/${slug}/"]) { display: none !important; }`
        )
      })
      .join('\n')

    setCss(styles)
  }

  /**
   * Hide nav group headers when all their child links are hidden.
   * Payload v3 sidebar uses [id^="nav-group-"] for group containers.
   */
  function hideEmptyNavGroups() {
    const navGroups = document.querySelectorAll('[id^="nav-group-"]')
    navGroups.forEach((group) => {
      const links = group.querySelectorAll('a[href*="/admin/collections/"], a[href*="/admin/globals/"]')
      if (links.length === 0) return

      const allHidden = Array.from(links).every((link) => {
        const li = link.closest('li')
        if (!li) return link.closest('[style*="display: none"]') !== null
        return getComputedStyle(li).display === 'none'
      })

      if (allHidden) {
        ;(group as HTMLElement).style.display = 'none'
      }
    })
  }

  if (!css) return null
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

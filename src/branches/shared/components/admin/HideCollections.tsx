'use client'

import { useEffect, useState } from 'react'

/**
 * Feature Toggle → Collection slug mapping
 *
 * Maps e-commerce settings featureToggles to the collection slugs they control.
 * When a toggle is false, all mapped collections are hidden from the sidebar.
 */
const FEATURE_TOGGLE_MAP: Record<string, string[]> = {
  // Catalogus & Winkel
  enableProducts: ['products', 'product-categories'],
  enableBrands: ['brands'],
  enableBranches: ['branches'],
  enableRecentlyViewed: ['recently-viewed'],
  enableEditionNotifications: ['edition-notifications'],

  // Reviews & Verlanglijst
  enableReviews: ['product-reviews'],
  enableWishlist: ['wishlists'],

  // Checkout & Bestellingen
  enableOrders: ['orders'],
  enableInvoices: ['invoices'],
  enableReturns: ['returns'],
  enablePromotions: ['promotions'],

  // Mijn Account
  enableOrderLists: ['order-lists'],
  enableRecurringOrders: ['recurring-orders'],
  enableNotifications: ['notifications'],

  // Loyalty & Abonnementen
  enableLoyalty: ['loyalty-tiers', 'loyalty-rewards', 'loyalty-transactions'],
  enableSubscriptions: ['subscription-plans', 'user-subscriptions', 'payment-methods', 'subscription-pages'],
  enableGiftVouchers: ['gift-vouchers'],
  enableLicenses: ['licenses', 'license-activations'],

  // B2B
  enableCustomerGroups: ['customer-groups'],
  enableCompanyAccounts: ['company-invites'],
  enableApprovalWorkflow: ['approval-requests'],
  enableQuotes: ['quotes'],

  // Marktplaats
  enableVendors: ['vendors'],
  enableVendorReviews: ['vendor-reviews'],
  enableWorkshops: ['workshops'],

  // Content & Publicaties
  enableBlog: ['blog-posts', 'blog-categories'],
  enableTestimonials: ['testimonials'],
  enableCases: ['cases'],
  enablePartners: ['partners'],
  enableServices: ['services'],
  enableMagazines: ['magazines'],

  // Branche-specifiek
  enableExperiences: ['experiences', 'experience-categories', 'experience-reviews'],
  enableConstruction: ['construction-services', 'construction-projects', 'construction-reviews', 'quote-requests'],
  enableHospitality: ['treatments', 'practitioners', 'appointments'],
  enableBeauty: ['beauty-services', 'stylists', 'beauty-bookings'],
  enableHoreca: ['menu-items', 'reservations', 'events'],

  // Geavanceerd
  enableAbTesting: ['ab-tests', 'ab-test-results'],
  enablePushNotifications: ['push-subscriptions'],
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
    if (!fullHostname || fullHostname === 'cms.compassdigital.nl' || fullHostname === 'localhost') {
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
      // Fallback: API-based lookup
      const apiDisabled = await fetchDisabledFromAPI(fullHostname)
      allDisabled.push(...apiDisabled)
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

      // Check featureToggles group (new canonical location)
      const toggles = settings?.featureToggles
      if (toggles) {
        for (const [toggleKey, collectionSlugs] of Object.entries(FEATURE_TOGGLE_MAP)) {
          if (toggles[toggleKey] === false) {
            disabled.push(...(collectionSlugs as string[]))
          }
        }
      }

      // Also check legacy features group for backwards compatibility
      const legacyFeatures = settings?.features
      if (legacyFeatures && !toggles) {
        const legacyMap: Record<string, string[]> = {
          enableReviews: ['product-reviews'],
          enableWishlist: ['wishlists'],
          enableOrderLists: ['order-lists'],
        }
        for (const [key, slugs] of Object.entries(legacyMap)) {
          if (legacyFeatures[key] === false) {
            disabled.push(...slugs)
          }
        }
      }

      return disabled
    } catch {
      return []
    }
  }

  function applyHiddenStyles(disabled: string[]) {
    if (disabled.length === 0) return

    const styles = disabled
      .map(
        (slug) =>
          `a[href="/admin/collections/${slug}"], ` +
          `a[href="/admin/collections/${slug}/"], ` +
          `a[href*="/admin/collections/${slug}/"], ` +
          `li:has(> a[href="/admin/collections/${slug}/"]) { display: none !important; }`,
      )
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
      const links = group.querySelectorAll('a[href*="/admin/collections/"]')
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

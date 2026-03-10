'use client'

import { useEffect, useState } from 'react'

/**
 * Feature Toggle → Collection slug mapping
 *
 * Maps e-commerce settings feature toggles to the collection slugs
 * they control. When a toggle is false, the collection is hidden.
 */
const FEATURE_TOGGLE_MAP: Record<string, string[]> = {
  enableReviews: ['product-reviews'],
  enableWishlist: ['wishlists'],
  enableOrderLists: ['order-lists'],
}

/**
 * HideCollections — Client-side component that hides admin sidebar items
 *
 * Two sources of hidden collections:
 * 1. Cookie/API — disabled collections per tenant (ENV-based feature flags)
 * 2. E-commerce Settings — feature toggles stored in database
 *
 * Both are merged to determine which collections to hide.
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
    applyHiddenStyles(unique)
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
      const features = settings?.features
      if (!features) return []

      const disabled: string[] = []
      for (const [toggleKey, collectionSlugs] of Object.entries(FEATURE_TOGGLE_MAP)) {
        if (features[toggleKey] === false) {
          disabled.push(...collectionSlugs)
        }
      }

      if (disabled.length > 0) {
        console.log('[HideCollections] Feature toggles hiding:', disabled)
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
          `a[href="/admin/collections/${slug}/"], ` +
          `a[href*="/admin/collections/${slug}/"], ` +
          `li:has(> a[href="/admin/collections/${slug}/"]) { display: none !important; }`,
      )
      .join('\n')

    setCss(styles)
  }

  if (!css) return null
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

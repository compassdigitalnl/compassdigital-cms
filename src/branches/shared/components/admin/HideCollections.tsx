'use client'

import { useEffect, useState } from 'react'

/**
 * HideCollections — Server + Client hybrid component
 *
 * NIEUW: Leest tenant context uit cookies (gezet door middleware via headers)
 * OF valt terug op oude API-based methode voor backwards compatibility.
 *
 * Server-side: Middleware injecteert x-tenant-disabled-collections header
 * Client-side: Leest cookie en injecteert CSS om collections te verbergen
 */
export function HideCollections() {
  const [css, setCss] = useState('')

  useEffect(() => {
    const fullHostname = window.location.hostname

    // Platform zelf — nooit verbergen
    if (!fullHostname || fullHostname === 'cms.compassdigital.nl' || fullHostname === 'localhost') {
      console.log('[HideCollections] Platform admin - no filtering')
      return
    }

    console.log('[HideCollections] Tenant admin detected:', fullHostname)

    // Try to read disabled collections from cookie (set by middleware/server)
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    const disabledCollectionsFromCookie = cookies['x-tenant-disabled-collections']

    if (disabledCollectionsFromCookie) {
      try {
        const disabled = JSON.parse(decodeURIComponent(disabledCollectionsFromCookie))
        console.log('[HideCollections] ✅ Disabled collections from cookie:', disabled)
        applyHiddenStyles(disabled)
        return
      } catch (e) {
        console.error('[HideCollections] Failed to parse cookie:', e)
      }
    }

    // Fallback: API-based lookup (old method)
    console.log('[HideCollections] Cookie not found, falling back to API lookup')
    fetchAndHideCollections(fullHostname)
  }, [])

  function applyHiddenStyles(disabled: string[]) {
    if (disabled.length === 0) {
      console.log('[HideCollections] No collections to hide')
      return
    }

    const styles = disabled
      .map(
        (slug) =>
          `a[href="/admin/collections/${slug}/"], ` +
          `a[href*="/admin/collections/${slug}/"], ` +
          `li:has(> a[href="/admin/collections/${slug}/"]) { display: none !important; }`,
      )
      .join('\n')

    console.log('[HideCollections] ✅ Injecting CSS to hide:', disabled)
    setCss(styles)
  }

  async function fetchAndHideCollections(fullHostname: string) {
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

      if (!client) {
        console.warn('[HideCollections] No client found for:', fullHostname)
        return
      }

      console.log('[HideCollections] ✅ Found client:', client.name)
      const disabled: string[] = client.disabledCollections ?? []
      applyHiddenStyles(disabled)
    } catch (err) {
      console.error('[HideCollections] ❌ API error:', err)
    }
  }

  if (!css) return null
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

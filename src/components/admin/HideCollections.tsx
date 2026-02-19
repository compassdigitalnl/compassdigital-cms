'use client'

import { useEffect, useState } from 'react'

/**
 * HideCollections — client component dat per-hostname collections verbergt
 * in de Payload admin navigatie.
 *
 * Werkt via CSS injection: haalt Client.disabledCollections op via API
 * en injecteert CSS die de nav-links voor die collections verbergt.
 */
export function HideCollections() {
  const [css, setCss] = useState('')

  useEffect(() => {
    const fullHostname = window.location.hostname

    // Platform zelf — nooit verbergen
    if (!fullHostname || fullHostname === 'cms.compassdigital.nl' || fullHostname === 'localhost') {
      return
    }

    console.log('[HideCollections] Hostname:', fullHostname)

    // Try both full hostname AND subdomain (voor backwards compatibility)
    // Bijv: "plastimed01.compassdigital.nl" probeer beide:
    //   1. "plastimed01.compassdigital.nl" (volledig)
    //   2. "plastimed01" (alleen subdomain)
    const subdomain = fullHostname.endsWith('.compassdigital.nl')
      ? fullHostname.replace('.compassdigital.nl', '')
      : null

    const searchParams = new URLSearchParams()
    searchParams.set('where[or][0][domain][equals]', fullHostname)
    if (subdomain) {
      searchParams.set('where[or][1][domain][equals]', subdomain)
    }

    console.log('[HideCollections] Searching for domains:', [fullHostname, subdomain].filter(Boolean))

    // Haal client config op via API
    fetch(`/api/platform/clients?${searchParams}`)
      .then((r) => r.json())
      .then((data) => {
        const client = data?.docs?.[0]
        if (!client) {
          console.warn(
            '[HideCollections] No client found for domains:',
            [fullHostname, subdomain].filter(Boolean),
          )
          return
        }

        console.log('[HideCollections] ✅ Found client:', client.name)
        console.log('[HideCollections] Disabled collections:', client.disabledCollections || [])

        const disabled: string[] = client.disabledCollections ?? []
        if (disabled.length === 0) {
          console.log('[HideCollections] No collections to hide')
          return
        }

        // Genereer CSS om collections te verbergen
        const styles = disabled
          .map(
            (slug) =>
              `a[href="/admin/collections/${slug}"], ` +
              `a[href*="/admin/collections/${slug}/"], ` +
              `li:has(> a[href="/admin/collections/${slug}"]) { display: none !important; }`,
          )
          .join('\n')

        console.log('[HideCollections] ✅ Injecting CSS to hide collections')
        setCss(styles)
      })
      .catch((err) => {
        console.error('[HideCollections] ❌ API error:', err)
        // Stille fail — nooit de admin breken
      })
  }, [])

  if (!css) return null
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

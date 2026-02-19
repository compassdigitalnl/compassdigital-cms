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

    // Extract subdomain: "plastimed01.compassdigital.nl" → "plastimed01"
    // Of gebruik volledige hostname als fallback voor custom domains
    const subdomain = fullHostname.endsWith('.compassdigital.nl')
      ? fullHostname.replace('.compassdigital.nl', '')
      : fullHostname

    console.log('[HideCollections] Hostname:', fullHostname, '→ Searching domain:', subdomain)

    // Haal client config op via API (zoek op subdomain OF full hostname)
    fetch(
      `/api/platform/clients?where[or][0][domain][equals]=${subdomain}&where[or][1][domain][equals]=${fullHostname}`,
    )
      .then((r) => r.json())
      .then((data) => {
        const client = data?.docs?.[0]
        if (!client) {
          console.warn('[HideCollections] No client found for domain:', subdomain, '/', fullHostname)
          return
        }

        console.log('[HideCollections] Found client:', client.name, '- Disabled:', client.disabledCollections)

        const disabled: string[] = client.disabledCollections ?? []
        if (disabled.length === 0) return

        // Genereer CSS
        const styles = disabled
          .map(
            (slug) =>
              `a[href="/admin/collections/${slug}"], ` +
              `a[href*="/admin/collections/${slug}/"], ` +
              `li:has(> a[href="/admin/collections/${slug}"]) { display: none !important; }`,
          )
          .join('\n')

        console.log('[HideCollections] Injecting CSS to hide:', disabled)
        setCss(styles)
      })
      .catch((err) => {
        console.error('[HideCollections] API error:', err)
        // Stille fail — nooit de admin breken
      })
  }, [])

  if (!css) return null
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

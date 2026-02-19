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
    const host = window.location.hostname

    // Platform zelf — nooit verbergen
    if (!host || host === 'cms.compassdigital.nl' || host === 'localhost') {
      return
    }

    // Haal client config op via API
    fetch(`/api/platform/clients?where[domain][equals]=${host}`)
      .then((r) => r.json())
      .then((data) => {
        const client = data?.docs?.[0]
        if (!client) return

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

        setCss(styles)
      })
      .catch(() => {
        // Stille fail — nooit de admin breken
      })
  }, [])

  if (!css) return null
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

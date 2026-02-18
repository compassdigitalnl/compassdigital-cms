import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * HideCollections — server component dat per-hostname collections verbergt
 * in de Payload admin navigatie.
 *
 * Werkt via CSS injection: leest de Client.disabledCollections uit de database
 * en injecteert CSS die de nav-links voor die collections verbergt.
 *
 * Geen aparte PM2 processen nodig — werkt in het gedeelde process.
 */
export async function HideCollections() {
  try {
    const headersList = await headers()
    const host = (headersList.get('host') || '').split(':')[0] // strip port

    // Platform zelf — nooit verbergen
    if (!host || host === 'cms.compassdigital.nl' || host === 'localhost') {
      return null
    }

    const payload = await getPayload({ config })

    // Zoek de Client op basis van domain
    const result = await payload.find({
      collection: 'clients',
      where: {
        domain: { equals: host },
      },
      limit: 1,
      depth: 0,
    })

    const client = result.docs[0]
    if (!client) return null

    // Haal disabledCollections op (kan string[] of object[] zijn)
    const disabled: string[] = (client.disabledCollections as string[] | undefined) ?? []
    if (disabled.length === 0) return null

    // Genereer CSS die de nav-links verbergt
    const css = disabled
      .map(
        (slug) =>
          `a[href="/admin/collections/${slug}"], ` +
          `a[href*="/admin/collections/${slug}/"], ` +
          `li:has(> a[href="/admin/collections/${slug}"]) { display: none !important; }`,
      )
      .join('\n')

    return <style dangerouslySetInnerHTML={{ __html: css }} />
  } catch {
    // Nooit de admin breken door een fout in dit component
    return null
  }
}

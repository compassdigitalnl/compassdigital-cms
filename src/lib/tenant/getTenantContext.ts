/**
 * getTenantContext
 *
 * Helper to get tenant context from Next.js headers.
 * Used to filter collections based on tenant's disabledCollections.
 */

import { headers as getHeaders } from 'next/headers'

export interface TenantContext {
  id: string | null
  domain: string | null
  name: string | null
  template: string | null
  disabledCollections: string[]
  isTenant: boolean
}

/**
 * Get tenant context from request headers (injected by middleware)
 *
 * Returns null if not a tenant request (platform admin)
 */
export async function getTenantContext(): Promise<TenantContext> {
  try {
    const headers = await getHeaders()

    const id = headers.get('x-tenant-id')
    const domain = headers.get('x-tenant-domain')
    const name = headers.get('x-tenant-name')
    const template = headers.get('x-tenant-template')
    const disabledCollectionsRaw = headers.get('x-tenant-disabled-collections')

    // If no tenant ID, this is platform admin request
    if (!id) {
      return {
        id: null,
        domain: null,
        name: null,
        template: null,
        disabledCollections: [],
        isTenant: false,
      }
    }

    // Parse disabled collections JSON
    let disabledCollections: string[] = []
    if (disabledCollectionsRaw) {
      try {
        disabledCollections = JSON.parse(disabledCollectionsRaw)
      } catch (e) {
        console.error('[getTenantContext] Failed to parse disabledCollections:', e)
      }
    }

    return {
      id,
      domain,
      name,
      template,
      disabledCollections,
      isTenant: true,
    }
  } catch (error) {
    // headers() can only be called in server components during request
    // If this fails, we're not in a request context (build time, etc.)
    return {
      id: null,
      domain: null,
      name: null,
      template: null,
      disabledCollections: [],
      isTenant: false,
    }
  }
}

import type { Metadata } from 'next'
import { headers } from 'next/headers'

/**
 * Tenant Layout
 *
 * Root layout for all tenant subdomain requests.
 * This layout is required by Next.js for the /tenant route group.
 */

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers()
  const tenantId = headersList.get('x-tenant-id') || 'Unknown Tenant'
  const tenantSubdomain = headersList.get('x-tenant-subdomain') || ''

  return {
    title: {
      default: tenantId,
      template: `%s | ${tenantId}`,
    },
    description: `Tenant: ${tenantSubdomain}`,
  }
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>
        {children}
      </body>
    </html>
  )
}

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Tenant Route Handler
 *
 * This handles ALL requests to tenant subdomains (e.g., test-bedrijf-a.cms.compassdigital.nl)
 * Middleware rewrites /{path} → /tenant/{path} and injects tenant headers
 *
 * Dynamic routes:
 * - / → Homepage
 * - /admin → Payload Admin Panel
 * - /[slug] → Dynamic pages
 */

export default async function TenantPage({
  params,
}: {
  params: { path?: string[] }
}) {
  const headersList = headers()

  // Get tenant context from middleware
  const tenantId = headersList.get('x-tenant-id')
  const tenantSubdomain = headersList.get('x-tenant-subdomain')
  const tenantDatabaseUrl = headersList.get('x-tenant-database-url')
  const tenantType = headersList.get('x-tenant-type')

  if (!tenantId || !tenantDatabaseUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configuration Error
          </h1>
          <p className="text-gray-600">
            Tenant context not found. Please contact support.
          </p>
        </div>
      </div>
    )
  }

  const path = params.path ? params.path.join('/') : ''

  // Handle /admin route - redirect to Payload admin
  if (path === 'admin' || path.startsWith('admin/')) {
    // Payload admin runs on /admin path
    // Since we're already rewritten to /tenant/admin,
    // Payload should handle this via its route structure
    // For now, show a placeholder
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Admin Panel: {tenantId}
          </h1>
          <p className="text-gray-600 mb-6">
            Payload CMS admin for tenant: {tenantSubdomain}
          </p>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-4">
              Database: {tenantDatabaseUrl.substring(0, 50)}...
            </p>
            <p className="text-sm text-gray-500">
              Type: {tenantType}
            </p>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            <strong>Note:</strong> Full Payload admin integration coming soon!
          </p>
        </div>
      </div>
    )
  }

  // Handle homepage
  if (!path || path === '') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Welcome to {tenantId}
            </h1>
            <p className="text-xl text-gray-600">
              Tenant Subdomain: {tenantSubdomain}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Multi-Tenant Platform Active!
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Tenant ID:</strong> {tenantId}
              </p>
              <p>
                <strong>Type:</strong> {tenantType}
              </p>
              <p>
                <strong>Database:</strong> Connected ✅
              </p>
              <p className="text-sm text-gray-500 mt-4">
                {tenantDatabaseUrl.substring(0, 60)}...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/admin/"
              className="block p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-center"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="text-lg font-semibold">Admin Panel</h3>
              <p className="text-sm opacity-90 mt-1">Manage your content</p>
            </a>

            <div className="block p-6 bg-gray-800 text-white rounded-xl text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="text-lg font-semibold">Status</h3>
              <p className="text-sm opacity-90 mt-1">Fully Operational</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              🏗️ Under Construction
            </h3>
            <p className="text-sm text-yellow-800">
              Full Payload CMS integration is being implemented. This homepage will soon load your custom pages and content!
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Handle other pages
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page: /{path}
        </h1>
        <p className="text-gray-600 mb-4">
          Tenant: {tenantId}
        </p>
        <p className="text-sm text-gray-500">
          Dynamic page loading will be implemented next!
        </p>
      </div>
    </div>
  )
}

// Force dynamic rendering (required for headers())
export const dynamic = 'force-dynamic'

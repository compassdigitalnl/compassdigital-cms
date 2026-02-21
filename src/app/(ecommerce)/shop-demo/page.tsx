import Link from 'next/link'

export default function ShopDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Medical Equipment Shop
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Complete Demo Implementation
          </p>
          <p className="text-gray-600">
            Shop with products, categories, and B2B customer groups
          </p>
        </div>

        {/* Main CTA */}
        <div className="space-y-4 mb-12">
          <Link
            href="/shop/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            🛍️ Browse Products →
          </Link>

          <div className="flex items-center justify-center gap-4 text-sm">
            <Link
              href="/admin/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Admin Panel
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/api/products/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              API
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-bold text-gray-900 mb-2">2 Demo Products</h3>
            <p className="text-sm text-gray-600">
              Medical Monitor XR-2000 & Digital Stethoscope DS-100
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-gray-900 mb-2">3 Customer Groups</h3>
            <p className="text-sm text-gray-600">
              Hospital (15%), Clinic (10%), Retail (B2C)
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="font-bold text-gray-900 mb-2">2 Categories</h3>
            <p className="text-sm text-gray-600">
              Medical Devices & Diagnostics Equipment
            </p>
          </div>
        </div>

        {/* Implementation Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✅ What's Implemented</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Product catalog with pricing & stock</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Product detail pages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Category filtering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Customer groups (B2B/B2C)</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Admin panel (Payload CMS)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>REST API endpoints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Add to cart UI</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

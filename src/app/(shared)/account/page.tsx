import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Heart, FileText, RefreshCw } from 'lucide-react'
import type { Order, Product } from '@/payload-types'

export const metadata = {
  title: 'Mijn Account | Dashboard',
  description: 'Beheer je account, bestellingen en favorieten',
}

export default async function AccountDashboard() {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account')
  }

  // Fetch user's recent orders
  const recentOrders = await payload.find({
    collection: 'orders',
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 1,
    limit: 5,
    sort: '-createdAt',
  })

  // Fetch user's favorites
  const favoriteProducts: Product[] = []
  if (user.favorites && Array.isArray(user.favorites) && user.favorites.length > 0) {
    for (const fav of user.favorites.slice(0, 6)) {
      if (typeof fav.product === 'string') {
        const product = await payload.findByID({
          collection: 'products',
          id: fav.product,
          depth: 1,
        })
        if (product) {
          favoriteProducts.push(product as Product)
        }
      } else if (fav.product && typeof fav.product === 'object') {
        favoriteProducts.push(fav.product as Product)
      }
    }
  }

  // Fetch user's recurring orders
  const recurringOrders = await payload.find({
    collection: 'recurring-orders',
    where: {
      user: {
        equals: user.id,
      },
      status: {
        equals: 'active',
      },
    },
    depth: 0,
    limit: 3,
  })

  // Get display name
  const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welkom terug, {displayName}!</h1>
        <p className="text-gray-600 mt-1">Bekijk en beheer je account informatie en bestellingen</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <Link
          href="/account/orders/"
          className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bestellingen</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{recentOrders.totalDocs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Link>

        {/* Favorites */}
        <Link
          href="/account/favorites/"
          className="bg-white rounded-lg border border-gray-200 p-5 hover:border-pink-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorieten</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {user.favorites?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </Link>

        {/* Recurring Orders */}
        <Link
          href="/account/recurring-orders/"
          className="bg-white rounded-lg border border-gray-200 p-5 hover:border-green-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terugkerende Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {recurringOrders.totalDocs}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Link>

        {/* Invoices */}
        <Link
          href="/account/invoices/"
          className="bg-white rounded-lg border border-gray-200 p-5 hover:border-purple-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Facturen</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recente Bestellingen</h2>
            <Link
              href="/account/orders/"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Bekijk alle →
            </Link>
          </div>
        </div>

        {recentOrders.docs.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Je hebt nog geen bestellingen geplaatst</p>
            <Link
              href="/shop/"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Start met winkelen
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentOrders.docs.slice(0, 5).map((order) => {
              const typedOrder = order as Order
              return (
                <Link
                  key={typedOrder.id}
                  href={`/account/orders/${typedOrder.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{String(typedOrder.orderNumber).padStart(5, '0')}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            typedOrder.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : typedOrder.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : typedOrder.status === 'shipped'
                                  ? 'bg-purple-100 text-purple-800'
                                  : typedOrder.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {typedOrder.status === 'completed'
                            ? 'Voltooid'
                            : typedOrder.status === 'processing'
                              ? 'In behandeling'
                              : typedOrder.status === 'shipped'
                                ? 'Verzonden'
                                : typedOrder.status === 'cancelled'
                                  ? 'Geannuleerd'
                                  : 'In afwachting'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(typedOrder.createdAt).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        €{typedOrder.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {typedOrder.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Favorites */}
      {favoriteProducts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Favoriete Producten</h2>
              <Link
                href="/account/favorites/"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Bekijk alle →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-gray-200">
            {favoriteProducts.slice(0, 6).map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? typeof product.images[0].image === 'object' && product.images[0].image?.url
                    ? product.images[0].image.url
                    : null
                  : null

              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    {product.title}
                  </p>
                  {product.price && (
                    <p className="text-sm font-semibold text-blue-600">€{product.price.toFixed(2)}</p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

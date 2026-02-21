import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import type { Order } from '@/payload-types'

export const metadata = {
  title: 'Mijn Bestellingen | Account',
  description: 'Bekijk je bestellingen en track je leveringen',
}

export default async function OrdersPage() {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/orders')
  }

  // Fetch user's orders
  const orders = await payload.find({
    collection: 'orders',
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  // Group orders by status
  const pendingOrders = orders.docs.filter((order) => (order as Order).status === 'pending')
  const processingOrders = orders.docs.filter((order) => (order as Order).status === 'processing')
  const shippedOrders = orders.docs.filter((order) => (order as Order).status === 'shipped')
  const completedOrders = orders.docs.filter((order) => (order as Order).status === 'completed')
  const cancelledOrders = orders.docs.filter((order) => (order as Order).status === 'cancelled')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mijn Bestellingen</h1>
            <p className="text-gray-600 mt-1">Bekijk en track al je bestellingen</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Totaal bestellingen</p>
              <p className="text-2xl font-bold text-gray-900">{orders.totalDocs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Pending */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">In afwachting</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{pendingOrders.length}</p>
        </div>

        {/* Processing */}
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-blue-700 font-medium">In behandeling</p>
          </div>
          <p className="text-xl font-bold text-blue-900">{processingOrders.length}</p>
        </div>

        {/* Shipped */}
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs text-purple-700 font-medium">Verzonden</p>
          </div>
          <p className="text-xl font-bold text-purple-900">{shippedOrders.length}</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs text-green-700 font-medium">Voltooid</p>
          </div>
          <p className="text-xl font-bold text-green-900">{completedOrders.length}</p>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-xs text-red-700 font-medium">Geannuleerd</p>
          </div>
          <p className="text-xl font-bold text-red-900">{cancelledOrders.length}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alle Bestellingen</h2>
        </div>

        {orders.docs.length === 0 ? (
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
            {orders.docs.map((order) => {
              const ord = order as Order
              return (
                <Link
                  key={ord.id}
                  href={`/account/orders/${ord.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-base font-semibold text-gray-900">
                          Order #{String(ord.orderNumber).padStart(5, '0')}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ord.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : ord.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'shipped'
                                  ? 'bg-purple-100 text-purple-800'
                                  : ord.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ord.status === 'completed'
                            ? 'Voltooid'
                            : ord.status === 'processing'
                              ? 'In behandeling'
                              : ord.status === 'shipped'
                                ? 'Verzonden'
                                : ord.status === 'cancelled'
                                  ? 'Geannuleerd'
                                  : 'In afwachting'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>
                          {new Date(ord.createdAt).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>{ord.items?.length || 0} item(s)</span>
                        {ord.trackingNumber && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-xs">Track: {ord.trackingNumber}</span>
                          </>
                        )}
                      </div>

                      {/* Order Items Preview */}
                      {ord.items && ord.items.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {ord.items.slice(0, 3).map((item, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs"
                            >
                              {typeof item.product === 'object' && item.product?.title ? (
                                <>
                                  <span className="text-gray-700">{item.product.title}</span>
                                  <span className="text-gray-400">×{item.quantity}</span>
                                </>
                              ) : (
                                <span className="text-gray-500">Product</span>
                              )}
                            </div>
                          ))}
                          {ord.items.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{ord.items.length - 3} meer
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Order Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-600 mb-1">Totaal</p>
                      <p className="text-xl font-bold text-gray-900">€{ord.total.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

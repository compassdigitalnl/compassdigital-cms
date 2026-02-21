import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  X,
} from 'lucide-react'
import type { Order, Product, Media } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Bestelling ${id} | Mijn Account`,
    description: 'Bekijk besteldetails en track je levering',
  }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/orders/' + id)
  }

  // Fetch order
  let order: Order
  try {
    const doc = await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
    })
    order = doc as Order

    // Verify this order belongs to the user
    const orderUserId = typeof order.user === 'string' ? order.user : order.user?.id || null
    if (orderUserId !== user.id) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  // Timeline items based on order status and timestamps
  const timelineItems = [
    {
      status: 'pending',
      label: 'Bestelling geplaatst',
      date: order.createdAt,
      icon: Clock,
      completed: true,
      description: 'Je bestelling is succesvol ontvangen',
    },
    {
      status: 'processing',
      label: 'In behandeling',
      date: order.processingDate || null,
      icon: Package,
      completed: ['processing', 'shipped', 'completed'].includes(order.status),
      description: 'We zijn je bestelling aan het voorbereiden',
    },
    {
      status: 'shipped',
      label: 'Verzonden',
      date: order.shippedDate || null,
      icon: Truck,
      completed: ['shipped', 'completed'].includes(order.status),
      description: order.trackingNumber
        ? `Track & Trace: ${order.trackingNumber}`
        : 'Je bestelling is onderweg',
    },
    {
      status: 'completed',
      label: 'Afgeleverd',
      date: order.completedDate || null,
      icon: CheckCircle,
      completed: order.status === 'completed',
      description: 'Je bestelling is succesvol afgeleverd',
    },
  ]

  // If order is cancelled, show that instead
  if (order.status === 'cancelled') {
    timelineItems.push({
      status: 'cancelled',
      label: 'Geannuleerd',
      date: order.cancelledDate || order.updatedAt,
      icon: X,
      completed: true,
      description: order.cancelReason || 'Deze bestelling is geannuleerd',
    })
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar bestellingen
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bestelling #{String(order.orderNumber).padStart(5, '0')}
            </h1>
            <p className="text-gray-600 mt-1">
              Geplaatst op{' '}
              {new Date(order.createdAt).toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              order.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : order.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'shipped'
                    ? 'bg-purple-100 text-purple-800'
                    : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
          >
            {order.status === 'completed'
              ? 'Voltooid'
              : order.status === 'processing'
                ? 'In behandeling'
                : order.status === 'shipped'
                  ? 'Verzonden'
                  : order.status === 'cancelled'
                    ? 'Geannuleerd'
                    : 'In afwachting'}
          </span>
        </div>
      </div>

      {/* Order Timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Bestelling Tracking</h2>

          <div className="space-y-6">
            {timelineItems
              .filter((item) => item.status !== 'cancelled')
              .map((item, index) => {
                const Icon = item.icon
                const isLast = index === timelineItems.length - 1

                return (
                  <div key={item.status} className="relative">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div
                        className={`absolute left-5 top-12 bottom-0 w-0.5 ${
                          item.completed ? 'bg-blue-200' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <p
                          className={`text-sm font-semibold ${
                            item.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            item.completed ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          {item.description}
                        </p>
                        {item.date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(item.date).toLocaleDateString('nl-NL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Cancelled Notice */}
      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900">Bestelling geannuleerd</p>
              <p className="text-xs text-red-700 mt-1">
                {order.cancelReason || 'Deze bestelling is geannuleerd'}
              </p>
              {order.cancelledDate && (
                <p className="text-xs text-red-600 mt-2">
                  Geannuleerd op{' '}
                  {new Date(order.cancelledDate).toLocaleDateString('nl-NL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Verzendadres</h2>
          </div>
          {order.shippingAddress && typeof order.shippingAddress === 'object' ? (
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{user.name}</p>
              {user.accountType === 'b2b' &&
                typeof user.company === 'object' &&
                user.company?.name && <p>{user.company.name}</p>}
              <p>
                {order.shippingAddress.street} {order.shippingAddress.houseNumber}
                {order.shippingAddress.houseNumberAddition || ''}
              </p>
              <p>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </p>
              {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Geen verzendadres beschikbaar</p>
          )}
        </div>

        {/* Payment & Invoice */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Betaling & Factuur</h2>
          </div>
          <div className="space-y-3">
            {order.paymentMethod && (
              <div>
                <p className="text-sm text-gray-600">Betaalmethode</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {order.paymentMethod === 'creditcard'
                    ? 'Creditcard'
                    : order.paymentMethod === 'ideal'
                      ? 'iDEAL'
                      : order.paymentMethod === 'bancontact'
                        ? 'Bancontact'
                        : order.paymentMethod === 'invoice'
                          ? 'Factuur'
                          : 'Overig'}
                </p>
              </div>
            )}
            {order.paymentStatus && (
              <div>
                <p className="text-sm text-gray-600">Betalingsstatus</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.paymentStatus === 'paid'
                    ? 'Betaald'
                    : order.paymentStatus === 'pending'
                      ? 'In afwachting'
                      : order.paymentStatus === 'failed'
                        ? 'Mislukt'
                        : 'Terugbetaald'}
                </span>
              </div>
            )}
            {typeof order.invoice === 'object' && order.invoice?.id && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Factuur</p>
                <Link
                  href={`/account/invoices/${order.invoice.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Bekijk factuur
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Bestelde Producten</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => {
              const product = typeof item.product === 'object' ? (item.product as Product) : null
              const imageUrl =
                product?.images && product.images.length > 0
                  ? typeof product.images[0].image === 'object' &&
                    (product.images[0].image as Media)?.url
                    ? (product.images[0].image as Media).url
                    : null
                  : null

              return (
                <div key={index} className="p-4 flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product?.title || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {product?.title || 'Product'}
                    </p>
                    {product?.sku && (
                      <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">Aantal: {item.quantity}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">€{item.price.toFixed(2)} / stuk</p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">Geen producten gevonden</div>
          )}
        </div>

        {/* Order Totals */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="max-w-md ml-auto space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotaal</span>
              <span className="text-gray-900 font-medium">€{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Korting</span>
                <span className="text-green-600 font-medium">-€{order.discount.toFixed(2)}</span>
              </div>
            )}
            {order.shippingCost && order.shippingCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Verzendkosten</span>
                <span className="text-gray-900 font-medium">€{order.shippingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">BTW (21%)</span>
              <span className="text-gray-900 font-medium">€{order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Totaal</span>
                <span className="text-xl font-bold text-gray-900">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Opmerkingen</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  )
}

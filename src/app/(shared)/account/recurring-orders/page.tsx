import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, Calendar, Package, Play, Pause, Trash2, Edit } from 'lucide-react'
import type { RecurringOrder, Product, Media } from '@/payload-types'

export const metadata = {
  title: 'Terugkerende Bestellingen | Account',
  description: 'Beheer je terugkerende bestellingen en abonnementen',
}

export default async function RecurringOrdersPage() {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/recurring-orders')
  }

  // Fetch user's recurring orders
  const recurringOrders = await payload.find({
    collection: 'recurring-orders',
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  // Group by status
  const activeOrders = recurringOrders.docs.filter(
    (order) => (order as RecurringOrder).status === 'active',
  )
  const pausedOrders = recurringOrders.docs.filter(
    (order) => (order as RecurringOrder).status === 'paused',
  )
  const cancelledOrders = recurringOrders.docs.filter(
    (order) => (order as RecurringOrder).status === 'cancelled',
  )

  // Get frequency label
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Wekelijks'
      case 'biweekly':
        return 'Om de 2 weken'
      case 'monthly':
        return 'Maandelijks'
      case 'quarterly':
        return 'Per kwartaal'
      default:
        return frequency
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terugkerende Bestellingen</h1>
            <p className="text-gray-600 mt-1">
              Beheer je abonnementen en automatische bestellingen
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Actief</p>
              <p className="text-2xl font-bold text-green-600">{activeOrders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active */}
        <div className="bg-white rounded-lg border border-green-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Actief</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activeOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Paused */}
        <div className="bg-white rounded-lg border border-amber-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 font-medium">Gepauzeerd</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{pausedOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Pause className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Geannuleerd</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{cancelledOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Orders List */}
      {recurringOrders.docs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <RefreshCw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Nog geen terugkerende bestellingen
          </h2>
          <p className="text-gray-600 mb-6">
            Maak het jezelf makkelijk door producten automatisch te laten leveren
          </p>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Ontdek producten
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recurringOrders.docs.map((order) => {
            const recOrder = order as RecurringOrder

            return (
              <div
                key={recOrder.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {recOrder.name || 'Terugkerende bestelling'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Gestart op{' '}
                          {new Date(recOrder.createdAt).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Products Preview */}
                    {recOrder.items && recOrder.items.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {recOrder.items.slice(0, 4).map((item, index) => {
                          const product =
                            typeof item.product === 'object' ? (item.product as Product) : null
                          const imageUrl =
                            product?.images && product.images.length > 0
                              ? typeof product.images[0].image === 'object' &&
                                (product.images[0].image as Media)?.url
                                ? (product.images[0].image as Media).url
                                : null
                              : null

                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={product?.title || 'Product'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product?.title || 'Product'}
                                </p>
                                <p className="text-xs text-gray-500">Aantal: {item.quantity}</p>
                              </div>
                            </div>
                          )
                        })}
                        {recOrder.items.length > 4 && (
                          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            +{recOrder.items.length - 4} meer product
                            {recOrder.items.length - 4 !== 1 ? 'en' : ''}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Order Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Frequency */}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Frequentie</p>
                        <p className="text-sm font-medium text-gray-900">
                          {getFrequencyLabel(recOrder.frequency)}
                        </p>
                      </div>

                      {/* Next Delivery */}
                      {recOrder.nextDeliveryDate && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Volgende levering</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(recOrder.nextDeliveryDate).toLocaleDateString('nl-NL', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      )}

                      {/* Total */}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Bedrag per levering</p>
                        <p className="text-sm font-semibold text-gray-900">
                          €{recOrder.totalAmount.toFixed(2)}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            recOrder.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : recOrder.status === 'paused'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {recOrder.status === 'active'
                            ? 'Actief'
                            : recOrder.status === 'paused'
                              ? 'Gepauzeerd'
                              : 'Geannuleerd'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {recOrder.status === 'active' && (
                      <>
                        <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium whitespace-nowrap">
                          <Edit className="w-3.5 h-3.5" />
                          Wijzig
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-xs font-medium whitespace-nowrap">
                          <Pause className="w-3.5 h-3.5" />
                          Pauzeer
                        </button>
                      </>
                    )}
                    {recOrder.status === 'paused' && (
                      <>
                        <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium whitespace-nowrap">
                          <Play className="w-3.5 h-3.5" />
                          Hervatten
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium whitespace-nowrap">
                          <Trash2 className="w-3.5 h-3.5" />
                          Annuleer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Card */}
      {activeOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Over Terugkerende Bestellingen</p>
              <p className="text-xs text-blue-700 mt-1">
                Je terugkerende bestellingen worden automatisch verwerkt volgens de ingestelde
                frequentie. Je ontvangt een bevestiging vóór elke levering. Je kunt op elk moment
                de levering pauzeren, wijzigen of annuleren.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

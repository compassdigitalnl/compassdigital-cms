import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  RotateCcw,
  Clock,
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  XCircle,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react'
import type { Return, Order, Product, Media } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Retourzending ${id} | Mijn Account`,
    description: 'Bekijk retour details en track je retourzending',
  }
}

export default async function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/returns/' + id)
  }

  // Fetch return
  let returnDoc: Return
  try {
    const doc = await payload.findByID({
      collection: 'returns',
      id,
      depth: 2,
    })
    returnDoc = doc as Return

    // Verify this return belongs to the user
    const returnUserId =
      typeof returnDoc.user === 'string' ? returnDoc.user : returnDoc.user?.id || null
    if (returnUserId !== user.id) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  // Get order if available
  const order = typeof returnDoc.order === 'object' ? (returnDoc.order as Order) : null

  // Timeline items based on return status
  const timelineItems = [
    {
      status: 'pending',
      label: 'Aanvraag ingediend',
      date: returnDoc.createdAt,
      icon: Clock,
      completed: true,
      description: 'Je retourzending is aangevraagd',
    },
    {
      status: 'approved',
      label: 'Goedgekeurd',
      date: returnDoc.approvedDate || null,
      icon: CheckCircle,
      completed: ['approved', 'received', 'processed', 'refunded'].includes(returnDoc.status),
      description: returnDoc.returnLabel
        ? 'Retourlabel is beschikbaar voor download'
        : 'Je retourzending is goedgekeurd',
    },
    {
      status: 'received',
      label: 'Ontvangen',
      date: returnDoc.receivedDate || null,
      icon: Package,
      completed: ['received', 'processed', 'refunded'].includes(returnDoc.status),
      description: 'We hebben je retourzending ontvangen en controleren deze',
    },
    {
      status: 'processed',
      label: 'Verwerkt',
      date: returnDoc.processedDate || null,
      icon: RotateCcw,
      completed: ['processed', 'refunded'].includes(returnDoc.status),
      description: 'Je retourzending is goedgekeurd en verwerkt',
    },
    {
      status: 'refunded',
      label: 'Terugbetaald',
      date: returnDoc.refundedDate || null,
      icon: CreditCard,
      completed: returnDoc.status === 'refunded',
      description: `Terugbetaling van €${returnDoc.refundAmount.toFixed(2)} is verstuurd`,
    },
  ]

  // If rejected, show that instead
  if (returnDoc.status === 'rejected') {
    timelineItems.push({
      status: 'rejected',
      label: 'Afgewezen',
      date: returnDoc.rejectedDate || returnDoc.updatedAt,
      icon: XCircle,
      completed: true,
      description: returnDoc.rejectionReason || 'Je retourzending is afgewezen',
    })
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/account/returns/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar retourzendingen
      </Link>

      {/* Return Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RMA #{returnDoc.rmaNumber}</h1>
            <p className="text-gray-600 mt-1">
              Aangevraagd op{' '}
              {new Date(returnDoc.createdAt).toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {order && (
              <Link
                href={`/account/orders/${order.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
              >
                Van order #{String(order.orderNumber).padStart(5, '0')} →
              </Link>
            )}
          </div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              returnDoc.status === 'refunded'
                ? 'bg-green-100 text-green-800'
                : returnDoc.status === 'processed'
                  ? 'bg-green-100 text-green-800'
                  : returnDoc.status === 'received'
                    ? 'bg-purple-100 text-purple-800'
                    : returnDoc.status === 'approved'
                      ? 'bg-blue-100 text-blue-800'
                      : returnDoc.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
            }`}
          >
            {returnDoc.status === 'refunded'
              ? 'Terugbetaald'
              : returnDoc.status === 'processed'
                ? 'Verwerkt'
                : returnDoc.status === 'received'
                  ? 'Ontvangen'
                  : returnDoc.status === 'approved'
                    ? 'Goedgekeurd'
                    : returnDoc.status === 'rejected'
                      ? 'Afgewezen'
                      : 'In afwachting'}
          </span>
        </div>
      </div>

      {/* Return Timeline */}
      {returnDoc.status !== 'rejected' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Retour Status</h2>

          <div className="space-y-6">
            {timelineItems
              .filter((item) => item.status !== 'rejected')
              .map((item, index, arr) => {
                const Icon = item.icon
                const isLast = index === arr.length - 1

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

      {/* Rejected Notice */}
      {returnDoc.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900">Retourzending afgewezen</p>
              <p className="text-xs text-red-700 mt-1">
                {returnDoc.rejectionReason || 'Deze retourzending is afgewezen'}
              </p>
              {returnDoc.rejectedDate && (
                <p className="text-xs text-red-600 mt-2">
                  Afgewezen op{' '}
                  {new Date(returnDoc.rejectedDate).toLocaleDateString('nl-NL', {
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

      {/* Return Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Return Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Retour Informatie</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Reden</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {returnDoc.reason === 'defective'
                  ? 'Product defect'
                  : returnDoc.reason === 'wrong_item'
                    ? 'Verkeerd artikel ontvangen'
                    : returnDoc.reason === 'not_as_described'
                      ? 'Niet zoals beschreven'
                      : returnDoc.reason === 'damaged'
                        ? 'Beschadigd bij levering'
                        : returnDoc.reason === 'changed_mind'
                          ? 'Van gedachten veranderd'
                          : 'Overig'}
              </p>
            </div>
            {returnDoc.notes && (
              <div>
                <p className="text-sm text-gray-600">Toelichting</p>
                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                  {returnDoc.notes}
                </p>
              </div>
            )}
            {returnDoc.trackingNumber && (
              <div>
                <p className="text-sm text-gray-600">Track & Trace</p>
                <p className="text-sm font-mono text-gray-900 mt-0.5">{returnDoc.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Terugbetaling</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Retour bedrag</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                €{returnDoc.refundAmount.toFixed(2)}
              </p>
            </div>
            {returnDoc.refundMethod && (
              <div>
                <p className="text-sm text-gray-600">Terugbetaalmethode</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {returnDoc.refundMethod === 'original'
                    ? 'Originele betaalmethode'
                    : returnDoc.refundMethod === 'bank_transfer'
                      ? 'Bankoverschrijving'
                      : returnDoc.refundMethod === 'store_credit'
                        ? 'Winkelcredit'
                        : 'Overig'}
                </p>
              </div>
            )}
            {returnDoc.refundedDate && (
              <div>
                <p className="text-sm text-gray-600">Terugbetaald op</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {new Date(returnDoc.refundedDate).toLocaleDateString('nl-NL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Label Download */}
      {returnDoc.returnLabel && returnDoc.status === 'approved' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Retourlabel beschikbaar</p>
                <p className="text-xs text-blue-700 mt-1">
                  Download je retourlabel en plak deze op het pakket. Breng het pakket naar een
                  PostNL punt of laat het ophalen.
                </p>
              </div>
            </div>
            <a
              href={returnDoc.returnLabel}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              Download label
            </a>
          </div>
        </div>
      )}

      {/* Return Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Geretourneerde Producten</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {returnDoc.items && returnDoc.items.length > 0 ? (
            returnDoc.items.map((item, index) => {
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
                    {item.reason && (
                      <p className="text-xs text-gray-600 mt-1">
                        Reden:{' '}
                        {item.reason === 'defective'
                          ? 'Defect'
                          : item.reason === 'wrong_item'
                            ? 'Verkeerd artikel'
                            : item.reason === 'damaged'
                              ? 'Beschadigd'
                              : 'Overig'}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      €{((item.refundAmount || 0) * item.quantity).toFixed(2)}
                    </p>
                    {item.refundAmount && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        €{item.refundAmount.toFixed(2)} / stuk
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              Geen geretourneerde producten gevonden
            </div>
          )}
        </div>

        {/* Return Total */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="max-w-md ml-auto">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Totaal terugbetaling</span>
              <span className="text-xl font-bold text-gray-900">
                €{returnDoc.refundAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      {returnDoc.adminNotes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Opmerkingen</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{returnDoc.adminNotes}</p>
        </div>
      )}
    </div>
  )
}

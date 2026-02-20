import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RotateCcw, Package, CheckCircle, Clock, XCircle, AlertCircle, Plus } from 'lucide-react'
import type { Return } from '@/payload-types'

export const metadata = {
  title: 'Mijn Retourzendingen | Account',
  description: 'Beheer je retourzendingen en RMA aanvragen',
}

export default async function ReturnsPage() {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/returns')
  }

  // Fetch user's returns
  const returns = await payload.find({
    collection: 'returns',
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  // Group returns by status
  const pendingReturns = returns.docs.filter((ret) => (ret as Return).status === 'pending')
  const approvedReturns = returns.docs.filter((ret) => (ret as Return).status === 'approved')
  const receivedReturns = returns.docs.filter((ret) => (ret as Return).status === 'received')
  const processedReturns = returns.docs.filter((ret) => (ret as Return).status === 'processed')
  const refundedReturns = returns.docs.filter((ret) => (ret as Return).status === 'refunded')
  const rejectedReturns = returns.docs.filter((ret) => (ret as Return).status === 'rejected')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mijn Retourzendingen</h1>
            <p className="text-gray-600 mt-1">Bekijk en beheer je retourzendingen en RMA aanvragen</p>
          </div>
          <Link
            href="/account/returns/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nieuwe retour
          </Link>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Pending */}
        <div className="bg-white rounded-lg border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs text-amber-700 font-medium">In afwachting</p>
          </div>
          <p className="text-xl font-bold text-amber-900">{pendingReturns.length}</p>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-blue-700 font-medium">Goedgekeurd</p>
          </div>
          <p className="text-xl font-bold text-blue-900">{approvedReturns.length}</p>
        </div>

        {/* Received */}
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-purple-700 font-medium">Ontvangen</p>
          </div>
          <p className="text-xl font-bold text-purple-900">{receivedReturns.length}</p>
        </div>

        {/* Processed */}
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-green-700 font-medium">Verwerkt</p>
          </div>
          <p className="text-xl font-bold text-green-900">{processedReturns.length}</p>
        </div>

        {/* Refunded */}
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-green-700 font-medium">Terugbetaald</p>
          </div>
          <p className="text-xl font-bold text-green-900">{refundedReturns.length}</p>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-xs text-red-700 font-medium">Afgewezen</p>
          </div>
          <p className="text-xl font-bold text-red-900">{rejectedReturns.length}</p>
        </div>
      </div>

      {/* Returns List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alle Retourzendingen</h2>
        </div>

        {returns.docs.length === 0 ? (
          <div className="p-12 text-center">
            <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Je hebt nog geen retourzendingen aangevraagd</p>
            <Link
              href="/account/returns/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nieuwe retour aanvragen
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {returns.docs.map((returnDoc) => {
              const ret = returnDoc as Return
              const order = typeof ret.order === 'object' ? ret.order : null

              return (
                <Link
                  key={ret.id}
                  href={`/account/returns/${ret.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Return Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-base font-semibold text-gray-900">
                          RMA #{ret.rmaNumber}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ret.status === 'refunded'
                              ? 'bg-green-100 text-green-800'
                              : ret.status === 'processed'
                                ? 'bg-green-100 text-green-800'
                                : ret.status === 'received'
                                  ? 'bg-purple-100 text-purple-800'
                                  : ret.status === 'approved'
                                    ? 'bg-blue-100 text-blue-800'
                                    : ret.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ret.status === 'refunded'
                            ? 'Terugbetaald'
                            : ret.status === 'processed'
                              ? 'Verwerkt'
                              : ret.status === 'received'
                                ? 'Ontvangen'
                                : ret.status === 'approved'
                                  ? 'Goedgekeurd'
                                  : ret.status === 'rejected'
                                    ? 'Afgewezen'
                                    : 'In afwachting'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>
                          Aangevraagd op{' '}
                          {new Date(ret.createdAt).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        {order && (
                          <>
                            <span>•</span>
                            <span>Order #{String(order.orderNumber).padStart(5, '0')}</span>
                          </>
                        )}
                      </div>

                      {/* Return Reason */}
                      {ret.reason && (
                        <div className="flex items-start gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Reden:</p>
                            <p className="text-sm text-gray-700">
                              {ret.reason === 'defective'
                                ? 'Product defect'
                                : ret.reason === 'wrong_item'
                                  ? 'Verkeerd artikel ontvangen'
                                  : ret.reason === 'not_as_described'
                                    ? 'Niet zoals beschreven'
                                    : ret.reason === 'damaged'
                                      ? 'Beschadigd bij levering'
                                      : ret.reason === 'changed_mind'
                                        ? 'Van gedachten veranderd'
                                        : 'Overig'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Return Items Preview */}
                      {ret.items && ret.items.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {ret.items.slice(0, 3).map((item, index) => (
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
                          {ret.items.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{ret.items.length - 3} meer
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Return Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-600 mb-1">Retour bedrag</p>
                      <p className="text-lg font-bold text-gray-900">
                        €{ret.refundAmount.toFixed(2)}
                      </p>
                      {ret.trackingNumber && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          Track: {ret.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">Retourbeleid</p>
            <p className="text-xs text-blue-700 mt-1">
              Je kunt producten binnen 14 dagen na ontvangst retourneren. Producten moeten
              ongebruikt en in originele verpakking zijn. Na goedkeuring ontvang je een
              retourlabel en instructies. De terugbetaling volgt binnen 5-7 werkdagen na ontvangst
              van je retourzending.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, Package } from 'lucide-react'
import type { Order } from '@/payload-types'

export const metadata = {
  title: 'Nieuwe Retour Aanvragen | Account',
  description: 'Vraag een retourzending aan',
}

export default async function CreateReturnPage() {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/returns/create')
  }

  // Fetch user's completed orders from last 14 days (eligible for return)
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const eligibleOrders = await payload.find({
    collection: 'orders',
    where: {
      and: [
        {
          user: {
            equals: user.id,
          },
        },
        {
          status: {
            in: ['completed', 'shipped'],
          },
        },
        {
          completedDate: {
            greater_than: fourteenDaysAgo.toISOString(),
          },
        },
      ],
    },
    depth: 2,
    limit: 50,
    sort: '-completedDate',
  })

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/account/returns"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar retourzendingen
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Nieuwe Retour Aanvragen</h1>
        <p className="text-gray-600 mt-1">
          Vul onderstaand formulier in om een retourzending aan te vragen
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">Retourvoorwaarden</p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>Je kunt producten binnen 14 dagen na ontvangst retourneren</li>
              <li>Producten moeten ongebruikt en in originele verpakking zijn</li>
              <li>Na goedkeuring ontvang je een retourlabel per email</li>
              <li>Terugbetaling volgt binnen 5-7 werkdagen na ontvangst</li>
              <li>Verzendkosten worden niet terugbetaald</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Return Form */}
      {eligibleOrders.docs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Geen bestellingen beschikbaar voor retour
          </h2>
          <p className="text-gray-600 mb-6">
            Je hebt momenteel geen bestellingen die in aanmerking komen voor retournering.
            Bestellingen kunnen binnen 14 dagen na levering worden geretourneerd.
          </p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Bekijk je bestellingen
          </Link>
        </div>
      ) : (
        <form action="/api/returns/create" method="POST" className="space-y-6">
          {/* Step 1: Select Order */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Stap 1: Selecteer je bestelling
            </h2>

            <div className="space-y-3">
              {eligibleOrders.docs.map((orderDoc) => {
                const order = orderDoc as Order

                return (
                  <label
                    key={order.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="orderId"
                      value={order.id}
                      required
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          Order #{String(order.orderNumber).padStart(5, '0')}
                        </p>
                        <p className="text-sm text-gray-600">€{order.total.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Geleverd op{' '}
                        {order.completedDate
                          ? new Date(order.completedDate).toLocaleDateString('nl-NL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Onbekend'}
                      </p>
                      {order.items && order.items.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                            >
                              {typeof item.product === 'object' && item.product?.title
                                ? item.product.title
                                : 'Product'}{' '}
                              ×{item.quantity}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-xs text-gray-500 py-1">
                              +{order.items.length - 3} meer
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Step 2: Select Return Reason */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Stap 2: Reden voor retour
            </h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value="defective"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Product defect</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Het product werkt niet goed of heeft een fabricagefout
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value="wrong_item"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Verkeerd artikel ontvangen</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ik heb een ander product ontvangen dan besteld
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value="not_as_described"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Niet zoals beschreven</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Het product komt niet overeen met de beschrijving
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value="damaged"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Beschadigd bij levering</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Het product was beschadigd toen ik het ontving
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value="changed_mind"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Van gedachten veranderd</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ik wil het product niet meer of het voldoet niet aan mijn verwachtingen
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value="other"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Overig</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Een andere reden (licht toe in opmerkingen)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Additional Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Stap 3: Aanvullende informatie
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                  Toelichting <span className="text-gray-500">(optioneel)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Geef een gedetailleerde beschrijving van het probleem of je reden voor retour..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hoe meer informatie je geeft, hoe sneller we je retourzending kunnen verwerken
                </p>
              </div>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    required
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Ik ga akkoord met de{' '}
                    <Link href="/retourvoorwaarden" className="text-blue-600 hover:text-blue-700">
                      retourvoorwaarden
                    </Link>{' '}
                    en bevestig dat het product ongebruikt en in originele verpakking is
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/account/returns"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Retour aanvragen
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

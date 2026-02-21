'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle,
  Copy,
  Route,
  Truck,
  Check,
  Loader,
  Package,
  Home,
  MapPin,
  Receipt,
  Tag,
  CreditCard,
  Printer,
  FileText,
  ShoppingBag,
  Mail,
  UserPlus,
  Headphones,
  Phone,
} from 'lucide-react'

interface OrderConfirmationProps {
  orderId: string
}

// Mock order data (later: fetch from API/database)
const getMockOrderData = (orderId: string) => ({
  id: orderId,
  orderNumber: `#PM-2026-${orderId.slice(0, 4)}`,
  email: 'j.devries@huisartsdevries.nl',
  status: 'in_treatment',
  createdAt: 'Vandaag, 14:23',
  expectedDelivery: 'donderdag 20 februari',
  deliveryMethod: 'Standaard bezorging · Besteld voor 16:00, morgen geleverd',
  items: [
    {
      id: '1',
      emoji: '🧤',
      brand: 'Hartmann',
      name: 'Peha-soft Nitrile Fino — Maat M',
      sku: '942210',
      meta: 'Doos 150 st.',
      quantity: 5,
      pricePerUnit: 8.25,
      totalPrice: 41.25,
    },
    {
      id: '2',
      emoji: '🧴',
      brand: 'Hartmann',
      name: 'Baktolan Protect+ Pure Handcrème 100ml',
      sku: '232451',
      meta: null,
      quantity: 2,
      pricePerUnit: 5.95,
      totalPrice: 11.9,
    },
    {
      id: '3',
      emoji: '💉',
      brand: 'BD',
      name: 'Discardit II Injectiespuit 10ml',
      sku: '309110',
      meta: 'Doos 100 st.',
      quantity: 2,
      pricePerUnit: 4.25,
      totalPrice: 8.5,
    },
  ],
  shippingAddress: {
    company: 'Huisartsenpraktijk De Vries',
    attention: 'Jan de Vries',
    street: 'Breestraat 42',
    postalCode: '1941 EK',
    city: 'Beverwijk',
  },
  billingAddress: {
    company: 'Huisartsenpraktijk De Vries',
    street: 'Breestraat 42',
    postalCode: '1941 EK',
    city: 'Beverwijk',
    kvk: '12345678',
  },
  summary: {
    subtotal: 61.65,
    discount: 3.1,
    shipping: 7.5,
    vat: 13.87,
    total: 79.92,
  },
  paymentMethod: 'iDEAL — ING',
})

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const order = getMockOrderData(orderId)
  const [copied, setCopied] = useState(false)

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Success Hero */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Bedankt voor uw bestelling!
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4">
          Uw bestelling is succesvol ontvangen en wordt zo snel mogelijk verwerkt. U ontvangt een
          bevestiging per e-mail op <strong>{order.email}</strong>
        </p>
        <button
          onClick={copyOrderNumber}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl font-mono font-semibold text-gray-900 hover:border-teal-500 transition-colors"
        >
          {order.orderNumber}
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-teal-600 cursor-pointer" />
          )}
        </button>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 mb-4">
              <Route className="w-5 h-5 text-teal-600" />
              Status & verwachte levering
            </h2>

            {/* Delivery Card */}
            <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  Verwachte levering: {order.expectedDelivery}
                </div>
                <div className="text-xs text-gray-600">{order.deliveryMethod}</div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="relative pl-7">
              {/* Vertical line */}
              <div className="absolute left-2.5 top-1 bottom-1 w-0.5 bg-gray-200" />

              {/* Step 1: Ontvangen (done) */}
              <div className="relative pb-6">
                <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-green-600 border-2 border-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="text-sm font-bold text-gray-900">Bestelling ontvangen</div>
                <div className="text-xs text-teal-600 font-semibold">{order.createdAt}</div>
              </div>

              {/* Step 2: In behandeling (active) */}
              <div className="relative pb-6">
                <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center shadow-lg shadow-teal-200">
                  <Loader className="w-2.5 h-2.5 text-white animate-spin" />
                </div>
                <div className="text-sm font-bold text-gray-900">In behandeling</div>
                <div className="text-xs text-gray-500">
                  Uw bestelling wordt klaargezet in ons magazijn
                </div>
              </div>

              {/* Step 3: Verzonden (upcoming) */}
              <div className="relative pb-6">
                <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                  <Package className="w-2.5 h-2.5 text-gray-400" />
                </div>
                <div className="text-sm font-bold text-gray-400">Verzonden</div>
                <div className="text-xs text-gray-400">Track & trace beschikbaar per e-mail</div>
              </div>

              {/* Step 4: Afgeleverd (upcoming) */}
              <div className="relative">
                <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                  <Home className="w-2.5 h-2.5 text-gray-400" />
                </div>
                <div className="text-sm font-bold text-gray-400">Afgeleverd</div>
                <div className="text-xs text-gray-400">Verwacht: {order.expectedDelivery}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 mb-4">
              <Package className="w-5 h-5 text-teal-600" />
              Bestelde producten
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      {item.brand}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      Art. {item.sku}
                      {item.meta && ` · ${item.meta}`}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-extrabold text-gray-900">
                      €{item.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.quantity}× €{item.pricePerUnit.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              Adresgegevens
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-2">
                  Afleveradres
                </div>
                <div className="text-sm text-gray-900 space-y-0.5">
                  <div className="font-bold">{order.shippingAddress.company}</div>
                  <div>T.a.v. {order.shippingAddress.attention}</div>
                  <div>{order.shippingAddress.street}</div>
                  <div>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-2">
                  Factuuradres
                </div>
                <div className="text-sm text-gray-900 space-y-0.5">
                  <div className="font-bold">{order.billingAddress.company}</div>
                  <div>{order.billingAddress.street}</div>
                  <div>
                    {order.billingAddress.postalCode} {order.billingAddress.city}
                  </div>
                  <div>KVK {order.billingAddress.kvk}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print bevestiging
            </button>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Download PDF
            </Link>
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Verder winkelen
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 print:hidden">
            <Mail className="w-3.5 h-3.5" />
            Een kopie van deze bevestiging is verstuurd naar {order.email}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 mb-4">
              <Receipt className="w-5 h-5 text-teal-600" />
              Overzicht
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotaal ({order.items.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                  artikelen)
                </span>
                <span>€{order.summary.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-green-600 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Staffelkorting
                </span>
                <span>− €{order.summary.discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Verzending (standaard)</span>
                <span>€{order.summary.shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>BTW (21%)</span>
                <span>€{order.summary.vat.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-3 mt-2 border-t-2 border-gray-900">
                <span>Totaal</span>
                <span>€{order.summary.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-3.5 flex items-center gap-2 bg-gray-50 rounded-lg px-3.5 py-2.5 text-xs text-gray-600">
              <CreditCard className="w-4 h-4 text-teal-600 flex-shrink-0" />
              Betaald via <strong className="ml-1">{order.paymentMethod}</strong>
            </div>
          </div>

          {/* Account CTA */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-7 text-center relative overflow-hidden print:hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
            <h3 className="text-lg font-extrabold text-white mb-1.5 relative">
              Account aanmaken?
            </h3>
            <p className="text-xs text-gray-400 mb-4 relative leading-relaxed">
              Volg uw bestelling, bestel sneller opnieuw en beheer uw bestellijsten vanuit uw
              eigen dashboard.
            </p>
            <Link
              href="/register/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-500 transition-all relative"
            >
              <UserPlus className="w-4 h-4" />
              Account aanmaken
            </Link>
          </div>

          {/* Help Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center print:hidden">
            <h3 className="flex items-center justify-center gap-2 text-lg font-extrabold text-gray-900 mb-3">
              <Headphones className="w-5 h-5 text-teal-600" />
              Hulp nodig?
            </h3>
            <p className="text-sm text-gray-600 mb-3.5">
              Heeft u vragen over uw bestelling? Wij helpen u graag.
            </p>
            <div className="space-y-2">
              <a
                href="tel:0251247233"
                className="flex items-center justify-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700"
              >
                <Phone className="w-3.5 h-3.5" />
                +31 20 123 4567
              </a>
              <a
                href="mailto:info@example.com"
                className="flex items-center justify-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <Mail className="w-3.5 h-3.5" />
                info@example.com
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

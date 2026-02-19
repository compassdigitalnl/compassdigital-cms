'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  User,
  Building2,
  MapPin,
  Package,
  Zap,
  Receipt,
  Lock,
  ShieldCheck,
  Check,
  ChevronDown,
} from 'lucide-react'

export default function CheckoutPage() {
  const { items, total, clearCart, itemCount } = useCart()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [isB2B, setIsB2B] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('ideal')

  const [formData, setFormData] = useState({
    // Contact
    email: '',
    phone: '',

    // B2B
    companyName: '',
    kvkNumber: '',
    vatNumber: '',
    department: '',
    poNumber: '',

    // Shipping
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    addition: '',
    postalCode: '',
    city: '',
    country: 'Nederland',

    // Payment
    idealBank: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          title: item.title,
          sku: item.sku,
          ean: item.ean,
          quantity: item.quantity,
          price: item.unitPrice ?? item.price,
          subtotal: (item.unitPrice ?? item.price) * item.quantity,
        })),
        customer: {
          email: formData.email,
          phone: formData.phone,
        },
        isB2B,
        ...(isB2B && {
          company: {
            name: formData.companyName,
            kvkNumber: formData.kvkNumber,
            vatNumber: formData.vatNumber,
            department: formData.department,
            poNumber: formData.poNumber,
          },
        }),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          houseNumber: formData.houseNumber,
          addition: formData.addition,
          postalCode: formData.postalCode,
          city: formData.city,
          country: formData.country,
        },
        deliveryMethod,
        paymentMethod,
        ...(paymentMethod === 'ideal' && { idealBank: formData.idealBank }),
        notes: formData.notes,
        subtotal: total,
        shippingCost: getShippingCost(),
        tax: total * 0.21,
        total: total + getShippingCost() + total * 0.21,
      }

      console.log('✅ Order data prepared:', orderData)

      // TODO: Send to API endpoint POST /api/orders/create
      // const response = await fetch('/api/orders/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData),
      // })
      // const { order, paymentUrl } = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Clear cart
      clearCart()

      // Redirect to success page
      router.push('/checkout/success')
    } catch (error) {
      console.error('❌ Order error:', error)
      alert('Er is een fout opgetreden bij het plaatsen van uw bestelling. Probeer het opnieuw.')
    } finally {
      setProcessing(false)
    }
  }

  // Empty cart redirect
  if (items.length === 0 && !processing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F7FA' }}>
        <div className="text-center max-w-md mx-auto p-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: '#E8ECF1' }}
          >
            <ShoppingCart className="w-10 h-10" style={{ color: '#94A3B8' }} />
          </div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0A1628' }}
          >
            Je winkelwagen is leeg
          </h1>
          <p className="mb-6" style={{ fontSize: '15px', color: '#94A3B8' }}>
            Voeg producten toe voordat je gaat afrekenen.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-white rounded-xl font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #00897B, #26A69A)',
              boxShadow: '0 4px 20px rgba(0,137,123,0.3)',
              fontSize: '15px',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Ga naar shop
          </Link>
        </div>
      </div>
    )
  }

  const getShippingCost = () => {
    if (deliveryMethod === 'pickup') return 0
    if (deliveryMethod === 'express') return 14.95
    if (total >= 150) return 0
    return 7.5
  }

  const shipping = getShippingCost()
  const tax = total * 0.21
  const grandTotal = total + shipping + tax

  return (
    <div className="min-h-screen" style={{ background: '#F5F7FA' }}>
      {/* Simplified Header */}
      <header className="bg-white" style={{ borderBottom: '1px solid #E8ECF1' }}>
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 transition-colors"
            style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar winkelwagen
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #00897B, #26A69A)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(0,137,123,0.3)',
              }}
            >
              P
            </div>
            <div
              className="font-extrabold"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '20px', color: '#0A1628' }}
            >
              plasti<span style={{ color: '#00897B' }}>med</span>
            </div>
          </Link>

          <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#94A3B8' }}>
            <ShieldCheck className="w-4 h-4" style={{ color: '#00C853' }} />
            Beveiligde checkout
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white" style={{ borderBottom: '1px solid #E8ECF1', padding: '20px 0' }}>
        <div className="max-w-[600px] mx-auto flex items-center justify-center">
          {/* Step 1: Cart (Done) */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#00C853', color: 'white' }}
            >
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold hidden sm:inline" style={{ fontSize: '13px', color: '#00C853' }}>
              Winkelwagen
            </span>
          </div>

          <div
            className="w-15 h-0.5 mx-3"
            style={{ background: '#00C853' }}
          />

          {/* Step 2: Checkout (Active) */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              style={{
                background: '#00897B',
                color: 'white',
                fontSize: '13px',
              }}
            >
              2
            </div>
            <span className="font-semibold hidden sm:inline" style={{ fontSize: '13px', color: '#0A1628' }}>
              Gegevens & betaling
            </span>
          </div>

          <div
            className="w-15 h-0.5 mx-3"
            style={{ background: '#E8ECF1' }}
          />

          {/* Step 3: Confirmation */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              style={{
                border: '2px solid #E8ECF1',
                color: '#94A3B8',
                fontSize: '13px',
              }}
            >
              3
            </div>
            <span className="font-semibold hidden sm:inline" style={{ fontSize: '13px', color: '#94A3B8' }}>
              Bevestiging
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="max-w-[1240px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Left: Forms */}
          <div className="space-y-5">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid #E8ECF1' }}>
              <h2
                className="flex items-center gap-2.5 font-extrabold mb-5"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  color: '#0A1628',
                }}
              >
                <User className="w-5 h-5" style={{ color: '#00897B' }} />
                Contactgegevens
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    E-mailadres <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none transition-all"
                    style={{
                      border: '1.5px solid #E8ECF1',
                      fontSize: '14px',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                    placeholder="naam@bedrijf.nl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Telefoonnummer <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none transition-all"
                    style={{
                      border: '1.5px solid #E8ECF1',
                      fontSize: '14px',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                    placeholder="06-12345678"
                  />
                </div>
              </div>
            </div>

            {/* B2B Toggle + Fields */}
            <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid #E8ECF1' }}>
              <h2
                className="flex items-center gap-2.5 font-extrabold mb-5"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  color: '#0A1628',
                }}
              >
                <Building2 className="w-5 h-5" style={{ color: '#00897B' }} />
                Bedrijfsgegevens
                <span
                  className="ml-auto font-normal"
                  style={{
                    fontSize: '12px',
                    color: '#94A3B8',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  — optioneel
                </span>
              </h2>

              {/* B2B Toggle */}
              <div
                className="flex items-center gap-3 p-3.5 rounded-xl mb-4 cursor-pointer"
                style={{ background: '#F5F7FA' }}
                onClick={() => setIsB2B(!isB2B)}
              >
                <div
                  className="w-11 h-6 rounded-full relative transition-all"
                  style={{ background: isB2B ? '#00897B' : '#E8ECF1' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm"
                    style={{ left: isB2B ? '22px' : '2px' }}
                  />
                </div>
                <div>
                  <div className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
                    Zakelijke bestelling
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Bestellen op bedrijfsnaam met BTW-factuur
                  </div>
                </div>
              </div>

              {/* B2B Fields */}
              {isB2B && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                      Bedrijfsnaam <span style={{ color: '#FF6B6B' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required={isB2B}
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                      KVK-nummer
                    </label>
                    <input
                      type="text"
                      value={formData.kvkNumber}
                      onChange={(e) => setFormData({ ...formData, kvkNumber: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                      BTW-nummer
                    </label>
                    <input
                      type="text"
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                      placeholder="NL123456789B01"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                      Afdeling
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                      placeholder="Bijv. Receptie, Inkoop"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                      Referentienummer / PO-nummer
                    </label>
                    <input
                      type="text"
                      value={formData.poNumber}
                      onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                      placeholder="Uw interne referentie voor op de factuur"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid #E8ECF1' }}>
              <h2
                className="flex items-center gap-2.5 font-extrabold mb-5"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  color: '#0A1628',
                }}
              >
                <MapPin className="w-5 h-5" style={{ color: '#00897B' }} />
                Afleveradres
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Voornaam <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Achternaam <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Straat + huisnummer <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    placeholder="Breestraat 42"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Toevoeging
                  </label>
                  <input
                    type="text"
                    value={formData.addition}
                    onChange={(e) => setFormData({ ...formData, addition: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    placeholder="Bijv. A, 2e etage"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Postcode <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    placeholder="1234 AB"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Plaats <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Land
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none appearance-none cursor-pointer"
                    style={{
                      border: '1.5px solid #E8ECF1',
                      fontSize: '14px',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: '40px',
                    }}
                  >
                    <option>Nederland</option>
                    <option>België</option>
                    <option>Duitsland</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid #E8ECF1' }}>
              <h2
                className="flex items-center gap-2.5 font-extrabold mb-5"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  color: '#0A1628',
                }}
              >
                <Truck className="w-5 h-5" style={{ color: '#00897B' }} />
                Bezorgmethode
              </h2>
              <div className="space-y-2.5">
                {[
                  {
                    id: 'standard',
                    icon: Truck,
                    title: 'Standaard bezorging',
                    desc: 'Morgen geleverd · besteld voor 16:00',
                    price: total >= 150 ? 0 : 7.5,
                  },
                  {
                    id: 'express',
                    icon: Zap,
                    title: 'Express bezorging',
                    desc: 'Vandaag nog geleverd · besteld voor 12:00',
                    price: 14.95,
                  },
                  {
                    id: 'pickup',
                    icon: Package,
                    title: 'Ophalen in Beverwijk',
                    desc: 'Binnen 2 uur klaar · Parallelweg 124',
                    price: 0,
                  },
                ].map((option) => {
                  const Icon = option.icon
                  const selected = deliveryMethod === option.id
                  return (
                    <div
                      key={option.id}
                      onClick={() => setDeliveryMethod(option.id)}
                      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: `1.5px solid ${selected ? '#00897B' : '#E8ECF1'}`,
                        background: selected ? 'rgba(0,137,123,0.05)' : 'white',
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          border: `2px solid ${selected ? '#00897B' : '#E8ECF1'}`,
                        }}
                      >
                        {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00897B' }} />}
                      </div>
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: '#F5F7FA' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: '#00897B' }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold" style={{ fontSize: '15px', color: '#0A1628' }}>
                          {option.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94A3B8' }}>{option.desc}</div>
                      </div>
                      <div
                        className="font-extrabold"
                        style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: '16px',
                          color: option.price === 0 ? '#00C853' : '#0A1628',
                        }}
                      >
                        {option.price === 0 ? 'Gratis' : `€${option.price.toFixed(2)}`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid #E8ECF1' }}>
              <h2
                className="flex items-center gap-2.5 font-extrabold mb-5"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  color: '#0A1628',
                }}
              >
                <CreditCard className="w-5 h-5" style={{ color: '#00897B' }} />
                Betaalmethode
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {[
                  { id: 'ideal', icon: '🏦', title: 'iDEAL', desc: 'Direct betalen via uw bank' },
                  { id: 'invoice', icon: '📄', title: 'Op rekening', desc: 'Betaal binnen 30 dagen' },
                  { id: 'creditcard', icon: '💳', title: 'Creditcard', desc: 'Visa, Mastercard, AMEX' },
                  { id: 'sepa', icon: '🔄', title: 'SEPA Incasso', desc: 'Automatische incasso' },
                ].map((option) => {
                  const selected = paymentMethod === option.id
                  return (
                    <div
                      key={option.id}
                      onClick={() => setPaymentMethod(option.id)}
                      className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: `1.5px solid ${selected ? '#00897B' : '#E8ECF1'}`,
                        background: selected ? 'rgba(0,137,123,0.05)' : 'white',
                      }}
                    >
                      <div
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center"
                        style={{ border: `2px solid ${selected ? '#00897B' : '#E8ECF1'}` }}
                      >
                        {selected && <div className="w-2 h-2 rounded-full" style={{ background: '#00897B' }} />}
                      </div>
                      <div className="text-xl">{option.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
                          {option.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>{option.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* iDEAL Bank Selection */}
              {paymentMethod === 'ideal' && (
                <div className="mt-4">
                  <label className="block font-semibold mb-1.5" style={{ fontSize: '13px', color: '#0A1628' }}>
                    Selecteer uw bank
                  </label>
                  <select
                    value={formData.idealBank}
                    onChange={(e) => setFormData({ ...formData, idealBank: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl outline-none appearance-none cursor-pointer"
                    style={{
                      border: '1.5px solid #E8ECF1',
                      fontSize: '14px',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: '40px',
                    }}
                  >
                    <option value="">Kies uw bank…</option>
                    <option>ABN AMRO</option>
                    <option>ASN Bank</option>
                    <option>Bunq</option>
                    <option>ING</option>
                    <option>Knab</option>
                    <option>Rabobank</option>
                    <option>RegioBank</option>
                    <option>SNS</option>
                    <option>Triodos Bank</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:sticky lg:top-5">
            <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid #E8ECF1' }}>
              <h2
                className="flex items-center gap-2 font-extrabold mb-5"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  color: '#0A1628',
                }}
              >
                <Receipt className="w-5 h-5" style={{ color: '#00897B' }} />
                Overzicht bestelling
              </h2>

              {/* Items Summary */}
              <div className="space-y-3 mb-4" style={{ paddingBottom: '16px', borderBottom: '1px solid #E8ECF1' }}>
                {items.map((item) => {
                  const unitPrice = item.unitPrice ?? item.price
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: '#F5F7FA' }}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-semibold line-clamp-2"
                          style={{ fontSize: '13px', color: '#0A1628', lineHeight: 1.3 }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                          Aantal: {item.quantity}x
                        </div>
                      </div>
                      <div
                        className="font-extrabold flex-shrink-0"
                        style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: '14px',
                          color: '#0A1628',
                        }}
                      >
                        €{(unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between" style={{ fontSize: '14px' }}>
                  <span style={{ color: '#64748B' }}>Subtotaal</span>
                  <span className="font-semibold" style={{ color: '#0A1628' }}>
                    €{total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '14px' }}>
                  <span style={{ color: '#64748B' }}>Verzending</span>
                  <span
                    className="font-semibold"
                    style={{ color: shipping === 0 ? '#00C853' : '#0A1628' }}
                  >
                    {shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid #E8ECF1', margin: '8px 0' }} />
                <div className="flex justify-between" style={{ fontSize: '14px' }}>
                  <span style={{ color: '#64748B' }}>Subtotaal excl. BTW</span>
                  <span className="font-semibold" style={{ color: '#0A1628' }}>
                    €{total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '14px' }}>
                  <span style={{ color: '#64748B' }}>BTW (21%)</span>
                  <span className="font-semibold" style={{ color: '#0A1628' }}>
                    €{tax.toFixed(2)}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid #E8ECF1', margin: '8px 0' }} />
                <div className="flex justify-between items-baseline py-2">
                  <span className="font-bold" style={{ fontSize: '16px', color: '#0A1628' }}>
                    Totaal
                  </span>
                  <span
                    className="font-extrabold"
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '24px',
                      color: '#0A1628',
                    }}
                  >
                    €{grandTotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-right" style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Incl. BTW · excl. BTW: €{total.toFixed(2)}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #00897B, #26A69A)',
                  color: 'white',
                  fontSize: '16px',
                  boxShadow: '0 4px 20px rgba(0,137,123,0.4)',
                }}
              >
                <Lock className="w-5 h-5" />
                {processing ? 'Verwerken...' : 'Bestelling plaatsen'}
              </button>

              {/* Agreement Text */}
              <div className="text-center mt-3" style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
                Door op "Bestelling plaatsen" te klikken, ga je akkoord met onze{' '}
                <Link href="/terms" style={{ color: '#00897B', textDecoration: 'none' }}>
                  voorwaarden
                </Link>
              </div>

              {/* Trust Badges */}
              <div
                className="flex flex-wrap gap-3 mt-5 pt-4"
                style={{ borderTop: '1px solid #E8ECF1', fontSize: '12px', color: '#94A3B8' }}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#00897B' }} />
                  <span>Veilig betalen</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" style={{ color: '#00897B' }} />
                  <span>SSL versleuteld</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: '#00897B' }} />
                  <span>100% veilig</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </form>

      {/* Simplified Footer */}
      <footer className="bg-white text-center py-5" style={{ borderTop: '1px solid #E8ECF1' }}>
        <div style={{ fontSize: '13px', color: '#94A3B8' }}>
          © 2026 Plastimed B.V. —{' '}
          <Link href="/privacy" style={{ color: '#00897B', textDecoration: 'none' }}>
            Privacy
          </Link>{' '}
          ·{' '}
          <Link href="/terms" style={{ color: '#00897B', textDecoration: 'none' }}>
            Voorwaarden
          </Link>
        </div>
      </footer>
    </div>
  )
}

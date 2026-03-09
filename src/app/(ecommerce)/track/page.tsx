'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Package, Truck, MapPin, ExternalLink, ArrowLeft, AlertCircle, CheckCircle, Clock, Loader2, ShieldOff } from 'lucide-react'
import { useEcommerceSettings } from '@/branches/ecommerce/shared/hooks/useEcommerceSettings'

/**
 * Public Order Tracking Page — /track
 *
 * Mode 1: Search form (no params)
 * Mode 2: Tracking view (/track?order=ORD-...&email=jan@...)
 *
 * No authentication required. Uses /api/track for data.
 */

interface TrackingData {
  orderNumber: string
  status: string
  statusLabel: string
  createdAt: string
  timeline: Array<{
    event: string
    title: string
    timestamp: string
    description?: string | null
    location?: string | null
  }>
  tracking: {
    code: string
    url: string | null
    carrier: string | null
    carrierName: string
  } | null
  expectedDeliveryDate: string | null
  shippingAddress: {
    city: string | null
    postalCode: string | null
  } | null
  items: Array<{
    title: string
    quantity: number
    sku: string | null
  }>
}

// Timeline step status icons
const eventIcons: Record<string, React.ReactNode> = {
  order_placed: <Package className="w-4 h-4" />,
  payment_received: <CheckCircle className="w-4 h-4" />,
  processing: <Clock className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  in_transit: <MapPin className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
  cancelled: <AlertCircle className="w-4 h-4" />,
  refunded: <ArrowLeft className="w-4 h-4" />,
}

export default function TrackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { settings, isLoaded } = useEcommerceSettings()

  const orderParam = searchParams.get('order') || ''
  const emailParam = searchParams.get('email') || ''

  const [orderNumber, setOrderNumber] = useState(orderParam)
  const [email, setEmail] = useState(emailParam)
  const [data, setData] = useState<TrackingData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-search if params are present
  useEffect(() => {
    if (orderParam && emailParam && isLoaded && settings.emailNotifications.enablePublicTracking) {
      fetchTracking(orderParam, emailParam)
    }
  }, [orderParam, emailParam, isLoaded, settings.emailNotifications.enablePublicTracking])

  // Feature disabled — show message
  if (isLoaded && !settings.emailNotifications.enablePublicTracking) {
    return (
      <div className="min-h-screen py-8 md:py-16 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center p-8" style={{ maxWidth: 480 }}>
          <ShieldOff className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--grey-mid)' }} />
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
            Order tracking niet beschikbaar
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--grey-mid)' }}>
            Publieke order tracking is niet ingeschakeld. Log in op je account om je bestellingen te bekijken.
          </p>
          <Link href="/inloggen/" className="btn btn-primary">
            Inloggen
          </Link>
        </div>
      </div>
    )
  }

  async function fetchTracking(order: string, mail: string) {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(`/api/track?order=${encodeURIComponent(order)}&email=${encodeURIComponent(mail)}`)
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Er is een fout opgetreden.')
        return
      }

      setData(json)
    } catch {
      setError('Kan geen verbinding maken. Probeer het later opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) return

    // Update URL params for shareability
    router.push(`/track?order=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`)
    fetchTracking(orderNumber.trim(), email.trim())
  }

  function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  }

  function formatDateShort(dateStr: string): string {
    return new Intl.DateTimeFormat('nl-NL', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(dateStr))
  }

  return (
    <div className="min-h-screen py-8 md:py-16" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 var(--sp-4)' }}>

        {/* Search Form */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-8"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--grey)',
            boxShadow: 'var(--sh-md)',
          }}
        >
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
          >
            Bestelling volgen
          </h1>
          <p className="mb-6 text-sm" style={{ color: 'var(--grey-mid)' }}>
            Voer je ordernummer en e-mailadres in om de status van je bestelling te bekijken.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--navy)' }}>
                Ordernummer
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORD-20260307-00123"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm transition-colors"
                style={{ borderColor: 'var(--grey)', background: 'var(--white)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--navy)' }}>
                E-mailadres
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm transition-colors"
                style={{ borderColor: 'var(--grey)', background: 'var(--white)' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Zoeken...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Bestelling zoeken
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-center" style={{ color: 'var(--grey-mid)' }}>
            Heb je een account?{' '}
            <Link href="/inloggen/" className="underline font-medium" style={{ color: 'var(--teal)' }}>
              Log in voor een volledig overzicht
            </Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl p-4 mb-8 flex items-center gap-3"
            style={{
              background: 'var(--error-light, #FEF2F2)',
              border: '1px solid var(--error, #EF4444)',
              color: 'var(--error, #EF4444)',
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Tracking Results */}
        {data && (
          <div className="space-y-6">
            {/* Order Header */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--grey)',
                boxShadow: 'var(--sh-sm)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                >
                  Bestelling {data.orderNumber}
                </h2>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: getStatusColor(data.status).bg,
                    color: getStatusColor(data.status).text,
                  }}
                >
                  {data.statusLabel}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--grey-mid)' }}>
                Geplaatst op {formatDate(data.createdAt)}
              </p>
            </div>

            {/* Timeline */}
            {data.timeline.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--grey)',
                  boxShadow: 'var(--sh-sm)',
                }}
              >
                <h3
                  className="text-base font-bold mb-4"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                >
                  Tijdlijn
                </h3>
                <div className="relative pl-8">
                  {/* Vertical line */}
                  <div
                    className="absolute left-[11px] top-1 bottom-1 w-0.5"
                    style={{ background: 'var(--grey)' }}
                  />

                  {data.timeline.map((evt, idx) => {
                    const isLast = idx === data.timeline.length - 1
                    return (
                      <div key={idx} className={`relative ${isLast ? '' : 'pb-6'}`}>
                        {/* Dot */}
                        <div
                          className="absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: isLast ? 'var(--teal)' : 'var(--green, #22c55e)',
                            color: 'white',
                          }}
                        >
                          {eventIcons[evt.event] || <Package className="w-3 h-3" />}
                        </div>
                        {/* Content */}
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
                            {evt.title}
                          </p>
                          {evt.description && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--grey-mid)' }}>
                              {evt.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium" style={{ color: 'var(--teal)' }}>
                              {formatDateShort(evt.timestamp)}
                            </span>
                            {evt.location && (
                              <span className="text-xs" style={{ color: 'var(--grey-mid)' }}>
                                {evt.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tracking Info */}
            {data.tracking && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--grey)',
                  boxShadow: 'var(--sh-sm)',
                }}
              >
                <h3
                  className="text-base font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                >
                  Verzending
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-5 h-5" style={{ color: 'var(--teal)' }} />
                  <div>
                    {data.tracking.carrierName && (
                      <p className="text-sm font-medium" style={{ color: 'var(--navy)' }}>
                        {data.tracking.carrierName}
                      </p>
                    )}
                    <p className="text-sm font-mono" style={{ color: 'var(--grey-dark)' }}>
                      {data.tracking.code}
                    </p>
                  </div>
                </div>

                {data.expectedDeliveryDate && (
                  <p className="text-sm mb-3" style={{ color: 'var(--grey-mid)' }}>
                    Verwachte levering:{' '}
                    <span className="font-medium" style={{ color: 'var(--navy)' }}>
                      {new Intl.DateTimeFormat('nl-NL', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      }).format(new Date(data.expectedDeliveryDate))}
                    </span>
                  </p>
                )}

                {data.tracking.url && (
                  <a
                    href={data.tracking.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm w-fit"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Volg bij {data.tracking.carrierName || 'vervoerder'}
                  </a>
                )}
              </div>
            )}

            {/* Shipping Address (limited) */}
            {data.shippingAddress && (data.shippingAddress.city || data.shippingAddress.postalCode) && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--grey)',
                  boxShadow: 'var(--sh-sm)',
                }}
              >
                <h3
                  className="text-base font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                >
                  Verzendgegevens
                </h3>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--grey-mid)' }} />
                  <p className="text-sm" style={{ color: 'var(--grey-dark)' }}>
                    {[data.shippingAddress.postalCode, data.shippingAddress.city].filter(Boolean).join(' ')}
                  </p>
                </div>
              </div>
            )}

            {/* Products (no prices) */}
            {data.items.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--grey)',
                  boxShadow: 'var(--sh-sm)',
                }}
              >
                <h3
                  className="text-base font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                >
                  Producten
                </h3>
                <div className="space-y-2">
                  {data.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2"
                      style={{ borderBottom: idx < data.items.length - 1 ? '1px solid var(--grey)' : 'none' }}
                    >
                      <span className="text-sm" style={{ color: 'var(--navy)' }}>
                        {item.title}
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--grey-mid)' }}>
                        {item.quantity}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to search */}
            <div className="text-center">
              <Link href="/track" className="btn btn-ghost btn-sm">
                <Search className="w-4 h-4" />
                Andere bestelling zoeken
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusColor(status: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#F5F7FA', text: '#6B7280' },
    paid: { bg: '#E0F2F1', text: '#00897B' },
    processing: { bg: '#FFF8E1', text: '#F57F17' },
    shipped: { bg: '#E3F2FD', text: '#1976D2' },
    delivered: { bg: '#E8F5E9', text: '#2E7D32' },
    cancelled: { bg: '#FEF2F2', text: '#DC2626' },
    refunded: { bg: '#F5F3FF', text: '#7C3AED' },
  }
  return colors[status] || colors.pending
}

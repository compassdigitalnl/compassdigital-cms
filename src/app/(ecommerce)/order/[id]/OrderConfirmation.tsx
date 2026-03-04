'use client'

import {
  OrderConfirmationTemplate1,
  type OrderConfirmationData,
  type SiteContactInfo,
} from '@/branches/ecommerce/templates/orders/OrderConfirmationTemplate1'
import type { TimelineStep } from '@/branches/ecommerce/components/orders/OrderTimeline'
import type { OrderItem } from '@/branches/ecommerce/components/orders/OrderItemsSummary'
import type { OrderAddress } from '@/branches/ecommerce/components/orders/OrderAddresses'
import type { NextStepAction } from '@/branches/ecommerce/components/orders/NextStepsCTA'

interface OrderConfirmationProps {
  order: any // Order from Payload (typed as any for flexibility)
}

/** Map order status to timeline steps */
function buildTimeline(order: any): TimelineStep[] {
  const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered']
  const currentIdx = statusOrder.indexOf(order.status)

  const steps: TimelineStep[] = [
    {
      id: '1',
      label: 'Bestelling ontvangen',
      status: currentIdx >= 0 ? 'done' : 'upcoming',
      timestamp: order.createdAt
        ? new Date(order.createdAt).toLocaleString('nl-NL', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })
        : undefined,
      icon: 'check',
    },
    {
      id: '2',
      label: 'In behandeling',
      status: currentIdx >= 2 ? 'done' : currentIdx >= 1 ? 'active' : 'upcoming',
      description: 'Uw bestelling wordt klaargezet in ons magazijn',
      icon: 'loader',
    },
    {
      id: '3',
      label: 'Verzonden',
      status: currentIdx >= 3 ? 'done' : currentIdx === 2 ? 'active' : 'upcoming',
      description: order.trackingCode
        ? `Track & trace: ${order.trackingCode}`
        : 'Track & trace beschikbaar per e-mail',
      icon: 'package',
    },
    {
      id: '4',
      label: 'Afgeleverd',
      status: currentIdx >= 4 ? 'done' : 'upcoming',
      description: order.expectedDeliveryDate
        ? `Verwacht: ${new Date(order.expectedDeliveryDate).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}`
        : undefined,
      icon: 'home',
    },
  ]

  return steps
}

/** Map order address group to OrderAddress type */
function mapAddress(addr: any, fallbackAddr?: any): OrderAddress {
  const a = addr || fallbackAddr || {}
  const name = [a.firstName, a.lastName].filter(Boolean).join(' ')
  return {
    company: a.company || undefined,
    name: name || undefined,
    attention: name || undefined,
    street: [a.street, a.houseNumber, a.addition].filter(Boolean).join(' '),
    postalCode: a.postalCode || '',
    city: a.city || '',
    country: a.country || undefined,
    kvk: a.kvk || undefined,
    vatNumber: a.vatNumber || undefined,
  }
}

/** Map order items to OrderItem type */
function mapItems(items: any[]): OrderItem[] {
  return (items || []).map((item: any, idx: number) => {
    const quantity = item.quantity || 1
    const price = item.price || 0

    const metadata: { label: string; icon?: string }[] = []

    if (item.sku) {
      metadata.push({ label: `Art. ${item.sku}`, icon: 'tag' })
    }
    if (quantity > 1) {
      metadata.push({ label: `${quantity}x €${price.toFixed(2)}` })
    }

    return {
      id: String(item.id || idx),
      name: item.title || 'Product',
      metadata,
      price: Math.round(price * quantity * 100), // Convert to cents
    }
  })
}

/** Build payment method display string */
function formatPaymentMethod(method?: string): string {
  const labels: Record<string, string> = {
    ideal: 'iDEAL',
    invoice: 'Op rekening',
    creditcard: 'Creditcard',
    banktransfer: 'Bankoverschrijving',
  }
  return labels[method || ''] || method || 'Onbekend'
}

/** Build delivery method display string */
function formatShippingMethod(method?: string): string {
  const labels: Record<string, string> = {
    standard: 'Standaard bezorging',
    express: 'Express bezorging',
    same_day: 'Same day delivery',
    pickup: 'Ophalen in magazijn',
  }
  return labels[method || ''] || method || ''
}

const siteContact: SiteContactInfo = {
  phone: '0251\u2011247233',
  email: 'info@plastimed.nl',
  registerUrl: '/auth/register/',
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const email = order.customerEmail || order.guestEmail || ''

  const actions: NextStepAction[] = [
    {
      id: 'print',
      label: 'Print bevestiging',
      icon: 'printer',
      variant: 'secondary',
      onClick: () => window.print(),
    },
    {
      id: 'shop',
      label: 'Verder winkelen',
      icon: 'shopping-bag',
      variant: 'primary',
      href: '/shop/',
    },
  ]

  const shippingAddr = mapAddress(order.shippingAddress)
  const billingAddr = order.billingAddress?.sameAsShipping
    ? shippingAddr
    : mapAddress(order.billingAddress, order.shippingAddress)

  const data: OrderConfirmationData = {
    orderNumber: order.orderNumber || `#${order.id}`,
    email,
    timelineSteps: buildTimeline(order),
    expectedDelivery: order.expectedDeliveryDate
      ? new Date(order.expectedDeliveryDate).toLocaleDateString('nl-NL', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      : undefined,
    deliveryMethod: formatShippingMethod(order.shippingMethod),
    items: mapItems(order.items),
    shippingAddress: shippingAddr,
    billingAddress: billingAddr,
    subtotal: order.subtotal || 0,
    discount: order.discount || undefined,
    shipping: order.shippingCost || 0,
    tax: order.tax || 0,
    total: order.total || 0,
    paymentMethod: formatPaymentMethod(order.paymentMethod),
    actions,
  }

  return (
    <OrderConfirmationTemplate1
      order={data}
      contact={siteContact}
    />
  )
}

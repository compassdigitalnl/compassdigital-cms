export interface TimelineStep {
  status: string
  label: string
  date: string | null
  completed: boolean
}

/**
 * Build a timeline from an order's status and timeline events.
 * Falls back to deriving steps from the order status if no timeline array exists.
 */
export function buildOrderTimeline(
  orderStatus: string,
  timelineEvents?: Array<{
    event: string
    title?: string | null
    timestamp: string
    description?: string | null
    location?: string | null
  }>,
): TimelineStep[] {
  // If we have real timeline events, map them
  if (timelineEvents && timelineEvents.length > 0) {
    return timelineEvents.map((evt) => ({
      status: evt.event,
      label: evt.title || eventLabel(evt.event),
      date: evt.timestamp,
      completed: true,
    }))
  }

  // Fallback: derive from order status
  const steps = [
    { status: 'order_placed', label: 'Bestelling geplaatst' },
    { status: 'payment_received', label: 'Betaling ontvangen' },
    { status: 'processing', label: 'In behandeling' },
    { status: 'shipped', label: 'Verzonden' },
    { status: 'delivered', label: 'Afgeleverd' },
  ]

  const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered']
  const currentIndex = statusOrder.indexOf(orderStatus)

  return steps.map((step, idx) => ({
    ...step,
    date: null,
    completed: idx <= currentIndex,
  }))
}

function eventLabel(event: string): string {
  const labels: Record<string, string> = {
    order_placed: 'Bestelling geplaatst',
    payment_received: 'Betaling ontvangen',
    processing: 'In behandeling',
    invoice_generated: 'Factuur gegenereerd',
    shipped: 'Verzonden',
    in_transit: 'In transit',
    delivered: 'Afgeleverd',
    cancelled: 'Geannuleerd',
    return_requested: 'Retour aangevraagd',
    refunded: 'Terugbetaald',
    note_added: 'Opmerking toegevoegd',
  }
  return labels[event] || event
}

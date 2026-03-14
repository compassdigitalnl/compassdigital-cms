/**
 * Toerisme Analytics — GA4 Event Tracking
 *
 * Tracks tourism-specific events for Google Analytics 4.
 */

type TourismEventType =
  | 'tour_view'
  | 'tour_search'
  | 'accommodation_view'
  | 'booking_start'
  | 'booking_complete'
  | 'destination_view'

interface TourismEventParams {
  tourId?: string | number
  tourName?: string
  accommodationId?: string | number
  accommodationName?: string
  destinationId?: string | number
  destinationName?: string
  continent?: string
  price?: number
  duration?: number
  travelers?: number
  searchQuery?: string
  [key: string]: unknown
}

/**
 * Track a tourism-specific GA4 event.
 *
 * @param eventType - The type of tourism event
 * @param params - Additional event parameters
 *
 * @example
 * trackTourismEvent('tour_view', { tourId: 123, tourName: 'Rondreis Bali', price: 1299 })
 * trackTourismEvent('booking_complete', { tourId: 123, travelers: 2, price: 2598 })
 */
export function trackTourismEvent(eventType: TourismEventType, params: TourismEventParams = {}): void {
  if (typeof window === 'undefined') return

  const gtag = (window as any).gtag
  if (typeof gtag !== 'function') return

  gtag('event', eventType, {
    event_category: 'toerisme',
    ...params,
  })
}

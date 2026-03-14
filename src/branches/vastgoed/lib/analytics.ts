/**
 * Vastgoed Analytics — GA4 Event Tracking
 *
 * Tracks real estate-specific events for Google Analytics 4.
 */

type RealEstateEventType =
  | 'property_view'
  | 'property_search'
  | 'viewing_request'
  | 'valuation_request'
  | 'favorite_toggle'
  | 'mortgage_calc'

interface RealEstateEventParams {
  propertyId?: string | number
  propertyAddress?: string
  propertyType?: string
  city?: string
  price?: number
  livingArea?: number
  bedrooms?: number
  energyLabel?: string
  searchQuery?: string
  mortgageAmount?: number
  mortgageRate?: number
  mortgageYears?: number
  monthlyPayment?: number
  viewingType?: 'fysiek' | 'online'
  [key: string]: unknown
}

/**
 * Track a real estate-specific GA4 event.
 *
 * @param eventType - The type of real estate event
 * @param params - Additional event parameters
 *
 * @example
 * trackRealEstateEvent('property_view', { propertyId: 123, propertyAddress: 'Wilhelminastraat 42', price: 485000 })
 * trackRealEstateEvent('viewing_request', { propertyId: 123, viewingType: 'fysiek' })
 * trackRealEstateEvent('mortgage_calc', { mortgageAmount: 400000, mortgageRate: 3.5, monthlyPayment: 1795 })
 */
export function trackRealEstateEvent(eventType: RealEstateEventType, params: RealEstateEventParams = {}): void {
  if (typeof window === 'undefined') return

  const gtag = (window as any).gtag
  if (typeof gtag !== 'function') return

  gtag('event', eventType, {
    event_category: 'vastgoed',
    ...params,
  })
}

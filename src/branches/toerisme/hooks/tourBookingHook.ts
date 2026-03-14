import type { CollectionAfterChangeHook } from 'payload'

/**
 * Tour Booking Status Hook (Toerisme Branch)
 *
 * Payload CMS afterChange hook on ContentBookings collection.
 * Detects status changes and logs actions (email sending via automation flows).
 *
 * Trigger map:
 *   new       -> confirmed  : Log confirmation, update currentBookings count on tour
 *   confirmed -> completed  : Log completion
 *   confirmed -> cancelled  : Log cancellation, decrement currentBookings
 *   confirmed -> no-show    : Log no-show
 *
 * ONLY handles docs where branch === 'toerisme' (safe for other branches).
 */

function getTourName(doc: any): string {
  if (typeof doc.tour === 'object' && doc.tour?.title) return doc.tour.title
  return 'Onbekende reis'
}

function getAccommodationName(doc: any): string {
  if (typeof doc.accommodation === 'object' && doc.accommodation?.name) return doc.accommodation.name
  return ''
}

export const tourBookingHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  // Only handle toerisme branch bookings
  if (doc.branch !== 'toerisme') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change -> no action
  if (!newStatus || newStatus === oldStatus) return doc

  const customerName = `${doc.firstName || ''} ${doc.lastName || ''}`.trim()
  const tourName = getTourName(doc)
  const accommodationName = getAccommodationName(doc)
  const travelers = doc.travelers || 1
  const departureDate = doc.departureDate || doc.date || ''
  const returnDate = doc.returnDate || ''
  const bookingItem = tourName !== 'Onbekende reis' ? tourName : (accommodationName || 'Onbekende boeking')

  // Handle status transitions
  if (oldStatus === 'new' && newStatus === 'confirmed') {
    console.log(
      `[tourBookingHook] Reisboeking bevestigd — booking ${doc.id}, ` +
        `klant: ${customerName}, reis: ${bookingItem}, ` +
        `reizigers: ${travelers}, vertrek: ${departureDate}, retour: ${returnDate}`,
    )

    console.log(
      `[tourBookingHook] Admin notificatie — nieuwe bevestigde boeking: ` +
        `${customerName} (${doc.email || 'geen e-mail'}, ${doc.phone || 'geen telefoon'}) ` +
        `voor ${bookingItem}, ${travelers} reizigers op ${departureDate}`,
    )

    // Update currentBookings count on tour
    const tourId = typeof doc.tour === 'object' ? doc.tour?.id : doc.tour
    if (tourId && req?.payload) {
      try {
        const tour = await req.payload.findByID({
          collection: 'tours',
          id: tourId,
        })
        await req.payload.update({
          collection: 'tours',
          id: tourId,
          data: {
            currentBookings: (tour.currentBookings || 0) + travelers,
          },
        })
        console.log(
          `[tourBookingHook] Tour ${tourId} currentBookings bijgewerkt: ` +
            `${tour.currentBookings || 0} → ${(tour.currentBookings || 0) + travelers}`,
        )
      } catch (e) {
        console.error(`[tourBookingHook] Fout bij updaten currentBookings voor tour ${tourId}:`, e)
      }
    }
  } else if (oldStatus === 'confirmed' && newStatus === 'completed') {
    console.log(
      `[tourBookingHook] Reisboeking afgerond — booking ${doc.id}, ` +
        `klant: ${customerName}, reis: ${bookingItem}, ` +
        `reizigers: ${travelers}, vertrek: ${departureDate}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'cancelled') {
    console.log(
      `[tourBookingHook] Reisboeking geannuleerd — booking ${doc.id}, ` +
        `klant: ${customerName}, reis: ${bookingItem}, ` +
        `reizigers: ${travelers}, vertrek: ${departureDate}`,
    )

    // Decrement currentBookings count on tour
    const tourId = typeof doc.tour === 'object' ? doc.tour?.id : doc.tour
    if (tourId && req?.payload) {
      try {
        const tour = await req.payload.findByID({
          collection: 'tours',
          id: tourId,
        })
        const newCount = Math.max(0, (tour.currentBookings || 0) - travelers)
        await req.payload.update({
          collection: 'tours',
          id: tourId,
          data: {
            currentBookings: newCount,
          },
        })
        console.log(
          `[tourBookingHook] Tour ${tourId} currentBookings bijgewerkt: ` +
            `${tour.currentBookings || 0} → ${newCount}`,
        )
      } catch (e) {
        console.error(`[tourBookingHook] Fout bij updaten currentBookings voor tour ${tourId}:`, e)
      }
    }
  } else if (oldStatus === 'confirmed' && newStatus === 'no-show') {
    console.log(
      `[tourBookingHook] Reisboeking no-show — booking ${doc.id}, ` +
        `klant: ${customerName}, reis: ${bookingItem}, ` +
        `reizigers: ${travelers}, vertrek: ${departureDate}`,
    )
  }

  return doc
}

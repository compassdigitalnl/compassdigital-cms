import type { CollectionAfterChangeHook } from 'payload'

/**
 * Workshop Booking Status Hook (Automotive Branch)
 *
 * Payload CMS afterChange hook on ContentBookings collection.
 * Detects status changes and logs actions (email sending via automation flows).
 *
 * Trigger map:
 *   new       -> confirmed  : Log "Workshop booking confirmed"
 *   confirmed -> completed  : Log "Workshop booking completed"
 *   confirmed -> cancelled  : Log "Workshop booking cancelled"
 *   confirmed -> no-show    : Log "Workshop booking no-show"
 *
 * ONLY handles docs where branch === 'automotive' (safe for other branches).
 */

function getServiceName(doc: any): string {
  if (typeof doc.service === 'object' && doc.service?.title) return doc.service.title
  return 'Werkplaatsbeurt'
}

export const workshopBookingHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  // Only handle automotive branch bookings
  if (doc.branch !== 'automotive') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change -> no action
  if (!newStatus || newStatus === oldStatus) return doc

  const customerName = `${doc.firstName || ''} ${doc.lastName || ''}`.trim()
  const serviceName = getServiceName(doc)
  const dateTime = `${doc.date || ''} ${doc.time || ''}`.trim()
  const licensePlate = doc.licensePlate || 'geen kenteken'
  const vehicle = `${doc.vehicleBrand || ''} ${doc.vehicleModel || ''}`.trim() || 'onbekend voertuig'

  // Handle status transitions
  if (oldStatus === 'new' && newStatus === 'confirmed') {
    console.log(
      `[workshopBookingHook] Werkplaatsafspraak bevestigd — booking ${doc.id}, ` +
        `klant: ${customerName}, dienst: ${serviceName}, ` +
        `voertuig: ${vehicle} (${licensePlate}), datum: ${dateTime}`,
    )

    console.log(
      `[workshopBookingHook] Admin notificatie — nieuwe bevestigde afspraak: ` +
        `${customerName} (${doc.email || 'geen e-mail'}, ${doc.phone || 'geen telefoon'}) ` +
        `voor ${serviceName} op ${dateTime}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'completed') {
    console.log(
      `[workshopBookingHook] Werkplaatsafspraak afgerond — booking ${doc.id}, ` +
        `klant: ${customerName}, dienst: ${serviceName}, ` +
        `voertuig: ${vehicle} (${licensePlate}), datum: ${dateTime}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'cancelled') {
    console.log(
      `[workshopBookingHook] Werkplaatsafspraak geannuleerd — booking ${doc.id}, ` +
        `klant: ${customerName}, dienst: ${serviceName}, ` +
        `voertuig: ${vehicle} (${licensePlate}), datum: ${dateTime}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'no-show') {
    console.log(
      `[workshopBookingHook] Werkplaatsafspraak no-show — booking ${doc.id}, ` +
        `klant: ${customerName}, dienst: ${serviceName}, ` +
        `voertuig: ${vehicle} (${licensePlate}), datum: ${dateTime}`,
    )
  }

  return doc
}

import type { CollectionAfterChangeHook } from 'payload'

/**
 * Viewing Status Hook (Vastgoed Branch)
 *
 * Payload CMS afterChange hook on ContentBookings collection.
 * Detects status changes and logs actions (email sending via automation flows).
 *
 * Trigger map:
 *   new       -> confirmed  + !isValuation : Log bezichtiging bevestigd
 *   new       -> confirmed  + isValuation  : Log waardebepaling in behandeling
 *   confirmed -> completed  + !isValuation : Log bezichtiging afgerond
 *   confirmed -> completed  + isValuation  : Log waardebepaling afgerond
 *   confirmed -> cancelled                 : Log bezichtiging/waardebepaling geannuleerd
 *
 * ONLY handles docs where branch === 'vastgoed' (safe for other branches).
 */

function getPropertyAddress(doc: any): string {
  if (typeof doc.property === 'object' && doc.property?.title) return doc.property.title
  if (doc.propertyAddress) return doc.propertyAddress
  return 'Onbekend adres'
}

export const viewingStatusHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  // Only handle vastgoed branch bookings
  if (doc.branch !== 'vastgoed') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change -> no action
  if (!newStatus || newStatus === oldStatus) return doc

  const customerName = `${doc.firstName || ''} ${doc.lastName || ''}`.trim()
  const propertyAddress = getPropertyAddress(doc)
  const isValuation = doc.isValuation === true
  const typeLabel = isValuation ? 'waardebepaling' : 'bezichtiging'

  // Handle status transitions
  if (oldStatus === 'new' && newStatus === 'confirmed') {
    if (!isValuation) {
      console.log(
        `[viewingStatusHook] Bezichtiging bevestigd voor ${propertyAddress} — booking ${doc.id}, ` +
          `klant: ${customerName}, type: ${doc.viewingType || 'fysiek'}, ` +
          `datum: ${doc.preferredDate || doc.date || ''}, tijd: ${doc.preferredTime || ''}`,
      )
    } else {
      console.log(
        `[viewingStatusHook] Waardebepaling in behandeling voor ${propertyAddress} — booking ${doc.id}, ` +
          `klant: ${customerName}, woningtype: ${doc.propertyType || 'onbekend'}` +
          (doc.propertyArea ? `, oppervlakte: ${doc.propertyArea} m²` : ''),
      )
    }

    console.log(
      `[viewingStatusHook] Admin notificatie — nieuwe bevestigde ${typeLabel}: ` +
        `${customerName} (${doc.email || 'geen e-mail'}, ${doc.phone || 'geen telefoon'}) ` +
        `voor ${propertyAddress}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'completed') {
    if (!isValuation) {
      console.log(
        `[viewingStatusHook] Bezichtiging afgerond — booking ${doc.id}, ` +
          `klant: ${customerName}, woning: ${propertyAddress}`,
      )
    } else {
      console.log(
        `[viewingStatusHook] Waardebepaling afgerond — booking ${doc.id}, ` +
          `klant: ${customerName}, adres: ${propertyAddress}`,
      )
    }
  } else if (oldStatus === 'confirmed' && newStatus === 'cancelled') {
    console.log(
      `[viewingStatusHook] ${isValuation ? 'Waardebepaling' : 'Bezichtiging'} geannuleerd — booking ${doc.id}, ` +
        `klant: ${customerName}, adres: ${propertyAddress}`,
    )
  }

  return doc
}

import type { CollectionAfterChangeHook } from 'payload'

/**
 * Appointment Status Hook (Zorg Branch)
 *
 * Payload CMS afterChange hook on ContentBookings collection.
 * Detects status changes and logs actions (email sending via automation flows).
 *
 * Trigger map:
 *   new       -> confirmed  : Log "Zorg appointment confirmed" + admin notification
 *   confirmed -> cancelled  : Log "Zorg appointment cancelled"
 *   confirmed -> completed  : Log "Zorg appointment completed"
 *   confirmed -> no-show    : Log "Zorg appointment no-show"
 *
 * ONLY handles docs where branch === 'zorg' (safe for other branches).
 */

function getServiceName(doc: any): string {
  if (typeof doc.service === 'object' && doc.service?.title) return doc.service.title
  return 'Behandeling'
}

function getStaffName(doc: any): string {
  if (typeof doc.staffMember === 'object' && doc.staffMember?.name) return doc.staffMember.name
  return ''
}

export const appointmentStatusHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  // Only handle zorg branch bookings
  if (doc.branch !== 'zorg') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change -> no action
  if (!newStatus || newStatus === oldStatus) return doc

  const patientName = `${doc.firstName || ''} ${doc.lastName || ''}`.trim()
  const serviceName = getServiceName(doc)
  const staffName = getStaffName(doc)
  const dateTime = `${doc.date || ''} ${doc.time || ''}`.trim()

  // Handle status transitions
  if (oldStatus === 'new' && newStatus === 'confirmed') {
    // -- new -> confirmed: Log confirmation + admin notification --
    console.log(
      `[appointmentStatusHook] Zorg appointment confirmed — booking ${doc.id}, ` +
        `patient: ${patientName}, service: ${serviceName}` +
        (staffName ? `, practitioner: ${staffName}` : '') +
        `, date: ${dateTime}`,
    )

    // Admin notification log
    console.log(
      `[appointmentStatusHook] Admin notification — new confirmed appointment: ` +
        `${patientName} (${doc.email || 'no email'}, ${doc.phone || 'no phone'}) ` +
        `for ${serviceName} on ${dateTime}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'cancelled') {
    // -- confirmed -> cancelled --
    console.log(
      `[appointmentStatusHook] Zorg appointment cancelled — booking ${doc.id}, ` +
        `patient: ${patientName}, service: ${serviceName}, date: ${dateTime}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'completed') {
    // -- confirmed -> completed --
    console.log(
      `[appointmentStatusHook] Zorg appointment completed — booking ${doc.id}, ` +
        `patient: ${patientName}, service: ${serviceName}, date: ${dateTime}`,
    )
  } else if (oldStatus === 'confirmed' && newStatus === 'no-show') {
    // -- confirmed -> no-show --
    console.log(
      `[appointmentStatusHook] Zorg appointment no-show — booking ${doc.id}, ` +
        `patient: ${patientName}, service: ${serviceName}, date: ${dateTime}`,
    )
  }

  return doc
}

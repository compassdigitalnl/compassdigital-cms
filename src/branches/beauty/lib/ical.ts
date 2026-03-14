/**
 * iCal/ICS Generator for Beauty Bookings
 */

interface BookingICSData {
  title: string
  description?: string
  location?: string
  startDate: Date
  durationMinutes: number
  organizerName?: string
  organizerEmail?: string
  attendeeName?: string
  attendeeEmail?: string
}

export function generateBookingICS(data: BookingICSData): string {
  const {
    title,
    description = '',
    location = '',
    startDate,
    durationMinutes,
    organizerName = '',
    organizerEmail = '',
  } = data

  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000)
  const now = new Date()

  const formatDate = (d: Date): string =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@beauty`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Beauty Salon//Booking//NL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${title}`,
    ...(description ? [`DESCRIPTION:${description.replace(/\n/g, '\\n')}`] : []),
    ...(location ? [`LOCATION:${location}`] : []),
    ...(organizerEmail ? [`ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}`] : []),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join('\r\n')
}

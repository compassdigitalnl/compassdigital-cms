/**
 * Toerisme Templates Index
 *
 * Exports all toerisme page templates.
 * Templates are selected in Settings > Templates when ENABLE_TOURISM=true.
 */

export { default as ToursArchiveTemplate } from './ToursArchive'
export { default as TourDetailTemplate } from './TourDetail'
export { default as AccommodationsArchiveTemplate } from './AccommodationsArchive'
export { default as AccommodationDetailTemplate } from './AccommodationDetail'
export { default as BookingWizardTemplate } from './BookingWizard'
export { default as ContactTemplate } from './Contact'

// Type exports
export type { ToursArchiveProps } from './ToursArchive/types'
export type { TourDetailProps } from './TourDetail/types'
export type { AccommodationsArchiveProps } from './AccommodationsArchive/types'
export type { AccommodationDetailProps } from './AccommodationDetail/types'
export type { BookingWizardProps } from './BookingWizard/types'
export type { ContactTemplateProps } from './Contact/types'

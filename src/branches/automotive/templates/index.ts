/**
 * Automotive Templates Index
 *
 * Exports all automotive page templates.
 * Templates are selected in Settings > Templates when ENABLE_AUTOMOTIVE=true.
 */

export { default as VehiclesArchiveTemplate } from './VehiclesArchive'
export { default as VehicleDetailTemplate } from './VehicleDetail'
export { default as WorkshopArchiveTemplate } from './WorkshopArchive'
export { default as WorkshopBookingTemplate } from './WorkshopBooking'
export { default as TradeInTemplate } from './TradeIn'
export { default as ContactTemplate } from './Contact'

// Type exports
export type { VehiclesArchiveProps } from './VehiclesArchive/types'
export type { VehicleDetailProps } from './VehicleDetail/types'
export type { WorkshopArchiveProps } from './WorkshopArchive/types'
export type { WorkshopBookingProps } from './WorkshopBooking/types'
export type { TradeInProps } from './TradeIn/types'
export type { ContactTemplateProps } from './Contact/types'

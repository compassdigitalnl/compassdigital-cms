/**
 * Email Marketing — Advanced Segmentation (Fase 3B)
 *
 * Barrel export for all segmentation modules.
 */

export * from './types'
export * from './operators'
export * from './condition-types'
export { buildSegmentSQL, countSegmentSubscribers, getSegmentSubscriberIds } from './condition-evaluator'

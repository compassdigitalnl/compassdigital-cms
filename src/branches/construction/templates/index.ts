/**
 * Construction Templates Index
 *
 * Exports all construction page templates.
 * Templates are selected in Settings > Templates when ENABLE_CONSTRUCTION=true.
 */

export { default as ServiceDetailTemplate } from './ServiceDetail'
export { default as ProjectDetailTemplate } from './ProjectDetail'
export { default as ProjectsArchiveTemplate } from './ProjectsArchive'
export { default as ServicesArchiveTemplate } from './ServicesArchive'
export { default as QuoteRequestTemplate } from './QuoteRequest'

// Type exports
export type { ServiceDetailProps } from './ServiceDetail/types'
export type { ProjectDetailProps } from './ProjectDetail/types'
export type { ProjectsArchiveProps } from './ProjectsArchive/types'
export type { ServicesArchiveProps } from './ServicesArchive/types'
export type { QuoteRequestProps } from './QuoteRequest/types'

/**
 * Content Modules — Settings-driven collection activation
 *
 * Provides runtime configuration for unified content collections.
 * Reads flat module fields + siteBranch from Settings global.
 *
 * Architecture:
 * - Settings.siteBranch determines default labels, routes, and conditional fields
 * - Each module (services, cases, etc.) has: enabled, label, routeSlug
 * - Branch defaults auto-fill when siteBranch is selected
 * - Custom label/routeSlug overrides take precedence over defaults
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ContentModuleType =
  | 'services'
  | 'cases'
  | 'reviews'
  | 'inquiries'
  | 'bookings'
  | 'team'
  | 'activities'

export type BranchType =
  | 'general'
  | 'tech'
  | 'dienstverlening'
  | 'bouw'
  | 'beauty'
  | 'zorg'
  | 'horeca'
  | 'ervaringen'
  | 'marketplace'
  | 'automotive'
  | 'toerisme'
  | 'vastgoed'
  | 'onderwijs'

export interface ModuleDefaults {
  label: string
  routeSlug: string
  defaultEnabled: boolean
}

export interface ModuleConfig {
  enabled: boolean
  label: string
  routeSlug: string
}

export const ALL_MODULE_TYPES: ContentModuleType[] = [
  'services', 'cases', 'reviews', 'inquiries', 'bookings', 'team', 'activities',
]

// ─── Module ↔ Collection slug mapping ──────────────────────────────────────────

const moduleToSlugMap: Record<ContentModuleType, string> = {
  services: 'content-services',
  cases: 'content-cases',
  reviews: 'content-reviews',
  inquiries: 'content-inquiries',
  bookings: 'content-bookings',
  team: 'content-team',
  activities: 'content-activities',
}

const slugToModuleMap: Record<string, ContentModuleType> = Object.fromEntries(
  Object.entries(moduleToSlugMap).map(([k, v]) => [v, k as ContentModuleType]),
)

/** Module field names in Settings global */
const moduleFieldMap: Record<ContentModuleType, string> = {
  services: 'servicesModule',
  cases: 'casesModule',
  reviews: 'reviewsModule',
  inquiries: 'inquiriesModule',
  bookings: 'bookingsModule',
  team: 'teamModule',
  activities: 'activitiesModule',
}

// ─── Branch Defaults (complete mapping for ALL branches × ALL modules) ─────────

export const branchDefaults: Record<string, Record<ContentModuleType, ModuleDefaults>> = {
  general: {
    services:   { label: 'Diensten',          routeSlug: 'diensten',            defaultEnabled: true },
    cases:      { label: 'Cases',             routeSlug: 'cases',               defaultEnabled: true },
    reviews:    { label: 'Testimonials',      routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Aanvragen',         routeSlug: 'aanvraag',            defaultEnabled: true },
    bookings:   { label: 'Afspraken',         routeSlug: 'afspraak-maken',      defaultEnabled: false },
    team:       { label: 'Team',              routeSlug: 'team',                defaultEnabled: true },
    activities: { label: 'Events',            routeSlug: 'events',              defaultEnabled: false },
  },
  tech: {
    services:   { label: 'Diensten',          routeSlug: 'diensten',            defaultEnabled: true },
    cases:      { label: 'Portfolio',         routeSlug: 'portfolio',            defaultEnabled: true },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Offertes',          routeSlug: 'offerte-aanvragen',   defaultEnabled: true },
    bookings:   { label: 'Meetings',          routeSlug: 'meeting-plannen',     defaultEnabled: false },
    team:       { label: 'Team',              routeSlug: 'team',                defaultEnabled: true },
    activities: { label: 'Meetups',           routeSlug: 'meetups',             defaultEnabled: false },
  },
  dienstverlening: {
    services:   { label: 'Diensten',          routeSlug: 'dienstverlening',     defaultEnabled: true },
    cases:      { label: 'Cases',             routeSlug: 'cases',               defaultEnabled: true },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Adviesgesprekken',  routeSlug: 'adviesgesprek-aanvragen', defaultEnabled: true },
    bookings:   { label: 'Afspraken',         routeSlug: 'afspraak-maken',      defaultEnabled: false },
    team:       { label: 'Team',              routeSlug: 'team',                defaultEnabled: true },
    activities: { label: 'Seminars',          routeSlug: 'seminars',            defaultEnabled: false },
  },
  bouw: {
    services:   { label: 'Diensten',          routeSlug: 'diensten',            defaultEnabled: true },
    cases:      { label: 'Projecten',         routeSlug: 'projecten',           defaultEnabled: true },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Offerteaanvragen',  routeSlug: 'offerte-aanvragen',   defaultEnabled: true },
    bookings:   { label: 'Locatiebezoek',     routeSlug: 'locatiebezoek',       defaultEnabled: false },
    team:       { label: 'Ons Team',          routeSlug: 'team',                defaultEnabled: true },
    activities: { label: 'Open Dagen',        routeSlug: 'evenementen',         defaultEnabled: false },
  },
  beauty: {
    services:   { label: 'Behandelingen',     routeSlug: 'behandelingen',       defaultEnabled: true },
    cases:      { label: 'Portfolio',         routeSlug: 'portfolio',            defaultEnabled: false },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Consultatie',       routeSlug: 'consultatie-aanvragen', defaultEnabled: false },
    bookings:   { label: 'Boekingen',         routeSlug: 'boeken',              defaultEnabled: true },
    team:       { label: 'Stylisten',         routeSlug: 'team',                defaultEnabled: true },
    activities: { label: 'Workshops',         routeSlug: 'workshops',           defaultEnabled: false },
  },
  zorg: {
    services:   { label: 'Behandelingen',     routeSlug: 'behandelingen',       defaultEnabled: true },
    cases:      { label: 'Resultaten',        routeSlug: 'resultaten',          defaultEnabled: false },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Intake-aanvraag',   routeSlug: 'intake',              defaultEnabled: false },
    bookings:   { label: 'Afspraken',         routeSlug: 'afspraak-maken',      defaultEnabled: true },
    team:       { label: 'Behandelaars',      routeSlug: 'team',                defaultEnabled: true },
    activities: { label: 'Workshops',         routeSlug: 'workshops',           defaultEnabled: false },
  },
  horeca: {
    services:   { label: 'Services',          routeSlug: 'services',            defaultEnabled: false },
    cases:      { label: 'Portfolio',         routeSlug: 'portfolio',            defaultEnabled: false },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Groepsaanvraag',    routeSlug: 'groepsaanvraag',      defaultEnabled: false },
    bookings:   { label: 'Reserveringen',     routeSlug: 'reserveren',          defaultEnabled: true },
    team:       { label: 'Team',              routeSlug: 'team',                defaultEnabled: true },
    activities: { label: 'Evenementen',       routeSlug: 'evenementen',         defaultEnabled: true },
  },
  ervaringen: {
    services:   { label: 'Arrangementen',     routeSlug: 'arrangementen',       defaultEnabled: true },
    cases:      { label: 'Verhalen',          routeSlug: 'verhalen',            defaultEnabled: false },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Groepsboeking',     routeSlug: 'groepsboeking',       defaultEnabled: false },
    bookings:   { label: 'Boekingen',         routeSlug: 'boeken',              defaultEnabled: true },
    team:       { label: 'Gidsen',            routeSlug: 'team',                defaultEnabled: false },
    activities: { label: 'Ervaringen',        routeSlug: 'ervaringen',          defaultEnabled: true },
  },
  marketplace: {
    services:   { label: 'Diensten',          routeSlug: 'diensten',            defaultEnabled: false },
    cases:      { label: 'Cases',             routeSlug: 'cases',               defaultEnabled: false },
    reviews:    { label: 'Reviews',           routeSlug: '',                    defaultEnabled: true },
    inquiries:  { label: 'Aanvragen',         routeSlug: 'aanvraag',            defaultEnabled: false },
    bookings:   { label: 'Boekingen',         routeSlug: 'boeken',              defaultEnabled: false },
    team:       { label: 'Team',              routeSlug: 'team',                defaultEnabled: false },
    activities: { label: 'Workshops',         routeSlug: 'workshops',           defaultEnabled: true },
  },
  automotive: {
    services:   { label: 'Werkplaatsdiensten', routeSlug: 'werkplaats',         defaultEnabled: true },
    cases:      { label: 'Portfolio',          routeSlug: 'portfolio',           defaultEnabled: false },
    reviews:    { label: 'Reviews',            routeSlug: '',                   defaultEnabled: true },
    inquiries:  { label: 'Inruil-aanvraag',    routeSlug: 'inruilen',           defaultEnabled: true },
    bookings:   { label: 'Werkplaatsafspraken', routeSlug: 'afspraak-maken',    defaultEnabled: true },
    team:       { label: 'Team',               routeSlug: 'team',              defaultEnabled: true },
    activities: { label: 'Evenementen',        routeSlug: 'evenementen',        defaultEnabled: false },
  },
  toerisme: {
    services:   { label: 'Arrangementen',      routeSlug: 'arrangementen',      defaultEnabled: false },
    cases:      { label: 'Reisverhalen',       routeSlug: 'reisverhalen',       defaultEnabled: false },
    reviews:    { label: 'Reviews',            routeSlug: 'reviews',            defaultEnabled: true },
    inquiries:  { label: 'Aanvragen',          routeSlug: 'aanvragen',          defaultEnabled: true },
    bookings:   { label: 'Boekingen',          routeSlug: 'boekingen',          defaultEnabled: true },
    team:       { label: 'Reisleiders',        routeSlug: 'team',              defaultEnabled: true },
    activities: { label: 'Excursies',          routeSlug: 'excursies',          defaultEnabled: false },
  },
  vastgoed: {
    services:   { label: 'Diensten',           routeSlug: 'diensten',           defaultEnabled: false },
    bookings:   { label: 'Bezichtigingen',     routeSlug: 'bezichtigingen',     defaultEnabled: true },
    reviews:    { label: 'Reviews',            routeSlug: 'reviews',            defaultEnabled: true },
    team:       { label: 'Makelaars',          routeSlug: 'makelaars',          defaultEnabled: true },
    cases:      { label: 'Portfolio',          routeSlug: 'portfolio',          defaultEnabled: false },
    activities: { label: 'Evenementen',        routeSlug: 'evenementen',        defaultEnabled: false },
    inquiries:  { label: 'Waardebepalingen',   routeSlug: 'waardebepalingen',   defaultEnabled: true },
  },
  onderwijs: {
    services:   { label: 'Cursussen',          routeSlug: 'cursussen',          defaultEnabled: false },
    bookings:   { label: 'Inschrijvingen',     routeSlug: 'inschrijvingen',     defaultEnabled: true },
    reviews:    { label: 'Reviews',            routeSlug: 'reviews',            defaultEnabled: true },
    team:       { label: 'Docenten',           routeSlug: 'docenten',           defaultEnabled: true },
    cases:      { label: 'Succesverhalen',     routeSlug: 'succesverhalen',     defaultEnabled: false },
    activities: { label: 'Workshops',          routeSlug: 'workshops',          defaultEnabled: false },
    inquiries:  { label: 'Aanvragen',          routeSlug: 'aanvragen',          defaultEnabled: true },
  },
}

// ─── Module-level cache ────────────────────────────────────────────────────────

interface CachedSettings {
  siteBranch?: string
  servicesModule?: { enabled?: boolean; label?: string; routeSlug?: string }
  casesModule?: { enabled?: boolean; label?: string; routeSlug?: string }
  reviewsModule?: { enabled?: boolean; label?: string; routeSlug?: string }
  inquiriesModule?: { enabled?: boolean; label?: string; routeSlug?: string }
  bookingsModule?: { enabled?: boolean; label?: string; routeSlug?: string }
  teamModule?: { enabled?: boolean; label?: string; routeSlug?: string }
  activitiesModule?: { enabled?: boolean; label?: string; routeSlug?: string }
  [key: string]: any
}

let _cachedSettings: CachedSettings | null = null

/**
 * Update the cached settings data.
 * Called by Settings afterChange hook.
 */
export function updateContentModulesCache(settings: CachedSettings): void {
  _cachedSettings = settings
}

/**
 * Get the site's configured branch.
 */
export function getCachedSiteBranch(): BranchType {
  return (_cachedSettings?.siteBranch as BranchType) || 'general'
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Check if a content module is enabled in Settings.
 */
export function isContentModuleActive(moduleType: ContentModuleType): boolean {
  const fieldName = moduleFieldMap[moduleType]
  const moduleData = _cachedSettings?.[fieldName] as any
  return moduleData?.enabled === true
}

/**
 * Check if a collection slug belongs to a unified content collection.
 */
export function isContentCollection(slug: string): boolean {
  return slug in slugToModuleMap
}

/**
 * Check if a unified content collection should be visible.
 */
export function isContentCollectionActive(collectionSlug: string): boolean {
  const moduleType = slugToModuleMap[collectionSlug]
  if (!moduleType) return false
  return isContentModuleActive(moduleType)
}

/**
 * Get the resolved config for a module (with branch defaults as fallback).
 */
export function getModuleConfig(moduleType: ContentModuleType): ModuleConfig {
  const branch = getCachedSiteBranch()
  const defaults = branchDefaults[branch]?.[moduleType] || branchDefaults.general[moduleType]
  const fieldName = moduleFieldMap[moduleType]
  const moduleData = _cachedSettings?.[fieldName] as any

  return {
    enabled: moduleData?.enabled === true,
    label: moduleData?.label || defaults.label,
    routeSlug: moduleData?.routeSlug || defaults.routeSlug,
  }
}

/**
 * Get the admin sidebar label for a module.
 */
export function getModuleLabel(moduleType: ContentModuleType): string {
  return getModuleConfig(moduleType).label
}

/**
 * Get the URL route slug for a module.
 */
export function getModuleRouteSlug(moduleType: ContentModuleType): string {
  return getModuleConfig(moduleType).routeSlug
}

/**
 * Get the defaults for a given branch and module.
 */
export function getDefaults(branch: string, moduleType: ContentModuleType): ModuleDefaults {
  return branchDefaults[branch]?.[moduleType] || branchDefaults.general[moduleType]
}

/**
 * Get the collection slug for a content module type.
 */
export function getCollectionSlug(moduleType: ContentModuleType): string {
  return moduleToSlugMap[moduleType]
}

/**
 * All unified content collection slugs.
 */
export const UNIFIED_CONTENT_SLUGS = Object.values(moduleToSlugMap)

/**
 * CMSConfigService
 *
 * Vertaalt wizard-antwoorden naar een exacte CMS-configuratie:
 * welke collections, blocks en globals een klant krijgt.
 *
 * Output wordt gebruikt om:
 * 1. DISABLED_COLLECTIONS env var te bepalen voor Ploi-deployment
 * 2. Het juiste template-ID te selecteren
 * 3. Extra env vars door te geven aan ProvisioningService
 */

import type { WizardState, SiteGoal, PrimaryType, WebsiteSubType, WebshopModel } from '@/lib/siteGenerator/types'

// ─── Alle bekende collection slugs (moeten overeenkomen met payload.config.ts) ─

export const ALL_COLLECTION_SLUGS = [
  // Altijd aan
  'pages',
  'media',
  'users',
  // Content
  'blog-posts',
  'services',
  'cases',
  'testimonials',
  'faqs',
  'partners',
  // Shop
  'products',
  'product-categories',
  'brands',
  'orders',
  'order-lists',
  'customer-groups',
] as const

export type CollectionSlug = typeof ALL_COLLECTION_SLUGS[number]

// ─── Altijd verplichte collections (nooit uitschakelen) ───────────────────────

const ALWAYS_ENABLED: CollectionSlug[] = ['pages', 'media', 'users']

// ─── Output type ──────────────────────────────────────────────────────────────

export interface CMSConfig {
  /** Template ID voor Payload-configuratie */
  templateId: string
  /** Collections die actief zijn voor deze klant */
  enabledCollections: CollectionSlug[]
  /** Collections die uitgeschakeld moeten worden (voor DISABLED_COLLECTIONS env var) */
  disabledCollections: CollectionSlug[]
  /** Extra env vars voor de Ploi-deployment */
  envVars: Record<string, string>
  /** Human-readable samenvatting van de configuratie */
  summary: string
}

// ─── Hoofdfunctie ─────────────────────────────────────────────────────────────

/**
 * Berekent de complete CMS-configuratie op basis van wizard-antwoorden.
 * Dit is de single source of truth voor wat een klant krijgt.
 */
export function computeCMSConfig(wizardState: WizardState): CMSConfig {
  const goal = wizardState.siteGoal
  const selectedPages = wizardState.content?.pages ?? []

  // Bepaal welke collections aan moeten op basis van doel + pagina's
  const enabled = new Set<CollectionSlug>(ALWAYS_ENABLED)

  if (!goal) {
    // Geen goal ingesteld: minimale config (alleen basiscollections)
    return buildResult(enabled, 'corporate', 'Minimale configuratie (geen site type geselecteerd)')
  }

  // ── Website ──────────────────────────────────────────────────────────────────
  if (goal.primaryType === 'website') {
    applyWebsiteCollections(enabled, goal, selectedPages)
    const templateId = websiteTemplateId(goal.websiteSubType)
    const summary = `Website (${goal.websiteSubType || 'corporate'})`
    return buildResult(enabled, templateId, summary)
  }

  // ── Webshop ──────────────────────────────────────────────────────────────────
  if (goal.primaryType === 'webshop') {
    applyWebshopCollections(enabled, goal, selectedPages)
    const templateId = webshopTemplateId(goal.shopModel)
    const summary = `Webshop (${goal.shopModel || 'b2c-simple'})`
    return buildResult(enabled, templateId, summary, buildWebshopEnvVars(goal))
  }

  // ── Hybrid ───────────────────────────────────────────────────────────────────
  if (goal.primaryType === 'hybrid') {
    // Hybrid = website collections + webshop collections gecombineerd
    applyWebsiteCollections(enabled, goal, selectedPages)
    applyWebshopCollections(enabled, goal, selectedPages)
    const summary = `Hybrid (${goal.hybridWebsiteType || 'corporate'} + webshop)`
    return buildResult(enabled, 'hybrid', summary, buildWebshopEnvVars(goal))
  }

  return buildResult(enabled, 'corporate', 'Standaard configuratie')
}

// ─── Website collections ──────────────────────────────────────────────────────

function applyWebsiteCollections(
  enabled: Set<CollectionSlug>,
  goal: SiteGoal,
  selectedPages: string[],
): void {
  const subType = goal.websiteSubType ?? goal.hybridWebsiteType ?? 'corporate'

  // Testimonials: bijna altijd relevant voor websites
  if (subType !== 'landing' && subType !== 'blog') {
    enabled.add('testimonials')
  }

  // FAQs: voor corporate, agency en landing
  if (['corporate', 'agency', 'landing'].includes(subType)) {
    enabled.add('faqs')
  }

  // Services: corporate, agency
  if (['corporate', 'agency'].includes(subType) || selectedPages.includes('services')) {
    enabled.add('services')
  }

  // Cases / Portfolio: portfolio, agency
  if (['portfolio', 'agency'].includes(subType) || selectedPages.includes('portfolio')) {
    enabled.add('cases')
  }

  // Blog-posts: blog-type altijd, anderen optioneel als pagina geselecteerd
  if (subType === 'blog' || selectedPages.includes('blog')) {
    enabled.add('blog-posts')
  }

  // Partners: corporate en agency
  if (['corporate', 'agency'].includes(subType)) {
    enabled.add('partners')
  }
}

// ─── Webshop collections ──────────────────────────────────────────────────────

function applyWebshopCollections(
  enabled: Set<CollectionSlug>,
  goal: SiteGoal,
  selectedPages: string[],
): void {
  const shopModel = goal.shopModel ?? 'b2c-simple'

  // Shop basis: altijd voor alle webshop-types
  enabled.add('products')
  enabled.add('product-categories')
  enabled.add('brands')
  enabled.add('orders')
  enabled.add('testimonials')
  enabled.add('faqs')

  // Blog: optioneel
  if (selectedPages.includes('blog')) {
    enabled.add('blog-posts')
  }

  // B2B specifiek
  if (shopModel === 'b2b' || shopModel === 'hybrid') {
    enabled.add('customer-groups')
    enabled.add('order-lists')
    enabled.add('partners')
  }

  // B2C geavanceerd: geen extra collections nodig boven simpel
  // (varianten worden als product-fields opgeslagen, niet als aparte collection)
}

// ─── Template ID bepalen ──────────────────────────────────────────────────────

function websiteTemplateId(subType?: WebsiteSubType): string {
  switch (subType) {
    case 'portfolio': return 'portfolio'
    case 'agency':    return 'portfolio'
    case 'blog':      return 'blog'
    case 'landing':   return 'corporate'
    default:          return 'corporate'
  }
}

function webshopTemplateId(shopModel?: WebshopModel): string {
  switch (shopModel) {
    case 'b2b':     return 'b2b'
    case 'hybrid':  return 'b2b'
    default:        return 'ecommerce'
  }
}

// ─── Webshop env vars ─────────────────────────────────────────────────────────

function buildWebshopEnvVars(goal: SiteGoal): Record<string, string> {
  const vars: Record<string, string> = {
    ECOMMERCE_ENABLED: 'true',
    SHOP_MODEL: goal.shopModel ?? 'b2c-simple',
    PRICING_MODEL: goal.pricingModel ?? 'flat',
  }

  if (goal.hasCustomerGroups) vars['CUSTOMER_GROUPS_ENABLED'] = 'true'
  if (goal.requiresApproval) vars['ORDER_APPROVAL_REQUIRED'] = 'true'
  if (goal.hidePricesForGuests) vars['HIDE_PRICES_FOR_GUESTS'] = 'true'
  if (goal.enableQuoteRequests) vars['QUOTE_REQUESTS_ENABLED'] = 'true'
  if (goal.enableBulkOrder) vars['BULK_ORDER_ENABLED'] = 'true'

  return vars
}

// ─── Builder helper ───────────────────────────────────────────────────────────

function buildResult(
  enabled: Set<CollectionSlug>,
  templateId: string,
  summary: string,
  extraEnvVars: Record<string, string> = {},
): CMSConfig {
  const enabledCollections = ALL_COLLECTION_SLUGS.filter((slug) => enabled.has(slug))
  const disabledCollections = ALL_COLLECTION_SLUGS.filter((slug) => !enabled.has(slug))

  const envVars: Record<string, string> = {
    TEMPLATE_ID: templateId,
    // Komma-gescheiden lijst voor payload.config.ts runtime filtering
    DISABLED_COLLECTIONS: disabledCollections.join(','),
    ...extraEnvVars,
  }

  return {
    templateId,
    enabledCollections,
    disabledCollections,
    envVars,
    summary,
  }
}

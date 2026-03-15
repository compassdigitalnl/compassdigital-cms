import type { Payload } from 'payload'

/**
 * Seed Options
 *
 * Configures what content to seed based on tenant configuration
 */
export interface SeedOptions {
  /**
   * Template type determines the base content structure
   */
  template: 'ecommerce' | 'blog' | 'b2b' | 'portfolio' | 'corporate' | 'construction' | 'beauty' | 'horeca' | 'hospitality' | 'zorg' | 'publishing' | 'automotive' | 'toerisme' | 'vastgoed' | 'onderwijs'

  /**
   * Enabled features for this tenant (from environment or database)
   */
  features: Record<string, boolean>

  /**
   * Company information for personalization
   */
  companyName: string
  domain: string

  /**
   * Whether to create content as draft (default: true)
   * Production deployments should start with draft content
   */
  draftOnly?: boolean

  /**
   * Optional override for specific collections to seed
   * If not provided, seeds based on template + features
   */
  collectionsToSeed?: string[]
}

/**
 * Seed Result
 *
 * Tracks what was seeded and any errors
 */
export interface SeedResult {
  success: boolean
  template: string
  features: string[]
  seeded: {
    collections: Record<string, number>  // collection name -> count
    globals: string[]
  }
  errors: Array<{
    type: 'collection' | 'global'
    name: string
    error: string
  }>
  duration: number  // milliseconds
}

/**
 * Main Seed Orchestrator
 *
 * Coordinates seeding across all features and templates
 *
 * @example
 * ```ts
 * const result = await seedTenant(payload, {
 *   template: 'construction',
 *   features: { construction: true, blog: true, faq: true },
 *   companyName: 'Bouwbedrijf XYZ',
 *   domain: 'bouwbedrijf-xyz.nl',
 *   draftOnly: true
 * })
 * ```
 */
export async function seedTenant(
  payload: Payload,
  options: SeedOptions,
): Promise<SeedResult> {
  const startTime = Date.now()
  const { template, features, draftOnly = true } = options
  const status = draftOnly ? 'draft' : 'published'

  payload.logger.info(`🌱 Seeding tenant: ${options.companyName}`)
  payload.logger.info(`   Template: ${template}`)
  payload.logger.info(`   Features: ${Object.keys(features).filter(k => features[k]).join(', ')}`)
  payload.logger.info(`   Status: ${status}`)

  const result: SeedResult = {
    success: true,
    template,
    features: Object.keys(features).filter(k => features[k]),
    seeded: {
      collections: {},
      globals: [],
    },
    errors: [],
    duration: 0,
  }

  try {
    // ========================================================================
    // FASE 1: Base Content (altijd)
    // ========================================================================
    payload.logger.info('📄 Fase 1: Base content (pages, header, footer, settings)...')

    // Import dynamically om circular dependencies te voorkomen
    const { seedBase } = await import('./templates/base')
    const baseResult = await seedBase(payload, options, status)

    Object.assign(result.seeded.collections, baseResult.collections)
    result.seeded.globals.push(...baseResult.globals)

    // ========================================================================
    // FASE 2: Feature-Driven Content
    // ========================================================================
    payload.logger.info('🎯 Fase 2: Feature-driven content...')

    // E-commerce
    if (features.shop || features.products) {
      payload.logger.info('   → E-commerce (products, categories, brands)...')
      const { seedEcommerce } = await import('./templates/ecommerce')
      const ecomResult = await seedEcommerce(payload, options, status)
      Object.assign(result.seeded.collections, ecomResult.collections)
    }

    // Construction
    if (features.construction) {
      payload.logger.info('   → Construction (services, projects)...')
      const { seedConstruction } = await import('./templates/construction')
      const constructionResult = await seedConstruction(payload, options, status)
      Object.assign(result.seeded.collections, constructionResult.collections)
    }

    // Beauty
    if (features.beauty) {
      payload.logger.info('   → Beauty (services, stylists)...')
      const { seedBeauty } = await import('./templates/beauty')
      const beautyResult = await seedBeauty(payload, options, status)
      Object.assign(result.seeded.collections, beautyResult.collections)
    }

    // Horeca
    if (features.horeca) {
      payload.logger.info('   → Horeca (menu items, events)...')
      const { seedHoreca } = await import('./templates/horeca')
      const horecaResult = await seedHoreca(payload, options, status)
      Object.assign(result.seeded.collections, horecaResult.collections)
    }

    // Hospitality
    if (features.hospitality) {
      payload.logger.info('   → Hospitality (treatments, practitioners)...')
      const { seedHospitality } = await import('./templates/hospitality')
      const hospitalityResult = await seedHospitality(payload, options, status)
      Object.assign(result.seeded.collections, hospitalityResult.collections)
    }

    // Zorg
    if (features.zorg) {
      payload.logger.info('   → Zorg (treatments, practitioners)...')
      const { seedZorg } = await import('./templates/zorg')
      const zorgResult = await seedZorg(payload, options, status)
      Object.assign(result.seeded.collections, zorgResult.collections)
      result.seeded.globals.push(...zorgResult.globals)
    }

    // Automotive
    if (features.automotive) {
      payload.logger.info('   → Automotive (brands, vehicles, workshop services)...')
      const { seedAutomotive } = await import('./templates/automotive')
      const automotiveResult = await seedAutomotive(payload, options, status)
      Object.assign(result.seeded.collections, automotiveResult.collections)
      result.seeded.globals.push(...automotiveResult.globals)
    }

    // Toerisme
    if (features.tourism) {
      payload.logger.info('   → Toerisme (destinations, tours, accommodations)...')
      const { seedToerisme } = await import('./templates/toerisme')
      const toerismeResult = await seedToerisme(payload, options, status)
      Object.assign(result.seeded.collections, toerismeResult.collections)
      result.seeded.globals.push(...toerismeResult.globals)
    }

    // Vastgoed
    if (features.real_estate) {
      payload.logger.info('   → Vastgoed (properties, makelaars, reviews)...')
      const { seedVastgoed } = await import('./templates/vastgoed')
      const vastgoedResult = await seedVastgoed(payload, options, status)
      Object.assign(result.seeded.collections, vastgoedResult.collections)
      result.seeded.globals.push(...vastgoedResult.globals)
    }

    // Onderwijs
    if (features.education) {
      payload.logger.info('   → Onderwijs (categories, courses, docenten, reviews)...')
      const { seedOnderwijs } = await import('./templates/onderwijs')
      const onderwijsResult = await seedOnderwijs(payload, options, status)
      Object.assign(result.seeded.collections, onderwijsResult.collections)
      result.seeded.globals.push(...onderwijsResult.globals)
    }

    // Publishing (blog categories, blog articles, chatbot)
    if (features.publishing || features.content) {
      payload.logger.info('   → Publishing (blog categories, articles, chatbot)...')
      const { seedPublishing } = await import('./templates/publishing')
      const publishingResult = await seedPublishing(payload, options, status)
      Object.assign(result.seeded.collections, publishingResult.collections)
      result.seeded.globals.push(...publishingResult.globals)
    }

    // Content (blog, FAQs, testimonials, cases)
    if (features.blog || features.faq || features.testimonials || features.cases) {
      payload.logger.info('   → Content (blog, FAQs, testimonials, cases)...')
      const { seedContent } = await import('./templates/content')
      const contentResult = await seedContent(payload, options, status, {
        blog: features.blog,
        faq: features.faq,
        testimonials: features.testimonials,
        cases: features.cases,
      })
      Object.assign(result.seeded.collections, contentResult.collections)
    }

    // Marketplace
    if (features.vendors || features.workshops) {
      payload.logger.info('   → Marketplace (vendors, workshops)...')
      const { seedMarketplace } = await import('./templates/marketplace')
      const marketplaceResult = await seedMarketplace(payload, options, status)
      Object.assign(result.seeded.collections, marketplaceResult.collections)
    }

    // ========================================================================
    // FASE 3: Rapport
    // ========================================================================
    result.duration = Date.now() - startTime

    payload.logger.info('')
    payload.logger.info('✅ Seeding voltooid!')
    payload.logger.info(`   Collections: ${Object.keys(result.seeded.collections).length}`)
    payload.logger.info(`   Globals: ${result.seeded.globals.length}`)
    payload.logger.info(`   Duration: ${(result.duration / 1000).toFixed(2)}s`)

    // Toon details per collection
    Object.entries(result.seeded.collections).forEach(([collection, count]) => {
      payload.logger.info(`   - ${collection}: ${count} items`)
    })

  } catch (error) {
    result.success = false
    result.errors.push({
      type: 'collection',
      name: 'unknown',
      error: error instanceof Error ? error.message : String(error),
    })
    payload.logger.error('❌ Seeding failed: ' + (error instanceof Error ? error.message : String(error)))
  }

  return result
}

/**
 * Check if content already exists
 *
 * Prevents duplicate seeding
 */
export async function checkExistingContent(
  payload: Payload,
  collection: string,
  slug: string,
): Promise<boolean> {
  try {
    const result = await payload.find({
      collection: collection as any,
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return result.docs.length > 0
  } catch (error) {
    return false
  }
}

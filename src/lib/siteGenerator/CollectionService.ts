/**
 * Collection Creation Service
 * Creates entries in Payload collections (Cases, Testimonials, etc.)
 * Used by Site Generator to create reusable content
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { WizardState } from './types'
import { LexicalHelpers } from './LexicalHelpers'

export class CollectionService {
  private payload: any

  /**
   * Initialize Payload instance
   */
  async initialize() {
    if (!this.payload) {
      this.payload = await getPayload({ config })
    }
  }

  /**
   * Create Case entries from AI-generated portfolio data
   * Returns array of created case IDs for relationships
   *
   * @param portfolioCases - Array of AI-generated portfolio cases
   * @param wizardData - Full wizard state for context
   * @returns Array of created case IDs
   */
  async createCases(portfolioCases: any[], wizardData: WizardState): Promise<string[]> {
    await this.initialize()
    const caseIds: string[] = []

    console.log(`[CollectionService] Creating ${portfolioCases.length} cases in collection...`)

    for (const portfolioCase of portfolioCases) {
      try {
        // Generate slug from project name
        const title = portfolioCase.projectName || 'Portfolio Case'
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')

        // Get description or fallback
        const description = portfolioCase.description || 'Een succesvol project uitgevoerd voor onze klant.'

        const createdCase = await this.payload.create({
          collection: 'cases',
          data: {
            title,
            slug,
            client: portfolioCase.client || 'Client Name',
            excerpt:
              portfolioCase.tagline ||
              portfolioCase.description?.substring(0, 160) ||
              'Een van onze succesvolle projecten',
            content: LexicalHelpers.textToLexical(description), // ✅ Required richText field!
            services: portfolioCase.services
              ? portfolioCase.services.map((s: string) => ({ service: s }))
              : [],
            liveUrl: portfolioCase.liveUrl || '',
            status: 'published',
            // @ts-ignore - Payload's internal status
            _status: 'published',
          },
        })

        caseIds.push(createdCase.id)
        console.log(
          `[CollectionService] ✓ Created case: ${portfolioCase.projectName} (ID: ${createdCase.id})`,
        )
      } catch (error: any) {
        console.error(`[CollectionService] Error creating case "${portfolioCase.projectName}":`, error)
        // Continue with other cases - don't fail completely
      }
    }

    console.log(`[CollectionService] Successfully created ${caseIds.length}/${portfolioCases.length} cases`)

    return caseIds
  }

  /**
   * Create Testimonial entries from AI-generated testimonials
   * PHASE 2 IMPLEMENTATION
   *
   * Currently, testimonials use inline manualTestimonials which works fine.
   * This method is for future enhancement to make testimonials reusable.
   *
   * @param testimonials - Array of AI-generated testimonials
   * @param wizardData - Full wizard state
   * @returns Array of created testimonial IDs
   */
  async createTestimonials(testimonials: any[], wizardData: WizardState): Promise<string[]> {
    // Phase 2 implementation
    // For now, we use inline manualTestimonials in the TestimonialsBlock
    // This works perfectly fine and doesn't require collection entries

    console.log('[CollectionService] Testimonials using inline data (manual mode)')
    return []
  }

  /**
   * Check if a case with the same title already exists
   * Prevents duplicates when regenerating sites
   *
   * @param title - Case title to check
   * @returns True if case exists
   */
  async caseExists(title: string): Promise<boolean> {
    await this.initialize()

    try {
      const existing = await this.payload.find({
        collection: 'cases',
        where: {
          title: {
            equals: title,
          },
        },
        limit: 1,
      })

      return existing.docs.length > 0
    } catch (error) {
      console.error('[CollectionService] Error checking case existence:', error)
      return false
    }
  }

  /**
   * Delete all cases created by AI generator
   * Useful for testing/cleanup
   *
   * @returns Number of deleted cases
   */
  async deleteAllGeneratedCases(): Promise<number> {
    await this.initialize()

    try {
      // Find all featured cases (AI-generated are marked as featured)
      const cases = await this.payload.find({
        collection: 'cases',
        where: {
          featured: {
            equals: true,
          },
        },
        limit: 100,
      })

      let deletedCount = 0

      for (const caseDoc of cases.docs) {
        await this.payload.delete({
          collection: 'cases',
          id: caseDoc.id,
        })
        deletedCount++
      }

      console.log(`[CollectionService] Deleted ${deletedCount} AI-generated cases`)
      return deletedCount
    } catch (error) {
      console.error('[CollectionService] Error deleting cases:', error)
      return 0
    }
  }
}

/**
 * Predefined Email Marketing Content — Seed Function
 *
 * Seeds predefined templates, flows, and segments into the database.
 * Skips items that already exist (matched by name/title/slug).
 *
 * Usage:
 *   POST /api/email-marketing/seed-predefined
 *   or: import { seedPredefinedContent } from '...' and call directly
 */

import type { Payload } from 'payload'
import { predefinedTemplates } from './templates'
import { predefinedFlows } from './flows'
import { predefinedSegments } from './segments'

export interface SeedResult {
  templates: { created: number; skipped: number; errors: string[] }
  flows: { created: number; skipped: number; errors: string[] }
  segments: { created: number; skipped: number; errors: string[] }
}

export async function seedPredefinedContent(payload: Payload): Promise<SeedResult> {
  const result: SeedResult = {
    templates: { created: 0, skipped: 0, errors: [] },
    flows: { created: 0, skipped: 0, errors: [] },
    segments: { created: 0, skipped: 0, errors: [] },
  }

  // ═══════════════════════════════════════════════════════════
  // 1. SEED TEMPLATES
  // ═══════════════════════════════════════════════════════════
  const templateIdMap = new Map<string, number>() // name → id

  for (const template of predefinedTemplates) {
    try {
      // Check if already exists
      const existing = await payload.find({
        collection: 'email-templates',
        where: { name: { equals: template.name } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        templateIdMap.set(template.name, existing.docs[0].id)
        result.templates.skipped++
        continue
      }

      const doc = await payload.create({
        collection: 'email-templates',
        data: {
          name: template.name,
          description: template.description,
          type: template.type,
          category: template.category,
          defaultSubject: template.defaultSubject,
          preheader: template.preheader,
          html: template.html,
          useVisualEditor: false, // HTML templates
          isActive: true,
          isDefault: false,
          templateVariables: {
            list: template.variables.map((v) => ({
              name: v.name,
              label: v.label,
              defaultValue: v.defaultValue || '',
              required: v.required || false,
            })),
          },
          tags: template.tags.map((tag) => ({ tag })),
        },
      })

      templateIdMap.set(template.name, doc.id)
      result.templates.created++
    } catch (error) {
      const msg = `Template "${template.name}": ${error instanceof Error ? error.message : String(error)}`
      result.templates.errors.push(msg)
      console.error('[Seed]', msg)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 2. SEED FLOWS
  // ═══════════════════════════════════════════════════════════
  for (const flow of predefinedFlows) {
    try {
      // Check if already exists
      const existing = await payload.find({
        collection: 'automation-flows',
        where: { name: { equals: flow.name } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        result.flows.skipped++
        continue
      }

      // Resolve template references in steps
      const steps = flow.steps.map((step) => {
        const stepData: Record<string, unknown> = {
          name: step.name,
          type: step.type,
        }

        if (step.type === 'send_email' && step.templateName) {
          const templateId = templateIdMap.get(step.templateName)
          if (templateId) {
            stepData.emailTemplate = templateId
          }
        }

        if (step.type === 'wait' && step.waitDuration) {
          stepData.waitDuration = step.waitDuration
        }

        if (step.type === 'condition' && step.condition) {
          stepData.condition = step.condition
        }

        if ((step.type === 'add_tag' || step.type === 'remove_tag') && step.tagName) {
          stepData.tagName = step.tagName
        }

        if (step.type === 'exit' && step.exitReason) {
          stepData.exitReason = step.exitReason
        }

        return stepData
      })

      await payload.create({
        collection: 'automation-flows',
        data: {
          name: flow.name,
          description: flow.description,
          status: 'draft', // Start as draft — admin activates manually
          entryTrigger: flow.entryTrigger,
          entryConditions: flow.entryConditions || [],
          steps,
          exitConditions: flow.exitConditions || [],
          allowReentry: flow.settings.allowReentry,
          maxEntriesPerUser: flow.settings.maxEntriesPerUser,
        },
      })

      result.flows.created++
    } catch (error) {
      const msg = `Flow "${flow.name}": ${error instanceof Error ? error.message : String(error)}`
      result.flows.errors.push(msg)
      console.error('[Seed]', msg)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 3. SEED SEGMENTS
  // ═══════════════════════════════════════════════════════════
  for (const segment of predefinedSegments) {
    try {
      // Check if already exists by slug
      const existing = await payload.find({
        collection: 'email-segments',
        where: { slug: { equals: segment.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        result.segments.skipped++
        continue
      }

      await payload.create({
        collection: 'email-segments',
        data: {
          title: segment.title,
          slug: segment.slug,
          description: segment.description,
          conditions: segment.conditions,
          conditionLogic: segment.conditionLogic,
          status: 'active',
        },
      })

      result.segments.created++
    } catch (error) {
      const msg = `Segment "${segment.title}": ${error instanceof Error ? error.message : String(error)}`
      result.segments.errors.push(msg)
      console.error('[Seed]', msg)
    }
  }

  return result
}

// Re-export types for external use
export { predefinedTemplates } from './templates'
export { predefinedFlows } from './flows'
export { predefinedSegments } from './segments'

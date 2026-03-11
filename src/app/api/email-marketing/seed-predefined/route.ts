import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { seedPredefinedContent } from '@/features/email-marketing/lib/predefined'

/**
 * POST /api/email-marketing/seed-predefined
 *
 * Seeds predefined email templates, automation flows, and segments.
 * Admin-only endpoint. Skips items that already exist.
 *
 * Returns counts of created/skipped items per category.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Alleen admins kunnen voorgedefinieerde content seeden' }, { status: 403 })
    }

    const result = await seedPredefinedContent(payload)

    const totalCreated = result.templates.created + result.flows.created + result.segments.created
    const totalSkipped = result.templates.skipped + result.flows.skipped + result.segments.skipped
    const totalErrors = result.templates.errors.length + result.flows.errors.length + result.segments.errors.length

    return NextResponse.json({
      success: true,
      message: `${totalCreated} items aangemaakt, ${totalSkipped} overgeslagen, ${totalErrors} fouten`,
      result,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error seeding predefined content:', error)
    return NextResponse.json(
      { error: 'Failed to seed predefined content', message },
      { status: 500 },
    )
  }
}

/**
 * GET /api/email-marketing/seed-predefined
 *
 * Returns the list of available predefined content (without seeding).
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Dynamic imports to get the predefined data
    const { predefinedTemplates } = await import('@/features/email-marketing/lib/predefined/templates')
    const { predefinedFlows } = await import('@/features/email-marketing/lib/predefined/flows')
    const { predefinedSegments } = await import('@/features/email-marketing/lib/predefined/segments')

    return NextResponse.json({
      success: true,
      available: {
        templates: predefinedTemplates.map((t) => ({ name: t.name, description: t.description, category: t.category })),
        flows: predefinedFlows.map((f) => ({ name: f.name, description: f.description, trigger: f.entryTrigger.eventType })),
        segments: predefinedSegments.map((s) => ({ title: s.title, slug: s.slug, description: s.description })),
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Failed to list predefined content', message }, { status: 500 })
  }
}

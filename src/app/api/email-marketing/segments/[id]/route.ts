/**
 * Segment CRUD API — Single segment
 * GET    /api/email-marketing/segments/:id — Get segment with subscribers
 * PATCH  /api/email-marketing/segments/:id — Update segment
 * DELETE /api/email-marketing/segments/:id — Delete segment
 *
 * Authentication: Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { countSegmentSubscribers, getSegmentSubscriberIds } from '@/features/email-marketing/lib/segmentation/condition-evaluator'
import { isAdmin, isSuperAdmin, isAdminOrEditor } from '@/access/utilities'
import type { SegmentDefinition } from '@/features/email-marketing/lib/segmentation/types'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    // Authenticate
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || (!isSuperAdmin(user) && !isAdmin(user) && !isAdminOrEditor(user))) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const segment = await payload.findByID({
      collection: 'email-segments',
      id: Number(id),
    })

    if (!segment) {
      return NextResponse.json({ error: 'Segment niet gevonden' }, { status: 404 })
    }

    // Optionally fetch matching subscriber IDs
    let subscriberIds: number[] = []
    const includeSubscribers = request.nextUrl.searchParams.get('includeSubscribers') === 'true'
    if (includeSubscribers) {
      try {
        const db = (payload.db as any).drizzle
        if (db) {
          const limit = Number(request.nextUrl.searchParams.get('limit') || 100)
          subscriberIds = await getSegmentSubscriberIds(db, segment.conditions as SegmentDefinition, limit)
        }
      } catch (e) {
        console.warn('[Segments API] Could not fetch subscriber IDs:', e)
      }
    }

    return NextResponse.json({
      segment,
      ...(includeSubscribers ? { subscriberIds } : {}),
    })
  } catch (error: unknown) {
    console.error('[Segments API] GET/:id error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: message || 'Fout bij ophalen segment' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    // Authenticate
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || (!isSuperAdmin(user) && !isAdmin(user) && !isAdminOrEditor(user))) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, description, conditions, conditionLogic, autoSync, status } = body

    // Recalculate subscriber count if conditions changed
    let subscriberCount: number | undefined
    if (conditions) {
      try {
        const db = (payload.db as any).drizzle
        const definition: SegmentDefinition = conditions
        if (db && definition.groups && definition.groups.length > 0) {
          subscriberCount = await countSegmentSubscribers(db, definition)
        } else {
          subscriberCount = 0
        }
      } catch (e) {
        console.warn('[Segments API] Could not recalculate subscriber count:', e)
      }
    }

    const updateData: Record<string, any> = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (conditions !== undefined) updateData.conditions = conditions
    if (conditionLogic !== undefined) updateData.conditionLogic = conditionLogic
    if (autoSync !== undefined) updateData.autoSync = autoSync
    if (status !== undefined) updateData.status = status
    if (subscriberCount !== undefined) {
      updateData.subscriberCount = subscriberCount
      updateData.lastCalculatedAt = new Date().toISOString()
    }

    const segment = await payload.update({
      collection: 'email-segments',
      id: Number(id),
      data: updateData,
    })

    return NextResponse.json({ segment })
  } catch (error: unknown) {
    console.error('[Segments API] PATCH/:id error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: message || 'Fout bij bijwerken segment' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    // Authenticate
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || (!isSuperAdmin(user) && !isAdmin(user))) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    await payload.delete({
      collection: 'email-segments',
      id: Number(id),
    })

    return NextResponse.json({ success: true, message: 'Segment verwijderd' })
  } catch (error: unknown) {
    console.error('[Segments API] DELETE/:id error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: message || 'Fout bij verwijderen segment' },
      { status: 500 },
    )
  }
}

export const dynamic = 'force-dynamic'

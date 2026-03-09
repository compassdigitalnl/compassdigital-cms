/**
 * Segment CRUD API
 * GET  /api/email-marketing/segments — List all segments with subscriber counts
 * POST /api/email-marketing/segments — Create new segment, auto-calculate subscriber count
 *
 * Authentication: Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { countSegmentSubscribers } from '@/features/email-marketing/lib/segmentation/condition-evaluator'
import { isAdmin, isSuperAdmin, isAdminOrEditor } from '@/access/utilities'
import type { SegmentDefinition } from '@/features/email-marketing/lib/segmentation/types'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Authenticate
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || (!isSuperAdmin(user) && !isAdmin(user) && !isAdminOrEditor(user))) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const segments = await payload.find({
      collection: 'email-segments',
      limit: 100,
      sort: '-updatedAt',
    })

    return NextResponse.json({
      segments: segments.docs,
      totalDocs: segments.totalDocs,
    })
  } catch (error: any) {
    console.error('[Segments API] GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Fout bij ophalen segmenten' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Authenticate
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || (!isSuperAdmin(user) && !isAdmin(user) && !isAdminOrEditor(user))) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, description, conditions, conditionLogic, autoSync, status } = body

    if (!title) {
      return NextResponse.json({ error: 'Titel is verplicht' }, { status: 400 })
    }

    // Auto-generate slug from title if not provided
    const segmentSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Calculate subscriber count
    let subscriberCount = 0
    const definition: SegmentDefinition = conditions || { logic: 'and', groups: [] }
    try {
      const db = (payload.db as any).drizzle
      if (db && definition.groups && definition.groups.length > 0) {
        subscriberCount = await countSegmentSubscribers(db, definition)
      }
    } catch (e) {
      console.warn('[Segments API] Could not calculate subscriber count:', e)
    }

    const segment = await payload.create({
      collection: 'email-segments',
      data: {
        title,
        slug: segmentSlug,
        description: description || '',
        conditions: definition,
        conditionLogic: conditionLogic || 'and',
        subscriberCount,
        lastCalculatedAt: new Date().toISOString(),
        autoSync: autoSync || false,
        status: status || 'active',
      },
    })

    return NextResponse.json({ segment }, { status: 201 })
  } catch (error: any) {
    console.error('[Segments API] POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Fout bij aanmaken segment' },
      { status: 500 },
    )
  }
}

export const dynamic = 'force-dynamic'

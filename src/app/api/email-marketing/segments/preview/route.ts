/**
 * Segment Preview API
 * POST /api/email-marketing/segments/preview
 *
 * Accepts a segment definition and returns the count of matching subscribers.
 * Used by the SegmentPreview component for live preview.
 *
 * Authentication: Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { countSegmentSubscribers } from '@/features/email-marketing/lib/segmentation/condition-evaluator'
import { isAdmin, isSuperAdmin, isAdminOrEditor } from '@/access/utilities'
import type { SegmentDefinition } from '@/features/email-marketing/lib/segmentation/types'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Authenticate — require admin user
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || (!isSuperAdmin(user) && !isAdmin(user) && !isAdminOrEditor(user))) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const body = await request.json()
    const conditions: SegmentDefinition = body.conditions

    if (!conditions || !conditions.groups || conditions.groups.length === 0) {
      return NextResponse.json({ count: 0 })
    }

    // Use drizzle adapter from payload to run raw SQL
    const db = (payload.db as any).drizzle
    if (!db) {
      return NextResponse.json({ error: 'Database niet beschikbaar' }, { status: 500 })
    }

    const count = await countSegmentSubscribers(db, conditions)

    return NextResponse.json({ count })
  } catch (error: unknown) {
    console.error('[Segments Preview API] Error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: message || 'Fout bij het berekenen van het segment' },
      { status: 500 },
    )
  }
}

export const dynamic = 'force-dynamic'

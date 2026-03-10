import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/content-approvals?status=pending&page=1&limit=20
 * List content approval requests (for admin dashboard)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    const where: Record<string, unknown> = {}
    if (status) {
      where.status = { equals: status }
    }

    const { docs, totalDocs, totalPages } = await payload.find({
      collection: 'content-approvals',
      where,
      sort: '-createdAt',
      page,
      limit,
      depth: 1,
    })

    // Count by status for dashboard
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      revisionRequested: 0,
    }

    const allDocs = await payload.find({
      collection: 'content-approvals',
      limit: 10000,
      depth: 0,
    })

    for (const doc of allDocs.docs) {
      if (doc.status === 'pending') counts.pending++
      else if (doc.status === 'approved') counts.approved++
      else if (doc.status === 'rejected') counts.rejected++
      else if (doc.status === 'revision-requested') counts.revisionRequested++
    }

    return NextResponse.json({
      success: true,
      docs,
      counts,
      pagination: { page, limit, totalDocs, totalPages },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching content approvals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approvals', message },
      { status: 500 },
    )
  }
}

/**
 * POST /api/content-approvals
 * Submit content for approval
 *
 * Body: { contentType, contentId, title, contentSlug?, submissionNote?, priority? }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.contentType || !body.contentId || !body.title) {
      return NextResponse.json(
        { error: 'contentType, contentId, and title are required' },
        { status: 400 },
      )
    }

    // Check for existing pending approval for the same content
    const existing = await payload.find({
      collection: 'content-approvals',
      where: {
        contentType: { equals: body.contentType },
        contentId: { equals: body.contentId },
        status: { equals: 'pending' },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Er is al een goedkeuringsverzoek in behandeling voor deze content' },
        { status: 409 },
      )
    }

    const doc = await payload.create({
      collection: 'content-approvals',
      data: {
        contentType: body.contentType,
        contentId: body.contentId,
        title: body.title,
        contentSlug: body.contentSlug || undefined,
        submittedBy: user.id,
        submissionNote: body.submissionNote || undefined,
        priority: body.priority || 'normal',
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, doc })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error submitting content approval:', error)
    return NextResponse.json(
      { error: 'Failed to submit approval', message },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/content-approvals
 * Update approval status (approve/reject/request revision)
 *
 * Body: { id, status, reviewNote? }
 */
export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Alleen admins kunnen goedkeuren/afwijzen' }, { status: 403 })
    }

    const body = await request.json()

    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: 'id and status are required' },
        { status: 400 },
      )
    }

    if (!['approved', 'rejected', 'revision-requested'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: approved, rejected, or revision-requested' },
        { status: 400 },
      )
    }

    const doc = await payload.update({
      collection: 'content-approvals',
      id: body.id,
      data: {
        status: body.status,
        reviewer: user.id,
        reviewNote: body.reviewNote || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      doc,
      message:
        body.status === 'approved'
          ? 'Content is goedgekeurd en gepubliceerd'
          : body.status === 'rejected'
            ? 'Content is afgewezen'
            : 'Revisie is aangevraagd',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error updating content approval:', error)
    return NextResponse.json(
      { error: 'Failed to update approval', message },
      { status: 500 },
    )
  }
}

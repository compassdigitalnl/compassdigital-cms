/**
 * Email Marketing Subscribers API
 *
 * External API for managing email subscribers
 * Requires API key authentication
 *
 * Endpoints:
 * - GET /api/v1/email-marketing/subscribers - List subscribers
 * - POST /api/v1/email-marketing/subscribers - Create subscriber
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireApiKey } from '@/lib/email/api-auth/validateApiKey'

/**
 * GET /api/v1/email-marketing/subscribers
 *
 * List subscribers for the authenticated tenant
 * Requires scope: subscribers:read
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Validate API key
    const validation = await requireApiKey(req, payload, 'subscribers:read')
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
          code: validation.errorCode,
        },
        { status: 401 },
      )
    }

    // Extract query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const status = searchParams.get('status')
    const listId = searchParams.get('list_id')

    // Build query with tenant isolation
    const where: any = {
      tenant: {
        equals: validation.apiKey!.tenant,
      },
    }

    if (status) {
      where.status = { equals: status }
    }

    if (listId) {
      where.lists = { contains: listId }
    }

    // Fetch subscribers
    const result = await payload.find({
      collection: 'email-subscribers',
      where,
      page,
      limit: Math.min(limit, 100), // Cap at 100 per page
      depth: 1,
    })

    return NextResponse.json({
      data: result.docs.map((doc) => ({
        id: doc.id,
        email: doc.email,
        name: doc.name,
        status: doc.status,
        lists: doc.lists,
        customFields: doc.customFields,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching subscribers:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/v1/email-marketing/subscribers
 *
 * Create a new subscriber
 * Requires scope: subscribers:create
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Validate API key
    const validation = await requireApiKey(req, payload, 'subscribers:create')
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
          code: validation.errorCode,
        },
        { status: 401 },
      )
    }

    // Parse request body
    const body = await req.json()

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        {
          error: 'Email is required',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 },
      )
    }

    if (!body.name) {
      return NextResponse.json(
        {
          error: 'Name is required',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 },
      )
    }

    // Check if subscriber already exists for this tenant
    const existing = await payload.find({
      collection: 'email-subscribers',
      where: {
        AND: [
          {
            tenant: {
              equals: validation.apiKey!.tenant,
            },
          },
          {
            email: {
              equals: body.email.toLowerCase(),
            },
          },
        ],
      },
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        {
          error: 'Subscriber with this email already exists',
          code: 'DUPLICATE_EMAIL',
          existingId: existing.docs[0].id,
        },
        { status: 409 },
      )
    }

    // Create subscriber with tenant isolation
    const subscriber = await payload.create({
      collection: 'email-subscribers',
      data: {
        email: body.email,
        name: body.name,
        status: body.status || 'enabled',
        lists: body.lists || [],
        customFields: body.customFields || {},
        source: 'api',
        tenant: validation.apiKey!.tenant as any,
        preferences: {
          marketingEmails: body.preferences?.marketingEmails ?? true,
          productUpdates: body.preferences?.productUpdates ?? true,
          newsletter: body.preferences?.newsletter ?? false,
        },
      },
    })

    return NextResponse.json(
      {
        data: {
          id: subscriber.id,
          email: subscriber.email,
          name: subscriber.name,
          status: subscriber.status,
          lists: subscriber.lists,
          customFields: subscriber.customFields,
          createdAt: subscriber.createdAt,
        },
        message: 'Subscriber created successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[API] Error creating subscriber:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    )
  }
}

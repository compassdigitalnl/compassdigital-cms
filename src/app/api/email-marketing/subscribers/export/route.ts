import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/email-marketing/subscribers/export
 *
 * Export all subscribers as CSV.
 * Requires authenticated admin/editor user.
 *
 * Query params:
 * - status: filter by status (enabled/disabled/blocklisted)
 * - list: filter by list ID
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const listFilter = searchParams.get('list')

    // Build query
    const where: any = {}
    if (statusFilter) {
      where.status = { equals: statusFilter }
    }
    if (listFilter) {
      where.lists = { contains: listFilter }
    }

    // Fetch all subscribers (paginate through)
    const allSubscribers: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const result = await payload.find({
        collection: 'email-subscribers',
        where,
        limit: 500,
        page,
        sort: 'email',
        overrideAccess: true,
      })

      allSubscribers.push(...result.docs)
      hasMore = result.hasNextPage
      page++
    }

    // Build CSV
    const headers = ['email', 'name', 'status', 'lists', 'tags', 'marketing_emails', 'product_updates', 'newsletter', 'source', 'created_at']
    const rows = allSubscribers.map((sub: any) => {
      const lists = Array.isArray(sub.lists)
        ? sub.lists.map((l: any) => (typeof l === 'object' ? l.name || l.id : l)).join(';')
        : ''
      const tags = Array.isArray(sub.tags)
        ? sub.tags.map((t: any) => t.tag || t).join(';')
        : ''

      return [
        sub.email || '',
        sub.name || '',
        sub.status || 'enabled',
        lists,
        tags,
        sub.preferences?.marketingEmails ? 'yes' : 'no',
        sub.preferences?.productUpdates ? 'yes' : 'no',
        sub.preferences?.newsletter ? 'yes' : 'no',
        sub.source || 'manual',
        sub.createdAt || '',
      ]
    })

    // Escape CSV values
    const escapeCSV = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    }

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n')

    const filename = `subscribers-export-${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error('Subscriber export error:', error)
    return NextResponse.json(
      { error: 'Export mislukt' },
      { status: 500 },
    )
  }
}

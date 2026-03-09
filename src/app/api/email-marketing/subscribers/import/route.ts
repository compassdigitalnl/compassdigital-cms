import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * POST /api/email-marketing/subscribers/import
 *
 * Import subscribers from parsed CSV data.
 * Requires authenticated admin/editor user.
 *
 * Body: {
 *   subscribers: Array<{
 *     email: string
 *     name: string
 *     status?: string
 *     lists?: string[]  (list IDs)
 *     tags?: string[]
 *     preferences?: { marketingEmails?: boolean, productUpdates?: boolean, newsletter?: boolean }
 *   }>,
 *   skipDuplicates?: boolean  (default: true)
 *   defaultStatus?: string    (default: 'enabled')
 *   defaultLists?: string[]   (list IDs to add all imports to)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const body = await request.json()
    const {
      subscribers = [],
      skipDuplicates = true,
      defaultStatus = 'enabled',
      defaultLists = [],
    } = body

    if (!Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'Geen subscribers gevonden in de data' },
        { status: 400 },
      )
    }

    // Limit import size
    if (subscribers.length > 10000) {
      return NextResponse.json(
        { error: 'Maximum 10.000 subscribers per import' },
        { status: 400 },
      )
    }

    const results = {
      total: subscribers.length,
      created: 0,
      skipped: 0,
      errors: [] as Array<{ email: string; error: string }>,
    }

    // Get existing emails for duplicate check
    const existingEmails = new Set<string>()
    if (skipDuplicates) {
      let page = 1
      let hasMore = true
      while (hasMore) {
        const existing = await payload.find({
          collection: 'email-subscribers',
          limit: 500,
          page,
          overrideAccess: true,
        })
        existing.docs.forEach((doc: any) => {
          existingEmails.add(doc.email?.toLowerCase())
        })
        hasMore = existing.hasNextPage
        page++
      }
    }

    // Process each subscriber
    for (const sub of subscribers) {
      try {
        // Validate email
        if (!sub.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sub.email)) {
          results.errors.push({ email: sub.email || '(leeg)', error: 'Ongeldig e-mailadres' })
          continue
        }

        const email = sub.email.toLowerCase().trim()

        // Skip duplicates
        if (skipDuplicates && existingEmails.has(email)) {
          results.skipped++
          continue
        }

        // Merge lists
        const lists = [...(sub.lists || []), ...defaultLists].filter(Boolean)

        // Build tags array
        const tags = Array.isArray(sub.tags)
          ? sub.tags.map((tag: string) => ({ tag: tag.trim() }))
          : []

        await payload.create({
          collection: 'email-subscribers',
          data: {
            email,
            name: sub.name?.trim() || email.split('@')[0],
            status: sub.status || defaultStatus,
            lists: lists.length > 0 ? lists : undefined,
            tags: tags.length > 0 ? tags : undefined,
            source: 'import',
            preferences: {
              marketingEmails: sub.preferences?.marketingEmails ?? true,
              productUpdates: sub.preferences?.productUpdates ?? true,
              newsletter: sub.preferences?.newsletter ?? false,
            },
          } as any,
          overrideAccess: true,
        })

        existingEmails.add(email)
        results.created++
      } catch (err: any) {
        results.errors.push({
          email: sub.email || '(onbekend)',
          error: err.message || 'Onbekende fout',
        })
      }
    }

    console.log(`📥 Subscriber import: ${results.created} created, ${results.skipped} skipped, ${results.errors.length} errors`)

    return NextResponse.json({
      success: true,
      results,
      message: `${results.created} subscribers geïmporteerd${results.skipped > 0 ? `, ${results.skipped} duplicaten overgeslagen` : ''}${results.errors.length > 0 ? `, ${results.errors.length} fouten` : ''}.`,
    })
  } catch (error: any) {
    console.error('Subscriber import error:', error)
    return NextResponse.json(
      { error: 'Import mislukt' },
      { status: 500 },
    )
  }
}

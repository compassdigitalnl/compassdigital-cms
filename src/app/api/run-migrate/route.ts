import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Temporary endpoint to run Payload migrations on server
 * DELETE after running!
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')

  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, any> = { steps: [] }

  try {
    const payload = await getPayload({ config })
    results.steps.push('Payload initialized')

    // Run migrations
    await payload.db.migrate()
    results.steps.push('Migrations completed')
    results.success = true

  } catch (e: any) {
    results.error = e.message
    results.stack = e.stack?.split('\n').slice(0, 8).join('\n')
    results.success = false
  }

  return NextResponse.json(results)
}

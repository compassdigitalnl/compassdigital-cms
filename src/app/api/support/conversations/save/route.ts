import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/support/conversations/save
 * Save a chatbot conversation (fire-and-forget from client)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Auth is optional — anonymous conversations are allowed
    let userId: string | number | undefined
    try {
      const { user } = await payload.auth({ headers: request.headers })
      userId = user?.id
    } catch {
      // Anonymous — no user
    }

    const body = await request.json()
    const { sessionId, messages, metadata } = body

    if (!sessionId || !messages?.length) {
      return NextResponse.json({ error: 'sessionId and messages are required' }, { status: 400 })
    }

    // Upsert: update if exists, create if not
    const existing = await payload.find({
      collection: 'chat-conversations',
      where: { sessionId: { equals: sessionId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'chat-conversations',
        id: existing.docs[0].id,
        data: {
          messages,
          ...(metadata ? { metadata } : {}),
          ...(userId ? { customer: userId } : {}),
        },
      })
    } else {
      await payload.create({
        collection: 'chat-conversations',
        data: {
          sessionId,
          messages,
          status: 'active',
          ...(metadata ? { metadata } : {}),
          ...(userId ? { customer: userId } : {}),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error saving conversation:', error)
    return NextResponse.json({ error: 'Failed to save conversation', message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'
import { sendPushToUser, sendPushToAll } from '@/features/pwa/lib/push-service'
import type { NotificationPayload } from '@/features/pwa/lib/push-types'

/**
 * POST /api/pwa/send
 *
 * Verstuurt push notificaties naar gebruikers.
 * Alleen toegankelijk voor admins.
 *
 * Body:
 * - title: string (verplicht) — Titel van de notificatie
 * - body: string (verplicht) — Berichttekst
 * - url?: string — URL om te openen bij klik
 * - userId?: number — Specifieke gebruiker (optioneel, anders broadcast)
 * - tag?: string — Tag voor notificatie-groepering
 * - icon?: string — URL naar icoon afbeelding
 * - badge?: string — URL naar badge afbeelding
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Authenticatie: alleen admins
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || !checkRole(['admin'], user)) {
      return NextResponse.json(
        { error: 'Alleen beheerders kunnen push notificaties versturen' },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { title, body: messageBody, url, userId, tag, icon, badge } = body

    // Validatie
    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'title en body zijn verplicht' },
        { status: 400 },
      )
    }

    // Bouw de notificatie payload
    const notificationPayload: NotificationPayload = {
      title,
      body: messageBody,
    }
    if (url) notificationPayload.url = url
    if (tag) notificationPayload.tag = tag
    if (icon) notificationPayload.icon = icon
    if (badge) notificationPayload.badge = badge

    // Verzend naar specifieke gebruiker of iedereen
    let result: { sent: number; failed: number }

    if (userId) {
      const targetUserId = typeof userId === 'number' ? userId : parseInt(String(userId), 10)
      result = await sendPushToUser(targetUserId, notificationPayload)
    } else {
      result = await sendPushToAll(notificationPayload)
    }

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
    })
  } catch (error: unknown) {
    console.error('[pwa/send] Fout bij versturen push notificaties:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Versturen push notificaties mislukt', message },
      { status: 500 },
    )
  }
}

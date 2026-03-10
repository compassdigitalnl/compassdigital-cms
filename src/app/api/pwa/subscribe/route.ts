import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/pwa/subscribe
 *
 * Slaat een push notificatie abonnement op in de database.
 * Als de endpoint al bestaat, wordt het bestaande record bijgewerkt (upsert).
 * Optioneel wordt de ingelogde gebruiker gekoppeld.
 *
 * Body: { endpoint: string, keys: { p256dh: string, auth: string }, userAgent?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await request.json()

    const { endpoint, keys, userAgent } = body

    // Validatie
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: 'endpoint, keys.p256dh en keys.auth zijn verplicht' },
        { status: 400 },
      )
    }

    // Probeer de ingelogde gebruiker op te halen (optioneel)
    let userId: number | undefined
    try {
      const { user } = await payload.auth({ headers: request.headers })
      if (user) {
        userId = typeof user.id === 'number' ? user.id : parseInt(String(user.id), 10)
      }
    } catch {
      // Niet ingelogd — geen probleem, sla op zonder gebruiker
    }

    // Check of er al een abonnement bestaat met deze endpoint
    const { docs: existing } = await payload.find({
      collection: 'push-subscriptions' as any,
      where: { endpoint: { equals: endpoint } },
      limit: 1,
      depth: 0,
    })

    if (existing.length > 0) {
      // Update bestaand abonnement
      const updateData: any = {
        p256dh: keys.p256dh,
        auth: keys.auth,
        active: true,
      }
      if (userAgent) updateData.userAgent = userAgent
      if (userId) updateData.user = userId

      await payload.update({
        collection: 'push-subscriptions' as any,
        id: existing[0].id,
        data: updateData,
      })

      return NextResponse.json({ success: true, action: 'updated' })
    }

    // Nieuw abonnement aanmaken
    const createData: any = {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      active: true,
    }
    if (userAgent) createData.userAgent = userAgent
    if (userId) createData.user = userId

    await payload.create({
      collection: 'push-subscriptions' as any,
      data: createData,
    })

    return NextResponse.json({ success: true, action: 'created' })
  } catch (error: unknown) {
    console.error('[pwa/subscribe] Fout bij opslaan push abonnement:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Opslaan push abonnement mislukt', message },
      { status: 500 },
    )
  }
}

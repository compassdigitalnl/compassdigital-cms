/**
 * Push Notification Service (Server-side)
 *
 * Uses the web-push library to send push notifications via VAPID.
 * Handles subscription management, expired subscription cleanup,
 * and bulk delivery to users or all subscribers.
 */

import webPush from 'web-push'
import type { PushSubscriptionData, NotificationPayload } from './push-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// ─── VAPID Configuration ────────────────────────────────────────────

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:info@compassdigital.nl'

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
}

// ─── Single Subscription Push ────────────────────────────────────────

/**
 * Send a push notification to a single subscription.
 * Returns true if the notification was delivered successfully.
 */
export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: NotificationPayload,
): Promise<boolean> {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.warn('[push-service] VAPID keys not configured, skipping push')
    return false
  }

  try {
    await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      },
      JSON.stringify(payload),
      {
        TTL: 60 * 60, // 1 hour
        urgency: 'normal',
      },
    )
    return true
  } catch (error: unknown) {
    // 410 Gone or 404 Not Found means the subscription has expired
    if ((error as any)?.statusCode === 410 || (error as any)?.statusCode === 404) {
      await removeExpiredSubscription(subscription.endpoint)
    } else {
      const message = error instanceof Error ? error.message : String(error)
      console.error('[push-service] Failed to send push notification:', message)
    }
    return false
  }
}

// ─── Per-User Push ───────────────────────────────────────────────────

/**
 * Send a push notification to all subscriptions belonging to a specific user.
 * Returns counts of successfully sent and failed deliveries.
 */
export async function sendPushToUser(
  userId: number,
  payload: NotificationPayload,
): Promise<{ sent: number; failed: number }> {
  const payloadCMS = await getPayload({ config: configPromise })

  const { docs: subscriptions } = await payloadCMS.find({
    collection: 'push-subscriptions' as any,
    where: {
      and: [
        { user: { equals: userId } },
        { active: { equals: true } },
      ],
    },
    limit: 100,
    depth: 0,
  })

  let sent = 0
  let failed = 0

  for (const sub of subscriptions) {
    const subscriptionData: PushSubscriptionData = {
      endpoint: (sub as any).endpoint,
      keys: {
        p256dh: (sub as any).p256dh,
        auth: (sub as any).auth,
      },
    }

    const success = await sendPushNotification(subscriptionData, payload)

    if (success) {
      sent++
      // Update lastUsed timestamp
      await payloadCMS.update({
        collection: 'push-subscriptions' as any,
        id: sub.id,
        data: { lastUsed: new Date().toISOString() } as any,
      }).catch(() => {})
    } else {
      failed++
    }
  }

  return { sent, failed }
}

// ─── Broadcast Push ──────────────────────────────────────────────────

/**
 * Send a push notification to ALL active subscriptions.
 * Processes in batches to avoid overwhelming the push service.
 */
export async function sendPushToAll(
  payload: NotificationPayload,
): Promise<{ sent: number; failed: number }> {
  const payloadCMS = await getPayload({ config: configPromise })

  let sent = 0
  let failed = 0
  let page = 1
  const limit = 100
  let hasMore = true

  while (hasMore) {
    const { docs: subscriptions, hasNextPage } = await payloadCMS.find({
      collection: 'push-subscriptions' as any,
      where: { active: { equals: true } },
      limit,
      page,
      depth: 0,
    })

    // Send in parallel per batch (max 10 concurrent)
    const batchSize = 10
    for (let i = 0; i < subscriptions.length; i += batchSize) {
      const batch = subscriptions.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map(async (sub) => {
          const subscriptionData: PushSubscriptionData = {
            endpoint: (sub as any).endpoint,
            keys: {
              p256dh: (sub as any).p256dh,
              auth: (sub as any).auth,
            },
          }

          const success = await sendPushNotification(subscriptionData, payload)

          if (success) {
            await payloadCMS.update({
              collection: 'push-subscriptions' as any,
              id: sub.id,
              data: { lastUsed: new Date().toISOString() } as any,
            }).catch(() => {})
          }

          return success
        }),
      )

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          sent++
        } else {
          failed++
        }
      }
    }

    hasMore = hasNextPage
    page++
  }

  return { sent, failed }
}

// ─── Cleanup Helpers ─────────────────────────────────────────────────

/**
 * Remove an expired/invalid subscription from the database.
 * Called automatically when a push delivery returns 410 Gone.
 */
async function removeExpiredSubscription(endpoint: string): Promise<void> {
  try {
    const payloadCMS = await getPayload({ config: configPromise })

    const { docs } = await payloadCMS.find({
      collection: 'push-subscriptions' as any,
      where: { endpoint: { equals: endpoint } },
      limit: 1,
      depth: 0,
    })

    if (docs.length > 0) {
      await payloadCMS.update({
        collection: 'push-subscriptions' as any,
        id: docs[0].id,
        data: { active: false } as any,
      })
      console.info(`[push-service] Deactivated expired subscription: ${endpoint.substring(0, 60)}...`)
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[push-service] Failed to deactivate expired subscription:', message)
  }
}

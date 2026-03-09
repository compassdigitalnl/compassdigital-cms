/**
 * Uptime Alerter
 *
 * Sends alerts (email + optional Slack) when sites go down or recover.
 */

import { markAlertSent, type UptimeIncident } from './incident-detector'

interface AlertPayload {
  type: 'down' | 'recovered'
  incident: UptimeIncident
}

/**
 * Send downtime alert
 */
export async function sendDownAlert(drizzle: any, incident: UptimeIncident): Promise<void> {
  console.log(`🚨 ALERT: ${incident.clientName} is DOWN (${incident.failureCount} failures)`)

  await sendAlertNotifications({
    type: 'down',
    incident,
  })

  await markAlertSent(drizzle, incident.id)
}

/**
 * Send recovery alert
 */
export async function sendRecoveryAlert(incident: UptimeIncident): Promise<void> {
  console.log(`✅ RECOVERED: ${incident.clientName} is back up`)

  await sendAlertNotifications({
    type: 'recovered',
    incident,
  })
}

/**
 * Send notifications via email + Slack
 */
async function sendAlertNotifications(alert: AlertPayload): Promise<void> {
  const promises: Promise<void>[] = []

  // Email alert
  promises.push(sendEmailAlert(alert))

  // Slack webhook (if configured)
  const slackWebhook = process.env.SLACK_WEBHOOK_URL
  if (slackWebhook) {
    promises.push(sendSlackAlert(alert, slackWebhook))
  }

  await Promise.allSettled(promises)
}

/**
 * Send email alert via Resend
 */
async function sendEmailAlert(alert: AlertPayload): Promise<void> {
  try {
    const alertEmail = process.env.ALERT_EMAIL || process.env.ADMIN_EMAIL
    if (!alertEmail) {
      console.warn('[Alerter] No ALERT_EMAIL or ADMIN_EMAIL configured')
      return
    }

    const { sendAlertEmail } = await import('@/features/platform/integrations/resend')

    const isDown = alert.type === 'down'
    const subject = isDown
      ? `🚨 ${alert.incident.clientName} is DOWN`
      : `✅ ${alert.incident.clientName} recovered`

    const issue = isDown
      ? `Site unreachable after ${alert.incident.failureCount} consecutive failures. Error: ${alert.incident.lastError || 'Unknown'}`
      : `Site is back online. Downtime: ~${Math.round(alert.incident.durationMinutes || 0)} minutes`

    await sendAlertEmail({
      clientId: alert.incident.clientId,
      clientName: alert.incident.clientName,
      issue,
      severity: isDown ? 'critical' : 'warning',
      deploymentUrl: alert.incident.deploymentUrl,
    })
  } catch (err: any) {
    console.error('[Alerter] Email failed:', err.message)
  }
}

/**
 * Send Slack webhook alert
 */
async function sendSlackAlert(alert: AlertPayload, webhookUrl: string): Promise<void> {
  try {
    const isDown = alert.type === 'down'
    const emoji = isDown ? ':rotating_light:' : ':white_check_mark:'
    const color = isDown ? '#dc2626' : '#16a34a'

    const payload = {
      attachments: [
        {
          color,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `${emoji} *${alert.incident.clientName}* ${isDown ? 'is DOWN' : 'has RECOVERED'}`,
              },
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*URL:*\n${alert.incident.deploymentUrl || 'N/A'}`,
                },
                {
                  type: 'mrkdwn',
                  text: isDown
                    ? `*Failures:*\n${alert.incident.failureCount} consecutive`
                    : `*Downtime:*\n~${Math.round(alert.incident.durationMinutes || 0)} min`,
                },
              ],
            },
          ],
        },
      ],
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err: any) {
    console.error('[Alerter] Slack failed:', err.message)
  }
}

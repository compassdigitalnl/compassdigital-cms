/**
 * Resend Email Integration
 * Sends transactional emails (welcome, alerts, etc.)
 */

/**
 * Send welcome email to new client admin
 */
export async function sendWelcomeEmail(data: {
  to: string
  clientName: string
  adminUrl: string
  email: string
  password: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'platform@yourplatform.com'

  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping welcome email')
    return
  }

  try {
    console.log(`[Email] Sending welcome email to ${data.to}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: data.to,
        subject: `Welcome to ${data.clientName} - Your Site is Ready!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to ${data.clientName}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h1 style="color: #2563eb; margin-top: 0;">🎉 Your Site is Ready!</h1>

                <p>Hi there,</p>

                <p>Great news! Your new site <strong>${data.clientName}</strong> has been successfully deployed and is now live.</p>

                <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <h2 style="margin-top: 0; font-size: 18px; color: #1f2937;">Admin Login Details</h2>

                  <p style="margin: 10px 0;"><strong>Admin URL:</strong><br>
                  <a href="${data.adminUrl}" style="color: #2563eb; text-decoration: none;">${data.adminUrl}</a></p>

                  <p style="margin: 10px 0;"><strong>Email:</strong><br>${data.email}</p>

                  <p style="margin: 10px 0;"><strong>Temporary Password:</strong><br>
                  <code style="background-color: #f3f4f6; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${data.password}</code></p>

                  <p style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 3px;">
                    <strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.
                  </p>
                </div>

                <div style="margin: 30px 0;">
                  <a href="${data.adminUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Go to Admin Panel →
                  </a>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <h3 style="font-size: 16px; color: #1f2937;">Need Help?</h3>
                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>

                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Best regards,<br>
                  The Platform Team
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Resend API error: ${error}`)
    }

    const result = await res.json()
    console.log(`[Email] Welcome email sent successfully (ID: ${result.id})`)
  } catch (error: any) {
    console.error('[Email] Error sending welcome email:', error)
    // Don't throw - email failure shouldn't block provisioning
  }
}

/**
 * Send alert email for critical issues
 */
export async function sendAlertEmail(data: {
  clientId: string
  clientName: string
  issue: string
  severity: 'warning' | 'critical'
  deploymentUrl?: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'alerts@yourplatform.com'
  const adminEmail = process.env.PLATFORM_ADMIN_EMAIL

  if (!apiKey || !adminEmail) {
    console.warn('[Email] Email not configured, skipping alert email')
    return
  }

  try {
    console.log(`[Email] Sending ${data.severity} alert for ${data.clientName}`)

    const severityColor = data.severity === 'critical' ? '#dc2626' : '#f59e0b'
    const severityIcon = data.severity === 'critical' ? '🔴' : '🟡'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `[${data.severity.toUpperCase()}] ${data.clientName} - ${data.issue}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Alert: ${data.clientName}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h1 style="color: ${severityColor}; margin-top: 0;">${severityIcon} ${data.severity.toUpperCase()} Alert</h1>

                <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <h2 style="margin-top: 0; font-size: 18px; color: #1f2937;">Client Information</h2>

                  <p style="margin: 10px 0;"><strong>Client:</strong> ${data.clientName}</p>
                  <p style="margin: 10px 0;"><strong>Client ID:</strong> ${data.clientId}</p>
                  ${data.deploymentUrl ? `<p style="margin: 10px 0;"><strong>URL:</strong> <a href="${data.deploymentUrl}" style="color: #2563eb;">${data.deploymentUrl}</a></p>` : ''}

                  <div style="margin-top: 20px; padding: 15px; background-color: ${data.severity === 'critical' ? '#fef2f2' : '#fef3c7'}; border-left: 4px solid ${severityColor}; border-radius: 3px;">
                    <strong>Issue:</strong><br>${data.issue}
                  </div>
                </div>

                <div style="margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_SERVER_URL || ''}/platform/clients/${data.clientId}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    View Client Details →
                  </a>
                </div>

                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Time: ${new Date().toISOString()}<br>
                  This is an automated alert from the platform monitoring system.
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Resend API error: ${error}`)
    }

    const result = await res.json()
    console.log(`[Email] Alert email sent successfully (ID: ${result.id})`)
  } catch (error: any) {
    console.error('[Email] Error sending alert email:', error)
  }
}

/**
 * Generate secure password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}

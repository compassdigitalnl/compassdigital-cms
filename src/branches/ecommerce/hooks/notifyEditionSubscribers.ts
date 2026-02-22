import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/lib/email/EmailService'

/**
 * Product AfterChange Hook: Notify Edition Subscribers
 *
 * When a new product is published with a magazineTitle,
 * notify all users who subscribed to that magazine.
 *
 * Feature: Aboland Magazine Notifications
 */
export const notifyEditionSubscribers: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only notify on NEW products being published
  if (operation !== 'create') return doc
  if (doc.status !== 'published') return doc
  if (!doc.magazineTitle) return doc

  const { payload } = req

  try {
    // Find all active subscribers for this magazine
    const subscribers = await payload.find({
      collection: 'edition-notifications',
      where: {
        magazineTitle: { equals: doc.magazineTitle },
        active: { equals: true },
      },
      limit: 1000,
    })

    if (subscribers.docs.length === 0) {
      console.log(`[EditionNotify] No subscribers for "${doc.magazineTitle}"`)
      return doc
    }

    // Check if email service is configured
    if (!emailService.isConfigured()) {
      console.warn('[EditionNotify] Email service not configured - skipping notifications')
      return doc
    }

    const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://aboland01.compassdigital.nl'
    let successCount = 0
    let errorCount = 0

    // Send email to each subscriber
    for (const sub of subscribers.docs) {
      try {
        const result = await emailService.send({
          to: sub.email,
          subject: `Nieuwe editie: ${doc.title} nu beschikbaar!`,
          html: generateEditionEmail(doc, siteUrl),
        })

        if (result.success) {
          successCount++

          // Update lastNotified timestamp
          await payload.update({
            collection: 'edition-notifications',
            id: sub.id,
            data: { lastNotified: new Date().toISOString() },
          })
        } else {
          errorCount++
          console.error(`[EditionNotify] Failed to email ${sub.email}:`, result.error)
        }
      } catch (err) {
        errorCount++
        console.error(`[EditionNotify] Error sending to ${sub.email}:`, err)
      }
    }

    console.log(
      `[EditionNotify] Sent ${successCount} notifications for "${doc.magazineTitle}" (${errorCount} errors)`,
    )
  } catch (err) {
    console.error('[EditionNotify] Hook error:', err)
  }

  return doc
}

/**
 * Generate HTML email for new edition notification
 */
function generateEditionEmail(product: any, siteUrl: string): string {
  const productUrl = `${siteUrl}/shop/${product.slug}`
  const price = product.salePrice || product.price
  const formattedPrice = price ? `€${price.toFixed(2).replace('.', ',')}` : 'Prijs op aanvraag'

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuwe editie beschikbaar</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #0A1628;
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
    }
    .container {
      background: #ffffff;
    }
    .header {
      background: var(--color-primary, #018360);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #0A1628;
      margin-top: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content p {
      color: #475569;
      font-size: 16px;
      line-height: 1.6;
    }
    .product-info {
      background: #f8faf9;
      border-left: 4px solid var(--color-primary, #018360);
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
    }
    .product-title {
      font-size: 20px;
      font-weight: 700;
      color: #0A1628;
      margin: 0 0 10px 0;
    }
    .product-description {
      color: #64748b;
      font-size: 14px;
      margin: 0 0 15px 0;
    }
    .price {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-primary, #018360);
      margin: 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: var(--color-primary, #018360);
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
      transition: background 0.2s;
    }
    .cta-button:hover {
      background: #016849;
    }
    .footer {
      background: #f8faf9;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      font-size: 13px;
      color: #94a3b8;
      margin: 5px 0;
    }
    .footer a {
      color: var(--color-primary, #018360);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📰 Nieuwe Editie Beschikbaar!</h1>
    </div>

    <div class="content">
      <h2>Goed nieuws!</h2>
      <p>
        De nieuwe editie van <strong>${escapeHtml(product.magazineTitle || 'uw favoriete tijdschrift')}</strong>
        is nu beschikbaar in onze webshop.
      </p>

      <div class="product-info">
        <div class="product-title">${escapeHtml(product.title)}</div>
        ${product.shortDescription ? `<div class="product-description">${escapeHtml(product.shortDescription)}</div>` : ''}
        <div class="price">${formattedPrice}</div>
      </div>

      <p>Bestel nu en ontvang uw editie snel thuis!</p>

      <center>
        <a href="${productUrl}" class="cta-button">
          Bekijk & Bestel →
        </a>
      </center>
    </div>

    <div class="footer">
      <p>Je ontvangt deze email omdat je notificaties hebt ingeschakeld voor ${escapeHtml(product.magazineTitle || 'dit tijdschrift')}.</p>
      <p>Aboland | De Trompet 1739, 1967 DB Heemskerk</p>
      <p><a href="${siteUrl}">Bezoek onze webshop</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  if (!text) return ''
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return String(text).replace(/[&<>"']/g, (m) => map[m])
}

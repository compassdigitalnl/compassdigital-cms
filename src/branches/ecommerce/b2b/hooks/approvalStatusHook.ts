import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/features/email-marketing/lib/EmailService'

/**
 * Approval Status Hook
 *
 * Payload CMS afterChange hook on ApprovalRequests collection.
 * Detects status changes and triggers actions + emails:
 *
 * Trigger map:
 *   pending  → Email to approver(s) (new approval request)
 *   approved → Email to requester (approved)
 *   rejected → Email to requester with reason (rejected)
 */

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function getSiteName(): string {
  return process.env.SITE_NAME || 'Webshop'
}

function formatCurrency(amount: number): string {
  return `€ ${amount.toFixed(2).replace('.', ',')}`
}

function emailWrapper(title: string, headerColor: string, bodyContent: string): string {
  const siteName = escapeHtml(getSiteName())
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: ${headerColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${siteName}</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    ${bodyContent}
  </div>
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${siteName}</p>
  </div>
</body>
</html>`.trim()
}

export const approvalStatusHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // On create, notify approver(s)
  if (operation === 'create') {
    try {
      // Find company owner/admins to notify
      const companyOwnerId = typeof doc.companyOwner === 'object' ? doc.companyOwner.id : doc.companyOwner
      if (!companyOwnerId) return doc

      const owner = await req.payload.findByID({ collection: 'users', id: companyOwnerId })

      // Get requester name
      const requesterId = typeof doc.requestedBy === 'object' ? doc.requestedBy.id : doc.requestedBy
      let requesterName = 'Teamlid'
      if (requesterId) {
        try {
          const requester = await req.payload.findByID({ collection: 'users', id: requesterId })
          requesterName = (requester as any).name || requester.email
        } catch { /* skip */ }
      }

      const body = `
        <h2 style="color: #1e293b; margin: 0 0 16px;">Goedkeuring gevraagd</h2>
        <p><strong>${escapeHtml(requesterName)}</strong> heeft een bestelling ter goedkeuring ingediend.</p>
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px;"><strong>Referentie:</strong> ${escapeHtml(doc.orderReference || '-')}</p>
          <p style="margin: 0;"><strong>Bedrag:</strong> ${formatCurrency(doc.totalAmount || 0)}</p>
        </div>
        <p>Ga naar je account om de bestelling goed te keuren of af te wijzen.</p>
      `

      await emailService.send({
        to: owner.email,
        subject: `${getSiteName()} — Goedkeuring gevraagd: ${doc.orderReference}`,
        html: emailWrapper('Goedkeuring gevraagd', '#f59e0b', body),
      })
      console.log(`[approvalStatusHook] Approval request email sent to ${owner.email}`)
    } catch (error) {
      console.error(`[approvalStatusHook] Failed to send approval request email:`, error)
    }
    return doc
  }

  // On update, check for status changes
  if (operation !== 'update') return doc
  if (!newStatus || newStatus === oldStatus) return doc

  // Get requester email
  const requesterId = typeof doc.requestedBy === 'object' ? doc.requestedBy.id : doc.requestedBy
  if (!requesterId) return doc

  let requesterEmail: string | undefined
  try {
    const requester = await req.payload.findByID({ collection: 'users', id: requesterId })
    requesterEmail = requester.email
  } catch {
    console.warn(`[approvalStatusHook] Could not find requester ${requesterId}`)
    return doc
  }

  if (!requesterEmail) return doc

  // Get approver name
  let approverName = 'Beheerder'
  if (doc.approver) {
    try {
      const approverId = typeof doc.approver === 'object' ? doc.approver.id : doc.approver
      const approver = await req.payload.findByID({ collection: 'users', id: approverId })
      approverName = (approver as any).name || approver.email
    } catch { /* skip */ }
  }

  if (newStatus === 'approved') {
    const body = `
      <h2 style="color: #1e293b; margin: 0 0 16px;">Bestelling goedgekeurd</h2>
      <p>Je bestelling <strong>${escapeHtml(doc.orderReference || '')}</strong> is goedgekeurd door <strong>${escapeHtml(approverName)}</strong>.</p>
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px;"><strong>Bedrag:</strong> ${formatCurrency(doc.totalAmount || 0)}</p>
        <p style="margin: 0;">Je bestelling wordt nu verwerkt.</p>
      </div>
    `

    try {
      await emailService.send({
        to: requesterEmail,
        subject: `${getSiteName()} — Bestelling ${doc.orderReference} goedgekeurd`,
        html: emailWrapper('Bestelling goedgekeurd', '#22c55e', body),
      })
      console.log(`[approvalStatusHook] Approval approved email sent to ${requesterEmail}`)
    } catch (error) {
      console.error(`[approvalStatusHook] Failed to send approved email:`, error)
    }
  }

  if (newStatus === 'rejected') {
    const body = `
      <h2 style="color: #1e293b; margin: 0 0 16px;">Bestelling afgewezen</h2>
      <p>Je bestelling <strong>${escapeHtml(doc.orderReference || '')}</strong> is afgewezen door <strong>${escapeHtml(approverName)}</strong>.</p>
      ${doc.reviewNote ? `
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0;"><strong>Reden:</strong> ${escapeHtml(doc.reviewNote)}</p>
      </div>
      ` : ''}
      <p>Neem contact op met je beheerder als je vragen hebt.</p>
    `

    try {
      await emailService.send({
        to: requesterEmail,
        subject: `${getSiteName()} — Bestelling ${doc.orderReference} afgewezen`,
        html: emailWrapper('Bestelling afgewezen', '#ef4444', body),
      })
      console.log(`[approvalStatusHook] Approval rejected email sent to ${requesterEmail}`)
    } catch (error) {
      console.error(`[approvalStatusHook] Failed to send rejected email:`, error)
    }
  }

  return doc
}

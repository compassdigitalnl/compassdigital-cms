import type { CollectionConfig } from 'payload'
import type { CollectionAfterChangeHook } from 'payload'
import { checkRole } from '@/access/utilities'

const sendInviteEmail: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const inviteEmail = doc.email
  if (!inviteEmail) return doc

  try {
    const { emailService } = await import('@/features/email-marketing/lib/EmailService')
    if (!emailService.isConfigured()) return doc

    // Get inviter name
    let inviterName = 'Een beheerder'
    if (doc.invitedBy) {
      try {
        const inviterId = typeof doc.invitedBy === 'object' ? doc.invitedBy.id : doc.invitedBy
        const inviter = await req.payload.findByID({ collection: 'users', id: inviterId })
        inviterName = (inviter as any).name || inviter.email
      } catch { /* skip */ }
    }

    // Get company name from owner
    let companyName = 'het bedrijf'
    if (doc.companyOwner) {
      try {
        const ownerId = typeof doc.companyOwner === 'object' ? doc.companyOwner.id : doc.companyOwner
        const owner = await req.payload.findByID({ collection: 'users', id: ownerId })
        companyName = (owner as any).company?.companyName || (owner as any).name || 'het bedrijf'
      } catch { /* skip */ }
    }

    const roleLabels: Record<string, string> = {
      admin: 'Admin',
      manager: 'Manager',
      buyer: 'Inkoper',
      finance: 'Financieel',
      viewer: 'Alleen-lezen',
    }

    const siteName = process.env.SITE_NAME || 'Webshop'
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
    const inviteUrl = `${baseUrl}/account/invite/${doc.token}`
    const roleName = roleLabels[doc.role] || doc.role

    const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: #2563eb; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${siteName}</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1e293b; margin: 0 0 16px;">Je bent uitgenodigd!</h2>
    <p><strong>${inviterName}</strong> nodigt je uit om lid te worden van het zakelijke account van <strong>${companyName}</strong> als <strong>${roleName}</strong>.</p>
    ${doc.message ? `<div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;"><p style="margin: 0; font-style: italic; color: #64748b;">"${doc.message}"</p></div>` : ''}
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #1e40af;">Met een zakelijk account kun je bestellen, offertes aanvragen en bestellingen beheren namens ${companyName}.</p>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${inviteUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">Uitnodiging accepteren</a>
    </p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
    <p style="font-size: 13px; color: #94a3b8;">Deze uitnodiging is 7 dagen geldig. Heb je hier niet om gevraagd? Dan kun je deze e-mail negeren.</p>
  </div>
</body></html>`

    await emailService.send({
      to: inviteEmail,
      subject: `${inviterName} nodigt je uit voor ${companyName} — ${siteName}`,
      html,
    })
    console.log(`[CompanyInvites] Invite email sent to ${inviteEmail}`)
  } catch (error) {
    console.error(`[CompanyInvites] Failed to send invite email:`, error)
  }

  return doc
}

export const CompanyInvites: CollectionConfig = {
  slug: 'company-invites',
  labels: {
    singular: 'Bedrijfsuitnodiging',
    plural: 'Bedrijfsuitnodigingen',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'company', 'status', 'createdAt'],
    group: 'Zakelijk',
    hidden: true, // Workflow data — managed via B2B team flow, not directly
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'companyOwner',
      type: 'relationship',
      relationTo: 'users',
      label: 'Bedrijfseigenaar',
      required: true,
      admin: {
        description: 'De eigenaar van het B2B bedrijfsaccount',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mailadres',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Inkoper', value: 'buyer' },
        { label: 'Financieel', value: 'finance' },
        { label: 'Alleen-lezen', value: 'viewer' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: 'Verstuurd', value: 'pending' },
        { label: 'Geaccepteerd', value: 'accepted' },
        { label: 'Verlopen', value: 'expired' },
        { label: 'Ingetrokken', value: 'revoked' },
      ],
    },
    {
      name: 'token',
      type: 'text',
      label: 'Uitnodigingstoken',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Verloopt op',
      required: true,
    },
    {
      name: 'invitedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Uitgenodigd door',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Persoonlijk bericht',
    },
  ],
  hooks: {
    afterChange: [sendInviteEmail],
  },
}

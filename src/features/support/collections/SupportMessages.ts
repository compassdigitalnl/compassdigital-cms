import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const SupportMessages: CollectionConfig = {
  slug: 'support-messages',
  labels: {
    singular: 'Support Bericht',
    plural: 'Support Berichten',
  },
  admin: {
    useAsTitle: 'ticket',
    group: 'Support',
    defaultColumns: ['ticket', 'sender', 'senderRole', 'isInternal', 'createdAt'],
    description: 'Berichten binnen support tickets',
    hidden: shouldHideCollection('support'),
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'editor'], user)) return true
      // Customers see non-internal messages on their tickets
      return {
        and: [
          { 'ticket.customer': { equals: user.id } },
          { isInternal: { equals: false } },
        ],
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc

        const payload = req.payload

        try {
          // Update ticket status based on sender role
          const ticketId = typeof doc.ticket === 'object' ? doc.ticket.id : doc.ticket
          if (!ticketId) return doc

          const ticket = await payload.findByID({
            collection: 'support-tickets',
            id: ticketId,
            depth: 0,
          })

          const updateData: Record<string, any> = {}

          // Auto-set first response time for agent replies
          if (doc.senderRole === 'agent' && !ticket.firstResponseAt) {
            updateData.firstResponseAt = new Date().toISOString()
          }

          // Update ticket status based on who replied
          if (doc.senderRole === 'customer' && ticket.status !== 'open') {
            updateData.status = 'waiting_agent'
          } else if (doc.senderRole === 'agent' && !doc.isInternal) {
            updateData.status = 'waiting_customer'
          }

          if (Object.keys(updateData).length > 0) {
            await payload.update({
              collection: 'support-tickets',
              id: ticketId,
              data: updateData,
            })
          }
        } catch (err) {
          console.error('[SupportMessages] afterChange hook error:', err)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'ticket',
      type: 'relationship',
      relationTo: 'support-tickets',
      required: true,
      label: 'Ticket',
      index: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Afzender',
    },
    {
      name: 'senderRole',
      type: 'select',
      required: true,
      label: 'Rol afzender',
      defaultValue: 'customer',
      options: [
        { label: 'Klant', value: 'customer' },
        { label: 'Agent', value: 'agent' },
        { label: 'Systeem', value: 'system' },
      ],
    },
    {
      name: 'message',
      type: 'richText',
      required: true,
      label: 'Bericht',
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Bijlagen',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Bestand',
        },
      ],
    },
    {
      name: 'isInternal',
      type: 'checkbox',
      label: 'Intern bericht',
      defaultValue: false,
      admin: {
        description: 'Alleen zichtbaar voor agents, niet voor de klant',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Gelezen op',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}

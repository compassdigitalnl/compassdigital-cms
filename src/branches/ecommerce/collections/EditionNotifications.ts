import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * Edition Notifications Collection
 *
 * Allows users to subscribe to email notifications when new editions
 * of magazines are published (e.g., new issue of WINELIFE).
 *
 * Feature: Aboland Magazine Notifications
 */
export const EditionNotifications: CollectionConfig = {
  slug: 'edition-notifications',
  labels: {
    singular: 'Editie Notificatie',
    plural: 'Editie Notificaties',
  },
  admin: {
    hidden: shouldHideCollection('shop'),
    useAsTitle: 'email',
    defaultColumns: ['email', 'magazineTitle', 'active', 'createdAt'],
    group: 'E-commerce',
    description: 'Email notificaties voor nieuwe tijdschrift-edities',
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Public: anyone can subscribe
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'E-mailadres',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          label: 'Gebruiker',
          admin: {
            width: '50%',
            description: 'Optioneel — als de gebruiker ingelogd was',
          },
        },
      ],
    },
    {
      name: 'magazineTitle',
      type: 'text',
      required: true,
      label: 'Tijdschrift',
      admin: {
        description: 'Bijv. "WINELIFE" — wordt gematcht tegen nieuwe producttitels',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Oorspronkelijk Product',
      admin: {
        description: 'Het product waarop de gebruiker klikte om notificaties aan te vragen',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          label: 'Actief',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastNotified',
          type: 'date',
          label: 'Laatst Gemaild',
          admin: {
            width: '50%',
            readOnly: true,
            description: 'Timestamp van laatste notificatie-email',
          },
        },
      ],
    },
  ],
  timestamps: true,
}

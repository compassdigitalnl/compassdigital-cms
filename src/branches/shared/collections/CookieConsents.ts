import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/utilities'

/**
 * Cookie Consents Collection - GDPR Compliance
 * Stores user cookie consent preferences for legal compliance
 */
export const CookieConsents: CollectionConfig = {
  slug: 'cookie-consents',
  labels: {
    singular: 'Cookie Consent',
    plural: 'Cookie Consents',
  },
  admin: {
    useAsTitle: 'sessionId',
    defaultColumns: ['sessionId', 'necessary', 'analytics', 'marketing', 'consentedAt'],
    group: 'Systeem',
    hidden: true, // Compliance audit data — rarely accessed directly
    description: 'GDPR cookie consent log (read-only voor compliance - gebruik access control)',
  },
  access: {
    // Public can create (API endpoint), but only admins can read
    create: () => true,
    read: ({ req: { user } }) => isAdmin(user),
    update: () => false, // Read-only after creation
    delete: ({ req: { user } }) => isAdmin(user),
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      label: 'Sessie ID',
      admin: {
        description: 'Unieke browser sessie identificatie',
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'necessary',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      label: 'Essentiële cookies',
      admin: {
        description: 'Noodzakelijke cookies (altijd geaccepteerd)',
        readOnly: true,
      },
    },
    {
      name: 'analytics',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      label: 'Analytische cookies',
      admin: {
        description: 'Google Analytics, statistieken',
        readOnly: true,
      },
    },
    {
      name: 'marketing',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      label: 'Marketing cookies',
      admin: {
        description: 'Advertenties, retargeting',
        readOnly: true,
      },
    },
    {
      name: 'consentedAt',
      type: 'date',
      required: true,
      label: 'Geaccepteerd op',
      admin: {
        date: {
          displayFormat: 'dd-MM-yyyy HH:mm:ss',
        },
        description: 'Tijdstip van toestemming',
        readOnly: true,
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Adres',
      admin: {
        description: 'IP adres van de gebruiker (optioneel)',
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'Browser',
      admin: {
        description: 'Browser user agent string (optioneel)',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}

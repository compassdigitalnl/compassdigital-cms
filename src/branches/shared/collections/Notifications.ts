import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { featureField } from '@/lib/featureFields'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  labels: {
    singular: 'Melding',
    plural: 'Meldingen',
  },
  admin: {
    useAsTitle: 'title',
    group: 'E-commerce',
    defaultColumns: ['title', 'user', 'type', 'isRead', 'createdAt'],
    description: 'Gebruikersnotificaties en meldingen',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, users can only read their own notifications
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => {
      // Only admins and system can create notifications
      return user?.roles?.includes('admin') || false
    },
    update: ({ req: { user } }) => {
      // Users can update their own (mark as read), admins can update all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Users can delete their own, admins can delete all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Gebruiker',
      admin: {
        position: 'sidebar',
      },
    },
    // Notification Type & Category
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Type melding',
      options: [
        { label: 'Bestelling verzonden', value: 'order_shipped' },
        { label: 'Bestelling afgeleverd', value: 'order_delivered' },
        { label: 'Bestelling geannuleerd', value: 'order_cancelled' },
        { label: 'Factuur beschikbaar', value: 'invoice_available' },
        { label: 'Factuur achterstallig', value: 'invoice_overdue' },
        { label: 'Betalingsherinnering', value: 'payment_reminder' },
        { label: 'Product weer op voorraad', value: 'stock_alert' },
        { label: 'Favorieten prijswijziging', value: 'price_change' },
        { label: 'Herhaalbestelling reminder', value: 'recurring_order_reminder' },
        { label: 'Herhaalbestelling verwerkt', value: 'recurring_order_processed' },
        { label: 'Retour goedgekeurd', value: 'return_approved' },
        { label: 'Retour afgekeurd', value: 'return_rejected' },
        { label: 'Retour ontvangen', value: 'return_received' },
        { label: 'Terugbetaling verwerkt', value: 'refund_processed' },
        { label: 'Systeem melding', value: 'system' },
        { label: 'Account wijziging', value: 'account_update' },
      ],
      admin: {
        description: 'Type notificatie bepaalt icoon en kleur',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'all',
      label: 'Categorie',
      options: [
        { label: 'Alles', value: 'all' },
        { label: 'Bestellingen', value: 'orders' },
        { label: 'Voorraad', value: 'stock' },
        { label: 'Systeem', value: 'system' },
      ],
      admin: {
        description: 'Categorie voor filteren in notificatie center',
      },
    },
    // Content
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'Korte, duidelijke titel (bijv. "Bestelling #PM-2026-1847 is verzonden")',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Bericht',
      admin: {
        description: 'Uitgebreide beschrijving of details',
      },
    },
    // Status
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
      label: 'Gelezen',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Gelezen op',
      admin: {
        description: 'Datum/tijd waarop de melding is gelezen',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // Related Entities
    {
      name: 'relatedOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Gerelateerde bestelling',
      admin: {
        description: 'Koppel aan een bestelling (optioneel)',
      },
    },
    {
      name: 'relatedProduct',
      type: 'relationship',
      relationTo: 'products',
      label: 'Gerelateerd product',
      admin: {
        description: 'Koppel aan een product (bijv. bij voorraadmelding)',
      },
    },
    ...featureField('invoices', {
      name: 'relatedInvoice',
      type: 'relationship',
      relationTo: 'invoices',
      label: 'Gerelateerde factuur',
      admin: {
        description: 'Koppel aan een factuur',
      },
    }),
    ...featureField('recurringOrders', {
      name: 'relatedRecurringOrder',
      type: 'relationship',
      relationTo: 'recurring-orders',
      label: 'Gerelateerde herhaalbestelling',
      admin: {
        description: 'Koppel aan een herhaalbestelling',
      },
    }),
    ...featureField('returns', {
      name: 'relatedReturn',
      type: 'relationship',
      relationTo: 'returns',
      label: 'Gerelateerde retour',
      admin: {
        description: 'Koppel aan een retourzending',
      },
    }),
    // Action & Appearance
    {
      name: 'actionUrl',
      type: 'text',
      label: 'Actie URL',
      admin: {
        description: 'Link waar de gebruiker naartoe gaat bij klikken (bijv. /account/orders/123)',
      },
    },
    {
      name: 'actionLabel',
      type: 'text',
      label: 'Actie label',
      admin: {
        description: 'Optioneel: label voor actieknop (bijv. "Bekijk bestelling")',
      },
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'bell',
      label: 'Icoon',
      options: [
        { label: '🔔 Bell', value: 'bell' },
        { label: '🚚 Truck (verzonden)', value: 'truck' },
        { label: '✅ Check Circle (afgeleverd)', value: 'check-circle' },
        { label: '📦 Package (voorraad)', value: 'package' },
        { label: '📄 File Text (factuur)', value: 'file-text' },
        { label: '🔁 Repeat (herhaalbestelling)', value: 'repeat' },
        { label: '↩️ Rotate CCW (retour)', value: 'rotate-ccw' },
        { label: '💰 Banknote (betaling)', value: 'banknote' },
        { label: '⚠️ Alert Circle (waarschuwing)', value: 'alert-circle' },
        { label: '⚙️ Settings (systeem)', value: 'settings' },
        { label: '👤 User (account)', value: 'user' },
      ],
      admin: {
        description: 'Icoon voor in notificatie center',
      },
    },
    {
      name: 'iconColor',
      type: 'select',
      defaultValue: 'teal',
      label: 'Icoon kleur',
      options: [
        { label: 'Groen (success)', value: 'green' },
        { label: 'Teal (info)', value: 'teal' },
        { label: 'Blauw (info)', value: 'blue' },
        { label: 'Amber (waarschuwing)', value: 'amber' },
        { label: 'Coral (fout/belangrijk)', value: 'coral' },
        { label: 'Grijs (neutraal)', value: 'grey' },
      ],
      admin: {
        description: 'Kleur van het icoon en achtergrond',
      },
    },
    // Priority & Expiration
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      label: 'Prioriteit',
      options: [
        { label: 'Laag', value: 'low' },
        { label: 'Normaal', value: 'normal' },
        { label: 'Hoog', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        description: 'Hogere prioriteit verschijnt bovenaan in de lijst',
        position: 'sidebar',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Vervaldatum',
      admin: {
        description: 'Optioneel: automatisch verwijderen na deze datum',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // Email Notification (optional feature)
    {
      name: 'sendEmail',
      type: 'checkbox',
      defaultValue: false,
      label: 'Stuur e-mail notificatie',
      admin: {
        description: 'Ook een e-mail versturen aan de gebruiker',
      },
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'E-mail verzonden',
      admin: {
        readOnly: true,
        description: 'Gemarkeerd als verzonden na e-mail versturen',
      },
    },
    {
      name: 'emailSentAt',
      type: 'date',
      label: 'E-mail verzonden op',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-set readAt timestamp when isRead changes to true
        if (data.isRead === true && !data.readAt) {
          data.readAt = new Date().toISOString()
        }

        // Clear readAt when isRead is set to false
        if (data.isRead === false) {
          data.readAt = null
        }

        // Auto-set category based on type
        if (data.type && !data.category) {
          const typeToCategory: { [key: string]: string } = {
            order_shipped: 'orders',
            order_delivered: 'orders',
            order_cancelled: 'orders',
            invoice_available: 'orders',
            invoice_overdue: 'orders',
            payment_reminder: 'orders',
            stock_alert: 'stock',
            price_change: 'stock',
            recurring_order_reminder: 'orders',
            recurring_order_processed: 'orders',
            return_approved: 'orders',
            return_rejected: 'orders',
            return_received: 'orders',
            refund_processed: 'orders',
            system: 'system',
            account_update: 'system',
          }
          data.category = typeToCategory[data.type] || 'all'
        }

        // Auto-set icon and color based on type
        if (data.type) {
          const typeSettings: {
            [key: string]: { icon: string; color: string }
          } = {
            order_shipped: { icon: 'truck', color: 'green' },
            order_delivered: { icon: 'check-circle', color: 'green' },
            order_cancelled: { icon: 'alert-circle', color: 'coral' },
            invoice_available: { icon: 'file-text', color: 'blue' },
            invoice_overdue: { icon: 'alert-circle', color: 'coral' },
            payment_reminder: { icon: 'banknote', color: 'amber' },
            stock_alert: { icon: 'package', color: 'teal' },
            price_change: { icon: 'package', color: 'blue' },
            recurring_order_reminder: { icon: 'repeat', color: 'amber' },
            recurring_order_processed: { icon: 'repeat', color: 'green' },
            return_approved: { icon: 'rotate-ccw', color: 'green' },
            return_rejected: { icon: 'rotate-ccw', color: 'coral' },
            return_received: { icon: 'rotate-ccw', color: 'teal' },
            refund_processed: { icon: 'banknote', color: 'green' },
            system: { icon: 'settings', color: 'grey' },
            account_update: { icon: 'user', color: 'teal' },
          }

          if (!data.icon && typeSettings[data.type]) {
            data.icon = typeSettings[data.type].icon
          }
          if (!data.iconColor && typeSettings[data.type]) {
            data.iconColor = typeSettings[data.type].color
          }
        }

        return data
      },
    ],
  },
}

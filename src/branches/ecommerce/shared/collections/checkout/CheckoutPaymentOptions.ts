import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const CheckoutPaymentOptions: CollectionConfig = {
  slug: 'checkout-payment-options',
  labels: {
    singular: 'Betaaloptie',
    plural: 'Betaalopties',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Bestellingen',
    defaultColumns: ['name', 'provider', 'isActive', 'sortOrder'],
    description: 'Beschikbare betaalmethoden in de checkout (bijv. iDEAL, Creditcard, Op rekening)',
    hidden: shouldHideCollection('checkout'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
      admin: {
        description: 'Bijv: iDEAL, Creditcard, Op rekening',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unieke identifier (bijv: ideal, creditcard, invoice)',
      },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Beschrijving',
      admin: {
        description: 'Korte uitleg zichtbaar in de checkout (bijv: Betaal direct via je bank)',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (afbeelding)',
      admin: {
        description: 'Upload een SVG/PNG logo van de betaalmethode. Heeft voorrang op het Lucide icoon.',
      },
    },
    {
      name: 'lucideIcon',
      type: 'select',
      label: 'Lucide Icoon',
      admin: {
        description: 'Kies een Lucide icoon (wordt gebruikt als er geen logo is geüpload). Bekijk alle iconen op lucide.dev',
      },
      options: [
        { label: '💳 Credit Card', value: 'credit-card' },
        { label: '🏛️ Landmark (bank)', value: 'landmark' },
        { label: '🏢 Building', value: 'building' },
        { label: '💵 Banknote', value: 'banknote' },
        { label: '👛 Wallet', value: 'wallet' },
        { label: '🧾 Receipt', value: 'receipt' },
        { label: '🤲 Hand Coins', value: 'hand-coins' },
        { label: '💲 Circle Dollar Sign', value: 'circle-dollar-sign' },
        { label: '🛡️ Shield Check', value: 'shield-check' },
        { label: '🌐 Globe', value: 'globe' },
        { label: '📧 Mail', value: 'mail' },
        { label: '📦 Package', value: 'package' },
        { label: '🛒 Shopping Cart', value: 'shopping-cart' },
        { label: '↔️ Arrow Right Left', value: 'arrow-right-left' },
        { label: '✅ Badge Check', value: 'badge-check' },
        { label: '📤 Send', value: 'send' },
      ],
    },
    {
      name: 'provider',
      type: 'select',
      label: 'Payment Provider',
      defaultValue: 'manual',
      options: [
        { label: 'Mollie', value: 'mollie' },
        { label: 'Stripe', value: 'stripe' },
        { label: 'MultiSafepay', value: 'multisafepay' },
        { label: 'Handmatig / Op rekening', value: 'manual' },
      ],
      admin: {
        description: 'Welke payment provider verwerkt deze methode?',
      },
    },
    {
      name: 'fee',
      type: 'text',
      label: 'Transactiekosten',
      admin: {
        description: 'Optioneel: bijv. "€0.29 per transactie" (getoond als toelichting)',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge',
      admin: {
        description: 'Optioneel label: bijv. "Populair", "Aanbevolen"',
      },
    },
    {
      name: 'isB2B',
      type: 'checkbox',
      defaultValue: false,
      label: 'Alleen B2B',
      admin: {
        description: 'Alleen tonen voor zakelijke klanten',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Actief',
      admin: {
        position: 'sidebar',
        description: 'Alleen actieve opties worden in de checkout getoond',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Sortering',
      admin: {
        position: 'sidebar',
        description: 'Lagere waarde = eerder getoond',
      },
    },
  ],
}
export default CheckoutPaymentOptions

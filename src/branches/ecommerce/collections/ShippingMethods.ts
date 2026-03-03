import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const ShippingMethods: CollectionConfig = {
  slug: 'shipping-methods',
  labels: {
    singular: 'Verzendmethode',
    plural: 'Verzendmethoden',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Bestellingen',
    defaultColumns: ['name', 'price', 'deliveryTime', 'isActive', 'sortOrder'],
    description: 'Verzendopties voor de checkout (bijv. Standaard, Express, Ophalen)',
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
        description: 'Bijv: Standaard verzending, Express, Ophalen in winkel',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unieke identifier (bijv: standard, express, pickup)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        description: 'Optionele toelichting zichtbaar in de checkout',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icoon',
      defaultValue: 'truck',
      options: [
        { label: 'Vrachtwagen (truck)', value: 'truck' },
        { label: 'Bliksem (express)', value: 'zap' },
        { label: 'Pakket (package)', value: 'package' },
        { label: 'Klok (same-day)', value: 'clock' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prijs (€)',
      min: 0,
      admin: {
        description: 'Verzendkosten in euro (0 = gratis)',
        step: 0.01,
      },
    },
    {
      name: 'freeThreshold',
      type: 'number',
      label: 'Gratis vanaf (€)',
      min: 0,
      admin: {
        description: 'Gratis verzending bij bestellingen boven dit bedrag (leeg = nooit gratis)',
        step: 0.01,
      },
    },
    {
      name: 'estimatedDays',
      type: 'number',
      label: 'Geschatte levertijd (dagen)',
      min: 0,
      admin: {
        description: 'Gebruikt voor levertijd berekening',
      },
    },
    {
      name: 'deliveryTime',
      type: 'text',
      label: 'Levertijd tekst',
      admin: {
        description: 'Bijv: 2-3 werkdagen, Volgende werkdag',
      },
    },
    {
      name: 'countries',
      type: 'select',
      hasMany: true,
      label: 'Beschikbare landen',
      options: [
        { label: 'Nederland', value: 'NL' },
        { label: 'België', value: 'BE' },
        { label: 'Duitsland', value: 'DE' },
        { label: 'Frankrijk', value: 'FR' },
        { label: 'Verenigd Koninkrijk', value: 'UK' },
      ],
      defaultValue: ['NL'],
      admin: {
        description: 'In welke landen is deze verzendmethode beschikbaar?',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Actief',
      admin: {
        position: 'sidebar',
        description: 'Alleen actieve methoden worden in de checkout getoond',
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
export default ShippingMethods

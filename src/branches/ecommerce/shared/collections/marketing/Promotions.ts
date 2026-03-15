import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

/**
 * Promotions Collection (merged with DiscountCodes)
 *
 * Alle promoties en kortingscodes in één collectie:
 * - Automatische promoties (geen code nodig)
 * - Kortingscodes (klant voert code in bij checkout)
 * - Percentage / vast bedrag korting
 * - Koop X krijg Y / Gratis verzending / Bundel-deals
 * Met planning, flash sales, en voorwaarden
 */
export const Promotions: CollectionConfig = {
  slug: 'promotions',
  labels: {
    singular: 'Promotie',
    plural: 'Promoties & Kortingscodes',
  },
  admin: {
    group: 'Marketing',
    hidden: shouldHideCollection('promotions'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'promotionMode', 'type', 'value', 'status', 'code', 'startDate', 'endDate'],
    description: 'Beheer promoties, kortingscodes, flash sales en bundel-deals',
  },
  access: {
    read: ({ req }) => checkRole(['admin', 'editor'], req.user) || false,
    create: ({ req }) => checkRole(['admin'], req.user) || false,
    update: ({ req }) => checkRole(['admin'], req.user) || false,
    delete: ({ req }) => checkRole(['admin'], req.user) || false,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        // Auto-uppercase coupon code
        if (data?.code) {
          data.code = data.code.toUpperCase().trim()
        }
        return data
      },
    ],
  },
  fields: [
    // ── Sidebar fields (top-level for correct positioning) ───
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Actief', value: 'active' },
        { label: 'Verlopen', value: 'expired' },
        { label: 'Gepauzeerd', value: 'paused' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'promotionMode',
      label: 'Modus',
      type: 'select',
      required: true,
      defaultValue: 'automatic',
      options: [
        { label: 'Automatisch (geen code nodig)', value: 'automatic' },
        { label: 'Kortingscode', value: 'coupon' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Automatisch of met kortingscode',
      },
    },
    {
      name: 'startDate',
      label: 'Startdatum',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd-MM-yyyy HH:mm' },
      },
    },
    {
      name: 'endDate',
      label: 'Einddatum',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd-MM-yyyy HH:mm' },
      },
    },
    {
      name: 'isFlashSale',
      label: 'Flash Sale',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toont countdown timer',
      },
    },
    {
      name: 'usedCount',
      label: 'Aantal gebruikt',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatisch bijgehouden',
      },
    },

    // ── Tabs ───────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          fields: [
            {
              name: 'title',
              label: 'Titel',
              type: 'text',
              required: true,
              admin: {
                description: 'Naam van de promotie (bijv. "Zomerkorting 25%")',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Wordt automatisch gegenereerd op basis van de titel',
              },
            },
            {
              name: 'code',
              label: 'Kortingscode',
              type: 'text',
              unique: true,
              admin: {
                placeholder: 'bijv. WINTER25',
                description: 'Unieke code die klanten invoeren bij checkout (automatisch hoofdletters)',
                condition: (data) => data?.promotionMode === 'coupon',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  label: 'Type',
                  type: 'select',
                  required: true,
                  defaultValue: 'percentage',
                  options: [
                    { label: 'Percentage', value: 'percentage' },
                    { label: 'Vast bedrag', value: 'fixed_amount' },
                    { label: 'Koop X krijg Y', value: 'buy_x_get_y' },
                    { label: 'Gratis verzending', value: 'free_shipping' },
                    { label: 'Bundel', value: 'bundle' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'value',
                  label: 'Waarde',
                  type: 'number',
                  required: true,
                  defaultValue: 0,
                  admin: {
                    width: '33%',
                    description: 'Percentage (bijv. 25) of bedrag in euro\'s (bijv. 10.00)',
                  },
                },
                {
                  name: 'priority',
                  label: 'Prioriteit',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    width: '33%',
                    description: 'Hogere waarde = hogere prioriteit',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Planning',
          fields: [
            {
              name: 'flashSaleLabel',
              label: 'Flash Sale label',
              type: 'text',
              admin: {
                description: 'Tekst bij de flash sale (bijv. "Nog maar 2 uur!")',
                condition: (data) => data?.isFlashSale === true,
              },
            },
          ],
        },
        {
          label: 'Voorwaarden',
          fields: [
            {
              name: 'appliesTo',
              label: 'Geldt voor',
              type: 'select',
              defaultValue: 'all',
              options: [
                { label: 'Alle producten', value: 'all' },
                { label: 'Specifieke producten', value: 'specific_products' },
                { label: 'Specifieke categorieën', value: 'specific_categories' },
                { label: 'Specifieke merken', value: 'specific_brands' },
              ],
            },
            {
              name: 'productIds',
              label: 'Product IDs',
              type: 'json',
              admin: {
                description: 'JSON array van product IDs (bijv. [1, 2, 3])',
                condition: (data) => data?.appliesTo === 'specific_products',
              },
            },
            {
              name: 'categoryIds',
              label: 'Categorie IDs',
              type: 'json',
              admin: {
                description: 'JSON array van categorie IDs (bijv. [10, 20])',
                condition: (data) => data?.appliesTo === 'specific_categories',
              },
            },
            {
              name: 'brandIds',
              label: 'Merk IDs',
              type: 'json',
              admin: {
                description: 'JSON array van merk IDs (bijv. [5, 6])',
                condition: (data) => data?.appliesTo === 'specific_brands',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minOrderValue',
                  label: 'Min. bestelwaarde',
                  type: 'number',
                  admin: {
                    width: '50%',
                    description: 'Minimale bestelwaarde in euro\'s (optioneel)',
                  },
                },
                {
                  name: 'minQuantity',
                  label: 'Min. aantal',
                  type: 'number',
                  admin: {
                    width: '50%',
                    description: 'Minimaal aantal producten (optioneel)',
                  },
                },
              ],
            },
            {
              name: 'maxUses',
              label: 'Max. gebruik',
              type: 'number',
              admin: {
                description: 'Maximaal aantal keer te gebruiken (leeg = onbeperkt)',
              },
            },
            {
              name: 'stackable',
              label: 'Stapelbaar',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Kan gecombineerd worden met andere promoties',
              },
            },
          ],
        },
        {
          label: 'Weergave',
          fields: [
            {
              name: 'bannerText',
              label: 'Banner tekst',
              type: 'text',
              admin: {
                description: 'Tekst die in de promotie-banner wordt getoond',
              },
            },
            {
              name: 'bannerColor',
              label: 'Banner kleur',
              type: 'text',
              admin: {
                description: 'Hex kleurcode (bijv. #FF5500)',
              },
            },
          ],
        },
      ],
    },
  ],
}

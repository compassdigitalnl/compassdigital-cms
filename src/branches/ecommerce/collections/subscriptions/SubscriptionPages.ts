import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

export const SubscriptionPages: CollectionConfig = {
  slug: 'subscription-pages',
  labels: {
    singular: 'Abonnementspagina',
    plural: "Abonnementspagina's",
  },
  admin: {
    useAsTitle: 'name',
    group: 'Abonnementen',
    defaultColumns: ['name', 'slug', 'brand', 'active', 'updatedAt'],
    description:
      'Dedicated landingspagina\'s voor abonnementen met eigen checkout flow (los van de webshop)',
    hidden: shouldHideCollection('subscriptionPages'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── Tab 1: Algemeen ───
        {
          label: 'Algemeen',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Naam',
              admin: {
                description: 'Interne naam voor deze abonnementspagina',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'URL Slug',
              admin: {
                description: 'Wordt gebruikt in de URL: /abonneren/[slug]',
              },
              hooks: {
                beforeValidate: [autoGenerateSlugFromName],
              },
            },
            {
              name: 'brand',
              type: 'relationship',
              relationTo: 'brands',
              label: 'Merk / Titel',
              admin: {
                description: 'Optioneel: koppel aan een merk of magazine titel',
              },
            },
            {
              name: 'headline',
              type: 'text',
              label: 'Koptekst',
              admin: {
                description: 'Hoofdtitel op de landingspagina (bijv. "Kies je abonnement")',
              },
            },
            {
              name: 'subheadline',
              type: 'textarea',
              label: 'Subtekst',
              admin: {
                description: 'Korte beschrijving onder de koptekst',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Afbeelding',
            },
            {
              name: 'active',
              type: 'checkbox',
              label: 'Actief',
              defaultValue: true,
              admin: {
                position: 'sidebar',
                description: 'Pagina is zichtbaar voor bezoekers',
              },
            },
          ],
        },

        // ─── Tab 2: Plannen ───
        {
          label: 'Plannen',
          fields: [
            {
              name: 'plans',
              type: 'array',
              label: 'Abonnementsplannen',
              minRows: 1,
              admin: {
                description: 'De plannen die op deze pagina vergeleken worden',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Plantitel',
                  admin: {
                    description: 'Bijv. "Basis", "Premium", "Compleet"',
                  },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitel',
                  admin: {
                    description: 'Korte omschrijving onder de titel',
                  },
                },
                {
                  name: 'highlighted',
                  type: 'checkbox',
                  label: 'Uitgelicht',
                  defaultValue: false,
                  admin: {
                    description: 'Toon als "Meest gekozen" of vergelijkbaar',
                  },
                },
                {
                  name: 'highlightLabel',
                  type: 'text',
                  label: 'Uitgelicht Label',
                  admin: {
                    description: 'Bijv. "Meest gekozen", "Best deal"',
                    condition: (_, siblingData) => siblingData?.highlighted,
                  },
                },
                {
                  name: 'billingOptions',
                  type: 'array',
                  label: 'Facturatieopties',
                  minRows: 1,
                  fields: [
                    {
                      name: 'period',
                      type: 'select',
                      required: true,
                      label: 'Periode',
                      options: [
                        { label: 'Maandelijks', value: 'monthly' },
                        { label: 'Per kwartaal', value: 'quarterly' },
                        { label: 'Halfjaarlijks', value: 'biannual' },
                        { label: 'Jaarlijks', value: 'yearly' },
                      ],
                    },
                    {
                      name: 'price',
                      type: 'number',
                      required: true,
                      label: 'Prijs',
                      admin: {
                        description: 'Prijs per periode (in euro)',
                      },
                    },
                    {
                      name: 'comparePrice',
                      type: 'number',
                      label: 'Vergelijkingsprijs',
                      admin: {
                        description: 'Doorgestreepte prijs (optioneel)',
                      },
                    },
                  ],
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Kenmerken',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      label: 'Kenmerk',
                    },
                    {
                      name: 'included',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Inbegrepen',
                    },
                  ],
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  label: 'CTA Tekst',
                  defaultValue: 'Kies dit plan',
                },
                {
                  name: 'sortOrder',
                  type: 'number',
                  label: 'Volgorde',
                  defaultValue: 0,
                },
              ],
            },
          ],
        },

        // ─── Tab 3: Add-ons ───
        {
          label: 'Add-ons',
          fields: [
            {
              name: 'addOns',
              type: 'array',
              label: 'Add-ons',
              admin: {
                description: 'Optionele extra\'s die de klant bij het abonnement kan kiezen',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Beschrijving',
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  label: 'Prijs',
                  admin: {
                    description: 'Prijs per periode (in euro)',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                  admin: {
                    description: 'Lucide icoon naam (bijv. gift, book-open)',
                  },
                },
              ],
            },
          ],
        },

        // ─── Tab 4: Seats ───
        {
          label: 'Seats',
          fields: [
            {
              name: 'seats',
              type: 'group',
              label: 'Seats / Licenties',
              admin: {
                description:
                  'Configureer of klanten meerdere seats/licenties kunnen bestellen',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Seats inschakelen',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  defaultValue: 'Aantal licenties',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'minSeats',
                  type: 'number',
                  label: 'Minimum',
                  defaultValue: 1,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'maxSeats',
                  type: 'number',
                  label: 'Maximum',
                  defaultValue: 100,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'pricePerSeat',
                  type: 'number',
                  label: 'Prijs per extra seat',
                  admin: {
                    description: 'Meerprijs per extra seat bovenop de basisprijs',
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
              ],
            },
          ],
        },

        // ─── Tab 5: Checkout ───
        {
          label: 'Checkout',
          fields: [
            {
              name: 'checkoutTitle',
              type: 'text',
              label: 'Checkout Titel',
              defaultValue: 'Rond je bestelling af',
            },
            {
              name: 'paymentProvider',
              type: 'select',
              label: 'Betaalprovider',
              options: [
                { label: 'Mollie', value: 'mollie' },
                { label: 'Stripe', value: 'stripe' },
                { label: 'Extern (redirect)', value: 'external' },
              ],
              defaultValue: 'mollie',
            },
            {
              name: 'externalCheckoutUrl',
              type: 'text',
              label: 'Externe Checkout URL',
              admin: {
                description: 'Redirect URL voor externe betaalprovider',
                condition: (_, siblingData) => siblingData?.paymentProvider === 'external',
              },
            },
            {
              name: 'trustItems',
              type: 'array',
              label: 'Vertrouwenselementen',
              admin: {
                description: 'Bijv. "14 dagen bedenktijd", "Veilig betalen"',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                  admin: {
                    description: 'Lucide icoon naam',
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Tekst',
                },
              ],
            },
            {
              name: 'successMessage',
              type: 'textarea',
              label: 'Bevestigingsbericht',
              defaultValue: 'Bedankt voor je bestelling! Je ontvangt een bevestiging per e-mail.',
            },
            {
              name: 'successRedirectUrl',
              type: 'text',
              label: 'Redirect na betaling',
              admin: {
                description: 'Optionele URL om naar door te sturen na succesvolle betaling',
              },
            },
          ],
        },

        // ─── Tab 6: SEO ───
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'SEO',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Beschrijving',
                  maxLength: 160,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Social Share Image',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default SubscriptionPages

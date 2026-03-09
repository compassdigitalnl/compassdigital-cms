import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

export const Magazines: CollectionConfig = {
  slug: 'magazines',
  labels: {
    singular: 'Magazine',
    plural: 'Magazines',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Publishing',
    defaultColumns: ['name', 'slug', 'frequency', 'featured', 'visible', 'updatedAt'],
    description: 'Magazinetitels en hun edities, abonnementen en content',
    hidden: shouldHideCollection('magazines'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ── Tabs ──
    {
      type: 'tabs',
      tabs: [
        // ── Tab 1: Algemeen ──
        {
          label: 'Algemeen',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Titel',
              admin: {
                description: 'Naam van het magazine',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'URL Slug',
              admin: {
                description: 'Automatisch gegenereerd uit de naam',
              },
              hooks: {
                beforeValidate: [autoGenerateSlugFromName],
              },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              admin: {
                description: 'Korte slagzin onder de titel',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Over dit magazine',
              admin: {
                description: 'Uitgebreide beschrijving / verhaal van het magazine',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'frequency',
                  type: 'select',
                  label: 'Frequentie',
                  defaultValue: 'quarterly',
                  options: [
                    { label: 'Wekelijks', value: 'weekly' },
                    { label: 'Tweewekelijks', value: 'biweekly' },
                    { label: 'Maandelijks', value: 'monthly' },
                    { label: 'Tweemaandelijks', value: 'bimonthly' },
                    { label: 'Kwartaal', value: 'quarterly' },
                    { label: 'Halfjaarlijks', value: 'biannual' },
                    { label: 'Jaarlijks', value: 'yearly' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'issn',
                  type: 'text',
                  label: 'ISSN',
                  admin: {
                    description: 'Internationaal serienummer (optioneel)',
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        // ── Tab 2: Media ──
        {
          label: 'Media',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: 'Magazinelogo (voorkeur: SVG of PNG met transparante achtergrond)',
              },
            },
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover',
              admin: {
                description: 'Huidige coverafbeelding (voor overzichtspagina)',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Afbeelding',
              admin: {
                description: 'Achtergrondafbeelding voor de hero-sectie op de detailpagina',
              },
            },
          ],
        },
        // ── Tab 3: Hero & Stats ──
        {
          label: 'Hero & Stats',
          fields: [
            {
              name: 'badge',
              type: 'text',
              label: 'Badge',
              defaultValue: 'Magazine',
              admin: {
                description: 'Label boven de titel in de hero (standaard: "Magazine")',
              },
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Hero Titel',
              admin: {
                description: 'Hoofdtitel op de detailpagina (standaard: magazinenaam)',
              },
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Statistieken',
              maxRows: 4,
              admin: {
                description: 'Hero statistieken (bijv: "12 Edities per jaar")',
              },
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  label: 'Waarde',
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                },
              ],
            },
          ],
        },
        // ── Tab 4: Edities ──
        {
          label: 'Edities',
          fields: [
            {
              name: 'editions',
              type: 'array',
              label: 'Edities',
              admin: {
                description: 'Alle uitgaves van dit magazine',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Editie titel',
                      admin: {
                        description: 'Bijv: Zomer 2026, Nr. 45',
                        width: '50%',
                      },
                    },
                    {
                      name: 'issueNumber',
                      type: 'text',
                      label: 'Nummer',
                      admin: {
                        description: 'Bijv: Nr. 45',
                        width: '25%',
                      },
                    },
                    {
                      name: 'year',
                      type: 'number',
                      label: 'Jaar',
                      admin: {
                        width: '25%',
                      },
                    },
                  ],
                },
                {
                  name: 'cover',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Cover',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Prijs',
                      admin: {
                        description: 'Losse verkoopprijs',
                        width: '33%',
                      },
                    },
                    {
                      name: 'publishDate',
                      type: 'date',
                      label: 'Publicatiedatum',
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'soldOut',
                      type: 'checkbox',
                      label: 'Uitverkocht',
                      defaultValue: false,
                      admin: {
                        width: '33%',
                      },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                  admin: {
                    description: 'Korte beschrijving van deze editie',
                  },
                },
                {
                  name: 'shopUrl',
                  type: 'text',
                  label: 'Shop URL',
                  admin: {
                    description: 'Link naar de productpagina in de webshop (optioneel)',
                  },
                },
              ],
            },
          ],
        },
        // ── Tab 5: USP & Testimonial ──
        {
          label: 'USP & Testimonial',
          fields: [
            {
              name: 'uspCards',
              type: 'array',
              label: 'USP Kaarten',
              maxRows: 6,
              admin: {
                description: 'Unique Selling Points voor dit magazine',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                  admin: {
                    description: 'Lucide icoon naam (bijv: BookOpen, Award)',
                  },
                },
                {
                  name: 'iconColor',
                  type: 'text',
                  label: 'Icoon Kleur',
                  admin: {
                    description: 'CSS kleur (bijv: #00897B)',
                  },
                },
                {
                  name: 'iconBg',
                  type: 'text',
                  label: 'Icoon Achtergrond',
                  admin: {
                    description: 'CSS achtergrondkleur',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Titel',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Beschrijving',
                },
              ],
            },
            {
              name: 'testimonial',
              type: 'group',
              label: 'Getuigenis',
              fields: [
                {
                  name: 'initials',
                  type: 'text',
                  label: 'Initialen',
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Quote',
                },
                {
                  name: 'authorName',
                  type: 'text',
                  label: 'Naam',
                },
                {
                  name: 'authorRole',
                  type: 'text',
                  label: 'Rol / Functie',
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Beoordeling',
                  min: 1,
                  max: 5,
                  admin: {
                    description: '1-5 sterren',
                  },
                },
              ],
            },
          ],
        },
        // ── Tab 6: Abonnement ──
        {
          label: 'Abonnement',
          fields: [
            {
              name: 'ctaTitle',
              type: 'text',
              label: 'CTA Titel',
              admin: {
                description: 'Call-to-action titel (bijv: "Word abonnee")',
              },
            },
            {
              name: 'ctaDescription',
              type: 'text',
              label: 'CTA Beschrijving',
            },
            {
              name: 'plans',
              type: 'array',
              label: 'Abonnementsformules',
              admin: {
                description: 'Beschikbare abonnementen voor dit magazine',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                  admin: {
                    description: 'Bijv: Jaarabonnement, Proefabonnement, Digitaal',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                },
                {
                  name: 'highlighted',
                  type: 'checkbox',
                  label: 'Uitgelicht',
                  defaultValue: false,
                  admin: {
                    description: 'Toon als "Meest gekozen" of aanbevolen plan',
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  label: 'Prijs',
                  admin: {
                    description: 'Prijs per periode',
                  },
                },
                {
                  name: 'period',
                  type: 'select',
                  label: 'Periode',
                  defaultValue: 'yearly',
                  options: [
                    { label: 'Per maand', value: 'monthly' },
                    { label: 'Per kwartaal', value: 'quarterly' },
                    { label: 'Per halfjaar', value: 'biannual' },
                    { label: 'Per jaar', value: 'yearly' },
                    { label: 'Eenmalig', value: 'once' },
                  ],
                },
                {
                  name: 'editions',
                  type: 'number',
                  label: 'Aantal edities',
                  admin: {
                    description: 'Aantal edities dat je ontvangt (bijv: 4, 12)',
                  },
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Kenmerken',
                  admin: {
                    description: 'Wat is inbegrepen bij dit abonnement',
                  },
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
                  name: 'externalUrl',
                  type: 'text',
                  label: 'Externe bestel-URL',
                  admin: {
                    description: 'Link naar extern bestelsysteem (optioneel)',
                  },
                },
              ],
            },
            {
              name: 'paymentProvider',
              type: 'select',
              label: 'Betaalprovider',
              defaultValue: 'mollie',
              options: [
                { label: 'Mollie', value: 'mollie' },
                { label: 'Stripe', value: 'stripe' },
                { label: 'Extern', value: 'external' },
              ],
              admin: {
                description: 'Betaalprovider voor abonnementen',
              },
            },
            {
              name: 'trustItems',
              type: 'array',
              label: 'Vertrouwenselementen',
              maxRows: 4,
              admin: {
                description: 'Bijv: "Altijd opzegbaar", "Gratis verzending"',
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
          ],
        },
        // ── Tab 7: SEO ──
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta Title',
                  admin: {
                    description: 'SEO titel voor de magazinepagina',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Beschrijving',
                  maxLength: 160,
                  admin: {
                    description: 'Korte beschrijving voor zoekmachines (max 160 tekens)',
                  },
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
    // ── Sidebar fields ──
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon als uitgelicht magazine',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Sorteer volgorde (lager = eerder getoond)',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Zichtbaar',
      admin: {
        position: 'sidebar',
        description: 'Tonen in magazine-overzicht',
      },
    },
  ],
}
export default Magazines

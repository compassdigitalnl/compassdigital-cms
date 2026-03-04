import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'
import { featureField } from '@/lib/featureFields'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Instellingen',
  admin: {
    group: 'Instellingen',
    description: 'Alle website en webshop instellingen op één plek',
    hidden: !isClientDeployment(),
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── TAB 1: BEDRIJFSGEGEVENS (GECONSOLIDEERD) ─────────────
        {
          label: 'Bedrijfsgegevens',
          description: 'Algemene bedrijfsinformatie',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              required: true,
              label: 'Bedrijfsnaam',
              admin: {
                description: 'Officiële bedrijfsnaam',
                placeholder: 'Uw Bedrijfsnaam B.V.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Slogan',
              admin: {
                placeholder: 'Uw partner in medische disposables',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Korte beschrijving',
              admin: {
                rows: 3,
                description: 'Korte beschrijving van uw bedrijf voor SEO en social media',
              },
            },
            {
              name: 'kvkNumber',
              type: 'text',
              label: 'KVK Nummer',
              admin: {
                placeholder: '12345678',
              },
            },
            {
              name: 'vatNumber',
              type: 'text',
              label: 'BTW Nummer',
              admin: {
                placeholder: 'NL123456789B01',
              },
            },
          ],
        },

        // ─── TAB 2: CONTACT & ADRES (GECONSOLIDEERD) ───────────────
        {
          label: 'Contact & Adres',
          description: 'Contactgegevens en bezoekadres',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
              label: 'E-mailadres',
              admin: {
                placeholder: 'info@uwbedrijf.nl',
              },
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              label: 'Telefoonnummer',
              admin: {
                placeholder: '0251-247233',
              },
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: 'WhatsApp nummer',
              admin: {
                placeholder: '+31612345678',
                description: 'Voor WhatsApp Business integratie',
              },
            },
            {
              name: 'address',
              type: 'group',
              label: 'Adres',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Straat + Huisnummer',
                  admin: {
                    placeholder: 'Industrieweg 12',
                  },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'Postcode',
                  admin: {
                    placeholder: '1234 AB',
                  },
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'Plaats',
                  admin: {
                    placeholder: 'Amsterdam',
                  },
                },
                {
                  name: 'country',
                  type: 'text',
                  defaultValue: 'Nederland',
                  label: 'Land',
                },
                {
                  name: 'showOnSite',
                  type: 'checkbox',
                  label: 'Toon op website',
                  defaultValue: true,
                  admin: {
                    description: 'Adres zichtbaar maken op contact pagina',
                  },
                },
              ],
            },
          ],
        },

        // ─── TAB 3: SOCIAL MEDIA ───────────────────────────────────
        {
          label: 'Social Media',
          description: 'Social media links',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook URL',
              admin: {
                placeholder: 'https://facebook.com/uwbedrijf',
              },
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram URL',
              admin: {
                placeholder: 'https://instagram.com/uwbedrijf',
              },
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn URL',
              admin: {
                placeholder: 'https://linkedin.com/company/uwbedrijf',
              },
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'X (Twitter) URL',
              admin: {
                placeholder: 'https://twitter.com/uwbedrijf',
              },
            },
            {
              name: 'youtube',
              type: 'text',
              label: 'YouTube URL',
              admin: {
                placeholder: 'https://youtube.com/@uwbedrijf',
              },
            },
            {
              name: 'tiktok',
              type: 'text',
              label: 'TikTok URL',
              admin: {
                placeholder: 'https://tiktok.com/@uwbedrijf',
              },
            },
          ],
        },

        // ─── TAB 4: OPENINGSTIJDEN ─────────────────────────────────
        {
          label: 'Openingstijden',
          description: 'Kantoor/winkel openingstijden',
          fields: [
            {
              name: 'hours',
              type: 'array',
              label: 'Openingstijden',
              maxRows: 7,
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  label: 'Dag',
                  options: [
                    { label: 'Maandag', value: 'monday' },
                    { label: 'Dinsdag', value: 'tuesday' },
                    { label: 'Woensdag', value: 'wednesday' },
                    { label: 'Donderdag', value: 'thursday' },
                    { label: 'Vrijdag', value: 'friday' },
                    { label: 'Zaterdag', value: 'saturday' },
                    { label: 'Zondag', value: 'sunday' },
                  ],
                },
                {
                  name: 'open',
                  type: 'checkbox',
                  label: 'Open',
                  defaultValue: true,
                },
                {
                  name: 'from',
                  type: 'text',
                  label: 'Van',
                  admin: {
                    placeholder: '09:00',
                  },
                },
                {
                  name: 'to',
                  type: 'text',
                  label: 'Tot',
                  admin: {
                    placeholder: '17:00',
                  },
                },
              ],
            },
            {
              name: 'hoursNote',
              type: 'text',
              label: 'Aanvullende info',
              admin: {
                placeholder: 'Bijv. "Op afspraak" of "Behalve feestdagen"',
              },
            },
          ],
        },

        // ─── TAB 5: TEMPLATES (Product, Blog, Shop Archive, Cart, Checkout, My Account) ──────────
        {
          label: 'Templates',
          description: 'Visuele templates voor alle pagina types',
          fields: [
            ...featureField('shop', {
              name: 'defaultProductTemplate',
              type: 'select',
              label: 'Standaard Product Template',
              defaultValue: 'template1',
              options: [
                { label: 'Template 1 - Enterprise (Volledig, B2B features)', value: 'template1' },
                { label: 'Template 2 - Minimal (Clean, modern)', value: 'template2' },
                { label: 'Template 3 - Luxury (Premium, elegant)', value: 'template3' },
                { label: 'Template 4 - Ultimate (18 componenten, 54 product-types ready)', value: 'template4' },
              ],
              admin: {
                description: 'Template voor product detail pagina\'s',
              },
            }),
            ...featureField('blog', {
              name: 'defaultBlogTemplate',
              type: 'select',
              label: 'Standaard Blog Template',
              defaultValue: 'blogtemplate1',
              options: [
                { label: 'Blog Template 1 - Magazine (2-kolom, sidebar)', value: 'blogtemplate1' },
                { label: 'Blog Template 2 - Minimal (Centered, clean)', value: 'blogtemplate2' },
                { label: 'Blog Template 3 - Premium (Wide, elegant)', value: 'blogtemplate3' },
              ],
              admin: {
                description: 'Template voor blog post pagina\'s',
              },
            }),
            ...featureField('shop', {
              name: 'defaultShopArchiveTemplate',
              type: 'select',
              label: 'Standaard Shop Archive Template',
              defaultValue: 'shoparchivetemplate1',
              options: [
                { label: 'Shop Archive Template 1 - Enterprise (Volledig, filters, stats)', value: 'shoparchivetemplate1' },
                // Template 2 and 3 will be added later
              ],
              admin: {
                description: 'Template voor shop/producten overzichtspagina',
              },
            }),
            ...featureField('checkout', {
              name: 'checkoutFlow',
              type: 'select',
              label: 'Checkout Flow',
              defaultValue: 'premium',
              options: [
                { label: 'Premium — Visuele stepper, multi-step checkout', value: 'premium' },
                { label: 'Efficiënt — Compact B2B, one-step checkout', value: 'efficient' },
                { label: 'Klassiek — Card layout, one-step checkout', value: 'classic' },
              ],
              admin: {
                description: 'Bepaalt welke cart- en checkout templates samen worden gebruikt. Elke flow biedt een consistente ervaring van winkelwagen tot bevestiging.',
              },
            }),
            {
              name: 'defaultMyAccountTemplate',
              type: 'select',
              label: 'Standaard My Account Template',
              defaultValue: 'myaccounttemplate1',
              options: [
                { label: 'My Account Template 1 - Enterprise (Dashboard, stats, quick actions)', value: 'myaccounttemplate1' },
                // Template 2 will be simpler list view
              ],
              admin: {
                description: 'Template voor mijn account pagina\'s',
              },
            },
          ],
        },

        // ─── TAB 6: TRUST BADGES & CERTIFICATEN ────────────────────
        {
          label: 'Trust Badges',
          description: 'Certificaten, keurmerken en vertrouwen',
          fields: [
            {
              name: 'certifications',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Certificaten & Keurmerken',
              admin: {
                description: 'Bijv: ISO, CE, Thuiswinkel Waarborg badges',
              },
            },
            {
              name: 'paymentMethods',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: "Betaalmethode Logo's",
              admin: {
                description: 'iDEAL, Visa, Mastercard, etc.',
              },
            },
            {
              name: 'trustIndicators',
              type: 'group',
              label: 'Vertrouwensindicatoren',
              fields: [
                {
                  name: 'trustScore',
                  type: 'number',
                  label: 'Waarderingscijfer',
                  admin: {
                    step: 0.1,
                    placeholder: '4.8',
                  },
                },
                {
                  name: 'trustSource',
                  type: 'text',
                  label: 'Bron',
                  admin: {
                    placeholder: 'Google Reviews',
                  },
                },
                {
                  name: 'yearsInBusiness',
                  type: 'number',
                  label: 'Jaren actief',
                  admin: {
                    placeholder: '30',
                  },
                },
                {
                  name: 'customersServed',
                  type: 'number',
                  label: 'Aantal klanten',
                  admin: {
                    placeholder: '5000',
                  },
                },
              ],
            },
          ],
        },

        // ─── TAB 7: BRANDING ──────────────────────────────────────
        {
          label: 'Branding',
          description: "Logo's en kleuren (alleen admin)",
          access: {
            update: ({ req: { user } }) => checkRole(['admin'], user),
          },
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: 'Primaire logo voor de website',
              },
            },
            {
              name: 'logoWhite',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (wit)',
              admin: {
                description: 'Witte versie voor donkere achtergronden',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'Browser tab icoon (32x32 of 64x64 PNG)',
              },
            },
            {
              name: 'primaryColor',
              type: 'text',
              label: 'Primaire kleur (hex)',
              admin: {
                placeholder: '#0066CC',
                description: 'Hoofdkleur van uw huisstijl',
              },
            },
            {
              name: 'accentColor',
              type: 'text',
              label: 'Accentkleur (hex)',
              admin: {
                placeholder: '#FF6B00',
                description: 'Secundaire kleur voor accenten',
              },
            },
          ],
        },

        // ─── TAB 8: TRACKING ──────────────────────────────────────
        {
          label: 'Tracking',
          description: 'Analytics en tracking codes (alleen admin)',
          access: {
            update: ({ req: { user } }) => checkRole(['admin'], user),
          },
          fields: [
            {
              name: 'ga4Id',
              type: 'text',
              label: 'Google Analytics 4 ID',
              admin: {
                placeholder: 'G-XXXXXXXXXX',
              },
            },
            {
              name: 'gtmId',
              type: 'text',
              label: 'Google Tag Manager ID',
              admin: {
                placeholder: 'GTM-XXXXXXX',
              },
            },
            {
              name: 'facebookPixel',
              type: 'text',
              label: 'Facebook Pixel ID',
              admin: {
                placeholder: '123456789012345',
              },
            },
          ],
        },

        // ─── TAB 9: SEO ───────────────────────────────────────────
        {
          label: 'SEO',
          description: 'Zoekmachine optimalisatie instellingen',
          access: {
            update: ({ req: { user } }) => checkRole(['admin'], user),
          },
          fields: [
            // ─── Google Verificatie ───────────────────────────────
            {
              name: 'googleSiteVerification',
              type: 'text',
              label: 'Google Site Verification Code',
              admin: {
                placeholder: 'abc123...',
                description: 'Van Google Search Console voor eigendom verificatie',
              },
            },

            // ─── Default SEO Values ────────────────────────────────
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              label: 'Standaard Meta Beschrijving',
              admin: {
                rows: 3,
                description: 'Gebruikt als fallback voor pagina\'s zonder eigen beschrijving',
              },
            },
            {
              name: 'defaultOGImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Standaard Open Graph Afbeelding',
              admin: {
                description: 'Voor social sharing (1200x630px aanbevolen)',
              },
            },

            // ─── Structured Data ───────────────────────────────────
            {
              name: 'businessCategory',
              type: 'text',
              label: 'Business Categorie',
              admin: {
                placeholder: 'Medical Equipment Supplier',
                description: 'Voor LocalBusiness schema.org markup',
              },
            },
            {
              name: 'geo',
              type: 'group',
              label: 'Geo Coördinaten',
              admin: {
                description: 'Voor LocalBusiness schema - helpt Google Maps integratie',
              },
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                  label: 'Latitude',
                  admin: {
                    placeholder: '52.3676',
                    description: 'Breedtegraad (decimaal)',
                  },
                },
                {
                  name: 'longitude',
                  type: 'number',
                  label: 'Longitude',
                  admin: {
                    placeholder: '4.9041',
                    description: 'Lengtegraad (decimaal)',
                  },
                },
              ],
            },
            {
              name: 'priceRange',
              type: 'text',
              label: 'Prijsklasse',
              admin: {
                placeholder: '€€ - €€€',
                description: 'Voor LocalBusiness schema (optioneel)',
              },
            },

            // ─── Sitemap Settings ──────────────────────────────────
            {
              name: 'sitemapEnabled',
              type: 'checkbox',
              label: 'Sitemap Inschakelen',
              defaultValue: true,
              admin: {
                description: 'Automatische sitemap.xml generatie',
              },
            },
            {
              name: 'sitemapExclude',
              type: 'array',
              label: 'Pagina\'s Uitsluiten van Sitemap',
              admin: {
                description: 'Voeg slugs toe die NIET in sitemap moeten (bijv: "preview", "test")',
              },
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'preview',
                  },
                },
              ],
            },

            // ─── Robots.txt Settings ───────────────────────────────
            {
              name: 'robotsDisallow',
              type: 'array',
              label: 'Robots.txt Extra Disallow Paths',
              admin: {
                description: 'Extra paths om te blokkeren (naast /admin en /api)',
              },
              fields: [
                {
                  name: 'path',
                  type: 'text',
                  admin: {
                    placeholder: '/private',
                  },
                },
              ],
            },

            // ─── Advanced Features ─────────────────────────────────
            {
              name: 'enableAutoOGImages',
              type: 'checkbox',
              label: 'Automatische OG Images',
              defaultValue: true,
              admin: {
                description: 'Genereer automatisch branded OG images voor pagina\'s zonder eigen afbeelding',
              },
            },
            {
              name: 'enableJSONLD',
              type: 'checkbox',
              label: 'JSON-LD Structured Data',
              defaultValue: true,
              admin: {
                description: 'Automatische schema.org markup voor betere Google rich results',
              },
            },
          ],
        },
      ],
    },
  ],
}

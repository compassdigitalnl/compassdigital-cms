import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Ontwerp',
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
        // Tab 1: Brand Section
        {
          label: 'Merk & Branding',
          fields: [
            {
              name: 'logoType',
              type: 'select',
              label: 'Logo type',
              defaultValue: 'text',
              options: [
                { label: 'Tekst logo', value: 'text' },
                { label: 'Afbeelding', value: 'image' },
              ],
              admin: {
                description: 'Kies tussen een tekst logo of een afbeelding',
              },
            },
            {
              name: 'logoText',
              type: 'text',
              label: 'Logo tekst',
              admin: {
                condition: (data) => data.logoType === 'text',
                description: 'Bijvoorbeeld: "compass" of "My Company"',
              },
            },
            {
              name: 'logoAccent',
              type: 'text',
              label: 'Logo accent tekst',
              admin: {
                condition: (data) => data.logoType === 'text',
                description: 'Optioneel: wordt in teal kleur weergegeven (bijv. "design")',
              },
            },
            {
              name: 'logoImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo afbeelding',
              admin: {
                condition: (data) => data.logoType === 'image',
                description: 'Upload een logo afbeelding (aanbevolen: transparante PNG)',
              },
            },
            {
              name: 'tagline',
              type: 'textarea',
              label: 'Tagline / Beschrijving',
              maxLength: 200,
              admin: {
                description: 'Korte beschrijving van je bedrijf (max 200 karakters)',
                placeholder:
                  'Sinds 1994 leverancier van professionele medische disposables...',
              },
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social media links',
              maxRows: 6,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  label: 'Platform',
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'URL',
                  admin: {
                    placeholder: 'https://linkedin.com/company/...',
                  },
                },
              ],
              admin: {
                description: 'Voeg social media links toe (max 6)',
              },
            },
          ],
        },
        // Tab 2: Navigation Columns
        {
          label: 'Navigatie Kolommen',
          fields: [
            {
              name: 'columns',
              type: 'array',
              label: 'Footer kolommen',
              maxRows: 3,
              admin: {
                description: 'Maximaal 3 navigatie kolommen naast de merk kolom',
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Kolom titel',
                  required: true,
                  admin: {
                    placeholder: 'Categorieën',
                  },
                },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Links',
                  maxRows: 8,
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: 'Tekst',
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      label: 'Icoon',
                      admin: {
                        description: 'Optioneel: Lucide icon naam (bijv. "arrow-right")',
                        placeholder: 'arrow-right',
                      },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'page',
                      options: [
                        { label: 'Pagina', value: 'page' },
                        { label: 'Externe URL', value: 'external' },
                      ],
                    },
                    {
                      name: 'page',
                      type: 'relationship',
                      relationTo: 'pages',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'page',
                      },
                    },
                    {
                      name: 'externalUrl',
                      type: 'text',
                      label: 'Externe URL',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'external',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 3: Contact Information
        {
          label: 'Contactgegevens',
          fields: [
            {
              name: 'showContactColumn',
              type: 'checkbox',
              label: 'Toon contact kolom',
              defaultValue: true,
              admin: {
                description: 'Voeg een contact kolom toe met telefoonnummer, email, adres en openingstijden',
              },
            },
            {
              name: 'contactHeading',
              type: 'text',
              label: 'Contact kolom titel',
              defaultValue: 'Contact',
              admin: {
                condition: (data) => data.showContactColumn,
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Telefoonnummer',
              admin: {
                condition: (data) => data.showContactColumn,
                placeholder: '0251-247233',
              },
            },
            {
              name: 'email',
              type: 'text',
              label: 'E-mail',
              admin: {
                condition: (data) => data.showContactColumn,
                placeholder: 'info@compass.nl',
              },
            },
            {
              name: 'address',
              type: 'text',
              label: 'Adres',
              admin: {
                condition: (data) => data.showContactColumn,
                placeholder: 'Parallelweg 124, Beverwijk',
              },
            },
            {
              name: 'openingHours',
              type: 'text',
              label: 'Openingstijden',
              admin: {
                condition: (data) => data.showContactColumn,
                placeholder: 'Ma-Vr 08:30-17:00',
              },
            },
          ],
        },
        // Tab 4: Trust Badges
        {
          label: 'Trust Badges',
          fields: [
            {
              name: 'trustBadges',
              type: 'array',
              label: 'Trust badges',
              maxRows: 8,
              admin: {
                description: 'Certificeringen, betaalmethoden, verzending, etc. met groene vinkjes',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icoon',
                  defaultValue: 'check',
                  options: [
                    { label: 'Vinkje (check)', value: 'check' },
                    { label: 'Schild (shield-check)', value: 'shield-check' },
                    { label: 'Ster (star)', value: 'star' },
                    { label: 'Award', value: 'award' },
                    { label: 'Lock', value: 'lock' },
                    { label: 'Truck', value: 'truck' },
                  ],
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Tekst',
                  admin: {
                    placeholder: 'ISO 13485 gecertificeerd',
                  },
                },
              ],
            },
          ],
        },
        // Tab 5: Copyright & Legal
        {
          label: 'Copyright & Juridisch',
          fields: [
            {
              name: 'copyrightText',
              type: 'text',
              label: 'Copyright tekst',
              defaultValue: '© 2026 Compass B.V. — Alle rechten voorbehouden',
              admin: {
                description: 'Tekst voor de copyright notice',
                placeholder: '© 2026 Bedrijfsnaam — Alle rechten voorbehouden',
              },
            },
            {
              name: 'legalLinks',
              type: 'array',
              label: 'Juridische links',
              maxRows: 5,
              admin: {
                description: 'Algemene voorwaarden, privacy, cookies, etc.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Tekst',
                  admin: {
                    placeholder: 'Algemene voorwaarden',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'page',
                  options: [
                    { label: 'Pagina', value: 'page' },
                    { label: 'Externe URL', value: 'external' },
                  ],
                },
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'page',
                  },
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  label: 'Externe URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'external',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Legacy fields for backward compatibility (hidden)
    {
      name: 'bottomText',
      type: 'richText',
      label: 'Ondertekst (copyright etc.)',
      admin: {
        hidden: true,
        description: 'DEPRECATED: Gebruik nu de Copyright & Juridisch tab',
      },
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      label: 'Toon social media links',
      defaultValue: true,
      admin: {
        hidden: true,
        description: 'DEPRECATED: Gebruik nu de Merk & Branding tab',
      },
    },
  ],
}

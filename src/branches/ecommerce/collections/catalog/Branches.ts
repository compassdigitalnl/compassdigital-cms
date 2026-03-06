import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

export const Branches: CollectionConfig = {
  slug: 'branches',
  labels: {
    singular: 'Branche',
    plural: 'Branches',
  },
  admin: {
    useAsTitle: 'name',
    group: 'E-commerce',
    defaultColumns: ['name', 'slug', 'featured', 'order', 'visible', 'updatedAt'],
    description: 'Branches zoals Huisartsen, Tandartsen, Fysiotherapie, etc.',
    hidden: shouldHideCollection('shop'),
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
      label: 'Branchenaam',
      admin: {
        description: 'Bijv: Huisartsen, Tandartsen, Fysiotherapie',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description: 'Automatisch gegenereerd uit de naam',
      },
      hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icoon',
      admin: {
        description: 'Lucide icoon naam (bijv: Stethoscope, HeartPulse)',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge',
      defaultValue: 'Branche',
      admin: {
        description: 'Label boven de titel (standaard: "Branche")',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Hero Titel',
      admin: {
        description: 'Hoofdtitel op de branche-detailpagina',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        description: 'Korte beschrijving van de branche',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Afbeelding',
      admin: {
        description: 'Afbeelding voor het branche-overzicht',
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistieken',
      maxRows: 4,
      admin: {
        description: 'Hero statistieken (bijv: "1.240 Producten")',
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
    {
      name: 'uspCards',
      type: 'array',
      label: 'USP Kaarten',
      maxRows: 6,
      admin: {
        description: 'Unique Selling Points voor deze branche',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icoon',
          admin: {
            description: 'Lucide icoon naam (bijv: Tag, Truck)',
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
            description: 'CSS achtergrondkleur (bijv: var(--color-primary-glow))',
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
      label: 'Klantgetuigenis',
      fields: [
        {
          name: 'initials',
          type: 'text',
          label: 'Initialen',
          admin: {
            description: 'Bijv: JV',
          },
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
    {
      name: 'ctaTitle',
      type: 'text',
      label: 'CTA Titel',
      admin: {
        description: 'Call-to-action titel onderaan de pagina',
      },
    },
    {
      name: 'ctaDescription',
      type: 'text',
      label: 'CTA Beschrijving',
      admin: {
        description: 'Call-to-action beschrijving',
      },
    },
    // Sidebar fields
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon als uitgelichte branche',
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
        description: 'Tonen in branche-overzicht',
      },
    },
    // SEO Fields
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'SEO titel voor de branchepagina',
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
}
export default Branches

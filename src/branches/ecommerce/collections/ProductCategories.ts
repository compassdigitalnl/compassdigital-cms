import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'
import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
  InlineCodeFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: 'Product Categorie',
    plural: 'Product Categorieën',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Producten',
    hidden: shouldHideCollection('shop'),
  },
  access: {
    read: () => true, // Categories are publicly accessible (webshop navigation)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-gegenereerd uit naam (kan handmatig overschreven worden)',
      },
      hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Pagina Content',
      admin: {
        description: 'Rich text content die onder de producten op de categoriepagina verschijnt',
      },
      editor: lexicalEditor({
        features: () => [
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
          InlineCodeFeature(),
        ],
      }),
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'product-categories',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'level',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
    },
    // ═══════════════════════════════════════════════════════════
    // NAVIGATION FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'icon',
      type: 'text',
      label: 'Icon',
      admin: {
        description: 'Emoji of Lucide icon naam (bijv. 🩺 of "Stethoscope")',
        placeholder: '🩺',
      },
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      label: 'Tonen in navigatie',
      defaultValue: true,
      admin: {
        description: 'Toon deze categorie in de hoofdnavigatie balk (alleen voor level 0 categorieën)',
        condition: (data) => !data.parent, // Alleen voor root categorieën
      },
    },
    {
      name: 'navigationOrder',
      type: 'number',
      label: 'Navigatie volgorde',
      defaultValue: 0,
      admin: {
        description: 'Volgorde in de navigatie balk (lager getal = eerder getoond)',
        condition: (data) => !data.parent && data.showInNavigation, // Alleen relevant als showInNavigation = true
      },
    },
    // ═══════════════════════════════════════════════════════════
    // MEGA MENU PROMO BANNER (OPTIONAL)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'promoBanner',
      type: 'group',
      label: 'Mega Menu Promo Banner',
      admin: {
        description: 'Optionele promo banner die verschijnt in het mega menu voor deze categorie',
        condition: (data) => !data.parent, // Alleen voor root categorieën
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Promo banner tonen',
          defaultValue: false,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Ondertitel',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Banner afbeelding',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button tekst',
          admin: {
            placeholder: 'Bekijk aanbiedingen',
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Button link',
          admin: {
            placeholder: '/shop?badge=sale',
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
  ],
}
export default ProductCategories

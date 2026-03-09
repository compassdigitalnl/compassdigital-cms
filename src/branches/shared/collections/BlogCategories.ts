import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  labels: {
    singular: 'Blog Categorie',
    plural: 'Blog Categorieën',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Website',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    hidden: shouldHideCollection('blog'),
  },
  access: {
    read: () => true, // Public toegang voor blog categorieën
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-generate slug from name if not provided
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Categorie Naam',
      admin: {
        placeholder: 'Bijv: Handleidingen, Tips & tricks, Productnieuws',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Auto-gegenereerd uit categorie naam. Gebruikt in URL: /blog/{slug}',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'blog-categories',
      label: 'Bovenliggende Categorie',
      admin: {
        description: 'Optioneel: maak dit een subcategorie van een andere categorie (hierarchisch)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        description: 'Korte beschrijving van deze categorie (optioneel, gebruikt in SEO)',
        rows: 3,
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      defaultValue: 'BookOpen',
      options: [
        { label: '📖 Book Open (Handleidingen)', value: 'BookOpen' },
        { label: '💡 Lightbulb (Tips & tricks)', value: 'Lightbulb' },
        { label: '✨ Sparkles (Productnieuws)', value: 'Sparkles' },
        { label: '🩺 Stethoscope (Praktijkinrichting)', value: 'Stethoscope' },
        { label: '🛡️ Shield Check (Hygiëne & veiligheid)', value: 'ShieldCheck' },
        { label: '📰 Newspaper (Nieuws)', value: 'Newspaper' },
        { label: '🎓 GraduationCap (Educatie)', value: 'GraduationCap' },
        { label: '🔬 Microscope (Onderzoek)', value: 'Microscope' },
        { label: '⚙️ Settings (Techniek)', value: 'Settings' },
        { label: '📊 TrendingUp (Trends)', value: 'TrendingUp' },
        { label: '🎯 Target (Tips)', value: 'Target' },
        { label: '🔧 Wrench (Onderhoud)', value: 'Wrench' },
      ],
      admin: {
        description: 'Lucide icon voor categorie badges en chips',
      },
    },
    {
      name: 'color',
      type: 'select',
      label: 'Kleur',
      defaultValue: 'teal',
      options: [
        { label: '🟦 Teal (Standaard)', value: 'teal' },
        { label: '🔵 Blue', value: 'blue' },
        { label: '🟢 Green', value: 'green' },
        { label: '🔴 Coral (Rood)', value: 'coral' },
        { label: '🟣 Purple', value: 'purple' },
        { label: '🟠 Amber (Oranje)', value: 'amber' },
        { label: '🌸 Pink', value: 'pink' },
      ],
      admin: {
        description: 'Kleur voor categorie badges en article cards (gebruikt CSS custom properties)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Categorie Afbeelding',
      admin: {
        description: 'Optionele header afbeelding voor categorie overzichtspagina',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        description: 'Sorteervolgorde (lager = eerder)',
      },
    },
  ],
}

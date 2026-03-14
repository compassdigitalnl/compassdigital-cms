import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlug } from '@/utilities/slugify'

/**
 * Course Categories Collection — Onderwijs Branch
 *
 * Cursuscategorieën voor het organiseren en filteren van cursussen.
 * Ondersteunt iconen, kleuren en uitgelichte categorieën.
 */
export const CourseCategories: CollectionConfig = {
  slug: 'course-categories',
  labels: {
    singular: 'Cursuscategorie',
    plural: 'Cursuscategorieën',
  },
  admin: {
    group: 'Onderwijs',
    useAsTitle: 'name',
    defaultColumns: ['name', 'courseCount', 'featured'],
    hidden: shouldHideCollection(),
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
        description: 'Bijv. "Development", "Business", "Design"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      hooks: {
        beforeValidate: [autoGenerateSlug],
      },
      admin: {
        description: 'Automatisch gegenereerd uit de naam',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icoon',
      admin: {
        description: 'Lucide icon naam (bijv. "code", "briefcase", "palette")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Kleur',
      admin: {
        description: 'Hex kleurcode voor achtergrond (bijv. "#3B82F6")',
      },
    },
    {
      name: 'courseCount',
      type: 'number',
      label: 'Aantal cursussen',
      defaultValue: 0,
      admin: {
        description: 'Wordt automatisch bijgewerkt',
        readOnly: true,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
    },
  ],
}

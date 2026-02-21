import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const ConstructionReviews: CollectionConfig = {
  slug: 'construction-reviews',
  labels: {
    singular: 'Bouw Review',
    plural: 'Bouw Reviews',
  },
  access: {
    read: publicAccess,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('construction'),
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'rating', 'featured', 'status', 'updatedAt'],
    group: 'Construction',
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Klant naam',
      admin: {
        description: 'Naam van de klant',
      },
    },
    {
      name: 'clientRole',
      type: 'text',
      label: 'Klant rol',
      admin: {
        description: 'Bijv. "Eigenaar villa", "Projectleider", etc.',
      },
    },
    {
      name: 'clientInitials',
      type: 'text',
      label: 'Initialen',
      maxLength: 3,
      admin: {
        description: 'Initialen voor avatar (bijv. "JD")',
        position: 'sidebar',
      },
    },
    {
      name: 'clientColor',
      type: 'select',
      label: 'Avatar kleur',
      options: [
        { label: 'Teal', value: 'teal' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Purple', value: 'purple' },
        { label: 'Amber', value: 'amber' },
        { label: 'Coral', value: 'coral' },
      ],
      defaultValue: 'teal',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Beoordeling',
      admin: {
        description: 'Sterren beoordeling (1-5)',
        position: 'sidebar',
        step: 0.5,
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Quote',
      admin: {
        description: 'De testimonial tekst',
        rows: 4,
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'construction-projects',
      label: 'Gerelateerd project',
      admin: {
        description: 'Optioneel: koppel aan een project',
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'construction-services',
      label: 'Gerelateerde dienst',
      admin: {
        description: 'Optioneel: koppel aan een dienst',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        description: 'Toon op homepage',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default ConstructionReviews

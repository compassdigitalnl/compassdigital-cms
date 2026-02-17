import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const ServicesCollection: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured', 'updatedAt'],
    hidden: ({ user }) => checkRole(['admin'], user),
  },
  access: {
    read: () => true, // Publiek leesbaar (frontend)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Service Naam',
      admin: {
        description: 'Bijv. "Website Development", "SEO Optimalisatie", "24/7 Support"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Beschrijving',
      admin: {
        rows: 3,
        description: 'Korte beschrijving van de dienst/feature',
      },
    },
    {
      name: 'iconType',
      type: 'select',
      label: 'Icon Type',
      defaultValue: 'lucide',
      options: [
        { label: 'Lucide Icon (recommended)', value: 'lucide' },
        { label: 'Upload Custom Icon', value: 'upload' },
      ],
      admin: {
        description: 'Kies tussen Lucide icon library of upload een eigen icon',
      },
    },
    {
      name: 'iconName',
      type: 'text',
      label: 'Lucide Icon',
      admin: {
        description: 'Bijv: Shield, Truck, Award, CheckCircle, Zap',
        placeholder: 'Shield',
        condition: (data) => data?.iconType === 'lucide',
        components: {
          Field: '@/components/IconPickerField#IconPickerField',
        },
      },
    },
    {
      name: 'iconUpload',
      type: 'upload',
      relationTo: 'media',
      label: 'Upload Custom Icon',
      admin: {
        description: 'Upload een SVG/PNG icon (alleen gebruikt als Icon Type = Upload)',
        condition: (data) => data?.iconType === 'upload',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link (optioneel)',
      admin: {
        placeholder: '/diensten/website-development',
        description: 'Link naar meer informatie over deze dienst',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      defaultValue: 'algemeen',
      options: [
        { label: 'Algemeen', value: 'algemeen' },
        { label: 'Technische Diensten', value: 'technisch' },
        { label: 'Marketing & SEO', value: 'marketing' },
        { label: 'Support & Service', value: 'support' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Training & Educatie', value: 'training' },
        { label: 'USPs (Unique Selling Points)', value: 'usps' },
      ],
      admin: {
        description: 'Categoriseer de dienst voor betere filtering',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        description: 'Toon deze dienst op homepage of belangrijke pagina\'s',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        description: 'Sorteer volgorde (lager = eerder getoond)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Gepubliceerd', value: 'published' },
        { label: 'Concept', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

import type { Block } from 'payload'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features / USPs',
    plural: 'Features / USPs',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              admin: {
                description: 'Optional heading for the features section',
                placeholder: 'Waarom kiezen voor ons?',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                rows: 2,
                description: 'Optional introduction text',
              },
            },
            {
              name: 'features',
              type: 'array',
              label: 'Features / USPs',
              minRows: 2,
              maxRows: 12,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon (Lucide)',
                  required: true,
                  admin: {
                    description: 'Lucide icon name (e.g., Shield, Zap, Award, Truck)',
                    placeholder: 'Shield',
                    components: {
                      Field: '@/branches/shared/components/admin/IconPickerField#IconPickerField',
                    },
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                  admin: {
                    placeholder: '30+ jaar expertise',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  admin: {
                    rows: 2,
                    placeholder: 'Sinds 1994 actief als betrouwbare partner',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout',
              defaultValue: 'grid-3',
              required: true,
              options: [
                { label: '3 Columns', value: 'grid-3' },
                { label: '4 Columns', value: 'grid-4' },
                { label: 'List View', value: 'list' },
              ],
            },
            {
              name: 'iconStyle',
              type: 'select',
              label: 'Icon Style',
              defaultValue: 'glow',
              required: true,
              options: [
                { label: 'Glow (Teal background with shine)', value: 'glow' },
                { label: 'Solid (Filled background)', value: 'solid' },
                { label: 'Outlined (Border only)', value: 'outlined' },
              ],
              admin: {
                description: 'Visual style for the feature icons',
              },
            },
            {
              name: 'alignment',
              type: 'select',
              label: 'Content Alignment',
              defaultValue: 'center',
              required: true,
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Left', value: 'left' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

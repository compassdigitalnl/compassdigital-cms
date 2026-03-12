import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'
import { branchOptions } from '../../collections/Projects'

export const ProjectsGrid: Block = {
  slug: 'projectsGrid',
  interfaceName: 'ProjectsGridBlock',
  labels: {
    singular: 'Projecten Grid',
    plural: 'Projecten Grids',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heading',
              type: 'group',
              label: 'Koptekst',
              fields: [
                { name: 'badge', type: 'text', label: 'Badge' },
                { name: 'title', type: 'text', label: 'Titel' },
                { name: 'description', type: 'textarea', label: 'Beschrijving' },
              ],
            },
            {
              name: 'projectsSource',
              type: 'radio',
              label: 'Bron',
              defaultValue: 'auto',
              options: [
                { label: 'Automatisch (nieuwste)', value: 'auto' },
                { label: 'Alleen uitgelicht', value: 'featured' },
                { label: 'Handmatig kiezen', value: 'manual' },
                { label: 'Per branche', value: 'branch' },
              ],
            },
            {
              name: 'projects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              label: 'Projecten',
              admin: {
                condition: (_, siblingData) => siblingData?.projectsSource === 'manual',
              },
            },
            {
              name: 'branch',
              type: 'select',
              label: 'Branche filter',
              options: branchOptions,
              admin: {
                condition: (_, siblingData) => siblingData?.projectsSource === 'branch',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Maximum aantal',
              defaultValue: 6,
              min: 1,
              max: 12,
              admin: {
                condition: (_, siblingData) => siblingData?.projectsSource !== 'manual',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'columns',
              type: 'select',
              label: 'Kolommen',
              defaultValue: '3',
              options: [
                { label: '2 kolommen', value: '2' },
                { label: '3 kolommen', value: '3' },
                { label: '4 kolommen', value: '4' },
              ],
            },
            {
              name: 'showFilter',
              type: 'checkbox',
              label: 'Toon branche filter',
              defaultValue: false,
            },
            {
              name: 'ctaButton',
              type: 'group',
              label: 'CTA knop',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Toon knop', defaultValue: false },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Knop tekst',
                  defaultValue: 'Bekijk alle projecten',
                  admin: { condition: (_, siblingData) => siblingData?.enabled },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link',
                  defaultValue: '/projects',
                  admin: { condition: (_, siblingData) => siblingData?.enabled },
                },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}

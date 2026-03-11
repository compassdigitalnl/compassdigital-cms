import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-10 - Team Block Configuration
 *
 * Team member display with grid or list layout.
 * Configurable columns, photos, social links.
 */

export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Team',
    plural: 'Team',
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
              label: 'Titel',
              admin: {
                description: 'Sectiekop boven het team (bijv. "Ons Team")',
                placeholder: 'Ons Team',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Ondertitel',
              admin: {
                description: 'Optionele tekst onder de titel',
                placeholder: 'De mensen achter het platform',
              },
            },
            {
              name: 'members',
              type: 'array',
              label: 'Teamleden',
              minRows: 1,
              maxRows: 24,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Naam',
                  required: true,
                  admin: {
                    placeholder: 'Jan de Vries',
                  },
                },
                {
                  name: 'role',
                  type: 'text',
                  label: 'Functie',
                  admin: {
                    placeholder: 'CEO & Oprichter',
                  },
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  label: 'Bio',
                  admin: {
                    description: 'Korte biografie (2-3 zinnen)',
                    rows: 3,
                    placeholder: 'Meer dan 15 jaar ervaring in digitale transformatie.',
                  },
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Foto',
                  admin: {
                    description: 'Profielfoto (aanbevolen: vierkant, minimaal 400x400px)',
                  },
                },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Sociale links',
                  maxRows: 5,
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      label: 'Platform',
                      required: true,
                      options: [
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Twitter / X', value: 'twitter' },
                        { label: 'E-mail', value: 'email' },
                      ],
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                      admin: {
                        placeholder: 'https://linkedin.com/in/voorbeeld',
                      },
                    },
                  ],
                  admin: {
                    description: 'Optionele sociale media- of contactlinks',
                    initCollapsed: true,
                  },
                },
              ],
              admin: {
                description: 'Voeg teamleden toe met foto, naam, functie en optionele links.',
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'layout',
              type: 'select',
              label: 'Weergave',
              defaultValue: 'grid',
              options: [
                { label: 'Grid (kaarten)', value: 'grid' },
                { label: 'Lijst (horizontaal)', value: 'list' },
              ],
              admin: {
                description: 'Grid toont kaarten, lijst toont horizontale rijen',
              },
            },
            {
              name: 'columns',
              type: 'select',
              label: 'Kolommen (grid)',
              defaultValue: '3',
              options: [
                { label: '2 kolommen', value: '2' },
                { label: '3 kolommen', value: '3' },
                { label: '4 kolommen', value: '4' },
              ],
              admin: {
                description: 'Aantal kolommen op desktop (alleen bij grid-weergave)',
                condition: (data, siblingData) => siblingData?.layout !== 'list',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}

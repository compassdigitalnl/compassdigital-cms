import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-42 LogoBar Block (was: CustomerLogoBar)
 *
 * Generic logo bar for clients, certifications, or partners.
 * Static grid or infinite scroll animation. Grayscale filter with color on hover.
 */
export const LogoBar: Block = {
  slug: 'logoBar',
  interfaceName: 'LogoBarBlock',
  labels: {
    singular: 'Logo Bar',
    plural: 'Logo Bars',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'context',
              type: 'select',
              label: 'Context',
              defaultValue: 'customers',
              options: [
                { label: 'Klanten', value: 'customers' },
                { label: 'Certificeringen / Keurmerken', value: 'certifications' },
                { label: 'Partners', value: 'partners' },
              ],
              admin: {
                description: 'Bepaalt de standaard titel en styling',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Titel',
              admin: {
                placeholder: 'bijv. Vertrouwd door',
                description: 'Optionele koptekst boven de logo\'s. Laat leeg voor context-default.',
              },
            },
            {
              name: 'logos',
              type: 'array',
              label: 'Logo\'s',
              minRows: 1,
              admin: {
                description: 'Logo\'s van klanten, certificeringen of partners.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                  required: true,
                  admin: {
                    description: 'PNG of SVG met transparante achtergrond (aanbevolen)',
                  },
                },
                {
                  name: 'name',
                  type: 'text',
                  label: 'Naam',
                  admin: {
                    placeholder: 'Bedrijf / Keurmerk',
                    description: 'Gebruikt voor alt-tekst (toegankelijkheid)',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link',
                  admin: {
                    placeholder: 'https://voorbeeld.nl',
                    description: 'Optionele link naar de website',
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
              label: 'Variant',
              defaultValue: 'static',
              options: [
                { label: 'Statisch (grid)', value: 'static' },
                { label: 'Scrollend (animatie)', value: 'scroll' },
              ],
              admin: {
                description: 'Statisch = grid layout. Scrollend = oneindige scroll animatie (CSS only).',
              },
            },
            {
              name: 'grayscale',
              type: 'checkbox',
              label: 'Grijstinten',
              defaultValue: true,
              admin: {
                description: 'Toon logo\'s in grijstinten met kleur bij hover',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}

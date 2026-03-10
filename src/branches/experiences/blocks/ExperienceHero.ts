import type { Block } from 'payload'

/**
 * Experience Hero Block
 *
 * Hero section for experiences/ervaringen pages.
 * Features: search bar, category pills, trust badges, background image.
 */
export const ExperienceHero: Block = {
  slug: 'experience-hero',
  interfaceName: 'ExperienceHeroBlock',
  labels: {
    singular: 'Ervaringen Hero',
    plural: 'Ervaringen Heroes',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Ontdek de leukste activiteiten',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Titel',
              required: true,
              defaultValue: 'Onvergetelijke ervaringen',
              admin: {
                placeholder: 'Jouw hoofdtitel hier...',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Omschrijving',
              admin: {
                rows: 2,
                placeholder: 'Korte omschrijving voor de hero sectie',
              },
            },
            {
              name: 'showSearchBar',
              type: 'checkbox',
              label: 'Toon zoekbalk',
              defaultValue: true,
              admin: {
                description: 'Toon de ervaringen zoekbalk in de hero',
              },
            },
            {
              name: 'showCategoryPills',
              type: 'checkbox',
              label: 'Toon categorie pills',
              defaultValue: true,
              admin: {
                description: 'Toon populaire categorieën als quick-filter pills',
              },
            },
            {
              name: 'trustBadges',
              type: 'array',
              label: 'Trust badges',
              maxRows: 4,
              admin: {
                description: 'Vertrouwens-indicatoren onder de zoekbalk',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Emoji/Icon',
                  admin: { placeholder: '⭐' },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                  admin: { placeholder: '4.8/5 gemiddeld' },
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Achtergrondafbeelding',
              admin: {
                description: 'Aanbevolen: 1920x800px, WebP format',
              },
            },
            {
              name: 'backgroundStyle',
              type: 'select',
              label: 'Achtergrond stijl',
              defaultValue: 'gradient',
              options: [
                { label: 'Gradient (Navy → Donker)', value: 'gradient' },
                { label: 'Afbeelding met overlay', value: 'image' },
                { label: 'Effen kleur', value: 'solid' },
              ],
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              label: 'Overlay opacity (%)',
              defaultValue: 60,
              min: 0,
              max: 100,
              admin: {
                condition: (_, siblingData) => siblingData?.backgroundStyle === 'image',
                description: '0 = transparant, 100 = volledig zwart',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default ExperienceHero

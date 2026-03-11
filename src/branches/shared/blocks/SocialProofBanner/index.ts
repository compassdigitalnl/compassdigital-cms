import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-41 SocialProofBanner Block
 *
 * Horizontal banner with big metrics numbers.
 * Dark navy, light, or gradient background. Centered layout.
 */
export const SocialProofBanner: Block = {
  slug: 'socialProofBanner',
  interfaceName: 'SocialProofBannerBlock',
  labels: {
    singular: 'Social Proof Banner',
    plural: 'Social Proof Banners',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'metrics',
              type: 'array',
              label: 'Statistieken',
              minRows: 1,
              maxRows: 6,
              admin: {
                description: 'Grote getallen met korte labels',
              },
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  label: 'Waarde',
                  required: true,
                  admin: {
                    placeholder: 'bijv. 10.000+',
                    description: 'Het grote getal of percentage',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                  admin: {
                    placeholder: 'bijv. tevreden klanten',
                    description: 'Beschrijving onder het getal',
                  },
                },
              ],
            },
            {
              name: 'trustText',
              type: 'text',
              label: 'Vertrouwenstekst',
              admin: {
                placeholder: 'Vertrouwd door bedrijven in heel Nederland',
                description: 'Optionele tekst onder de statistieken',
              },
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
              defaultValue: 'dark',
              options: [
                { label: 'Donker (navy)', value: 'dark' },
                { label: 'Licht (wit)', value: 'light' },
                { label: 'Gradient (teal)', value: 'gradient' },
              ],
              admin: {
                description: 'Achtergrondstijl van de banner',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}

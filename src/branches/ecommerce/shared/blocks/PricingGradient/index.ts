import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-17c Pricing Gradient Block
 *
 * E-commerce pricing table with gradient featured card,
 * billing toggle, and 4 variant layouts.
 */
export const PricingGradient: Block = {
  slug: 'pricingGradient',
  interfaceName: 'PricingGradientBlock',
  labels: {
    singular: 'Prijzen (Gradient)',
    plural: 'Prijzen (Gradient)',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'header',
              type: 'group',
              label: 'Header',
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Badge',
                  admin: {
                    placeholder: 'Eenvoudige prijzen',
                    description: 'Optioneel label boven de titel',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titel',
                  required: true,
                  admin: {
                    placeholder: 'Kies het plan dat bij u past',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                  admin: {
                    placeholder: 'Transparante prijzen zonder verrassingen',
                  },
                },
              ],
            },
            {
              name: 'billingToggle',
              type: 'group',
              label: 'Factureringsperiode',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Toon maandelijks/jaarlijks toggle',
                  defaultValue: true,
                },
                {
                  name: 'saveBadge',
                  type: 'text',
                  label: 'Bespaar badge',
                  admin: {
                    placeholder: 'Bespaar 20%',
                    description: 'Badge naast jaarlijks label wanneer actief',
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
              ],
            },
            {
              name: 'plans',
              type: 'array',
              label: 'Pakketten',
              minRows: 2,
              maxRows: 4,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Naam',
                  required: true,
                  admin: {
                    placeholder: 'Professional',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                  admin: {
                    placeholder: 'Perfect voor groeiende bedrijven',
                  },
                },
                {
                  name: 'isFeatured',
                  type: 'checkbox',
                  label: 'Uitgelicht (gradient kaart)',
                  defaultValue: false,
                  admin: {
                    description: 'Toon als uitgelichte kaart met gradient achtergrond',
                  },
                },
                {
                  name: 'featuredBadge',
                  type: 'text',
                  label: 'Uitgelicht badge',
                  admin: {
                    placeholder: 'Meest gekozen',
                    condition: (data, siblingData) => siblingData?.isFeatured === true,
                  },
                },
                {
                  name: 'gradientColor',
                  type: 'select',
                  label: 'Gradient kleur',
                  defaultValue: 'navy',
                  options: [
                    { label: 'Navy', value: 'navy' },
                    { label: 'Teal', value: 'teal' },
                    { label: 'Paars', value: 'purple' },
                    { label: 'Blauw', value: 'blue' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.isFeatured === true,
                  },
                },
                {
                  name: 'monthlyPrice',
                  type: 'number',
                  label: 'Maandelijkse prijs',
                  admin: {
                    placeholder: '29',
                    description: 'Laat leeg als u een aangepaste prijs wilt tonen',
                  },
                },
                {
                  name: 'yearlyPrice',
                  type: 'number',
                  label: 'Jaarlijkse prijs',
                  admin: {
                    placeholder: '290',
                    description: 'Laat leeg als u een aangepaste prijs wilt tonen',
                  },
                },
                {
                  name: 'customPrice',
                  type: 'text',
                  label: 'Aangepaste prijs',
                  admin: {
                    placeholder: 'Op aanvraag',
                    description: 'Wordt getoond in plaats van numerieke prijs',
                  },
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  label: 'Knoptekst',
                  required: true,
                  defaultValue: 'Start gratis trial',
                  admin: {
                    placeholder: 'Start gratis trial',
                  },
                },
                {
                  name: 'ctaUrl',
                  type: 'text',
                  label: 'Knoplink',
                  required: true,
                  defaultValue: '#',
                  admin: {
                    placeholder: '/aanmelden',
                  },
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Features',
                  minRows: 1,
                  maxRows: 10,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Feature tekst',
                      required: true,
                      admin: {
                        placeholder: 'Onbeperkte producten',
                      },
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Inbegrepen',
                      defaultValue: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'faq',
              type: 'array',
              label: 'Veelgestelde vragen',
              maxRows: 6,
              admin: {
                condition: (data) => {
                  // Show only when variant is 'with-faq'
                  // Access via top-level data since variant is in Design tab
                  return data?.variant === 'with-faq'
                },
                description: 'Veelgestelde vragen onder de prijskaarten',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Vraag',
                  required: true,
                  admin: {
                    placeholder: 'Kan ik op elk moment opzeggen?',
                  },
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Antwoord',
                  required: true,
                  admin: {
                    placeholder: 'Ja, u kunt op elk moment uw abonnement opzeggen...',
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
              defaultValue: 'three-tier',
              options: [
                { label: 'Drie kolommen', value: 'three-tier' },
                { label: 'Twee kolommen', value: 'two-column' },
                { label: 'Vergelijkingstabel', value: 'comparison' },
                { label: 'Met FAQ', value: 'with-faq' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}

import type { Block } from 'payload'

/**
 * B31 - Newsletter Block Configuration
 *
 * Email newsletter signup with success states and privacy messaging.
 *
 * FEATURES:
 * - Horizontal inline form (email input + button)
 * - 4 background color variants (white, grey, teal, navy)
 * - Email validation
 * - Success state with checkmark icon
 * - Custom success/error messages
 * - Privacy reassurance text
 * - Responsive: button full-width on mobile
 *
 * @see docs/refactoring/sprint-7/b31-newsletter.html
 */

export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletter Blocks',
  },
  fields: [
    // Header Content
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Blijf op de hoogte',
          admin: {
            width: '60%',
            description: 'Hoofdtitel van de newsletter sectie',
          },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Inschrijven',
          admin: {
            width: '40%',
            description: 'Tekst op de submit button',
          },
        },
      ],
    },

    // Description
    {
      name: 'description',
      type: 'textarea',
      admin: {
        rows: 2,
        description: 'Korte beschrijving onder de titel (optioneel)',
        placeholder: 'Ontvang wekelijks de laatste updates',
      },
    },

    // Form Configuration
    {
      type: 'row',
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          defaultValue: 'Je email adres...',
          admin: {
            width: '50%',
            description: 'Placeholder text voor email input',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'teal',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Grey (Light)', value: 'grey' },
            { label: 'Teal (Brand)', value: 'teal' },
            { label: 'Navy (Dark)', value: 'navy' },
          ],
          admin: {
            width: '50%',
            description: 'Achtergrondkleur van de sectie',
          },
        },
      ],
    },

    // Privacy Text
    {
      name: 'privacyText',
      type: 'text',
      defaultValue: 'We respecteren je privacy. Geen spam.',
      admin: {
        description: 'Privacy text onder het formulier',
      },
    },

    // Success Message
    {
      type: 'row',
      fields: [
        {
          name: 'successMessage',
          type: 'text',
          defaultValue: 'Bedankt voor je inschrijving! Check je inbox.',
          admin: {
            width: '50%',
            description: 'Bericht getoond na succesvolle inschrijving',
          },
        },
        {
          name: 'errorMessage',
          type: 'text',
          defaultValue: 'Er ging iets mis. Probeer het opnieuw.',
          admin: {
            width: '50%',
            description: 'Bericht getoond bij foutmelding',
          },
        },
      ],
    },
  ],
}

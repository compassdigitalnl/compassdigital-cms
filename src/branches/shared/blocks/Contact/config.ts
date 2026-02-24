import type { Block } from 'payload'

/**
 * B16 - Contact Block Configuration
 *
 * Contact information display with address, phone, email, opening hours, and optional map.
 *
 * FEATURES:
 * - Address group (street, postal code, city)
 * - Contact details (phone, email)
 * - Opening hours array (day/hours pairs)
 * - Optional Google Maps iframe integration
 * - 2-column layout (info left, map right)
 * - Responsive: stacks on mobile
 *
 * @see docs/refactoring/sprint-7/b16-contact.html
 */

export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact',
    plural: 'Contact Blocks',
  },
  fields: [
    // Header
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          required: true,
          defaultValue: 'Neem contact op',
          admin: {
            width: '60%',
            placeholder: 'Neem contact op',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          admin: {
            width: '40%',
            placeholder: 'Wij staan altijd voor je klaar',
          },
        },
      ],
    },

    // Address Group
    {
      name: 'address',
      type: 'group',
      label: 'Address',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Street Address',
          admin: {
            placeholder: 'Keizersgracht 123',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'postalCode',
              type: 'text',
              label: 'Postal Code',
              admin: {
                width: '40%',
                placeholder: '1015 DJ',
              },
            },
            {
              name: 'city',
              type: 'text',
              label: 'City',
              admin: {
                width: '60%',
                placeholder: 'Amsterdam',
              },
            },
          ],
        },
      ],
    },

    // Contact Details
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          admin: {
            width: '50%',
            placeholder: '020 - 123 45 67',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: {
            width: '50%',
            placeholder: 'info@company.com',
          },
        },
      ],
    },

    // Opening Hours
    {
      name: 'openingHours',
      type: 'array',
      label: 'Opening Hours',
      admin: {
        description: 'Add opening hours for each day or day range',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'day',
              type: 'text',
              label: 'Day(s)',
              required: true,
              admin: {
                width: '50%',
                placeholder: 'Maandag - Vrijdag',
              },
            },
            {
              name: 'hours',
              type: 'text',
              label: 'Hours',
              required: true,
              admin: {
                width: '50%',
                placeholder: '09:00 - 17:00',
              },
            },
          ],
        },
      ],
    },

    // Map Settings
    {
      type: 'row',
      fields: [
        {
          name: 'showMap',
          type: 'checkbox',
          label: 'Show Map',
          defaultValue: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'mapUrl',
          type: 'text',
          label: 'Google Maps Embed URL',
          admin: {
            width: '70%',
            condition: (data, siblingData) => siblingData?.showMap,
            placeholder: 'https://www.google.com/maps/embed?pb=...',
            description: 'Get embed URL from Google Maps "Share" → "Embed a map"',
          },
        },
      ],
    },
  ],
}

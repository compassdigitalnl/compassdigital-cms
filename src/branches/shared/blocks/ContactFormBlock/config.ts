import type { Block } from 'payload'

/**
 * B25 - ContactForm Block Configuration
 *
 * Full-featured contact form with configurable fields and contact info sidebar.
 *
 * FEATURES:
 * - Form fields: name, email, phone (optional), subject (optional), message
 * - Configurable field visibility (showPhone, showSubject)
 * - Contact info sidebar (phone, email, address)
 * - Form validation and error handling
 * - Success/error messages
 * - Submit to specified email address
 * - 2-column layout (form left, info right)
 * - Responsive: stacks on mobile
 *
 * @see docs/refactoring/sprint-7/b25-contactform.html
 */

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: {
    singular: 'Contactformulier',
    plural: 'Contactformulieren',
  },
  fields: [
    // Header
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Form Title',
          defaultValue: 'Neem contact op',
          admin: {
            width: '60%',
            placeholder: 'Neem contact op',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            width: '40%',
            placeholder: 'Vul het formulier in en we nemen contact op',
            rows: 2,
          },
        },
      ],
    },

    // Form Configuration
    {
      type: 'row',
      fields: [
        {
          name: 'showPhone',
          type: 'checkbox',
          label: 'Show Phone Field',
          defaultValue: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'showSubject',
          type: 'checkbox',
          label: 'Show Subject Field',
          defaultValue: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'submitTo',
          type: 'email',
          label: 'Submit To Email',
          required: true,
          admin: {
            width: '34%',
            placeholder: 'contact@company.com',
            description: 'Email address to receive form submissions',
          },
        },
      ],
    },

    // Contact Info Sidebar
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Info Sidebar',
      admin: {
        description: 'Optional contact information displayed alongside the form',
      },
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          admin: {
            placeholder: '020 - 123 45 67',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: {
            placeholder: 'info@company.com',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          admin: {
            rows: 3,
            placeholder: 'Keizersgracht 123\n1015 DJ Amsterdam',
          },
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Opening Hours',
          admin: {
            placeholder: 'Ma-Vr: 09:00-17:00',
          },
        },
      ],
    },

    // Messages
    {
      type: 'row',
      fields: [
        {
          name: 'successMessage',
          type: 'text',
          label: 'Success Message',
          defaultValue: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
          admin: {
            width: '50%',
            description: 'Message shown after successful form submission',
          },
        },
        {
          name: 'errorMessage',
          type: 'text',
          label: 'Error Message',
          defaultValue: 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
          admin: {
            width: '50%',
            description: 'Message shown when form submission fails',
          },
        },
      ],
    },
  ],
}

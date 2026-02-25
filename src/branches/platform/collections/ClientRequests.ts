/**
 * 📋 ClientRequests Collection
 *
 * Onboarding requests van potentiële klanten.
 * Admins kunnen verzoeken goedkeuren → automatisch account + Client record aanmaken.
 */

import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const ClientRequests: CollectionConfig = {
  slug: 'client-requests',
  labels: {
    singular: 'Klantverzoek',
    plural: 'Klantverzoeken',
  },
  admin: {
    group: 'Platform Management',
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'contactEmail', 'siteType', 'status', 'createdAt'],
    description: 'Inkomende onboarding-verzoeken van nieuwe klanten',
    hidden: isClientDeployment(),
  },
  access: {
    // Only admins can read and manage requests
    read: ({ req: { user } }) => checkRole(['admin'], user),
    // Public create — anyone can submit a request (onboarding form)
    create: () => true,
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ─── Status ─────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Nieuw — wachten op review', value: 'pending' },
        { label: 'In behandeling', value: 'reviewing' },
        { label: 'Goedgekeurd — account aangemaakt', value: 'approved' },
        { label: 'Afgewezen', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ─── Bedrijfsgegevens ────────────────────────────────
    {
      name: 'companyName',
      type: 'text',
      required: true,
      label: 'Bedrijfsnaam',
    },
    {
      name: 'contactName',
      type: 'text',
      required: true,
      label: 'Naam contactpersoon',
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      label: 'E-mailadres',
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Telefoonnummer',
      admin: {
        placeholder: '+31 6 1234 5678',
      },
    },

    // ─── Type product ────────────────────────────────────
    {
      name: 'siteType',
      type: 'select',
      required: true,
      label: 'Type product',
      options: [
        { label: 'Website (informatief)', value: 'website' },
        { label: 'Webshop (e-commerce)', value: 'webshop' },
      ],
      admin: {
        description: 'Bepaalt welke CMS-functies worden geactiveerd',
        position: 'sidebar',
      },
    },

    // ─── Website specifiek ───────────────────────────────
    {
      name: 'websitePages',
      type: 'select',
      label: 'Gewenste pagina\'s',
      hasMany: true,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Over ons', value: 'about' },
        { label: 'Diensten', value: 'services' },
        { label: 'Portfolio / Cases', value: 'portfolio' },
        { label: 'Blog', value: 'blog' },
        { label: 'FAQ', value: 'faq' },
        { label: 'Contact', value: 'contact' },
      ],
      admin: {
        description: 'Selecteer de pagina\'s die je website nodig heeft',
        condition: (data) => data.siteType === 'website',
      },
    },

    // ─── Webshop specifiek ───────────────────────────────
    {
      name: 'expectedProducts',
      type: 'select',
      label: 'Verwacht aantal producten',
      options: [
        { label: '1-50 producten', value: 'small' },
        { label: '50-500 producten', value: 'medium' },
        { label: '500+ producten', value: 'large' },
      ],
      admin: {
        condition: (data) => data.siteType === 'webshop',
      },
    },
    {
      name: 'paymentMethods',
      type: 'select',
      label: 'Gewenste betaalmethoden',
      hasMany: true,
      options: [
        { label: 'iDEAL', value: 'ideal' },
        { label: 'Creditcard', value: 'creditcard' },
        { label: 'Op rekening (B2B)', value: 'invoice' },
        { label: 'Bankoverschrijving', value: 'banktransfer' },
        { label: 'PayPal', value: 'paypal' },
      ],
      admin: {
        condition: (data) => data.siteType === 'webshop',
      },
    },

    // ─── Extra informatie ────────────────────────────────
    {
      name: 'message',
      type: 'textarea',
      label: 'Aanvullende informatie',
      admin: {
        description: 'Verdere wensen, vragen of opmerkingen',
        rows: 4,
      },
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Gewenst domein',
      admin: {
        description: 'bijv. mijnbedrijf.nl (optioneel)',
        placeholder: 'mijnbedrijf.nl',
      },
    },

    // ─── Admin notities ──────────────────────────────────
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin notities (intern)',
      access: {
        create: ({ req: { user } }) => checkRole(['admin'], user),
        update: ({ req: { user } }) => checkRole(['admin'], user),
      },
      admin: {
        description: 'Interne notities — niet zichtbaar voor de aanvrager',
        position: 'sidebar',
        rows: 3,
      },
    },

    // ─── Gekoppelde records (na goedkeuring) ─────────────
    {
      name: 'createdUser',
      type: 'relationship',
      relationTo: 'users',
      label: 'Aangemaakt account',
      access: {
        create: ({ req: { user } }) => checkRole(['admin'], user),
        update: ({ req: { user } }) => checkRole(['admin'], user),
      },
      admin: {
        description: 'Ingevuld na goedkeuring — gekoppeld gebruikersaccount',
        position: 'sidebar',
        condition: (data) => data.status === 'approved',
      },
    },
    {
      name: 'createdClient',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Aangemaakte klant',
      access: {
        create: ({ req: { user } }) => checkRole(['admin'], user),
        update: ({ req: { user } }) => checkRole(['admin'], user),
      },
      admin: {
        description: 'Ingevuld na goedkeuring — gekoppeld client record',
        position: 'sidebar',
        condition: (data) => data.status === 'approved',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // When status changes to 'approved', log it (full automation can be added later)
        if (operation === 'update' && doc.status === 'approved') {
          req.payload.logger.info(
            `[ClientRequests] Request approved for ${doc.companyName} (${doc.contactEmail}) — type: ${doc.siteType}`,
          )
        }
      },
    ],
  },
}

export default ClientRequests

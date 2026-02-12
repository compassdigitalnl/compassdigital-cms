import type { Block } from 'payload'

export const TopBar: Block = {
  slug: 'topBar',
  interfaceName: 'TopBarBlock',
  labels: {
    singular: 'TopBar',
    plural: 'TopBars',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'TopBar Tonen',
      defaultValue: true,
      admin: {
        description: 'Schakel de TopBar in of uit op deze pagina',
      },
    },
    {
      name: 'useGlobalSettings',
      type: 'checkbox',
      label: 'Gebruik Globale TopBar Instellingen',
      defaultValue: true,
      admin: {
        description: 'Gebruik de instellingen van TopBar Settings global',
        condition: (data, siblingData) => siblingData?.enabled === true,
      },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Achtergrondkleur',
      defaultValue: '#0A1628',
      admin: {
        description: 'Hex kleurcode (bijv: #0A1628)',
        condition: (data, siblingData) =>
          siblingData?.enabled === true && siblingData?.useGlobalSettings === false,
      },
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Tekstkleur',
      defaultValue: '#FFFFFF',
      admin: {
        description: 'Hex kleurcode (bijv: #FFFFFF)',
        condition: (data, siblingData) =>
          siblingData?.enabled === true && siblingData?.useGlobalSettings === false,
      },
    },
    {
      name: 'leftMessages',
      type: 'array',
      label: 'Berichten Links',
      admin: {
        description: 'USP\'s en belangrijke berichten aan de linkerkant',
        condition: (data, siblingData) =>
          siblingData?.enabled === true && siblingData?.useGlobalSettings === false,
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          admin: {
            placeholder: '✓ of 🚚',
            description: 'Emoji of symbool',
          },
        },
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Tekst',
          admin: {
            placeholder: 'Gratis verzending vanaf €150',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link (optioneel)',
          admin: {
            placeholder: '/verzending',
          },
        },
      ],
    },
    {
      name: 'rightLinks',
      type: 'array',
      label: 'Links Rechts',
      admin: {
        description: 'Actie links aan de rechterkant',
        condition: (data, siblingData) =>
          siblingData?.enabled === true && siblingData?.useGlobalSettings === false,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            placeholder: 'Klant worden',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'Link',
          admin: {
            placeholder: '/klant-worden',
          },
        },
      ],
    },
  ],
}

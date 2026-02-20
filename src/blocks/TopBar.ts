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
          type: 'select',
          label: 'Icon',
          options: [
            { label: 'Geen icon', value: '' },
            { label: '✓ Badge Check (verificatie)', value: 'BadgeCheck' },
            { label: '🚚 Truck (verzending)', value: 'Truck' },
            { label: '🛡️ Shield (veiligheid)', value: 'Shield' },
            { label: '⭐ Award (kwaliteit)', value: 'Award' },
            { label: '📞 Phone', value: 'Phone' },
            { label: '✉️ Mail', value: 'Mail' },
            { label: '🕐 Clock', value: 'Clock' },
            { label: '📍 Map Pin', value: 'MapPin' },
            { label: '✅ Check Circle', value: 'CheckCircle' },
            { label: '💳 Credit Card', value: 'CreditCard' },
            { label: '🔒 Lock (beveiligd)', value: 'Lock' },
            { label: '⚡ Zap (snel)', value: 'Zap' },
            { label: '🎁 Gift', value: 'Gift' },
            { label: '🔄 Refresh (retour)', value: 'RefreshCw' },
            { label: '👥 Users', value: 'Users' },
          ],
          admin: {
            description: 'Kies een Lucide icon',
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

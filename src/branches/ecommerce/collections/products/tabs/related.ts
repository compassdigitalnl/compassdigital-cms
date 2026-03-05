import type { Tab } from 'payload'

export const relatedTab: Tab = {
  label: 'Gerelateerd',
  description: 'Gerelateerde producten, cross-sells en up-sells',
  fields: [
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Gerelateerde Producten', admin: { description: 'Producten die vaak samen bekeken worden' } },
    { name: 'crossSells', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Cross-Sells', admin: { description: 'Vaak samen gekocht - toon in winkelwagen' } },
    { name: 'upSells', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Up-Sells', admin: { description: 'Upgrade suggesties - betere/duurdere alternatieven' } },
    { name: 'accessories', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Accessoires', admin: { description: 'Optionele accessoires en toebehoren' } },
  ],
}

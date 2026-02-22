import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * MenuItems Collection
 *
 * Restaurant menu items (dishes, drinks, desserts, etc.)
 */
export const MenuItems: CollectionConfig = {
  slug: 'menuItems',
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      return {
        _status: { equals: 'published' },
      }
    },
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('horeca'),
    group: 'Horeca',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'featured', 'updatedAt'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Gerecht naam',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Categorie',
      options: [
        { label: 'Voorgerechten', value: 'starters' },
        { label: 'Hoofdgerechten', value: 'mains' },
        { label: 'Nagerechten', value: 'desserts' },
        { label: 'Dranken', value: 'drinks' },
        { label: 'Wijnen', value: 'wines' },
        { label: 'Lunch', value: 'lunch' },
        { label: 'Specials', value: 'specials' },
      ],
      defaultValue: 'mains',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        description: 'Korte beschrijving van het gerecht',
      },
    },
    {
      name: 'ingredients',
      type: 'textarea',
      label: 'Ingrediënten',
      admin: {
        description: 'Optioneel: belangrijkste ingrediënten',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prijs (€)',
      min: 0,
      admin: {
        description: 'Prijs in euro',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Featured',
          defaultValue: false,
          admin: {
            description: "Toon als 'Chef's Special' of featured gerecht",
          },
        },
        {
          name: 'vegetarian',
          type: 'checkbox',
          label: 'Vegetarisch',
          defaultValue: false,
        },
        {
          name: 'vegan',
          type: 'checkbox',
          label: 'Veganistisch',
          defaultValue: false,
        },
        {
          name: 'glutenFree',
          type: 'checkbox',
          label: 'Glutenvrij',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'allergens',
      type: 'array',
      label: 'Allergenen',
      fields: [
        {
          name: 'allergen',
          type: 'select',
          required: true,
          options: [
            { label: 'Gluten', value: 'gluten' },
            { label: 'Schaaldieren', value: 'crustaceans' },
            { label: 'Eieren', value: 'eggs' },
            { label: 'Vis', value: 'fish' },
            { label: 'Pinda', value: 'peanuts' },
            { label: 'Soja', value: 'soy' },
            { label: 'Melk', value: 'milk' },
            { label: 'Noten', value: 'nuts' },
            { label: 'Selderij', value: 'celery' },
            { label: 'Mosterd', value: 'mustard' },
            { label: 'Sesam', value: 'sesame' },
            { label: 'Lupine', value: 'lupin' },
            { label: 'Weekdieren', value: 'molluscs' },
          ],
        },
      ],
      admin: {
        description: 'Allergenen aanwezig in dit gerecht',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Gerecht foto',
      admin: {
        description: 'Optionele foto van het gerecht',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Emoji/Icon',
      defaultValue: '🍽️',
      admin: {
        description: 'Emoji voor dit gerecht (bijv. 🥩, 🍷, 🍰)',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sorteervolgorde',
      defaultValue: 0,
      admin: {
        description: 'Volgorde in menu (lager = eerder)',
      },
    },
    slugField(),
  ],
}

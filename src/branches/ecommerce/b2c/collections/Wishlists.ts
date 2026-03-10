import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import crypto from 'crypto'

/**
 * Wishlists Collection (Feature #34 - Wishlist Sharing)
 *
 * Stores user favorites with sharing capability.
 * Each entry is one product on a user's wishlist.
 * Public sharing via unique token.
 *
 * Features:
 * - Product favorites per user
 * - Public sharing via unique shareToken
 * - Optional wishlist name (for future named lists)
 * - Duplicate prevention via hook
 */
export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  labels: {
    singular: 'Wishlist Item',
    plural: 'Wishlist',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Shop',
    defaultColumns: ['user', 'product', 'isPublic', 'createdAt'],
    description: 'Favoriete producten en deelbare wishlists',
    hidden: shouldHideCollection('wishlists'),
  },
  access: {
    // Users can read their own wishlists + public wishlists
    read: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      if (user) {
        return {
          or: [
            { user: { equals: user.id } },
            { isPublic: { equals: true } },
          ],
        }
      }
      // Anonymous: only public wishlists
      return { isPublic: { equals: true } }
    },
    // Authenticated users can add to their own wishlist
    create: ({ req: { user } }) => !!user,
    // Users can update their own, admins can update all
    update: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      if (user) return { user: { equals: user.id } }
      return false
    },
    // Users can delete their own, admins can delete all
    delete: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      if (user) return { user: { equals: user.id } }
      return false
    },
  },
  indexes: [
    // Unique constraint: one product per user
    { fields: ['user', 'product'], unique: true },
  ],
  fields: [
    // === User Relationship ===
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Gebruiker',
      admin: {
        position: 'sidebar',
      },
    },

    // === Product Relationship ===
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },

    // === Sharing ===
    {
      name: 'isPublic',
      type: 'checkbox',
      label: 'Openbaar Deelbaar',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Maak deze wishlist publiek toegankelijk via een deellink',
      },
    },
    {
      name: 'shareToken',
      type: 'text',
      label: 'Deeltoken',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Uniek token voor het delen van de wishlist',
        readOnly: true,
      },
    },

    // === Optional Metadata ===
    {
      name: 'notes',
      type: 'text',
      label: 'Notitie',
      maxLength: 200,
      admin: {
        description: 'Optionele notitie bij dit product (bijv. "voor mama")',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Auto-generate shareToken on creation
      ({ data, operation }) => {
        if (operation === 'create' && !data?.shareToken) {
          return {
            ...data,
            shareToken: crypto.randomBytes(16).toString('hex'),
          }
        }
        return data
      },
    ],
    beforeValidate: [
      // Ensure user is set to the authenticated user (prevent spoofing)
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user && !checkRole(['admin'], req.user)) {
          return { ...data, user: req.user.id }
        }
        return data
      },
    ],
  },
}

export default Wishlists

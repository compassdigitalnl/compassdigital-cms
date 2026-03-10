import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

/**
 * Loyalty Transactions Collection (merged with LoyaltyRedemptions)
 *
 * Tracks all loyalty activity: points earned, spent, and reward redemptions.
 * When type = 'spent_reward', the redemption fields become active.
 */
export const LoyaltyTransactions: CollectionConfig = {
  slug: 'loyalty-transactions',
  labels: {
    singular: 'Loyalty Transactie',
    plural: 'Loyalty Transacties',
  },
  admin: {
    useAsTitle: 'description',
    group: 'Loyaliteit',
    defaultColumns: ['user', 'type', 'points', 'description', 'redemptionStatus', 'createdAt'],
    description: 'Punten verdienen, besteden en beloningen inwisselen',
    hidden: shouldHideCollection('loyalty'),
  },
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    create: () => true, // System + users can create (redemptions)
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Gebruiker',
      hasMany: false,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Type',
      options: [
        { label: 'Verdiend - Aankoop', value: 'earned_purchase' },
        { label: 'Verdiend - Review', value: 'earned_review' },
        { label: 'Verdiend - Referral', value: 'earned_referral' },
        { label: 'Verdiend - Verjaardag', value: 'earned_birthday' },
        { label: 'Verdiend - Bonus', value: 'earned_bonus' },
        { label: 'Besteed - Beloning', value: 'spent_reward' },
        { label: 'Verlopen', value: 'expired' },
        { label: 'Aanpassing', value: 'adjustment' },
      ],
    },
    {
      name: 'points',
      type: 'number',
      required: true,
      label: 'Punten',
      admin: {
        description: 'Positief = verdiend, negatief = besteed',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Omschrijving',
      admin: {
        description: 'Bijv. "Bestelling #DS-2026-0847" of "Review geschreven"',
      },
    },
    {
      name: 'relatedOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Gerelateerde Bestelling',
      hasMany: false,
    },
    {
      name: 'relatedReward',
      type: 'relationship',
      relationTo: 'loyalty-rewards',
      label: 'Gerelateerde Beloning',
      hasMany: false,
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
      admin: {
        description: 'Aanvullende data (JSON)',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Verloopt op',
      admin: {
        description: 'Wanneer deze punten verlopen (optioneel)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // Inwisseling velden (merged from LoyaltyRedemptions)
    // Alleen zichtbaar wanneer type = 'spent_reward'
    // ══════════════════════════════════════════════════════════════════════
    {
      name: 'redemptionStatus',
      type: 'select',
      label: 'Inwisselstatus',
      options: [
        { label: 'Beschikbaar', value: 'available' },
        { label: 'Gebruikt', value: 'used' },
        { label: 'Verlopen', value: 'expired' },
        { label: 'Geannuleerd', value: 'canceled' },
      ],
      defaultValue: 'available',
      admin: {
        condition: (data) => data?.type === 'spent_reward',
        description: 'Status van de ingewisselde beloning',
      },
    },
    {
      name: 'redemptionCode',
      type: 'text',
      label: 'Inwisselcode',
      admin: {
        condition: (data) => data?.type === 'spent_reward',
        description: 'Unieke code om de beloning te gebruiken',
      },
    },
    {
      name: 'usedAt',
      type: 'date',
      label: 'Gebruikt op',
      admin: {
        condition: (data) => data?.type === 'spent_reward',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}

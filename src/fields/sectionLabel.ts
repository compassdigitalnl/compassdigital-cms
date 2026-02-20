import type { Field } from 'payload'

/**
 * Section Label Field
 *
 * Herbruikbaar veld voor kleine uppercase tekst boven sectietitels
 * Gebruikt in: Hero, CategoryGrid, ProductGrid, Features, Testimonials
 *
 * Voorbeeld gebruik:
 * - "Assortiment"
 * - "Populair"
 * - "Waarom Plastimed?"
 * - "Klantervaringen"
 */
export const sectionLabelField: Field = {
  name: 'sectionLabel',
  type: 'text',
  label: 'Sectie label',
  admin: {
    description: 'Kleine uppercase tekst boven de titel (bijv. "Assortiment", "Populair")',
  },
}

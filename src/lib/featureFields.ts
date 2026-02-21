/**
 * Feature-Aware Field Gating Utilities
 *
 * Server-side dynamic field inclusion based on feature flags.
 * Fields that are not in the collection config do not appear in Admin UI
 * and do not accept data via API.
 *
 * Architecture Decision:
 * - Uses server-side config-time evaluation (not client-side admin.condition)
 * - Features are evaluated once at server start from ENV variables
 * - Works with the existing features system in src/lib/features.ts
 *
 * Usage Examples:
 * ```typescript
 * import { featureField, featureFields, featureTab, subFeatureFields } from '@/lib/featureFields'
 *
 * // Single field gating:
 * fields: [
 *   ...featureField('brands', { name: 'brand', type: 'relationship', relationTo: 'brands' }),
 * ]
 *
 * // Multiple fields gating:
 * fields: [
 *   ...featureFields('b2b', [
 *     { name: 'minOrderQuantity', type: 'number' },
 *     { name: 'maxOrderQuantity', type: 'number' },
 *   ]),
 * ]
 *
 * // Whole tab gating:
 * tabs: [
 *   basisInfoTab,
 *   ...featureTab('b2b', { label: 'B2B', fields: [...] }),
 * ]
 *
 * // Sub-feature (requires both parent AND child):
 * fields: [
 *   ...subFeatureFields('b2b', 'groupPricing', [groupPricesCollapsible]),
 * ]
 * ```
 *
 * See: docs/FEATURE-AWARE-FIELD-GATING-PLAN.md
 */

import { features } from './features'
import type { Field, Tab } from 'payload'

/**
 * Conditionally include a single field based on a feature flag.
 * Returns the field in an array if the feature is enabled, otherwise returns an empty array.
 *
 * @param featureKey - The feature flag key to check (e.g., 'b2b', 'brands', 'shop')
 * @param field - The Payload field configuration
 * @returns Array containing the field if feature is enabled, empty array otherwise
 *
 * @example
 * // In a collection config:
 * fields: [
 *   ...featureField('brands', {
 *     name: 'brand',
 *     type: 'relationship',
 *     relationTo: 'brands',
 *     label: 'Merk',
 *   }),
 * ]
 */
export function featureField(
  featureKey: keyof typeof features,
  field: Field,
): Field[] {
  return features[featureKey] ? [field] : []
}

/**
 * Conditionally include multiple fields based on a feature flag.
 * Returns the fields array if the feature is enabled, otherwise returns an empty array.
 *
 * @param featureKey - The feature flag key to check
 * @param fields - Array of Payload field configurations
 * @returns The fields array if feature is enabled, empty array otherwise
 *
 * @example
 * fields: [
 *   ...featureFields('b2b', [
 *     { name: 'minOrderQuantity', type: 'number', label: 'Min. bestelhoev.' },
 *     { name: 'maxOrderQuantity', type: 'number', label: 'Max. bestelhoev.' },
 *   ]),
 * ]
 */
export function featureFields(
  featureKey: keyof typeof features,
  fields: Field[],
): Field[] {
  return features[featureKey] ? fields : []
}

/**
 * Conditionally include an entire tab based on a feature flag.
 * Returns the tab in an array if the feature is enabled, otherwise returns an empty array.
 *
 * @param featureKey - The feature flag key to check
 * @param tab - The Payload tab configuration
 * @returns Array containing the tab if feature is enabled, empty array otherwise
 *
 * @example
 * // In a collection config with tabs:
 * tabs: [
 *   basisInfoTab,
 *   prijzenTab,
 *   ...featureTab('b2b', {
 *     label: 'B2B',
 *     description: 'B2B instellingen (MOQ, levertijd, offertes)',
 *     fields: [
 *       { name: 'minOrderQuantity', type: 'number' },
 *       { name: 'maxOrderQuantity', type: 'number' },
 *       // ... more B2B fields
 *     ],
 *   }),
 *   seoTab,
 * ]
 */
export function featureTab(
  featureKey: keyof typeof features,
  tab: Tab,
): Tab[] {
  return features[featureKey] ? [tab] : []
}

/**
 * Conditionally include fields that require BOTH a parent AND child feature to be enabled.
 * Useful for sub-features that only make sense when their parent feature is also active.
 *
 * @param parentKey - The parent feature flag key (e.g., 'b2b')
 * @param childKey - The child feature flag key (e.g., 'groupPricing')
 * @param fields - Array of Payload field configurations
 * @returns The fields array if both features are enabled, empty array otherwise
 *
 * @example
 * // Group Pricing only appears when both b2b AND groupPricing are enabled:
 * fields: [
 *   ...subFeatureFields('b2b', 'groupPricing', [
 *     {
 *       type: 'collapsible',
 *       label: 'Klantengroep Prijzen (B2B)',
 *       fields: [
 *         { name: 'groupPrices', type: 'array', ... },
 *       ],
 *     },
 *   ]),
 * ]
 */
export function subFeatureFields(
  parentKey: keyof typeof features,
  childKey: keyof typeof features,
  fields: Field[],
): Field[] {
  return (features[parentKey] && features[childKey]) ? fields : []
}

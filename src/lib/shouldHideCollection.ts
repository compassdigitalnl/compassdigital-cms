/**
 * Collection Visibility Helpers
 *
 * Controls which collections are visible on Platform CMS vs Client deployments.
 *
 * Platform CMS (cms.compassdigital.nl):
 * - Only shows platform-management collections (Users, Media, Pages, Clients, etc.)
 * - Hides all e-commerce, content, marketplace, and Sprint 6 collections
 *
 * Client Deployments (e.g., plastimed01.compassdigital.nl):
 * - Shows collections based on feature flags
 * - E.g., if ENABLE_SHOP=true, Products/Orders are visible
 */

import { isClientDeployment } from './isClientDeployment'
import { features } from './features'

/**
 * Determines if a collection should be hidden on Platform CMS.
 *
 * @returns true if running on Platform CMS (should hide), false if on client deployment
 *
 * Usage:
 * ```typescript
 * admin: {
 *   hidden: shouldHideOnPlatform(),
 * }
 * ```
 */
export function shouldHideOnPlatform(): boolean {
  return !isClientDeployment()
}

/**
 * Advanced collection visibility control with feature flag support.
 *
 * @param featureKey - Optional feature flag to check on client deployments
 * @returns true if collection should be hidden, false if visible
 *
 * Behavior:
 * - Platform CMS: Always hide (return true)
 * - Client deployment without feature key: Always show (return false)
 * - Client deployment with feature key: Hide if feature disabled
 *
 * Usage:
 * ```typescript
 * // Simple platform hiding
 * admin: {
 *   hidden: shouldHideCollection(),
 * }
 *
 * // With feature flag
 * admin: {
 *   hidden: shouldHideCollection('vendors'),
 * }
 * ```
 */
export function shouldHideCollection(featureKey?: keyof typeof features): boolean {
  // Always hide on Platform CMS
  if (!isClientDeployment()) return true

  // On client deployment: check feature flag if provided
  if (featureKey) return !features[featureKey]

  // Show by default on client
  return false
}

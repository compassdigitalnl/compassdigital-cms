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
 * - Unified content collections controlled by Settings > Content Modules
 */

import { isClientDeployment } from './isClientDeployment'
import { features } from './features'
import { isContentCollection, isContentCollectionActive, type ContentModuleType } from './contentModules'

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
 * Now also supports unified content collections via Settings > Content Modules.
 *
 * @param featureKey - Optional feature flag to check on client deployments
 * @returns true if collection should be hidden, false if visible
 *
 * Behavior:
 * - Platform CMS: Always hide (return true)
 * - Client deployment without feature key: Always show (return false)
 * - Client deployment with feature key: Hide if feature disabled
 * - Unified content collections: Controlled by Settings contentModules
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

/**
 * Visibility check for unified content collections.
 * Uses Settings > Content Modules instead of feature flags.
 *
 * @param collectionSlug - The unified collection slug (e.g., 'content-services')
 * @returns true if collection should be hidden
 *
 * Usage:
 * ```typescript
 * admin: {
 *   hidden: shouldHideContentCollection('content-services'),
 * }
 * ```
 */
export function shouldHideContentCollection(collectionSlug: string): boolean {
  // Always hide on Platform CMS
  if (!isClientDeployment()) return true

  // Check if this is a known unified content collection
  if (isContentCollection(collectionSlug)) {
    return !isContentCollectionActive(collectionSlug)
  }

  // Fallback: show by default
  return false
}

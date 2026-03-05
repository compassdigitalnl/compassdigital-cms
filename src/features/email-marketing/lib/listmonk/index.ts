/**
 * Listmonk Integration - Main Export
 *
 * Centralized exports for Listmonk email marketing integration
 */

// Client
export {
  ListmonkClient,
  ListmonkAPIError,
  getListmonkClient,
  createListmonkClient,
} from './client'

// Sync Service
export {
  ListmonkSyncService,
  SubscriberSync,
  ListSync,
  TemplateSync,
  CampaignSync,
  getListmonkSyncService,
} from './sync'

export type {
  SyncOptions,
  SyncResult,
} from './sync'

// Utils
export * from './utils'

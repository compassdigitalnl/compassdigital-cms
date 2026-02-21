/**
 * Platform Branch
 *
 * Multi-tenant management collections for the SaaS platform.
 * Only active on the platform instance (cms.compassdigital.nl).
 *
 * Collections: Clients, ClientRequests, Deployments
 */

// Export all collections
export { default as Clients } from './collections/Clients'
export { default as ClientRequests } from './collections/ClientRequests'
export { default as Deployments } from './collections/Deployments'

// Export branch metadata
export const branchMetadata = {
  name: 'platform',
  collections: ['Clients', 'ClientRequests', 'Deployments'],
  featureFlag: null, // Platform is always enabled on platform instance
  platformOnly: true,
} as const

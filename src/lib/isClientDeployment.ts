/**
 * Check if current deployment is a client/tenant deployment
 *
 * Returns true if CLIENT_ID or NEXT_PUBLIC_CLIENT_ID is set,
 * indicating this is a tenant-specific deployment (not the platform)
 */
export const isClientDeployment = (): boolean => {
  return !!(process.env.CLIENT_ID || process.env.NEXT_PUBLIC_CLIENT_ID)
}

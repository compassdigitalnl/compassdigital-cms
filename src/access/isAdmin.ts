import type { Access } from 'payload'

import { isAdmin as isAdminUser } from '@/access/utilities'

/**
 * Atomic access checker that verifies if the user has the admin role.
 *
 * @returns true if user is an admin, false otherwise
 */
export const isAdmin: Access = ({ req }) => isAdminUser(req.user)

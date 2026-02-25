/**
 * Role-based access control utilities
 */

export { isAdmin } from './isAdmin'
export { checkRole } from './utilities'

// Alias for super admin (same as admin in this implementation)
export { isAdmin as isSuperAdmin } from './isAdmin'

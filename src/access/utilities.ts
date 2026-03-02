import type { User, Customer } from '@/payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: User | Customer | null): boolean => {
  // Only User type has roles, not Customer
  if (!user || user.collection !== 'users') return false

  if (allRoles) {
    return allRoles.some((role) => {
      return user?.roles?.some((individualRole) => {
        return individualRole === role
      })
    })
  }

  return false
}

/**
 * Type guard to check if a user is of type User (not Customer)
 */
export const isUser = (user: User | Customer | null | undefined): user is User => {
  return user?.collection === 'users'
}

/**
 * Type guard to check if a user is of type Customer (not User)
 */
export const isCustomer = (user: User | Customer | null | undefined): user is Customer => {
  return user?.collection === 'customers'
}

/**
 * Check if user has admin role
 */
export const isAdmin = (user: User | Customer | null | undefined): boolean => {
  if (!isUser(user)) return false
  return checkRole(['admin'], user)
}

/**
 * Check if user has editor role
 */
export const isEditor = (user: User | Customer | null | undefined): boolean => {
  if (!isUser(user)) return false
  return checkRole(['editor'], user)
}

/**
 * Check if user has admin or editor role
 */
export const isAdminOrEditor = (user: User | Customer | null | undefined): boolean => {
  if (!isUser(user)) return false
  return checkRole(['admin', 'editor'], user)
}

/**
 * Check if user has super-admin role
 */
export const isSuperAdmin = (user: User | Customer | null | undefined): boolean => {
  if (!isUser(user)) return false
  return checkRole(['super-admin'], user)
}

/**
 * Safely get the client ID from a user
 * Returns the client ID if user has a client, otherwise returns undefined
 * This helper handles the conditional 'client' field that only exists in platform mode
 */
export const getUserClient = (user: User | Customer | null | undefined): number | string | undefined => {
  if (!isUser(user)) return undefined
  // Use type assertion since client field is conditionally added
  const userWithClient = user as User & { client?: number | string }
  return userWithClient.client
}

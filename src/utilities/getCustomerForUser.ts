import type { Payload } from 'payload'

/**
 * Maps a User (auth) to a Customer record.
 * Orders link to `users` via the customer field, but we also
 * store customerEmail on orders for guest orders.
 *
 * Returns the customer ID if found, or null.
 */
export async function getCustomerForUser(
  payload: Payload,
  userId: number | string,
  userEmail?: string,
): Promise<{ customerId: number | string | null; customerEmail: string | null }> {
  // The orders collection uses `customer` -> `users` relationship directly.
  // So userId IS the customer reference. We return both for OR queries.
  return {
    customerId: userId,
    customerEmail: userEmail || null,
  }
}

/**
 * Build a Payload where clause to find orders for a user.
 * Matches either customer = userId OR customerEmail = userEmail.
 */
export function buildCustomerOrderQuery(userId: number | string, userEmail?: string) {
  const conditions: any[] = [
    { customer: { equals: userId } },
  ]

  if (userEmail) {
    conditions.push({ customerEmail: { equals: userEmail } })
  }

  return { or: conditions }
}

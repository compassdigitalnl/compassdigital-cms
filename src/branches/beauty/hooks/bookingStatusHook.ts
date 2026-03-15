/**
 * Re-export from shared hooks.
 * The actual implementation lives in shared/hooks/ to avoid circular dependencies
 * (shared collections should not import from specific branches).
 */
export { bookingStatusHook } from '@/branches/shared/hooks/bookingStatusHook'

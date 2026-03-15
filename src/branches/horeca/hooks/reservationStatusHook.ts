/**
 * Re-export from shared hooks.
 * The actual implementation lives in shared/hooks/ to avoid circular dependencies
 * (shared collections should not import from specific branches).
 */
export { reservationStatusHook } from '@/branches/shared/hooks/reservationStatusHook'

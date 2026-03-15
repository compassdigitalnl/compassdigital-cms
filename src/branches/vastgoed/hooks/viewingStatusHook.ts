/**
 * Re-export from shared hooks.
 * The actual implementation lives in shared/hooks/ to avoid circular dependencies
 * (shared collections should not import from specific branches).
 */
export { viewingStatusHook } from '@/branches/shared/hooks/viewingStatusHook'

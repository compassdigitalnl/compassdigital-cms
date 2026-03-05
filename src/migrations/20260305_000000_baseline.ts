import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Baseline migration - no-op.
 * All previous migrations have been consolidated.
 * Schema already exists in all databases.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // No-op: schema already exists
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // No-op: baseline cannot be rolled back
}

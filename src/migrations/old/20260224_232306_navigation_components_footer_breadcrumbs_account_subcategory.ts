import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Navigation Components Migration
 * Footer, Breadcrumbs, Account, and Subcategory components
 *
 * Note: Payload auto-creates tables based on collection configs.
 * This migration exists to maintain the migration history.
 * The actual schema changes are applied automatically by Payload.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Tables are auto-created by Payload based on collection configs
  // No custom SQL needed
  payload.logger.info('Navigation components schema updated via Payload auto-create')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Rollback would require dropping tables - not safe for production
  payload.logger.warn('Navigation components rollback not implemented (data preservation)')
}

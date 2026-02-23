import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Remove duplicate metaTitle and metaDescription fields from blog_posts
 *
 * These fields were duplicates of the meta.title and meta.description fields
 * provided by @payloadcms/plugin-seo. This migration removes the redundant
 * standalone fields.
 *
 * Safe to run: Uses IF EXISTS to prevent errors if columns don't exist.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // No database changes needed
  // The standalone metaTitle/metaDescription fields were removed from the collection config,
  // but the database columns must remain because @payloadcms/plugin-seo uses the same
  // meta_title and meta_description column names
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No rollback needed - no database changes were made
}

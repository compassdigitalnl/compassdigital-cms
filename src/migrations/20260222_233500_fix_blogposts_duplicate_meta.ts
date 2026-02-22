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
  await db.execute(sql`
    -- Remove duplicate meta_title column (meta.title from SEO plugin is used instead)
    ALTER TABLE "blog_posts"
    DROP COLUMN IF EXISTS "meta_title";

    -- Remove duplicate meta_description column (meta.description from SEO plugin is used instead)
    ALTER TABLE "blog_posts"
    DROP COLUMN IF EXISTS "meta_description";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore meta_title column
    ALTER TABLE "blog_posts"
    ADD COLUMN IF NOT EXISTS "meta_title" VARCHAR;

    -- Restore meta_description column
    ALTER TABLE "blog_posts"
    ADD COLUMN IF NOT EXISTS "meta_description" VARCHAR;
  `)
}

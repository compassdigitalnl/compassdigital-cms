import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Add instant search display settings to meilisearch_settings
 *
 * Adds:
 * - instant_search_layout column to meilisearch_settings
 * - meilisearch_settings_instant_search_sections table (array field)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add layout column to main table
  await db.execute(sql`
    ALTER TABLE "meilisearch_settings"
    ADD COLUMN IF NOT EXISTS "instant_search_layout" varchar DEFAULT 'stacked'
  `)

  // Create array table for instantSearchSections
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "meilisearch_settings_instant_search_sections" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "collection" varchar,
      "enabled" boolean DEFAULT true,
      "label" varchar,
      "icon" varchar DEFAULT 'package',
      "max_results" numeric DEFAULT 5
    )
  `)

  // Add foreign key + index
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "meilisearch_settings_instant_search_sections"
        ADD CONSTRAINT "meilisearch_settings_instant_search_sections_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "meilisearch_settings"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "meilisearch_settings_instant_search_sections_order_idx"
    ON "meilisearch_settings_instant_search_sections" ("_order")
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "meilisearch_settings_instant_search_sections_parent_id_idx"
    ON "meilisearch_settings_instant_search_sections" ("_parent_id")
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "meilisearch_settings_instant_search_sections"`)
  await db.execute(sql`ALTER TABLE "meilisearch_settings" DROP COLUMN IF EXISTS "instant_search_layout"`)
}

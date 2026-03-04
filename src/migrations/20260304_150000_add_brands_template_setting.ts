import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Add defaultBrandsTemplate to settings
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
    ADD COLUMN IF NOT EXISTS "default_brands_template" varchar DEFAULT 'brandstemplate1';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
    DROP COLUMN IF EXISTS "default_brands_template";
  `)
}

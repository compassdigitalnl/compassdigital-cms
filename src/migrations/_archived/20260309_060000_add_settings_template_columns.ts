import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add missing template selector columns to settings
  await db.execute(sql`
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "default_magazine_archive_template" varchar,
      ADD COLUMN IF NOT EXISTS "default_magazine_detail_template" varchar,
      ADD COLUMN IF NOT EXISTS "default_subscription_pricing_template" varchar,
      ADD COLUMN IF NOT EXISTS "default_subscription_checkout_template" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
      DROP COLUMN IF EXISTS "default_magazine_archive_template",
      DROP COLUMN IF EXISTS "default_magazine_detail_template",
      DROP COLUMN IF EXISTS "default_subscription_pricing_template",
      DROP COLUMN IF EXISTS "default_subscription_checkout_template";
  `)
}

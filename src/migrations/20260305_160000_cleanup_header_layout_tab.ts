import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add navigationEnabled field
  await db.execute(sql`
    ALTER TABLE "header"
    ADD COLUMN IF NOT EXISTS "navigation_enabled" boolean DEFAULT true;
  `)

  // Drop removed Layout & Structuur tab fields
  await db.execute(sql`
    ALTER TABLE "header" DROP COLUMN IF EXISTS "layout_type";
  `)
  await db.execute(sql`
    ALTER TABLE "header" DROP COLUMN IF EXISTS "show_topbar";
  `)
  await db.execute(sql`
    ALTER TABLE "header" DROP COLUMN IF EXISTS "show_alert_bar";
  `)
  await db.execute(sql`
    ALTER TABLE "header" DROP COLUMN IF EXISTS "show_navigation";
  `)
  await db.execute(sql`
    ALTER TABLE "header" DROP COLUMN IF EXISTS "show_search_bar";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Re-add removed columns
  await db.execute(sql`
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "layout_type" varchar DEFAULT 'mega-nav';
  `)
  await db.execute(sql`
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "show_topbar" boolean DEFAULT true;
  `)
  await db.execute(sql`
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "show_alert_bar" boolean DEFAULT false;
  `)
  await db.execute(sql`
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "show_navigation" boolean DEFAULT true;
  `)
  await db.execute(sql`
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "show_search_bar" boolean DEFAULT true;
  `)
  // Drop added column
  await db.execute(sql`
    ALTER TABLE "header" DROP COLUMN IF EXISTS "navigation_enabled";
  `)
}

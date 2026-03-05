import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop Theme Kleuren tab columns (redundant with Theme global)
  await db.execute(sql`ALTER TABLE "header" DROP COLUMN IF EXISTS "use_theme_colors";`)
  await db.execute(sql`ALTER TABLE "header" DROP COLUMN IF EXISTS "header_bg_color";`)
  await db.execute(sql`ALTER TABLE "header" DROP COLUMN IF EXISTS "nav_bg_color";`)
  await db.execute(sql`ALTER TABLE "header" DROP COLUMN IF EXISTS "nav_text_color";`)
  await db.execute(sql`ALTER TABLE "header" DROP COLUMN IF EXISTS "sticky_header_bg";`)
  // Note: sticky_header_shadow stays — moved to Gedrag tab
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "use_theme_colors" boolean DEFAULT true;`)
  await db.execute(sql`ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "header_bg_color" varchar DEFAULT 'var(--color-white)';`)
  await db.execute(sql`ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "nav_bg_color" varchar DEFAULT 'var(--color-primary)';`)
  await db.execute(sql`ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "nav_text_color" varchar DEFAULT 'var(--color-white)';`)
  await db.execute(sql`ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "sticky_header_bg" varchar;`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Add hierarchy fields to brands table
 *
 * Adds parent_id (self-referential FK), level, and visible columns
 * to support manufacturer → product line hierarchy.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add parent_id column (self-referential relationship)
  await db.execute(sql`
    ALTER TABLE "brands"
    ADD COLUMN IF NOT EXISTS "parent_id" integer;
  `)
  await db.execute(sql`
    ALTER TABLE "brands"
    ADD CONSTRAINT "brands_parent_id_fk" FOREIGN KEY ("parent_id")
    REFERENCES "brands"("id") ON UPDATE no action ON DELETE set null;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "brands_parent_idx" ON "brands" ("parent_id");
  `)

  // Add level column (0 = manufacturer, 1 = product line)
  await db.execute(sql`
    ALTER TABLE "brands"
    ADD COLUMN IF NOT EXISTS "level" numeric DEFAULT 0 NOT NULL;
  `)

  // Add visible column
  await db.execute(sql`
    ALTER TABLE "brands"
    ADD COLUMN IF NOT EXISTS "visible" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "brands" DROP CONSTRAINT IF EXISTS "brands_parent_id_fk";`)
  await db.execute(sql`DROP INDEX IF EXISTS "brands_parent_idx";`)
  await db.execute(sql`ALTER TABLE "brands" DROP COLUMN IF EXISTS "parent_id";`)
  await db.execute(sql`ALTER TABLE "brands" DROP COLUMN IF EXISTS "level";`)
  await db.execute(sql`ALTER TABLE "brands" DROP COLUMN IF EXISTS "visible";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Add tagline and certifications to brands table
 *
 * - tagline: text field for badge display (e.g. "Officiële partner")
 * - certifications: array table for certification badges (ISO 13485, CE, etc.)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add tagline column
  await db.execute(sql`
    ALTER TABLE "brands"
    ADD COLUMN IF NOT EXISTS "tagline" varchar;
  `)

  // Create certifications array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "brands_certifications" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "name" varchar NOT NULL,
      "icon" varchar
    );
  `)
  await db.execute(sql`
    ALTER TABLE "brands_certifications"
    ADD CONSTRAINT "brands_certifications_parent_id_fk" FOREIGN KEY ("_parent_id")
    REFERENCES "brands"("id") ON UPDATE no action ON DELETE cascade;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "brands_certifications_order_idx" ON "brands_certifications" ("_order");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "brands_certifications_parent_id_idx" ON "brands_certifications" ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "brands_certifications";`)
  await db.execute(sql`ALTER TABLE "brands" DROP COLUMN IF EXISTS "tagline";`)
}

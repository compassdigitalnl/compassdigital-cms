import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Digital Library
 *
 * Adds digital edition fields to the magazines_editions table
 * and creates the digital_edition_pages table for storing
 * rendered page images.
 *
 * Part of Publishing Branch — Phase 10: Digitale Bibliotheek
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ── 1. Add digital fields to magazines_editions table ──
  // The editions array in Magazines creates a magazines_editions table.
  // We add columns for the digital library feature.

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      ADD COLUMN IF NOT EXISTS "is_digital" boolean DEFAULT false;
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      ADD COLUMN IF NOT EXISTS "digital_pdf_id" integer;
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      ADD COLUMN IF NOT EXISTS "page_count" numeric;
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      ADD COLUMN IF NOT EXISTS "digital_available_from" timestamp(3) with time zone;
  `)

  // Add foreign key for digital_pdf_id -> media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "magazines_editions"
        ADD CONSTRAINT "magazines_editions_digital_pdf_id_fk"
        FOREIGN KEY ("digital_pdf_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Add index for digital_pdf_id
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "magazines_editions_digital_pdf_idx"
      ON "magazines_editions" ("digital_pdf_id");
  `)

  // ── 2. Create digital_edition_pages table ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "digital_edition_pages" (
      "id" serial PRIMARY KEY,
      "magazine_id" integer NOT NULL,
      "edition_index" numeric NOT NULL,
      "page_number" numeric NOT NULL,
      "page_image_id" integer NOT NULL,
      "thumbnail_id" integer,
      "width" numeric,
      "height" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Add foreign keys
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "digital_edition_pages"
        ADD CONSTRAINT "digital_edition_pages_magazine_id_fk"
        FOREIGN KEY ("magazine_id") REFERENCES "magazines"("id") ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "digital_edition_pages"
        ADD CONSTRAINT "digital_edition_pages_page_image_id_fk"
        FOREIGN KEY ("page_image_id") REFERENCES "media"("id") ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "digital_edition_pages"
        ADD CONSTRAINT "digital_edition_pages_thumbnail_id_fk"
        FOREIGN KEY ("thumbnail_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Add indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "digital_edition_pages_magazine_idx"
      ON "digital_edition_pages" ("magazine_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "digital_edition_pages_page_image_idx"
      ON "digital_edition_pages" ("page_image_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "digital_edition_pages_thumbnail_idx"
      ON "digital_edition_pages" ("thumbnail_id");
  `)

  // Compound index for efficient page lookups
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "digital_edition_pages_magazine_edition_page_idx"
      ON "digital_edition_pages" ("magazine_id", "edition_index", "page_number");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "digital_edition_pages_updated_at_idx"
      ON "digital_edition_pages" ("updated_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "digital_edition_pages_created_at_idx"
      ON "digital_edition_pages" ("created_at");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // ── 1. Drop digital_edition_pages table ──
  await db.execute(sql`DROP TABLE IF EXISTS "digital_edition_pages" CASCADE;`)

  // ── 2. Remove digital fields from magazines_editions ──
  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      DROP COLUMN IF EXISTS "digital_available_from";
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      DROP COLUMN IF EXISTS "page_count";
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      DROP CONSTRAINT IF EXISTS "magazines_editions_digital_pdf_id_fk";
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "magazines_editions_digital_pdf_idx";
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      DROP COLUMN IF EXISTS "digital_pdf_id";
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "magazines_editions"
      DROP COLUMN IF EXISTS "is_digital";
  `)
}

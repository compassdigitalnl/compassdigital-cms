import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create enum for brands._status
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_brands__status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Add _status column to brands
  await db.execute(sql`
    ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "_status" "enum_brands__status" DEFAULT 'published';
  `)

  // Set existing brands to published
  await db.execute(sql`
    UPDATE "brands" SET "_status" = 'published' WHERE "_status" IS NULL;
  `)

  // Create _brands_v versions table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_brands_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer REFERENCES "brands"("id") ON DELETE SET NULL,
      "version_name" varchar,
      "version_slug" varchar,
      "version_parent_id" integer,
      "version_level" numeric,
      "version_tagline" varchar,
      "version_logo_id" integer,
      "version_description" jsonb,
      "version_website" varchar,
      "version_featured" boolean,
      "version_order" numeric,
      "version_visible" boolean,
      "version_meta_title" varchar,
      "version_meta_description" varchar,
      "version_meta_image_id" integer,
      "version_updated_at" timestamptz,
      "version_created_at" timestamptz,
      "version__status" "enum_brands__status",
      "created_at" timestamptz DEFAULT now() NOT NULL,
      "updated_at" timestamptz DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_brands_v_parent" ON "_brands_v" ("parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_brands_v_latest" ON "_brands_v" ("latest");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_brands_v_autosave" ON "_brands_v" ("autosave");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_brands_v_created_at" ON "_brands_v" ("created_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_brands_v_updated_at" ON "_brands_v" ("updated_at");`)

  // Create _brands_v_version_certifications subtable
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_brands_v_version_certifications" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer REFERENCES "_brands_v"("id") ON DELETE CASCADE NOT NULL,
      "name" varchar,
      "icon" varchar
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_brands_v_cert_parent" ON "_brands_v_version_certifications" ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_brands_v_version_certifications";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_brands_v";`)
  await db.execute(sql`ALTER TABLE "brands" DROP COLUMN IF EXISTS "_status";`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_brands__status";`)
}

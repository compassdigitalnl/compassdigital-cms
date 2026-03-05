import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create branches main table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "branches" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "icon" varchar,
      "badge" varchar DEFAULT 'Branche',
      "title" varchar,
      "description" varchar,
      "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "testimonial_initials" varchar,
      "testimonial_quote" varchar,
      "testimonial_author_name" varchar,
      "testimonial_author_role" varchar,
      "testimonial_rating" numeric,
      "cta_title" varchar,
      "cta_description" varchar,
      "featured" boolean DEFAULT false,
      "order" numeric DEFAULT 0,
      "visible" boolean DEFAULT true,
      "meta_title" varchar,
      "meta_description" varchar,
      "meta_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "branches_slug_idx" ON "branches" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "branches_image_idx" ON "branches" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "branches_meta_image_idx" ON "branches" USING btree ("meta_image_id");
    CREATE INDEX IF NOT EXISTS "branches_created_at_idx" ON "branches" USING btree ("created_at");
  `)

  // 2. Create branches_stats array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "branches_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "branches"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "value" varchar,
      "label" varchar
    );

    CREATE INDEX IF NOT EXISTS "branches_stats_order_idx" ON "branches_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "branches_stats_parent_id_idx" ON "branches_stats" USING btree ("_parent_id");
  `)

  // 3. Create branches_usp_cards array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "branches_usp_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "branches"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "icon" varchar,
      "icon_color" varchar,
      "icon_bg" varchar,
      "title" varchar,
      "description" varchar
    );

    CREATE INDEX IF NOT EXISTS "branches_usp_cards_order_idx" ON "branches_usp_cards" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "branches_usp_cards_parent_id_idx" ON "branches_usp_cards" USING btree ("_parent_id");
  `)

  // 4. Add branches_id column to products_rels (for hasMany relationship)
  await db.execute(sql`
    ALTER TABLE "products_rels" ADD COLUMN IF NOT EXISTS "branches_id" integer;

    DO $$ BEGIN
      ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_branches_fk"
        FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "products_rels_branches_id_idx" ON "products_rels" USING btree ("branches_id");
  `)

  // 5. Add branches_id column to payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "branches_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_branches_fk"
        FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_branches_id_idx" ON "payload_locked_documents_rels" USING btree ("branches_id");
  `)

  // 6. Add archive SEO columns to settings
  await db.execute(sql`
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "archive_seo_shop_title" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "archive_seo_shop_description" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "archive_seo_brands_title" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "archive_seo_brands_description" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "archive_seo_branches_title" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "archive_seo_branches_description" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove archive SEO columns from settings
  await db.execute(sql`
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "archive_seo_shop_title";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "archive_seo_shop_description";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "archive_seo_brands_title";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "archive_seo_brands_description";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "archive_seo_branches_title";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "archive_seo_branches_description";
  `)

  // Remove branches_id from payload_locked_documents_rels
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_branches_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_branches_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "branches_id";
  `)

  // Remove branches_id from products_rels
  await db.execute(sql`
    DROP INDEX IF EXISTS "products_rels_branches_id_idx";
    ALTER TABLE "products_rels" DROP CONSTRAINT IF EXISTS "products_rels_branches_fk";
    ALTER TABLE "products_rels" DROP COLUMN IF EXISTS "branches_id";
  `)

  // Drop array tables and main table
  await db.execute(sql`
    DROP TABLE IF EXISTS "branches_usp_cards";
    DROP TABLE IF EXISTS "branches_stats";
    DROP TABLE IF EXISTS "branches";
  `)
}

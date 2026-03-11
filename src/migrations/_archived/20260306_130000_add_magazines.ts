import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create enum for frequency
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_magazines_frequency" AS ENUM('weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'biannual', 'yearly');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Main magazines table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "magazines" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "tagline" varchar,
      "description" jsonb,
      "frequency" "enum_magazines_frequency" DEFAULT 'quarterly',
      "issn" varchar,
      "logo_id" integer,
      "cover_id" integer,
      "hero_image_id" integer,
      "badge" varchar DEFAULT 'Magazine',
      "hero_title" varchar,
      "subscription_price" varchar,
      "subscription_url" varchar,
      "cta_title" varchar,
      "cta_description" varchar,
      "testimonial_initials" varchar,
      "testimonial_quote" varchar,
      "testimonial_author_name" varchar,
      "testimonial_author_role" varchar,
      "testimonial_rating" numeric,
      "meta_title" varchar,
      "meta_description" varchar,
      "meta_image_id" integer,
      "featured" boolean DEFAULT false,
      "order" numeric DEFAULT 0,
      "visible" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "magazines_slug_idx" UNIQUE("slug")
    );
  `)

  // Stats array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "magazines_stats" (
      "id" serial PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL,
      "label" varchar NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      CONSTRAINT "magazines_stats_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "magazines"("id") ON DELETE CASCADE
    );
  `)

  // Editions array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "magazines_editions" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "issue_number" varchar,
      "year" numeric,
      "cover_id" integer,
      "price" numeric,
      "publish_date" timestamp(3) with time zone,
      "sold_out" boolean DEFAULT false,
      "description" varchar,
      "shop_url" varchar,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      CONSTRAINT "magazines_editions_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "magazines"("id") ON DELETE CASCADE
    );
  `)

  // USP Cards array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "magazines_usp_cards" (
      "id" serial PRIMARY KEY NOT NULL,
      "icon" varchar,
      "icon_color" varchar,
      "icon_bg" varchar,
      "title" varchar NOT NULL,
      "description" varchar,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      CONSTRAINT "magazines_usp_cards_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "magazines"("id") ON DELETE CASCADE
    );
  `)

  // FK indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "magazines_logo_idx" ON "magazines" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "magazines_cover_idx" ON "magazines" USING btree ("cover_id");
    CREATE INDEX IF NOT EXISTS "magazines_hero_image_idx" ON "magazines" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "magazines_meta_image_idx" ON "magazines" USING btree ("meta_image_id");
    CREATE INDEX IF NOT EXISTS "magazines_updated_at_idx" ON "magazines" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "magazines_created_at_idx" ON "magazines" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "magazines_stats_order_parent_idx" ON "magazines_stats" USING btree ("_order", "_parent_id");
    CREATE INDEX IF NOT EXISTS "magazines_editions_order_parent_idx" ON "magazines_editions" USING btree ("_order", "_parent_id");
    CREATE INDEX IF NOT EXISTS "magazines_editions_cover_idx" ON "magazines_editions" USING btree ("cover_id");
    CREATE INDEX IF NOT EXISTS "magazines_usp_cards_order_parent_idx" ON "magazines_usp_cards" USING btree ("_order", "_parent_id");
  `)

  // Add magazines to payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "magazines_id" integer;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_magazines_idx"
    ON "payload_locked_documents_rels" USING btree ("magazines_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "magazines_usp_cards";`)
  await db.execute(sql`DROP TABLE IF EXISTS "magazines_editions";`)
  await db.execute(sql`DROP TABLE IF EXISTS "magazines_stats";`)
  await db.execute(sql`DROP TABLE IF EXISTS "magazines";`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_magazines_frequency";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "magazines_id";`)
}

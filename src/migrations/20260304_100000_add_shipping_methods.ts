import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Add shipping_methods collection
 *
 * Creates:
 * - shipping_methods table
 * - shipping_methods_countries (hasMany join table)
 * - Seeds 3 default shipping methods
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create shipping_methods table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "shipping_methods" (
      "id" serial PRIMARY KEY,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "description" varchar,
      "icon" varchar DEFAULT 'truck',
      "price" numeric NOT NULL DEFAULT 0,
      "free_threshold" numeric,
      "estimated_days" numeric,
      "delivery_time" varchar,
      "is_active" boolean DEFAULT true,
      "sort_order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create countries join table (hasMany select)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "shipping_methods_countries" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL REFERENCES "shipping_methods"("id") ON DELETE CASCADE,
      "value" varchar,
      "id" serial PRIMARY KEY
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "shipping_methods_countries_order_idx" ON "shipping_methods_countries" ("order");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "shipping_methods_countries_parent_id_idx" ON "shipping_methods_countries" ("parent_id");
  `)

  // Seed default shipping methods
  await db.execute(sql`
    INSERT INTO "shipping_methods" ("name", "slug", "description", "icon", "price", "free_threshold", "estimated_days", "delivery_time", "is_active", "sort_order")
    VALUES
      ('Standaard verzending', 'standard', 'Bezorging op je deurmat', 'truck', 6.95, 150, 3, '2-3 werkdagen', true, 0),
      ('Express verzending', 'express', 'Volgende werkdag bezorgd', 'zap', 9.95, NULL, 1, 'Volgende werkdag', true, 1),
      ('Ophalen in winkel', 'pickup', 'Gratis ophalen op locatie', 'package', 0, NULL, 0, 'Direct beschikbaar', true, 2)
    ON CONFLICT ("slug") DO NOTHING;
  `)

  // Add column to payload_locked_documents_rels (required by Payload CMS)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "shipping_methods_id" integer REFERENCES "shipping_methods"("id") ON DELETE CASCADE;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "idx_payload_locked_docs_rels_shipping_methods" ON "payload_locked_documents_rels" ("shipping_methods_id");
  `)

  // Seed countries for each method (NL for all)
  await db.execute(sql`
    INSERT INTO "shipping_methods_countries" ("order", "parent_id", "value")
    SELECT 0, sm.id, 'NL' FROM "shipping_methods" sm WHERE sm.slug = 'standard'
    ON CONFLICT DO NOTHING;
  `)
  await db.execute(sql`
    INSERT INTO "shipping_methods_countries" ("order", "parent_id", "value")
    SELECT 0, sm.id, 'BE' FROM "shipping_methods" sm WHERE sm.slug = 'standard'
    ON CONFLICT DO NOTHING;
  `)
  await db.execute(sql`
    INSERT INTO "shipping_methods_countries" ("order", "parent_id", "value")
    SELECT 0, sm.id, 'NL' FROM "shipping_methods" sm WHERE sm.slug = 'express'
    ON CONFLICT DO NOTHING;
  `)
  await db.execute(sql`
    INSERT INTO "shipping_methods_countries" ("order", "parent_id", "value")
    SELECT 0, sm.id, 'NL' FROM "shipping_methods" sm WHERE sm.slug = 'pickup'
    ON CONFLICT DO NOTHING;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "shipping_methods_countries";`)
  await db.execute(sql`DROP TABLE IF EXISTS "shipping_methods";`)
}

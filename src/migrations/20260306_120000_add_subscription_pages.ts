import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Add subscription_pages collection tables
 *
 * New collection for dedicated subscription landing pages with
 * plan comparison, add-ons, seats, and checkout configuration.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // === ENUMS ===
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_subscription_pages_plans_billing_options_period"
        AS ENUM('monthly', 'quarterly', 'biannual', 'yearly');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_subscription_pages_payment_provider"
        AS ENUM('mollie', 'stripe', 'external');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // === MAIN TABLE ===
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscription_pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "brand_id" integer,
      "headline" varchar,
      "subheadline" varchar,
      "hero_image_id" integer,
      "active" boolean DEFAULT true,
      "seats_enabled" boolean DEFAULT false,
      "seats_label" varchar DEFAULT 'Aantal licenties',
      "seats_min_seats" numeric DEFAULT 1,
      "seats_max_seats" numeric DEFAULT 100,
      "seats_price_per_seat" numeric,
      "checkout_title" varchar DEFAULT 'Rond je bestelling af',
      "payment_provider" "enum_subscription_pages_payment_provider" DEFAULT 'mollie',
      "external_checkout_url" varchar,
      "success_message" varchar DEFAULT 'Bedankt voor je bestelling! Je ontvangt een bevestiging per e-mail.',
      "success_redirect_url" varchar,
      "meta_title" varchar,
      "meta_description" varchar,
      "meta_image_id" integer,
      "updated_at" timestamptz DEFAULT now() NOT NULL,
      "created_at" timestamptz DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "subscription_pages_slug_idx"
      ON "subscription_pages" ("slug");
    CREATE INDEX IF NOT EXISTS "subscription_pages_brand_idx"
      ON "subscription_pages" ("brand_id");
    CREATE INDEX IF NOT EXISTS "subscription_pages_created_at_idx"
      ON "subscription_pages" ("created_at");
    CREATE INDEX IF NOT EXISTS "subscription_pages_updated_at_idx"
      ON "subscription_pages" ("updated_at");
  `)

  // === PLANS ARRAY ===
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscription_pages_plans" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "highlighted" boolean DEFAULT false,
      "highlight_label" varchar,
      "cta_label" varchar DEFAULT 'Kies dit plan',
      "sort_order" numeric DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS "subscription_pages_plans_order_idx"
      ON "subscription_pages_plans" ("_order");
    CREATE INDEX IF NOT EXISTS "subscription_pages_plans_parent_id_idx"
      ON "subscription_pages_plans" ("_parent_id");

    ALTER TABLE "subscription_pages_plans"
      ADD CONSTRAINT "subscription_pages_plans_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "subscription_pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  `)

  // === BILLING OPTIONS (nested array under plans) ===
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscription_pages_plans_billing_options" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "period" "enum_subscription_pages_plans_billing_options_period" NOT NULL,
      "price" numeric NOT NULL,
      "compare_price" numeric
    );

    CREATE INDEX IF NOT EXISTS "sub_pages_plans_billing_order_idx"
      ON "subscription_pages_plans_billing_options" ("_order");
    CREATE INDEX IF NOT EXISTS "sub_pages_plans_billing_parent_idx"
      ON "subscription_pages_plans_billing_options" ("_parent_id");

    ALTER TABLE "subscription_pages_plans_billing_options"
      ADD CONSTRAINT "sub_pages_plans_billing_parent_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "subscription_pages_plans"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  `)

  // === FEATURES (nested array under plans) ===
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscription_pages_plans_features" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL,
      "included" boolean DEFAULT true
    );

    CREATE INDEX IF NOT EXISTS "sub_pages_plans_features_order_idx"
      ON "subscription_pages_plans_features" ("_order");
    CREATE INDEX IF NOT EXISTS "sub_pages_plans_features_parent_idx"
      ON "subscription_pages_plans_features" ("_parent_id");

    ALTER TABLE "subscription_pages_plans_features"
      ADD CONSTRAINT "sub_pages_plans_features_parent_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "subscription_pages_plans"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  `)

  // === ADD-ONS ARRAY ===
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscription_pages_add_ons" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "description" varchar,
      "price" numeric NOT NULL,
      "icon" varchar
    );

    CREATE INDEX IF NOT EXISTS "sub_pages_add_ons_order_idx"
      ON "subscription_pages_add_ons" ("_order");
    CREATE INDEX IF NOT EXISTS "sub_pages_add_ons_parent_idx"
      ON "subscription_pages_add_ons" ("_parent_id");

    ALTER TABLE "subscription_pages_add_ons"
      ADD CONSTRAINT "sub_pages_add_ons_parent_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "subscription_pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  `)

  // === TRUST ITEMS ARRAY ===
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscription_pages_trust_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon" varchar,
      "text" varchar NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "sub_pages_trust_items_order_idx"
      ON "subscription_pages_trust_items" ("_order");
    CREATE INDEX IF NOT EXISTS "sub_pages_trust_items_parent_idx"
      ON "subscription_pages_trust_items" ("_parent_id");

    ALTER TABLE "subscription_pages_trust_items"
      ADD CONSTRAINT "sub_pages_trust_items_parent_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "subscription_pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  `)

  // === RELS TABLE (for relationship tracking) ===
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "subscription_pages_id" integer;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sub_pages_idx"
      ON "payload_locked_documents_rels" ("subscription_pages_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "subscription_pages_trust_items";
    DROP TABLE IF EXISTS "subscription_pages_add_ons";
    DROP TABLE IF EXISTS "subscription_pages_plans_features";
    DROP TABLE IF EXISTS "subscription_pages_plans_billing_options";
    DROP TABLE IF EXISTS "subscription_pages_plans";
    DROP TABLE IF EXISTS "subscription_pages";

    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "subscription_pages_id";

    DROP TYPE IF EXISTS "enum_subscription_pages_plans_billing_options_period";
    DROP TYPE IF EXISTS "enum_subscription_pages_payment_provider";
  `)
}

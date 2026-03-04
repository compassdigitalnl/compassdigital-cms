import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Add e_commerce_settings global
 *
 * Creates the e-commerce-settings global tables and seeds data
 * from existing shipping_methods + checkout_payment_options collections
 * and settings global (e-commerce/B2B/features tabs).
 *
 * Existing collection tables are NOT dropped (data preserved).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ─── Main global table ─────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "e_commerce_settings" (
      "id" serial PRIMARY KEY,
      "free_shipping_threshold" numeric DEFAULT 150,
      "shipping_cost" numeric DEFAULT 6.95,
      "delivery_time" varchar DEFAULT 'Besteld voor 16:00, morgen in huis',
      "delivery_days_monday" boolean DEFAULT true,
      "delivery_days_tuesday" boolean DEFAULT true,
      "delivery_days_wednesday" boolean DEFAULT true,
      "delivery_days_thursday" boolean DEFAULT true,
      "delivery_days_friday" boolean DEFAULT true,
      "delivery_days_saturday" boolean DEFAULT false,
      "delivery_days_sunday" boolean DEFAULT false,
      "return_days" numeric DEFAULT 30,
      "return_policy" jsonb,
      "features_enable_quick_order" boolean DEFAULT true,
      "features_enable_order_lists" boolean DEFAULT true,
      "features_enable_reviews" boolean DEFAULT false,
      "features_enable_wishlist" boolean DEFAULT true,
      "features_enable_stock_notifications" boolean DEFAULT false,
      "features_enable_live_chat" boolean DEFAULT false,
      "minimum_order_amount" numeric,
      "show_prices_excl_v_a_t" boolean DEFAULT true,
      "vat_percentage" numeric DEFAULT 21,
      "require_account_for_purchase" boolean DEFAULT true,
      "enable_guest_checkout" boolean DEFAULT false,
      "require_b2_b_approval" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // ─── Shop filter order array table ──────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "e_commerce_settings_shop_filter_order" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "e_commerce_settings"("id") ON DELETE CASCADE,
      "filter_id" varchar,
      "enabled" boolean DEFAULT true,
      "display_name" varchar
    );
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_shop_filter_order_order_idx"
    ON "e_commerce_settings_shop_filter_order" ("_order");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_shop_filter_order_parent_id_idx"
    ON "e_commerce_settings_shop_filter_order" ("_parent_id");
  `)

  // ─── Shipping methods array table ───────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "e_commerce_settings_shipping_methods" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "e_commerce_settings"("id") ON DELETE CASCADE,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar,
      "icon" varchar DEFAULT 'truck',
      "price" numeric NOT NULL DEFAULT 0,
      "free_threshold" numeric,
      "estimated_days" numeric,
      "delivery_time" varchar,
      "is_active" boolean DEFAULT true,
      "sort_order" numeric DEFAULT 0
    );
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_shipping_methods_order_idx"
    ON "e_commerce_settings_shipping_methods" ("_order");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_shipping_methods_parent_id_idx"
    ON "e_commerce_settings_shipping_methods" ("_parent_id");
  `)

  // ─── Shipping methods countries (hasMany select junction) ─────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ecom_ship_countries" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL REFERENCES "e_commerce_settings_shipping_methods"("id") ON DELETE CASCADE,
      "value" varchar,
      "id" serial PRIMARY KEY
    );
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "ecom_ship_countries_order_idx" ON "ecom_ship_countries" ("order");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "ecom_ship_countries_parent_id_idx" ON "ecom_ship_countries" ("parent_id");
  `)

  // Create enum type for countries select
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "ecom_ship_country_vals" AS ENUM('NL', 'BE', 'DE', 'FR', 'UK');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // ─── Payment options array table ────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "e_commerce_settings_payment_options" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "e_commerce_settings"("id") ON DELETE CASCADE,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar,
      "icon_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "lucide_icon" varchar,
      "provider" varchar DEFAULT 'manual',
      "fee" varchar,
      "badge" varchar,
      "is_b2_b" boolean DEFAULT false,
      "is_active" boolean DEFAULT true,
      "sort_order" numeric DEFAULT 0
    );
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_payment_options_order_idx"
    ON "e_commerce_settings_payment_options" ("_order");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_payment_options_parent_id_idx"
    ON "e_commerce_settings_payment_options" ("_parent_id");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_payment_options_icon_idx"
    ON "e_commerce_settings_payment_options" ("icon_id");
  `)

  // ─── Seed: Create the global row ───────────────────
  // Copy values from settings global if they exist
  await db.execute(sql`
    INSERT INTO "e_commerce_settings" (
      "id",
      "free_shipping_threshold", "shipping_cost", "delivery_time",
      "delivery_days_monday", "delivery_days_tuesday", "delivery_days_wednesday",
      "delivery_days_thursday", "delivery_days_friday", "delivery_days_saturday", "delivery_days_sunday",
      "return_days", "return_policy",
      "features_enable_quick_order", "features_enable_order_lists",
      "features_enable_reviews", "features_enable_wishlist",
      "features_enable_stock_notifications", "features_enable_live_chat",
      "minimum_order_amount", "show_prices_excl_v_a_t", "vat_percentage",
      "require_account_for_purchase", "enable_guest_checkout", "require_b2_b_approval"
    )
    SELECT
      1,
      COALESCE(s.free_shipping_threshold, 150),
      COALESCE(s.shipping_cost, 6.95),
      COALESCE(s.delivery_time, 'Besteld voor 16:00, morgen in huis'),
      COALESCE(s.delivery_days_monday, true),
      COALESCE(s.delivery_days_tuesday, true),
      COALESCE(s.delivery_days_wednesday, true),
      COALESCE(s.delivery_days_thursday, true),
      COALESCE(s.delivery_days_friday, true),
      COALESCE(s.delivery_days_saturday, false),
      COALESCE(s.delivery_days_sunday, false),
      COALESCE(s.return_days, 30),
      s.return_policy,
      COALESCE(s.features_enable_quick_order, true),
      COALESCE(s.features_enable_order_lists, true),
      COALESCE(s.features_enable_reviews, false),
      COALESCE(s.features_enable_wishlist, true),
      COALESCE(s.features_enable_stock_notifications, false),
      COALESCE(s.features_enable_live_chat, false),
      s.minimum_order_amount,
      COALESCE(s.show_prices_excl_v_a_t, true),
      COALESCE(s.vat_percentage, 21),
      COALESCE(s.require_account_for_purchase, true),
      COALESCE(s.enable_guest_checkout, false),
      COALESCE(s.require_b2_b_approval, true)
    FROM "settings" s
    WHERE s.id = 1
    ON CONFLICT ("id") DO NOTHING;
  `)

  // If settings row didn't exist, insert defaults
  await db.execute(sql`
    INSERT INTO "e_commerce_settings" ("id") VALUES (1)
    ON CONFLICT ("id") DO NOTHING;
  `)

  // ─── Seed: Copy shop filter order from settings ─────
  await db.execute(sql`
    INSERT INTO "e_commerce_settings_shop_filter_order" ("_order", "_parent_id", "filter_id", "enabled", "display_name")
    SELECT sfo."_order", 1, sfo."filter_id", sfo."enabled", sfo."display_name"
    FROM "settings_shop_filter_order" sfo
    WHERE sfo."_parent_id" = 1
    ORDER BY sfo."_order";
  `)

  // ─── Seed: Copy shipping methods from collection ────
  await db.execute(sql`
    INSERT INTO "e_commerce_settings_shipping_methods"
      ("_order", "_parent_id", "name", "slug", "description", "icon", "price", "free_threshold", "estimated_days", "delivery_time", "is_active", "sort_order")
    SELECT
      ROW_NUMBER() OVER (ORDER BY sm.sort_order, sm.id) - 1,
      1,
      sm.name, sm.slug, sm.description, sm.icon, sm.price, sm.free_threshold,
      sm.estimated_days, sm.delivery_time, sm.is_active, sm.sort_order
    FROM "shipping_methods" sm
    ORDER BY sm.sort_order, sm.id;
  `)

  // Copy countries for each shipping method
  await db.execute(sql`
    INSERT INTO "ecom_ship_countries" ("order", "parent_id", "value")
    SELECT
      smc."order",
      esm.id,
      smc.value
    FROM "shipping_methods_countries" smc
    JOIN "shipping_methods" sm ON sm.id = smc.parent_id
    JOIN "e_commerce_settings_shipping_methods" esm ON esm.slug = sm.slug
    ORDER BY esm.id, smc."order";
  `)

  // ─── Seed: Copy payment options from collection ─────
  await db.execute(sql`
    INSERT INTO "e_commerce_settings_payment_options"
      ("_order", "_parent_id", "name", "slug", "description", "icon_id", "lucide_icon", "provider", "fee", "badge", "is_b2_b", "is_active", "sort_order")
    SELECT
      ROW_NUMBER() OVER (ORDER BY cpo.sort_order, cpo.id) - 1,
      1,
      cpo.name, cpo.slug, cpo.description, cpo.icon_id, cpo.lucide_icon, cpo.provider,
      cpo.fee, cpo.badge, cpo.is_b2_b, cpo.is_active, cpo.sort_order
    FROM "checkout_payment_options" cpo
    ORDER BY cpo.sort_order, cpo.id;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "ecom_ship_countries";`)
  await db.execute(sql`DROP TABLE IF EXISTS "e_commerce_settings_payment_options";`)
  await db.execute(sql`DROP TABLE IF EXISTS "e_commerce_settings_shipping_methods";`)
  await db.execute(sql`DROP TABLE IF EXISTS "e_commerce_settings_shop_filter_order";`)
  await db.execute(sql`DROP TABLE IF EXISTS "e_commerce_settings";`)
  await db.execute(sql`DROP TYPE IF EXISTS "ecom_ship_country_vals";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Delta migration: Add tables and columns for new product types
 * (bundle, bookable, configurator, personalized, subscription)
 *
 * These product types were added as feature-gated tabs in the Products collection.
 * The migration creates the necessary array tables and group columns.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // === ENUM TYPES ===
  await db.execute(sql`
    CREATE TYPE "public"."prod_pers_opt_field_type" AS ENUM('text', 'font', 'color', 'image');
    CREATE TYPE "public"."enum_products_subscription_config_subscription_plans_interval" AS ENUM('day', 'week', 'month', 'quarter', 'year');
    CREATE TYPE "public"."enum_products_subscription_config_subscription_type" AS ENUM('recurring', 'personal', 'gift', 'trial');
  `)

  // === BUNDLE PRODUCT TABLES ===
  await db.execute(sql`
    CREATE TABLE "products_bundle_config_bundle_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "product_id" integer,
      "quantity" numeric,
      "required" boolean DEFAULT true,
      "discount" numeric,
      "sort_order" numeric DEFAULT 0
    );

    CREATE TABLE "products_bundle_config_bundle_discount_tiers" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "min_quantity" numeric,
      "discount_percentage" numeric,
      "label" varchar
    );
  `)

  // === BOOKABLE PRODUCT TABLES ===
  await db.execute(sql`
    CREATE TABLE "products_bookable_config_duration_options" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "duration" numeric,
      "label" varchar,
      "price" numeric,
      "popular" boolean DEFAULT false,
      "description" varchar
    );

    CREATE TABLE "products_bookable_config_time_slots" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "time" varchar,
      "available" boolean DEFAULT true,
      "spots_left" numeric,
      "price_override" numeric
    );

    CREATE TABLE "products_bookable_config_participant_categories" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "price" numeric,
      "min_count" numeric DEFAULT 1,
      "max_count" numeric,
      "description" varchar
    );

    CREATE TABLE "products_bookable_config_add_ons" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "price" numeric,
      "required" boolean DEFAULT false,
      "description" varchar
    );
  `)

  // === CONFIGURATOR PRODUCT TABLES ===
  await db.execute(sql`
    CREATE TABLE "products_configurator_config_configurator_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "required" boolean DEFAULT true,
      "description" varchar
    );

    CREATE TABLE "products_configurator_config_configurator_steps_options" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "price" numeric,
      "recommended" boolean DEFAULT false,
      "description" varchar,
      "image_id" integer
    );
  `)

  // === PERSONALIZED PRODUCT TABLES ===
  await db.execute(sql`
    CREATE TABLE "prod_pers_opts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "field_name" varchar,
      "field_type" "prod_pers_opt_field_type",
      "required" boolean DEFAULT false,
      "price_modifier" numeric,
      "max_length" numeric,
      "production_time_added" numeric,
      "placeholder" varchar
    );

    CREATE TABLE "products_personalization_config_available_fonts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "font_name" varchar
    );

    CREATE TABLE "products_personalization_config_preset_colors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "color_name" varchar,
      "color_code" varchar
    );
  `)

  // === SUBSCRIPTION PRODUCT TABLES ===
  await db.execute(sql`
    CREATE TABLE "products_subscription_config_subscription_plans" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "interval" "enum_products_subscription_config_subscription_plans_interval",
      "price" numeric,
      "discount_percentage" numeric,
      "edition_count" numeric,
      "auto_renew" boolean DEFAULT true,
      "popular" boolean DEFAULT false
    );

    CREATE TABLE "products_subscription_config_subscription_plans_features" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "feature" varchar
    );
  `)

  // === ADD COLUMNS TO PRODUCTS TABLE ===
  await db.execute(sql`
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bundle_config_show_bundle_savings" boolean DEFAULT true;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bookable_config_total_capacity" numeric;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bookable_config_buffer_time" numeric DEFAULT 0;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bookable_config_show_prices_on_calendar" boolean DEFAULT false;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "personalization_config_base_production_days" numeric DEFAULT 5;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "personalization_config_rush_available" boolean DEFAULT false;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "personalization_config_rush_fee" numeric;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subscription_config_trial_days" numeric DEFAULT 0;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subscription_config_min_subscription_length" numeric;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subscription_config_max_subscription_length" numeric;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subscription_config_cancellation_policy" varchar;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subscription_config_subscription_type" "enum_products_subscription_config_subscription_type" DEFAULT 'recurring';
  `)

  // === FOREIGN KEYS ===
  await db.execute(sql`
    ALTER TABLE "products_bundle_config_bundle_items" ADD CONSTRAINT "products_bundle_config_bundle_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "products_bundle_config_bundle_items" ADD CONSTRAINT "products_bundle_config_bundle_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_bundle_config_bundle_discount_tiers" ADD CONSTRAINT "products_bundle_config_bundle_discount_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_bookable_config_duration_options" ADD CONSTRAINT "products_bookable_config_duration_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_bookable_config_time_slots" ADD CONSTRAINT "products_bookable_config_time_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_bookable_config_participant_categories" ADD CONSTRAINT "products_bookable_config_participant_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_bookable_config_add_ons" ADD CONSTRAINT "products_bookable_config_add_ons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_configurator_config_configurator_steps" ADD CONSTRAINT "products_configurator_config_configurator_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_configurator_config_configurator_steps_options" ADD CONSTRAINT "products_configurator_config_configurator_steps_options_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "products_configurator_config_configurator_steps_options" ADD CONSTRAINT "products_configurator_config_configurator_steps_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_configurator_config_configurator_steps"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "prod_pers_opts" ADD CONSTRAINT "prod_pers_opts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_personalization_config_available_fonts" ADD CONSTRAINT "products_personalization_config_available_fonts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_personalization_config_preset_colors" ADD CONSTRAINT "products_personalization_config_preset_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_subscription_config_subscription_plans" ADD CONSTRAINT "products_subscription_config_subscription_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_subscription_config_subscription_plans_features" ADD CONSTRAINT "products_subscription_config_subscription_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_subscription_config_subscription_plans"("id") ON DELETE cascade ON UPDATE no action;
  `)

  // === INDEXES ===
  await db.execute(sql`
    CREATE INDEX "products_bundle_config_bundle_items_order_idx" ON "products_bundle_config_bundle_items" USING btree ("_order");
    CREATE INDEX "products_bundle_config_bundle_items_parent_id_idx" ON "products_bundle_config_bundle_items" USING btree ("_parent_id");
    CREATE INDEX "products_bundle_config_bundle_items_product_idx" ON "products_bundle_config_bundle_items" USING btree ("product_id");
    CREATE INDEX "products_bundle_config_bundle_discount_tiers_order_idx" ON "products_bundle_config_bundle_discount_tiers" USING btree ("_order");
    CREATE INDEX "products_bundle_config_bundle_discount_tiers_parent_id_idx" ON "products_bundle_config_bundle_discount_tiers" USING btree ("_parent_id");
    CREATE INDEX "products_bookable_config_duration_options_order_idx" ON "products_bookable_config_duration_options" USING btree ("_order");
    CREATE INDEX "products_bookable_config_duration_options_parent_id_idx" ON "products_bookable_config_duration_options" USING btree ("_parent_id");
    CREATE INDEX "products_bookable_config_time_slots_order_idx" ON "products_bookable_config_time_slots" USING btree ("_order");
    CREATE INDEX "products_bookable_config_time_slots_parent_id_idx" ON "products_bookable_config_time_slots" USING btree ("_parent_id");
    CREATE INDEX "products_bookable_config_participant_categories_order_idx" ON "products_bookable_config_participant_categories" USING btree ("_order");
    CREATE INDEX "products_bookable_config_participant_categories_parent_id_idx" ON "products_bookable_config_participant_categories" USING btree ("_parent_id");
    CREATE INDEX "products_bookable_config_add_ons_order_idx" ON "products_bookable_config_add_ons" USING btree ("_order");
    CREATE INDEX "products_bookable_config_add_ons_parent_id_idx" ON "products_bookable_config_add_ons" USING btree ("_parent_id");
    CREATE INDEX "products_configurator_config_configurator_steps_order_idx" ON "products_configurator_config_configurator_steps" USING btree ("_order");
    CREATE INDEX "products_configurator_config_configurator_steps_parent_id_idx" ON "products_configurator_config_configurator_steps" USING btree ("_parent_id");
    CREATE INDEX "products_configurator_config_configurator_steps_options_order_idx" ON "products_configurator_config_configurator_steps_options" USING btree ("_order");
    CREATE INDEX "products_configurator_config_configurator_steps_options_parent_id_idx" ON "products_configurator_config_configurator_steps_options" USING btree ("_parent_id");
    CREATE INDEX "products_configurator_config_configurator_steps_options_image_idx" ON "products_configurator_config_configurator_steps_options" USING btree ("image_id");
    CREATE INDEX "prod_pers_opts_order_idx" ON "prod_pers_opts" USING btree ("_order");
    CREATE INDEX "prod_pers_opts_parent_id_idx" ON "prod_pers_opts" USING btree ("_parent_id");
    CREATE INDEX "products_personalization_config_available_fonts_order_idx" ON "products_personalization_config_available_fonts" USING btree ("_order");
    CREATE INDEX "products_personalization_config_available_fonts_parent_id_idx" ON "products_personalization_config_available_fonts" USING btree ("_parent_id");
    CREATE INDEX "products_personalization_config_preset_colors_order_idx" ON "products_personalization_config_preset_colors" USING btree ("_order");
    CREATE INDEX "products_personalization_config_preset_colors_parent_id_idx" ON "products_personalization_config_preset_colors" USING btree ("_parent_id");
    CREATE INDEX "products_subscription_config_subscription_plans_order_idx" ON "products_subscription_config_subscription_plans" USING btree ("_order");
    CREATE INDEX "products_subscription_config_subscription_plans_parent_id_idx" ON "products_subscription_config_subscription_plans" USING btree ("_parent_id");
    CREATE INDEX "products_subscription_config_subscription_plans_features_order_idx" ON "products_subscription_config_subscription_plans_features" USING btree ("_order");
    CREATE INDEX "products_subscription_config_subscription_plans_features_parent_id_idx" ON "products_subscription_config_subscription_plans_features" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "products_subscription_config_subscription_plans_features" CASCADE;
    DROP TABLE IF EXISTS "products_subscription_config_subscription_plans" CASCADE;
    DROP TABLE IF EXISTS "products_personalization_config_preset_colors" CASCADE;
    DROP TABLE IF EXISTS "products_personalization_config_available_fonts" CASCADE;
    DROP TABLE IF EXISTS "prod_pers_opts" CASCADE;
    DROP TABLE IF EXISTS "products_configurator_config_configurator_steps_options" CASCADE;
    DROP TABLE IF EXISTS "products_configurator_config_configurator_steps" CASCADE;
    DROP TABLE IF EXISTS "products_bookable_config_add_ons" CASCADE;
    DROP TABLE IF EXISTS "products_bookable_config_participant_categories" CASCADE;
    DROP TABLE IF EXISTS "products_bookable_config_time_slots" CASCADE;
    DROP TABLE IF EXISTS "products_bookable_config_duration_options" CASCADE;
    DROP TABLE IF EXISTS "products_bundle_config_bundle_discount_tiers" CASCADE;
    DROP TABLE IF EXISTS "products_bundle_config_bundle_items" CASCADE;

    ALTER TABLE "products" DROP COLUMN IF EXISTS "bundle_config_show_bundle_savings";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "bookable_config_total_capacity";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "bookable_config_buffer_time";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "bookable_config_show_prices_on_calendar";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "personalization_config_base_production_days";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "personalization_config_rush_available";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "personalization_config_rush_fee";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "subscription_config_trial_days";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "subscription_config_min_subscription_length";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "subscription_config_max_subscription_length";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "subscription_config_cancellation_policy";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "subscription_config_subscription_type";

    DROP TYPE IF EXISTS "public"."prod_pers_opt_field_type";
    DROP TYPE IF EXISTS "public"."enum_products_subscription_config_subscription_plans_interval";
    DROP TYPE IF EXISTS "public"."enum_products_subscription_config_subscription_type";
  `)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Add module tables (accounts, cart, checkout, cookie_consents, stock_reservations)
 *
 * Creates 9 new tables for:
 * - Customers (auth collection) + sessions
 * - Addresses
 * - Carts + items + coupons
 * - Cookie Consents
 * - Stock Reservations
 * - Orders texts (hasMany tags field)
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ===========================================================================
  // ENUMS for new collections
  // ===========================================================================
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_addresses_type" AS ENUM('billing', 'shipping', 'both');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_addresses_country" AS ENUM('NL', 'BE', 'DE', 'FR', 'GB', 'US', 'OTHER');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_customers_account_type" AS ENUM('b2c', 'b2b');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_customers_payment_terms" AS ENUM('immediate', '14', '30', '60', '90');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_customers_language" AS ENUM('nl', 'en', 'de');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_customers_currency" AS ENUM('EUR', 'USD', 'GBP');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_customers_status" AS ENUM('pending', 'active', 'inactive', 'blocked');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_carts_status" AS ENUM('active', 'completed', 'abandoned', 'saved', 'quote');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_carts_currency" AS ENUM('EUR', 'USD', 'GBP');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_carts_items_discount_type" AS ENUM('none', 'percentage', 'fixed');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_carts_coupons_discount_type" AS ENUM('percentage', 'fixed', 'free_shipping');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_stock_reservations_status" AS ENUM('active', 'converted', 'released', 'expired');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  // ===========================================================================
  // 1. CUSTOMERS (auth collection)
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "customers" (
    "id" serial PRIMARY KEY NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "name" text,
    "phone" text,
    "date_of_birth" timestamp(3) with time zone,
    "account_type" "enum_customers_account_type" DEFAULT 'b2c' NOT NULL,
    "company" text,
    "vat_number" text,
    "chamber_of_commerce" text,
    "customer_group_id" integer,
    "custom_pricing_role" text,
    "discount" numeric,
    "credit_limit" numeric,
    "payment_terms" "enum_customers_payment_terms" DEFAULT 'immediate',
    "language" "enum_customers_language" DEFAULT 'nl',
    "currency" "enum_customers_currency" DEFAULT 'EUR',
    "newsletter" boolean DEFAULT false,
    "marketing_emails" boolean DEFAULT false,
    "order_notifications" boolean DEFAULT true,
    "status" "enum_customers_status" DEFAULT 'pending' NOT NULL,
    "approved_by_id" integer,
    "approved_at" timestamp(3) with time zone,
    "verified" boolean DEFAULT false,
    "notes" text,
    "total_orders" numeric DEFAULT 0,
    "total_spent" numeric DEFAULT 0,
    "average_order_value" numeric DEFAULT 0,
    "last_order_date" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" text NOT NULL,
    "reset_password_token" text,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" text,
    "hash" text,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone,
    FOREIGN KEY ("customer_group_id") REFERENCES "customer_groups"("id") ON UPDATE no action ON DELETE set null,
    FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE set null
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "customers_customer_group_idx" ON "customers" ("customer_group_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "customers_approved_by_idx" ON "customers" ("approved_by_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "customers_updated_at_idx" ON "customers" ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "customers_created_at_idx" ON "customers" ("created_at");`)
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "customers_email_idx" ON "customers" ("email");`)

  // ===========================================================================
  // 2. CUSTOMERS_SESSIONS (auth sessions sub-table)
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "customers_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" text PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL,
    FOREIGN KEY ("_parent_id") REFERENCES "customers"("id") ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "customers_sessions_order_idx" ON "customers_sessions" ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "customers_sessions_parent_id_idx" ON "customers_sessions" ("_parent_id");`)

  // ===========================================================================
  // 3. ADDRESSES
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "addresses" (
    "id" serial PRIMARY KEY NOT NULL,
    "customer_id" integer NOT NULL,
    "label" text NOT NULL,
    "type" "enum_addresses_type" DEFAULT 'both' NOT NULL,
    "company" text,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "street" text NOT NULL,
    "house_number" text NOT NULL,
    "addition" text,
    "postal_code" text NOT NULL,
    "city" text NOT NULL,
    "state" text,
    "country" "enum_addresses_country" DEFAULT 'NL' NOT NULL,
    "phone" text,
    "delivery_instructions" text,
    "access_code" text,
    "business_hours" text,
    "is_default" boolean DEFAULT false,
    "is_validated" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON UPDATE no action ON DELETE set null
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "addresses_customer_idx" ON "addresses" ("customer_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "addresses_updated_at_idx" ON "addresses" ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "addresses_created_at_idx" ON "addresses" ("created_at");`)

  // ===========================================================================
  // 4. CARTS
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "carts" (
    "id" serial PRIMARY KEY NOT NULL,
    "customer_id" integer,
    "session_id" text,
    "status" "enum_carts_status" DEFAULT 'active' NOT NULL,
    "item_count" numeric DEFAULT 0,
    "subtotal" numeric DEFAULT 0,
    "discount_total" numeric DEFAULT 0,
    "total" numeric DEFAULT 0,
    "currency" "enum_carts_currency" DEFAULT 'EUR',
    "customer_group_id" integer,
    "expires_at" timestamp(3) with time zone,
    "converted_to_order_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON UPDATE no action ON DELETE set null,
    FOREIGN KEY ("customer_group_id") REFERENCES "customer_groups"("id") ON UPDATE no action ON DELETE set null,
    FOREIGN KEY ("converted_to_order_id") REFERENCES "orders"("id") ON UPDATE no action ON DELETE set null
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_customer_idx" ON "carts" ("customer_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_customer_group_idx" ON "carts" ("customer_group_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_converted_to_order_idx" ON "carts" ("converted_to_order_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_updated_at_idx" ON "carts" ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_created_at_idx" ON "carts" ("created_at");`)

  // ===========================================================================
  // 5. CARTS_ITEMS (array sub-table)
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "carts_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" text PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL,
    "variant_id" text,
    "quantity" numeric DEFAULT 1 NOT NULL,
    "unit_price" numeric NOT NULL,
    "total_price" numeric,
    "discount_type" "enum_carts_items_discount_type" DEFAULT 'none',
    "discount_value" numeric,
    "discount_reason" text,
    "notes" text,
    "added_at" timestamp(3) with time zone,
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE no action ON DELETE set null,
    FOREIGN KEY ("_parent_id") REFERENCES "carts"("id") ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_items_order_idx" ON "carts_items" ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_items_parent_id_idx" ON "carts_items" ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_items_product_idx" ON "carts_items" ("product_id");`)

  // ===========================================================================
  // 6. CARTS_COUPONS (array sub-table)
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "carts_coupons" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" text PRIMARY KEY NOT NULL,
    "code" text NOT NULL,
    "discount_type" "enum_carts_coupons_discount_type",
    "discount_value" numeric,
    FOREIGN KEY ("_parent_id") REFERENCES "carts"("id") ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_coupons_order_idx" ON "carts_coupons" ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "carts_coupons_parent_id_idx" ON "carts_coupons" ("_parent_id");`)

  // ===========================================================================
  // 7. COOKIE_CONSENTS
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "cookie_consents" (
    "id" serial PRIMARY KEY NOT NULL,
    "session_id" text NOT NULL,
    "necessary" boolean DEFAULT true NOT NULL,
    "analytics" boolean DEFAULT false NOT NULL,
    "marketing" boolean DEFAULT false NOT NULL,
    "consented_at" timestamp(3) with time zone NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "cookie_consents_session_id_idx" ON "cookie_consents" ("session_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "cookie_consents_updated_at_idx" ON "cookie_consents" ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "cookie_consents_created_at_idx" ON "cookie_consents" ("created_at");`)

  // ===========================================================================
  // 8. STOCK_RESERVATIONS
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "stock_reservations" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL,
    "variant" text,
    "quantity" numeric NOT NULL,
    "cart_id" text,
    "session" text,
    "status" "enum_stock_reservations_status" DEFAULT 'active' NOT NULL,
    "expires_at" timestamp(3) with time zone NOT NULL,
    "converted_to_order_id" integer,
    "notes" text,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE no action ON DELETE set null,
    FOREIGN KEY ("converted_to_order_id") REFERENCES "orders"("id") ON UPDATE no action ON DELETE set null
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_product_idx" ON "stock_reservations" ("product_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_cart_id_idx" ON "stock_reservations" ("cart_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_session_idx" ON "stock_reservations" ("session");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_status_idx" ON "stock_reservations" ("status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_expires_at_idx" ON "stock_reservations" ("expires_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_converted_to_order_idx" ON "stock_reservations" ("converted_to_order_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_updated_at_idx" ON "stock_reservations" ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "stock_reservations_created_at_idx" ON "stock_reservations" ("created_at");`)

  // ===========================================================================
  // 9. ORDERS_TEXTS (hasMany text field for tags)
  // ===========================================================================
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "orders_texts" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "path" text NOT NULL,
    "text" text,
    FOREIGN KEY ("parent_id") REFERENCES "orders"("id") ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "orders_texts_order_parent" ON "orders_texts" ("order","parent_id");`)

  // ===========================================================================
  // Update payload_locked_documents_rels for new collections
  // ===========================================================================
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "customers_id" integer;
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "addresses_id" integer;
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "carts_id" integer;
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "cookie_consents_id" integer;
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "stock_reservations_id" integer;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "orders_texts" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "stock_reservations" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "cookie_consents" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "carts_coupons" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "carts_items" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "carts" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "addresses" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "customers_sessions" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "customers" CASCADE;`)

  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_addresses_type";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_addresses_country";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_customers_account_type";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_customers_payment_terms";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_customers_language";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_customers_currency";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_customers_status";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_carts_status";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_carts_currency";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_carts_items_discount_type";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_carts_coupons_discount_type";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_stock_reservations_status";`)

  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "customers_id";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "addresses_id";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "carts_id";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cookie_consents_id";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "stock_reservations_id";`)
}

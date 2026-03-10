import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Merge DiscountCodes into Promotions
 *
 * - Add promotion_mode and code columns to promotions table
 * - Migrate existing discount codes as promotions with promotionMode='coupon'
 * - Drop discount_codes table
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Add new columns to promotions
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "promotions"
    ADD COLUMN IF NOT EXISTS "promotion_mode" varchar DEFAULT 'automatic',
    ADD COLUMN IF NOT EXISTS "code" varchar;
  `)

  // Add unique index on code (only non-null values)
  await payload.db.drizzle.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "promotions_code_idx" ON "promotions" ("code")
    WHERE "code" IS NOT NULL;
  `)

  // Migrate existing discount codes into promotions
  await payload.db.drizzle.execute(sql`
    INSERT INTO "promotions" (
      "title", "slug", "promotion_mode", "code",
      "type", "value", "status",
      "start_date", "end_date",
      "min_order_value", "max_uses", "used_count",
      "created_at", "updated_at"
    )
    SELECT
      dc."code" AS "title",
      LOWER(dc."code") AS "slug",
      'coupon' AS "promotion_mode",
      dc."code",
      CASE
        WHEN dc."type" = 'fixed-amount' THEN 'fixed_amount'
        WHEN dc."type" = 'free-shipping' THEN 'free_shipping'
        ELSE dc."type"
      END,
      dc."value",
      CASE
        WHEN dc."status" = 'disabled' THEN 'paused'
        ELSE dc."status"
      END,
      dc."valid_from",
      dc."valid_until",
      dc."min_order_amount",
      dc."max_uses",
      dc."used_count",
      dc."created_at",
      dc."updated_at"
    FROM "discount_codes" dc
    WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discount_codes')
    ON CONFLICT DO NOTHING;
  `)

  // Drop old table
  await payload.db.drizzle.execute(sql`
    DROP TABLE IF EXISTS "discount_codes" CASCADE;
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Recreate discount_codes table
  await payload.db.drizzle.execute(sql`
    CREATE TABLE IF NOT EXISTS "discount_codes" (
      "id" serial PRIMARY KEY NOT NULL,
      "code" varchar NOT NULL UNIQUE,
      "type" varchar DEFAULT 'percentage' NOT NULL,
      "value" numeric DEFAULT 0 NOT NULL,
      "min_order_amount" numeric,
      "max_uses" numeric,
      "used_count" numeric DEFAULT 0,
      "valid_from" timestamp(3) with time zone,
      "valid_until" timestamp(3) with time zone,
      "status" varchar DEFAULT 'active',
      "description" varchar,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Remove new columns from promotions
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "promotions"
    DROP COLUMN IF EXISTS "promotion_mode",
    DROP COLUMN IF EXISTS "code";
  `)
}

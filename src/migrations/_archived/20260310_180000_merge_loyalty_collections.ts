import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Merge Loyalty Collections
 *
 * 1. LoyaltyRedemptions → merged into LoyaltyTransactions
 *    - Add redemption_status, redemption_code, used_at columns to loyalty_transactions
 *    - Migrate existing redemption data into transactions
 *    - Drop loyalty_redemptions table
 *
 * 2. LoyaltyPoints → merged into Users
 *    - Add loyalty fields to users table
 *    - Migrate existing loyalty points data into users
 *    - Drop loyalty_points table
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // ═══════════════════════════════════════════════════════════════════════
  // Step 1: Add redemption fields to loyalty_transactions
  // ═══════════════════════════════════════════════════════════════════════
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "loyalty_transactions"
    ADD COLUMN IF NOT EXISTS "redemption_status" varchar,
    ADD COLUMN IF NOT EXISTS "redemption_code" varchar,
    ADD COLUMN IF NOT EXISTS "used_at" timestamp(3) with time zone;
  `)

  // Migrate existing redemptions into transactions
  await payload.db.drizzle.execute(sql`
    INSERT INTO "loyalty_transactions" (
      "user_id", "type", "points", "description",
      "related_order_id", "related_reward_id",
      "redemption_status", "redemption_code", "used_at",
      "expires_at", "created_at", "updated_at"
    )
    SELECT
      r."user_id",
      'spent_reward',
      -r."points_spent",
      COALESCE('Beloning ingewisseld: ' || (SELECT lr."name" FROM "loyalty_rewards" lr WHERE lr."id" = r."reward_id"), 'Beloning ingewisseld'),
      r."used_in_order_id",
      r."reward_id",
      r."status",
      r."code",
      r."used_at",
      r."expires_at",
      r."created_at",
      r."updated_at"
    FROM "loyalty_redemptions" r
    WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'loyalty_redemptions')
    ON CONFLICT DO NOTHING;
  `)

  // ═══════════════════════════════════════════════════════════════════════
  // Step 2: Add loyalty fields to users table
  // ═══════════════════════════════════════════════════════════════════════
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "loyalty_available_points" numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "loyalty_total_earned" numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "loyalty_total_spent" numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "loyalty_tier_id" integer,
    ADD COLUMN IF NOT EXISTS "referral_code" varchar,
    ADD COLUMN IF NOT EXISTS "loyalty_member_since" timestamp(3) with time zone,
    ADD COLUMN IF NOT EXISTS "loyalty_stats_rewards_redeemed" numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "loyalty_stats_referrals" numeric DEFAULT 0;
  `)

  // Add foreign key for loyalty tier
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "users"
      ADD CONSTRAINT "users_loyalty_tier_id_loyalty_tiers_id_fk"
      FOREIGN KEY ("loyalty_tier_id") REFERENCES "loyalty_tiers"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Add index on referral_code
  await payload.db.drizzle.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "users_referral_code_idx" ON "users" ("referral_code")
    WHERE "referral_code" IS NOT NULL;
  `)

  // Migrate existing loyalty points data into users
  await payload.db.drizzle.execute(sql`
    UPDATE "users" u
    SET
      "loyalty_available_points" = lp."available_points",
      "loyalty_total_earned" = lp."total_earned",
      "loyalty_total_spent" = lp."total_spent",
      "loyalty_tier_id" = lp."tier_id",
      "referral_code" = lp."referral_code",
      "loyalty_member_since" = lp."member_since",
      "loyalty_stats_rewards_redeemed" = lp."stats_rewards_redeemed",
      "loyalty_stats_referrals" = lp."stats_referrals"
    FROM "loyalty_points" lp
    WHERE lp."user_id" = u."id"
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'loyalty_points');
  `)

  // ═══════════════════════════════════════════════════════════════════════
  // Step 3: Drop old tables (after data migration)
  // ═══════════════════════════════════════════════════════════════════════
  await payload.db.drizzle.execute(sql`
    DROP TABLE IF EXISTS "loyalty_redemptions" CASCADE;
  `)
  await payload.db.drizzle.execute(sql`
    DROP TABLE IF EXISTS "loyalty_points" CASCADE;
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Recreate loyalty_points table
  await payload.db.drizzle.execute(sql`
    CREATE TABLE IF NOT EXISTS "loyalty_points" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL UNIQUE,
      "available_points" numeric DEFAULT 0 NOT NULL,
      "total_earned" numeric DEFAULT 0 NOT NULL,
      "total_spent" numeric DEFAULT 0 NOT NULL,
      "tier_id" integer,
      "stats_total_orders" numeric DEFAULT 0,
      "stats_total_spent_money" numeric DEFAULT 0,
      "stats_rewards_redeemed" numeric DEFAULT 0,
      "stats_referrals" numeric DEFAULT 0,
      "referral_code" varchar,
      "member_since" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Recreate loyalty_redemptions table
  await payload.db.drizzle.execute(sql`
    CREATE TABLE IF NOT EXISTS "loyalty_redemptions" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL,
      "reward_id" integer NOT NULL,
      "points_spent" numeric NOT NULL,
      "status" varchar DEFAULT 'available' NOT NULL,
      "redeemed_at" timestamp(3) with time zone NOT NULL,
      "used_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone,
      "code" varchar,
      "used_in_order_id" integer,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Remove loyalty fields from users
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "users"
    DROP COLUMN IF EXISTS "loyalty_available_points",
    DROP COLUMN IF EXISTS "loyalty_total_earned",
    DROP COLUMN IF EXISTS "loyalty_total_spent",
    DROP COLUMN IF EXISTS "loyalty_tier_id",
    DROP COLUMN IF EXISTS "referral_code",
    DROP COLUMN IF EXISTS "loyalty_member_since",
    DROP COLUMN IF EXISTS "loyalty_stats_rewards_redeemed",
    DROP COLUMN IF EXISTS "loyalty_stats_referrals";
  `)

  // Remove redemption fields from loyalty_transactions
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "loyalty_transactions"
    DROP COLUMN IF EXISTS "redemption_status",
    DROP COLUMN IF EXISTS "redemption_code",
    DROP COLUMN IF EXISTS "used_at";
  `)
}

import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Replace defaultCartTemplate + defaultCheckoutTemplate with checkoutFlow
 *
 * - Adds checkout_flow column
 * - Migrates existing values to the new unified flow
 * - Drops old columns
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Add checkout_flow column
  await db.execute(sql`
    ALTER TABLE "settings"
    ADD COLUMN IF NOT EXISTS "checkout_flow" varchar DEFAULT 'premium';
  `)

  // 2. Migrate existing data: resolve old cart+checkout combos to flow
  await db.execute(sql`
    UPDATE "settings" SET "checkout_flow" = CASE
      WHEN "default_cart_template" = 'template4' AND "default_checkout_template" = 'template4' THEN 'premium'
      WHEN "default_cart_template" = 'template2' THEN 'efficient'
      ELSE 'classic'
    END
    WHERE "default_cart_template" IS NOT NULL OR "default_checkout_template" IS NOT NULL;
  `)

  // 3. Drop old columns
  await db.execute(sql`
    ALTER TABLE "settings"
    DROP COLUMN IF EXISTS "default_cart_template",
    DROP COLUMN IF EXISTS "default_checkout_template";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore old columns
  await db.execute(sql`
    ALTER TABLE "settings"
    ADD COLUMN IF NOT EXISTS "default_cart_template" varchar DEFAULT 'template1',
    ADD COLUMN IF NOT EXISTS "default_checkout_template" varchar DEFAULT 'template4';
  `)

  // Reverse migrate
  await db.execute(sql`
    UPDATE "settings" SET
      "default_cart_template" = CASE
        WHEN "checkout_flow" = 'premium' THEN 'template4'
        WHEN "checkout_flow" = 'efficient' THEN 'template2'
        ELSE 'template1'
      END,
      "default_checkout_template" = CASE
        WHEN "checkout_flow" = 'premium' THEN 'template4'
        ELSE 'checkouttemplate2'
      END;
  `)

  // Drop new column
  await db.execute(sql`
    ALTER TABLE "settings"
    DROP COLUMN IF EXISTS "checkout_flow";
  `)
}

import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Extend quotes collection for offerte → order conversion flow.
 *
 * Adds:
 * - quotedUnitPrice per product item
 * - convertedToOrder relationship
 * - acceptedAt / rejectedAt / rejectionReason
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add per-item quoted price to quotes_products array table
  await db.execute(sql`
    ALTER TABLE "quotes_products"
    ADD COLUMN IF NOT EXISTS "quoted_unit_price" numeric;
  `)

  // Add conversion and response fields to quotes table
  await db.execute(sql`
    ALTER TABLE "quotes"
    ADD COLUMN IF NOT EXISTS "converted_to_order_id" integer;

    ALTER TABLE "quotes"
    ADD COLUMN IF NOT EXISTS "accepted_at" timestamp(3) with time zone;

    ALTER TABLE "quotes"
    ADD COLUMN IF NOT EXISTS "rejected_at" timestamp(3) with time zone;

    ALTER TABLE "quotes"
    ADD COLUMN IF NOT EXISTS "rejection_reason" varchar;
  `)

  // Add foreign key for convertedToOrder → orders
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'quotes_converted_to_order_id_orders_id_fk'
      ) THEN
        ALTER TABLE "quotes"
        ADD CONSTRAINT "quotes_converted_to_order_id_orders_id_fk"
        FOREIGN KEY ("converted_to_order_id") REFERENCES "orders"("id")
        ON DELETE SET NULL;
      END IF;
    END $$;
  `)

  // Add index for order lookup
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "quotes_converted_to_order_idx"
    ON "quotes" ("converted_to_order_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "quotes_products"
    DROP COLUMN IF EXISTS "quoted_unit_price";

    DROP INDEX IF EXISTS "quotes_converted_to_order_idx";

    ALTER TABLE "quotes"
    DROP CONSTRAINT IF EXISTS "quotes_converted_to_order_id_orders_id_fk";

    ALTER TABLE "quotes"
    DROP COLUMN IF EXISTS "converted_to_order_id";

    ALTER TABLE "quotes"
    DROP COLUMN IF EXISTS "accepted_at";

    ALTER TABLE "quotes"
    DROP COLUMN IF EXISTS "rejected_at";

    ALTER TABLE "quotes"
    DROP COLUMN IF EXISTS "rejection_reason";
  `)
}

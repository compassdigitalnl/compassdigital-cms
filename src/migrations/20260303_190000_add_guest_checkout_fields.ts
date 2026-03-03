import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Add guest checkout fields to orders
 *
 * - Make customer_id nullable (was required, now optional for guest orders)
 * - Add guest_email, guest_name, guest_phone columns
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Make customer_id nullable
  await db.execute(sql`
    ALTER TABLE "orders"
    ALTER COLUMN "customer_id" DROP NOT NULL;
  `)

  // Add guest checkout fields (only if they don't exist)
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'guest_email') THEN
        ALTER TABLE "orders" ADD COLUMN "guest_email" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'guest_name') THEN
        ALTER TABLE "orders" ADD COLUMN "guest_name" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'guest_phone') THEN
        ALTER TABLE "orders" ADD COLUMN "guest_phone" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders"
    DROP COLUMN IF EXISTS "guest_email",
    DROP COLUMN IF EXISTS "guest_name",
    DROP COLUMN IF EXISTS "guest_phone";
  `)

  await db.execute(sql`
    ALTER TABLE "orders"
    ALTER COLUMN "customer_id" SET NOT NULL;
  `)
}

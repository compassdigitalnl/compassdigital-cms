import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Add email notification settings to e_commerce_settings table.
 * Three new boolean columns for toggling:
 * - Invoice PDF attachment in order confirmation emails
 * - Tracking link in all transactional emails
 * - Public order tracking page (/track)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "email_notifications_enable_invoice_attachment" boolean DEFAULT false;

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "email_notifications_enable_tracking_link" boolean DEFAULT false;

    ALTER TABLE "e_commerce_settings"
    ADD COLUMN IF NOT EXISTS "email_notifications_enable_public_tracking" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "email_notifications_enable_invoice_attachment";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "email_notifications_enable_tracking_link";

    ALTER TABLE "e_commerce_settings"
    DROP COLUMN IF EXISTS "email_notifications_enable_public_tracking";
  `)
}

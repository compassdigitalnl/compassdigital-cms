import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

/**
 * Migration: Add checkout_payment_options collection
 *
 * Creates:
 * - checkout_payment_options table
 * - Seeds 4 default payment options
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "checkout_payment_options" (
      "id" serial PRIMARY KEY,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "description" varchar,
      "icon_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "provider" varchar DEFAULT 'manual',
      "fee" varchar,
      "badge" varchar,
      "is_b2_b" boolean DEFAULT false,
      "is_active" boolean DEFAULT true,
      "sort_order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "checkout_payment_options_icon_idx" ON "checkout_payment_options" ("icon_id");
  `)

  // Add column to payload_locked_documents_rels (required by Payload CMS)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "checkout_payment_options_id" integer REFERENCES "checkout_payment_options"("id") ON DELETE CASCADE;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "idx_payload_locked_docs_rels_checkout_payment_options" ON "payload_locked_documents_rels" ("checkout_payment_options_id");
  `)

  // Add lucide_icon column
  await db.execute(sql`
    ALTER TABLE "checkout_payment_options" ADD COLUMN IF NOT EXISTS "lucide_icon" varchar;
  `)

  // Seed default payment options
  await db.execute(sql`
    INSERT INTO "checkout_payment_options" ("name", "slug", "description", "provider", "fee", "badge", "is_b2_b", "is_active", "sort_order", "lucide_icon")
    VALUES
      ('iDEAL', 'ideal', 'Betaal direct via je bank', 'mollie', NULL, 'Populair', false, true, 0, 'landmark'),
      ('Creditcard', 'creditcard', 'Visa, Mastercard, Amex', 'stripe', '€0.29 per transactie', NULL, false, true, 1, 'credit-card'),
      ('Op rekening', 'invoice', 'Betaal binnen 14 dagen', 'manual', NULL, 'Zakelijk', true, true, 2, 'receipt'),
      ('Bankoverschrijving', 'banktransfer', 'Handmatige overboeking', 'manual', NULL, NULL, false, false, 3, 'building')
    ON CONFLICT ("slug") DO NOTHING;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "checkout_payment_options";`)
}

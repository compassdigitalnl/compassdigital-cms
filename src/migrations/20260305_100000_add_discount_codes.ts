import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Add discount_codes table
 *
 * Creates the discount codes collection for e-commerce promotions.
 * Supports percentage, fixed-amount, and free-shipping discount types.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create discount_codes table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "discount_codes" (
      "id" serial PRIMARY KEY,
      "code" varchar NOT NULL UNIQUE,
      "type" varchar NOT NULL,
      "value" numeric NOT NULL DEFAULT 0,
      "min_order_amount" numeric,
      "max_uses" numeric,
      "used_count" numeric DEFAULT 0,
      "valid_from" timestamp(3) with time zone,
      "valid_until" timestamp(3) with time zone,
      "status" varchar DEFAULT 'active',
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "discount_codes_code_idx" ON "discount_codes" ("code");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "discount_codes_status_idx" ON "discount_codes" ("status");
  `)

  // Payload locked documents relation
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "discount_codes_id" integer
    REFERENCES "discount_codes"("id") ON DELETE CASCADE;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "idx_payload_locked_docs_rels_discount_codes"
    ON "payload_locked_documents_rels" ("discount_codes_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "idx_payload_locked_docs_rels_discount_codes";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "discount_codes_id";
  `)
  await db.execute(sql`
    DROP TABLE IF EXISTS "discount_codes";
  `)
}

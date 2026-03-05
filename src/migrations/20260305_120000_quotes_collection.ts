import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create quotes table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "quotes" (
      "id" serial PRIMARY KEY NOT NULL,
      "quote_number" varchar,
      "user_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
      "status" varchar DEFAULT 'new',
      "company_name" varchar,
      "kvk_number" varchar,
      "contact_person" varchar,
      "email" varchar,
      "phone" varchar,
      "sector" varchar,
      "desired_delivery_date" timestamp(3) with time zone,
      "delivery_frequency" varchar,
      "notes" varchar,
      "wants_consultation" boolean DEFAULT false,
      "quoted_price" numeric,
      "valid_until" timestamp(3) with time zone,
      "internal_notes" varchar,
      "submitted_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "quotes_user_idx" ON "quotes" USING btree ("user_id");
    CREATE INDEX IF NOT EXISTS "quotes_status_idx" ON "quotes" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "quotes_created_at_idx" ON "quotes" USING btree ("created_at");
  `)

  // Create quotes_products array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "quotes_products" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "quotes"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "sku" varchar,
      "quantity" numeric NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "quotes_products_order_idx" ON "quotes_products" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "quotes_products_parent_id_idx" ON "quotes_products" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "quotes_products";
    DROP TABLE IF EXISTS "quotes";
  `)
}

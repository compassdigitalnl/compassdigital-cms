import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "promotions" (
      "id" serial PRIMARY KEY,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "type" varchar NOT NULL DEFAULT 'percentage',
      "value" numeric NOT NULL DEFAULT 0,
      "status" varchar DEFAULT 'draft',
      "priority" integer DEFAULT 0,
      "start_date" timestamp(3) with time zone,
      "end_date" timestamp(3) with time zone,
      "is_flash_sale" boolean DEFAULT false,
      "flash_sale_label" varchar,
      "conditions" jsonb,
      "applies_to" varchar DEFAULT 'all',
      "product_ids" jsonb,
      "category_ids" jsonb,
      "brand_ids" jsonb,
      "min_order_value" numeric,
      "min_quantity" integer,
      "max_uses" integer,
      "used_count" integer DEFAULT 0,
      "stackable" boolean DEFAULT false,
      "banner_text" varchar,
      "banner_color" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "promotions_status_idx" ON "promotions" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "promotions_dates_idx" ON "promotions" USING btree ("start_date", "end_date");
    CREATE INDEX IF NOT EXISTS "promotions_slug_idx" ON "promotions" USING btree ("slug");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "promotions";
  `)
}

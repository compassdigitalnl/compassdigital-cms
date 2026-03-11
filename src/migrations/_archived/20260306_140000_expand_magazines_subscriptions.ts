import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create enum for plan period
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_magazines_plans_period" AS ENUM('monthly', 'quarterly', 'biannual', 'yearly', 'once');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Create enum for payment provider
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_magazines_payment_provider" AS ENUM('mollie', 'stripe', 'external');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Add payment_provider column to magazines
  await db.execute(sql`
    ALTER TABLE "magazines"
    ADD COLUMN IF NOT EXISTS "payment_provider" "enum_magazines_payment_provider" DEFAULT 'mollie';
  `)

  // Remove old subscription fields (replaced by plans array)
  await db.execute(sql`
    ALTER TABLE "magazines"
    DROP COLUMN IF EXISTS "subscription_price",
    DROP COLUMN IF EXISTS "subscription_url";
  `)

  // Plans array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "magazines_plans" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "description" varchar,
      "highlighted" boolean DEFAULT false,
      "price" numeric NOT NULL,
      "period" "enum_magazines_plans_period" DEFAULT 'yearly',
      "editions" numeric,
      "external_url" varchar,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      CONSTRAINT "magazines_plans_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "magazines"("id") ON DELETE CASCADE
    );
  `)

  // Plan features array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "magazines_plans_features" (
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL,
      "included" boolean DEFAULT true,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      CONSTRAINT "magazines_plans_features_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "magazines_plans"("id") ON DELETE CASCADE
    );
  `)

  // Trust items array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "magazines_trust_items" (
      "id" serial PRIMARY KEY NOT NULL,
      "icon" varchar,
      "text" varchar NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      CONSTRAINT "magazines_trust_items_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "magazines"("id") ON DELETE CASCADE
    );
  `)

  // Indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "magazines_plans_order_parent_idx" ON "magazines_plans" USING btree ("_order", "_parent_id");
    CREATE INDEX IF NOT EXISTS "magazines_plans_features_order_parent_idx" ON "magazines_plans_features" USING btree ("_order", "_parent_id");
    CREATE INDEX IF NOT EXISTS "magazines_trust_items_order_parent_idx" ON "magazines_trust_items" USING btree ("_order", "_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "magazines_trust_items";`)
  await db.execute(sql`DROP TABLE IF EXISTS "magazines_plans_features";`)
  await db.execute(sql`DROP TABLE IF EXISTS "magazines_plans";`)
  await db.execute(sql`
    ALTER TABLE "magazines"
    DROP COLUMN IF EXISTS "payment_provider",
    ADD COLUMN IF NOT EXISTS "subscription_price" varchar,
    ADD COLUMN IF NOT EXISTS "subscription_url" varchar;
  `)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_magazines_plans_period";`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_magazines_payment_provider";`)
}

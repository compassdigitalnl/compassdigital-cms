import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create b2bBenefits array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "e_commerce_settings_b2b_benefits" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "icon" varchar,
      "icon_color" varchar,
      "icon_bg" varchar,
      "title" varchar,
      "description" varchar
    );

    CREATE INDEX IF NOT EXISTS "e_commerce_settings_b2b_benefits_order_idx"
      ON "e_commerce_settings_b2b_benefits" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_b2b_benefits_parent_id_idx"
      ON "e_commerce_settings_b2b_benefits" USING btree ("_parent_id");
  `)

  // 2. Create registrationTrustItems array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "e_commerce_settings_registration_trust_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar
    );

    CREATE INDEX IF NOT EXISTS "e_commerce_settings_registration_trust_items_order_idx"
      ON "e_commerce_settings_registration_trust_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "e_commerce_settings_registration_trust_items_parent_id_idx"
      ON "e_commerce_settings_registration_trust_items" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "e_commerce_settings_registration_trust_items";
    DROP TABLE IF EXISTS "e_commerce_settings_b2b_benefits";
  `)
}

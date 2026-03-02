import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DATA TYPE text;
  ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DEFAULT 'template1'::text;
  DROP TYPE "public"."enum_settings_default_cart_template";
  CREATE TYPE "public"."enum_settings_default_cart_template" AS ENUM('template1', 'template2');
  ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DEFAULT 'template1'::"public"."enum_settings_default_cart_template";
  ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DATA TYPE "public"."enum_settings_default_cart_template" USING "default_cart_template"::"public"."enum_settings_default_cart_template";
  ALTER TABLE "settings" ADD COLUMN "enable_guest_checkout" boolean DEFAULT false;
  ALTER TABLE "settings" ADD COLUMN "require_b2_b_approval" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DATA TYPE text;
  ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DEFAULT 'carttemplate1'::text;
  DROP TYPE "public"."enum_settings_default_cart_template";
  CREATE TYPE "public"."enum_settings_default_cart_template" AS ENUM('carttemplate1');
  ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DEFAULT 'carttemplate1'::"public"."enum_settings_default_cart_template";
  ALTER TABLE "settings" ALTER COLUMN "default_cart_template" SET DATA TYPE "public"."enum_settings_default_cart_template" USING "default_cart_template"::"public"."enum_settings_default_cart_template";
  ALTER TABLE "settings" DROP COLUMN "enable_guest_checkout";
  ALTER TABLE "settings" DROP COLUMN "require_b2_b_approval";`)
}

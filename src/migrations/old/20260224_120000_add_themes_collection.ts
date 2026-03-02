import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Enum for themes.status
    DO $$ BEGIN
      CREATE TYPE "enum_themes_status" AS ENUM ('active', 'development', 'archived');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    -- Themes collection table
    CREATE TABLE IF NOT EXISTS "themes" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar,
      "icon" varchar,
      "is_default" boolean DEFAULT false,
      "primary_color" varchar,
      "primary_color_light" varchar,
      "primary_color_dark" varchar,
      "dark_surface" varchar,
      "dark_surface_light" varchar,
      "body_font" varchar,
      "heading_font" varchar,
      "primary_gradient" varchar,
      "hero_gradient" varchar,
      "border_radius_sm" numeric,
      "border_radius_md" numeric,
      "template_count" numeric,
      "unique_component_count" numeric,
      "status" "enum_themes_status" DEFAULT 'active',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "themes_slug_idx" ON "themes" ("slug");
    CREATE INDEX IF NOT EXISTS "themes_created_at_idx" ON "themes" ("created_at");
    CREATE INDEX IF NOT EXISTS "themes_updated_at_idx" ON "themes" ("updated_at");

    -- Custom colors array sub-table
    CREATE TABLE IF NOT EXISTS "themes_custom_colors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "token_name" varchar NOT NULL,
      "token_value" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "themes_custom_colors" ADD CONSTRAINT "themes_custom_colors_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "themes_custom_colors_order_idx" ON "themes_custom_colors" ("_order");
    CREATE INDEX IF NOT EXISTS "themes_custom_colors_parent_id_idx" ON "themes_custom_colors" ("_parent_id");

    -- Add themes_id to Payload internal rels table
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "themes_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_themes_fk"
        FOREIGN KEY ("themes_id") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_themes_id_idx"
      ON "payload_locked_documents_rels" ("themes_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_themes_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_themes_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "themes_id";
    DROP TABLE IF EXISTS "themes_custom_colors";
    DROP TABLE IF EXISTS "themes";
    DROP TYPE IF EXISTS "enum_themes_status";
  `)
}

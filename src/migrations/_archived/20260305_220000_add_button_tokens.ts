import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Button base tokens
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_font_weight" numeric DEFAULT 700;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_border_radius" varchar DEFAULT '8px';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_border_width" varchar DEFAULT '1.5px';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_icon_gap" numeric DEFAULT 6;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_transition_duration" varchar DEFAULT '0.2s';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_hover_translate_y" varchar DEFAULT '-1px';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_disabled_opacity" numeric DEFAULT 0.5;
    -- Button sizes - SM
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_sm_padding_y" numeric DEFAULT 5;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_sm_padding_x" numeric DEFAULT 12;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_sm_font_size" numeric DEFAULT 10;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_sm_icon_size" numeric DEFAULT 12;
    -- Button sizes - MD
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_md_padding_y" numeric DEFAULT 8;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_md_padding_x" numeric DEFAULT 18;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_md_font_size" numeric DEFAULT 12;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_md_icon_size" numeric DEFAULT 14;
    -- Button sizes - LG
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_lg_padding_y" numeric DEFAULT 11;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_lg_padding_x" numeric DEFAULT 26;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_lg_font_size" numeric DEFAULT 14;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_lg_icon_size" numeric DEFAULT 16;
    -- Button variant colors
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_primary_bg" varchar;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_primary_text" varchar DEFAULT '#ffffff';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_primary_hover_bg" varchar;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_secondary_bg" varchar;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_secondary_text" varchar DEFAULT '#ffffff';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_secondary_hover_bg" varchar;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_danger_bg" varchar;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_danger_text" varchar DEFAULT '#ffffff';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_danger_hover_bg" varchar;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_success_bg" varchar;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_success_text" varchar DEFAULT '#ffffff';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "btn_success_hover_bg" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_font_weight";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_border_radius";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_border_width";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_icon_gap";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_transition_duration";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_hover_translate_y";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_disabled_opacity";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_sm_padding_y";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_sm_padding_x";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_sm_font_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_sm_icon_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_md_padding_y";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_md_padding_x";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_md_font_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_md_icon_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_lg_padding_y";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_lg_padding_x";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_lg_font_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_lg_icon_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_primary_bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_primary_text";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_primary_hover_bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_secondary_bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_secondary_text";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_secondary_hover_bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_danger_bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_danger_text";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_danger_hover_bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_success_bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_success_text";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "btn_success_hover_bg";
  `)
}

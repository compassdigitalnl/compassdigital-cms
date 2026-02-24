import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Sprint 1: Compass Design System - Add all 54 design tokens
 *
 * This migration adds the complete set of design tokens across 5 categories:
 * - Colors (16 tokens)
 * - Spacing (9 tokens)
 * - Typography (11 tokens)
 * - Gradients (4 tokens)
 * - Visual (14 tokens)
 *
 * Note: This is an additive-only migration. Old theme columns are preserved
 * for backward compatibility and will be deprecated in a future sprint.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ═══════════════════════════════════════════════════════════
    -- COLORS (16 tokens)
    -- ═══════════════════════════════════════════════════════════
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "navy" varchar DEFAULT '#0A1628';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "navy_light" varchar DEFAULT '#121F33';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "teal" varchar DEFAULT '#00897B';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "teal_light" varchar DEFAULT '#26A69A';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "teal_dark" varchar DEFAULT '#00695C';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "green" varchar DEFAULT '#00C853';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "coral" varchar DEFAULT '#FF6B6B';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "amber" varchar DEFAULT '#F59E0B';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "blue" varchar DEFAULT '#2196F3';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "purple" varchar DEFAULT '#7C3AED';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "white" varchar DEFAULT '#FAFBFC';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "bg" varchar DEFAULT '#F5F7FA';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "grey" varchar DEFAULT '#E8ECF1';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "grey_mid" varchar DEFAULT '#94A3B8';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "grey_dark" varchar DEFAULT '#64748B';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "text" varchar DEFAULT '#1E293B';

    -- ═══════════════════════════════════════════════════════════
    -- SPACING (9 tokens - 4px grid system)
    -- ═══════════════════════════════════════════════════════════
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp1" integer DEFAULT 4;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp2" integer DEFAULT 8;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp3" integer DEFAULT 12;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp4" integer DEFAULT 16;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp6" integer DEFAULT 24;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp8" integer DEFAULT 32;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp12" integer DEFAULT 48;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp16" integer DEFAULT 64;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "sp20" integer DEFAULT 80;

    -- ═══════════════════════════════════════════════════════════
    -- TYPOGRAPHY (11 tokens)
    -- ═══════════════════════════════════════════════════════════
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "font_body" varchar DEFAULT '''Plus Jakarta Sans'', ''DM Sans'', system-ui, sans-serif';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "font_display" varchar DEFAULT '''DM Serif Display'', Georgia, serif';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "font_mono" varchar DEFAULT '''JetBrains Mono'', ''Courier New'', monospace';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "hero_size" integer DEFAULT 36;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "section_size" integer DEFAULT 24;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "card_title_size" integer DEFAULT 18;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "body_lg_size" integer DEFAULT 15;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "body_size" integer DEFAULT 13;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "small_size" integer DEFAULT 12;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "label_size" integer DEFAULT 10;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "micro_size" integer DEFAULT 8;

    -- ═══════════════════════════════════════════════════════════
    -- GRADIENTS (4 tokens - multi-tenant branding)
    -- ═══════════════════════════════════════════════════════════
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "primary_gradient" varchar DEFAULT 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "secondary_gradient" varchar DEFAULT 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "hero_gradient" varchar DEFAULT 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "accent_gradient" varchar DEFAULT 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)';

    -- ═══════════════════════════════════════════════════════════
    -- VISUAL (14 tokens - radius, shadows, z-index)
    -- ═══════════════════════════════════════════════════════════

    -- Border Radius (5 tokens)
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "radius_sm" integer DEFAULT 8;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "radius_md" integer DEFAULT 12;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "radius_lg" integer DEFAULT 16;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "radius_xl" integer DEFAULT 20;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "radius_full" integer DEFAULT 9999;

    -- Box Shadows (4 tokens)
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "shadow_sm" varchar DEFAULT '0 1px 3px rgba(10, 22, 40, 0.06)';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "shadow_md" varchar DEFAULT '0 4px 20px rgba(10, 22, 40, 0.08)';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "shadow_lg" varchar DEFAULT '0 8px 40px rgba(10, 22, 40, 0.12)';
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "shadow_xl" varchar DEFAULT '0 20px 60px rgba(10, 22, 40, 0.16)';

    -- Z-index Scale (5 tokens)
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "z_dropdown" integer DEFAULT 100;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "z_sticky" integer DEFAULT 200;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "z_overlay" integer DEFAULT 300;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "z_modal" integer DEFAULT 400;
    ALTER TABLE "theme" ADD COLUMN IF NOT EXISTS "z_toast" integer DEFAULT 500;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Rollback: Remove all design token columns
    -- Note: Only run this if you need to completely undo Sprint 1

    -- Colors (16 columns)
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "navy";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "navy_light";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "teal";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "teal_light";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "teal_dark";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "green";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "coral";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "amber";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "blue";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "purple";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "white";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "bg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "grey";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "grey_mid";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "grey_dark";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "text";

    -- Spacing (9 columns)
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp1";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp2";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp3";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp4";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp6";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp8";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp12";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp16";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "sp20";

    -- Typography (11 columns)
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "font_body";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "font_display";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "font_mono";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "hero_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "section_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "card_title_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "body_lg_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "body_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "small_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "label_size";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "micro_size";

    -- Gradients (4 columns)
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "primary_gradient";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "secondary_gradient";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "hero_gradient";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "accent_gradient";

    -- Visual (14 columns)
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "radius_sm";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "radius_md";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "radius_lg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "radius_xl";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "radius_full";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "shadow_sm";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "shadow_md";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "shadow_lg";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "shadow_xl";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "z_dropdown";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "z_sticky";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "z_overlay";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "z_modal";
    ALTER TABLE "theme" DROP COLUMN IF EXISTS "z_toast";
  `)
}

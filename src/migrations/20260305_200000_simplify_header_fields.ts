import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop top-level columns that were removed from Header global
  // Fields inside arrays/groups (alertBarLink, alertBarSchedule, alertBarCustomColors,
  // searchCategories, specialNavItems.position, customActionButtons.showBadge/style,
  // categoryNavigation.showProductCount/maxProductsInMega) are stored as JSON
  // in their parent column and don't need separate DROP statements.

  await db.execute(sql`
    ALTER TABLE header DROP COLUMN IF EXISTS enable_language_switcher;
    ALTER TABLE header DROP COLUMN IF EXISTS site_name_accent;
    ALTER TABLE header DROP COLUMN IF EXISTS show_logo_on_mobile;
    ALTER TABLE header DROP COLUMN IF EXISTS search_keyboard_shortcut;
    ALTER TABLE header DROP COLUMN IF EXISTS enable_search_overlay;
    ALTER TABLE header DROP COLUMN IF EXISTS mobile_drawer_position;
    ALTER TABLE header DROP COLUMN IF EXISTS mobile_breakpoint;
    ALTER TABLE header DROP COLUMN IF EXISTS sticky_header_shadow;
    ALTER TABLE header DROP COLUMN IF EXISTS enable_animations;
    ALTER TABLE header DROP COLUMN IF EXISTS dropdown_open_delay;
    ALTER TABLE header DROP COLUMN IF EXISTS dropdown_close_delay;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Re-add columns if rolling back
  await db.execute(sql`
    ALTER TABLE header ADD COLUMN IF NOT EXISTS enable_language_switcher boolean DEFAULT false;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS site_name_accent varchar;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS show_logo_on_mobile boolean DEFAULT true;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS search_keyboard_shortcut varchar DEFAULT '⌘K';
    ALTER TABLE header ADD COLUMN IF NOT EXISTS enable_search_overlay boolean DEFAULT true;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS mobile_drawer_position varchar DEFAULT 'left';
    ALTER TABLE header ADD COLUMN IF NOT EXISTS mobile_breakpoint numeric DEFAULT 768;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS sticky_header_shadow boolean DEFAULT true;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS enable_animations boolean DEFAULT true;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS dropdown_open_delay numeric DEFAULT 150;
    ALTER TABLE header ADD COLUMN IF NOT EXISTS dropdown_close_delay numeric DEFAULT 300;
  `)
}

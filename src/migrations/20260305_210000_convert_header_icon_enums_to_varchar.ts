import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Convert icon columns from enum to varchar so they accept any Lucide icon name
  await db.execute(sql`
    ALTER TABLE header_special_nav_items ALTER COLUMN icon TYPE varchar USING icon::text;
    ALTER TABLE header_topbar_messages ALTER COLUMN icon TYPE varchar USING icon::text;
    ALTER TABLE header_topbar_right_links ALTER COLUMN icon TYPE varchar USING icon::text;
    ALTER TABLE header_manual_nav_items ALTER COLUMN icon TYPE varchar USING icon::text;
    ALTER TABLE header_custom_action_buttons ALTER COLUMN icon TYPE varchar USING icon::text;
    ALTER TABLE header_search_categories ALTER COLUMN icon TYPE varchar USING icon::text;

    ALTER TABLE header_special_nav_items DROP COLUMN IF EXISTS position;

    DROP TYPE IF EXISTS enum_header_special_nav_items_icon;
    DROP TYPE IF EXISTS enum_header_topbar_messages_icon;
    DROP TYPE IF EXISTS enum_header_topbar_right_links_icon;
    DROP TYPE IF EXISTS enum_header_manual_nav_items_icon;
    DROP TYPE IF EXISTS enum_header_custom_action_buttons_icon;
    DROP TYPE IF EXISTS enum_header_search_categories_icon;
    DROP TYPE IF EXISTS enum_header_special_nav_items_position;
  `)

  // Fix integer columns that should be boolean (created by older migration)
  await db.execute(sql`
    ALTER TABLE header_special_nav_items ALTER COLUMN highlight DROP DEFAULT;
    ALTER TABLE header_special_nav_items ALTER COLUMN highlight TYPE boolean USING CASE WHEN highlight = 1 THEN true ELSE false END;
    ALTER TABLE header_special_nav_items ALTER COLUMN highlight SET DEFAULT false;

    ALTER TABLE header_custom_action_buttons ALTER COLUMN show_on_mobile DROP DEFAULT;
    ALTER TABLE header_custom_action_buttons ALTER COLUMN show_on_mobile TYPE boolean USING CASE WHEN show_on_mobile = 1 THEN true ELSE false END;
    ALTER TABLE header_custom_action_buttons ALTER COLUMN show_on_mobile SET DEFAULT true;

    ALTER TABLE header_custom_action_buttons ALTER COLUMN show_badge DROP DEFAULT;
    ALTER TABLE header_custom_action_buttons ALTER COLUMN show_badge TYPE boolean USING CASE WHEN show_badge = 1 THEN true ELSE false END;
    ALTER TABLE header_custom_action_buttons ALTER COLUMN show_badge SET DEFAULT false;

    ALTER TABLE header_languages ALTER COLUMN is_default DROP DEFAULT;
    ALTER TABLE header_languages ALTER COLUMN is_default TYPE boolean USING CASE WHEN is_default = 1 THEN true ELSE false END;
    ALTER TABLE header_languages ALTER COLUMN is_default SET DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Not reversible
}

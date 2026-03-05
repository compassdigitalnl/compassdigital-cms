import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Convert icon columns from enum to varchar so they accept any Lucide icon name
  // (was enum with limited options, now free text with IconPickerField)

  // 1. header_special_nav_items
  await db.execute(sql`
    ALTER TABLE header_special_nav_items
      ALTER COLUMN icon TYPE varchar USING icon::text;
  `)

  // 2. header_topbar_messages
  await db.execute(sql`
    ALTER TABLE header_topbar_messages
      ALTER COLUMN icon TYPE varchar USING icon::text;
  `)

  // 3. header_topbar_right_links
  await db.execute(sql`
    ALTER TABLE header_topbar_right_links
      ALTER COLUMN icon TYPE varchar USING icon::text;
  `)

  // 4. header_manual_nav_items
  await db.execute(sql`
    ALTER TABLE header_manual_nav_items
      ALTER COLUMN icon TYPE varchar USING icon::text;
  `)

  // 5. header_custom_action_buttons
  await db.execute(sql`
    ALTER TABLE header_custom_action_buttons
      ALTER COLUMN icon TYPE varchar USING icon::text;
  `)

  // Drop the old enum types
  await db.execute(sql`
    DROP TYPE IF EXISTS enum_header_special_nav_items_icon;
    DROP TYPE IF EXISTS enum_header_topbar_messages_icon;
    DROP TYPE IF EXISTS enum_header_topbar_right_links_icon;
    DROP TYPE IF EXISTS enum_header_manual_nav_items_icon;
    DROP TYPE IF EXISTS enum_header_custom_action_buttons_icon;
    DROP TYPE IF EXISTS enum_header_search_categories_icon;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Not reversible — enum values would need to be recreated
}

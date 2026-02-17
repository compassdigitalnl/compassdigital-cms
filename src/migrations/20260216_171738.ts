import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users_addresses\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'both' NOT NULL,
  	\`street\` text NOT NULL,
  	\`house_number\` text NOT NULL,
  	\`house_number_addition\` text,
  	\`postal_code\` text NOT NULL,
  	\`city\` text NOT NULL,
  	\`country\` text DEFAULT 'Nederland',
  	\`is_default\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_addresses_order_idx\` ON \`users_addresses\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_addresses_parent_id_idx\` ON \`users_addresses\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`first_name\` text,
  	\`last_name\` text,
  	\`phone\` text,
  	\`account_type\` text DEFAULT 'individual',
  	\`company_name\` text,
  	\`company_kvk_number\` text,
  	\`company_vat_number\` text,
  	\`company_invoice_email\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_top_bar_left_messages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_top_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_top_bar_left_messages_order_idx\` ON \`pages_blocks_top_bar_left_messages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_top_bar_left_messages_parent_id_idx\` ON \`pages_blocks_top_bar_left_messages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_top_bar_right_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_top_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_top_bar_right_links_order_idx\` ON \`pages_blocks_top_bar_right_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_top_bar_right_links_parent_id_idx\` ON \`pages_blocks_top_bar_right_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_top_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`use_global_settings\` integer DEFAULT true,
  	\`background_color\` text DEFAULT '#0A1628',
  	\`text_color\` text DEFAULT '#FFFFFF',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_top_bar_order_idx\` ON \`pages_blocks_top_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_top_bar_parent_id_idx\` ON \`pages_blocks_top_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_top_bar_path_idx\` ON \`pages_blocks_top_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_breadcrumb_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_breadcrumb\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_breadcrumb_items_order_idx\` ON \`pages_blocks_breadcrumb_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_breadcrumb_items_parent_id_idx\` ON \`pages_blocks_breadcrumb_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_breadcrumb\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`mode\` text DEFAULT 'auto',
  	\`show_home\` integer DEFAULT true,
  	\`home_label\` text DEFAULT 'Home',
  	\`separator\` text DEFAULT 'arrow',
  	\`show_on_mobile\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_breadcrumb_order_idx\` ON \`pages_blocks_breadcrumb\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_breadcrumb_parent_id_idx\` ON \`pages_blocks_breadcrumb\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_breadcrumb_path_idx\` ON \`pages_blocks_breadcrumb\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`height\` text DEFAULT 'medium',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_spacer_order_idx\` ON \`pages_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_spacer_parent_id_idx\` ON \`pages_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_spacer_path_idx\` ON \`pages_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'default',
  	\`title\` text,
  	\`subtitle\` text,
  	\`primary_c_t_a_text\` text DEFAULT 'Neem contact op',
  	\`primary_c_t_a_link\` text DEFAULT '/contact',
  	\`secondary_c_t_a_text\` text,
  	\`secondary_c_t_a_link\` text,
  	\`background_image_id\` integer,
  	\`background_image_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_hero_background_image_idx\` ON \`pages_blocks_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_content_columns_order_idx\` ON \`pages_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_content_columns_parent_id_idx\` ON \`pages_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_content_order_idx\` ON \`pages_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_content_parent_id_idx\` ON \`pages_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_content_path_idx\` ON \`pages_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_two_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`left_column\` text,
  	\`right_column\` text,
  	\`ratio\` text DEFAULT '50-50',
  	\`alignment\` text DEFAULT 'top',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_two_column_order_idx\` ON \`pages_blocks_two_column\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_two_column_parent_id_idx\` ON \`pages_blocks_two_column\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_two_column_path_idx\` ON \`pages_blocks_two_column\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_product_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze producten',
  	\`intro\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category_id\` integer,
  	\`brand_id\` integer,
  	\`display_mode\` text DEFAULT 'grid',
  	\`layout\` text DEFAULT 'grid-4',
  	\`limit\` numeric DEFAULT 8,
  	\`show_add_to_cart\` integer DEFAULT true,
  	\`show_stock_status\` integer DEFAULT true,
  	\`show_brand\` integer DEFAULT true,
  	\`show_compare_price\` integer DEFAULT true,
  	\`show_view_all_button\` integer DEFAULT true,
  	\`view_all_button_text\` text DEFAULT 'Bekijk alle producten',
  	\`view_all_button_link\` text DEFAULT '/producten',
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_grid_order_idx\` ON \`pages_blocks_product_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_grid_parent_id_idx\` ON \`pages_blocks_product_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_grid_path_idx\` ON \`pages_blocks_product_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_grid_category_idx\` ON \`pages_blocks_product_grid\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_grid_brand_idx\` ON \`pages_blocks_product_grid\` (\`brand_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze categorieën',
  	\`intro\` text,
  	\`source\` text DEFAULT 'auto',
  	\`show_icon\` integer DEFAULT true,
  	\`show_product_count\` integer DEFAULT true,
  	\`layout\` text DEFAULT 'grid-3',
  	\`limit\` numeric DEFAULT 10,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_category_grid_order_idx\` ON \`pages_blocks_category_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_category_grid_parent_id_idx\` ON \`pages_blocks_category_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_category_grid_path_idx\` ON \`pages_blocks_category_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_features_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_type\` text DEFAULT 'lucide',
  	\`icon_name\` text,
  	\`icon_upload_id\` integer,
  	\`name\` text,
  	\`description\` text,
  	\`link\` text,
  	FOREIGN KEY (\`icon_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_features_features_order_idx\` ON \`pages_blocks_features_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_features_features_parent_id_idx\` ON \`pages_blocks_features_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_features_features_icon_upload_idx\` ON \`pages_blocks_features_features\` (\`icon_upload_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze diensten',
  	\`intro\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category\` text DEFAULT 'all',
  	\`limit\` numeric DEFAULT 6,
  	\`show_featured_only\` integer DEFAULT false,
  	\`layout\` text DEFAULT 'grid-3',
  	\`style\` text DEFAULT 'cards',
  	\`show_hover_effect\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_features_order_idx\` ON \`pages_blocks_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_features_parent_id_idx\` ON \`pages_blocks_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_features_path_idx\` ON \`pages_blocks_features\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_quick_order\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Snel Bestellen',
  	\`intro\` text,
  	\`show_order_lists\` integer DEFAULT true,
  	\`input_mode\` text DEFAULT 'textarea',
  	\`placeholder_text\` text DEFAULT 'Voer artikelnummers en aantallen in:
  
  BV-001 5
  LT-334 2
  HT-892 10',
  	\`help_text\` text,
  	\`submit_button_text\` text DEFAULT 'Toevoegen aan winkelwagen',
  	\`show_upload\` integer DEFAULT false,
  	\`upload_help_text\` text DEFAULT 'Upload een CSV bestand met artikelnummer,aantal per regel',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_quick_order_order_idx\` ON \`pages_blocks_quick_order\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_quick_order_parent_id_idx\` ON \`pages_blocks_quick_order\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_quick_order_path_idx\` ON \`pages_blocks_quick_order\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_product_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`position\` text DEFAULT 'left',
  	\`style\` text DEFAULT 'sidebar',
  	\`show_search\` integer DEFAULT true,
  	\`enabled_filters_categories\` integer DEFAULT true,
  	\`enabled_filters_brands\` integer DEFAULT true,
  	\`enabled_filters_price_range\` integer DEFAULT true,
  	\`enabled_filters_badges\` integer DEFAULT true,
  	\`enabled_filters_stock\` integer DEFAULT true,
  	\`enabled_filters_featured\` integer DEFAULT false,
  	\`price_range_config_min\` numeric DEFAULT 0,
  	\`price_range_config_max\` numeric DEFAULT 500,
  	\`price_range_config_step\` numeric DEFAULT 10,
  	\`show_active_filters\` integer DEFAULT true,
  	\`clear_all_text\` text DEFAULT 'Wis alle filters',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_filters_order_idx\` ON \`pages_blocks_product_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_filters_parent_id_idx\` ON \`pages_blocks_product_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_product_filters_path_idx\` ON \`pages_blocks_product_filters\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_search_bar_popular_searches\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`term\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_search_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_search_bar_popular_searches_order_idx\` ON \`pages_blocks_search_bar_popular_searches\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_search_bar_popular_searches_parent_id_idx\` ON \`pages_blocks_search_bar_popular_searches\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_search_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'standard',
  	\`placeholder\` text DEFAULT 'Zoek producten, merken of artikelnummers...',
  	\`show_category_filter\` integer DEFAULT true,
  	\`show_autocomplete\` integer DEFAULT true,
  	\`autocomplete_limit\` numeric DEFAULT 5,
  	\`show_popular_searches\` integer DEFAULT false,
  	\`search_in_products\` integer DEFAULT true,
  	\`search_in_categories\` integer DEFAULT true,
  	\`search_in_brands\` integer DEFAULT true,
  	\`search_in_blog\` integer DEFAULT false,
  	\`search_in_pages\` integer DEFAULT false,
  	\`button_text\` text DEFAULT 'Zoeken',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_search_bar_order_idx\` ON \`pages_blocks_search_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_search_bar_parent_id_idx\` ON \`pages_blocks_search_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_search_bar_path_idx\` ON \`pages_blocks_search_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`button_text\` text DEFAULT 'Neem contact op',
  	\`button_link\` text DEFAULT '/contact',
  	\`style\` text DEFAULT 'primary',
  	\`background_image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_cta_background_image_idx\` ON \`pages_blocks_cta\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_contact_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Neem contact op',
  	\`intro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_contact_form_order_idx\` ON \`pages_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_contact_form_parent_id_idx\` ON \`pages_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_contact_form_path_idx\` ON \`pages_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_testimonials_manual_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`quote\` text,
  	\`rating\` numeric DEFAULT 5,
  	\`photo_id\` integer,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_testimonials_manual_testimonials_order_idx\` ON \`pages_blocks_testimonials_manual_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_testimonials_manual_testimonials_parent_id_idx\` ON \`pages_blocks_testimonials_manual_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_testimonials_manual_testimonials_photo_idx\` ON \`pages_blocks_testimonials_manual_testimonials\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Wat klanten zeggen',
  	\`intro\` text,
  	\`source\` text DEFAULT 'collection',
  	\`layout\` text DEFAULT 'carousel',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_testimonials_order_idx\` ON \`pages_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_testimonials_parent_id_idx\` ON \`pages_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_testimonials_path_idx\` ON \`pages_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze projecten',
  	\`intro\` text,
  	\`source\` text DEFAULT 'featured',
  	\`limit\` numeric DEFAULT 6,
  	\`layout\` text DEFAULT 'grid-3',
  	\`show_excerpt\` integer DEFAULT true,
  	\`show_client\` integer DEFAULT true,
  	\`show_services\` integer DEFAULT true,
  	\`show_view_all_button\` integer DEFAULT true,
  	\`view_all_button_text\` text DEFAULT 'Bekijk alle projecten',
  	\`view_all_button_link\` text DEFAULT '/portfolio',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_cases_order_idx\` ON \`pages_blocks_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_cases_parent_id_idx\` ON \`pages_blocks_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_cases_path_idx\` ON \`pages_blocks_cases\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_logo_bar_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`name\` text,
  	\`link\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_logo_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_logo_bar_logos_order_idx\` ON \`pages_blocks_logo_bar_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_logo_bar_logos_parent_id_idx\` ON \`pages_blocks_logo_bar_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_logo_bar_logos_image_idx\` ON \`pages_blocks_logo_bar_logos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_logo_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category\` text DEFAULT 'all',
  	\`limit\` numeric DEFAULT 10,
  	\`show_featured_only\` integer DEFAULT false,
  	\`layout\` text DEFAULT 'grid',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_logo_bar_order_idx\` ON \`pages_blocks_logo_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_logo_bar_parent_id_idx\` ON \`pages_blocks_logo_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_logo_bar_path_idx\` ON \`pages_blocks_logo_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_stats_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`number\` text,
  	\`suffix\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_stats_stats_order_idx\` ON \`pages_blocks_stats_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_stats_stats_parent_id_idx\` ON \`pages_blocks_stats_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`layout\` text DEFAULT 'grid-4',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_stats_order_idx\` ON \`pages_blocks_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_stats_parent_id_idx\` ON \`pages_blocks_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_stats_path_idx\` ON \`pages_blocks_stats\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_faq_items_order_idx\` ON \`pages_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_faq_items_parent_id_idx\` ON \`pages_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Veelgestelde vragen',
  	\`intro\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category\` text DEFAULT 'all',
  	\`limit\` numeric DEFAULT 10,
  	\`show_featured_only\` integer DEFAULT false,
  	\`generate_schema\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`photo_id\` integer,
  	\`photo_url\` text,
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`email\` text,
  	\`linkedin\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_team_members_order_idx\` ON \`pages_blocks_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_team_members_parent_id_idx\` ON \`pages_blocks_team_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_team_members_photo_idx\` ON \`pages_blocks_team_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_team\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Ons team',
  	\`intro\` text,
  	\`layout\` text DEFAULT 'grid-3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_team_order_idx\` ON \`pages_blocks_team\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_team_parent_id_idx\` ON \`pages_blocks_team\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_team_path_idx\` ON \`pages_blocks_team\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_accordion_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_accordion_items_order_idx\` ON \`pages_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_accordion_items_parent_id_idx\` ON \`pages_blocks_accordion_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_accordion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`allow_multiple\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_accordion_order_idx\` ON \`pages_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_accordion_parent_id_idx\` ON \`pages_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_accordion_path_idx\` ON \`pages_blocks_accordion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_blog_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Laatste blog berichten',
  	\`intro\` text,
  	\`limit\` numeric DEFAULT 6,
  	\`category_id\` integer,
  	\`layout\` text DEFAULT 'grid-3',
  	\`show_excerpt\` integer DEFAULT true,
  	\`show_date\` integer DEFAULT true,
  	\`show_author\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_blog_preview_order_idx\` ON \`pages_blocks_blog_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_blog_preview_parent_id_idx\` ON \`pages_blocks_blog_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_blog_preview_path_idx\` ON \`pages_blocks_blog_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_blog_preview_category_idx\` ON \`pages_blocks_blog_preview\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_image_gallery_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_image_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_image_gallery_images_order_idx\` ON \`pages_blocks_image_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_image_gallery_images_parent_id_idx\` ON \`pages_blocks_image_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_image_gallery_images_image_idx\` ON \`pages_blocks_image_gallery_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_image_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`layout\` text DEFAULT 'grid',
  	\`columns\` text DEFAULT '3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_image_gallery_order_idx\` ON \`pages_blocks_image_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_image_gallery_parent_id_idx\` ON \`pages_blocks_image_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_image_gallery_path_idx\` ON \`pages_blocks_image_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`video_url\` text,
  	\`poster_image_id\` integer,
  	\`aspect_ratio\` text DEFAULT '16-9',
  	\`autoplay\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_video_poster_image_idx\` ON \`pages_blocks_video\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Locatie',
  	\`address\` text,
  	\`zoom\` numeric DEFAULT 15,
  	\`height\` text DEFAULT 'medium',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_map_order_idx\` ON \`pages_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_map_parent_id_idx\` ON \`pages_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_map_path_idx\` ON \`pages_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`status\` text DEFAULT 'published',
  	\`published_on\` text,
  	\`color_scheme_primary\` text,
  	\`color_scheme_secondary\` text,
  	\`color_scheme_accent\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_focus_keyword\` text,
  	\`meta_image_id\` integer,
  	\`meta_canonical_url\` text,
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_no_follow\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`products_id\` integer,
  	\`product_categories_id\` integer,
  	\`services_id\` integer,
  	\`testimonials_id\` integer,
  	\`cases_id\` integer,
  	\`partners_id\` integer,
  	\`faqs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partners_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_products_id_idx\` ON \`pages_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_product_categories_id_idx\` ON \`pages_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_services_id_idx\` ON \`pages_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_testimonials_id_idx\` ON \`pages_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_cases_id_idx\` ON \`pages_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_partners_id_idx\` ON \`pages_rels\` (\`partners_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_rels_faqs_id_idx\` ON \`pages_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_top_bar_left_messages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text,
  	\`link\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_top_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_top_bar_left_messages_order_idx\` ON \`_pages_v_blocks_top_bar_left_messages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_top_bar_left_messages_parent_id_idx\` ON \`_pages_v_blocks_top_bar_left_messages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_top_bar_right_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_top_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_top_bar_right_links_order_idx\` ON \`_pages_v_blocks_top_bar_right_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_top_bar_right_links_parent_id_idx\` ON \`_pages_v_blocks_top_bar_right_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_top_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`use_global_settings\` integer DEFAULT true,
  	\`background_color\` text DEFAULT '#0A1628',
  	\`text_color\` text DEFAULT '#FFFFFF',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_top_bar_order_idx\` ON \`_pages_v_blocks_top_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_top_bar_parent_id_idx\` ON \`_pages_v_blocks_top_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_top_bar_path_idx\` ON \`_pages_v_blocks_top_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_breadcrumb_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_breadcrumb\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_breadcrumb_items_order_idx\` ON \`_pages_v_blocks_breadcrumb_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_breadcrumb_items_parent_id_idx\` ON \`_pages_v_blocks_breadcrumb_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_breadcrumb\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`mode\` text DEFAULT 'auto',
  	\`show_home\` integer DEFAULT true,
  	\`home_label\` text DEFAULT 'Home',
  	\`separator\` text DEFAULT 'arrow',
  	\`show_on_mobile\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_breadcrumb_order_idx\` ON \`_pages_v_blocks_breadcrumb\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_breadcrumb_parent_id_idx\` ON \`_pages_v_blocks_breadcrumb\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_breadcrumb_path_idx\` ON \`_pages_v_blocks_breadcrumb\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`height\` text DEFAULT 'medium',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_spacer_order_idx\` ON \`_pages_v_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_spacer_parent_id_idx\` ON \`_pages_v_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_spacer_path_idx\` ON \`_pages_v_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'default',
  	\`title\` text,
  	\`subtitle\` text,
  	\`primary_c_t_a_text\` text DEFAULT 'Neem contact op',
  	\`primary_c_t_a_link\` text DEFAULT '/contact',
  	\`secondary_c_t_a_text\` text,
  	\`secondary_c_t_a_link\` text,
  	\`background_image_id\` integer,
  	\`background_image_url\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_hero_background_image_idx\` ON \`_pages_v_blocks_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_content_columns_order_idx\` ON \`_pages_v_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_content_columns_parent_id_idx\` ON \`_pages_v_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_content_order_idx\` ON \`_pages_v_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_content_parent_id_idx\` ON \`_pages_v_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_content_path_idx\` ON \`_pages_v_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_two_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`left_column\` text,
  	\`right_column\` text,
  	\`ratio\` text DEFAULT '50-50',
  	\`alignment\` text DEFAULT 'top',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_two_column_order_idx\` ON \`_pages_v_blocks_two_column\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_two_column_parent_id_idx\` ON \`_pages_v_blocks_two_column\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_two_column_path_idx\` ON \`_pages_v_blocks_two_column\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_product_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze producten',
  	\`intro\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category_id\` integer,
  	\`brand_id\` integer,
  	\`display_mode\` text DEFAULT 'grid',
  	\`layout\` text DEFAULT 'grid-4',
  	\`limit\` numeric DEFAULT 8,
  	\`show_add_to_cart\` integer DEFAULT true,
  	\`show_stock_status\` integer DEFAULT true,
  	\`show_brand\` integer DEFAULT true,
  	\`show_compare_price\` integer DEFAULT true,
  	\`show_view_all_button\` integer DEFAULT true,
  	\`view_all_button_text\` text DEFAULT 'Bekijk alle producten',
  	\`view_all_button_link\` text DEFAULT '/producten',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_grid_order_idx\` ON \`_pages_v_blocks_product_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_grid_parent_id_idx\` ON \`_pages_v_blocks_product_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_grid_path_idx\` ON \`_pages_v_blocks_product_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_grid_category_idx\` ON \`_pages_v_blocks_product_grid\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_grid_brand_idx\` ON \`_pages_v_blocks_product_grid\` (\`brand_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze categorieën',
  	\`intro\` text,
  	\`source\` text DEFAULT 'auto',
  	\`show_icon\` integer DEFAULT true,
  	\`show_product_count\` integer DEFAULT true,
  	\`layout\` text DEFAULT 'grid-3',
  	\`limit\` numeric DEFAULT 10,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_category_grid_order_idx\` ON \`_pages_v_blocks_category_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_category_grid_parent_id_idx\` ON \`_pages_v_blocks_category_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_category_grid_path_idx\` ON \`_pages_v_blocks_category_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_features_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_type\` text DEFAULT 'lucide',
  	\`icon_name\` text,
  	\`icon_upload_id\` integer,
  	\`name\` text,
  	\`description\` text,
  	\`link\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`icon_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_features_features_order_idx\` ON \`_pages_v_blocks_features_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_features_features_parent_id_idx\` ON \`_pages_v_blocks_features_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_features_features_icon_upload_idx\` ON \`_pages_v_blocks_features_features\` (\`icon_upload_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze diensten',
  	\`intro\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category\` text DEFAULT 'all',
  	\`limit\` numeric DEFAULT 6,
  	\`show_featured_only\` integer DEFAULT false,
  	\`layout\` text DEFAULT 'grid-3',
  	\`style\` text DEFAULT 'cards',
  	\`show_hover_effect\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_features_order_idx\` ON \`_pages_v_blocks_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_features_parent_id_idx\` ON \`_pages_v_blocks_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_features_path_idx\` ON \`_pages_v_blocks_features\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_quick_order\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Snel Bestellen',
  	\`intro\` text,
  	\`show_order_lists\` integer DEFAULT true,
  	\`input_mode\` text DEFAULT 'textarea',
  	\`placeholder_text\` text DEFAULT 'Voer artikelnummers en aantallen in:
  
  BV-001 5
  LT-334 2
  HT-892 10',
  	\`help_text\` text,
  	\`submit_button_text\` text DEFAULT 'Toevoegen aan winkelwagen',
  	\`show_upload\` integer DEFAULT false,
  	\`upload_help_text\` text DEFAULT 'Upload een CSV bestand met artikelnummer,aantal per regel',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_quick_order_order_idx\` ON \`_pages_v_blocks_quick_order\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_quick_order_parent_id_idx\` ON \`_pages_v_blocks_quick_order\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_quick_order_path_idx\` ON \`_pages_v_blocks_quick_order\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_product_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`position\` text DEFAULT 'left',
  	\`style\` text DEFAULT 'sidebar',
  	\`show_search\` integer DEFAULT true,
  	\`enabled_filters_categories\` integer DEFAULT true,
  	\`enabled_filters_brands\` integer DEFAULT true,
  	\`enabled_filters_price_range\` integer DEFAULT true,
  	\`enabled_filters_badges\` integer DEFAULT true,
  	\`enabled_filters_stock\` integer DEFAULT true,
  	\`enabled_filters_featured\` integer DEFAULT false,
  	\`price_range_config_min\` numeric DEFAULT 0,
  	\`price_range_config_max\` numeric DEFAULT 500,
  	\`price_range_config_step\` numeric DEFAULT 10,
  	\`show_active_filters\` integer DEFAULT true,
  	\`clear_all_text\` text DEFAULT 'Wis alle filters',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_filters_order_idx\` ON \`_pages_v_blocks_product_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_filters_parent_id_idx\` ON \`_pages_v_blocks_product_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_product_filters_path_idx\` ON \`_pages_v_blocks_product_filters\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_search_bar_popular_searches\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`term\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_search_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_search_bar_popular_searches_order_idx\` ON \`_pages_v_blocks_search_bar_popular_searches\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_search_bar_popular_searches_parent_id_idx\` ON \`_pages_v_blocks_search_bar_popular_searches\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_search_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'standard',
  	\`placeholder\` text DEFAULT 'Zoek producten, merken of artikelnummers...',
  	\`show_category_filter\` integer DEFAULT true,
  	\`show_autocomplete\` integer DEFAULT true,
  	\`autocomplete_limit\` numeric DEFAULT 5,
  	\`show_popular_searches\` integer DEFAULT false,
  	\`search_in_products\` integer DEFAULT true,
  	\`search_in_categories\` integer DEFAULT true,
  	\`search_in_brands\` integer DEFAULT true,
  	\`search_in_blog\` integer DEFAULT false,
  	\`search_in_pages\` integer DEFAULT false,
  	\`button_text\` text DEFAULT 'Zoeken',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_search_bar_order_idx\` ON \`_pages_v_blocks_search_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_search_bar_parent_id_idx\` ON \`_pages_v_blocks_search_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_search_bar_path_idx\` ON \`_pages_v_blocks_search_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`button_text\` text DEFAULT 'Neem contact op',
  	\`button_link\` text DEFAULT '/contact',
  	\`style\` text DEFAULT 'primary',
  	\`background_image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_cta_background_image_idx\` ON \`_pages_v_blocks_cta\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_contact_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Neem contact op',
  	\`intro\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_contact_form_order_idx\` ON \`_pages_v_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_contact_form_parent_id_idx\` ON \`_pages_v_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_contact_form_path_idx\` ON \`_pages_v_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_testimonials_manual_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`quote\` text,
  	\`rating\` numeric DEFAULT 5,
  	\`photo_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_testimonials_manual_testimonials_order_idx\` ON \`_pages_v_blocks_testimonials_manual_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_testimonials_manual_testimonials_parent_id_idx\` ON \`_pages_v_blocks_testimonials_manual_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_testimonials_manual_testimonials_photo_idx\` ON \`_pages_v_blocks_testimonials_manual_testimonials\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Wat klanten zeggen',
  	\`intro\` text,
  	\`source\` text DEFAULT 'collection',
  	\`layout\` text DEFAULT 'carousel',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_testimonials_order_idx\` ON \`_pages_v_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_testimonials_parent_id_idx\` ON \`_pages_v_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_testimonials_path_idx\` ON \`_pages_v_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Onze projecten',
  	\`intro\` text,
  	\`source\` text DEFAULT 'featured',
  	\`limit\` numeric DEFAULT 6,
  	\`layout\` text DEFAULT 'grid-3',
  	\`show_excerpt\` integer DEFAULT true,
  	\`show_client\` integer DEFAULT true,
  	\`show_services\` integer DEFAULT true,
  	\`show_view_all_button\` integer DEFAULT true,
  	\`view_all_button_text\` text DEFAULT 'Bekijk alle projecten',
  	\`view_all_button_link\` text DEFAULT '/portfolio',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_cases_order_idx\` ON \`_pages_v_blocks_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_cases_parent_id_idx\` ON \`_pages_v_blocks_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_cases_path_idx\` ON \`_pages_v_blocks_cases\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_logo_bar_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`name\` text,
  	\`link\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_logo_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_logo_bar_logos_order_idx\` ON \`_pages_v_blocks_logo_bar_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_logo_bar_logos_parent_id_idx\` ON \`_pages_v_blocks_logo_bar_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_logo_bar_logos_image_idx\` ON \`_pages_v_blocks_logo_bar_logos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_logo_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category\` text DEFAULT 'all',
  	\`limit\` numeric DEFAULT 10,
  	\`show_featured_only\` integer DEFAULT false,
  	\`layout\` text DEFAULT 'grid',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_logo_bar_order_idx\` ON \`_pages_v_blocks_logo_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_logo_bar_parent_id_idx\` ON \`_pages_v_blocks_logo_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_logo_bar_path_idx\` ON \`_pages_v_blocks_logo_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_stats_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` text,
  	\`suffix\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_stats_stats_order_idx\` ON \`_pages_v_blocks_stats_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_stats_stats_parent_id_idx\` ON \`_pages_v_blocks_stats_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`layout\` text DEFAULT 'grid-4',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_stats_order_idx\` ON \`_pages_v_blocks_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_stats_parent_id_idx\` ON \`_pages_v_blocks_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_stats_path_idx\` ON \`_pages_v_blocks_stats\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_faq_items_order_idx\` ON \`_pages_v_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_faq_items_parent_id_idx\` ON \`_pages_v_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Veelgestelde vragen',
  	\`intro\` text,
  	\`source\` text DEFAULT 'manual',
  	\`category\` text DEFAULT 'all',
  	\`limit\` numeric DEFAULT 10,
  	\`show_featured_only\` integer DEFAULT false,
  	\`generate_schema\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_faq_order_idx\` ON \`_pages_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_faq_parent_id_idx\` ON \`_pages_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_faq_path_idx\` ON \`_pages_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`photo_id\` integer,
  	\`photo_url\` text,
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`email\` text,
  	\`linkedin\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_team_members_order_idx\` ON \`_pages_v_blocks_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_team_members_parent_id_idx\` ON \`_pages_v_blocks_team_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_team_members_photo_idx\` ON \`_pages_v_blocks_team_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_team\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Ons team',
  	\`intro\` text,
  	\`layout\` text DEFAULT 'grid-3',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_team_order_idx\` ON \`_pages_v_blocks_team\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_team_parent_id_idx\` ON \`_pages_v_blocks_team\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_team_path_idx\` ON \`_pages_v_blocks_team\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_accordion_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_accordion_items_order_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_accordion_items_parent_id_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_accordion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`allow_multiple\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_accordion_order_idx\` ON \`_pages_v_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_accordion_parent_id_idx\` ON \`_pages_v_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_accordion_path_idx\` ON \`_pages_v_blocks_accordion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_blog_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Laatste blog berichten',
  	\`intro\` text,
  	\`limit\` numeric DEFAULT 6,
  	\`category_id\` integer,
  	\`layout\` text DEFAULT 'grid-3',
  	\`show_excerpt\` integer DEFAULT true,
  	\`show_date\` integer DEFAULT true,
  	\`show_author\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_blog_preview_order_idx\` ON \`_pages_v_blocks_blog_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_blog_preview_parent_id_idx\` ON \`_pages_v_blocks_blog_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_blog_preview_path_idx\` ON \`_pages_v_blocks_blog_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_blog_preview_category_idx\` ON \`_pages_v_blocks_blog_preview\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_image_gallery_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_image_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_image_gallery_images_order_idx\` ON \`_pages_v_blocks_image_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_image_gallery_images_parent_id_idx\` ON \`_pages_v_blocks_image_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_image_gallery_images_image_idx\` ON \`_pages_v_blocks_image_gallery_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_image_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`layout\` text DEFAULT 'grid',
  	\`columns\` text DEFAULT '3',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_image_gallery_order_idx\` ON \`_pages_v_blocks_image_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_image_gallery_parent_id_idx\` ON \`_pages_v_blocks_image_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_image_gallery_path_idx\` ON \`_pages_v_blocks_image_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`video_url\` text,
  	\`poster_image_id\` integer,
  	\`aspect_ratio\` text DEFAULT '16-9',
  	\`autoplay\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_video_poster_image_idx\` ON \`_pages_v_blocks_video\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Locatie',
  	\`address\` text,
  	\`zoom\` numeric DEFAULT 15,
  	\`height\` text DEFAULT 'medium',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_map_order_idx\` ON \`_pages_v_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_map_parent_id_idx\` ON \`_pages_v_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_map_path_idx\` ON \`_pages_v_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_status\` text DEFAULT 'published',
  	\`version_published_on\` text,
  	\`version_color_scheme_primary\` text,
  	\`version_color_scheme_secondary\` text,
  	\`version_color_scheme_accent\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_focus_keyword\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_canonical_url\` text,
  	\`version_meta_no_index\` integer DEFAULT false,
  	\`version_meta_no_follow\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`products_id\` integer,
  	\`product_categories_id\` integer,
  	\`services_id\` integer,
  	\`testimonials_id\` integer,
  	\`cases_id\` integer,
  	\`partners_id\` integer,
  	\`faqs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partners_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_products_id_idx\` ON \`_pages_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_product_categories_id_idx\` ON \`_pages_v_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_services_id_idx\` ON \`_pages_v_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_testimonials_id_idx\` ON \`_pages_v_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_cases_id_idx\` ON \`_pages_v_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_partners_id_idx\` ON \`_pages_v_rels\` (\`partners_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_rels_faqs_id_idx\` ON \`_pages_v_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`blog_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`featured_image_id\` integer,
  	\`content\` text,
  	\`author_id\` integer,
  	\`published_at\` text,
  	\`status\` text DEFAULT 'draft',
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_focus_keyword\` text,
  	\`meta_image_id\` integer,
  	\`meta_canonical_url\` text,
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_no_follow\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`blog_posts_slug_idx\` ON \`blog_posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_featured_image_idx\` ON \`blog_posts\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_author_idx\` ON \`blog_posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_meta_meta_image_idx\` ON \`blog_posts\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_updated_at_idx\` ON \`blog_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_created_at_idx\` ON \`blog_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts__status_idx\` ON \`blog_posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`blog_posts_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`product_categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_rels_order_idx\` ON \`blog_posts_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_rels_parent_idx\` ON \`blog_posts_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_rels_path_idx\` ON \`blog_posts_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_posts_rels_product_categories_id_idx\` ON \`blog_posts_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_blog_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_featured_image_id\` integer,
  	\`version_content\` text,
  	\`version_author_id\` integer,
  	\`version_published_at\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_focus_keyword\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_canonical_url\` text,
  	\`version_meta_no_index\` integer DEFAULT false,
  	\`version_meta_no_follow\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_parent_idx\` ON \`_blog_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_version_version_slug_idx\` ON \`_blog_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_version_version_featured_image_idx\` ON \`_blog_posts_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_version_version_author_idx\` ON \`_blog_posts_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_version_meta_version_meta_image_idx\` ON \`_blog_posts_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_version_version_updated_at_idx\` ON \`_blog_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_version_version_created_at_idx\` ON \`_blog_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_version_version__status_idx\` ON \`_blog_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_created_at_idx\` ON \`_blog_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_updated_at_idx\` ON \`_blog_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_latest_idx\` ON \`_blog_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_autosave_idx\` ON \`_blog_posts_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_blog_posts_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`product_categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_blog_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_rels_order_idx\` ON \`_blog_posts_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_rels_parent_idx\` ON \`_blog_posts_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_rels_path_idx\` ON \`_blog_posts_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_posts_v_rels_product_categories_id_idx\` ON \`_blog_posts_v_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`category\` text DEFAULT 'algemeen',
  	\`featured\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`status\` text DEFAULT 'published',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`cases_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`service\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_services_order_idx\` ON \`cases_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_services_parent_id_idx\` ON \`cases_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`cases_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_gallery_order_idx\` ON \`cases_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_gallery_parent_id_idx\` ON \`cases_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_gallery_image_idx\` ON \`cases_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`cases\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`client\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`content\` text NOT NULL,
  	\`live_url\` text,
  	\`status\` text DEFAULT 'published',
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_focus_keyword\` text,
  	\`meta_image_id\` integer,
  	\`meta_canonical_url\` text,
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_no_follow\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`cases_slug_idx\` ON \`cases\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_featured_image_idx\` ON \`cases\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_meta_meta_image_idx\` ON \`cases\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_updated_at_idx\` ON \`cases\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`cases_created_at_idx\` ON \`cases\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`company\` text NOT NULL,
  	\`photo_id\` integer,
  	\`quote\` text NOT NULL,
  	\`rating\` numeric DEFAULT 5 NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`status\` text DEFAULT 'published',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`testimonials_photo_idx\` ON \`testimonials\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`icon_type\` text DEFAULT 'lucide',
  	\`icon_name\` text,
  	\`icon_upload_id\` integer,
  	\`link\` text,
  	\`category\` text DEFAULT 'algemeen',
  	\`featured\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`status\` text DEFAULT 'published',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`icon_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`services_icon_upload_idx\` ON \`services\` (\`icon_upload_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`partners\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	\`website\` text,
  	\`category\` text DEFAULT 'klant',
  	\`description\` text,
  	\`featured\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`status\` text DEFAULT 'published',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`partners_logo_idx\` ON \`partners\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`partners_updated_at_idx\` ON \`partners\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`partners_created_at_idx\` ON \`partners\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`product_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`parent_id\` integer,
  	\`image_id\` integer,
  	\`level\` numeric DEFAULT 0,
  	\`order\` numeric DEFAULT 0,
  	\`visible\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`product_categories_slug_idx\` ON \`product_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`product_categories_parent_idx\` ON \`product_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`product_categories_image_idx\` ON \`product_categories\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`product_categories_updated_at_idx\` ON \`product_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`product_categories_created_at_idx\` ON \`product_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brands\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`logo_id\` integer,
  	\`description\` text,
  	\`website\` text,
  	\`featured\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`brands_slug_idx\` ON \`brands\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brands_logo_idx\` ON \`brands\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brands_meta_meta_image_idx\` ON \`brands\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brands_updated_at_idx\` ON \`brands\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brands_created_at_idx\` ON \`brands\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`products_specifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_specifications_order_idx\` ON \`products_specifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_specifications_parent_id_idx\` ON \`products_specifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`price\` numeric NOT NULL,
  	\`compare_at_price\` numeric,
  	\`stock\` numeric DEFAULT 0,
  	\`sku\` text,
  	\`brand_id\` integer,
  	\`badge\` text DEFAULT 'none',
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`products_sku_idx\` ON \`products\` (\`sku\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_brand_idx\` ON \`products\` (\`brand_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_meta_meta_image_idx\` ON \`products\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`product_categories_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_rels_media_id_idx\` ON \`products_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_rels_product_categories_id_idx\` ON \`products_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`products_rels_products_id_idx\` ON \`products_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`customer_groups\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`type\` text DEFAULT 'b2c' NOT NULL,
  	\`discount\` numeric DEFAULT 0 NOT NULL,
  	\`priority\` numeric DEFAULT 50 NOT NULL,
  	\`min_order_amount\` numeric,
  	\`is_default\` integer DEFAULT false,
  	\`can_view_catalog\` integer DEFAULT true,
  	\`can_place_orders\` integer DEFAULT true,
  	\`can_request_quotes\` integer DEFAULT false,
  	\`can_download_invoices\` integer DEFAULT true,
  	\`can_view_order_history\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`customer_groups_name_idx\` ON \`customer_groups\` (\`name\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`customer_groups_slug_idx\` ON \`customer_groups\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`customer_groups_updated_at_idx\` ON \`customer_groups\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`customer_groups_created_at_idx\` ON \`customer_groups\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`order_lists_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`default_quantity\` numeric DEFAULT 1 NOT NULL,
  	\`notes\` text,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`order_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_items_order_idx\` ON \`order_lists_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_items_parent_id_idx\` ON \`order_lists_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_items_product_idx\` ON \`order_lists_items\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`order_lists_share_with\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`can_edit\` integer DEFAULT false,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`order_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_share_with_order_idx\` ON \`order_lists_share_with\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_share_with_parent_id_idx\` ON \`order_lists_share_with\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_share_with_user_idx\` ON \`order_lists_share_with\` (\`user_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`order_lists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`owner_id\` integer NOT NULL,
  	\`is_default\` integer DEFAULT false,
  	\`item_count\` numeric,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_owner_idx\` ON \`order_lists\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_updated_at_idx\` ON \`order_lists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`order_lists_created_at_idx\` ON \`order_lists\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`orders_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`subtotal\` numeric,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_items_order_idx\` ON \`orders_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_items_parent_id_idx\` ON \`orders_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_items_product_idx\` ON \`orders_items\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order_number\` text NOT NULL,
  	\`customer_id\` integer NOT NULL,
  	\`subtotal\` numeric NOT NULL,
  	\`shipping_cost\` numeric DEFAULT 0,
  	\`tax\` numeric DEFAULT 0,
  	\`discount\` numeric DEFAULT 0,
  	\`total\` numeric NOT NULL,
  	\`shipping_address_name\` text NOT NULL,
  	\`shipping_address_company\` text,
  	\`shipping_address_street\` text NOT NULL,
  	\`shipping_address_house_number\` text NOT NULL,
  	\`shipping_address_postal_code\` text NOT NULL,
  	\`shipping_address_city\` text NOT NULL,
  	\`shipping_address_country\` text DEFAULT 'Nederland',
  	\`billing_address_same_as_shipping\` integer DEFAULT true,
  	\`billing_address_company\` text,
  	\`billing_address_street\` text,
  	\`billing_address_house_number\` text,
  	\`billing_address_postal_code\` text,
  	\`billing_address_city\` text,
  	\`billing_address_country\` text DEFAULT 'Nederland',
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`payment_method\` text NOT NULL,
  	\`payment_status\` text DEFAULT 'pending' NOT NULL,
  	\`notes\` text,
  	\`tracking_code\` text,
  	\`invoice_p_d_f_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`invoice_p_d_f_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`orders_order_number_idx\` ON \`orders\` (\`order_number\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_customer_idx\` ON \`orders\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_invoice_p_d_f_idx\` ON \`orders\` (\`invoice_p_d_f_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`clients_enabled_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_enabled_features_order_idx\` ON \`clients_enabled_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_enabled_features_parent_id_idx\` ON \`clients_enabled_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`clients_disabled_collections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`collection\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_disabled_collections_order_idx\` ON \`clients_disabled_collections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_disabled_collections_parent_id_idx\` ON \`clients_disabled_collections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`clients\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`domain\` text NOT NULL,
  	\`contact_email\` text NOT NULL,
  	\`contact_name\` text,
  	\`contact_phone\` text,
  	\`template\` text NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`deployment_url\` text,
  	\`admin_url\` text,
  	\`deployment_provider\` text,
  	\`deployment_provider_id\` text,
  	\`last_deployment_id\` text,
  	\`last_deployed_at\` text,
  	\`database_url\` text,
  	\`database_provider_id\` text,
  	\`custom_environment\` text,
  	\`custom_settings\` text,
  	\`plan\` text DEFAULT 'starter',
  	\`billing_status\` text DEFAULT 'active',
  	\`monthly_fee\` numeric,
  	\`next_billing_date\` text,
  	\`payments_enabled\` integer DEFAULT false,
  	\`stripe_account_id\` text,
  	\`stripe_account_status\` text DEFAULT 'not_started',
  	\`payment_pricing_tier\` text DEFAULT 'standard',
  	\`custom_transaction_fee_percentage\` numeric,
  	\`custom_transaction_fee_fixed\` numeric,
  	\`total_payment_volume\` numeric,
  	\`total_payment_revenue\` numeric,
  	\`last_payment_at\` text,
  	\`multi_safepay_enabled\` integer DEFAULT false,
  	\`multi_safepay_affiliate_id\` text,
  	\`multi_safepay_account_status\` text DEFAULT 'not_started',
  	\`multi_safepay_pricing_tier\` text DEFAULT 'standard',
  	\`multi_safepay_custom_rates_ideal_fee\` numeric,
  	\`multi_safepay_custom_rates_card_percentage\` numeric,
  	\`multi_safepay_custom_rates_card_fixed\` numeric,
  	\`multi_safepay_total_volume\` numeric,
  	\`multi_safepay_total_revenue\` numeric,
  	\`multi_safepay_last_payment_at\` text,
  	\`last_health_check\` text,
  	\`health_status\` text,
  	\`uptime_percentage\` numeric,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`clients_domain_idx\` ON \`clients\` (\`domain\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_updated_at_idx\` ON \`clients\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_created_at_idx\` ON \`clients\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`deployments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`environment\` text DEFAULT 'production' NOT NULL,
  	\`type\` text NOT NULL,
  	\`version\` text,
  	\`git_commit\` text,
  	\`git_branch\` text,
  	\`vercel_deployment_id\` text,
  	\`vercel_deployment_url\` text,
  	\`vercel_project_id\` text,
  	\`started_at\` text,
  	\`completed_at\` text,
  	\`duration\` numeric,
  	\`logs\` text,
  	\`error_message\` text,
  	\`error_stack\` text,
  	\`config_snapshot\` text,
  	\`environment_snapshot\` text,
  	\`triggered_by\` text,
  	\`reason\` text,
  	\`notes\` text,
  	\`health_check_passed\` integer,
  	\`health_check_results\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`deployments_client_idx\` ON \`deployments\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`deployments_updated_at_idx\` ON \`deployments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`deployments_created_at_idx\` ON \`deployments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_checkbox\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`default_value\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_checkbox_order_idx\` ON \`forms_blocks_checkbox\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_checkbox_parent_id_idx\` ON \`forms_blocks_checkbox\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_checkbox_path_idx\` ON \`forms_blocks_checkbox\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_email\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_email_order_idx\` ON \`forms_blocks_email\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_email_parent_id_idx\` ON \`forms_blocks_email\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_email_path_idx\` ON \`forms_blocks_email\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_message\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`message\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_message_order_idx\` ON \`forms_blocks_message\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_message_parent_id_idx\` ON \`forms_blocks_message\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_message_path_idx\` ON \`forms_blocks_message\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_number\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_number_order_idx\` ON \`forms_blocks_number\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_number_parent_id_idx\` ON \`forms_blocks_number\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_number_path_idx\` ON \`forms_blocks_number\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_select_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_select_options_order_idx\` ON \`forms_blocks_select_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_select_options_parent_id_idx\` ON \`forms_blocks_select_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_select\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`placeholder\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_select_order_idx\` ON \`forms_blocks_select\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_select_parent_id_idx\` ON \`forms_blocks_select\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_select_path_idx\` ON \`forms_blocks_select\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_text_order_idx\` ON \`forms_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_text_parent_id_idx\` ON \`forms_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_text_path_idx\` ON \`forms_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_textarea\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_textarea_order_idx\` ON \`forms_blocks_textarea\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_textarea_parent_id_idx\` ON \`forms_blocks_textarea\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_blocks_textarea_path_idx\` ON \`forms_blocks_textarea\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_emails\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email_to\` text,
  	\`cc\` text,
  	\`bcc\` text,
  	\`reply_to\` text,
  	\`email_from\` text,
  	\`subject\` text DEFAULT 'You''ve received a new message.' NOT NULL,
  	\`message\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_emails_order_idx\` ON \`forms_emails\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_emails_parent_id_idx\` ON \`forms_emails\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`submit_button_label\` text,
  	\`confirmation_type\` text DEFAULT 'message',
  	\`confirmation_message\` text,
  	\`redirect_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`form_submissions_submission_data\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`form_submissions_submission_data_order_idx\` ON \`form_submissions_submission_data\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`form_submissions_submission_data_parent_id_idx\` ON \`form_submissions_submission_data\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`form_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`form_submissions_form_idx\` ON \`form_submissions\` (\`form_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`redirects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`from\` text NOT NULL,
  	\`to_type\` text DEFAULT 'reference',
  	\`to_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`redirects_from_idx\` ON \`redirects\` (\`from\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`redirects_updated_at_idx\` ON \`redirects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`redirects_created_at_idx\` ON \`redirects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`redirects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`redirects_rels_order_idx\` ON \`redirects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`redirects_rels_parent_idx\` ON \`redirects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`redirects_rels_path_idx\` ON \`redirects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`redirects_rels_pages_id_idx\` ON \`redirects_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`pages_id\` integer,
  	\`blog_posts_id\` integer,
  	\`faqs_id\` integer,
  	\`media_id\` integer,
  	\`cases_id\` integer,
  	\`testimonials_id\` integer,
  	\`services_id\` integer,
  	\`partners_id\` integer,
  	\`product_categories_id\` integer,
  	\`brands_id\` integer,
  	\`products_id\` integer,
  	\`customer_groups_id\` integer,
  	\`order_lists_id\` integer,
  	\`orders_id\` integer,
  	\`clients_id\` integer,
  	\`deployments_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`redirects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partners_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`brands_id\`) REFERENCES \`brands\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`customer_groups_id\`) REFERENCES \`customer_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`order_lists_id\`) REFERENCES \`order_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`deployments_id\`) REFERENCES \`deployments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_blog_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_cases_id_idx\` ON \`payload_locked_documents_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_partners_id_idx\` ON \`payload_locked_documents_rels\` (\`partners_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_brands_id_idx\` ON \`payload_locked_documents_rels\` (\`brands_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_customer_groups_id_idx\` ON \`payload_locked_documents_rels\` (\`customer_groups_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_order_lists_id_idx\` ON \`payload_locked_documents_rels\` (\`order_lists_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_deployments_id_idx\` ON \`payload_locked_documents_rels\` (\`deployments_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`settings_hours\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`day\` text,
  	\`open\` integer DEFAULT true,
  	\`from\` text,
  	\`to\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_hours_order_idx\` ON \`settings_hours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_hours_parent_id_idx\` ON \`settings_hours\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`settings_sitemap_exclude\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_sitemap_exclude_order_idx\` ON \`settings_sitemap_exclude\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_sitemap_exclude_parent_id_idx\` ON \`settings_sitemap_exclude\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`settings_robots_disallow\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`path\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_robots_disallow_order_idx\` ON \`settings_robots_disallow\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_robots_disallow_parent_id_idx\` ON \`settings_robots_disallow\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`company_name\` text NOT NULL,
  	\`tagline\` text,
  	\`description\` text,
  	\`kvk_number\` text,
  	\`vat_number\` text,
  	\`email\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`whatsapp\` text,
  	\`address_street\` text,
  	\`address_postal_code\` text,
  	\`address_city\` text,
  	\`address_country\` text DEFAULT 'Nederland',
  	\`address_show_on_site\` integer DEFAULT true,
  	\`facebook\` text,
  	\`instagram\` text,
  	\`linkedin\` text,
  	\`twitter\` text,
  	\`youtube\` text,
  	\`tiktok\` text,
  	\`hours_note\` text,
  	\`free_shipping_threshold\` numeric DEFAULT 150 NOT NULL,
  	\`shipping_cost\` numeric DEFAULT 6.95 NOT NULL,
  	\`delivery_time\` text DEFAULT 'Besteld voor 16:00, morgen in huis' NOT NULL,
  	\`delivery_days_monday\` integer DEFAULT true,
  	\`delivery_days_tuesday\` integer DEFAULT true,
  	\`delivery_days_wednesday\` integer DEFAULT true,
  	\`delivery_days_thursday\` integer DEFAULT true,
  	\`delivery_days_friday\` integer DEFAULT true,
  	\`delivery_days_saturday\` integer DEFAULT false,
  	\`delivery_days_sunday\` integer DEFAULT false,
  	\`return_days\` numeric DEFAULT 30 NOT NULL,
  	\`return_policy\` text,
  	\`minimum_order_amount\` numeric,
  	\`show_prices_excl_v_a_t\` integer DEFAULT true,
  	\`vat_percentage\` numeric DEFAULT 21,
  	\`require_account_for_purchase\` integer DEFAULT true,
  	\`trust_indicators_trust_score\` numeric,
  	\`trust_indicators_trust_source\` text,
  	\`trust_indicators_years_in_business\` numeric,
  	\`trust_indicators_customers_served\` numeric,
  	\`features_enable_quick_order\` integer DEFAULT true,
  	\`features_enable_order_lists\` integer DEFAULT true,
  	\`features_enable_reviews\` integer DEFAULT false,
  	\`features_enable_wishlist\` integer DEFAULT true,
  	\`features_enable_stock_notifications\` integer DEFAULT false,
  	\`features_enable_live_chat\` integer DEFAULT false,
  	\`logo_id\` integer,
  	\`logo_white_id\` integer,
  	\`favicon_id\` integer,
  	\`primary_color\` text,
  	\`accent_color\` text,
  	\`ga4_id\` text,
  	\`gtm_id\` text,
  	\`facebook_pixel\` text,
  	\`google_site_verification\` text,
  	\`default_meta_description\` text,
  	\`default_o_g_image_id\` integer,
  	\`business_category\` text,
  	\`geo_latitude\` numeric,
  	\`geo_longitude\` numeric,
  	\`price_range\` text,
  	\`sitemap_enabled\` integer DEFAULT true,
  	\`enable_auto_o_g_images\` integer DEFAULT true,
  	\`enable_j_s_o_n_l_d\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_white_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_o_g_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_logo_idx\` ON \`settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_logo_white_idx\` ON \`settings\` (\`logo_white_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_favicon_idx\` ON \`settings\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_default_o_g_image_idx\` ON \`settings\` (\`default_o_g_image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`settings_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_rels_order_idx\` ON \`settings_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_rels_parent_idx\` ON \`settings_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_rels_path_idx\` ON \`settings_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`settings_rels_media_id_idx\` ON \`settings_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`primary_color\` text DEFAULT '#00796B',
  	\`secondary_color\` text DEFAULT '#0A1628',
  	\`accent_color\` text DEFAULT '#8b5cf6',
  	\`background_color\` text DEFAULT '#ffffff',
  	\`surface_color\` text DEFAULT '#f9fafb',
  	\`border_color\` text DEFAULT '#e5e7eb',
  	\`text_primary\` text DEFAULT '#0A1628',
  	\`text_secondary\` text DEFAULT '#64748b',
  	\`text_muted\` text DEFAULT '#94a3b8',
  	\`heading_font\` text DEFAULT 'Inter, system-ui, sans-serif',
  	\`body_font\` text DEFAULT 'Inter, system-ui, sans-serif',
  	\`font_scale\` text DEFAULT 'md',
  	\`border_radius\` text DEFAULT 'lg',
  	\`spacing\` text DEFAULT 'md',
  	\`container_width\` text DEFAULT '7xl',
  	\`shadow_size\` text DEFAULT 'md',
  	\`enable_animations\` integer DEFAULT true,
  	\`enable_dark_mode\` integer DEFAULT false,
  	\`custom_c_s_s\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`header_top_bar_left_messages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_top_bar_left_messages_order_idx\` ON \`header_top_bar_left_messages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_top_bar_left_messages_parent_id_idx\` ON \`header_top_bar_left_messages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`header_top_bar_right_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_top_bar_right_links_order_idx\` ON \`header_top_bar_right_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_top_bar_right_links_parent_id_idx\` ON \`header_top_bar_right_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`header_custom_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`icon\` text,
  	\`style\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_custom_buttons_order_idx\` ON \`header_custom_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_custom_buttons_parent_id_idx\` ON \`header_custom_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`header_navigation_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`page_id\` integer,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_navigation_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_navigation_items_children_order_idx\` ON \`header_navigation_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_navigation_items_children_parent_id_idx\` ON \`header_navigation_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_navigation_items_children_page_idx\` ON \`header_navigation_items_children\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`header_navigation_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`page_id\` integer,
  	\`url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_navigation_items_order_idx\` ON \`header_navigation_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_navigation_items_parent_id_idx\` ON \`header_navigation_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_navigation_items_page_idx\` ON \`header_navigation_items\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`top_bar_enabled\` integer DEFAULT true,
  	\`top_bar_background_color\` text DEFAULT '#0A1628',
  	\`top_bar_text_color\` text DEFAULT '#FFFFFF',
  	\`alert_bar_enabled\` integer DEFAULT false,
  	\`alert_bar_message\` text,
  	\`alert_bar_type\` text DEFAULT 'info',
  	\`alert_bar_icon\` text,
  	\`alert_bar_link_enabled\` integer DEFAULT false,
  	\`alert_bar_link_label\` text,
  	\`alert_bar_link_url\` text,
  	\`alert_bar_dismissible\` integer DEFAULT true,
  	\`alert_bar_schedule_use_schedule\` integer DEFAULT false,
  	\`alert_bar_schedule_start_date\` text,
  	\`alert_bar_schedule_end_date\` text,
  	\`alert_bar_custom_colors_use_custom_colors\` integer DEFAULT false,
  	\`alert_bar_custom_colors_background_color\` text,
  	\`alert_bar_custom_colors_text_color\` text,
  	\`logo_override_id\` integer,
  	\`site_name_override\` text,
  	\`enable_search\` integer DEFAULT true,
  	\`search_placeholder\` text DEFAULT 'Zoek producten...',
  	\`show_phone\` integer DEFAULT true,
  	\`show_wishlist\` integer DEFAULT false,
  	\`show_account\` integer DEFAULT true,
  	\`show_cart\` integer DEFAULT true,
  	\`navigation_cta_button_text\` text DEFAULT 'Contact',
  	\`navigation_cta_button_link\` text DEFAULT '/contact',
  	\`navigation_cta_button_show\` integer DEFAULT true,
  	\`sticky_header\` integer DEFAULT true,
  	\`show_shadow\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_override_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`header_logo_override_idx\` ON \`header\` (\`logo_override_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`page_id\` integer,
  	\`external_url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_columns_links_order_idx\` ON \`footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_columns_links_parent_id_idx\` ON \`footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_columns_links_page_idx\` ON \`footer_columns_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_columns_order_idx\` ON \`footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_columns_parent_id_idx\` ON \`footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`bottom_text\` text,
  	\`show_social_links\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_addresses\`;`)
  await db.run(sql`DROP TABLE \`users_roles\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_top_bar_left_messages\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_top_bar_right_links\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_top_bar\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_breadcrumb_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_breadcrumb\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_two_column\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_product_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features_features\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_quick_order\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_product_filters\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_search_bar_popular_searches\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_search_bar\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_form\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_manual_testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cases\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_logo_bar_logos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_logo_bar\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_members\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_blog_preview\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_gallery\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_top_bar_left_messages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_top_bar_right_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_top_bar\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_breadcrumb_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_breadcrumb\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_two_column\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_product_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_features\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_quick_order\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_product_filters\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_search_bar_popular_searches\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_search_bar\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_form\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_manual_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cases\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_logo_bar_logos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_logo_bar\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_members\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_blog_preview\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_image_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_image_gallery\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`blog_posts\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_rels\`;`)
  await db.run(sql`DROP TABLE \`_blog_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_blog_posts_v_rels\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`cases_services\`;`)
  await db.run(sql`DROP TABLE \`cases_gallery\`;`)
  await db.run(sql`DROP TABLE \`cases\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`partners\`;`)
  await db.run(sql`DROP TABLE \`product_categories\`;`)
  await db.run(sql`DROP TABLE \`brands\`;`)
  await db.run(sql`DROP TABLE \`products_specifications\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`customer_groups\`;`)
  await db.run(sql`DROP TABLE \`order_lists_items\`;`)
  await db.run(sql`DROP TABLE \`order_lists_share_with\`;`)
  await db.run(sql`DROP TABLE \`order_lists\`;`)
  await db.run(sql`DROP TABLE \`orders_items\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`DROP TABLE \`clients_enabled_features\`;`)
  await db.run(sql`DROP TABLE \`clients_disabled_collections\`;`)
  await db.run(sql`DROP TABLE \`clients\`;`)
  await db.run(sql`DROP TABLE \`deployments\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_checkbox\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_email\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_message\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_number\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_options\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_textarea\`;`)
  await db.run(sql`DROP TABLE \`forms_emails\`;`)
  await db.run(sql`DROP TABLE \`forms\`;`)
  await db.run(sql`DROP TABLE \`form_submissions_submission_data\`;`)
  await db.run(sql`DROP TABLE \`form_submissions\`;`)
  await db.run(sql`DROP TABLE \`redirects\`;`)
  await db.run(sql`DROP TABLE \`redirects_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`settings_hours\`;`)
  await db.run(sql`DROP TABLE \`settings_sitemap_exclude\`;`)
  await db.run(sql`DROP TABLE \`settings_robots_disallow\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`DROP TABLE \`settings_rels\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`DROP TABLE \`header_top_bar_left_messages\`;`)
  await db.run(sql`DROP TABLE \`header_top_bar_right_links\`;`)
  await db.run(sql`DROP TABLE \`header_custom_buttons\`;`)
  await db.run(sql`DROP TABLE \`header_navigation_items_children\`;`)
  await db.run(sql`DROP TABLE \`header_navigation_items\`;`)
  await db.run(sql`DROP TABLE \`header\`;`)
  await db.run(sql`DROP TABLE \`footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`footer_columns\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
}

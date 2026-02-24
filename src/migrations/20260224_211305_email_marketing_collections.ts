import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_addresses\` (
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
  await db.run(sql`CREATE INDEX \`users_addresses_order_idx\` ON \`users_addresses\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_addresses_parent_id_idx\` ON \`users_addresses\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users_favorites\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`added_at\` text,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_favorites_order_idx\` ON \`users_favorites\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_favorites_parent_id_idx\` ON \`users_favorites\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`users_favorites_product_idx\` ON \`users_favorites\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
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
  	\`company_branch\` text,
  	\`company_website\` text,
  	\`client_type\` text,
  	\`client_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`users_client_idx\` ON \`users\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'announcement',
  	\`message\` text,
  	\`cta_text\` text,
  	\`cta_link\` text,
  	\`dismissible\` integer DEFAULT true,
  	\`dismissal_key\` text,
  	\`sticky\` integer DEFAULT false,
  	\`show_from\` text,
  	\`show_until\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_order_idx\` ON \`pages_blocks_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_parent_id_idx\` ON \`pages_blocks_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_path_idx\` ON \`pages_blocks_banner\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'md',
  	\`show_divider\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_spacer_order_idx\` ON \`pages_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_spacer_parent_id_idx\` ON \`pages_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_spacer_path_idx\` ON \`pages_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	\`style\` text DEFAULT 'primary',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_buttons_order_idx\` ON \`pages_blocks_hero_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_buttons_parent_id_idx\` ON \`pages_blocks_hero_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`subtitle\` text,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'default',
  	\`background_style\` text DEFAULT 'gradient',
  	\`background_image_id\` integer,
  	\`background_color\` text DEFAULT 'navy',
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_background_image_idx\` ON \`pages_blocks_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`max_width\` text DEFAULT 'narrow',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_order_idx\` ON \`pages_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_parent_id_idx\` ON \`pages_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_path_idx\` ON \`pages_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_block_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`variant\` text DEFAULT 'primary',
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_media_block\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_buttons_order_idx\` ON \`pages_blocks_media_block_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_buttons_parent_id_idx\` ON \`pages_blocks_media_block_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_type\` text DEFAULT 'image',
  	\`media_position\` text DEFAULT 'left',
  	\`media_id\` integer,
  	\`video_url\` text,
  	\`split\` text DEFAULT '50-50',
  	\`subtitle\` text,
  	\`title\` text,
  	\`content\` text,
  	\`background_color\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_order_idx\` ON \`pages_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_parent_id_idx\` ON \`pages_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_path_idx\` ON \`pages_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_media_idx\` ON \`pages_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_two_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`split\` text DEFAULT '50-50',
  	\`column_one\` text,
  	\`column_two\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_column_order_idx\` ON \`pages_blocks_two_column\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_column_parent_id_idx\` ON \`pages_blocks_two_column\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_column_path_idx\` ON \`pages_blocks_two_column\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_product_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_label\` text,
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
  await db.run(sql`CREATE INDEX \`pages_blocks_product_grid_order_idx\` ON \`pages_blocks_product_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_grid_parent_id_idx\` ON \`pages_blocks_product_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_grid_path_idx\` ON \`pages_blocks_product_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_grid_category_idx\` ON \`pages_blocks_product_grid\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_grid_brand_idx\` ON \`pages_blocks_product_grid\` (\`brand_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_label\` text,
  	\`heading\` text DEFAULT 'Onze categorieën',
  	\`intro\` text,
  	\`source\` text DEFAULT 'auto',
  	\`show_icon\` integer DEFAULT true,
  	\`show_product_count\` integer DEFAULT true,
  	\`layout\` text DEFAULT 'grid-3',
  	\`limit\` numeric DEFAULT 10,
  	\`show_quick_order_card\` integer DEFAULT false,
  	\`quick_order_link\` text DEFAULT '/quick-order',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_category_grid_order_idx\` ON \`pages_blocks_category_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_category_grid_parent_id_idx\` ON \`pages_blocks_category_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_category_grid_path_idx\` ON \`pages_blocks_category_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_quick_order\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_quick_order_order_idx\` ON \`pages_blocks_quick_order\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_quick_order_parent_id_idx\` ON \`pages_blocks_quick_order\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_quick_order_path_idx\` ON \`pages_blocks_quick_order\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	\`style\` text DEFAULT 'primary',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_buttons_order_idx\` ON \`pages_blocks_cta_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_buttons_parent_id_idx\` ON \`pages_blocks_cta_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'centered',
  	\`style\` text DEFAULT 'dark',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_calltoaction\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text,
  	\`button_link\` text,
  	\`background_color\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_calltoaction_order_idx\` ON \`pages_blocks_calltoaction\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_calltoaction_parent_id_idx\` ON \`pages_blocks_calltoaction\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_calltoaction_path_idx\` ON \`pages_blocks_calltoaction\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_opening_hours\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`day\` text,
  	\`hours\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_opening_hours_order_idx\` ON \`pages_blocks_contact_opening_hours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_opening_hours_parent_id_idx\` ON \`pages_blocks_contact_opening_hours\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Neem contact op',
  	\`subtitle\` text,
  	\`address_street\` text,
  	\`address_postal_code\` text,
  	\`address_city\` text,
  	\`phone\` text,
  	\`email\` text,
  	\`show_map\` integer DEFAULT true,
  	\`map_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_order_idx\` ON \`pages_blocks_contact\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_parent_id_idx\` ON \`pages_blocks_contact\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_path_idx\` ON \`pages_blocks_contact\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Neem contact op',
  	\`description\` text,
  	\`show_phone\` integer DEFAULT true,
  	\`show_subject\` integer DEFAULT true,
  	\`submit_to\` text,
  	\`contact_info_phone\` text,
  	\`contact_info_email\` text,
  	\`contact_info_address\` text,
  	\`contact_info_hours\` text,
  	\`success_message\` text DEFAULT 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
  	\`error_message\` text DEFAULT 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_form_order_idx\` ON \`pages_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_form_parent_id_idx\` ON \`pages_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_form_path_idx\` ON \`pages_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_newsletter\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Blijf op de hoogte',
  	\`button_label\` text DEFAULT 'Inschrijven',
  	\`description\` text,
  	\`placeholder\` text DEFAULT 'Je email adres...',
  	\`background_color\` text DEFAULT 'teal',
  	\`privacy_text\` text DEFAULT 'We respecteren je privacy. Geen spam.',
  	\`success_message\` text DEFAULT 'Bedankt voor je inschrijving! Check je inbox.',
  	\`error_message\` text DEFAULT 'Er ging iets mis. Probeer het opnieuw.',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_newsletter_order_idx\` ON \`pages_blocks_newsletter\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_newsletter_parent_id_idx\` ON \`pages_blocks_newsletter\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_newsletter_path_idx\` ON \`pages_blocks_newsletter\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_features_order_idx\` ON \`pages_blocks_features_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_features_parent_id_idx\` ON \`pages_blocks_features_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'grid-3',
  	\`icon_style\` text DEFAULT 'glow',
  	\`alignment\` text DEFAULT 'center',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_order_idx\` ON \`pages_blocks_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_parent_id_idx\` ON \`pages_blocks_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_path_idx\` ON \`pages_blocks_features\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`icon_color\` text DEFAULT 'teal',
  	\`title\` text,
  	\`description\` text,
  	\`link\` text,
  	\`link_text\` text DEFAULT 'Meer info',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_services_order_idx\` ON \`pages_blocks_services_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_services_parent_id_idx\` ON \`pages_blocks_services_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`subtitle\` text,
  	\`title\` text,
  	\`description\` text,
  	\`columns\` text DEFAULT '3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_order_idx\` ON \`pages_blocks_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_parent_id_idx\` ON \`pages_blocks_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_path_idx\` ON \`pages_blocks_services\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`author\` text,
  	\`role\` text,
  	\`avatar_id\` integer,
  	\`rating\` numeric DEFAULT 5,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_testimonials_order_idx\` ON \`pages_blocks_testimonials_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_testimonials_parent_id_idx\` ON \`pages_blocks_testimonials_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_testimonials_avatar_idx\` ON \`pages_blocks_testimonials_testimonials\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`variant\` text DEFAULT 'grid',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_order_idx\` ON \`pages_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_parent_id_idx\` ON \`pages_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_path_idx\` ON \`pages_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cases\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_cases_order_idx\` ON \`pages_blocks_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cases_parent_id_idx\` ON \`pages_blocks_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cases_path_idx\` ON \`pages_blocks_cases\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_logo_bar_logos\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_bar_logos_order_idx\` ON \`pages_blocks_logo_bar_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_bar_logos_parent_id_idx\` ON \`pages_blocks_logo_bar_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_bar_logos_image_idx\` ON \`pages_blocks_logo_bar_logos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_logo_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`auto_scroll\` integer DEFAULT false,
  	\`variant\` text DEFAULT 'light',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_bar_order_idx\` ON \`pages_blocks_logo_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_bar_parent_id_idx\` ON \`pages_blocks_logo_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_bar_path_idx\` ON \`pages_blocks_logo_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_stats_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`value\` text,
  	\`label\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_stats_order_idx\` ON \`pages_blocks_stats_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_stats_parent_id_idx\` ON \`pages_blocks_stats_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`columns\` text DEFAULT '3',
  	\`description\` text,
  	\`background_color\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_order_idx\` ON \`pages_blocks_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_parent_id_idx\` ON \`pages_blocks_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_path_idx\` ON \`pages_blocks_stats\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_faqs_order_idx\` ON \`pages_blocks_faq_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_faqs_parent_id_idx\` ON \`pages_blocks_faq_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'single-column',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`photo_id\` integer,
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`email\` text,
  	\`linkedin\` text,
  	\`twitter\` text,
  	\`github\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_members_order_idx\` ON \`pages_blocks_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_members_parent_id_idx\` ON \`pages_blocks_team_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_members_photo_idx\` ON \`pages_blocks_team_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`subtitle\` text,
  	\`title\` text,
  	\`description\` text,
  	\`columns\` text DEFAULT '3',
  	\`photo_style\` text DEFAULT 'square',
  	\`background_color\` text DEFAULT 'bg',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_order_idx\` ON \`pages_blocks_team\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_parent_id_idx\` ON \`pages_blocks_team\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_path_idx\` ON \`pages_blocks_team\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_accordion_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_items_order_idx\` ON \`pages_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_items_parent_id_idx\` ON \`pages_blocks_accordion_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_accordion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`allow_multiple\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_order_idx\` ON \`pages_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_parent_id_idx\` ON \`pages_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_path_idx\` ON \`pages_blocks_accordion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_blog_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`columns\` text DEFAULT '3',
  	\`description\` text,
  	\`show_excerpt\` integer DEFAULT true,
  	\`show_read_time\` integer DEFAULT false,
  	\`show_category\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_blog_preview_order_idx\` ON \`pages_blocks_blog_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_blog_preview_parent_id_idx\` ON \`pages_blocks_blog_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_blog_preview_path_idx\` ON \`pages_blocks_blog_preview\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`price\` text,
  	\`featured\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparison\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_columns_order_idx\` ON \`pages_blocks_comparison_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_columns_parent_id_idx\` ON \`pages_blocks_comparison_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_rows_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'text',
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparison_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_rows_values_order_idx\` ON \`pages_blocks_comparison_rows_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_rows_values_parent_id_idx\` ON \`pages_blocks_comparison_rows_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparison\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_rows_order_idx\` ON \`pages_blocks_comparison_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_rows_parent_id_idx\` ON \`pages_blocks_comparison_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_order_idx\` ON \`pages_blocks_comparison\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_parent_id_idx\` ON \`pages_blocks_comparison\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_path_idx\` ON \`pages_blocks_comparison\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_infobox\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'info',
  	\`icon\` text,
  	\`title\` text,
  	\`description\` text,
  	\`dismissible\` integer DEFAULT false,
  	\`persistent\` integer DEFAULT false,
  	\`storage_key\` text,
  	\`max_width\` text DEFAULT 'wide',
  	\`margin_top\` text DEFAULT 'md',
  	\`margin_bottom\` text DEFAULT 'md',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_infobox_order_idx\` ON \`pages_blocks_infobox\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_infobox_parent_id_idx\` ON \`pages_blocks_infobox\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_infobox_path_idx\` ON \`pages_blocks_infobox\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image_gallery_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_image_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_gallery_images_order_idx\` ON \`pages_blocks_image_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_gallery_images_parent_id_idx\` ON \`pages_blocks_image_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_gallery_images_image_idx\` ON \`pages_blocks_image_gallery_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`columns\` text DEFAULT '3',
  	\`aspect_ratio\` text DEFAULT '4-3',
  	\`enable_lightbox\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_gallery_order_idx\` ON \`pages_blocks_image_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_gallery_parent_id_idx\` ON \`pages_blocks_image_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_gallery_path_idx\` ON \`pages_blocks_image_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`source\` text DEFAULT 'youtube',
  	\`aspect_ratio\` text DEFAULT '16-9',
  	\`youtube_url\` text,
  	\`vimeo_url\` text,
  	\`video_file_id\` integer,
  	\`poster_image_id\` integer,
  	\`caption\` text,
  	\`autoplay\` integer DEFAULT false,
  	\`controls\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`video_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_video_file_idx\` ON \`pages_blocks_video\` (\`video_file_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_poster_image_idx\` ON \`pages_blocks_video\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_code\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'typescript',
  	\`show_line_numbers\` integer DEFAULT true,
  	\`filename\` text,
  	\`code\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_order_idx\` ON \`pages_blocks_code\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_parent_id_idx\` ON \`pages_blocks_code\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_path_idx\` ON \`pages_blocks_code\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_map\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_map_order_idx\` ON \`pages_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_parent_id_idx\` ON \`pages_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_path_idx\` ON \`pages_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_construction_hero_avatars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`initials\` text,
  	\`color\` text DEFAULT 'teal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_construction_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_avatars_order_idx\` ON \`pages_blocks_construction_hero_avatars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_avatars_parent_id_idx\` ON \`pages_blocks_construction_hero_avatars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_construction_hero_floating_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`subtitle\` text,
  	\`icon\` text,
  	\`color\` text DEFAULT 'green',
  	\`position\` text DEFAULT 'bottom-left',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_construction_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_floating_badges_order_idx\` ON \`pages_blocks_construction_hero_floating_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_floating_badges_parent_id_idx\` ON \`pages_blocks_construction_hero_floating_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_construction_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`badge\` text,
  	\`badge_icon\` text DEFAULT 'award',
  	\`title\` text,
  	\`description\` text,
  	\`primary_c_t_a_text\` text DEFAULT 'Gratis offerte aanvragen',
  	\`primary_c_t_a_icon\` text DEFAULT 'file-text',
  	\`primary_c_t_a_link\` text DEFAULT '/offerte-aanvragen',
  	\`secondary_c_t_a_text\` text DEFAULT 'Bekijk projecten',
  	\`secondary_c_t_a_icon\` text DEFAULT 'play-circle',
  	\`secondary_c_t_a_link\` text DEFAULT '/projecten',
  	\`trust_text\` text DEFAULT '500+ tevreden opdrachtgevers',
  	\`trust_subtext\` text DEFAULT 'Gemiddeld 4.9/5 beoordeeld',
  	\`hero_image_id\` integer,
  	\`hero_emoji\` text DEFAULT '🏗️',
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_order_idx\` ON \`pages_blocks_construction_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_parent_id_idx\` ON \`pages_blocks_construction_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_path_idx\` ON \`pages_blocks_construction_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_construction_hero_hero_image_idx\` ON \`pages_blocks_construction_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading_badge\` text DEFAULT 'Onze diensten',
  	\`heading_badge_icon\` text DEFAULT 'wrench',
  	\`heading_title\` text DEFAULT 'Alles onder één dak',
  	\`heading_description\` text DEFAULT 'Van eerste schets tot sleuteloverdracht. Wij begeleiden u bij elke stap van uw bouwproject.',
  	\`services_source\` text DEFAULT 'auto',
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`link_text\` text DEFAULT 'Meer info',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_grid_order_idx\` ON \`pages_blocks_services_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_grid_parent_id_idx\` ON \`pages_blocks_services_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_grid_path_idx\` ON \`pages_blocks_services_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_projects_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading_badge\` text,
  	\`heading_title\` text DEFAULT 'Onze projecten',
  	\`heading_description\` text,
  	\`projects_source\` text DEFAULT 'auto',
  	\`category_id\` integer,
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`show_filter\` integer DEFAULT false,
  	\`cta_button_enabled\` integer DEFAULT false,
  	\`cta_button_text\` text DEFAULT 'Bekijk alle projecten',
  	\`cta_button_link\` text DEFAULT '/projecten',
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_projects_grid_order_idx\` ON \`pages_blocks_projects_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_projects_grid_parent_id_idx\` ON \`pages_blocks_projects_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_projects_grid_path_idx\` ON \`pages_blocks_projects_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_projects_grid_category_idx\` ON \`pages_blocks_projects_grid\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_reviews_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading_badge\` text,
  	\`heading_title\` text DEFAULT 'Wat onze klanten zeggen',
  	\`heading_description\` text,
  	\`reviews_source\` text DEFAULT 'featured',
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`layout\` text DEFAULT 'cards',
  	\`show_ratings\` integer DEFAULT true,
  	\`show_avatars\` integer DEFAULT true,
  	\`average_rating_enabled\` integer DEFAULT false,
  	\`average_rating_position\` text DEFAULT 'top',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_reviews_grid_order_idx\` ON \`pages_blocks_reviews_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_reviews_grid_parent_id_idx\` ON \`pages_blocks_reviews_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_reviews_grid_path_idx\` ON \`pages_blocks_reviews_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_stats_bar_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`icon\` text DEFAULT 'none',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_bar_stats_order_idx\` ON \`pages_blocks_stats_bar_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_bar_stats_parent_id_idx\` ON \`pages_blocks_stats_bar_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_stats_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'default',
  	\`layout\` text DEFAULT 'horizontal',
  	\`animate\` integer DEFAULT true,
  	\`dividers\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_bar_order_idx\` ON \`pages_blocks_stats_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_bar_parent_id_idx\` ON \`pages_blocks_stats_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_bar_path_idx\` ON \`pages_blocks_stats_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_banner_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`link\` text,
  	\`variant\` text DEFAULT 'primary',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_buttons_order_idx\` ON \`pages_blocks_cta_banner_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_buttons_parent_id_idx\` ON \`pages_blocks_cta_banner_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_banner_trust_elements_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'check',
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_trust_elements_items_order_idx\` ON \`pages_blocks_cta_banner_trust_elements_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_trust_elements_items_parent_id_idx\` ON \`pages_blocks_cta_banner_trust_elements_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'gradient',
  	\`background_image_id\` integer,
  	\`badge\` text,
  	\`title\` text,
  	\`description\` text,
  	\`trust_elements_enabled\` integer DEFAULT false,
  	\`alignment\` text DEFAULT 'center',
  	\`size\` text DEFAULT 'medium',
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_order_idx\` ON \`pages_blocks_cta_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_parent_id_idx\` ON \`pages_blocks_cta_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_path_idx\` ON \`pages_blocks_cta_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_banner_background_image_idx\` ON \`pages_blocks_cta_banner\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	\`product_categories_id\` integer,
  	\`cases_id\` integer,
  	\`blog_posts_id\` integer,
  	\`construction_services_id\` integer,
  	\`construction_projects_id\` integer,
  	\`construction_reviews_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_services_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_projects_id\`) REFERENCES \`construction_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_reviews_id\`) REFERENCES \`construction_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_products_id_idx\` ON \`pages_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_product_categories_id_idx\` ON \`pages_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_cases_id_idx\` ON \`pages_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_blog_posts_id_idx\` ON \`pages_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_construction_services_id_idx\` ON \`pages_rels\` (\`construction_services_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_construction_projects_id_idx\` ON \`pages_rels\` (\`construction_projects_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_construction_reviews_id_idx\` ON \`pages_rels\` (\`construction_reviews_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'announcement',
  	\`message\` text,
  	\`cta_text\` text,
  	\`cta_link\` text,
  	\`dismissible\` integer DEFAULT true,
  	\`dismissal_key\` text,
  	\`sticky\` integer DEFAULT false,
  	\`show_from\` text,
  	\`show_until\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_banner_order_idx\` ON \`_pages_v_blocks_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_banner_parent_id_idx\` ON \`_pages_v_blocks_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_banner_path_idx\` ON \`_pages_v_blocks_banner\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'md',
  	\`show_divider\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_spacer_order_idx\` ON \`_pages_v_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_spacer_parent_id_idx\` ON \`_pages_v_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_spacer_path_idx\` ON \`_pages_v_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	\`style\` text DEFAULT 'primary',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_buttons_order_idx\` ON \`_pages_v_blocks_hero_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_buttons_parent_id_idx\` ON \`_pages_v_blocks_hero_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`subtitle\` text,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'default',
  	\`background_style\` text DEFAULT 'gradient',
  	\`background_image_id\` integer,
  	\`background_color\` text DEFAULT 'navy',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_background_image_idx\` ON \`_pages_v_blocks_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`max_width\` text DEFAULT 'narrow',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_order_idx\` ON \`_pages_v_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_parent_id_idx\` ON \`_pages_v_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_path_idx\` ON \`_pages_v_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_block_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`variant\` text DEFAULT 'primary',
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_media_block\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_buttons_order_idx\` ON \`_pages_v_blocks_media_block_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_buttons_parent_id_idx\` ON \`_pages_v_blocks_media_block_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_type\` text DEFAULT 'image',
  	\`media_position\` text DEFAULT 'left',
  	\`media_id\` integer,
  	\`video_url\` text,
  	\`split\` text DEFAULT '50-50',
  	\`subtitle\` text,
  	\`title\` text,
  	\`content\` text,
  	\`background_color\` text DEFAULT 'white',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_order_idx\` ON \`_pages_v_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_parent_id_idx\` ON \`_pages_v_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_path_idx\` ON \`_pages_v_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_media_idx\` ON \`_pages_v_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_two_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`split\` text DEFAULT '50-50',
  	\`column_one\` text,
  	\`column_two\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_column_order_idx\` ON \`_pages_v_blocks_two_column\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_column_parent_id_idx\` ON \`_pages_v_blocks_two_column\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_column_path_idx\` ON \`_pages_v_blocks_two_column\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_product_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_label\` text,
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_product_grid_order_idx\` ON \`_pages_v_blocks_product_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_product_grid_parent_id_idx\` ON \`_pages_v_blocks_product_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_product_grid_path_idx\` ON \`_pages_v_blocks_product_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_product_grid_category_idx\` ON \`_pages_v_blocks_product_grid\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_product_grid_brand_idx\` ON \`_pages_v_blocks_product_grid\` (\`brand_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_label\` text,
  	\`heading\` text DEFAULT 'Onze categorieën',
  	\`intro\` text,
  	\`source\` text DEFAULT 'auto',
  	\`show_icon\` integer DEFAULT true,
  	\`show_product_count\` integer DEFAULT true,
  	\`layout\` text DEFAULT 'grid-3',
  	\`limit\` numeric DEFAULT 10,
  	\`show_quick_order_card\` integer DEFAULT false,
  	\`quick_order_link\` text DEFAULT '/quick-order',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_category_grid_order_idx\` ON \`_pages_v_blocks_category_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_category_grid_parent_id_idx\` ON \`_pages_v_blocks_category_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_category_grid_path_idx\` ON \`_pages_v_blocks_category_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_quick_order\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_quick_order_order_idx\` ON \`_pages_v_blocks_quick_order\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_quick_order_parent_id_idx\` ON \`_pages_v_blocks_quick_order\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_quick_order_path_idx\` ON \`_pages_v_blocks_quick_order\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	\`style\` text DEFAULT 'primary',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_buttons_order_idx\` ON \`_pages_v_blocks_cta_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_buttons_parent_id_idx\` ON \`_pages_v_blocks_cta_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'centered',
  	\`style\` text DEFAULT 'dark',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_calltoaction\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text,
  	\`button_link\` text,
  	\`background_color\` text DEFAULT 'grey',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_calltoaction_order_idx\` ON \`_pages_v_blocks_calltoaction\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_calltoaction_parent_id_idx\` ON \`_pages_v_blocks_calltoaction\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_calltoaction_path_idx\` ON \`_pages_v_blocks_calltoaction\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_opening_hours\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`day\` text,
  	\`hours\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_opening_hours_order_idx\` ON \`_pages_v_blocks_contact_opening_hours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_opening_hours_parent_id_idx\` ON \`_pages_v_blocks_contact_opening_hours\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Neem contact op',
  	\`subtitle\` text,
  	\`address_street\` text,
  	\`address_postal_code\` text,
  	\`address_city\` text,
  	\`phone\` text,
  	\`email\` text,
  	\`show_map\` integer DEFAULT true,
  	\`map_url\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_order_idx\` ON \`_pages_v_blocks_contact\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_parent_id_idx\` ON \`_pages_v_blocks_contact\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_path_idx\` ON \`_pages_v_blocks_contact\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Neem contact op',
  	\`description\` text,
  	\`show_phone\` integer DEFAULT true,
  	\`show_subject\` integer DEFAULT true,
  	\`submit_to\` text,
  	\`contact_info_phone\` text,
  	\`contact_info_email\` text,
  	\`contact_info_address\` text,
  	\`contact_info_hours\` text,
  	\`success_message\` text DEFAULT 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
  	\`error_message\` text DEFAULT 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_form_order_idx\` ON \`_pages_v_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_form_parent_id_idx\` ON \`_pages_v_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_form_path_idx\` ON \`_pages_v_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_newsletter\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Blijf op de hoogte',
  	\`button_label\` text DEFAULT 'Inschrijven',
  	\`description\` text,
  	\`placeholder\` text DEFAULT 'Je email adres...',
  	\`background_color\` text DEFAULT 'teal',
  	\`privacy_text\` text DEFAULT 'We respecteren je privacy. Geen spam.',
  	\`success_message\` text DEFAULT 'Bedankt voor je inschrijving! Check je inbox.',
  	\`error_message\` text DEFAULT 'Er ging iets mis. Probeer het opnieuw.',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_newsletter_order_idx\` ON \`_pages_v_blocks_newsletter\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_newsletter_parent_id_idx\` ON \`_pages_v_blocks_newsletter\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_newsletter_path_idx\` ON \`_pages_v_blocks_newsletter\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_features_order_idx\` ON \`_pages_v_blocks_features_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_features_parent_id_idx\` ON \`_pages_v_blocks_features_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'grid-3',
  	\`icon_style\` text DEFAULT 'glow',
  	\`alignment\` text DEFAULT 'center',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_order_idx\` ON \`_pages_v_blocks_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_parent_id_idx\` ON \`_pages_v_blocks_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_path_idx\` ON \`_pages_v_blocks_features\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`icon_color\` text DEFAULT 'teal',
  	\`title\` text,
  	\`description\` text,
  	\`link\` text,
  	\`link_text\` text DEFAULT 'Meer info',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_services_order_idx\` ON \`_pages_v_blocks_services_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_services_parent_id_idx\` ON \`_pages_v_blocks_services_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`subtitle\` text,
  	\`title\` text,
  	\`description\` text,
  	\`columns\` text DEFAULT '3',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_order_idx\` ON \`_pages_v_blocks_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_parent_id_idx\` ON \`_pages_v_blocks_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_path_idx\` ON \`_pages_v_blocks_services\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`author\` text,
  	\`role\` text,
  	\`avatar_id\` integer,
  	\`rating\` numeric DEFAULT 5,
  	\`_uuid\` text,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_testimonials_order_idx\` ON \`_pages_v_blocks_testimonials_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_testimonials_parent_id_idx\` ON \`_pages_v_blocks_testimonials_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_testimonials_avatar_idx\` ON \`_pages_v_blocks_testimonials_testimonials\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`variant\` text DEFAULT 'grid',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_order_idx\` ON \`_pages_v_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_parent_id_idx\` ON \`_pages_v_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_path_idx\` ON \`_pages_v_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cases\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cases_order_idx\` ON \`_pages_v_blocks_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cases_parent_id_idx\` ON \`_pages_v_blocks_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cases_path_idx\` ON \`_pages_v_blocks_cases\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_logo_bar_logos\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_bar_logos_order_idx\` ON \`_pages_v_blocks_logo_bar_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_bar_logos_parent_id_idx\` ON \`_pages_v_blocks_logo_bar_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_bar_logos_image_idx\` ON \`_pages_v_blocks_logo_bar_logos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_logo_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`auto_scroll\` integer DEFAULT false,
  	\`variant\` text DEFAULT 'light',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_bar_order_idx\` ON \`_pages_v_blocks_logo_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_bar_parent_id_idx\` ON \`_pages_v_blocks_logo_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_bar_path_idx\` ON \`_pages_v_blocks_logo_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_stats_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`value\` text,
  	\`label\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_stats_order_idx\` ON \`_pages_v_blocks_stats_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_stats_parent_id_idx\` ON \`_pages_v_blocks_stats_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`columns\` text DEFAULT '3',
  	\`description\` text,
  	\`background_color\` text DEFAULT 'white',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_order_idx\` ON \`_pages_v_blocks_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_parent_id_idx\` ON \`_pages_v_blocks_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_path_idx\` ON \`_pages_v_blocks_stats\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_faqs_order_idx\` ON \`_pages_v_blocks_faq_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_faqs_parent_id_idx\` ON \`_pages_v_blocks_faq_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`variant\` text DEFAULT 'single-column',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_order_idx\` ON \`_pages_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_parent_id_idx\` ON \`_pages_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_path_idx\` ON \`_pages_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`photo_id\` integer,
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`email\` text,
  	\`linkedin\` text,
  	\`twitter\` text,
  	\`github\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_members_order_idx\` ON \`_pages_v_blocks_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_members_parent_id_idx\` ON \`_pages_v_blocks_team_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_members_photo_idx\` ON \`_pages_v_blocks_team_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`subtitle\` text,
  	\`title\` text,
  	\`description\` text,
  	\`columns\` text DEFAULT '3',
  	\`photo_style\` text DEFAULT 'square',
  	\`background_color\` text DEFAULT 'bg',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_order_idx\` ON \`_pages_v_blocks_team\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_parent_id_idx\` ON \`_pages_v_blocks_team\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_path_idx\` ON \`_pages_v_blocks_team\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_accordion_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_items_order_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_items_parent_id_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_accordion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`allow_multiple\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_order_idx\` ON \`_pages_v_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_parent_id_idx\` ON \`_pages_v_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_path_idx\` ON \`_pages_v_blocks_accordion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_blog_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`columns\` text DEFAULT '3',
  	\`description\` text,
  	\`show_excerpt\` integer DEFAULT true,
  	\`show_read_time\` integer DEFAULT false,
  	\`show_category\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_blog_preview_order_idx\` ON \`_pages_v_blocks_blog_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_blog_preview_parent_id_idx\` ON \`_pages_v_blocks_blog_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_blog_preview_path_idx\` ON \`_pages_v_blocks_blog_preview\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`price\` text,
  	\`featured\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparison\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_columns_order_idx\` ON \`_pages_v_blocks_comparison_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_columns_parent_id_idx\` ON \`_pages_v_blocks_comparison_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_rows_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'text',
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparison_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_rows_values_order_idx\` ON \`_pages_v_blocks_comparison_rows_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_rows_values_parent_id_idx\` ON \`_pages_v_blocks_comparison_rows_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparison\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_rows_order_idx\` ON \`_pages_v_blocks_comparison_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_rows_parent_id_idx\` ON \`_pages_v_blocks_comparison_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_order_idx\` ON \`_pages_v_blocks_comparison\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_parent_id_idx\` ON \`_pages_v_blocks_comparison\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_path_idx\` ON \`_pages_v_blocks_comparison\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_infobox\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'info',
  	\`icon\` text,
  	\`title\` text,
  	\`description\` text,
  	\`dismissible\` integer DEFAULT false,
  	\`persistent\` integer DEFAULT false,
  	\`storage_key\` text,
  	\`max_width\` text DEFAULT 'wide',
  	\`margin_top\` text DEFAULT 'md',
  	\`margin_bottom\` text DEFAULT 'md',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_infobox_order_idx\` ON \`_pages_v_blocks_infobox\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_infobox_parent_id_idx\` ON \`_pages_v_blocks_infobox\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_infobox_path_idx\` ON \`_pages_v_blocks_infobox\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_image_gallery_images\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_gallery_images_order_idx\` ON \`_pages_v_blocks_image_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_gallery_images_parent_id_idx\` ON \`_pages_v_blocks_image_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_gallery_images_image_idx\` ON \`_pages_v_blocks_image_gallery_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_image_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`columns\` text DEFAULT '3',
  	\`aspect_ratio\` text DEFAULT '4-3',
  	\`enable_lightbox\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_gallery_order_idx\` ON \`_pages_v_blocks_image_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_gallery_parent_id_idx\` ON \`_pages_v_blocks_image_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_gallery_path_idx\` ON \`_pages_v_blocks_image_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`source\` text DEFAULT 'youtube',
  	\`aspect_ratio\` text DEFAULT '16-9',
  	\`youtube_url\` text,
  	\`vimeo_url\` text,
  	\`video_file_id\` integer,
  	\`poster_image_id\` integer,
  	\`caption\` text,
  	\`autoplay\` integer DEFAULT false,
  	\`controls\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`video_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_video_file_idx\` ON \`_pages_v_blocks_video\` (\`video_file_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_poster_image_idx\` ON \`_pages_v_blocks_video\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_code\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'typescript',
  	\`show_line_numbers\` integer DEFAULT true,
  	\`filename\` text,
  	\`code\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_order_idx\` ON \`_pages_v_blocks_code\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_parent_id_idx\` ON \`_pages_v_blocks_code\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_path_idx\` ON \`_pages_v_blocks_code\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_map\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_order_idx\` ON \`_pages_v_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_parent_id_idx\` ON \`_pages_v_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_path_idx\` ON \`_pages_v_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_construction_hero_avatars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`initials\` text,
  	\`color\` text DEFAULT 'teal',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_construction_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_avatars_order_idx\` ON \`_pages_v_blocks_construction_hero_avatars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_avatars_parent_id_idx\` ON \`_pages_v_blocks_construction_hero_avatars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_construction_hero_floating_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`subtitle\` text,
  	\`icon\` text,
  	\`color\` text DEFAULT 'green',
  	\`position\` text DEFAULT 'bottom-left',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_construction_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_floating_badges_order_idx\` ON \`_pages_v_blocks_construction_hero_floating_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_floating_badges_parent_id_idx\` ON \`_pages_v_blocks_construction_hero_floating_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_construction_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`badge\` text,
  	\`badge_icon\` text DEFAULT 'award',
  	\`title\` text,
  	\`description\` text,
  	\`primary_c_t_a_text\` text DEFAULT 'Gratis offerte aanvragen',
  	\`primary_c_t_a_icon\` text DEFAULT 'file-text',
  	\`primary_c_t_a_link\` text DEFAULT '/offerte-aanvragen',
  	\`secondary_c_t_a_text\` text DEFAULT 'Bekijk projecten',
  	\`secondary_c_t_a_icon\` text DEFAULT 'play-circle',
  	\`secondary_c_t_a_link\` text DEFAULT '/projecten',
  	\`trust_text\` text DEFAULT '500+ tevreden opdrachtgevers',
  	\`trust_subtext\` text DEFAULT 'Gemiddeld 4.9/5 beoordeeld',
  	\`hero_image_id\` integer,
  	\`hero_emoji\` text DEFAULT '🏗️',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_order_idx\` ON \`_pages_v_blocks_construction_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_parent_id_idx\` ON \`_pages_v_blocks_construction_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_path_idx\` ON \`_pages_v_blocks_construction_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_construction_hero_hero_image_idx\` ON \`_pages_v_blocks_construction_hero\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading_badge\` text DEFAULT 'Onze diensten',
  	\`heading_badge_icon\` text DEFAULT 'wrench',
  	\`heading_title\` text DEFAULT 'Alles onder één dak',
  	\`heading_description\` text DEFAULT 'Van eerste schets tot sleuteloverdracht. Wij begeleiden u bij elke stap van uw bouwproject.',
  	\`services_source\` text DEFAULT 'auto',
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`link_text\` text DEFAULT 'Meer info',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_grid_order_idx\` ON \`_pages_v_blocks_services_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_grid_parent_id_idx\` ON \`_pages_v_blocks_services_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_grid_path_idx\` ON \`_pages_v_blocks_services_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_projects_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading_badge\` text,
  	\`heading_title\` text DEFAULT 'Onze projecten',
  	\`heading_description\` text,
  	\`projects_source\` text DEFAULT 'auto',
  	\`category_id\` integer,
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`show_filter\` integer DEFAULT false,
  	\`cta_button_enabled\` integer DEFAULT false,
  	\`cta_button_text\` text DEFAULT 'Bekijk alle projecten',
  	\`cta_button_link\` text DEFAULT '/projecten',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_projects_grid_order_idx\` ON \`_pages_v_blocks_projects_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_projects_grid_parent_id_idx\` ON \`_pages_v_blocks_projects_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_projects_grid_path_idx\` ON \`_pages_v_blocks_projects_grid\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_projects_grid_category_idx\` ON \`_pages_v_blocks_projects_grid\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_reviews_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading_badge\` text,
  	\`heading_title\` text DEFAULT 'Wat onze klanten zeggen',
  	\`heading_description\` text,
  	\`reviews_source\` text DEFAULT 'featured',
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`layout\` text DEFAULT 'cards',
  	\`show_ratings\` integer DEFAULT true,
  	\`show_avatars\` integer DEFAULT true,
  	\`average_rating_enabled\` integer DEFAULT false,
  	\`average_rating_position\` text DEFAULT 'top',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_reviews_grid_order_idx\` ON \`_pages_v_blocks_reviews_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_reviews_grid_parent_id_idx\` ON \`_pages_v_blocks_reviews_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_reviews_grid_path_idx\` ON \`_pages_v_blocks_reviews_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_stats_bar_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`icon\` text DEFAULT 'none',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats_bar\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_bar_stats_order_idx\` ON \`_pages_v_blocks_stats_bar_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_bar_stats_parent_id_idx\` ON \`_pages_v_blocks_stats_bar_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_stats_bar\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'default',
  	\`layout\` text DEFAULT 'horizontal',
  	\`animate\` integer DEFAULT true,
  	\`dividers\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_bar_order_idx\` ON \`_pages_v_blocks_stats_bar\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_bar_parent_id_idx\` ON \`_pages_v_blocks_stats_bar\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_bar_path_idx\` ON \`_pages_v_blocks_stats_bar\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_banner_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`link\` text,
  	\`variant\` text DEFAULT 'primary',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_buttons_order_idx\` ON \`_pages_v_blocks_cta_banner_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_buttons_parent_id_idx\` ON \`_pages_v_blocks_cta_banner_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_banner_trust_elements_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'check',
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_trust_elements_items_order_idx\` ON \`_pages_v_blocks_cta_banner_trust_elements_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_trust_elements_items_parent_id_idx\` ON \`_pages_v_blocks_cta_banner_trust_elements_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'gradient',
  	\`background_image_id\` integer,
  	\`badge\` text,
  	\`title\` text,
  	\`description\` text,
  	\`trust_elements_enabled\` integer DEFAULT false,
  	\`alignment\` text DEFAULT 'center',
  	\`size\` text DEFAULT 'medium',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_order_idx\` ON \`_pages_v_blocks_cta_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_parent_id_idx\` ON \`_pages_v_blocks_cta_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_path_idx\` ON \`_pages_v_blocks_cta_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_banner_background_image_idx\` ON \`_pages_v_blocks_cta_banner\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	\`product_categories_id\` integer,
  	\`cases_id\` integer,
  	\`blog_posts_id\` integer,
  	\`construction_services_id\` integer,
  	\`construction_projects_id\` integer,
  	\`construction_reviews_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_services_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_projects_id\`) REFERENCES \`construction_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_reviews_id\`) REFERENCES \`construction_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_products_id_idx\` ON \`_pages_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_product_categories_id_idx\` ON \`_pages_v_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_cases_id_idx\` ON \`_pages_v_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_blog_posts_id_idx\` ON \`_pages_v_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_construction_services_id_idx\` ON \`_pages_v_rels\` (\`construction_services_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_construction_projects_id_idx\` ON \`_pages_v_rels\` (\`construction_projects_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_construction_reviews_id_idx\` ON \`_pages_v_rels\` (\`construction_reviews_id\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text,
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
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`partners\` (
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
  await db.run(sql`CREATE INDEX \`partners_logo_idx\` ON \`partners\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`partners_updated_at_idx\` ON \`partners\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`partners_created_at_idx\` ON \`partners\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
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
  await db.run(sql`CREATE INDEX \`services_icon_upload_idx\` ON \`services\` (\`icon_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`type\` text NOT NULL,
  	\`category\` text DEFAULT 'all' NOT NULL,
  	\`title\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`is_read\` integer DEFAULT false,
  	\`read_at\` text,
  	\`related_order_id\` integer,
  	\`related_product_id\` integer,
  	\`related_invoice_id\` integer,
  	\`related_recurring_order_id\` integer,
  	\`related_return_id\` integer,
  	\`action_url\` text,
  	\`action_label\` text,
  	\`icon\` text DEFAULT 'bell',
  	\`icon_color\` text DEFAULT 'teal',
  	\`priority\` text DEFAULT 'normal',
  	\`expires_at\` text,
  	\`send_email\` integer DEFAULT false,
  	\`email_sent\` integer DEFAULT false,
  	\`email_sent_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_invoice_id\`) REFERENCES \`invoices\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_recurring_order_id\`) REFERENCES \`recurring_orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_return_id\`) REFERENCES \`returns\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`notifications_user_idx\` ON \`notifications\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`notifications_related_order_idx\` ON \`notifications\` (\`related_order_id\`);`)
  await db.run(sql`CREATE INDEX \`notifications_related_product_idx\` ON \`notifications\` (\`related_product_id\`);`)
  await db.run(sql`CREATE INDEX \`notifications_related_invoice_idx\` ON \`notifications\` (\`related_invoice_id\`);`)
  await db.run(sql`CREATE INDEX \`notifications_related_recurring_order_idx\` ON \`notifications\` (\`related_recurring_order_id\`);`)
  await db.run(sql`CREATE INDEX \`notifications_related_return_idx\` ON \`notifications\` (\`related_return_id\`);`)
  await db.run(sql`CREATE INDEX \`notifications_updated_at_idx\` ON \`notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`notifications_created_at_idx\` ON \`notifications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`themes_custom_colors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`token_name\` text NOT NULL,
  	\`token_value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`themes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`themes_custom_colors_order_idx\` ON \`themes_custom_colors\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`themes_custom_colors_parent_id_idx\` ON \`themes_custom_colors\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`themes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`icon\` text,
  	\`is_default\` integer DEFAULT false,
  	\`primary_color\` text,
  	\`primary_color_light\` text,
  	\`primary_color_dark\` text,
  	\`dark_surface\` text,
  	\`dark_surface_light\` text,
  	\`body_font\` text,
  	\`heading_font\` text,
  	\`primary_gradient\` text,
  	\`hero_gradient\` text,
  	\`border_radius_sm\` numeric,
  	\`border_radius_md\` numeric,
  	\`template_count\` numeric,
  	\`unique_component_count\` numeric,
  	\`status\` text DEFAULT 'active',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`themes_slug_idx\` ON \`themes\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`themes_updated_at_idx\` ON \`themes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`themes_created_at_idx\` ON \`themes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_tags_order_idx\` ON \`products_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_tags_parent_id_idx\` ON \`products_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_group_prices\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group_id\` integer NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`min_quantity\` numeric DEFAULT 1,
  	FOREIGN KEY (\`group_id\`) REFERENCES \`customer_groups\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_group_prices_order_idx\` ON \`products_group_prices\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_group_prices_parent_id_idx\` ON \`products_group_prices\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_group_prices_group_idx\` ON \`products_group_prices\` (\`group_id\`);`)
  await db.run(sql`CREATE TABLE \`products_volume_pricing\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`min_quantity\` numeric NOT NULL,
  	\`max_quantity\` numeric,
  	\`price\` numeric NOT NULL,
  	\`discount_percentage\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_volume_pricing_order_idx\` ON \`products_volume_pricing\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_volume_pricing_parent_id_idx\` ON \`products_volume_pricing\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	\`platform\` text DEFAULT 'youtube',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_videos_order_idx\` ON \`products_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_videos_parent_id_idx\` ON \`products_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_child_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer,
  	\`sort_order\` numeric DEFAULT 0,
  	\`is_default\` integer DEFAULT false,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_child_products_order_idx\` ON \`products_child_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_child_products_parent_id_idx\` ON \`products_child_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_child_products_product_idx\` ON \`products_child_products\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE \`products_meta_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_meta_keywords_order_idx\` ON \`products_meta_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_meta_keywords_parent_id_idx\` ON \`products_meta_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_specifications_attributes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`value\` text NOT NULL,
  	\`unit\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_specifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_specifications_attributes_order_idx\` ON \`products_specifications_attributes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_specifications_attributes_parent_id_idx\` ON \`products_specifications_attributes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_specifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_specifications_order_idx\` ON \`products_specifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_specifications_parent_id_idx\` ON \`products_specifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_variant_options_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`price_modifier\` numeric,
  	\`stock_level\` numeric,
  	\`color_code\` text,
  	\`image_id\` integer,
  	\`subscription_type\` text,
  	\`issues\` numeric,
  	\`discount_percentage\` numeric,
  	\`auto_renew\` integer DEFAULT false,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_variant_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_variant_options_values_order_idx\` ON \`products_variant_options_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_variant_options_values_parent_id_idx\` ON \`products_variant_options_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_variant_options_values_image_idx\` ON \`products_variant_options_values\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products_variant_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`option_name\` text,
  	\`display_type\` text DEFAULT 'sizeRadio',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_variant_options_order_idx\` ON \`products_variant_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_variant_options_parent_id_idx\` ON \`products_variant_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_mix_match_config_box_sizes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`item_count\` numeric,
  	\`price\` numeric,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_mix_match_config_box_sizes_order_idx\` ON \`products_mix_match_config_box_sizes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_mix_match_config_box_sizes_parent_id_idx\` ON \`products_mix_match_config_box_sizes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`magazine_title\` text,
  	\`product_type\` text DEFAULT 'simple' NOT NULL,
  	\`is_subscription\` integer DEFAULT false,
  	\`sku\` text,
  	\`ean\` text,
  	\`mpn\` text,
  	\`short_description\` text,
  	\`description\` text,
  	\`brand_id\` integer,
  	\`manufacturer\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`condition\` text DEFAULT 'new',
  	\`warranty\` text,
  	\`release_date\` text,
  	\`badge\` text DEFAULT 'none',
  	\`price\` numeric NOT NULL,
  	\`sale_price\` numeric,
  	\`compare_at_price\` numeric,
  	\`cost_price\` numeric,
  	\`msrp\` numeric,
  	\`tax_class\` text DEFAULT 'standard',
  	\`includes_tax\` integer DEFAULT false,
  	\`track_stock\` integer DEFAULT true,
  	\`stock\` numeric DEFAULT 0,
  	\`stock_status\` text DEFAULT 'in-stock',
  	\`low_stock_threshold\` numeric DEFAULT 5,
  	\`backorders_allowed\` integer DEFAULT false,
  	\`availability_date\` text,
  	\`weight\` numeric,
  	\`weight_unit\` text DEFAULT 'kg',
  	\`dimensions_length\` numeric,
  	\`dimensions_width\` numeric,
  	\`dimensions_height\` numeric,
  	\`shipping_class\` text,
  	\`free_shipping\` integer DEFAULT false,
  	\`min_order_quantity\` numeric,
  	\`max_order_quantity\` numeric,
  	\`order_multiple\` numeric,
  	\`lead_time\` numeric,
  	\`customizable\` integer DEFAULT false,
  	\`quotation_required\` integer DEFAULT false,
  	\`contract_pricing\` integer DEFAULT false,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`configurator_settings_show_config_summary\` integer DEFAULT true,
  	\`configurator_settings_show_price_breakdown\` integer DEFAULT true,
  	\`mix_match_config_discount_percentage\` numeric DEFAULT 20,
  	\`mix_match_config_show_progress_bar\` integer DEFAULT true,
  	\`mix_match_config_show_category_filters\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_sku_idx\` ON \`products\` (\`sku\`);`)
  await db.run(sql`CREATE INDEX \`products_brand_idx\` ON \`products\` (\`brand_id\`);`)
  await db.run(sql`CREATE INDEX \`products_meta_meta_image_idx\` ON \`products\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`product_categories_id\` integer,
  	\`media_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_product_categories_id_idx\` ON \`products_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_media_id_idx\` ON \`products_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_products_id_idx\` ON \`products_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`product_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`parent_id\` integer,
  	\`image_id\` integer,
  	\`level\` numeric DEFAULT 0,
  	\`order\` numeric DEFAULT 0,
  	\`visible\` integer DEFAULT true,
  	\`icon\` text,
  	\`show_in_navigation\` integer DEFAULT true,
  	\`navigation_order\` numeric DEFAULT 0,
  	\`promo_banner_enabled\` integer DEFAULT false,
  	\`promo_banner_title\` text,
  	\`promo_banner_subtitle\` text,
  	\`promo_banner_image_id\` integer,
  	\`promo_banner_button_text\` text,
  	\`promo_banner_button_link\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`promo_banner_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`product_categories_slug_idx\` ON \`product_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_parent_idx\` ON \`product_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_image_idx\` ON \`product_categories\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_promo_banner_promo_banner_image_idx\` ON \`product_categories\` (\`promo_banner_image_id\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_updated_at_idx\` ON \`product_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_created_at_idx\` ON \`product_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`brands\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`brands_slug_idx\` ON \`brands\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`brands_logo_idx\` ON \`brands\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`brands_meta_meta_image_idx\` ON \`brands\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`brands_updated_at_idx\` ON \`brands\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`brands_created_at_idx\` ON \`brands\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`recently_viewed\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer,
  	\`session_id\` text,
  	\`product_id\` integer NOT NULL,
  	\`viewed_at\` text NOT NULL,
  	\`product_snapshot_title\` text,
  	\`product_snapshot_slug\` text,
  	\`product_snapshot_sku\` text,
  	\`product_snapshot_price\` numeric,
  	\`product_snapshot_image_url\` text,
  	\`product_snapshot_brand\` text,
  	\`referrer\` text,
  	\`source\` text,
  	\`device\` text,
  	\`time_on_page\` numeric,
  	\`scroll_depth\` numeric,
  	\`added_to_cart\` integer DEFAULT false,
  	\`added_to_favorites\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`recently_viewed_user_idx\` ON \`recently_viewed\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`recently_viewed_product_idx\` ON \`recently_viewed\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`recently_viewed_updated_at_idx\` ON \`recently_viewed\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`recently_viewed_created_at_idx\` ON \`recently_viewed\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`edition_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`user_id\` integer,
  	\`magazine_title\` text NOT NULL,
  	\`product_id\` integer,
  	\`active\` integer DEFAULT true,
  	\`last_notified\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`edition_notifications_user_idx\` ON \`edition_notifications\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`edition_notifications_product_idx\` ON \`edition_notifications\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`edition_notifications_updated_at_idx\` ON \`edition_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`edition_notifications_created_at_idx\` ON \`edition_notifications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`customer_groups\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`customer_groups_name_idx\` ON \`customer_groups\` (\`name\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`customer_groups_slug_idx\` ON \`customer_groups\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`customer_groups_updated_at_idx\` ON \`customer_groups\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`customer_groups_created_at_idx\` ON \`customer_groups\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`orders_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`sku\` text,
  	\`ean\` text,
  	\`parent_product_id\` text,
  	\`parent_product_title\` text,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`subtotal\` numeric,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_items_order_idx\` ON \`orders_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_parent_id_idx\` ON \`orders_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_product_idx\` ON \`orders_items\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE \`orders_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`event\` text NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`timestamp\` text NOT NULL,
  	\`location\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_timeline_order_idx\` ON \`orders_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`orders_timeline_parent_id_idx\` ON \`orders_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`orders\` (
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
  	\`shipping_provider\` text,
  	\`tracking_code\` text,
  	\`tracking_url\` text,
  	\`shipping_method\` text DEFAULT 'standard',
  	\`expected_delivery_date\` text,
  	\`actual_delivery_date\` text,
  	\`notes\` text,
  	\`invoice_p_d_f_id\` integer,
  	\`invoice_number\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`invoice_p_d_f_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`orders_order_number_idx\` ON \`orders\` (\`order_number\`);`)
  await db.run(sql`CREATE INDEX \`orders_customer_idx\` ON \`orders\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_invoice_p_d_f_idx\` ON \`orders\` (\`invoice_p_d_f_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`order_lists_items\` (
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
  await db.run(sql`CREATE INDEX \`order_lists_items_order_idx\` ON \`order_lists_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`order_lists_items_parent_id_idx\` ON \`order_lists_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`order_lists_items_product_idx\` ON \`order_lists_items\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE \`order_lists_share_with\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`can_edit\` integer DEFAULT false,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`order_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`order_lists_share_with_order_idx\` ON \`order_lists_share_with\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`order_lists_share_with_parent_id_idx\` ON \`order_lists_share_with\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`order_lists_share_with_user_idx\` ON \`order_lists_share_with\` (\`user_id\`);`)
  await db.run(sql`CREATE TABLE \`order_lists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`icon\` text DEFAULT 'clipboard-list',
  	\`color\` text DEFAULT 'teal',
  	\`is_pinned\` integer DEFAULT false,
  	\`owner_id\` integer NOT NULL,
  	\`is_default\` integer DEFAULT false,
  	\`item_count\` numeric,
  	\`description\` text,
  	\`notes\` text,
  	\`last_ordered_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`order_lists_owner_idx\` ON \`order_lists\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`order_lists_updated_at_idx\` ON \`order_lists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`order_lists_created_at_idx\` ON \`order_lists\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`recurring_orders_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`title\` text,
  	\`sku\` text,
  	\`brand\` text,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`line_total\` numeric,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`recurring_orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`recurring_orders_items_order_idx\` ON \`recurring_orders_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_items_parent_id_idx\` ON \`recurring_orders_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_items_product_idx\` ON \`recurring_orders_items\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE \`recurring_orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reference_number\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`customer_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`frequency_value\` numeric DEFAULT 1 NOT NULL,
  	\`frequency_unit\` text DEFAULT 'weeks' NOT NULL,
  	\`frequency_display_text\` text,
  	\`next_delivery_date\` text NOT NULL,
  	\`last_delivery_date\` text,
  	\`start_date\` text NOT NULL,
  	\`end_date\` text,
  	\`paused_date\` text,
  	\`estimated_total\` numeric NOT NULL,
  	\`delivery_count\` numeric DEFAULT 0,
  	\`total_spent\` numeric DEFAULT 0,
  	\`savings_per_delivery\` numeric DEFAULT 0,
  	\`shipping_address_name\` text NOT NULL,
  	\`shipping_address_company\` text,
  	\`shipping_address_street\` text NOT NULL,
  	\`shipping_address_house_number\` text NOT NULL,
  	\`shipping_address_postal_code\` text NOT NULL,
  	\`shipping_address_city\` text NOT NULL,
  	\`shipping_address_country\` text DEFAULT 'Nederland',
  	\`payment_method\` text,
  	\`notes\` text,
  	\`notify_before_delivery\` integer DEFAULT true,
  	\`notify_days_before\` numeric DEFAULT 2,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`recurring_orders_reference_number_idx\` ON \`recurring_orders\` (\`reference_number\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_customer_idx\` ON \`recurring_orders\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_updated_at_idx\` ON \`recurring_orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_created_at_idx\` ON \`recurring_orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`recurring_orders_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`orders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`recurring_orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`recurring_orders_rels_order_idx\` ON \`recurring_orders_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_rels_parent_idx\` ON \`recurring_orders_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_rels_path_idx\` ON \`recurring_orders_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`recurring_orders_rels_orders_id_idx\` ON \`recurring_orders_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE TABLE \`invoices_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`description\` text NOT NULL,
  	\`sku\` text,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	\`unit_price\` numeric NOT NULL,
  	\`line_total\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`invoices\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`invoices_items_order_idx\` ON \`invoices_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`invoices_items_parent_id_idx\` ON \`invoices_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`invoices\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`invoice_number\` text NOT NULL,
  	\`order_id\` integer NOT NULL,
  	\`customer_id\` integer NOT NULL,
  	\`invoice_date\` text NOT NULL,
  	\`due_date\` text NOT NULL,
  	\`payment_date\` text,
  	\`subtotal\` numeric NOT NULL,
  	\`tax\` numeric DEFAULT 0,
  	\`shipping_cost\` numeric DEFAULT 0,
  	\`discount\` numeric DEFAULT 0,
  	\`amount\` numeric NOT NULL,
  	\`status\` text DEFAULT 'open' NOT NULL,
  	\`payment_method\` text,
  	\`payment_reference\` text,
  	\`pdf_file_id\` integer,
  	\`notes\` text,
  	\`reminders_sent\` numeric DEFAULT 0,
  	\`last_reminder_date\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`pdf_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`invoices_invoice_number_idx\` ON \`invoices\` (\`invoice_number\`);`)
  await db.run(sql`CREATE INDEX \`invoices_order_idx\` ON \`invoices\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`invoices_customer_idx\` ON \`invoices\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`invoices_pdf_file_idx\` ON \`invoices\` (\`pdf_file_id\`);`)
  await db.run(sql`CREATE INDEX \`invoices_updated_at_idx\` ON \`invoices\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`invoices_created_at_idx\` ON \`invoices\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`returns_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer,
  	\`title\` text NOT NULL,
  	\`sku\` text,
  	\`brand\` text,
  	\`unit_price\` numeric NOT NULL,
  	\`quantity_ordered\` numeric NOT NULL,
  	\`quantity_returning\` numeric NOT NULL,
  	\`is_returnable\` integer DEFAULT true,
  	\`return_value\` numeric,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`returns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`returns_items_order_idx\` ON \`returns_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`returns_items_parent_id_idx\` ON \`returns_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`returns_items_product_idx\` ON \`returns_items\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE \`returns\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`rma_number\` text NOT NULL,
  	\`order_id\` integer NOT NULL,
  	\`customer_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`return_deadline\` text,
  	\`received_date\` text,
  	\`processed_date\` text,
  	\`return_reason\` text NOT NULL,
  	\`reason_description\` text,
  	\`product_condition\` text NOT NULL,
  	\`preferred_resolution\` text NOT NULL,
  	\`return_shipping_tracking_code\` text,
  	\`return_shipping_tracking_url\` text,
  	\`return_shipping_return_label_generated\` integer DEFAULT false,
  	\`return_shipping_return_label_sent_date\` text,
  	\`return_shipping_shipping_cost_refund\` numeric DEFAULT 0,
  	\`return_value\` numeric NOT NULL,
  	\`refund_amount\` numeric DEFAULT 0,
  	\`refund_date\` text,
  	\`refund_method\` text,
  	\`inspection_notes\` text,
  	\`internal_notes\` text,
  	\`approval_date\` text,
  	\`rejection_reason\` text,
  	\`replacement_order_id\` integer,
  	\`store_credit_amount\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`replacement_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`returns_rma_number_idx\` ON \`returns\` (\`rma_number\`);`)
  await db.run(sql`CREATE INDEX \`returns_order_idx\` ON \`returns\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`returns_customer_idx\` ON \`returns\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`returns_replacement_order_idx\` ON \`returns\` (\`replacement_order_id\`);`)
  await db.run(sql`CREATE INDEX \`returns_updated_at_idx\` ON \`returns\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`returns_created_at_idx\` ON \`returns\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`returns_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`returns\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`returns_rels_order_idx\` ON \`returns_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`returns_rels_parent_idx\` ON \`returns_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`returns_rels_path_idx\` ON \`returns_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`returns_rels_media_id_idx\` ON \`returns_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`subscription_plans_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text NOT NULL,
  	\`included\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`subscription_plans\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`subscription_plans_features_order_idx\` ON \`subscription_plans_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`subscription_plans_features_parent_id_idx\` ON \`subscription_plans_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`subscription_plans\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`price\` numeric NOT NULL,
  	\`price_per_user\` numeric,
  	\`billing_interval\` text DEFAULT 'monthly' NOT NULL,
  	\`limits_users\` numeric,
  	\`limits_storage\` numeric,
  	\`limits_api_calls\` numeric,
  	\`active\` integer DEFAULT true,
  	\`featured\` integer DEFAULT false,
  	\`allows_premium_content\` integer DEFAULT false,
  	\`tier\` text DEFAULT 'free',
  	\`stripe_product_id\` text,
  	\`stripe_price_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`subscription_plans_slug_idx\` ON \`subscription_plans\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`subscription_plans_updated_at_idx\` ON \`subscription_plans\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`subscription_plans_created_at_idx\` ON \`subscription_plans\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`user_subscriptions_addons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`added_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`user_subscriptions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`user_subscriptions_addons_order_idx\` ON \`user_subscriptions_addons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`user_subscriptions_addons_parent_id_idx\` ON \`user_subscriptions_addons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`user_subscriptions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`plan_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`start_date\` text NOT NULL,
  	\`current_period_start\` text NOT NULL,
  	\`current_period_end\` text NOT NULL,
  	\`cancel_at_period_end\` integer DEFAULT false,
  	\`canceled_at\` text,
  	\`usage_users\` numeric DEFAULT 1,
  	\`usage_storage\` numeric DEFAULT 0,
  	\`usage_api_calls\` numeric DEFAULT 0,
  	\`stripe_subscription_id\` text,
  	\`stripe_customer_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`plan_id\`) REFERENCES \`subscription_plans\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`user_subscriptions_user_idx\` ON \`user_subscriptions\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`user_subscriptions_plan_idx\` ON \`user_subscriptions\` (\`plan_id\`);`)
  await db.run(sql`CREATE INDEX \`user_subscriptions_updated_at_idx\` ON \`user_subscriptions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`user_subscriptions_created_at_idx\` ON \`user_subscriptions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payment_methods\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`type\` text NOT NULL,
  	\`is_default\` integer DEFAULT false,
  	\`sepa_account_holder_name\` text,
  	\`sepa_iban\` text,
  	\`sepa_bank_name\` text,
  	\`card_brand\` text,
  	\`card_last4\` text,
  	\`card_expiry_month\` numeric,
  	\`card_expiry_year\` numeric,
  	\`stripe_payment_method_id\` text,
  	\`last4\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`payment_methods_user_idx\` ON \`payment_methods\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`payment_methods_updated_at_idx\` ON \`payment_methods\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payment_methods_created_at_idx\` ON \`payment_methods\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`gift_vouchers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`code\` text NOT NULL,
  	\`amount\` numeric NOT NULL,
  	\`balance\` numeric NOT NULL,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`occasion\` text DEFAULT 'universal',
  	\`recipient_name\` text,
  	\`recipient_email\` text NOT NULL,
  	\`sender_name\` text,
  	\`sender_email\` text,
  	\`message\` text,
  	\`delivery_method\` text DEFAULT 'email' NOT NULL,
  	\`scheduled_delivery\` text,
  	\`sent_at\` text,
  	\`expires_at\` text,
  	\`purchased_by_id\` integer,
  	\`redeemed_by_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`purchased_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`redeemed_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`gift_vouchers_code_idx\` ON \`gift_vouchers\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`gift_vouchers_purchased_by_idx\` ON \`gift_vouchers\` (\`purchased_by_id\`);`)
  await db.run(sql`CREATE INDEX \`gift_vouchers_redeemed_by_idx\` ON \`gift_vouchers\` (\`redeemed_by_id\`);`)
  await db.run(sql`CREATE INDEX \`gift_vouchers_updated_at_idx\` ON \`gift_vouchers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gift_vouchers_created_at_idx\` ON \`gift_vouchers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`licenses_downloads\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`version\` text NOT NULL,
  	\`downloaded_at\` text NOT NULL,
  	\`file_size\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`licenses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`licenses_downloads_order_idx\` ON \`licenses_downloads\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`licenses_downloads_parent_id_idx\` ON \`licenses_downloads\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`licenses\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`product_id\` integer,
  	\`product_name\` text NOT NULL,
  	\`license_key\` text NOT NULL,
  	\`type\` text DEFAULT 'personal' NOT NULL,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`max_activations\` numeric DEFAULT 1,
  	\`current_activations\` numeric DEFAULT 0,
  	\`version\` text,
  	\`purchased_at\` text NOT NULL,
  	\`expires_at\` text,
  	\`order_id\` integer,
  	\`download_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`licenses_user_idx\` ON \`licenses\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`licenses_product_idx\` ON \`licenses\` (\`product_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`licenses_license_key_idx\` ON \`licenses\` (\`license_key\`);`)
  await db.run(sql`CREATE INDEX \`licenses_order_idx\` ON \`licenses\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`licenses_updated_at_idx\` ON \`licenses\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`licenses_created_at_idx\` ON \`licenses\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`license_activations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`license_id\` integer NOT NULL,
  	\`device_name\` text NOT NULL,
  	\`device_id\` text NOT NULL,
  	\`os\` text,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`activated_at\` text NOT NULL,
  	\`deactivated_at\` text,
  	\`last_seen_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`license_id\`) REFERENCES \`licenses\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`license_activations_license_idx\` ON \`license_activations\` (\`license_id\`);`)
  await db.run(sql`CREATE INDEX \`license_activations_updated_at_idx\` ON \`license_activations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`license_activations_created_at_idx\` ON \`license_activations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`loyalty_tiers_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`benefit\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`loyalty_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`loyalty_tiers_benefits_order_idx\` ON \`loyalty_tiers_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_tiers_benefits_parent_id_idx\` ON \`loyalty_tiers_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`loyalty_tiers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`icon\` text,
  	\`color\` text,
  	\`min_points\` numeric NOT NULL,
  	\`multiplier\` numeric DEFAULT 1 NOT NULL,
  	\`free_shipping\` integer DEFAULT false,
  	\`priority_support\` integer DEFAULT false,
  	\`early_access\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0 NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`loyalty_tiers_slug_idx\` ON \`loyalty_tiers\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_tiers_updated_at_idx\` ON \`loyalty_tiers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_tiers_created_at_idx\` ON \`loyalty_tiers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`loyalty_rewards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`icon\` text,
  	\`type\` text DEFAULT 'discount' NOT NULL,
  	\`points_cost\` numeric NOT NULL,
  	\`value\` numeric,
  	\`active\` integer DEFAULT true,
  	\`stock\` numeric,
  	\`tier_required_id\` integer,
  	\`expiry_days\` numeric,
  	\`terms\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`tier_required_id\`) REFERENCES \`loyalty_tiers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`loyalty_rewards_tier_required_idx\` ON \`loyalty_rewards\` (\`tier_required_id\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_rewards_updated_at_idx\` ON \`loyalty_rewards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_rewards_created_at_idx\` ON \`loyalty_rewards\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`loyalty_points\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`available_points\` numeric DEFAULT 0 NOT NULL,
  	\`total_earned\` numeric DEFAULT 0 NOT NULL,
  	\`total_spent\` numeric DEFAULT 0 NOT NULL,
  	\`tier_id\` integer,
  	\`stats_total_orders\` numeric DEFAULT 0,
  	\`stats_total_spent_money\` numeric DEFAULT 0,
  	\`stats_rewards_redeemed\` numeric DEFAULT 0,
  	\`stats_referrals\` numeric DEFAULT 0,
  	\`referral_code\` text,
  	\`member_since\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`tier_id\`) REFERENCES \`loyalty_tiers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`loyalty_points_user_idx\` ON \`loyalty_points\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_points_tier_idx\` ON \`loyalty_points\` (\`tier_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`loyalty_points_referral_code_idx\` ON \`loyalty_points\` (\`referral_code\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_points_updated_at_idx\` ON \`loyalty_points\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_points_created_at_idx\` ON \`loyalty_points\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`loyalty_transactions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`type\` text NOT NULL,
  	\`points\` numeric NOT NULL,
  	\`description\` text NOT NULL,
  	\`related_order_id\` integer,
  	\`related_reward_id\` integer,
  	\`metadata\` text,
  	\`expires_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_reward_id\`) REFERENCES \`loyalty_rewards\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`loyalty_transactions_user_idx\` ON \`loyalty_transactions\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_transactions_related_order_idx\` ON \`loyalty_transactions\` (\`related_order_id\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_transactions_related_reward_idx\` ON \`loyalty_transactions\` (\`related_reward_id\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_transactions_updated_at_idx\` ON \`loyalty_transactions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_transactions_created_at_idx\` ON \`loyalty_transactions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`loyalty_redemptions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`reward_id\` integer NOT NULL,
  	\`points_spent\` numeric NOT NULL,
  	\`status\` text DEFAULT 'available' NOT NULL,
  	\`redeemed_at\` text NOT NULL,
  	\`used_at\` text,
  	\`expires_at\` text,
  	\`code\` text,
  	\`used_in_order_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`reward_id\`) REFERENCES \`loyalty_rewards\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`used_in_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`loyalty_redemptions_user_idx\` ON \`loyalty_redemptions\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_redemptions_reward_idx\` ON \`loyalty_redemptions\` (\`reward_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`loyalty_redemptions_code_idx\` ON \`loyalty_redemptions\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_redemptions_used_in_order_idx\` ON \`loyalty_redemptions\` (\`used_in_order_id\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_redemptions_updated_at_idx\` ON \`loyalty_redemptions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`loyalty_redemptions_created_at_idx\` ON \`loyalty_redemptions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`ab_tests_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`description\` text,
  	\`distribution\` numeric DEFAULT 50 NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ab_tests\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ab_tests_variants_order_idx\` ON \`ab_tests_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ab_tests_variants_parent_id_idx\` ON \`ab_tests_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ab_tests\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`target_page\` text NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`start_date\` text,
  	\`end_date\` text,
  	\`winner\` text,
  	\`total_participants\` numeric DEFAULT 0,
  	\`total_conversions\` numeric DEFAULT 0,
  	\`auto_winner_enabled\` integer DEFAULT true,
  	\`auto_winner_conversion_threshold\` numeric DEFAULT 100,
  	\`auto_winner_confidence_level\` numeric DEFAULT 95,
  	\`client_id\` integer,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ab_tests_client_idx\` ON \`ab_tests\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX \`ab_tests_updated_at_idx\` ON \`ab_tests\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ab_tests_created_at_idx\` ON \`ab_tests\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`ab_test_results\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`test_id\` integer NOT NULL,
  	\`variant\` text NOT NULL,
  	\`user_id_id\` integer,
  	\`session_id\` text,
  	\`converted\` integer DEFAULT false,
  	\`conversion_value\` numeric,
  	\`converted_at\` text,
  	\`order_id\` integer,
  	\`user_agent\` text,
  	\`referrer\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`test_id\`) REFERENCES \`ab_tests\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`user_id_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ab_test_results_test_idx\` ON \`ab_test_results\` (\`test_id\`);`)
  await db.run(sql`CREATE INDEX \`ab_test_results_user_id_idx\` ON \`ab_test_results\` (\`user_id_id\`);`)
  await db.run(sql`CREATE INDEX \`ab_test_results_order_idx\` ON \`ab_test_results\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`ab_test_results_updated_at_idx\` ON \`ab_test_results\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ab_test_results_created_at_idx\` ON \`ab_test_results\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`test_sessionId_idx\` ON \`ab_test_results\` (\`test_id\`,\`session_id\`);`)
  await db.run(sql`CREATE INDEX \`test_userId_idx\` ON \`ab_test_results\` (\`test_id\`,\`user_id_id\`);`)
  await db.run(sql`CREATE INDEX \`test_variant_idx\` ON \`ab_test_results\` (\`test_id\`,\`variant\`);`)
  await db.run(sql`CREATE INDEX \`converted_idx\` ON \`ab_test_results\` (\`converted\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_posts_tags_order_idx\` ON \`blog_posts_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_tags_parent_id_idx\` ON \`blog_posts_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_posts_faq_order_idx\` ON \`blog_posts_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_faq_parent_id_idx\` ON \`blog_posts_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`featured_image_id\` integer,
  	\`featured_image_emoji\` text,
  	\`featured_tag\` text DEFAULT 'none',
  	\`content\` text,
  	\`author_id\` integer,
  	\`author_bio\` text,
  	\`reading_time\` numeric,
  	\`view_count\` numeric DEFAULT 0,
  	\`featured\` integer DEFAULT false,
  	\`template\` text DEFAULT 'blogtemplate1',
  	\`content_type\` text DEFAULT 'article',
  	\`content_access_access_level\` text DEFAULT 'free',
  	\`content_access_preview_length\` numeric DEFAULT 200,
  	\`content_access_lock_message\` text,
  	\`enable_t_o_c\` integer DEFAULT true,
  	\`enable_share\` integer DEFAULT true,
  	\`enable_comments\` integer DEFAULT false,
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
  await db.run(sql`CREATE UNIQUE INDEX \`blog_posts_slug_idx\` ON \`blog_posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_featured_image_idx\` ON \`blog_posts\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_author_idx\` ON \`blog_posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_meta_meta_image_idx\` ON \`blog_posts\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_updated_at_idx\` ON \`blog_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_created_at_idx\` ON \`blog_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts__status_idx\` ON \`blog_posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`blog_categories_id\` integer,
  	\`products_id\` integer,
  	\`blog_posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_categories_id\`) REFERENCES \`blog_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_order_idx\` ON \`blog_posts_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_parent_idx\` ON \`blog_posts_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_path_idx\` ON \`blog_posts_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_blog_categories_id_idx\` ON \`blog_posts_rels\` (\`blog_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_products_id_idx\` ON \`blog_posts_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_blog_posts_id_idx\` ON \`blog_posts_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE TABLE \`_blog_posts_v_version_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_blog_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_tags_order_idx\` ON \`_blog_posts_v_version_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_tags_parent_id_idx\` ON \`_blog_posts_v_version_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_blog_posts_v_version_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_blog_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_faq_order_idx\` ON \`_blog_posts_v_version_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_faq_parent_id_idx\` ON \`_blog_posts_v_version_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_blog_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_featured_image_id\` integer,
  	\`version_featured_image_emoji\` text,
  	\`version_featured_tag\` text DEFAULT 'none',
  	\`version_content\` text,
  	\`version_author_id\` integer,
  	\`version_author_bio\` text,
  	\`version_reading_time\` numeric,
  	\`version_view_count\` numeric DEFAULT 0,
  	\`version_featured\` integer DEFAULT false,
  	\`version_template\` text DEFAULT 'blogtemplate1',
  	\`version_content_type\` text DEFAULT 'article',
  	\`version_content_access_access_level\` text DEFAULT 'free',
  	\`version_content_access_preview_length\` numeric DEFAULT 200,
  	\`version_content_access_lock_message\` text,
  	\`version_enable_t_o_c\` integer DEFAULT true,
  	\`version_enable_share\` integer DEFAULT true,
  	\`version_enable_comments\` integer DEFAULT false,
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
  await db.run(sql`CREATE INDEX \`_blog_posts_v_parent_idx\` ON \`_blog_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_version_slug_idx\` ON \`_blog_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_version_featured_image_idx\` ON \`_blog_posts_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_version_author_idx\` ON \`_blog_posts_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_meta_version_meta_image_idx\` ON \`_blog_posts_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_version_updated_at_idx\` ON \`_blog_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_version_created_at_idx\` ON \`_blog_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_version_version__status_idx\` ON \`_blog_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_created_at_idx\` ON \`_blog_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_updated_at_idx\` ON \`_blog_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_latest_idx\` ON \`_blog_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_autosave_idx\` ON \`_blog_posts_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_blog_posts_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`blog_categories_id\` integer,
  	\`products_id\` integer,
  	\`blog_posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_blog_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_categories_id\`) REFERENCES \`blog_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_rels_order_idx\` ON \`_blog_posts_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_rels_parent_idx\` ON \`_blog_posts_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_rels_path_idx\` ON \`_blog_posts_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_rels_blog_categories_id_idx\` ON \`_blog_posts_v_rels\` (\`blog_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_rels_products_id_idx\` ON \`_blog_posts_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_posts_v_rels_blog_posts_id_idx\` ON \`_blog_posts_v_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`parent_id\` integer,
  	\`description\` text,
  	\`icon\` text DEFAULT 'BookOpen',
  	\`color\` text DEFAULT 'teal',
  	\`image_id\` integer,
  	\`display_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blog_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blog_categories_slug_idx\` ON \`blog_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blog_categories_parent_idx\` ON \`blog_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_categories_image_idx\` ON \`blog_categories\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_categories_updated_at_idx\` ON \`blog_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blog_categories_created_at_idx\` ON \`blog_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
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
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`cases_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`service\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_services_order_idx\` ON \`cases_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_services_parent_id_idx\` ON \`cases_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cases_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_gallery_order_idx\` ON \`cases_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_gallery_parent_id_idx\` ON \`cases_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_gallery_image_idx\` ON \`cases_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`cases\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`cases_slug_idx\` ON \`cases\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`cases_featured_image_idx\` ON \`cases\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_meta_meta_image_idx\` ON \`cases\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_updated_at_idx\` ON \`cases\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cases_created_at_idx\` ON \`cases\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
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
  await db.run(sql`CREATE INDEX \`testimonials_photo_idx\` ON \`testimonials\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`vendors_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`vendors_certifications_order_idx\` ON \`vendors_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`vendors_certifications_parent_id_idx\` ON \`vendors_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`vendors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`short_name\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`logo_id\` integer,
  	\`banner_id\` integer,
  	\`banner_color\` text,
  	\`is_verified\` integer DEFAULT false,
  	\`is_premium\` integer DEFAULT false,
  	\`is_featured\` integer DEFAULT false,
  	\`contact_website\` text,
  	\`contact_email\` text,
  	\`contact_phone\` text,
  	\`contact_address\` text,
  	\`contact_country\` text,
  	\`stats_product_count\` numeric,
  	\`stats_rating\` numeric,
  	\`stats_review_count\` numeric,
  	\`stats_established_year\` numeric,
  	\`delivery_delivery_time\` text,
  	\`delivery_free_shipping_from\` numeric,
  	\`delivery_offers_workshops\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`banner_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`vendors_slug_idx\` ON \`vendors\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`vendors_logo_idx\` ON \`vendors\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_banner_idx\` ON \`vendors\` (\`banner_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_meta_meta_image_idx\` ON \`vendors\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_updated_at_idx\` ON \`vendors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vendors_created_at_idx\` ON \`vendors\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`vendors_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`product_categories_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`vendors_rels_order_idx\` ON \`vendors_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_parent_idx\` ON \`vendors_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_path_idx\` ON \`vendors_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_product_categories_id_idx\` ON \`vendors_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_products_id_idx\` ON \`vendors_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`vendor_reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`vendor_id\` integer NOT NULL,
  	\`title\` text,
  	\`rating\` numeric NOT NULL,
  	\`comment\` text NOT NULL,
  	\`author_name\` text NOT NULL,
  	\`author_email\` text,
  	\`author_company\` text,
  	\`author_initials\` text,
  	\`is_approved\` integer DEFAULT false,
  	\`is_verified_purchase\` integer DEFAULT false,
  	\`moderation_notes\` text,
  	\`helpful_count\` numeric DEFAULT 0,
  	\`vendor_response_text\` text,
  	\`vendor_response_responded_at\` text,
  	\`review_date\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`vendor_reviews_vendor_idx\` ON \`vendor_reviews\` (\`vendor_id\`);`)
  await db.run(sql`CREATE INDEX \`vendor_reviews_updated_at_idx\` ON \`vendor_reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vendor_reviews_created_at_idx\` ON \`vendor_reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`workshops_target_audience\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`workshops\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`workshops_target_audience_order_idx\` ON \`workshops_target_audience\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`workshops_target_audience_parent_idx\` ON \`workshops_target_audience\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`workshops_learning_objectives\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`objective\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`workshops\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`workshops_learning_objectives_order_idx\` ON \`workshops_learning_objectives\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`workshops_learning_objectives_parent_id_idx\` ON \`workshops_learning_objectives\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`workshops\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`excerpt\` text,
  	\`featured_image_id\` integer,
  	\`emoji\` text,
  	\`vendor_id\` integer,
  	\`instructor\` text,
  	\`date\` text NOT NULL,
  	\`duration\` numeric,
  	\`duration_display\` text,
  	\`location_type\` text DEFAULT 'physical' NOT NULL,
  	\`location_name\` text,
  	\`location_address\` text,
  	\`location_city\` text,
  	\`registration_url\` text,
  	\`max_participants\` numeric,
  	\`current_participants\` numeric DEFAULT 0,
  	\`is_free\` integer DEFAULT false,
  	\`price\` numeric,
  	\`price_display\` text,
  	\`category\` text,
  	\`level\` text,
  	\`status\` text DEFAULT 'upcoming' NOT NULL,
  	\`is_featured\` integer DEFAULT false,
  	\`prerequisites\` text,
  	\`certificate_awarded\` integer DEFAULT false,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`workshops_slug_idx\` ON \`workshops\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`workshops_featured_image_idx\` ON \`workshops\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`workshops_vendor_idx\` ON \`workshops\` (\`vendor_id\`);`)
  await db.run(sql`CREATE INDEX \`workshops_meta_meta_image_idx\` ON \`workshops\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`workshops_updated_at_idx\` ON \`workshops\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`workshops_created_at_idx\` ON \`workshops\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`construction_services_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_services_features_order_idx\` ON \`construction_services_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_features_parent_id_idx\` ON \`construction_services_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_services_process_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_services_process_steps_order_idx\` ON \`construction_services_process_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_process_steps_parent_id_idx\` ON \`construction_services_process_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_services_service_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_services_service_types_order_idx\` ON \`construction_services_service_types\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_service_types_parent_id_idx\` ON \`construction_services_service_types\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_services_usps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_services_usps_order_idx\` ON \`construction_services_usps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_usps_parent_id_idx\` ON \`construction_services_usps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_services_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_services_faq_order_idx\` ON \`construction_services_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_faq_parent_id_idx\` ON \`construction_services_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`icon\` text,
  	\`color\` text DEFAULT 'teal',
  	\`short_description\` text NOT NULL,
  	\`long_description\` text,
  	\`hero_image_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_keywords\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`construction_services_slug_idx\` ON \`construction_services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_hero_image_idx\` ON \`construction_services\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_updated_at_idx\` ON \`construction_services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_created_at_idx\` ON \`construction_services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`construction_services_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_services_rels_order_idx\` ON \`construction_services_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_rels_parent_idx\` ON \`construction_services_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_rels_path_idx\` ON \`construction_services_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`construction_services_rels_media_id_idx\` ON \`construction_services_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_projects_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`badge\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`construction_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_projects_badges_order_idx\` ON \`construction_projects_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_badges_parent_id_idx\` ON \`construction_projects_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`category_id\` integer,
  	\`location\` text,
  	\`year\` numeric,
  	\`duration\` text,
  	\`size\` text,
  	\`budget\` text,
  	\`short_description\` text NOT NULL,
  	\`long_description\` text,
  	\`challenge\` text,
  	\`solution\` text,
  	\`result\` text,
  	\`featured_image_id\` integer NOT NULL,
  	\`before_after_before_id\` integer,
  	\`before_after_after_id\` integer,
  	\`testimonial_quote\` text,
  	\`testimonial_client_name\` text,
  	\`testimonial_client_role\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`featured\` integer DEFAULT false,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`before_after_before_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`before_after_after_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`construction_projects_slug_idx\` ON \`construction_projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_category_idx\` ON \`construction_projects\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_featured_image_idx\` ON \`construction_projects\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_before_after_before_after_before_idx\` ON \`construction_projects\` (\`before_after_before_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_before_after_before_after_after_idx\` ON \`construction_projects\` (\`before_after_after_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_updated_at_idx\` ON \`construction_projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_created_at_idx\` ON \`construction_projects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`construction_projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`construction_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_projects_rels_order_idx\` ON \`construction_projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_rels_parent_idx\` ON \`construction_projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_rels_path_idx\` ON \`construction_projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`construction_projects_rels_media_id_idx\` ON \`construction_projects_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`construction_reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client_name\` text NOT NULL,
  	\`client_role\` text,
  	\`client_initials\` text,
  	\`client_color\` text DEFAULT 'teal',
  	\`rating\` numeric NOT NULL,
  	\`quote\` text NOT NULL,
  	\`project_id\` integer,
  	\`service_id\` integer,
  	\`featured\` integer DEFAULT false,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`project_id\`) REFERENCES \`construction_projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`construction_reviews_project_idx\` ON \`construction_reviews\` (\`project_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_reviews_service_idx\` ON \`construction_reviews\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`construction_reviews_updated_at_idx\` ON \`construction_reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`construction_reviews_created_at_idx\` ON \`construction_reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`quote_requests\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`address\` text,
  	\`postal_code\` text,
  	\`city\` text,
  	\`project_type\` text NOT NULL,
  	\`budget\` text,
  	\`timeline\` text,
  	\`description\` text,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`assigned_to_id\` integer,
  	\`notes\` text,
  	\`submitted_at\` text NOT NULL,
  	\`contacted_at\` text,
  	\`quoted_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`assigned_to_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`quote_requests_assigned_to_idx\` ON \`quote_requests\` (\`assigned_to_id\`);`)
  await db.run(sql`CREATE INDEX \`quote_requests_updated_at_idx\` ON \`quote_requests\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`quote_requests_created_at_idx\` ON \`quote_requests\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`quote_requests_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`quote_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`quote_requests_rels_order_idx\` ON \`quote_requests_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`quote_requests_rels_parent_idx\` ON \`quote_requests_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`quote_requests_rels_path_idx\` ON \`quote_requests_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`quote_requests_rels_media_id_idx\` ON \`quote_requests_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`treatments_symptoms\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`symptom\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`treatments_symptoms_order_idx\` ON \`treatments_symptoms\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`treatments_symptoms_parent_id_idx\` ON \`treatments_symptoms\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`treatments_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`treatments_process_order_idx\` ON \`treatments_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`treatments_process_parent_id_idx\` ON \`treatments_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`treatments_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`treatments_gallery_order_idx\` ON \`treatments_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`treatments_gallery_parent_id_idx\` ON \`treatments_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`treatments_gallery_image_idx\` ON \`treatments_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`treatments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`category\` text,
  	\`icon\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`duration\` numeric,
  	\`intake_duration\` numeric,
  	\`price\` numeric,
  	\`intake_price\` numeric,
  	\`insurance\` text DEFAULT 'covered',
  	\`average_treatments\` text,
  	\`success_rate\` numeric,
  	\`featured_image_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_keywords\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`treatments_featured_image_idx\` ON \`treatments\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`treatments_slug_idx\` ON \`treatments\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`treatments_updated_at_idx\` ON \`treatments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`treatments_created_at_idx\` ON \`treatments\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`treatments__status_idx\` ON \`treatments\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`treatments_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`treatments_id\` integer,
  	\`practitioners_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`treatments_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`practitioners_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`treatments_rels_order_idx\` ON \`treatments_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`treatments_rels_parent_idx\` ON \`treatments_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`treatments_rels_path_idx\` ON \`treatments_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`treatments_rels_treatments_id_idx\` ON \`treatments_rels\` (\`treatments_id\`);`)
  await db.run(sql`CREATE INDEX \`treatments_rels_practitioners_id_idx\` ON \`treatments_rels\` (\`practitioners_id\`);`)
  await db.run(sql`CREATE TABLE \`_treatments_v_version_symptoms\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`symptom\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_treatments_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_symptoms_order_idx\` ON \`_treatments_v_version_symptoms\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_symptoms_parent_id_idx\` ON \`_treatments_v_version_symptoms\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_treatments_v_version_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_treatments_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_process_order_idx\` ON \`_treatments_v_version_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_process_parent_id_idx\` ON \`_treatments_v_version_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_treatments_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_treatments_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_gallery_order_idx\` ON \`_treatments_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_gallery_parent_id_idx\` ON \`_treatments_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_gallery_image_idx\` ON \`_treatments_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_treatments_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_category\` text,
  	\`version_icon\` text,
  	\`version_excerpt\` text,
  	\`version_description\` text,
  	\`version_duration\` numeric,
  	\`version_intake_duration\` numeric,
  	\`version_price\` numeric,
  	\`version_intake_price\` numeric,
  	\`version_insurance\` text DEFAULT 'covered',
  	\`version_average_treatments\` text,
  	\`version_success_rate\` numeric,
  	\`version_featured_image_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_keywords\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_treatments_v_parent_idx\` ON \`_treatments_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_version_featured_image_idx\` ON \`_treatments_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_version_slug_idx\` ON \`_treatments_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_version_updated_at_idx\` ON \`_treatments_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_version_created_at_idx\` ON \`_treatments_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_version_version__status_idx\` ON \`_treatments_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_created_at_idx\` ON \`_treatments_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_updated_at_idx\` ON \`_treatments_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_latest_idx\` ON \`_treatments_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_autosave_idx\` ON \`_treatments_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_treatments_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`treatments_id\` integer,
  	\`practitioners_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_treatments_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`treatments_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`practitioners_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_treatments_v_rels_order_idx\` ON \`_treatments_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_rels_parent_idx\` ON \`_treatments_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_rels_path_idx\` ON \`_treatments_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_rels_treatments_id_idx\` ON \`_treatments_v_rels\` (\`treatments_id\`);`)
  await db.run(sql`CREATE INDEX \`_treatments_v_rels_practitioners_id_idx\` ON \`_treatments_v_rels\` (\`practitioners_id\`);`)
  await db.run(sql`CREATE TABLE \`practitioners_specializations\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`specialization\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`practitioners_specializations_order_idx\` ON \`practitioners_specializations\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_specializations_parent_id_idx\` ON \`practitioners_specializations\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`practitioners_qualifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`qualification\` text,
  	\`year\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`practitioners_qualifications_order_idx\` ON \`practitioners_qualifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_qualifications_parent_id_idx\` ON \`practitioners_qualifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`practitioners_work_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`practitioners_work_days_order_idx\` ON \`practitioners_work_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_work_days_parent_idx\` ON \`practitioners_work_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`practitioners\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`avatar_id\` integer,
  	\`emoji\` text,
  	\`initials\` text,
  	\`title\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`availability\` text DEFAULT 'available',
  	\`email\` text,
  	\`phone\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`practitioners_avatar_idx\` ON \`practitioners\` (\`avatar_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`practitioners_slug_idx\` ON \`practitioners\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_updated_at_idx\` ON \`practitioners\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_created_at_idx\` ON \`practitioners\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`practitioners__status_idx\` ON \`practitioners\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`practitioners_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`treatments_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`treatments_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`practitioners_rels_order_idx\` ON \`practitioners_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_rels_parent_idx\` ON \`practitioners_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_rels_path_idx\` ON \`practitioners_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`practitioners_rels_treatments_id_idx\` ON \`practitioners_rels\` (\`treatments_id\`);`)
  await db.run(sql`CREATE TABLE \`_practitioners_v_version_specializations\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`specialization\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_practitioners_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_specializations_order_idx\` ON \`_practitioners_v_version_specializations\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_specializations_parent_id_idx\` ON \`_practitioners_v_version_specializations\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_practitioners_v_version_qualifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`qualification\` text,
  	\`year\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_practitioners_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_qualifications_order_idx\` ON \`_practitioners_v_version_qualifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_qualifications_parent_id_idx\` ON \`_practitioners_v_version_qualifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_practitioners_v_version_work_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_practitioners_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_work_days_order_idx\` ON \`_practitioners_v_version_work_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_work_days_parent_idx\` ON \`_practitioners_v_version_work_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_practitioners_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_avatar_id\` integer,
  	\`version_emoji\` text,
  	\`version_initials\` text,
  	\`version_title\` text,
  	\`version_role\` text,
  	\`version_bio\` text,
  	\`version_availability\` text DEFAULT 'available',
  	\`version_email\` text,
  	\`version_phone\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_practitioners_v_parent_idx\` ON \`_practitioners_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_version_avatar_idx\` ON \`_practitioners_v\` (\`version_avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_version_slug_idx\` ON \`_practitioners_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_version_updated_at_idx\` ON \`_practitioners_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_version_created_at_idx\` ON \`_practitioners_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_version_version__status_idx\` ON \`_practitioners_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_created_at_idx\` ON \`_practitioners_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_updated_at_idx\` ON \`_practitioners_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_latest_idx\` ON \`_practitioners_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_autosave_idx\` ON \`_practitioners_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_practitioners_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`treatments_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_practitioners_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`treatments_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_practitioners_v_rels_order_idx\` ON \`_practitioners_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_rels_parent_idx\` ON \`_practitioners_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_rels_path_idx\` ON \`_practitioners_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_practitioners_v_rels_treatments_id_idx\` ON \`_practitioners_v_rels\` (\`treatments_id\`);`)
  await db.run(sql`CREATE TABLE \`appointments_preferred_time\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`appointments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`appointments_preferred_time_order_idx\` ON \`appointments_preferred_time\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`appointments_preferred_time_parent_idx\` ON \`appointments_preferred_time\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`appointments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`name\` text,
  	\`phone\` text NOT NULL,
  	\`email\` text,
  	\`birth_date\` text,
  	\`insurance\` text,
  	\`treatment\` text,
  	\`complaint\` text NOT NULL,
  	\`has_referral\` text DEFAULT 'no',
  	\`type\` text DEFAULT 'new',
  	\`status\` text DEFAULT 'new',
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`appointments_updated_at_idx\` ON \`appointments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`appointments_created_at_idx\` ON \`appointments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`beauty_services_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`benefit\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_services_benefits_order_idx\` ON \`beauty_services_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_benefits_parent_id_idx\` ON \`beauty_services_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`beauty_services_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_services_process_order_idx\` ON \`beauty_services_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_process_parent_id_idx\` ON \`beauty_services_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`beauty_services_tags\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_services_tags_order_idx\` ON \`beauty_services_tags\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_tags_parent_idx\` ON \`beauty_services_tags\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`beauty_services_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_services_gallery_order_idx\` ON \`beauty_services_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_gallery_parent_id_idx\` ON \`beauty_services_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_gallery_image_idx\` ON \`beauty_services_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`beauty_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`category\` text,
  	\`icon\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`duration\` numeric,
  	\`price\` numeric,
  	\`price_from\` numeric,
  	\`price_to\` numeric,
  	\`bookable\` integer DEFAULT true,
  	\`requires_consultation\` integer DEFAULT false,
  	\`featured_image_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_keywords\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_services_featured_image_idx\` ON \`beauty_services\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`beauty_services_slug_idx\` ON \`beauty_services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_updated_at_idx\` ON \`beauty_services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_created_at_idx\` ON \`beauty_services\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services__status_idx\` ON \`beauty_services\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`beauty_services_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`beauty_services_id\` integer,
  	\`stylists_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`beauty_services_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stylists_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_services_rels_order_idx\` ON \`beauty_services_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_rels_parent_idx\` ON \`beauty_services_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_rels_path_idx\` ON \`beauty_services_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_rels_beauty_services_id_idx\` ON \`beauty_services_rels\` (\`beauty_services_id\`);`)
  await db.run(sql`CREATE INDEX \`beauty_services_rels_stylists_id_idx\` ON \`beauty_services_rels\` (\`stylists_id\`);`)
  await db.run(sql`CREATE TABLE \`_beauty_services_v_version_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`benefit\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_beauty_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_benefits_order_idx\` ON \`_beauty_services_v_version_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_benefits_parent_id_idx\` ON \`_beauty_services_v_version_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_beauty_services_v_version_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_beauty_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_process_order_idx\` ON \`_beauty_services_v_version_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_process_parent_id_idx\` ON \`_beauty_services_v_version_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_beauty_services_v_version_tags\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_beauty_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_tags_order_idx\` ON \`_beauty_services_v_version_tags\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_tags_parent_idx\` ON \`_beauty_services_v_version_tags\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_beauty_services_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_beauty_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_gallery_order_idx\` ON \`_beauty_services_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_gallery_parent_id_idx\` ON \`_beauty_services_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_gallery_image_idx\` ON \`_beauty_services_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_beauty_services_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_category\` text,
  	\`version_icon\` text,
  	\`version_excerpt\` text,
  	\`version_description\` text,
  	\`version_duration\` numeric,
  	\`version_price\` numeric,
  	\`version_price_from\` numeric,
  	\`version_price_to\` numeric,
  	\`version_bookable\` integer DEFAULT true,
  	\`version_requires_consultation\` integer DEFAULT false,
  	\`version_featured_image_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_keywords\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_parent_idx\` ON \`_beauty_services_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_version_featured_image_idx\` ON \`_beauty_services_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_version_slug_idx\` ON \`_beauty_services_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_version_updated_at_idx\` ON \`_beauty_services_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_version_created_at_idx\` ON \`_beauty_services_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_version_version__status_idx\` ON \`_beauty_services_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_created_at_idx\` ON \`_beauty_services_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_updated_at_idx\` ON \`_beauty_services_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_latest_idx\` ON \`_beauty_services_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_autosave_idx\` ON \`_beauty_services_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_beauty_services_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`beauty_services_id\` integer,
  	\`stylists_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_beauty_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`beauty_services_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stylists_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_rels_order_idx\` ON \`_beauty_services_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_rels_parent_idx\` ON \`_beauty_services_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_rels_path_idx\` ON \`_beauty_services_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_rels_beauty_services_id_idx\` ON \`_beauty_services_v_rels\` (\`beauty_services_id\`);`)
  await db.run(sql`CREATE INDEX \`_beauty_services_v_rels_stylists_id_idx\` ON \`_beauty_services_v_rels\` (\`stylists_id\`);`)
  await db.run(sql`CREATE TABLE \`stylists_specialties\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`specialty\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stylists_specialties_order_idx\` ON \`stylists_specialties\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stylists_specialties_parent_id_idx\` ON \`stylists_specialties\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stylists_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`certification\` text,
  	\`year\` numeric,
  	\`institution\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stylists_certifications_order_idx\` ON \`stylists_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stylists_certifications_parent_id_idx\` ON \`stylists_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stylists_work_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stylists_work_days_order_idx\` ON \`stylists_work_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`stylists_work_days_parent_idx\` ON \`stylists_work_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stylists_portfolio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stylists_portfolio_order_idx\` ON \`stylists_portfolio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stylists_portfolio_parent_id_idx\` ON \`stylists_portfolio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`stylists_portfolio_image_idx\` ON \`stylists_portfolio\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`stylists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`avatar_id\` integer,
  	\`emoji\` text,
  	\`initials\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`experience\` numeric,
  	\`availability\` text DEFAULT 'available',
  	\`start_time\` text,
  	\`end_time\` text,
  	\`bookable\` integer DEFAULT true,
  	\`email\` text,
  	\`phone\` text,
  	\`instagram\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`stylists_avatar_idx\` ON \`stylists\` (\`avatar_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`stylists_slug_idx\` ON \`stylists\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`stylists_updated_at_idx\` ON \`stylists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`stylists_created_at_idx\` ON \`stylists\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`stylists__status_idx\` ON \`stylists\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`stylists_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`beauty_services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`beauty_services_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stylists_rels_order_idx\` ON \`stylists_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`stylists_rels_parent_idx\` ON \`stylists_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`stylists_rels_path_idx\` ON \`stylists_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`stylists_rels_beauty_services_id_idx\` ON \`stylists_rels\` (\`beauty_services_id\`);`)
  await db.run(sql`CREATE TABLE \`_stylists_v_version_specialties\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`specialty\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stylists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_specialties_order_idx\` ON \`_stylists_v_version_specialties\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_specialties_parent_id_idx\` ON \`_stylists_v_version_specialties\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stylists_v_version_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`certification\` text,
  	\`year\` numeric,
  	\`institution\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stylists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_certifications_order_idx\` ON \`_stylists_v_version_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_certifications_parent_id_idx\` ON \`_stylists_v_version_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stylists_v_version_work_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_stylists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_work_days_order_idx\` ON \`_stylists_v_version_work_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_work_days_parent_idx\` ON \`_stylists_v_version_work_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stylists_v_version_portfolio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stylists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_portfolio_order_idx\` ON \`_stylists_v_version_portfolio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_portfolio_parent_id_idx\` ON \`_stylists_v_version_portfolio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_portfolio_image_idx\` ON \`_stylists_v_version_portfolio\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_stylists_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_avatar_id\` integer,
  	\`version_emoji\` text,
  	\`version_initials\` text,
  	\`version_role\` text,
  	\`version_bio\` text,
  	\`version_experience\` numeric,
  	\`version_availability\` text DEFAULT 'available',
  	\`version_start_time\` text,
  	\`version_end_time\` text,
  	\`version_bookable\` integer DEFAULT true,
  	\`version_email\` text,
  	\`version_phone\` text,
  	\`version_instagram\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_stylists_v_parent_idx\` ON \`_stylists_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_version_avatar_idx\` ON \`_stylists_v\` (\`version_avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_version_slug_idx\` ON \`_stylists_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_version_updated_at_idx\` ON \`_stylists_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_version_created_at_idx\` ON \`_stylists_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_version_version__status_idx\` ON \`_stylists_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_created_at_idx\` ON \`_stylists_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_updated_at_idx\` ON \`_stylists_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_latest_idx\` ON \`_stylists_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_autosave_idx\` ON \`_stylists_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_stylists_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`beauty_services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_stylists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`beauty_services_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stylists_v_rels_order_idx\` ON \`_stylists_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_rels_parent_idx\` ON \`_stylists_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_rels_path_idx\` ON \`_stylists_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_stylists_v_rels_beauty_services_id_idx\` ON \`_stylists_v_rels\` (\`beauty_services_id\`);`)
  await db.run(sql`CREATE TABLE \`beauty_bookings_preferred_time_slots\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`beauty_bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_bookings_preferred_time_slots_order_idx\` ON \`beauty_bookings_preferred_time_slots\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`beauty_bookings_preferred_time_slots_parent_idx\` ON \`beauty_bookings_preferred_time_slots\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`beauty_bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`customer_name\` text,
  	\`email\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`service_id\` integer,
  	\`stylist_id\` integer,
  	\`date\` text NOT NULL,
  	\`time\` text NOT NULL,
  	\`remarks\` text,
  	\`is_first_visit\` integer DEFAULT false,
  	\`marketing_consent\` integer DEFAULT false,
  	\`status\` text DEFAULT 'new',
  	\`total_price\` numeric,
  	\`duration\` numeric,
  	\`notes\` text,
  	\`confirmation_sent\` integer DEFAULT false,
  	\`reminder_sent\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`stylist_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`beauty_bookings_service_idx\` ON \`beauty_bookings\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`beauty_bookings_stylist_idx\` ON \`beauty_bookings\` (\`stylist_id\`);`)
  await db.run(sql`CREATE INDEX \`beauty_bookings_updated_at_idx\` ON \`beauty_bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`beauty_bookings_created_at_idx\` ON \`beauty_bookings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`menu_items_allergens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`allergen\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`menu_items_allergens_order_idx\` ON \`menu_items_allergens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`menu_items_allergens_parent_id_idx\` ON \`menu_items_allergens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`menu_items\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`category\` text DEFAULT 'mains',
  	\`description\` text,
  	\`ingredients\` text,
  	\`price\` numeric,
  	\`featured\` integer DEFAULT false,
  	\`vegetarian\` integer DEFAULT false,
  	\`vegan\` integer DEFAULT false,
  	\`gluten_free\` integer DEFAULT false,
  	\`image_id\` integer,
  	\`icon\` text DEFAULT '🍽️',
  	\`sort_order\` numeric DEFAULT 0,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`menu_items_image_idx\` ON \`menu_items\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`menu_items_slug_idx\` ON \`menu_items\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`menu_items_updated_at_idx\` ON \`menu_items\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`menu_items_created_at_idx\` ON \`menu_items\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`menu_items__status_idx\` ON \`menu_items\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_menu_items_v_version_allergens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`allergen\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_menu_items_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_menu_items_v_version_allergens_order_idx\` ON \`_menu_items_v_version_allergens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_version_allergens_parent_id_idx\` ON \`_menu_items_v_version_allergens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_menu_items_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_category\` text DEFAULT 'mains',
  	\`version_description\` text,
  	\`version_ingredients\` text,
  	\`version_price\` numeric,
  	\`version_featured\` integer DEFAULT false,
  	\`version_vegetarian\` integer DEFAULT false,
  	\`version_vegan\` integer DEFAULT false,
  	\`version_gluten_free\` integer DEFAULT false,
  	\`version_image_id\` integer,
  	\`version_icon\` text DEFAULT '🍽️',
  	\`version_sort_order\` numeric DEFAULT 0,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`menu_items\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_menu_items_v_parent_idx\` ON \`_menu_items_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_version_version_image_idx\` ON \`_menu_items_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_version_version_slug_idx\` ON \`_menu_items_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_version_version_updated_at_idx\` ON \`_menu_items_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_version_version_created_at_idx\` ON \`_menu_items_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_version_version__status_idx\` ON \`_menu_items_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_created_at_idx\` ON \`_menu_items_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_updated_at_idx\` ON \`_menu_items_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_latest_idx\` ON \`_menu_items_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_menu_items_v_autosave_idx\` ON \`_menu_items_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`reservations_preferences\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`reservations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reservations_preferences_order_idx\` ON \`reservations_preferences\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`reservations_preferences_parent_idx\` ON \`reservations_preferences\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`reservations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`customer_name\` text NOT NULL,
  	\`customer_email\` text NOT NULL,
  	\`customer_phone\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`time\` text NOT NULL,
  	\`guests\` numeric DEFAULT 2 NOT NULL,
  	\`occasion\` text DEFAULT 'regular',
  	\`special_requests\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`confirmed\` integer DEFAULT false,
  	\`reminded\` integer DEFAULT false,
  	\`internal_notes\` text,
  	\`assigned_table\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`reservations_updated_at_idx\` ON \`reservations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reservations_created_at_idx\` ON \`reservations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`events_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_gallery_order_idx\` ON \`events_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_gallery_parent_id_idx\` ON \`events_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`events_gallery_image_idx\` ON \`events_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`events_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_tags_order_idx\` ON \`events_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_tags_parent_id_idx\` ON \`events_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`event_type\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`date\` text,
  	\`end_date\` text,
  	\`start_time\` text DEFAULT '19:00',
  	\`duration\` text,
  	\`price\` numeric,
  	\`max_guests\` numeric,
  	\`featured\` integer DEFAULT false,
  	\`booking_required\` integer DEFAULT true,
  	\`booking_url\` text,
  	\`image_id\` integer,
  	\`icon\` text DEFAULT '🎉',
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_image_idx\` ON \`events\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`events__status_idx\` ON \`events\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_events_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_version_gallery_order_idx\` ON \`_events_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_gallery_parent_id_idx\` ON \`_events_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_gallery_image_idx\` ON \`_events_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_events_v_version_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_version_tags_order_idx\` ON \`_events_v_version_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_tags_parent_id_idx\` ON \`_events_v_version_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_events_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_event_type\` text,
  	\`version_excerpt\` text,
  	\`version_description\` text,
  	\`version_date\` text,
  	\`version_end_date\` text,
  	\`version_start_time\` text DEFAULT '19:00',
  	\`version_duration\` text,
  	\`version_price\` numeric,
  	\`version_max_guests\` numeric,
  	\`version_featured\` integer DEFAULT false,
  	\`version_booking_required\` integer DEFAULT true,
  	\`version_booking_url\` text,
  	\`version_image_id\` integer,
  	\`version_icon\` text DEFAULT '🎉',
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_parent_idx\` ON \`_events_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_image_idx\` ON \`_events_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_slug_idx\` ON \`_events_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_updated_at_idx\` ON \`_events_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_created_at_idx\` ON \`_events_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version__status_idx\` ON \`_events_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_created_at_idx\` ON \`_events_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_updated_at_idx\` ON \`_events_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_latest_idx\` ON \`_events_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_autosave_idx\` ON \`_events_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`email_subscribers_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_subscribers_tags_order_idx\` ON \`email_subscribers_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_tags_parent_id_idx\` ON \`email_subscribers_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_subscribers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`status\` text DEFAULT 'enabled' NOT NULL,
  	\`tenant_id\` integer NOT NULL,
  	\`custom_fields\` text,
  	\`preferences_marketing_emails\` integer DEFAULT true,
  	\`preferences_product_updates\` integer DEFAULT true,
  	\`preferences_newsletter\` integer DEFAULT false,
  	\`source\` text DEFAULT 'manual',
  	\`listmonk_id\` numeric,
  	\`last_synced_at\` text,
  	\`sync_status\` text DEFAULT 'pending',
  	\`sync_error\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`email_subscribers_email_idx\` ON \`email_subscribers\` (\`email\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_tenant_idx\` ON \`email_subscribers\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_listmonk_id_idx\` ON \`email_subscribers\` (\`listmonk_id\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_updated_at_idx\` ON \`email_subscribers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_created_at_idx\` ON \`email_subscribers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`email_subscribers_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`email_lists_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`email_subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_lists_id\`) REFERENCES \`email_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_subscribers_rels_order_idx\` ON \`email_subscribers_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_rels_parent_idx\` ON \`email_subscribers_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_rels_path_idx\` ON \`email_subscribers_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`email_subscribers_rels_email_lists_id_idx\` ON \`email_subscribers_rels\` (\`email_lists_id\`);`)
  await db.run(sql`CREATE TABLE \`email_lists_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_lists_tags_order_idx\` ON \`email_lists_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_lists_tags_parent_id_idx\` ON \`email_lists_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_lists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`type\` text DEFAULT 'private' NOT NULL,
  	\`optin\` text DEFAULT 'single' NOT NULL,
  	\`tenant_id\` integer NOT NULL,
  	\`subscriber_count\` numeric DEFAULT 0,
  	\`subscription_settings_welcome_email\` integer DEFAULT true,
  	\`subscription_settings_welcome_email_template_id\` integer,
  	\`subscription_settings_confirmation_page\` text,
  	\`category\` text,
  	\`listmonk_id\` numeric,
  	\`last_synced_at\` text,
  	\`sync_status\` text DEFAULT 'pending',
  	\`sync_error\` text,
  	\`is_active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`subscription_settings_welcome_email_template_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`email_lists_tenant_idx\` ON \`email_lists\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`email_lists_subscription_settings_subscription_settings__idx\` ON \`email_lists\` (\`subscription_settings_welcome_email_template_id\`);`)
  await db.run(sql`CREATE INDEX \`email_lists_listmonk_id_idx\` ON \`email_lists\` (\`listmonk_id\`);`)
  await db.run(sql`CREATE INDEX \`email_lists_updated_at_idx\` ON \`email_lists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_lists_created_at_idx\` ON \`email_lists\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`email_templates_variables_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`default_value\` text,
  	\`required\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_templates_variables_list_order_idx\` ON \`email_templates_variables_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_variables_list_parent_id_idx\` ON \`email_templates_variables_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_templates_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_templates_tags_order_idx\` ON \`email_templates_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_tags_parent_id_idx\` ON \`email_templates_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_templates_test_settings_test_recipients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_templates_test_settings_test_recipients_order_idx\` ON \`email_templates_test_settings_test_recipients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_test_settings_test_recipients_parent_id_idx\` ON \`email_templates_test_settings_test_recipients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_templates\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`type\` text DEFAULT 0 NOT NULL,
  	\`is_default\` integer DEFAULT false,
  	\`default_subject\` text,
  	\`preheader\` text,
  	\`use_visual_editor\` integer DEFAULT false,
  	\`grapes_data\` text,
  	\`html\` text NOT NULL,
  	\`tenant_id\` integer NOT NULL,
  	\`category\` text,
  	\`test_settings_last_tested_at\` text,
  	\`listmonk_id\` numeric,
  	\`last_synced_at\` text,
  	\`sync_status\` text DEFAULT 'pending',
  	\`sync_error\` text,
  	\`is_active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`email_templates_tenant_idx\` ON \`email_templates\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_listmonk_id_idx\` ON \`email_templates\` (\`listmonk_id\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_updated_at_idx\` ON \`email_templates\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_created_at_idx\` ON \`email_templates\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`email_campaigns_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_campaigns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_campaigns_tags_order_idx\` ON \`email_campaigns_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_tags_parent_id_idx\` ON \`email_campaigns_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_campaigns_ab_test_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`subject\` text,
  	\`percentage\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_campaigns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_campaigns_ab_test_variants_order_idx\` ON \`email_campaigns_ab_test_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_ab_test_variants_parent_id_idx\` ON \`email_campaigns_ab_test_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_campaigns\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`subject\` text NOT NULL,
  	\`preheader\` text,
  	\`from_name\` text,
  	\`from_email\` text,
  	\`reply_to\` text,
  	\`content_type\` text DEFAULT 'template' NOT NULL,
  	\`template_id\` integer,
  	\`template_variables\` text,
  	\`html\` text,
  	\`segment_rules_enabled\` integer DEFAULT false,
  	\`segment_rules_query\` text,
  	\`scheduled_for\` text,
  	\`timezone\` text DEFAULT 'Europe/Amsterdam',
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`started_at\` text,
  	\`completed_at\` text,
  	\`stats_sent\` numeric DEFAULT 0,
  	\`stats_delivered\` numeric DEFAULT 0,
  	\`stats_bounced\` numeric DEFAULT 0,
  	\`stats_opened\` numeric DEFAULT 0,
  	\`stats_clicked\` numeric DEFAULT 0,
  	\`stats_open_rate\` numeric DEFAULT 0,
  	\`stats_click_rate\` numeric DEFAULT 0,
  	\`stats_bounce_rate\` numeric DEFAULT 0,
  	\`stats_unsubscribed\` numeric DEFAULT 0,
  	\`tenant_id\` integer NOT NULL,
  	\`category\` text,
  	\`ab_test_enabled\` integer DEFAULT false,
  	\`listmonk_campaign_id\` numeric,
  	\`last_synced_at\` text,
  	\`sync_status\` text DEFAULT 'pending',
  	\`sync_error\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`template_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`email_campaigns_template_idx\` ON \`email_campaigns\` (\`template_id\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_tenant_idx\` ON \`email_campaigns\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_listmonk_campaign_id_idx\` ON \`email_campaigns\` (\`listmonk_campaign_id\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_updated_at_idx\` ON \`email_campaigns\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_created_at_idx\` ON \`email_campaigns\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`email_campaigns_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`email_lists_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`email_campaigns\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_lists_id\`) REFERENCES \`email_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_campaigns_rels_order_idx\` ON \`email_campaigns_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_rels_parent_idx\` ON \`email_campaigns_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_rels_path_idx\` ON \`email_campaigns_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`email_campaigns_rels_email_lists_id_idx\` ON \`email_campaigns_rels\` (\`email_lists_id\`);`)
  await db.run(sql`CREATE TABLE \`client_requests_website_pages\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`client_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`client_requests_website_pages_order_idx\` ON \`client_requests_website_pages\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`client_requests_website_pages_parent_idx\` ON \`client_requests_website_pages\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`client_requests_payment_methods\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`client_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`client_requests_payment_methods_order_idx\` ON \`client_requests_payment_methods\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`client_requests_payment_methods_parent_idx\` ON \`client_requests_payment_methods\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`client_requests\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`company_name\` text NOT NULL,
  	\`contact_name\` text NOT NULL,
  	\`contact_email\` text NOT NULL,
  	\`contact_phone\` text,
  	\`site_type\` text NOT NULL,
  	\`expected_products\` text,
  	\`message\` text,
  	\`domain\` text,
  	\`admin_notes\` text,
  	\`created_user_id\` integer,
  	\`created_client_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`created_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`created_client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`client_requests_created_user_idx\` ON \`client_requests\` (\`created_user_id\`);`)
  await db.run(sql`CREATE INDEX \`client_requests_created_client_idx\` ON \`client_requests\` (\`created_client_id\`);`)
  await db.run(sql`CREATE INDEX \`client_requests_updated_at_idx\` ON \`client_requests\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`client_requests_created_at_idx\` ON \`client_requests\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`clients\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`plan\` text DEFAULT 'starter',
  	\`name\` text NOT NULL,
  	\`domain\` text NOT NULL,
  	\`contact_email\` text NOT NULL,
  	\`contact_name\` text,
  	\`contact_phone\` text,
  	\`template\` text DEFAULT 'corporate' NOT NULL,
  	\`features_shop\` integer DEFAULT true,
  	\`features_volume_pricing\` integer DEFAULT false,
  	\`features_compare_products\` integer DEFAULT false,
  	\`features_quick_order\` integer DEFAULT false,
  	\`features_brands\` integer DEFAULT false,
  	\`features_recently_viewed\` integer DEFAULT false,
  	\`features_product_reviews\` integer DEFAULT false,
  	\`features_cart\` integer DEFAULT true,
  	\`features_mini_cart\` integer DEFAULT false,
  	\`features_free_shipping_bar\` integer DEFAULT false,
  	\`features_checkout\` integer DEFAULT true,
  	\`features_guest_checkout\` integer DEFAULT false,
  	\`features_invoices\` integer DEFAULT false,
  	\`features_order_tracking\` integer DEFAULT false,
  	\`features_my_account\` integer DEFAULT true,
  	\`features_returns\` integer DEFAULT false,
  	\`features_recurring_orders\` integer DEFAULT false,
  	\`features_order_lists\` integer DEFAULT false,
  	\`features_addresses\` integer DEFAULT false,
  	\`features_account_invoices\` integer DEFAULT false,
  	\`features_notifications\` integer DEFAULT false,
  	\`features_b2b\` integer DEFAULT false,
  	\`features_customer_groups\` integer DEFAULT false,
  	\`features_group_pricing\` integer DEFAULT false,
  	\`features_barcode_scanner\` integer DEFAULT false,
  	\`features_vendors\` integer DEFAULT false,
  	\`features_vendor_reviews\` integer DEFAULT false,
  	\`features_workshops\` integer DEFAULT false,
  	\`features_subscriptions\` integer DEFAULT false,
  	\`features_gift_vouchers\` integer DEFAULT false,
  	\`features_licenses\` integer DEFAULT false,
  	\`features_loyalty\` integer DEFAULT false,
  	\`features_blog\` integer DEFAULT true,
  	\`features_faq\` integer DEFAULT true,
  	\`features_testimonials\` integer DEFAULT true,
  	\`features_cases\` integer DEFAULT false,
  	\`features_partners\` integer DEFAULT false,
  	\`features_services\` integer DEFAULT false,
  	\`features_wishlists\` integer DEFAULT false,
  	\`features_multi_language\` integer DEFAULT false,
  	\`features_ai_content\` integer DEFAULT false,
  	\`features_search\` integer DEFAULT false,
  	\`features_newsletter\` integer DEFAULT false,
  	\`features_authentication\` integer DEFAULT true,
  	\`deployment_url\` text,
  	\`admin_url\` text,
  	\`deployment_provider\` text,
  	\`last_deployed_at\` text,
  	\`deployment_provider_id\` text,
  	\`last_deployment_id\` text,
  	\`database_url\` text,
  	\`database_provider_id\` text,
  	\`port\` numeric,
  	\`admin_email\` text,
  	\`initial_admin_password\` text,
  	\`custom_environment\` text,
  	\`custom_settings\` text,
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
  await db.run(sql`CREATE UNIQUE INDEX \`clients_domain_idx\` ON \`clients\` (\`domain\`);`)
  await db.run(sql`CREATE INDEX \`clients_updated_at_idx\` ON \`clients\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`clients_created_at_idx\` ON \`clients\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`deployments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`environment\` text DEFAULT 'production' NOT NULL,
  	\`type\` text NOT NULL,
  	\`version\` text,
  	\`git_branch\` text,
  	\`git_commit\` text,
  	\`started_at\` text,
  	\`completed_at\` text,
  	\`duration\` numeric,
  	\`reason\` text,
  	\`notes\` text,
  	\`triggered_by\` text,
  	\`logs\` text,
  	\`error_message\` text,
  	\`error_stack\` text,
  	\`vercel_deployment_id\` text,
  	\`vercel_deployment_url\` text,
  	\`vercel_project_id\` text,
  	\`config_snapshot\` text,
  	\`environment_snapshot\` text,
  	\`health_check_passed\` integer,
  	\`health_check_results\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`deployments_client_idx\` ON \`deployments\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX \`deployments_updated_at_idx\` ON \`deployments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`deployments_created_at_idx\` ON \`deployments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_checkbox\` (
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
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_order_idx\` ON \`forms_blocks_checkbox\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_parent_id_idx\` ON \`forms_blocks_checkbox\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_path_idx\` ON \`forms_blocks_checkbox\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_email\` (
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
  await db.run(sql`CREATE INDEX \`forms_blocks_email_order_idx\` ON \`forms_blocks_email\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_parent_id_idx\` ON \`forms_blocks_email\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_path_idx\` ON \`forms_blocks_email\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_message\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`message\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_order_idx\` ON \`forms_blocks_message\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_parent_id_idx\` ON \`forms_blocks_message\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_path_idx\` ON \`forms_blocks_message\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_number\` (
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
  await db.run(sql`CREATE INDEX \`forms_blocks_number_order_idx\` ON \`forms_blocks_number\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_parent_id_idx\` ON \`forms_blocks_number\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_path_idx\` ON \`forms_blocks_number\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_select_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_options_order_idx\` ON \`forms_blocks_select_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_options_parent_id_idx\` ON \`forms_blocks_select_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_select\` (
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
  await db.run(sql`CREATE INDEX \`forms_blocks_select_order_idx\` ON \`forms_blocks_select\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_parent_id_idx\` ON \`forms_blocks_select\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_path_idx\` ON \`forms_blocks_select\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_text\` (
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
  await db.run(sql`CREATE INDEX \`forms_blocks_text_order_idx\` ON \`forms_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_parent_id_idx\` ON \`forms_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_path_idx\` ON \`forms_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_textarea\` (
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
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_order_idx\` ON \`forms_blocks_textarea\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_parent_id_idx\` ON \`forms_blocks_textarea\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_path_idx\` ON \`forms_blocks_textarea\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_emails\` (
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
  await db.run(sql`CREATE INDEX \`forms_emails_order_idx\` ON \`forms_emails\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_emails_parent_id_idx\` ON \`forms_emails\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`forms\` (
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
  await db.run(sql`CREATE INDEX \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`form_submissions_submission_data\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_submission_data_order_idx\` ON \`form_submissions_submission_data\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_submission_data_parent_id_idx\` ON \`form_submissions_submission_data\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`form_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_form_idx\` ON \`form_submissions\` (\`form_id\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`redirects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`from\` text NOT NULL,
  	\`to_type\` text DEFAULT 'reference',
  	\`to_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`redirects_from_idx\` ON \`redirects\` (\`from\`);`)
  await db.run(sql`CREATE INDEX \`redirects_updated_at_idx\` ON \`redirects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`redirects_created_at_idx\` ON \`redirects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`redirects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`redirects_rels_order_idx\` ON \`redirects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_parent_idx\` ON \`redirects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_path_idx\` ON \`redirects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_pages_id_idx\` ON \`redirects_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`pages_id\` integer,
  	\`media_id\` integer,
  	\`partners_id\` integer,
  	\`services_id\` integer,
  	\`notifications_id\` integer,
  	\`themes_id\` integer,
  	\`products_id\` integer,
  	\`product_categories_id\` integer,
  	\`brands_id\` integer,
  	\`recently_viewed_id\` integer,
  	\`edition_notifications_id\` integer,
  	\`customer_groups_id\` integer,
  	\`orders_id\` integer,
  	\`order_lists_id\` integer,
  	\`recurring_orders_id\` integer,
  	\`invoices_id\` integer,
  	\`returns_id\` integer,
  	\`subscription_plans_id\` integer,
  	\`user_subscriptions_id\` integer,
  	\`payment_methods_id\` integer,
  	\`gift_vouchers_id\` integer,
  	\`licenses_id\` integer,
  	\`license_activations_id\` integer,
  	\`loyalty_tiers_id\` integer,
  	\`loyalty_rewards_id\` integer,
  	\`loyalty_points_id\` integer,
  	\`loyalty_transactions_id\` integer,
  	\`loyalty_redemptions_id\` integer,
  	\`ab_tests_id\` integer,
  	\`ab_test_results_id\` integer,
  	\`blog_posts_id\` integer,
  	\`blog_categories_id\` integer,
  	\`faqs_id\` integer,
  	\`cases_id\` integer,
  	\`testimonials_id\` integer,
  	\`vendors_id\` integer,
  	\`vendor_reviews_id\` integer,
  	\`workshops_id\` integer,
  	\`construction_services_id\` integer,
  	\`construction_projects_id\` integer,
  	\`construction_reviews_id\` integer,
  	\`quote_requests_id\` integer,
  	\`treatments_id\` integer,
  	\`practitioners_id\` integer,
  	\`appointments_id\` integer,
  	\`beauty_services_id\` integer,
  	\`stylists_id\` integer,
  	\`beauty_bookings_id\` integer,
  	\`menu_items_id\` integer,
  	\`reservations_id\` integer,
  	\`events_id\` integer,
  	\`email_subscribers_id\` integer,
  	\`email_lists_id\` integer,
  	\`email_templates_id\` integer,
  	\`email_campaigns_id\` integer,
  	\`client_requests_id\` integer,
  	\`clients_id\` integer,
  	\`deployments_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`redirects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partners_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`notifications_id\`) REFERENCES \`notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`themes_id\`) REFERENCES \`themes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`brands_id\`) REFERENCES \`brands\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`recently_viewed_id\`) REFERENCES \`recently_viewed\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`edition_notifications_id\`) REFERENCES \`edition_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`customer_groups_id\`) REFERENCES \`customer_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`order_lists_id\`) REFERENCES \`order_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`recurring_orders_id\`) REFERENCES \`recurring_orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`invoices_id\`) REFERENCES \`invoices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`returns_id\`) REFERENCES \`returns\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`subscription_plans_id\`) REFERENCES \`subscription_plans\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`user_subscriptions_id\`) REFERENCES \`user_subscriptions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payment_methods_id\`) REFERENCES \`payment_methods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gift_vouchers_id\`) REFERENCES \`gift_vouchers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`licenses_id\`) REFERENCES \`licenses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`license_activations_id\`) REFERENCES \`license_activations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`loyalty_tiers_id\`) REFERENCES \`loyalty_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`loyalty_rewards_id\`) REFERENCES \`loyalty_rewards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`loyalty_points_id\`) REFERENCES \`loyalty_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`loyalty_transactions_id\`) REFERENCES \`loyalty_transactions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`loyalty_redemptions_id\`) REFERENCES \`loyalty_redemptions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ab_tests_id\`) REFERENCES \`ab_tests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ab_test_results_id\`) REFERENCES \`ab_test_results\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_categories_id\`) REFERENCES \`blog_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendors_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendor_reviews_id\`) REFERENCES \`vendor_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`workshops_id\`) REFERENCES \`workshops\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_services_id\`) REFERENCES \`construction_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_projects_id\`) REFERENCES \`construction_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`construction_reviews_id\`) REFERENCES \`construction_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`quote_requests_id\`) REFERENCES \`quote_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`treatments_id\`) REFERENCES \`treatments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`practitioners_id\`) REFERENCES \`practitioners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`appointments_id\`) REFERENCES \`appointments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`beauty_services_id\`) REFERENCES \`beauty_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stylists_id\`) REFERENCES \`stylists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`beauty_bookings_id\`) REFERENCES \`beauty_bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`menu_items_id\`) REFERENCES \`menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reservations_id\`) REFERENCES \`reservations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_subscribers_id\`) REFERENCES \`email_subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_lists_id\`) REFERENCES \`email_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_templates_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_campaigns_id\`) REFERENCES \`email_campaigns\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_requests_id\`) REFERENCES \`client_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`deployments_id\`) REFERENCES \`deployments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_partners_id_idx\` ON \`payload_locked_documents_rels\` (\`partners_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_themes_id_idx\` ON \`payload_locked_documents_rels\` (\`themes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_brands_id_idx\` ON \`payload_locked_documents_rels\` (\`brands_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_recently_viewed_id_idx\` ON \`payload_locked_documents_rels\` (\`recently_viewed_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_edition_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`edition_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_customer_groups_id_idx\` ON \`payload_locked_documents_rels\` (\`customer_groups_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_lists_id_idx\` ON \`payload_locked_documents_rels\` (\`order_lists_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_recurring_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`recurring_orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_invoices_id_idx\` ON \`payload_locked_documents_rels\` (\`invoices_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_returns_id_idx\` ON \`payload_locked_documents_rels\` (\`returns_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscription_plans_id_idx\` ON \`payload_locked_documents_rels\` (\`subscription_plans_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_user_subscriptions_id_idx\` ON \`payload_locked_documents_rels\` (\`user_subscriptions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payment_methods_id_idx\` ON \`payload_locked_documents_rels\` (\`payment_methods_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gift_vouchers_id_idx\` ON \`payload_locked_documents_rels\` (\`gift_vouchers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_licenses_id_idx\` ON \`payload_locked_documents_rels\` (\`licenses_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_license_activations_id_idx\` ON \`payload_locked_documents_rels\` (\`license_activations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_loyalty_tiers_id_idx\` ON \`payload_locked_documents_rels\` (\`loyalty_tiers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_loyalty_rewards_id_idx\` ON \`payload_locked_documents_rels\` (\`loyalty_rewards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_loyalty_points_id_idx\` ON \`payload_locked_documents_rels\` (\`loyalty_points_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_loyalty_transactions_id_idx\` ON \`payload_locked_documents_rels\` (\`loyalty_transactions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_loyalty_redemptions_id_idx\` ON \`payload_locked_documents_rels\` (\`loyalty_redemptions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ab_tests_id_idx\` ON \`payload_locked_documents_rels\` (\`ab_tests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ab_test_results_id_idx\` ON \`payload_locked_documents_rels\` (\`ab_test_results_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blog_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blog_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cases_id_idx\` ON \`payload_locked_documents_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_vendors_id_idx\` ON \`payload_locked_documents_rels\` (\`vendors_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_vendor_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`vendor_reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_workshops_id_idx\` ON \`payload_locked_documents_rels\` (\`workshops_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_construction_services_id_idx\` ON \`payload_locked_documents_rels\` (\`construction_services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_construction_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`construction_projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_construction_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`construction_reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_quote_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`quote_requests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_treatments_id_idx\` ON \`payload_locked_documents_rels\` (\`treatments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_practitioners_id_idx\` ON \`payload_locked_documents_rels\` (\`practitioners_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_appointments_id_idx\` ON \`payload_locked_documents_rels\` (\`appointments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_beauty_services_id_idx\` ON \`payload_locked_documents_rels\` (\`beauty_services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_stylists_id_idx\` ON \`payload_locked_documents_rels\` (\`stylists_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_beauty_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`beauty_bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_menu_items_id_idx\` ON \`payload_locked_documents_rels\` (\`menu_items_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reservations_id_idx\` ON \`payload_locked_documents_rels\` (\`reservations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`email_subscribers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_lists_id_idx\` ON \`payload_locked_documents_rels\` (\`email_lists_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_templates_id_idx\` ON \`payload_locked_documents_rels\` (\`email_templates_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_campaigns_id_idx\` ON \`payload_locked_documents_rels\` (\`email_campaigns_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`client_requests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_deployments_id_idx\` ON \`payload_locked_documents_rels\` (\`deployments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`settings_hours\` (
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
  await db.run(sql`CREATE INDEX \`settings_hours_order_idx\` ON \`settings_hours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_hours_parent_id_idx\` ON \`settings_hours\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_sitemap_exclude\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_sitemap_exclude_order_idx\` ON \`settings_sitemap_exclude\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_sitemap_exclude_parent_id_idx\` ON \`settings_sitemap_exclude\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_robots_disallow\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`path\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_robots_disallow_order_idx\` ON \`settings_robots_disallow\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_robots_disallow_parent_id_idx\` ON \`settings_robots_disallow\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
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
  	\`default_product_template\` text DEFAULT 'template1',
  	\`default_blog_template\` text DEFAULT 'blogtemplate1',
  	\`default_shop_archive_template\` text DEFAULT 'shoparchivetemplate1',
  	\`default_cart_template\` text DEFAULT 'template1',
  	\`default_checkout_template\` text DEFAULT 'checkouttemplate1',
  	\`default_my_account_template\` text DEFAULT 'myaccounttemplate1',
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
  	\`enable_guest_checkout\` integer DEFAULT false,
  	\`require_b2_b_approval\` integer DEFAULT true,
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
  await db.run(sql`CREATE INDEX \`settings_logo_idx\` ON \`settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_logo_white_idx\` ON \`settings\` (\`logo_white_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_favicon_idx\` ON \`settings\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_default_o_g_image_idx\` ON \`settings\` (\`default_o_g_image_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_rels_order_idx\` ON \`settings_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`settings_rels_parent_idx\` ON \`settings_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_rels_path_idx\` ON \`settings_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`settings_rels_media_id_idx\` ON \`settings_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`navy\` text DEFAULT '#0A1628',
  	\`navy_light\` text DEFAULT '#121F33',
  	\`teal\` text DEFAULT '#00897B',
  	\`teal_light\` text DEFAULT '#26A69A',
  	\`teal_dark\` text DEFAULT '#00695C',
  	\`green\` text DEFAULT '#00C853',
  	\`coral\` text DEFAULT '#FF6B6B',
  	\`amber\` text DEFAULT '#F59E0B',
  	\`blue\` text DEFAULT '#2196F3',
  	\`purple\` text DEFAULT '#7C3AED',
  	\`white\` text DEFAULT '#FAFBFC',
  	\`bg\` text DEFAULT '#F5F7FA',
  	\`grey\` text DEFAULT '#E8ECF1',
  	\`grey_mid\` text DEFAULT '#94A3B8',
  	\`grey_dark\` text DEFAULT '#64748B',
  	\`text\` text DEFAULT '#1E293B',
  	\`font_body\` text DEFAULT '''Plus Jakarta Sans'', ''DM Sans'', system-ui, sans-serif',
  	\`font_display\` text DEFAULT '''DM Serif Display'', Georgia, serif',
  	\`font_mono\` text DEFAULT '''JetBrains Mono'', ''Courier New'', monospace',
  	\`hero_size\` numeric DEFAULT 36,
  	\`section_size\` numeric DEFAULT 24,
  	\`card_title_size\` numeric DEFAULT 18,
  	\`body_lg_size\` numeric DEFAULT 15,
  	\`body_size\` numeric DEFAULT 13,
  	\`small_size\` numeric DEFAULT 12,
  	\`label_size\` numeric DEFAULT 10,
  	\`micro_size\` numeric DEFAULT 8,
  	\`sp1\` numeric DEFAULT 4 NOT NULL,
  	\`sp2\` numeric DEFAULT 8 NOT NULL,
  	\`sp3\` numeric DEFAULT 12 NOT NULL,
  	\`sp4\` numeric DEFAULT 16 NOT NULL,
  	\`sp6\` numeric DEFAULT 24 NOT NULL,
  	\`sp8\` numeric DEFAULT 32 NOT NULL,
  	\`sp12\` numeric DEFAULT 48 NOT NULL,
  	\`sp16\` numeric DEFAULT 64 NOT NULL,
  	\`sp20\` numeric DEFAULT 80 NOT NULL,
  	\`primary_gradient\` text DEFAULT 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
  	\`secondary_gradient\` text DEFAULT 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)',
  	\`hero_gradient\` text DEFAULT 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)',
  	\`accent_gradient\` text DEFAULT 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
  	\`radius_sm\` numeric DEFAULT 8 NOT NULL,
  	\`radius_md\` numeric DEFAULT 12 NOT NULL,
  	\`radius_lg\` numeric DEFAULT 16 NOT NULL,
  	\`radius_xl\` numeric DEFAULT 20 NOT NULL,
  	\`radius_full\` numeric DEFAULT 9999 NOT NULL,
  	\`shadow_sm\` text DEFAULT '0 1px 3px rgba(10, 22, 40, 0.06)' NOT NULL,
  	\`shadow_md\` text DEFAULT '0 4px 20px rgba(10, 22, 40, 0.08)' NOT NULL,
  	\`shadow_lg\` text DEFAULT '0 8px 40px rgba(10, 22, 40, 0.12)' NOT NULL,
  	\`shadow_xl\` text DEFAULT '0 20px 60px rgba(10, 22, 40, 0.16)' NOT NULL,
  	\`z_dropdown\` numeric DEFAULT 100 NOT NULL,
  	\`z_sticky\` numeric DEFAULT 200 NOT NULL,
  	\`z_overlay\` numeric DEFAULT 300 NOT NULL,
  	\`z_modal\` numeric DEFAULT 400 NOT NULL,
  	\`z_toast\` numeric DEFAULT 500 NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`header_topbar_messages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_topbar_messages_order_idx\` ON \`header_topbar_messages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_topbar_messages_parent_id_idx\` ON \`header_topbar_messages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header_topbar_right_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_topbar_right_links_order_idx\` ON \`header_topbar_right_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_topbar_right_links_parent_id_idx\` ON \`header_topbar_right_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header_languages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`code\` text,
  	\`label\` text,
  	\`flag\` text,
  	\`is_default\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_languages_order_idx\` ON \`header_languages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_languages_parent_id_idx\` ON \`header_languages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header_special_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`icon\` text,
  	\`url\` text NOT NULL,
  	\`highlight\` integer DEFAULT false,
  	\`position\` text DEFAULT 'end',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_special_nav_items_order_idx\` ON \`header_special_nav_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_special_nav_items_parent_id_idx\` ON \`header_special_nav_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header_manual_nav_items_mega_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`icon\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_manual_nav_items_mega_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_mega_columns_links_order_idx\` ON \`header_manual_nav_items_mega_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_mega_columns_links_parent_id_idx\` ON \`header_manual_nav_items_mega_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header_manual_nav_items_mega_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_manual_nav_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_mega_columns_order_idx\` ON \`header_manual_nav_items_mega_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_mega_columns_parent_id_idx\` ON \`header_manual_nav_items_mega_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header_manual_nav_items_sub_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`page_id\` integer,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_manual_nav_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_sub_items_order_idx\` ON \`header_manual_nav_items_sub_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_sub_items_parent_id_idx\` ON \`header_manual_nav_items_sub_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_sub_items_page_idx\` ON \`header_manual_nav_items_sub_items\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`header_manual_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`icon\` text,
  	\`type\` text DEFAULT 'page',
  	\`page_id\` integer,
  	\`url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_order_idx\` ON \`header_manual_nav_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_parent_id_idx\` ON \`header_manual_nav_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`header_manual_nav_items_page_idx\` ON \`header_manual_nav_items\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`header_search_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_search_categories_order_idx\` ON \`header_search_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_search_categories_parent_id_idx\` ON \`header_search_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header_custom_action_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`icon\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`show_badge\` integer DEFAULT false,
  	\`show_on_mobile\` integer DEFAULT true,
  	\`style\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_custom_action_buttons_order_idx\` ON \`header_custom_action_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_custom_action_buttons_parent_id_idx\` ON \`header_custom_action_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`layout_type\` text DEFAULT 'mega-nav' NOT NULL,
  	\`show_topbar\` integer DEFAULT true,
  	\`show_alert_bar\` integer DEFAULT false,
  	\`show_navigation\` integer DEFAULT true,
  	\`show_search_bar\` integer DEFAULT true,
  	\`topbar_enabled\` integer DEFAULT true,
  	\`topbar_bg_color\` text DEFAULT 'var(--color-primary)',
  	\`topbar_text_color\` text DEFAULT 'var(--color-white)',
  	\`enable_language_switcher\` integer DEFAULT false,
  	\`enable_price_toggle\` integer DEFAULT false,
  	\`price_toggle_default_mode\` text DEFAULT 'b2c',
  	\`price_toggle_b2c_label\` text DEFAULT 'Particulier',
  	\`price_toggle_b2b_label\` text DEFAULT 'Zakelijk',
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
  	\`logo_id\` integer,
  	\`logo_height\` numeric DEFAULT 32,
  	\`logo_url\` text DEFAULT '/',
  	\`site_name\` text,
  	\`site_name_accent\` text,
  	\`show_logo_on_mobile\` integer DEFAULT true,
  	\`navigation_mode\` text DEFAULT 'manual' NOT NULL,
  	\`category_navigation_show_category_icons\` integer DEFAULT true,
  	\`category_navigation_show_product_count\` integer DEFAULT true,
  	\`category_navigation_mega_menu_style\` text DEFAULT 'subcategories',
  	\`category_navigation_max_categories\` numeric DEFAULT 8,
  	\`category_navigation_max_products_in_mega\` numeric DEFAULT 3,
  	\`cta_button_enabled\` integer DEFAULT false,
  	\`cta_button_text\` text DEFAULT 'Contact',
  	\`cta_button_link\` text DEFAULT '/contact',
  	\`cta_button_style\` text DEFAULT 'primary',
  	\`search_enabled\` integer DEFAULT true,
  	\`search_placeholder\` text DEFAULT 'Zoeken naar producten...',
  	\`search_keyboard_shortcut\` text DEFAULT '⌘K',
  	\`enable_search_overlay\` integer DEFAULT true,
  	\`enable_search_suggestions\` integer DEFAULT true,
  	\`show_phone_button\` integer DEFAULT true,
  	\`show_cart_button\` integer DEFAULT true,
  	\`show_account_button\` integer DEFAULT true,
  	\`show_wishlist_button\` integer DEFAULT false,
  	\`mobile_drawer_width\` numeric DEFAULT 320,
  	\`mobile_drawer_position\` text DEFAULT 'left',
  	\`show_mobile_contact_info\` integer DEFAULT true,
  	\`mobile_contact_info_phone\` text,
  	\`mobile_contact_info_email\` text,
  	\`show_mobile_toggles\` integer DEFAULT true,
  	\`mobile_breakpoint\` numeric DEFAULT 768,
  	\`use_theme_colors\` integer DEFAULT true,
  	\`header_bg_color\` text DEFAULT 'var(--color-white)',
  	\`nav_bg_color\` text DEFAULT 'var(--color-primary)',
  	\`nav_text_color\` text DEFAULT 'var(--color-white)',
  	\`sticky_header_bg\` text,
  	\`sticky_header_shadow\` integer DEFAULT true,
  	\`sticky_header\` integer DEFAULT true,
  	\`sticky_behavior\` text DEFAULT 'always',
  	\`hide_topbar_on_scroll\` integer DEFAULT false,
  	\`enable_animations\` integer DEFAULT true,
  	\`dropdown_open_delay\` numeric DEFAULT 150,
  	\`dropdown_close_delay\` numeric DEFAULT 300,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`header_logo_idx\` ON \`header\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_columns_links\` (
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
  await db.run(sql`CREATE INDEX \`footer_columns_links_order_idx\` ON \`footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_columns_links_parent_id_idx\` ON \`footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_columns_links_page_idx\` ON \`footer_columns_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_columns_order_idx\` ON \`footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_columns_parent_id_idx\` ON \`footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`bottom_text\` text,
  	\`show_social_links\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_indexed_collections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`collection\` text NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`priority\` numeric DEFAULT 1,
  	\`index_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_indexed_collections_order_idx\` ON \`meilisearch_settings_indexed_collections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_indexed_collections_parent_id_idx\` ON \`meilisearch_settings_indexed_collections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_searchable_fields_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_searchable_fields_products_order_idx\` ON \`meilisearch_settings_searchable_fields_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_searchable_fields_products_parent_id_idx\` ON \`meilisearch_settings_searchable_fields_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_searchable_fields_blog_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_searchable_fields_blog_posts_order_idx\` ON \`meilisearch_settings_searchable_fields_blog_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_searchable_fields_blog_posts_parent_id_idx\` ON \`meilisearch_settings_searchable_fields_blog_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_searchable_fields_pages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_searchable_fields_pages_order_idx\` ON \`meilisearch_settings_searchable_fields_pages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_searchable_fields_pages_parent_id_idx\` ON \`meilisearch_settings_searchable_fields_pages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_filterable_fields_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_filterable_fields_products_order_idx\` ON \`meilisearch_settings_filterable_fields_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_filterable_fields_products_parent_id_idx\` ON \`meilisearch_settings_filterable_fields_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_filterable_fields_blog_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_filterable_fields_blog_posts_order_idx\` ON \`meilisearch_settings_filterable_fields_blog_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_filterable_fields_blog_posts_parent_id_idx\` ON \`meilisearch_settings_filterable_fields_blog_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_sortable_fields_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_sortable_fields_products_order_idx\` ON \`meilisearch_settings_sortable_fields_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_sortable_fields_products_parent_id_idx\` ON \`meilisearch_settings_sortable_fields_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_sortable_fields_blog_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_sortable_fields_blog_posts_order_idx\` ON \`meilisearch_settings_sortable_fields_blog_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_sortable_fields_blog_posts_parent_id_idx\` ON \`meilisearch_settings_sortable_fields_blog_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_ranking_rules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`rule\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_ranking_rules_order_idx\` ON \`meilisearch_settings_ranking_rules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_ranking_rules_parent_id_idx\` ON \`meilisearch_settings_ranking_rules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_custom_ranking_attributes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`attribute\` text NOT NULL,
  	\`order\` text DEFAULT 'desc' NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_custom_ranking_attributes_order_idx\` ON \`meilisearch_settings_custom_ranking_attributes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_custom_ranking_attributes_parent_id_idx\` ON \`meilisearch_settings_custom_ranking_attributes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_typo_tolerance_disable_on_words\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`word\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_typo_tolerance_disable_on_words_order_idx\` ON \`meilisearch_settings_typo_tolerance_disable_on_words\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_typo_tolerance_disable_on_words_parent_id_idx\` ON \`meilisearch_settings_typo_tolerance_disable_on_words\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_synonyms\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_synonyms_order_idx\` ON \`meilisearch_settings_synonyms\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_synonyms_parent_id_idx\` ON \`meilisearch_settings_synonyms\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_stop_words\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`word\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_stop_words_order_idx\` ON \`meilisearch_settings_stop_words\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_stop_words_parent_id_idx\` ON \`meilisearch_settings_stop_words\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_exclude_patterns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pattern\` text NOT NULL,
  	\`type\` text DEFAULT 'url' NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_exclude_patterns_order_idx\` ON \`meilisearch_settings_exclude_patterns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_exclude_patterns_parent_id_idx\` ON \`meilisearch_settings_exclude_patterns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings_exclude_statuses\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`status\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`meilisearch_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_exclude_statuses_order_idx\` ON \`meilisearch_settings_exclude_statuses\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`meilisearch_settings_exclude_statuses_parent_id_idx\` ON \`meilisearch_settings_exclude_statuses\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`meilisearch_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`typo_tolerance_enabled\` integer DEFAULT true,
  	\`typo_tolerance_min_word_size_for_one_typo\` numeric DEFAULT 4,
  	\`typo_tolerance_min_word_size_for_two_typos\` numeric DEFAULT 8,
  	\`auto_indexing_enabled\` integer DEFAULT true,
  	\`auto_indexing_index_on_publish\` integer DEFAULT true,
  	\`auto_indexing_batch_size\` numeric DEFAULT 100,
  	\`auto_indexing_debounce_ms\` numeric DEFAULT 1000,
  	\`pagination_max_total_hits\` numeric DEFAULT 1000,
  	\`pagination_default_limit\` numeric DEFAULT 20,
  	\`pagination_max_limit\` numeric DEFAULT 100,
  	\`performance_enable_highlighting\` integer DEFAULT true,
  	\`performance_highlight_pre_tag\` text DEFAULT '<mark>',
  	\`performance_highlight_post_tag\` text DEFAULT '</mark>',
  	\`performance_crop_length\` numeric DEFAULT 200,
  	\`performance_crop_marker\` text DEFAULT '...',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`chatbot_settings_suggested_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chatbot_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_settings_suggested_questions_order_idx\` ON \`chatbot_settings_suggested_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_settings_suggested_questions_parent_id_idx\` ON \`chatbot_settings_suggested_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_kb_search_collections\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`chatbot_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_kb_search_collections_order_idx\` ON \`chatbot_kb_search_collections\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_kb_search_collections_parent_idx\` ON \`chatbot_kb_search_collections\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings_rate_limiting_blocked_i_ps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ip\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chatbot_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_settings_rate_limiting_blocked_i_ps_order_idx\` ON \`chatbot_settings_rate_limiting_blocked_i_ps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_settings_rate_limiting_blocked_i_ps_parent_id_idx\` ON \`chatbot_settings_rate_limiting_blocked_i_ps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings_moderation_blocked_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chatbot_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_settings_moderation_blocked_keywords_order_idx\` ON \`chatbot_settings_moderation_blocked_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_settings_moderation_blocked_keywords_parent_id_idx\` ON \`chatbot_settings_moderation_blocked_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`model\` text DEFAULT 'groq' NOT NULL,
  	\`temperature\` numeric DEFAULT 0.7,
  	\`max_tokens\` numeric DEFAULT 500,
  	\`context_window\` numeric DEFAULT 5,
  	\`position\` text DEFAULT 'bottom-right' NOT NULL,
  	\`button_color\` text DEFAULT '#0ea5e9',
  	\`button_icon\` text DEFAULT 'chat',
  	\`welcome_message\` text DEFAULT 'Hallo! Hoe kan ik je helpen?',
  	\`placeholder\` text DEFAULT 'Typ je vraag...',
  	\`system_prompt\` text,
  	\`knowledge_base_integration_enabled\` integer DEFAULT true,
  	\`knowledge_base_integration_max_results\` numeric DEFAULT 3,
  	\`knowledge_base_integration_include_source_links\` integer DEFAULT true,
  	\`training_context\` text,
  	\`rate_limiting_enabled\` integer DEFAULT true,
  	\`rate_limiting_max_messages_per_hour\` numeric DEFAULT 20,
  	\`rate_limiting_max_messages_per_day\` numeric DEFAULT 50,
  	\`rate_limiting_cooldown_seconds\` numeric DEFAULT 3,
  	\`moderation_enabled\` integer DEFAULT true,
  	\`api_configuration_groq_api_key\` text,
  	\`api_configuration_openai_api_key\` text,
  	\`api_configuration_ollama_url\` text,
  	\`analytics_enable_logging\` integer DEFAULT true,
  	\`analytics_enable_analytics\` integer DEFAULT true,
  	\`analytics_retention_days\` numeric DEFAULT 30,
  	\`fallback_enable_fallback\` integer DEFAULT true,
  	\`fallback_fallback_message\` text DEFAULT 'Sorry, ik kan momenteel geen antwoord geven. Neem contact op via info@bedrijf.nl of bel 020-1234567.',
  	\`fallback_contact_email\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_addresses\`;`)
  await db.run(sql`DROP TABLE \`users_roles\`;`)
  await db.run(sql`DROP TABLE \`users_favorites\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_banner\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_block_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_two_column\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_product_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_quick_order\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_calltoaction\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_opening_hours\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_form\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_newsletter\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features_features\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_services\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cases\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_logo_bar_logos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_logo_bar\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_faqs\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_members\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_blog_preview\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_columns\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_rows_values\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_rows\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_infobox\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_gallery\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_code\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_construction_hero_avatars\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_construction_hero_floating_badges\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_construction_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_projects_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_reviews_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_bar_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_bar\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_banner_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_banner_trust_elements_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_banner\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_banner\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_block_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_two_column\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_product_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_quick_order\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_calltoaction\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_opening_hours\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_form\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_newsletter\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_features\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services_services\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cases\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_logo_bar_logos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_logo_bar\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_faqs\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_members\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_blog_preview\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_columns\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_rows_values\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_rows\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_infobox\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_image_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_image_gallery\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_code\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_construction_hero_avatars\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_construction_hero_floating_badges\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_construction_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_projects_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_reviews_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_bar_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_bar\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_banner_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_banner_trust_elements_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_banner\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`partners\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`notifications\`;`)
  await db.run(sql`DROP TABLE \`themes_custom_colors\`;`)
  await db.run(sql`DROP TABLE \`themes\`;`)
  await db.run(sql`DROP TABLE \`products_tags\`;`)
  await db.run(sql`DROP TABLE \`products_group_prices\`;`)
  await db.run(sql`DROP TABLE \`products_volume_pricing\`;`)
  await db.run(sql`DROP TABLE \`products_videos\`;`)
  await db.run(sql`DROP TABLE \`products_child_products\`;`)
  await db.run(sql`DROP TABLE \`products_meta_keywords\`;`)
  await db.run(sql`DROP TABLE \`products_specifications_attributes\`;`)
  await db.run(sql`DROP TABLE \`products_specifications\`;`)
  await db.run(sql`DROP TABLE \`products_variant_options_values\`;`)
  await db.run(sql`DROP TABLE \`products_variant_options\`;`)
  await db.run(sql`DROP TABLE \`products_mix_match_config_box_sizes\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`product_categories\`;`)
  await db.run(sql`DROP TABLE \`brands\`;`)
  await db.run(sql`DROP TABLE \`recently_viewed\`;`)
  await db.run(sql`DROP TABLE \`edition_notifications\`;`)
  await db.run(sql`DROP TABLE \`customer_groups\`;`)
  await db.run(sql`DROP TABLE \`orders_items\`;`)
  await db.run(sql`DROP TABLE \`orders_timeline\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`DROP TABLE \`order_lists_items\`;`)
  await db.run(sql`DROP TABLE \`order_lists_share_with\`;`)
  await db.run(sql`DROP TABLE \`order_lists\`;`)
  await db.run(sql`DROP TABLE \`recurring_orders_items\`;`)
  await db.run(sql`DROP TABLE \`recurring_orders\`;`)
  await db.run(sql`DROP TABLE \`recurring_orders_rels\`;`)
  await db.run(sql`DROP TABLE \`invoices_items\`;`)
  await db.run(sql`DROP TABLE \`invoices\`;`)
  await db.run(sql`DROP TABLE \`returns_items\`;`)
  await db.run(sql`DROP TABLE \`returns\`;`)
  await db.run(sql`DROP TABLE \`returns_rels\`;`)
  await db.run(sql`DROP TABLE \`subscription_plans_features\`;`)
  await db.run(sql`DROP TABLE \`subscription_plans\`;`)
  await db.run(sql`DROP TABLE \`user_subscriptions_addons\`;`)
  await db.run(sql`DROP TABLE \`user_subscriptions\`;`)
  await db.run(sql`DROP TABLE \`payment_methods\`;`)
  await db.run(sql`DROP TABLE \`gift_vouchers\`;`)
  await db.run(sql`DROP TABLE \`licenses_downloads\`;`)
  await db.run(sql`DROP TABLE \`licenses\`;`)
  await db.run(sql`DROP TABLE \`license_activations\`;`)
  await db.run(sql`DROP TABLE \`loyalty_tiers_benefits\`;`)
  await db.run(sql`DROP TABLE \`loyalty_tiers\`;`)
  await db.run(sql`DROP TABLE \`loyalty_rewards\`;`)
  await db.run(sql`DROP TABLE \`loyalty_points\`;`)
  await db.run(sql`DROP TABLE \`loyalty_transactions\`;`)
  await db.run(sql`DROP TABLE \`loyalty_redemptions\`;`)
  await db.run(sql`DROP TABLE \`ab_tests_variants\`;`)
  await db.run(sql`DROP TABLE \`ab_tests\`;`)
  await db.run(sql`DROP TABLE \`ab_test_results\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_tags\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_faq\`;`)
  await db.run(sql`DROP TABLE \`blog_posts\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_rels\`;`)
  await db.run(sql`DROP TABLE \`_blog_posts_v_version_tags\`;`)
  await db.run(sql`DROP TABLE \`_blog_posts_v_version_faq\`;`)
  await db.run(sql`DROP TABLE \`_blog_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_blog_posts_v_rels\`;`)
  await db.run(sql`DROP TABLE \`blog_categories\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`cases_services\`;`)
  await db.run(sql`DROP TABLE \`cases_gallery\`;`)
  await db.run(sql`DROP TABLE \`cases\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`vendors_certifications\`;`)
  await db.run(sql`DROP TABLE \`vendors\`;`)
  await db.run(sql`DROP TABLE \`vendors_rels\`;`)
  await db.run(sql`DROP TABLE \`vendor_reviews\`;`)
  await db.run(sql`DROP TABLE \`workshops_target_audience\`;`)
  await db.run(sql`DROP TABLE \`workshops_learning_objectives\`;`)
  await db.run(sql`DROP TABLE \`workshops\`;`)
  await db.run(sql`DROP TABLE \`construction_services_features\`;`)
  await db.run(sql`DROP TABLE \`construction_services_process_steps\`;`)
  await db.run(sql`DROP TABLE \`construction_services_service_types\`;`)
  await db.run(sql`DROP TABLE \`construction_services_usps\`;`)
  await db.run(sql`DROP TABLE \`construction_services_faq\`;`)
  await db.run(sql`DROP TABLE \`construction_services\`;`)
  await db.run(sql`DROP TABLE \`construction_services_rels\`;`)
  await db.run(sql`DROP TABLE \`construction_projects_badges\`;`)
  await db.run(sql`DROP TABLE \`construction_projects\`;`)
  await db.run(sql`DROP TABLE \`construction_projects_rels\`;`)
  await db.run(sql`DROP TABLE \`construction_reviews\`;`)
  await db.run(sql`DROP TABLE \`quote_requests\`;`)
  await db.run(sql`DROP TABLE \`quote_requests_rels\`;`)
  await db.run(sql`DROP TABLE \`treatments_symptoms\`;`)
  await db.run(sql`DROP TABLE \`treatments_process\`;`)
  await db.run(sql`DROP TABLE \`treatments_gallery\`;`)
  await db.run(sql`DROP TABLE \`treatments\`;`)
  await db.run(sql`DROP TABLE \`treatments_rels\`;`)
  await db.run(sql`DROP TABLE \`_treatments_v_version_symptoms\`;`)
  await db.run(sql`DROP TABLE \`_treatments_v_version_process\`;`)
  await db.run(sql`DROP TABLE \`_treatments_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_treatments_v\`;`)
  await db.run(sql`DROP TABLE \`_treatments_v_rels\`;`)
  await db.run(sql`DROP TABLE \`practitioners_specializations\`;`)
  await db.run(sql`DROP TABLE \`practitioners_qualifications\`;`)
  await db.run(sql`DROP TABLE \`practitioners_work_days\`;`)
  await db.run(sql`DROP TABLE \`practitioners\`;`)
  await db.run(sql`DROP TABLE \`practitioners_rels\`;`)
  await db.run(sql`DROP TABLE \`_practitioners_v_version_specializations\`;`)
  await db.run(sql`DROP TABLE \`_practitioners_v_version_qualifications\`;`)
  await db.run(sql`DROP TABLE \`_practitioners_v_version_work_days\`;`)
  await db.run(sql`DROP TABLE \`_practitioners_v\`;`)
  await db.run(sql`DROP TABLE \`_practitioners_v_rels\`;`)
  await db.run(sql`DROP TABLE \`appointments_preferred_time\`;`)
  await db.run(sql`DROP TABLE \`appointments\`;`)
  await db.run(sql`DROP TABLE \`beauty_services_benefits\`;`)
  await db.run(sql`DROP TABLE \`beauty_services_process\`;`)
  await db.run(sql`DROP TABLE \`beauty_services_tags\`;`)
  await db.run(sql`DROP TABLE \`beauty_services_gallery\`;`)
  await db.run(sql`DROP TABLE \`beauty_services\`;`)
  await db.run(sql`DROP TABLE \`beauty_services_rels\`;`)
  await db.run(sql`DROP TABLE \`_beauty_services_v_version_benefits\`;`)
  await db.run(sql`DROP TABLE \`_beauty_services_v_version_process\`;`)
  await db.run(sql`DROP TABLE \`_beauty_services_v_version_tags\`;`)
  await db.run(sql`DROP TABLE \`_beauty_services_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_beauty_services_v\`;`)
  await db.run(sql`DROP TABLE \`_beauty_services_v_rels\`;`)
  await db.run(sql`DROP TABLE \`stylists_specialties\`;`)
  await db.run(sql`DROP TABLE \`stylists_certifications\`;`)
  await db.run(sql`DROP TABLE \`stylists_work_days\`;`)
  await db.run(sql`DROP TABLE \`stylists_portfolio\`;`)
  await db.run(sql`DROP TABLE \`stylists\`;`)
  await db.run(sql`DROP TABLE \`stylists_rels\`;`)
  await db.run(sql`DROP TABLE \`_stylists_v_version_specialties\`;`)
  await db.run(sql`DROP TABLE \`_stylists_v_version_certifications\`;`)
  await db.run(sql`DROP TABLE \`_stylists_v_version_work_days\`;`)
  await db.run(sql`DROP TABLE \`_stylists_v_version_portfolio\`;`)
  await db.run(sql`DROP TABLE \`_stylists_v\`;`)
  await db.run(sql`DROP TABLE \`_stylists_v_rels\`;`)
  await db.run(sql`DROP TABLE \`beauty_bookings_preferred_time_slots\`;`)
  await db.run(sql`DROP TABLE \`beauty_bookings\`;`)
  await db.run(sql`DROP TABLE \`menu_items_allergens\`;`)
  await db.run(sql`DROP TABLE \`menu_items\`;`)
  await db.run(sql`DROP TABLE \`_menu_items_v_version_allergens\`;`)
  await db.run(sql`DROP TABLE \`_menu_items_v\`;`)
  await db.run(sql`DROP TABLE \`reservations_preferences\`;`)
  await db.run(sql`DROP TABLE \`reservations\`;`)
  await db.run(sql`DROP TABLE \`events_gallery\`;`)
  await db.run(sql`DROP TABLE \`events_tags\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`DROP TABLE \`_events_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_events_v_version_tags\`;`)
  await db.run(sql`DROP TABLE \`_events_v\`;`)
  await db.run(sql`DROP TABLE \`email_subscribers_tags\`;`)
  await db.run(sql`DROP TABLE \`email_subscribers\`;`)
  await db.run(sql`DROP TABLE \`email_subscribers_rels\`;`)
  await db.run(sql`DROP TABLE \`email_lists_tags\`;`)
  await db.run(sql`DROP TABLE \`email_lists\`;`)
  await db.run(sql`DROP TABLE \`email_templates_variables_list\`;`)
  await db.run(sql`DROP TABLE \`email_templates_tags\`;`)
  await db.run(sql`DROP TABLE \`email_templates_test_settings_test_recipients\`;`)
  await db.run(sql`DROP TABLE \`email_templates\`;`)
  await db.run(sql`DROP TABLE \`email_campaigns_tags\`;`)
  await db.run(sql`DROP TABLE \`email_campaigns_ab_test_variants\`;`)
  await db.run(sql`DROP TABLE \`email_campaigns\`;`)
  await db.run(sql`DROP TABLE \`email_campaigns_rels\`;`)
  await db.run(sql`DROP TABLE \`client_requests_website_pages\`;`)
  await db.run(sql`DROP TABLE \`client_requests_payment_methods\`;`)
  await db.run(sql`DROP TABLE \`client_requests\`;`)
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
  await db.run(sql`DROP TABLE \`header_topbar_messages\`;`)
  await db.run(sql`DROP TABLE \`header_topbar_right_links\`;`)
  await db.run(sql`DROP TABLE \`header_languages\`;`)
  await db.run(sql`DROP TABLE \`header_special_nav_items\`;`)
  await db.run(sql`DROP TABLE \`header_manual_nav_items_mega_columns_links\`;`)
  await db.run(sql`DROP TABLE \`header_manual_nav_items_mega_columns\`;`)
  await db.run(sql`DROP TABLE \`header_manual_nav_items_sub_items\`;`)
  await db.run(sql`DROP TABLE \`header_manual_nav_items\`;`)
  await db.run(sql`DROP TABLE \`header_search_categories\`;`)
  await db.run(sql`DROP TABLE \`header_custom_action_buttons\`;`)
  await db.run(sql`DROP TABLE \`header\`;`)
  await db.run(sql`DROP TABLE \`footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`footer_columns\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_indexed_collections\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_searchable_fields_products\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_searchable_fields_blog_posts\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_searchable_fields_pages\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_filterable_fields_products\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_filterable_fields_blog_posts\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_sortable_fields_products\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_sortable_fields_blog_posts\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_ranking_rules\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_custom_ranking_attributes\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_typo_tolerance_disable_on_words\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_synonyms\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_stop_words\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_exclude_patterns\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings_exclude_statuses\`;`)
  await db.run(sql`DROP TABLE \`meilisearch_settings\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings_suggested_questions\`;`)
  await db.run(sql`DROP TABLE \`chatbot_kb_search_collections\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings_rate_limiting_blocked_i_ps\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings_moderation_blocked_keywords\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings\`;`)
}

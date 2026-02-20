import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_addresses_type" AS ENUM('shipping', 'billing', 'both');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_users_account_type" AS ENUM('individual', 'b2b');
  CREATE TYPE "public"."enum_users_client_type" AS ENUM('website', 'webshop');
  CREATE TYPE "public"."enum_pages_blocks_breadcrumb_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_breadcrumb_separator" AS ENUM('arrow', 'slash', 'chevron', 'double-chevron');
  CREATE TYPE "public"."enum_pages_blocks_spacer_height" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_pages_blocks_hero_style" AS ENUM('default', 'image', 'gradient', 'minimal');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_two_column_ratio" AS ENUM('50-50', '40-60', '60-40', '33-67', '67-33');
  CREATE TYPE "public"."enum_pages_blocks_two_column_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_source" AS ENUM('manual', 'featured', 'latest', 'category', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum_pages_blocks_features_features_icon_type" AS ENUM('lucide', 'upload');
  CREATE TYPE "public"."enum_pages_blocks_features_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_features_category" AS ENUM('all', 'algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps');
  CREATE TYPE "public"."enum_pages_blocks_features_layout" AS ENUM('horizontal', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum_pages_blocks_features_style" AS ENUM('cards', 'clean', 'trust-bar');
  CREATE TYPE "public"."enum_pages_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both');
  CREATE TYPE "public"."enum_pages_blocks_product_filters_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_product_filters_style" AS ENUM('sidebar', 'accordion', 'offcanvas');
  CREATE TYPE "public"."enum_pages_blocks_search_bar_style" AS ENUM('standard', 'hero', 'compact');
  CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_layout" AS ENUM('carousel', 'grid-2', 'grid-3');
  CREATE TYPE "public"."enum_pages_blocks_cases_source" AS ENUM('featured', 'manual', 'latest');
  CREATE TYPE "public"."enum_pages_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum_pages_blocks_logo_bar_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_logo_bar_category" AS ENUM('all', 'klant', 'partner', 'leverancier', 'certificering', 'media');
  CREATE TYPE "public"."enum_pages_blocks_logo_bar_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_stats_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum_pages_blocks_faq_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_faq_category" AS ENUM('all', 'algemeen', 'producten', 'verzending', 'retourneren', 'betaling', 'account', 'support', 'overig');
  CREATE TYPE "public"."enum_pages_blocks_team_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum_pages_blocks_blog_preview_layout" AS ENUM('grid-2', 'grid-3');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_video_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', '21-9');
  CREATE TYPE "public"."enum_pages_blocks_map_height" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_breadcrumb_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_breadcrumb_separator" AS ENUM('arrow', 'slash', 'chevron', 'double-chevron');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_height" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style" AS ENUM('default', 'image', 'gradient', 'minimal');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_two_column_ratio" AS ENUM('50-50', '40-60', '60-40', '33-67', '67-33');
  CREATE TYPE "public"."enum__pages_v_blocks_two_column_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_source" AS ENUM('manual', 'featured', 'latest', 'category', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum__pages_v_blocks_features_features_icon_type" AS ENUM('lucide', 'upload');
  CREATE TYPE "public"."enum__pages_v_blocks_features_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_features_category" AS ENUM('all', 'algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps');
  CREATE TYPE "public"."enum__pages_v_blocks_features_layout" AS ENUM('horizontal', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum__pages_v_blocks_features_style" AS ENUM('cards', 'clean', 'trust-bar');
  CREATE TYPE "public"."enum__pages_v_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_product_filters_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_product_filters_style" AS ENUM('sidebar', 'accordion', 'offcanvas');
  CREATE TYPE "public"."enum__pages_v_blocks_search_bar_style" AS ENUM('standard', 'hero', 'compact');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_layout" AS ENUM('carousel', 'grid-2', 'grid-3');
  CREATE TYPE "public"."enum__pages_v_blocks_cases_source" AS ENUM('featured', 'manual', 'latest');
  CREATE TYPE "public"."enum__pages_v_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_category" AS ENUM('all', 'klant', 'partner', 'leverancier', 'certificering', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_category" AS ENUM('all', 'algemeen', 'producten', 'verzending', 'retourneren', 'betaling', 'account', 'support', 'overig');
  CREATE TYPE "public"."enum__pages_v_blocks_team_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_preview_layout" AS ENUM('grid-2', 'grid-3');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_video_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', '21-9');
  CREATE TYPE "public"."enum__pages_v_blocks_map_height" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('algemeen', 'producten', 'verzending', 'retourneren', 'betaling', 'account', 'support', 'overig');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_cases_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_services_icon_type" AS ENUM('lucide', 'upload');
  CREATE TYPE "public"."enum_services_category" AS ENUM('algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps');
  CREATE TYPE "public"."enum_services_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_partners_category" AS ENUM('klant', 'partner', 'leverancier', 'certificering', 'media');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_products_badge" AS ENUM('none', 'new', 'sale', 'popular', 'sold-out');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published', 'sold-out', 'archived');
  CREATE TYPE "public"."enum_customer_groups_type" AS ENUM('b2c', 'b2b');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'banktransfer');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_client_requests_website_pages" AS ENUM('home', 'about', 'services', 'portfolio', 'blog', 'faq', 'contact');
  CREATE TYPE "public"."enum_client_requests_payment_methods" AS ENUM('ideal', 'creditcard', 'invoice', 'banktransfer', 'paypal');
  CREATE TYPE "public"."enum_client_requests_status" AS ENUM('pending', 'reviewing', 'approved', 'rejected');
  CREATE TYPE "public"."enum_client_requests_site_type" AS ENUM('website', 'webshop');
  CREATE TYPE "public"."enum_client_requests_expected_products" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_clients_enabled_features" AS ENUM('ecommerce', 'blog', 'forms', 'authentication', 'multiLanguage', 'ai');
  CREATE TYPE "public"."enum_clients_disabled_collections" AS ENUM('orders', 'products', 'product-categories', 'blog-posts', 'customer-groups', 'order-lists', 'cases', 'testimonials', 'partners', 'brands', 'services', 'faqs');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('pending', 'provisioning', 'deploying', 'active', 'failed', 'suspended', 'archived');
  CREATE TYPE "public"."enum_clients_plan" AS ENUM('free', 'starter', 'professional', 'enterprise');
  CREATE TYPE "public"."enum_clients_template" AS ENUM('ecommerce', 'blog', 'b2b', 'portfolio', 'corporate');
  CREATE TYPE "public"."enum_clients_deployment_provider" AS ENUM('ploi', 'vercel', 'custom');
  CREATE TYPE "public"."enum_clients_billing_status" AS ENUM('active', 'past_due', 'cancelled', 'trial');
  CREATE TYPE "public"."enum_clients_stripe_account_status" AS ENUM('not_started', 'pending', 'enabled', 'rejected', 'restricted');
  CREATE TYPE "public"."enum_clients_payment_pricing_tier" AS ENUM('standard', 'professional', 'enterprise', 'custom');
  CREATE TYPE "public"."enum_clients_multi_safepay_account_status" AS ENUM('not_started', 'pending', 'active', 'suspended', 'rejected');
  CREATE TYPE "public"."enum_clients_multi_safepay_pricing_tier" AS ENUM('standard', 'professional', 'enterprise', 'custom');
  CREATE TYPE "public"."enum_clients_health_status" AS ENUM('healthy', 'warning', 'critical', 'unknown');
  CREATE TYPE "public"."enum_deployments_status" AS ENUM('pending', 'in_progress', 'success', 'failed', 'rolled_back', 'cancelled');
  CREATE TYPE "public"."enum_deployments_environment" AS ENUM('production', 'staging', 'development');
  CREATE TYPE "public"."enum_deployments_type" AS ENUM('initial', 'update', 'hotfix', 'rollback', 'migration');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_settings_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_theme_font_scale" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_theme_border_radius" AS ENUM('none', 'sm', 'md', 'lg', 'xl', 'full');
  CREATE TYPE "public"."enum_theme_spacing" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_theme_container_width" AS ENUM('lg', 'xl', '2xl', '7xl');
  CREATE TYPE "public"."enum_theme_shadow_size" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_header_custom_buttons_style" AS ENUM('default', 'primary', 'secondary');
  CREATE TYPE "public"."enum_header_navigation_items_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_header_alert_bar_type" AS ENUM('info', 'success', 'warning', 'error', 'promo');
  CREATE TYPE "public"."enum_footer_columns_links_type" AS ENUM('page', 'external');
  CREATE TABLE "users_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_users_addresses_type" DEFAULT 'both' NOT NULL,
  	"street" varchar NOT NULL,
  	"house_number" varchar NOT NULL,
  	"house_number_addition" varchar,
  	"postal_code" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar DEFAULT 'Nederland',
  	"is_default" boolean DEFAULT false
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"phone" varchar,
  	"account_type" "enum_users_account_type" DEFAULT 'individual',
  	"company_name" varchar,
  	"company_kvk_number" varchar,
  	"company_vat_number" varchar,
  	"company_invoice_email" varchar,
  	"client_type" "enum_users_client_type",
  	"client_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "pages_blocks_top_bar_left_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"text" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_top_bar_right_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_top_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"use_global_settings" boolean DEFAULT true,
  	"background_color" varchar DEFAULT '#0A1628',
  	"text_color" varchar DEFAULT '#FFFFFF',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_breadcrumb_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_breadcrumb" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_pages_blocks_breadcrumb_mode" DEFAULT 'auto',
  	"show_home" boolean DEFAULT true,
  	"home_label" varchar DEFAULT 'Home',
  	"separator" "enum_pages_blocks_breadcrumb_separator" DEFAULT 'arrow',
  	"show_on_mobile" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" "enum_pages_blocks_spacer_height" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_hero_style" DEFAULT 'default',
  	"title" varchar,
  	"subtitle" varchar,
  	"primary_c_t_a_text" varchar DEFAULT 'Neem contact op',
  	"primary_c_t_a_link" varchar DEFAULT '/contact',
  	"secondary_c_t_a_text" varchar,
  	"secondary_c_t_a_link" varchar,
  	"background_image_id" integer,
  	"background_image_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_column" jsonb,
  	"right_column" jsonb,
  	"ratio" "enum_pages_blocks_two_column_ratio" DEFAULT '50-50',
  	"alignment" "enum_pages_blocks_two_column_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze producten',
  	"intro" varchar,
  	"source" "enum_pages_blocks_product_grid_source" DEFAULT 'manual',
  	"category_id" integer,
  	"brand_id" integer,
  	"display_mode" "enum_pages_blocks_product_grid_display_mode" DEFAULT 'grid',
  	"layout" "enum_pages_blocks_product_grid_layout" DEFAULT 'grid-4',
  	"limit" numeric DEFAULT 8,
  	"show_add_to_cart" boolean DEFAULT true,
  	"show_stock_status" boolean DEFAULT true,
  	"show_brand" boolean DEFAULT true,
  	"show_compare_price" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle producten',
  	"view_all_button_link" varchar DEFAULT '/producten',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze categorieën',
  	"intro" varchar,
  	"source" "enum_pages_blocks_category_grid_source" DEFAULT 'auto',
  	"show_icon" boolean DEFAULT true,
  	"show_product_count" boolean DEFAULT true,
  	"layout" "enum_pages_blocks_category_grid_layout" DEFAULT 'grid-3',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_type" "enum_pages_blocks_features_features_icon_type" DEFAULT 'lucide',
  	"icon_name" varchar,
  	"icon_upload_id" integer,
  	"name" varchar,
  	"description" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze diensten',
  	"intro" varchar,
  	"source" "enum_pages_blocks_features_source" DEFAULT 'manual',
  	"category" "enum_pages_blocks_features_category" DEFAULT 'all',
  	"limit" numeric DEFAULT 6,
  	"show_featured_only" boolean DEFAULT false,
  	"layout" "enum_pages_blocks_features_layout" DEFAULT 'grid-3',
  	"style" "enum_pages_blocks_features_style" DEFAULT 'cards',
  	"show_hover_effect" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quick_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Snel Bestellen',
  	"intro" varchar,
  	"show_order_lists" boolean DEFAULT true,
  	"input_mode" "enum_pages_blocks_quick_order_input_mode" DEFAULT 'textarea',
  	"placeholder_text" varchar DEFAULT 'Voer artikelnummers en aantallen in:
  
  BV-001 5
  LT-334 2
  HT-892 10',
  	"help_text" jsonb,
  	"submit_button_text" varchar DEFAULT 'Toevoegen aan winkelwagen',
  	"show_upload" boolean DEFAULT false,
  	"upload_help_text" varchar DEFAULT 'Upload een CSV bestand met artikelnummer,aantal per regel',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_filters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" "enum_pages_blocks_product_filters_position" DEFAULT 'left',
  	"style" "enum_pages_blocks_product_filters_style" DEFAULT 'sidebar',
  	"show_search" boolean DEFAULT true,
  	"enabled_filters_categories" boolean DEFAULT true,
  	"enabled_filters_brands" boolean DEFAULT true,
  	"enabled_filters_price_range" boolean DEFAULT true,
  	"enabled_filters_badges" boolean DEFAULT true,
  	"enabled_filters_stock" boolean DEFAULT true,
  	"enabled_filters_featured" boolean DEFAULT false,
  	"price_range_config_min" numeric DEFAULT 0,
  	"price_range_config_max" numeric DEFAULT 500,
  	"price_range_config_step" numeric DEFAULT 10,
  	"show_active_filters" boolean DEFAULT true,
  	"clear_all_text" varchar DEFAULT 'Wis alle filters',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_search_bar_popular_searches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar
  );
  
  CREATE TABLE "pages_blocks_search_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_search_bar_style" DEFAULT 'standard',
  	"placeholder" varchar DEFAULT 'Zoek producten, merken of artikelnummers...',
  	"show_category_filter" boolean DEFAULT true,
  	"show_autocomplete" boolean DEFAULT true,
  	"autocomplete_limit" numeric DEFAULT 5,
  	"show_popular_searches" boolean DEFAULT false,
  	"search_in_products" boolean DEFAULT true,
  	"search_in_categories" boolean DEFAULT true,
  	"search_in_brands" boolean DEFAULT true,
  	"search_in_blog" boolean DEFAULT false,
  	"search_in_pages" boolean DEFAULT false,
  	"button_text" varchar DEFAULT 'Zoeken',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"button_text" varchar DEFAULT 'Neem contact op',
  	"button_link" varchar DEFAULT '/contact',
  	"style" "enum_pages_blocks_cta_style" DEFAULT 'primary',
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Neem contact op',
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_manual_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"quote" varchar,
  	"rating" numeric DEFAULT 5,
  	"photo_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Wat klanten zeggen',
  	"intro" varchar,
  	"source" "enum_pages_blocks_testimonials_source" DEFAULT 'collection',
  	"layout" "enum_pages_blocks_testimonials_layout" DEFAULT 'carousel',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze projecten',
  	"intro" varchar,
  	"source" "enum_pages_blocks_cases_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"layout" "enum_pages_blocks_cases_layout" DEFAULT 'grid-3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_client" boolean DEFAULT true,
  	"show_services" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"view_all_button_link" varchar DEFAULT '/portfolio',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_bar_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"source" "enum_pages_blocks_logo_bar_source" DEFAULT 'manual',
  	"category" "enum_pages_blocks_logo_bar_category" DEFAULT 'all',
  	"limit" numeric DEFAULT 10,
  	"show_featured_only" boolean DEFAULT false,
  	"layout" "enum_pages_blocks_logo_bar_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_pages_blocks_stats_layout" DEFAULT 'grid-4',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Veelgestelde vragen',
  	"intro" varchar,
  	"source" "enum_pages_blocks_faq_source" DEFAULT 'manual',
  	"category" "enum_pages_blocks_faq_category" DEFAULT 'all',
  	"limit" numeric DEFAULT 10,
  	"show_featured_only" boolean DEFAULT false,
  	"generate_schema" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"photo_url" varchar,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"email" varchar,
  	"linkedin" varchar
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ons team',
  	"intro" varchar,
  	"layout" "enum_pages_blocks_team_layout" DEFAULT 'grid-3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"allow_multiple" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Laatste blog berichten',
  	"intro" varchar,
  	"limit" numeric DEFAULT 6,
  	"category_id" integer,
  	"layout" "enum_pages_blocks_blog_preview_layout" DEFAULT 'grid-3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_author" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_pages_blocks_image_gallery_layout" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_image_gallery_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"video_url" varchar,
  	"poster_image_id" integer,
  	"aspect_ratio" "enum_pages_blocks_video_aspect_ratio" DEFAULT '16-9',
  	"autoplay" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Locatie',
  	"address" varchar,
  	"zoom" numeric DEFAULT 15,
  	"height" "enum_pages_blocks_map_height" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"status" "enum_pages_status" DEFAULT 'published',
  	"published_on" timestamp(3) with time zone,
  	"color_scheme_primary" varchar,
  	"color_scheme_secondary" varchar,
  	"color_scheme_accent" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_focus_keyword" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"meta_no_follow" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"services_id" integer,
  	"testimonials_id" integer,
  	"cases_id" integer,
  	"partners_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_top_bar_left_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"text" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_top_bar_right_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_top_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"use_global_settings" boolean DEFAULT true,
  	"background_color" varchar DEFAULT '#0A1628',
  	"text_color" varchar DEFAULT '#FFFFFF',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_breadcrumb_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_breadcrumb" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__pages_v_blocks_breadcrumb_mode" DEFAULT 'auto',
  	"show_home" boolean DEFAULT true,
  	"home_label" varchar DEFAULT 'Home',
  	"separator" "enum__pages_v_blocks_breadcrumb_separator" DEFAULT 'arrow',
  	"show_on_mobile" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" "enum__pages_v_blocks_spacer_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_hero_style" DEFAULT 'default',
  	"title" varchar,
  	"subtitle" varchar,
  	"primary_c_t_a_text" varchar DEFAULT 'Neem contact op',
  	"primary_c_t_a_link" varchar DEFAULT '/contact',
  	"secondary_c_t_a_text" varchar,
  	"secondary_c_t_a_link" varchar,
  	"background_image_id" integer,
  	"background_image_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_column" jsonb,
  	"right_column" jsonb,
  	"ratio" "enum__pages_v_blocks_two_column_ratio" DEFAULT '50-50',
  	"alignment" "enum__pages_v_blocks_two_column_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze producten',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_product_grid_source" DEFAULT 'manual',
  	"category_id" integer,
  	"brand_id" integer,
  	"display_mode" "enum__pages_v_blocks_product_grid_display_mode" DEFAULT 'grid',
  	"layout" "enum__pages_v_blocks_product_grid_layout" DEFAULT 'grid-4',
  	"limit" numeric DEFAULT 8,
  	"show_add_to_cart" boolean DEFAULT true,
  	"show_stock_status" boolean DEFAULT true,
  	"show_brand" boolean DEFAULT true,
  	"show_compare_price" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle producten',
  	"view_all_button_link" varchar DEFAULT '/producten',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze categorieën',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_category_grid_source" DEFAULT 'auto',
  	"show_icon" boolean DEFAULT true,
  	"show_product_count" boolean DEFAULT true,
  	"layout" "enum__pages_v_blocks_category_grid_layout" DEFAULT 'grid-3',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_type" "enum__pages_v_blocks_features_features_icon_type" DEFAULT 'lucide',
  	"icon_name" varchar,
  	"icon_upload_id" integer,
  	"name" varchar,
  	"description" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze diensten',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_features_source" DEFAULT 'manual',
  	"category" "enum__pages_v_blocks_features_category" DEFAULT 'all',
  	"limit" numeric DEFAULT 6,
  	"show_featured_only" boolean DEFAULT false,
  	"layout" "enum__pages_v_blocks_features_layout" DEFAULT 'grid-3',
  	"style" "enum__pages_v_blocks_features_style" DEFAULT 'cards',
  	"show_hover_effect" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quick_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Snel Bestellen',
  	"intro" varchar,
  	"show_order_lists" boolean DEFAULT true,
  	"input_mode" "enum__pages_v_blocks_quick_order_input_mode" DEFAULT 'textarea',
  	"placeholder_text" varchar DEFAULT 'Voer artikelnummers en aantallen in:
  
  BV-001 5
  LT-334 2
  HT-892 10',
  	"help_text" jsonb,
  	"submit_button_text" varchar DEFAULT 'Toevoegen aan winkelwagen',
  	"show_upload" boolean DEFAULT false,
  	"upload_help_text" varchar DEFAULT 'Upload een CSV bestand met artikelnummer,aantal per regel',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_filters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"position" "enum__pages_v_blocks_product_filters_position" DEFAULT 'left',
  	"style" "enum__pages_v_blocks_product_filters_style" DEFAULT 'sidebar',
  	"show_search" boolean DEFAULT true,
  	"enabled_filters_categories" boolean DEFAULT true,
  	"enabled_filters_brands" boolean DEFAULT true,
  	"enabled_filters_price_range" boolean DEFAULT true,
  	"enabled_filters_badges" boolean DEFAULT true,
  	"enabled_filters_stock" boolean DEFAULT true,
  	"enabled_filters_featured" boolean DEFAULT false,
  	"price_range_config_min" numeric DEFAULT 0,
  	"price_range_config_max" numeric DEFAULT 500,
  	"price_range_config_step" numeric DEFAULT 10,
  	"show_active_filters" boolean DEFAULT true,
  	"clear_all_text" varchar DEFAULT 'Wis alle filters',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_search_bar_popular_searches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_search_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_search_bar_style" DEFAULT 'standard',
  	"placeholder" varchar DEFAULT 'Zoek producten, merken of artikelnummers...',
  	"show_category_filter" boolean DEFAULT true,
  	"show_autocomplete" boolean DEFAULT true,
  	"autocomplete_limit" numeric DEFAULT 5,
  	"show_popular_searches" boolean DEFAULT false,
  	"search_in_products" boolean DEFAULT true,
  	"search_in_categories" boolean DEFAULT true,
  	"search_in_brands" boolean DEFAULT true,
  	"search_in_blog" boolean DEFAULT false,
  	"search_in_pages" boolean DEFAULT false,
  	"button_text" varchar DEFAULT 'Zoeken',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"button_text" varchar DEFAULT 'Neem contact op',
  	"button_link" varchar DEFAULT '/contact',
  	"style" "enum__pages_v_blocks_cta_style" DEFAULT 'primary',
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Neem contact op',
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_manual_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"quote" varchar,
  	"rating" numeric DEFAULT 5,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Wat klanten zeggen',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_testimonials_source" DEFAULT 'collection',
  	"layout" "enum__pages_v_blocks_testimonials_layout" DEFAULT 'carousel',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Onze projecten',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_cases_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"layout" "enum__pages_v_blocks_cases_layout" DEFAULT 'grid-3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_client" boolean DEFAULT true,
  	"show_services" boolean DEFAULT true,
  	"show_view_all_button" boolean DEFAULT true,
  	"view_all_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"view_all_button_link" varchar DEFAULT '/portfolio',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_bar_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"source" "enum__pages_v_blocks_logo_bar_source" DEFAULT 'manual',
  	"category" "enum__pages_v_blocks_logo_bar_category" DEFAULT 'all',
  	"limit" numeric DEFAULT 10,
  	"show_featured_only" boolean DEFAULT false,
  	"layout" "enum__pages_v_blocks_logo_bar_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__pages_v_blocks_stats_layout" DEFAULT 'grid-4',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Veelgestelde vragen',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_faq_source" DEFAULT 'manual',
  	"category" "enum__pages_v_blocks_faq_category" DEFAULT 'all',
  	"limit" numeric DEFAULT 10,
  	"show_featured_only" boolean DEFAULT false,
  	"generate_schema" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"photo_url" varchar,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"email" varchar,
  	"linkedin" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ons team',
  	"intro" varchar,
  	"layout" "enum__pages_v_blocks_team_layout" DEFAULT 'grid-3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"allow_multiple" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blog_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Laatste blog berichten',
  	"intro" varchar,
  	"limit" numeric DEFAULT 6,
  	"category_id" integer,
  	"layout" "enum__pages_v_blocks_blog_preview_layout" DEFAULT 'grid-3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_author" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__pages_v_blocks_image_gallery_layout" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_image_gallery_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"video_url" varchar,
  	"poster_image_id" integer,
  	"aspect_ratio" "enum__pages_v_blocks_video_aspect_ratio" DEFAULT '16-9',
  	"autoplay" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Locatie',
  	"address" varchar,
  	"zoom" numeric DEFAULT 15,
  	"height" "enum__pages_v_blocks_map_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_status" "enum__pages_v_version_status" DEFAULT 'published',
  	"version_published_on" timestamp(3) with time zone,
  	"version_color_scheme_primary" varchar,
  	"version_color_scheme_secondary" varchar,
  	"version_color_scheme_accent" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_meta_no_follow" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"services_id" integer,
  	"testimonials_id" integer,
  	"cases_id" integer,
  	"partners_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"content" jsonb,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"status" "enum_blog_posts_status" DEFAULT 'draft',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_focus_keyword" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"meta_no_follow" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "blog_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_content" jsonb,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_meta_no_follow" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_blog_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'algemeen',
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"status" "enum_faqs_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "cases_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar NOT NULL
  );
  
  CREATE TABLE "cases_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"client" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"featured_image_id" integer,
  	"content" jsonb NOT NULL,
  	"live_url" varchar,
  	"status" "enum_cases_status" DEFAULT 'published',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_focus_keyword" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"meta_no_follow" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"company" varchar NOT NULL,
  	"photo_id" integer,
  	"quote" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"featured" boolean DEFAULT false,
  	"status" "enum_testimonials_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon_type" "enum_services_icon_type" DEFAULT 'lucide',
  	"icon_name" varchar,
  	"icon_upload_id" integer,
  	"link" varchar,
  	"category" "enum_services_category" DEFAULT 'algemeen',
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"status" "enum_services_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"website" varchar,
  	"category" "enum_partners_category" DEFAULT 'klant',
  	"description" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"status" "enum_partners_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"parent_id" integer,
  	"image_id" integer,
  	"level" numeric DEFAULT 0,
  	"order" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"description" jsonb,
  	"website" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"price" numeric NOT NULL,
  	"compare_at_price" numeric,
  	"stock" numeric DEFAULT 0,
  	"sku" varchar,
  	"brand_id" integer,
  	"badge" "enum_products_badge" DEFAULT 'none',
  	"status" "enum_products_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"product_categories_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "customer_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_customer_groups_type" DEFAULT 'b2c' NOT NULL,
  	"discount" numeric DEFAULT 0 NOT NULL,
  	"priority" numeric DEFAULT 50 NOT NULL,
  	"min_order_amount" numeric,
  	"is_default" boolean DEFAULT false,
  	"can_view_catalog" boolean DEFAULT true,
  	"can_place_orders" boolean DEFAULT true,
  	"can_request_quotes" boolean DEFAULT false,
  	"can_download_invoices" boolean DEFAULT true,
  	"can_view_order_history" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "order_lists_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"default_quantity" numeric DEFAULT 1 NOT NULL,
  	"notes" varchar
  );
  
  CREATE TABLE "order_lists_share_with" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"can_edit" boolean DEFAULT false
  );
  
  CREATE TABLE "order_lists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"owner_id" integer NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"item_count" numeric,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"price" numeric NOT NULL,
  	"subtotal" numeric
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"shipping_cost" numeric DEFAULT 0,
  	"tax" numeric DEFAULT 0,
  	"discount" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"shipping_address_name" varchar NOT NULL,
  	"shipping_address_company" varchar,
  	"shipping_address_street" varchar NOT NULL,
  	"shipping_address_house_number" varchar NOT NULL,
  	"shipping_address_postal_code" varchar NOT NULL,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_country" varchar DEFAULT 'Nederland',
  	"billing_address_same_as_shipping" boolean DEFAULT true,
  	"billing_address_company" varchar,
  	"billing_address_street" varchar,
  	"billing_address_house_number" varchar,
  	"billing_address_postal_code" varchar,
  	"billing_address_city" varchar,
  	"billing_address_country" varchar DEFAULT 'Nederland',
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"payment_method" "enum_orders_payment_method" NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending' NOT NULL,
  	"notes" varchar,
  	"tracking_code" varchar,
  	"invoice_p_d_f_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "client_requests_website_pages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_client_requests_website_pages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "client_requests_payment_methods" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_client_requests_payment_methods",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "client_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_client_requests_status" DEFAULT 'pending' NOT NULL,
  	"company_name" varchar NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"contact_phone" varchar,
  	"site_type" "enum_client_requests_site_type" NOT NULL,
  	"expected_products" "enum_client_requests_expected_products",
  	"message" varchar,
  	"domain" varchar,
  	"admin_notes" varchar,
  	"created_user_id" integer,
  	"created_client_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clients_enabled_features" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_clients_enabled_features",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "clients_disabled_collections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_clients_disabled_collections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_clients_status" DEFAULT 'pending' NOT NULL,
  	"plan" "enum_clients_plan" DEFAULT 'starter',
  	"name" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"contact_name" varchar,
  	"contact_phone" varchar,
  	"template" "enum_clients_template" DEFAULT 'corporate' NOT NULL,
  	"deployment_url" varchar,
  	"admin_url" varchar,
  	"deployment_provider" "enum_clients_deployment_provider",
  	"last_deployed_at" timestamp(3) with time zone,
  	"deployment_provider_id" varchar,
  	"last_deployment_id" varchar,
  	"database_url" varchar,
  	"database_provider_id" varchar,
  	"port" numeric,
  	"custom_environment" jsonb,
  	"custom_settings" jsonb,
  	"billing_status" "enum_clients_billing_status" DEFAULT 'active',
  	"monthly_fee" numeric,
  	"next_billing_date" timestamp(3) with time zone,
  	"payments_enabled" boolean DEFAULT false,
  	"stripe_account_id" varchar,
  	"stripe_account_status" "enum_clients_stripe_account_status" DEFAULT 'not_started',
  	"payment_pricing_tier" "enum_clients_payment_pricing_tier" DEFAULT 'standard',
  	"custom_transaction_fee_percentage" numeric,
  	"custom_transaction_fee_fixed" numeric,
  	"total_payment_volume" numeric,
  	"total_payment_revenue" numeric,
  	"last_payment_at" timestamp(3) with time zone,
  	"multi_safepay_enabled" boolean DEFAULT false,
  	"multi_safepay_affiliate_id" varchar,
  	"multi_safepay_account_status" "enum_clients_multi_safepay_account_status" DEFAULT 'not_started',
  	"multi_safepay_pricing_tier" "enum_clients_multi_safepay_pricing_tier" DEFAULT 'standard',
  	"multi_safepay_custom_rates_ideal_fee" numeric,
  	"multi_safepay_custom_rates_card_percentage" numeric,
  	"multi_safepay_custom_rates_card_fixed" numeric,
  	"multi_safepay_total_volume" numeric,
  	"multi_safepay_total_revenue" numeric,
  	"multi_safepay_last_payment_at" timestamp(3) with time zone,
  	"last_health_check" timestamp(3) with time zone,
  	"health_status" "enum_clients_health_status",
  	"uptime_percentage" numeric,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "deployments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"status" "enum_deployments_status" DEFAULT 'pending' NOT NULL,
  	"environment" "enum_deployments_environment" DEFAULT 'production' NOT NULL,
  	"type" "enum_deployments_type" NOT NULL,
  	"version" varchar,
  	"git_branch" varchar,
  	"git_commit" varchar,
  	"started_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"duration" numeric,
  	"reason" varchar,
  	"notes" varchar,
  	"triggered_by" varchar,
  	"logs" varchar,
  	"error_message" varchar,
  	"error_stack" varchar,
  	"vercel_deployment_id" varchar,
  	"vercel_deployment_url" varchar,
  	"vercel_project_id" varchar,
  	"config_snapshot" jsonb,
  	"environment_snapshot" jsonb,
  	"health_check_passed" boolean,
  	"health_check_results" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"blog_posts_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"cases_id" integer,
  	"testimonials_id" integer,
  	"services_id" integer,
  	"partners_id" integer,
  	"product_categories_id" integer,
  	"brands_id" integer,
  	"products_id" integer,
  	"customer_groups_id" integer,
  	"order_lists_id" integer,
  	"orders_id" integer,
  	"client_requests_id" integer,
  	"clients_id" integer,
  	"deployments_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "settings_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_settings_hours_day",
  	"open" boolean DEFAULT true,
  	"from" varchar,
  	"to" varchar
  );
  
  CREATE TABLE "settings_sitemap_exclude" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "settings_robots_disallow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"kvk_number" varchar,
  	"vat_number" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"whatsapp" varchar,
  	"address_street" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"address_country" varchar DEFAULT 'Nederland',
  	"address_show_on_site" boolean DEFAULT true,
  	"facebook" varchar,
  	"instagram" varchar,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"youtube" varchar,
  	"tiktok" varchar,
  	"hours_note" varchar,
  	"free_shipping_threshold" numeric DEFAULT 150 NOT NULL,
  	"shipping_cost" numeric DEFAULT 6.95 NOT NULL,
  	"delivery_time" varchar DEFAULT 'Besteld voor 16:00, morgen in huis' NOT NULL,
  	"delivery_days_monday" boolean DEFAULT true,
  	"delivery_days_tuesday" boolean DEFAULT true,
  	"delivery_days_wednesday" boolean DEFAULT true,
  	"delivery_days_thursday" boolean DEFAULT true,
  	"delivery_days_friday" boolean DEFAULT true,
  	"delivery_days_saturday" boolean DEFAULT false,
  	"delivery_days_sunday" boolean DEFAULT false,
  	"return_days" numeric DEFAULT 30 NOT NULL,
  	"return_policy" jsonb,
  	"minimum_order_amount" numeric,
  	"show_prices_excl_v_a_t" boolean DEFAULT true,
  	"vat_percentage" numeric DEFAULT 21,
  	"require_account_for_purchase" boolean DEFAULT true,
  	"trust_indicators_trust_score" numeric,
  	"trust_indicators_trust_source" varchar,
  	"trust_indicators_years_in_business" numeric,
  	"trust_indicators_customers_served" numeric,
  	"features_enable_quick_order" boolean DEFAULT true,
  	"features_enable_order_lists" boolean DEFAULT true,
  	"features_enable_reviews" boolean DEFAULT false,
  	"features_enable_wishlist" boolean DEFAULT true,
  	"features_enable_stock_notifications" boolean DEFAULT false,
  	"features_enable_live_chat" boolean DEFAULT false,
  	"logo_id" integer,
  	"logo_white_id" integer,
  	"favicon_id" integer,
  	"primary_color" varchar,
  	"accent_color" varchar,
  	"ga4_id" varchar,
  	"gtm_id" varchar,
  	"facebook_pixel" varchar,
  	"google_site_verification" varchar,
  	"default_meta_description" varchar,
  	"default_o_g_image_id" integer,
  	"business_category" varchar,
  	"geo_latitude" numeric,
  	"geo_longitude" numeric,
  	"price_range" varchar,
  	"sitemap_enabled" boolean DEFAULT true,
  	"enable_auto_o_g_images" boolean DEFAULT true,
  	"enable_j_s_o_n_l_d" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_color" varchar DEFAULT '#00796B',
  	"secondary_color" varchar DEFAULT '#0A1628',
  	"accent_color" varchar DEFAULT '#8b5cf6',
  	"background_color" varchar DEFAULT '#ffffff',
  	"surface_color" varchar DEFAULT '#f9fafb',
  	"border_color" varchar DEFAULT '#e5e7eb',
  	"text_primary" varchar DEFAULT '#0A1628',
  	"text_secondary" varchar DEFAULT '#64748b',
  	"text_muted" varchar DEFAULT '#94a3b8',
  	"heading_font" varchar DEFAULT 'Inter, system-ui, sans-serif',
  	"body_font" varchar DEFAULT 'Inter, system-ui, sans-serif',
  	"font_scale" "enum_theme_font_scale" DEFAULT 'md',
  	"border_radius" "enum_theme_border_radius" DEFAULT 'lg',
  	"spacing" "enum_theme_spacing" DEFAULT 'md',
  	"container_width" "enum_theme_container_width" DEFAULT '7xl',
  	"shadow_size" "enum_theme_shadow_size" DEFAULT 'md',
  	"enable_animations" boolean DEFAULT true,
  	"enable_dark_mode" boolean DEFAULT false,
  	"custom_c_s_s" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_top_bar_left_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"text" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "header_top_bar_right_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "header_custom_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon" varchar,
  	"style" "enum_header_custom_buttons_style" DEFAULT 'default'
  );
  
  CREATE TABLE "header_navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"page_id" integer
  );
  
  CREATE TABLE "header_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_header_navigation_items_type" DEFAULT 'page',
  	"page_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"top_bar_enabled" boolean DEFAULT true,
  	"top_bar_background_color" varchar DEFAULT '#0A1628',
  	"top_bar_text_color" varchar DEFAULT '#FFFFFF',
  	"alert_bar_enabled" boolean DEFAULT false,
  	"alert_bar_message" varchar,
  	"alert_bar_type" "enum_header_alert_bar_type" DEFAULT 'info',
  	"alert_bar_icon" varchar,
  	"alert_bar_link_enabled" boolean DEFAULT false,
  	"alert_bar_link_label" varchar,
  	"alert_bar_link_url" varchar,
  	"alert_bar_dismissible" boolean DEFAULT true,
  	"alert_bar_schedule_use_schedule" boolean DEFAULT false,
  	"alert_bar_schedule_start_date" timestamp(3) with time zone,
  	"alert_bar_schedule_end_date" timestamp(3) with time zone,
  	"alert_bar_custom_colors_use_custom_colors" boolean DEFAULT false,
  	"alert_bar_custom_colors_background_color" varchar,
  	"alert_bar_custom_colors_text_color" varchar,
  	"logo_override_id" integer,
  	"site_name_override" varchar,
  	"enable_search" boolean DEFAULT true,
  	"search_placeholder" varchar DEFAULT 'Zoek producten...',
  	"show_phone" boolean DEFAULT true,
  	"show_wishlist" boolean DEFAULT false,
  	"show_account" boolean DEFAULT true,
  	"show_cart" boolean DEFAULT true,
  	"navigation_cta_button_text" varchar DEFAULT 'Contact',
  	"navigation_cta_button_link" varchar DEFAULT '/contact',
  	"navigation_cta_button_show" boolean DEFAULT true,
  	"sticky_header" boolean DEFAULT true,
  	"show_shadow" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_footer_columns_links_type" DEFAULT 'page',
  	"page_id" integer,
  	"external_url" varchar
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"bottom_text" jsonb,
  	"show_social_links" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_addresses" ADD CONSTRAINT "users_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_top_bar_left_messages" ADD CONSTRAINT "pages_blocks_top_bar_left_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_top_bar_right_links" ADD CONSTRAINT "pages_blocks_top_bar_right_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_top_bar" ADD CONSTRAINT "pages_blocks_top_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_breadcrumb_items" ADD CONSTRAINT "pages_blocks_breadcrumb_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_breadcrumb"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_breadcrumb" ADD CONSTRAINT "pages_blocks_breadcrumb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column" ADD CONSTRAINT "pages_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid" ADD CONSTRAINT "pages_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_icon_upload_id_media_id_fk" FOREIGN KEY ("icon_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quick_order" ADD CONSTRAINT "pages_blocks_quick_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_filters" ADD CONSTRAINT "pages_blocks_product_filters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_search_bar_popular_searches" ADD CONSTRAINT "pages_blocks_search_bar_popular_searches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_search_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_search_bar" ADD CONSTRAINT "pages_blocks_search_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_manual_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_manual_testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_manual_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_manual_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cases" ADD CONSTRAINT "pages_blocks_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_bar_logos" ADD CONSTRAINT "pages_blocks_logo_bar_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_bar_logos" ADD CONSTRAINT "pages_blocks_logo_bar_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_bar" ADD CONSTRAINT "pages_blocks_logo_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_items" ADD CONSTRAINT "pages_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_preview" ADD CONSTRAINT "pages_blocks_blog_preview_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_preview" ADD CONSTRAINT "pages_blocks_blog_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map" ADD CONSTRAINT "pages_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_top_bar_left_messages" ADD CONSTRAINT "_pages_v_blocks_top_bar_left_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_top_bar_right_links" ADD CONSTRAINT "_pages_v_blocks_top_bar_right_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_top_bar" ADD CONSTRAINT "_pages_v_blocks_top_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_breadcrumb_items" ADD CONSTRAINT "_pages_v_blocks_breadcrumb_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_breadcrumb"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_breadcrumb" ADD CONSTRAINT "_pages_v_blocks_breadcrumb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column" ADD CONSTRAINT "_pages_v_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid" ADD CONSTRAINT "_pages_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_features" ADD CONSTRAINT "_pages_v_blocks_features_features_icon_upload_id_media_id_fk" FOREIGN KEY ("icon_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_features" ADD CONSTRAINT "_pages_v_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quick_order" ADD CONSTRAINT "_pages_v_blocks_quick_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_filters" ADD CONSTRAINT "_pages_v_blocks_product_filters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_search_bar_popular_searches" ADD CONSTRAINT "_pages_v_blocks_search_bar_popular_searches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_search_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_search_bar" ADD CONSTRAINT "_pages_v_blocks_search_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_manual_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_manual_testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_manual_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_manual_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cases" ADD CONSTRAINT "_pages_v_blocks_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_bar_logos" ADD CONSTRAINT "_pages_v_blocks_logo_bar_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_bar_logos" ADD CONSTRAINT "_pages_v_blocks_logo_bar_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_bar" ADD CONSTRAINT "_pages_v_blocks_logo_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_items" ADD CONSTRAINT "_pages_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_preview" ADD CONSTRAINT "_pages_v_blocks_blog_preview_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_preview" ADD CONSTRAINT "_pages_v_blocks_blog_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map" ADD CONSTRAINT "_pages_v_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_services" ADD CONSTRAINT "cases_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_gallery" ADD CONSTRAINT "cases_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases_gallery" ADD CONSTRAINT "cases_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_icon_upload_id_media_id_fk" FOREIGN KEY ("icon_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists" ADD CONSTRAINT "order_lists_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_invoice_p_d_f_id_media_id_fk" FOREIGN KEY ("invoice_p_d_f_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_requests_website_pages" ADD CONSTRAINT "client_requests_website_pages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "client_requests_payment_methods" ADD CONSTRAINT "client_requests_payment_methods_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_created_user_id_users_id_fk" FOREIGN KEY ("created_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_created_client_id_clients_id_fk" FOREIGN KEY ("created_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_enabled_features" ADD CONSTRAINT "clients_enabled_features_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_disabled_collections" ADD CONSTRAINT "clients_disabled_collections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "deployments" ADD CONSTRAINT "deployments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customer_groups_fk" FOREIGN KEY ("customer_groups_id") REFERENCES "public"."customer_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_lists_fk" FOREIGN KEY ("order_lists_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_requests_fk" FOREIGN KEY ("client_requests_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deployments_fk" FOREIGN KEY ("deployments_id") REFERENCES "public"."deployments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_hours" ADD CONSTRAINT "settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_sitemap_exclude" ADD CONSTRAINT "settings_sitemap_exclude_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_robots_disallow" ADD CONSTRAINT "settings_robots_disallow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_white_id_media_id_fk" FOREIGN KEY ("logo_white_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_default_o_g_image_id_media_id_fk" FOREIGN KEY ("default_o_g_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_top_bar_left_messages" ADD CONSTRAINT "header_top_bar_left_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_top_bar_right_links" ADD CONSTRAINT "header_top_bar_right_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_custom_buttons" ADD CONSTRAINT "header_custom_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation_items_children" ADD CONSTRAINT "header_navigation_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_navigation_items_children" ADD CONSTRAINT "header_navigation_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation_items" ADD CONSTRAINT "header_navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_navigation_items" ADD CONSTRAINT "header_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_override_id_media_id_fk" FOREIGN KEY ("logo_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_addresses_order_idx" ON "users_addresses" USING btree ("_order");
  CREATE INDEX "users_addresses_parent_id_idx" ON "users_addresses" USING btree ("_parent_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_client_idx" ON "users" USING btree ("client_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_blocks_top_bar_left_messages_order_idx" ON "pages_blocks_top_bar_left_messages" USING btree ("_order");
  CREATE INDEX "pages_blocks_top_bar_left_messages_parent_id_idx" ON "pages_blocks_top_bar_left_messages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_top_bar_right_links_order_idx" ON "pages_blocks_top_bar_right_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_top_bar_right_links_parent_id_idx" ON "pages_blocks_top_bar_right_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_top_bar_order_idx" ON "pages_blocks_top_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_top_bar_parent_id_idx" ON "pages_blocks_top_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_top_bar_path_idx" ON "pages_blocks_top_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_breadcrumb_items_order_idx" ON "pages_blocks_breadcrumb_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_breadcrumb_items_parent_id_idx" ON "pages_blocks_breadcrumb_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_breadcrumb_order_idx" ON "pages_blocks_breadcrumb" USING btree ("_order");
  CREATE INDEX "pages_blocks_breadcrumb_parent_id_idx" ON "pages_blocks_breadcrumb" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_breadcrumb_path_idx" ON "pages_blocks_breadcrumb" USING btree ("_path");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_background_image_idx" ON "pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_two_column_order_idx" ON "pages_blocks_two_column" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_column_parent_id_idx" ON "pages_blocks_two_column" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_column_path_idx" ON "pages_blocks_two_column" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_grid_order_idx" ON "pages_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_grid_parent_id_idx" ON "pages_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_grid_path_idx" ON "pages_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_grid_category_idx" ON "pages_blocks_product_grid" USING btree ("category_id");
  CREATE INDEX "pages_blocks_product_grid_brand_idx" ON "pages_blocks_product_grid" USING btree ("brand_id");
  CREATE INDEX "pages_blocks_category_grid_order_idx" ON "pages_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_grid_parent_id_idx" ON "pages_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_grid_path_idx" ON "pages_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_features_icon_upload_idx" ON "pages_blocks_features_features" USING btree ("icon_upload_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_quick_order_order_idx" ON "pages_blocks_quick_order" USING btree ("_order");
  CREATE INDEX "pages_blocks_quick_order_parent_id_idx" ON "pages_blocks_quick_order" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quick_order_path_idx" ON "pages_blocks_quick_order" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_filters_order_idx" ON "pages_blocks_product_filters" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_filters_parent_id_idx" ON "pages_blocks_product_filters" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_filters_path_idx" ON "pages_blocks_product_filters" USING btree ("_path");
  CREATE INDEX "pages_blocks_search_bar_popular_searches_order_idx" ON "pages_blocks_search_bar_popular_searches" USING btree ("_order");
  CREATE INDEX "pages_blocks_search_bar_popular_searches_parent_id_idx" ON "pages_blocks_search_bar_popular_searches" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_search_bar_order_idx" ON "pages_blocks_search_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_search_bar_parent_id_idx" ON "pages_blocks_search_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_search_bar_path_idx" ON "pages_blocks_search_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_background_image_idx" ON "pages_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_manual_testimonials_order_idx" ON "pages_blocks_testimonials_manual_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_manual_testimonials_parent_id_idx" ON "pages_blocks_testimonials_manual_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_manual_testimonials_photo_idx" ON "pages_blocks_testimonials_manual_testimonials" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_cases_order_idx" ON "pages_blocks_cases" USING btree ("_order");
  CREATE INDEX "pages_blocks_cases_parent_id_idx" ON "pages_blocks_cases" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cases_path_idx" ON "pages_blocks_cases" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_bar_logos_order_idx" ON "pages_blocks_logo_bar_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_bar_logos_parent_id_idx" ON "pages_blocks_logo_bar_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_bar_logos_image_idx" ON "pages_blocks_logo_bar_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_bar_order_idx" ON "pages_blocks_logo_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_bar_parent_id_idx" ON "pages_blocks_logo_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_bar_path_idx" ON "pages_blocks_logo_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_members_order_idx" ON "pages_blocks_team_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_members_parent_id_idx" ON "pages_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_members_photo_idx" ON "pages_blocks_team_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_items_order_idx" ON "pages_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_items_parent_id_idx" ON "pages_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_order_idx" ON "pages_blocks_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_parent_id_idx" ON "pages_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_path_idx" ON "pages_blocks_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_blog_preview_order_idx" ON "pages_blocks_blog_preview" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_preview_parent_id_idx" ON "pages_blocks_blog_preview" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_preview_path_idx" ON "pages_blocks_blog_preview" USING btree ("_path");
  CREATE INDEX "pages_blocks_blog_preview_category_idx" ON "pages_blocks_blog_preview" USING btree ("category_id");
  CREATE INDEX "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_poster_image_idx" ON "pages_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "pages_blocks_map_order_idx" ON "pages_blocks_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_parent_id_idx" ON "pages_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_path_idx" ON "pages_blocks_map" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "pages_rels_product_categories_id_idx" ON "pages_rels" USING btree ("product_categories_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "pages_rels_cases_id_idx" ON "pages_rels" USING btree ("cases_id");
  CREATE INDEX "pages_rels_partners_id_idx" ON "pages_rels" USING btree ("partners_id");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id");
  CREATE INDEX "_pages_v_blocks_top_bar_left_messages_order_idx" ON "_pages_v_blocks_top_bar_left_messages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_top_bar_left_messages_parent_id_idx" ON "_pages_v_blocks_top_bar_left_messages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_top_bar_right_links_order_idx" ON "_pages_v_blocks_top_bar_right_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_top_bar_right_links_parent_id_idx" ON "_pages_v_blocks_top_bar_right_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_top_bar_order_idx" ON "_pages_v_blocks_top_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_top_bar_parent_id_idx" ON "_pages_v_blocks_top_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_top_bar_path_idx" ON "_pages_v_blocks_top_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_breadcrumb_items_order_idx" ON "_pages_v_blocks_breadcrumb_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_breadcrumb_items_parent_id_idx" ON "_pages_v_blocks_breadcrumb_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_breadcrumb_order_idx" ON "_pages_v_blocks_breadcrumb" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_breadcrumb_parent_id_idx" ON "_pages_v_blocks_breadcrumb" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_breadcrumb_path_idx" ON "_pages_v_blocks_breadcrumb" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_background_image_idx" ON "_pages_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_two_column_order_idx" ON "_pages_v_blocks_two_column" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_column_parent_id_idx" ON "_pages_v_blocks_two_column" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_column_path_idx" ON "_pages_v_blocks_two_column" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_grid_order_idx" ON "_pages_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_grid_parent_id_idx" ON "_pages_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_path_idx" ON "_pages_v_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_grid_category_idx" ON "_pages_v_blocks_product_grid" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_product_grid_brand_idx" ON "_pages_v_blocks_product_grid" USING btree ("brand_id");
  CREATE INDEX "_pages_v_blocks_category_grid_order_idx" ON "_pages_v_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_grid_parent_id_idx" ON "_pages_v_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_path_idx" ON "_pages_v_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_features_order_idx" ON "_pages_v_blocks_features_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_features_parent_id_idx" ON "_pages_v_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_features_icon_upload_idx" ON "_pages_v_blocks_features_features" USING btree ("icon_upload_id");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quick_order_order_idx" ON "_pages_v_blocks_quick_order" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quick_order_parent_id_idx" ON "_pages_v_blocks_quick_order" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quick_order_path_idx" ON "_pages_v_blocks_quick_order" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_filters_order_idx" ON "_pages_v_blocks_product_filters" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_filters_parent_id_idx" ON "_pages_v_blocks_product_filters" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_filters_path_idx" ON "_pages_v_blocks_product_filters" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_search_bar_popular_searches_order_idx" ON "_pages_v_blocks_search_bar_popular_searches" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_search_bar_popular_searches_parent_id_idx" ON "_pages_v_blocks_search_bar_popular_searches" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_search_bar_order_idx" ON "_pages_v_blocks_search_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_search_bar_parent_id_idx" ON "_pages_v_blocks_search_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_search_bar_path_idx" ON "_pages_v_blocks_search_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_background_image_idx" ON "_pages_v_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_manual_testimonials_order_idx" ON "_pages_v_blocks_testimonials_manual_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_manual_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_manual_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_manual_testimonials_photo_idx" ON "_pages_v_blocks_testimonials_manual_testimonials" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cases_order_idx" ON "_pages_v_blocks_cases" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cases_parent_id_idx" ON "_pages_v_blocks_cases" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cases_path_idx" ON "_pages_v_blocks_cases" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_bar_logos_order_idx" ON "_pages_v_blocks_logo_bar_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_bar_logos_parent_id_idx" ON "_pages_v_blocks_logo_bar_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_bar_logos_image_idx" ON "_pages_v_blocks_logo_bar_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logo_bar_order_idx" ON "_pages_v_blocks_logo_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_bar_parent_id_idx" ON "_pages_v_blocks_logo_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_bar_path_idx" ON "_pages_v_blocks_logo_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_members_order_idx" ON "_pages_v_blocks_team_members" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_members_parent_id_idx" ON "_pages_v_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_members_photo_idx" ON "_pages_v_blocks_team_members" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_team_order_idx" ON "_pages_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_parent_id_idx" ON "_pages_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_path_idx" ON "_pages_v_blocks_team" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_items_order_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_items_parent_id_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_order_idx" ON "_pages_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_parent_id_idx" ON "_pages_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_path_idx" ON "_pages_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_blog_preview_order_idx" ON "_pages_v_blocks_blog_preview" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_blog_preview_parent_id_idx" ON "_pages_v_blocks_blog_preview" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_blog_preview_path_idx" ON "_pages_v_blocks_blog_preview" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_blog_preview_category_idx" ON "_pages_v_blocks_blog_preview" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_poster_image_idx" ON "_pages_v_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "_pages_v_blocks_map_order_idx" ON "_pages_v_blocks_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_parent_id_idx" ON "_pages_v_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_path_idx" ON "_pages_v_blocks_map" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_rels_product_categories_id_idx" ON "_pages_v_rels" USING btree ("product_categories_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_rels_cases_id_idx" ON "_pages_v_rels" USING btree ("cases_id");
  CREATE INDEX "_pages_v_rels_partners_id_idx" ON "_pages_v_rels" USING btree ("partners_id");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_featured_image_idx" ON "blog_posts" USING btree ("featured_image_id");
  CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX "blog_posts_meta_meta_image_idx" ON "blog_posts" USING btree ("meta_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts__status_idx" ON "blog_posts" USING btree ("_status");
  CREATE INDEX "blog_posts_rels_order_idx" ON "blog_posts_rels" USING btree ("order");
  CREATE INDEX "blog_posts_rels_parent_idx" ON "blog_posts_rels" USING btree ("parent_id");
  CREATE INDEX "blog_posts_rels_path_idx" ON "blog_posts_rels" USING btree ("path");
  CREATE INDEX "blog_posts_rels_product_categories_id_idx" ON "blog_posts_rels" USING btree ("product_categories_id");
  CREATE INDEX "_blog_posts_v_parent_idx" ON "_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX "_blog_posts_v_version_version_featured_image_idx" ON "_blog_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_blog_posts_v_version_version_author_idx" ON "_blog_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_blog_posts_v_version_meta_version_meta_image_idx" ON "_blog_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_blog_posts_v_version_version_updated_at_idx" ON "_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_posts_v_version_version_created_at_idx" ON "_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_posts_v_version_version__status_idx" ON "_blog_posts_v" USING btree ("version__status");
  CREATE INDEX "_blog_posts_v_created_at_idx" ON "_blog_posts_v" USING btree ("created_at");
  CREATE INDEX "_blog_posts_v_updated_at_idx" ON "_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX "_blog_posts_v_latest_idx" ON "_blog_posts_v" USING btree ("latest");
  CREATE INDEX "_blog_posts_v_autosave_idx" ON "_blog_posts_v" USING btree ("autosave");
  CREATE INDEX "_blog_posts_v_rels_order_idx" ON "_blog_posts_v_rels" USING btree ("order");
  CREATE INDEX "_blog_posts_v_rels_parent_idx" ON "_blog_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_blog_posts_v_rels_path_idx" ON "_blog_posts_v_rels" USING btree ("path");
  CREATE INDEX "_blog_posts_v_rels_product_categories_id_idx" ON "_blog_posts_v_rels" USING btree ("product_categories_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "cases_services_order_idx" ON "cases_services" USING btree ("_order");
  CREATE INDEX "cases_services_parent_id_idx" ON "cases_services" USING btree ("_parent_id");
  CREATE INDEX "cases_gallery_order_idx" ON "cases_gallery" USING btree ("_order");
  CREATE INDEX "cases_gallery_parent_id_idx" ON "cases_gallery" USING btree ("_parent_id");
  CREATE INDEX "cases_gallery_image_idx" ON "cases_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "cases_slug_idx" ON "cases" USING btree ("slug");
  CREATE INDEX "cases_featured_image_idx" ON "cases" USING btree ("featured_image_id");
  CREATE INDEX "cases_meta_meta_image_idx" ON "cases" USING btree ("meta_image_id");
  CREATE INDEX "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
  CREATE INDEX "cases_created_at_idx" ON "cases" USING btree ("created_at");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "services_icon_upload_idx" ON "services" USING btree ("icon_upload_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_parent_idx" ON "product_categories" USING btree ("parent_id");
  CREATE INDEX "product_categories_image_idx" ON "product_categories" USING btree ("image_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_meta_meta_image_idx" ON "brands" USING btree ("meta_image_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "products_specifications_order_idx" ON "products_specifications" USING btree ("_order");
  CREATE INDEX "products_specifications_parent_id_idx" ON "products_specifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");
  CREATE INDEX "products_meta_meta_image_idx" ON "products" USING btree ("meta_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "products_rels_product_categories_id_idx" ON "products_rels" USING btree ("product_categories_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE UNIQUE INDEX "customer_groups_name_idx" ON "customer_groups" USING btree ("name");
  CREATE UNIQUE INDEX "customer_groups_slug_idx" ON "customer_groups" USING btree ("slug");
  CREATE INDEX "customer_groups_updated_at_idx" ON "customer_groups" USING btree ("updated_at");
  CREATE INDEX "customer_groups_created_at_idx" ON "customer_groups" USING btree ("created_at");
  CREATE INDEX "order_lists_items_order_idx" ON "order_lists_items" USING btree ("_order");
  CREATE INDEX "order_lists_items_parent_id_idx" ON "order_lists_items" USING btree ("_parent_id");
  CREATE INDEX "order_lists_items_product_idx" ON "order_lists_items" USING btree ("product_id");
  CREATE INDEX "order_lists_share_with_order_idx" ON "order_lists_share_with" USING btree ("_order");
  CREATE INDEX "order_lists_share_with_parent_id_idx" ON "order_lists_share_with" USING btree ("_parent_id");
  CREATE INDEX "order_lists_share_with_user_idx" ON "order_lists_share_with" USING btree ("user_id");
  CREATE INDEX "order_lists_owner_idx" ON "order_lists" USING btree ("owner_id");
  CREATE INDEX "order_lists_updated_at_idx" ON "order_lists" USING btree ("updated_at");
  CREATE INDEX "order_lists_created_at_idx" ON "order_lists" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_invoice_p_d_f_idx" ON "orders" USING btree ("invoice_p_d_f_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "client_requests_website_pages_order_idx" ON "client_requests_website_pages" USING btree ("order");
  CREATE INDEX "client_requests_website_pages_parent_idx" ON "client_requests_website_pages" USING btree ("parent_id");
  CREATE INDEX "client_requests_payment_methods_order_idx" ON "client_requests_payment_methods" USING btree ("order");
  CREATE INDEX "client_requests_payment_methods_parent_idx" ON "client_requests_payment_methods" USING btree ("parent_id");
  CREATE INDEX "client_requests_created_user_idx" ON "client_requests" USING btree ("created_user_id");
  CREATE INDEX "client_requests_created_client_idx" ON "client_requests" USING btree ("created_client_id");
  CREATE INDEX "client_requests_updated_at_idx" ON "client_requests" USING btree ("updated_at");
  CREATE INDEX "client_requests_created_at_idx" ON "client_requests" USING btree ("created_at");
  CREATE INDEX "clients_enabled_features_order_idx" ON "clients_enabled_features" USING btree ("order");
  CREATE INDEX "clients_enabled_features_parent_idx" ON "clients_enabled_features" USING btree ("parent_id");
  CREATE INDEX "clients_disabled_collections_order_idx" ON "clients_disabled_collections" USING btree ("order");
  CREATE INDEX "clients_disabled_collections_parent_idx" ON "clients_disabled_collections" USING btree ("parent_id");
  CREATE UNIQUE INDEX "clients_domain_idx" ON "clients" USING btree ("domain");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "deployments_client_idx" ON "deployments" USING btree ("client_id");
  CREATE INDEX "deployments_updated_at_idx" ON "deployments" USING btree ("updated_at");
  CREATE INDEX "deployments_created_at_idx" ON "deployments" USING btree ("created_at");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_customer_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("customer_groups_id");
  CREATE INDEX "payload_locked_documents_rels_order_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("order_lists_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_client_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("client_requests_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_deployments_id_idx" ON "payload_locked_documents_rels" USING btree ("deployments_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "settings_hours_order_idx" ON "settings_hours" USING btree ("_order");
  CREATE INDEX "settings_hours_parent_id_idx" ON "settings_hours" USING btree ("_parent_id");
  CREATE INDEX "settings_sitemap_exclude_order_idx" ON "settings_sitemap_exclude" USING btree ("_order");
  CREATE INDEX "settings_sitemap_exclude_parent_id_idx" ON "settings_sitemap_exclude" USING btree ("_parent_id");
  CREATE INDEX "settings_robots_disallow_order_idx" ON "settings_robots_disallow" USING btree ("_order");
  CREATE INDEX "settings_robots_disallow_parent_id_idx" ON "settings_robots_disallow" USING btree ("_parent_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");
  CREATE INDEX "settings_logo_white_idx" ON "settings" USING btree ("logo_white_id");
  CREATE INDEX "settings_favicon_idx" ON "settings" USING btree ("favicon_id");
  CREATE INDEX "settings_default_o_g_image_idx" ON "settings" USING btree ("default_o_g_image_id");
  CREATE INDEX "settings_rels_order_idx" ON "settings_rels" USING btree ("order");
  CREATE INDEX "settings_rels_parent_idx" ON "settings_rels" USING btree ("parent_id");
  CREATE INDEX "settings_rels_path_idx" ON "settings_rels" USING btree ("path");
  CREATE INDEX "settings_rels_media_id_idx" ON "settings_rels" USING btree ("media_id");
  CREATE INDEX "header_top_bar_left_messages_order_idx" ON "header_top_bar_left_messages" USING btree ("_order");
  CREATE INDEX "header_top_bar_left_messages_parent_id_idx" ON "header_top_bar_left_messages" USING btree ("_parent_id");
  CREATE INDEX "header_top_bar_right_links_order_idx" ON "header_top_bar_right_links" USING btree ("_order");
  CREATE INDEX "header_top_bar_right_links_parent_id_idx" ON "header_top_bar_right_links" USING btree ("_parent_id");
  CREATE INDEX "header_custom_buttons_order_idx" ON "header_custom_buttons" USING btree ("_order");
  CREATE INDEX "header_custom_buttons_parent_id_idx" ON "header_custom_buttons" USING btree ("_parent_id");
  CREATE INDEX "header_navigation_items_children_order_idx" ON "header_navigation_items_children" USING btree ("_order");
  CREATE INDEX "header_navigation_items_children_parent_id_idx" ON "header_navigation_items_children" USING btree ("_parent_id");
  CREATE INDEX "header_navigation_items_children_page_idx" ON "header_navigation_items_children" USING btree ("page_id");
  CREATE INDEX "header_navigation_items_order_idx" ON "header_navigation_items" USING btree ("_order");
  CREATE INDEX "header_navigation_items_parent_id_idx" ON "header_navigation_items" USING btree ("_parent_id");
  CREATE INDEX "header_navigation_items_page_idx" ON "header_navigation_items" USING btree ("page_id");
  CREATE INDEX "header_logo_override_idx" ON "header" USING btree ("logo_override_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_page_idx" ON "footer_columns_links" USING btree ("page_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_addresses" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_blocks_top_bar_left_messages" CASCADE;
  DROP TABLE "pages_blocks_top_bar_right_links" CASCADE;
  DROP TABLE "pages_blocks_top_bar" CASCADE;
  DROP TABLE "pages_blocks_breadcrumb_items" CASCADE;
  DROP TABLE "pages_blocks_breadcrumb" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_two_column" CASCADE;
  DROP TABLE "pages_blocks_product_grid" CASCADE;
  DROP TABLE "pages_blocks_category_grid" CASCADE;
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_quick_order" CASCADE;
  DROP TABLE "pages_blocks_product_filters" CASCADE;
  DROP TABLE "pages_blocks_search_bar_popular_searches" CASCADE;
  DROP TABLE "pages_blocks_search_bar" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_testimonials_manual_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_cases" CASCADE;
  DROP TABLE "pages_blocks_logo_bar_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_bar" CASCADE;
  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_team_members" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages_blocks_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_accordion" CASCADE;
  DROP TABLE "pages_blocks_blog_preview" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_map" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_top_bar_left_messages" CASCADE;
  DROP TABLE "_pages_v_blocks_top_bar_right_links" CASCADE;
  DROP TABLE "_pages_v_blocks_top_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_breadcrumb_items" CASCADE;
  DROP TABLE "_pages_v_blocks_breadcrumb" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_two_column" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_features_features" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_quick_order" CASCADE;
  DROP TABLE "_pages_v_blocks_product_filters" CASCADE;
  DROP TABLE "_pages_v_blocks_search_bar_popular_searches" CASCADE;
  DROP TABLE "_pages_v_blocks_search_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_manual_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_cases" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_bar_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_team_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_preview" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_map" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_rels" CASCADE;
  DROP TABLE "_blog_posts_v" CASCADE;
  DROP TABLE "_blog_posts_v_rels" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "cases_services" CASCADE;
  DROP TABLE "cases_gallery" CASCADE;
  DROP TABLE "cases" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "products_specifications" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "customer_groups" CASCADE;
  DROP TABLE "order_lists_items" CASCADE;
  DROP TABLE "order_lists_share_with" CASCADE;
  DROP TABLE "order_lists" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "client_requests_website_pages" CASCADE;
  DROP TABLE "client_requests_payment_methods" CASCADE;
  DROP TABLE "client_requests" CASCADE;
  DROP TABLE "clients_enabled_features" CASCADE;
  DROP TABLE "clients_disabled_collections" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "deployments" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "settings_hours" CASCADE;
  DROP TABLE "settings_sitemap_exclude" CASCADE;
  DROP TABLE "settings_robots_disallow" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_rels" CASCADE;
  DROP TABLE "theme" CASCADE;
  DROP TABLE "header_top_bar_left_messages" CASCADE;
  DROP TABLE "header_top_bar_right_links" CASCADE;
  DROP TABLE "header_custom_buttons" CASCADE;
  DROP TABLE "header_navigation_items_children" CASCADE;
  DROP TABLE "header_navigation_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."enum_users_addresses_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_account_type";
  DROP TYPE "public"."enum_users_client_type";
  DROP TYPE "public"."enum_pages_blocks_breadcrumb_mode";
  DROP TYPE "public"."enum_pages_blocks_breadcrumb_separator";
  DROP TYPE "public"."enum_pages_blocks_spacer_height";
  DROP TYPE "public"."enum_pages_blocks_hero_style";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_two_column_ratio";
  DROP TYPE "public"."enum_pages_blocks_two_column_alignment";
  DROP TYPE "public"."enum_pages_blocks_product_grid_source";
  DROP TYPE "public"."enum_pages_blocks_product_grid_display_mode";
  DROP TYPE "public"."enum_pages_blocks_product_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_category_grid_source";
  DROP TYPE "public"."enum_pages_blocks_category_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_features_features_icon_type";
  DROP TYPE "public"."enum_pages_blocks_features_source";
  DROP TYPE "public"."enum_pages_blocks_features_category";
  DROP TYPE "public"."enum_pages_blocks_features_layout";
  DROP TYPE "public"."enum_pages_blocks_features_style";
  DROP TYPE "public"."enum_pages_blocks_quick_order_input_mode";
  DROP TYPE "public"."enum_pages_blocks_product_filters_position";
  DROP TYPE "public"."enum_pages_blocks_product_filters_style";
  DROP TYPE "public"."enum_pages_blocks_search_bar_style";
  DROP TYPE "public"."enum_pages_blocks_cta_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_source";
  DROP TYPE "public"."enum_pages_blocks_testimonials_layout";
  DROP TYPE "public"."enum_pages_blocks_cases_source";
  DROP TYPE "public"."enum_pages_blocks_cases_layout";
  DROP TYPE "public"."enum_pages_blocks_logo_bar_source";
  DROP TYPE "public"."enum_pages_blocks_logo_bar_category";
  DROP TYPE "public"."enum_pages_blocks_logo_bar_layout";
  DROP TYPE "public"."enum_pages_blocks_stats_layout";
  DROP TYPE "public"."enum_pages_blocks_faq_source";
  DROP TYPE "public"."enum_pages_blocks_faq_category";
  DROP TYPE "public"."enum_pages_blocks_team_layout";
  DROP TYPE "public"."enum_pages_blocks_blog_preview_layout";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_layout";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_video_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_map_height";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_breadcrumb_mode";
  DROP TYPE "public"."enum__pages_v_blocks_breadcrumb_separator";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_height";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_two_column_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_two_column_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_features_features_icon_type";
  DROP TYPE "public"."enum__pages_v_blocks_features_source";
  DROP TYPE "public"."enum__pages_v_blocks_features_category";
  DROP TYPE "public"."enum__pages_v_blocks_features_layout";
  DROP TYPE "public"."enum__pages_v_blocks_features_style";
  DROP TYPE "public"."enum__pages_v_blocks_quick_order_input_mode";
  DROP TYPE "public"."enum__pages_v_blocks_product_filters_position";
  DROP TYPE "public"."enum__pages_v_blocks_product_filters_style";
  DROP TYPE "public"."enum__pages_v_blocks_search_bar_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_style";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_layout";
  DROP TYPE "public"."enum__pages_v_blocks_cases_source";
  DROP TYPE "public"."enum__pages_v_blocks_cases_layout";
  DROP TYPE "public"."enum__pages_v_blocks_logo_bar_source";
  DROP TYPE "public"."enum__pages_v_blocks_logo_bar_category";
  DROP TYPE "public"."enum__pages_v_blocks_logo_bar_layout";
  DROP TYPE "public"."enum__pages_v_blocks_stats_layout";
  DROP TYPE "public"."enum__pages_v_blocks_faq_source";
  DROP TYPE "public"."enum__pages_v_blocks_faq_category";
  DROP TYPE "public"."enum__pages_v_blocks_team_layout";
  DROP TYPE "public"."enum__pages_v_blocks_blog_preview_layout";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_layout";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_video_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_map_height";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum_cases_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_services_icon_type";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum_partners_category";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum_products_badge";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_customer_groups_type";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_client_requests_website_pages";
  DROP TYPE "public"."enum_client_requests_payment_methods";
  DROP TYPE "public"."enum_client_requests_status";
  DROP TYPE "public"."enum_client_requests_site_type";
  DROP TYPE "public"."enum_client_requests_expected_products";
  DROP TYPE "public"."enum_clients_enabled_features";
  DROP TYPE "public"."enum_clients_disabled_collections";
  DROP TYPE "public"."enum_clients_status";
  DROP TYPE "public"."enum_clients_plan";
  DROP TYPE "public"."enum_clients_template";
  DROP TYPE "public"."enum_clients_deployment_provider";
  DROP TYPE "public"."enum_clients_billing_status";
  DROP TYPE "public"."enum_clients_stripe_account_status";
  DROP TYPE "public"."enum_clients_payment_pricing_tier";
  DROP TYPE "public"."enum_clients_multi_safepay_account_status";
  DROP TYPE "public"."enum_clients_multi_safepay_pricing_tier";
  DROP TYPE "public"."enum_clients_health_status";
  DROP TYPE "public"."enum_deployments_status";
  DROP TYPE "public"."enum_deployments_environment";
  DROP TYPE "public"."enum_deployments_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_settings_hours_day";
  DROP TYPE "public"."enum_theme_font_scale";
  DROP TYPE "public"."enum_theme_border_radius";
  DROP TYPE "public"."enum_theme_spacing";
  DROP TYPE "public"."enum_theme_container_width";
  DROP TYPE "public"."enum_theme_shadow_size";
  DROP TYPE "public"."enum_header_custom_buttons_style";
  DROP TYPE "public"."enum_header_navigation_items_type";
  DROP TYPE "public"."enum_header_alert_bar_type";
  DROP TYPE "public"."enum_footer_columns_links_type";`)
}

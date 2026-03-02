import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_construction_hero_avatars_color" AS ENUM('teal', 'blue', 'purple', 'amber');
  CREATE TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_color" AS ENUM('green', 'amber', 'blue', 'teal');
  CREATE TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_position" AS ENUM('bottom-left', 'top-right');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_services_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_projects_grid_projects_source" AS ENUM('auto', 'featured', 'manual', 'category');
  CREATE TYPE "public"."enum_pages_blocks_projects_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_reviews_grid_reviews_source" AS ENUM('featured', 'auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_reviews_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_reviews_grid_layout" AS ENUM('cards', 'quotes', 'compact');
  CREATE TYPE "public"."enum_pages_blocks_reviews_grid_average_rating_position" AS ENUM('top', 'left');
  CREATE TYPE "public"."enum_pages_blocks_stats_bar_stats_icon" AS ENUM('none', 'construction', 'star', 'users', 'trophy', 'chart', 'check', 'target', 'briefcase');
  CREATE TYPE "public"."enum_pages_blocks_stats_bar_style" AS ENUM('default', 'accent', 'dark', 'transparent');
  CREATE TYPE "public"."enum_pages_blocks_stats_bar_layout" AS ENUM('horizontal', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_buttons_variant" AS ENUM('primary', 'secondary', 'white');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_trust_elements_items_icon" AS ENUM('check', 'star', 'trophy', 'lock', 'lightning');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_style" AS ENUM('gradient', 'solid', 'outlined', 'image');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_construction_hero_avatars_color" AS ENUM('teal', 'blue', 'purple', 'amber');
  CREATE TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_color" AS ENUM('green', 'amber', 'blue', 'teal');
  CREATE TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_position" AS ENUM('bottom-left', 'top-right');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_services_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_projects_grid_projects_source" AS ENUM('auto', 'featured', 'manual', 'category');
  CREATE TYPE "public"."enum__pages_v_blocks_projects_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_reviews_source" AS ENUM('featured', 'auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_layout" AS ENUM('cards', 'quotes', 'compact');
  CREATE TYPE "public"."enum__pages_v_blocks_reviews_grid_average_rating_position" AS ENUM('top', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_bar_stats_icon" AS ENUM('none', 'construction', 'star', 'users', 'trophy', 'chart', 'check', 'target', 'briefcase');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_bar_style" AS ENUM('default', 'accent', 'dark', 'transparent');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_bar_layout" AS ENUM('horizontal', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_buttons_variant" AS ENUM('primary', 'secondary', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_trust_elements_items_icon" AS ENUM('check', 'star', 'trophy', 'lock', 'lightning');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_style" AS ENUM('gradient', 'solid', 'outlined', 'image');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_products_variant_options_display_type" AS ENUM('colorSwatch', 'sizeRadio', 'dropdown', 'imageRadio', 'checkbox', 'textInput');
  CREATE TYPE "public"."enum_subscription_plans_billing_interval" AS ENUM('monthly', 'yearly', 'lifetime');
  CREATE TYPE "public"."enum_user_subscriptions_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'unpaid');
  CREATE TYPE "public"."enum_payment_methods_type" AS ENUM('sepa', 'card', 'paypal', 'ideal');
  CREATE TYPE "public"."enum_payment_methods_card_brand" AS ENUM('visa', 'mastercard', 'amex');
  CREATE TYPE "public"."enum_gift_vouchers_status" AS ENUM('active', 'spent', 'expired', 'canceled');
  CREATE TYPE "public"."enum_gift_vouchers_occasion" AS ENUM('birthday', 'christmas', 'graduation', 'business', 'love', 'thanks', 'newhome', 'universal');
  CREATE TYPE "public"."enum_gift_vouchers_delivery_method" AS ENUM('email', 'print', 'post');
  CREATE TYPE "public"."enum_licenses_type" AS ENUM('personal', 'professional', 'enterprise', 'lifetime', 'yearly', 'ebook', 'templates');
  CREATE TYPE "public"."enum_licenses_status" AS ENUM('active', 'expired', 'revoked', 'pending_renewal');
  CREATE TYPE "public"."enum_license_activations_status" AS ENUM('active', 'deactivated');
  CREATE TYPE "public"."enum_loyalty_rewards_type" AS ENUM('discount', 'shipping', 'gift', 'upgrade', 'event', 'merchandise');
  CREATE TYPE "public"."enum_loyalty_transactions_type" AS ENUM('earned_purchase', 'earned_review', 'earned_referral', 'earned_birthday', 'earned_bonus', 'spent_reward', 'expired', 'adjustment');
  CREATE TYPE "public"."enum_loyalty_redemptions_status" AS ENUM('available', 'used', 'expired', 'canceled');
  CREATE TYPE "public"."enum_construction_services_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral');
  CREATE TYPE "public"."enum_construction_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_construction_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_construction_reviews_client_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral');
  CREATE TYPE "public"."enum_construction_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_quote_requests_project_type" AS ENUM('nieuwbouw', 'renovatie', 'verduurzaming', 'aanbouw', 'utiliteitsbouw', 'herstelwerk');
  CREATE TYPE "public"."enum_quote_requests_budget" AS ENUM('< 50k', '50k-100k', '100k-250k', '250k-500k', '> 500k', 'unknown');
  CREATE TYPE "public"."enum_quote_requests_timeline" AS ENUM('asap', '3months', '6months', 'thisyear', 'nextyear', 'unknown');
  CREATE TYPE "public"."enum_quote_requests_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost');
  ALTER TYPE "public"."enum_products_product_type" ADD VALUE 'variable';
  ALTER TYPE "public"."enum_products_product_type" ADD VALUE 'mixAndMatch';
  CREATE TABLE "pages_blocks_construction_hero_avatars" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"initials" varchar,
  	"color" "enum_pages_blocks_construction_hero_avatars_color" DEFAULT 'teal'
  );
  
  CREATE TABLE "pages_blocks_construction_hero_floating_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"icon" varchar,
  	"color" "enum_pages_blocks_construction_hero_floating_badges_color" DEFAULT 'green',
  	"position" "enum_pages_blocks_construction_hero_floating_badges_position" DEFAULT 'bottom-left'
  );
  
  CREATE TABLE "pages_blocks_construction_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"badge_icon" varchar DEFAULT 'award',
  	"title" varchar,
  	"description" varchar,
  	"primary_c_t_a_text" varchar DEFAULT 'Gratis offerte aanvragen',
  	"primary_c_t_a_icon" varchar DEFAULT 'file-text',
  	"primary_c_t_a_link" varchar DEFAULT '/offerte-aanvragen',
  	"secondary_c_t_a_text" varchar DEFAULT 'Bekijk projecten',
  	"secondary_c_t_a_icon" varchar DEFAULT 'play-circle',
  	"secondary_c_t_a_link" varchar DEFAULT '/projecten',
  	"trust_text" varchar DEFAULT '500+ tevreden opdrachtgevers',
  	"trust_subtext" varchar DEFAULT 'Gemiddeld 4.9/5 beoordeeld',
  	"hero_image_id" integer,
  	"hero_emoji" varchar DEFAULT '🏗️',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_badge" varchar DEFAULT 'Onze diensten',
  	"heading_badge_icon" varchar DEFAULT 'wrench',
  	"heading_title" varchar DEFAULT 'Alles onder één dak',
  	"heading_description" varchar DEFAULT 'Van eerste schets tot sleuteloverdracht. Wij begeleiden u bij elke stap van uw bouwproject.',
  	"services_source" "enum_pages_blocks_services_grid_services_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_services_grid_columns" DEFAULT '3',
  	"link_text" varchar DEFAULT 'Meer info',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_projects_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Onze projecten',
  	"heading_description" varchar,
  	"projects_source" "enum_pages_blocks_projects_grid_projects_source" DEFAULT 'auto',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_projects_grid_columns" DEFAULT '3',
  	"show_filter" boolean DEFAULT false,
  	"cta_button_enabled" boolean DEFAULT false,
  	"cta_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"cta_button_link" varchar DEFAULT '/projecten',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_reviews_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Wat onze klanten zeggen',
  	"heading_description" varchar,
  	"reviews_source" "enum_pages_blocks_reviews_grid_reviews_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_reviews_grid_columns" DEFAULT '3',
  	"layout" "enum_pages_blocks_reviews_grid_layout" DEFAULT 'cards',
  	"show_ratings" boolean DEFAULT true,
  	"show_avatars" boolean DEFAULT true,
  	"average_rating_enabled" boolean DEFAULT false,
  	"average_rating_position" "enum_pages_blocks_reviews_grid_average_rating_position" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_bar_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" "enum_pages_blocks_stats_bar_stats_icon" DEFAULT 'none'
  );
  
  CREATE TABLE "pages_blocks_stats_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_stats_bar_style" DEFAULT 'default',
  	"layout" "enum_pages_blocks_stats_bar_layout" DEFAULT 'horizontal',
  	"animate" boolean DEFAULT true,
  	"dividers" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"link" varchar,
  	"variant" "enum_pages_blocks_cta_banner_buttons_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_cta_banner_trust_elements_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_cta_banner_trust_elements_items_icon" DEFAULT 'check',
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_cta_banner_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"trust_elements_enabled" boolean DEFAULT false,
  	"alignment" "enum_pages_blocks_cta_banner_alignment" DEFAULT 'center',
  	"size" "enum_pages_blocks_cta_banner_size" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_construction_hero_avatars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"initials" varchar,
  	"color" "enum__pages_v_blocks_construction_hero_avatars_color" DEFAULT 'teal',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_construction_hero_floating_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"icon" varchar,
  	"color" "enum__pages_v_blocks_construction_hero_floating_badges_color" DEFAULT 'green',
  	"position" "enum__pages_v_blocks_construction_hero_floating_badges_position" DEFAULT 'bottom-left',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_construction_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"badge_icon" varchar DEFAULT 'award',
  	"title" varchar,
  	"description" varchar,
  	"primary_c_t_a_text" varchar DEFAULT 'Gratis offerte aanvragen',
  	"primary_c_t_a_icon" varchar DEFAULT 'file-text',
  	"primary_c_t_a_link" varchar DEFAULT '/offerte-aanvragen',
  	"secondary_c_t_a_text" varchar DEFAULT 'Bekijk projecten',
  	"secondary_c_t_a_icon" varchar DEFAULT 'play-circle',
  	"secondary_c_t_a_link" varchar DEFAULT '/projecten',
  	"trust_text" varchar DEFAULT '500+ tevreden opdrachtgevers',
  	"trust_subtext" varchar DEFAULT 'Gemiddeld 4.9/5 beoordeeld',
  	"hero_image_id" integer,
  	"hero_emoji" varchar DEFAULT '🏗️',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_badge" varchar DEFAULT 'Onze diensten',
  	"heading_badge_icon" varchar DEFAULT 'wrench',
  	"heading_title" varchar DEFAULT 'Alles onder één dak',
  	"heading_description" varchar DEFAULT 'Van eerste schets tot sleuteloverdracht. Wij begeleiden u bij elke stap van uw bouwproject.',
  	"services_source" "enum__pages_v_blocks_services_grid_services_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_services_grid_columns" DEFAULT '3',
  	"link_text" varchar DEFAULT 'Meer info',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_projects_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Onze projecten',
  	"heading_description" varchar,
  	"projects_source" "enum__pages_v_blocks_projects_grid_projects_source" DEFAULT 'auto',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_projects_grid_columns" DEFAULT '3',
  	"show_filter" boolean DEFAULT false,
  	"cta_button_enabled" boolean DEFAULT false,
  	"cta_button_text" varchar DEFAULT 'Bekijk alle projecten',
  	"cta_button_link" varchar DEFAULT '/projecten',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_reviews_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_badge" varchar,
  	"heading_title" varchar DEFAULT 'Wat onze klanten zeggen',
  	"heading_description" varchar,
  	"reviews_source" "enum__pages_v_blocks_reviews_grid_reviews_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_reviews_grid_columns" DEFAULT '3',
  	"layout" "enum__pages_v_blocks_reviews_grid_layout" DEFAULT 'cards',
  	"show_ratings" boolean DEFAULT true,
  	"show_avatars" boolean DEFAULT true,
  	"average_rating_enabled" boolean DEFAULT false,
  	"average_rating_position" "enum__pages_v_blocks_reviews_grid_average_rating_position" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_bar_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" "enum__pages_v_blocks_stats_bar_stats_icon" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_stats_bar_style" DEFAULT 'default',
  	"layout" "enum__pages_v_blocks_stats_bar_layout" DEFAULT 'horizontal',
  	"animate" boolean DEFAULT true,
  	"dividers" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"link" varchar,
  	"variant" "enum__pages_v_blocks_cta_banner_buttons_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner_trust_elements_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_cta_banner_trust_elements_items_icon" DEFAULT 'check',
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_cta_banner_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"trust_elements_enabled" boolean DEFAULT false,
  	"alignment" "enum__pages_v_blocks_cta_banner_alignment" DEFAULT 'center',
  	"size" "enum__pages_v_blocks_cta_banner_size" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_variant_options_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"price_modifier" numeric,
  	"stock_level" numeric,
  	"color_code" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "products_variant_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option_name" varchar,
  	"display_type" "enum_products_variant_options_display_type" DEFAULT 'sizeRadio'
  );
  
  CREATE TABLE "products_mix_match_config_box_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"item_count" numeric,
  	"price" numeric,
  	"description" varchar
  );
  
  CREATE TABLE "subscription_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL,
  	"included" boolean DEFAULT true
  );
  
  CREATE TABLE "subscription_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"price" numeric NOT NULL,
  	"price_per_user" numeric,
  	"billing_interval" "enum_subscription_plans_billing_interval" DEFAULT 'monthly' NOT NULL,
  	"limits_users" numeric,
  	"limits_storage" numeric,
  	"limits_api_calls" numeric,
  	"active" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"stripe_product_id" varchar,
  	"stripe_price_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "user_subscriptions_addons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "user_subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"plan_id" integer NOT NULL,
  	"status" "enum_user_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"current_period_start" timestamp(3) with time zone NOT NULL,
  	"current_period_end" timestamp(3) with time zone NOT NULL,
  	"cancel_at_period_end" boolean DEFAULT false,
  	"canceled_at" timestamp(3) with time zone,
  	"usage_users" numeric DEFAULT 1,
  	"usage_storage" numeric DEFAULT 0,
  	"usage_api_calls" numeric DEFAULT 0,
  	"stripe_subscription_id" varchar,
  	"stripe_customer_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payment_methods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_payment_methods_type" NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"sepa_account_holder_name" varchar,
  	"sepa_iban" varchar,
  	"sepa_bank_name" varchar,
  	"card_brand" "enum_payment_methods_card_brand",
  	"card_last4" varchar,
  	"card_expiry_month" numeric,
  	"card_expiry_year" numeric,
  	"stripe_payment_method_id" varchar,
  	"last4" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gift_vouchers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"balance" numeric NOT NULL,
  	"status" "enum_gift_vouchers_status" DEFAULT 'active' NOT NULL,
  	"occasion" "enum_gift_vouchers_occasion" DEFAULT 'universal',
  	"recipient_name" varchar,
  	"recipient_email" varchar NOT NULL,
  	"sender_name" varchar,
  	"sender_email" varchar,
  	"message" varchar,
  	"delivery_method" "enum_gift_vouchers_delivery_method" DEFAULT 'email' NOT NULL,
  	"scheduled_delivery" timestamp(3) with time zone,
  	"sent_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"purchased_by_id" integer,
  	"redeemed_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "licenses_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"version" varchar NOT NULL,
  	"downloaded_at" timestamp(3) with time zone NOT NULL,
  	"file_size" varchar
  );
  
  CREATE TABLE "licenses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"product_id" integer,
  	"product_name" varchar NOT NULL,
  	"license_key" varchar NOT NULL,
  	"type" "enum_licenses_type" DEFAULT 'personal' NOT NULL,
  	"status" "enum_licenses_status" DEFAULT 'active' NOT NULL,
  	"max_activations" numeric DEFAULT 1,
  	"current_activations" numeric DEFAULT 0,
  	"version" varchar,
  	"purchased_at" timestamp(3) with time zone NOT NULL,
  	"expires_at" timestamp(3) with time zone,
  	"order_id" integer,
  	"download_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "license_activations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"license_id" integer NOT NULL,
  	"device_name" varchar NOT NULL,
  	"device_id" varchar NOT NULL,
  	"os" varchar,
  	"status" "enum_license_activations_status" DEFAULT 'active' NOT NULL,
  	"activated_at" timestamp(3) with time zone NOT NULL,
  	"deactivated_at" timestamp(3) with time zone,
  	"last_seen_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "loyalty_tiers_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL
  );
  
  CREATE TABLE "loyalty_tiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" varchar,
  	"color" varchar,
  	"min_points" numeric NOT NULL,
  	"multiplier" numeric DEFAULT 1 NOT NULL,
  	"free_shipping" boolean DEFAULT false,
  	"priority_support" boolean DEFAULT false,
  	"early_access" boolean DEFAULT false,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "loyalty_rewards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar,
  	"type" "enum_loyalty_rewards_type" DEFAULT 'discount' NOT NULL,
  	"points_cost" numeric NOT NULL,
  	"value" numeric,
  	"active" boolean DEFAULT true,
  	"stock" numeric,
  	"tier_required_id" integer,
  	"expiry_days" numeric,
  	"terms" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "loyalty_points" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"available_points" numeric DEFAULT 0 NOT NULL,
  	"total_earned" numeric DEFAULT 0 NOT NULL,
  	"total_spent" numeric DEFAULT 0 NOT NULL,
  	"tier_id" integer,
  	"stats_total_orders" numeric DEFAULT 0,
  	"stats_total_spent_money" numeric DEFAULT 0,
  	"stats_rewards_redeemed" numeric DEFAULT 0,
  	"stats_referrals" numeric DEFAULT 0,
  	"referral_code" varchar,
  	"member_since" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "loyalty_transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_loyalty_transactions_type" NOT NULL,
  	"points" numeric NOT NULL,
  	"description" varchar NOT NULL,
  	"related_order_id" integer,
  	"related_reward_id" integer,
  	"metadata" jsonb,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "loyalty_redemptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"reward_id" integer NOT NULL,
  	"points_spent" numeric NOT NULL,
  	"status" "enum_loyalty_redemptions_status" DEFAULT 'available' NOT NULL,
  	"redeemed_at" timestamp(3) with time zone NOT NULL,
  	"used_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"code" varchar,
  	"used_in_order_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "construction_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "construction_services_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "construction_services_service_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "construction_services_usps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "construction_services_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "construction_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" varchar,
  	"color" "enum_construction_services_color" DEFAULT 'teal',
  	"short_description" varchar NOT NULL,
  	"long_description" jsonb,
  	"hero_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"status" "enum_construction_services_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "construction_services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "construction_projects_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar NOT NULL
  );
  
  CREATE TABLE "construction_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category_id" integer,
  	"location" varchar,
  	"year" numeric,
  	"duration" varchar,
  	"size" varchar,
  	"budget" varchar,
  	"short_description" varchar NOT NULL,
  	"long_description" jsonb,
  	"challenge" jsonb,
  	"solution" jsonb,
  	"result" jsonb,
  	"featured_image_id" integer NOT NULL,
  	"before_after_before_id" integer,
  	"before_after_after_id" integer,
  	"testimonial_quote" varchar,
  	"testimonial_client_name" varchar,
  	"testimonial_client_role" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"featured" boolean DEFAULT false,
  	"status" "enum_construction_projects_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "construction_projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "construction_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"client_role" varchar,
  	"client_initials" varchar,
  	"client_color" "enum_construction_reviews_client_color" DEFAULT 'teal',
  	"rating" numeric NOT NULL,
  	"quote" varchar NOT NULL,
  	"project_id" integer,
  	"service_id" integer,
  	"featured" boolean DEFAULT false,
  	"status" "enum_construction_reviews_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quote_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"address" varchar,
  	"postal_code" varchar,
  	"city" varchar,
  	"project_type" "enum_quote_requests_project_type" NOT NULL,
  	"budget" "enum_quote_requests_budget",
  	"timeline" "enum_quote_requests_timeline",
  	"description" varchar,
  	"status" "enum_quote_requests_status" DEFAULT 'new' NOT NULL,
  	"assigned_to_id" integer,
  	"notes" varchar,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"contacted_at" timestamp(3) with time zone,
  	"quoted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quote_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "construction_services_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "construction_projects_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "construction_reviews_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "construction_services_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "construction_projects_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "construction_reviews_id" integer;
  ALTER TABLE "products" ADD COLUMN "configurator_settings_show_config_summary" boolean DEFAULT true;
  ALTER TABLE "products" ADD COLUMN "configurator_settings_show_price_breakdown" boolean DEFAULT true;
  ALTER TABLE "products" ADD COLUMN "mix_match_config_discount_percentage" numeric DEFAULT 20;
  ALTER TABLE "products" ADD COLUMN "mix_match_config_show_progress_bar" boolean DEFAULT true;
  ALTER TABLE "products" ADD COLUMN "mix_match_config_show_category_filters" boolean DEFAULT true;
  ALTER TABLE "clients" ADD COLUMN "features_volume_pricing" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_compare_products" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_quick_order" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_recently_viewed" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_mini_cart" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_free_shipping_bar" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_guest_checkout" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_invoices" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_order_tracking" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_my_account" boolean DEFAULT true;
  ALTER TABLE "clients" ADD COLUMN "features_returns" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_recurring_orders" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_addresses" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_account_invoices" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_notifications" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_b2b" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_group_pricing" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_barcode_scanner" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_subscriptions" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_gift_vouchers" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_licenses" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_loyalty" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_search" boolean DEFAULT false;
  ALTER TABLE "clients" ADD COLUMN "features_newsletter" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscription_plans_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "user_subscriptions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_methods_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "gift_vouchers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "licenses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "license_activations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "loyalty_tiers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "loyalty_rewards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "loyalty_points_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "loyalty_transactions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "loyalty_redemptions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "construction_services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "construction_projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "construction_reviews_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "quote_requests_id" integer;
  ALTER TABLE "pages_blocks_construction_hero_avatars" ADD CONSTRAINT "pages_blocks_construction_hero_avatars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_construction_hero_floating_badges" ADD CONSTRAINT "pages_blocks_construction_hero_floating_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_construction_hero" ADD CONSTRAINT "pages_blocks_construction_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_construction_hero" ADD CONSTRAINT "pages_blocks_construction_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_projects_grid" ADD CONSTRAINT "pages_blocks_projects_grid_category_id_construction_services_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_projects_grid" ADD CONSTRAINT "pages_blocks_projects_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_grid" ADD CONSTRAINT "pages_blocks_reviews_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_bar_stats" ADD CONSTRAINT "pages_blocks_stats_bar_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_bar" ADD CONSTRAINT "pages_blocks_stats_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner_buttons" ADD CONSTRAINT "pages_blocks_cta_banner_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner_trust_elements_items" ADD CONSTRAINT "pages_blocks_cta_banner_trust_elements_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_construction_hero_avatars" ADD CONSTRAINT "_pages_v_blocks_construction_hero_avatars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_construction_hero_floating_badges" ADD CONSTRAINT "_pages_v_blocks_construction_hero_floating_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_construction_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_construction_hero" ADD CONSTRAINT "_pages_v_blocks_construction_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_construction_hero" ADD CONSTRAINT "_pages_v_blocks_construction_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD CONSTRAINT "_pages_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_projects_grid" ADD CONSTRAINT "_pages_v_blocks_projects_grid_category_id_construction_services_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_projects_grid" ADD CONSTRAINT "_pages_v_blocks_projects_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reviews_grid" ADD CONSTRAINT "_pages_v_blocks_reviews_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_bar_stats" ADD CONSTRAINT "_pages_v_blocks_stats_bar_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_bar" ADD CONSTRAINT "_pages_v_blocks_stats_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_banner_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner_trust_elements_items" ADD CONSTRAINT "_pages_v_blocks_cta_banner_trust_elements_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variant_options_values" ADD CONSTRAINT "products_variant_options_values_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variant_options_values" ADD CONSTRAINT "products_variant_options_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variant_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variant_options" ADD CONSTRAINT "products_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_mix_match_config_box_sizes" ADD CONSTRAINT "products_mix_match_config_box_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscription_plans_features" ADD CONSTRAINT "subscription_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "user_subscriptions_addons" ADD CONSTRAINT "user_subscriptions_addons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_purchased_by_id_users_id_fk" FOREIGN KEY ("purchased_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_redeemed_by_id_users_id_fk" FOREIGN KEY ("redeemed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "licenses_downloads" ADD CONSTRAINT "licenses_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "licenses" ADD CONSTRAINT "licenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "licenses" ADD CONSTRAINT "licenses_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "licenses" ADD CONSTRAINT "licenses_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "license_activations" ADD CONSTRAINT "license_activations_license_id_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_tiers_benefits" ADD CONSTRAINT "loyalty_tiers_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "loyalty_rewards" ADD CONSTRAINT "loyalty_rewards_tier_required_id_loyalty_tiers_id_fk" FOREIGN KEY ("tier_required_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_tier_id_loyalty_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_related_order_id_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_related_reward_id_loyalty_rewards_id_fk" FOREIGN KEY ("related_reward_id") REFERENCES "public"."loyalty_rewards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_reward_id_loyalty_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."loyalty_rewards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_used_in_order_id_orders_id_fk" FOREIGN KEY ("used_in_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "construction_services_features" ADD CONSTRAINT "construction_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_services_process_steps" ADD CONSTRAINT "construction_services_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_services_service_types" ADD CONSTRAINT "construction_services_service_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_services_usps" ADD CONSTRAINT "construction_services_usps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_services_faq" ADD CONSTRAINT "construction_services_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_services" ADD CONSTRAINT "construction_services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "construction_services_rels" ADD CONSTRAINT "construction_services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_services_rels" ADD CONSTRAINT "construction_services_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_projects_badges" ADD CONSTRAINT "construction_projects_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_category_id_construction_services_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_before_after_before_id_media_id_fk" FOREIGN KEY ("before_after_before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_before_after_after_id_media_id_fk" FOREIGN KEY ("before_after_after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "construction_projects_rels" ADD CONSTRAINT "construction_projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_projects_rels" ADD CONSTRAINT "construction_projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "construction_reviews" ADD CONSTRAINT "construction_reviews_project_id_construction_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."construction_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "construction_reviews" ADD CONSTRAINT "construction_reviews_service_id_construction_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."construction_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quote_requests_rels" ADD CONSTRAINT "quote_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quote_requests_rels" ADD CONSTRAINT "quote_requests_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_construction_hero_avatars_order_idx" ON "pages_blocks_construction_hero_avatars" USING btree ("_order");
  CREATE INDEX "pages_blocks_construction_hero_avatars_parent_id_idx" ON "pages_blocks_construction_hero_avatars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_construction_hero_floating_badges_order_idx" ON "pages_blocks_construction_hero_floating_badges" USING btree ("_order");
  CREATE INDEX "pages_blocks_construction_hero_floating_badges_parent_id_idx" ON "pages_blocks_construction_hero_floating_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_construction_hero_order_idx" ON "pages_blocks_construction_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_construction_hero_parent_id_idx" ON "pages_blocks_construction_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_construction_hero_path_idx" ON "pages_blocks_construction_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_construction_hero_hero_image_idx" ON "pages_blocks_construction_hero" USING btree ("hero_image_id");
  CREATE INDEX "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_projects_grid_order_idx" ON "pages_blocks_projects_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_projects_grid_parent_id_idx" ON "pages_blocks_projects_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_projects_grid_path_idx" ON "pages_blocks_projects_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_projects_grid_category_idx" ON "pages_blocks_projects_grid" USING btree ("category_id");
  CREATE INDEX "pages_blocks_reviews_grid_order_idx" ON "pages_blocks_reviews_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_grid_parent_id_idx" ON "pages_blocks_reviews_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_grid_path_idx" ON "pages_blocks_reviews_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_bar_stats_order_idx" ON "pages_blocks_stats_bar_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_bar_stats_parent_id_idx" ON "pages_blocks_stats_bar_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_bar_order_idx" ON "pages_blocks_stats_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_bar_parent_id_idx" ON "pages_blocks_stats_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_bar_path_idx" ON "pages_blocks_stats_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_banner_buttons_order_idx" ON "pages_blocks_cta_banner_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_buttons_parent_id_idx" ON "pages_blocks_cta_banner_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_trust_elements_items_order_idx" ON "pages_blocks_cta_banner_trust_elements_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_trust_elements_items_parent_id_idx" ON "pages_blocks_cta_banner_trust_elements_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_banner_background_image_idx" ON "pages_blocks_cta_banner" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_construction_hero_avatars_order_idx" ON "_pages_v_blocks_construction_hero_avatars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_construction_hero_avatars_parent_id_idx" ON "_pages_v_blocks_construction_hero_avatars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_construction_hero_floating_badges_order_idx" ON "_pages_v_blocks_construction_hero_floating_badges" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_construction_hero_floating_badges_parent_id_idx" ON "_pages_v_blocks_construction_hero_floating_badges" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_construction_hero_order_idx" ON "_pages_v_blocks_construction_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_construction_hero_parent_id_idx" ON "_pages_v_blocks_construction_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_construction_hero_path_idx" ON "_pages_v_blocks_construction_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_construction_hero_hero_image_idx" ON "_pages_v_blocks_construction_hero" USING btree ("hero_image_id");
  CREATE INDEX "_pages_v_blocks_services_grid_order_idx" ON "_pages_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_parent_id_idx" ON "_pages_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_path_idx" ON "_pages_v_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_projects_grid_order_idx" ON "_pages_v_blocks_projects_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_projects_grid_parent_id_idx" ON "_pages_v_blocks_projects_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_projects_grid_path_idx" ON "_pages_v_blocks_projects_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_projects_grid_category_idx" ON "_pages_v_blocks_projects_grid" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_reviews_grid_order_idx" ON "_pages_v_blocks_reviews_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_reviews_grid_parent_id_idx" ON "_pages_v_blocks_reviews_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_reviews_grid_path_idx" ON "_pages_v_blocks_reviews_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_bar_stats_order_idx" ON "_pages_v_blocks_stats_bar_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_bar_stats_parent_id_idx" ON "_pages_v_blocks_stats_bar_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_bar_order_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_bar_parent_id_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_bar_path_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_banner_buttons_order_idx" ON "_pages_v_blocks_cta_banner_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_buttons_parent_id_idx" ON "_pages_v_blocks_cta_banner_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_trust_elements_items_order_idx" ON "_pages_v_blocks_cta_banner_trust_elements_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_trust_elements_items_parent_id_idx" ON "_pages_v_blocks_cta_banner_trust_elements_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_banner_background_image_idx" ON "_pages_v_blocks_cta_banner" USING btree ("background_image_id");
  CREATE INDEX "products_variant_options_values_order_idx" ON "products_variant_options_values" USING btree ("_order");
  CREATE INDEX "products_variant_options_values_parent_id_idx" ON "products_variant_options_values" USING btree ("_parent_id");
  CREATE INDEX "products_variant_options_values_image_idx" ON "products_variant_options_values" USING btree ("image_id");
  CREATE INDEX "products_variant_options_order_idx" ON "products_variant_options" USING btree ("_order");
  CREATE INDEX "products_variant_options_parent_id_idx" ON "products_variant_options" USING btree ("_parent_id");
  CREATE INDEX "products_mix_match_config_box_sizes_order_idx" ON "products_mix_match_config_box_sizes" USING btree ("_order");
  CREATE INDEX "products_mix_match_config_box_sizes_parent_id_idx" ON "products_mix_match_config_box_sizes" USING btree ("_parent_id");
  CREATE INDEX "subscription_plans_features_order_idx" ON "subscription_plans_features" USING btree ("_order");
  CREATE INDEX "subscription_plans_features_parent_id_idx" ON "subscription_plans_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "subscription_plans_slug_idx" ON "subscription_plans" USING btree ("slug");
  CREATE INDEX "subscription_plans_updated_at_idx" ON "subscription_plans" USING btree ("updated_at");
  CREATE INDEX "subscription_plans_created_at_idx" ON "subscription_plans" USING btree ("created_at");
  CREATE INDEX "user_subscriptions_addons_order_idx" ON "user_subscriptions_addons" USING btree ("_order");
  CREATE INDEX "user_subscriptions_addons_parent_id_idx" ON "user_subscriptions_addons" USING btree ("_parent_id");
  CREATE INDEX "user_subscriptions_user_idx" ON "user_subscriptions" USING btree ("user_id");
  CREATE INDEX "user_subscriptions_plan_idx" ON "user_subscriptions" USING btree ("plan_id");
  CREATE INDEX "user_subscriptions_updated_at_idx" ON "user_subscriptions" USING btree ("updated_at");
  CREATE INDEX "user_subscriptions_created_at_idx" ON "user_subscriptions" USING btree ("created_at");
  CREATE INDEX "payment_methods_user_idx" ON "payment_methods" USING btree ("user_id");
  CREATE INDEX "payment_methods_updated_at_idx" ON "payment_methods" USING btree ("updated_at");
  CREATE INDEX "payment_methods_created_at_idx" ON "payment_methods" USING btree ("created_at");
  CREATE UNIQUE INDEX "gift_vouchers_code_idx" ON "gift_vouchers" USING btree ("code");
  CREATE INDEX "gift_vouchers_purchased_by_idx" ON "gift_vouchers" USING btree ("purchased_by_id");
  CREATE INDEX "gift_vouchers_redeemed_by_idx" ON "gift_vouchers" USING btree ("redeemed_by_id");
  CREATE INDEX "gift_vouchers_updated_at_idx" ON "gift_vouchers" USING btree ("updated_at");
  CREATE INDEX "gift_vouchers_created_at_idx" ON "gift_vouchers" USING btree ("created_at");
  CREATE INDEX "licenses_downloads_order_idx" ON "licenses_downloads" USING btree ("_order");
  CREATE INDEX "licenses_downloads_parent_id_idx" ON "licenses_downloads" USING btree ("_parent_id");
  CREATE INDEX "licenses_user_idx" ON "licenses" USING btree ("user_id");
  CREATE INDEX "licenses_product_idx" ON "licenses" USING btree ("product_id");
  CREATE UNIQUE INDEX "licenses_license_key_idx" ON "licenses" USING btree ("license_key");
  CREATE INDEX "licenses_order_idx" ON "licenses" USING btree ("order_id");
  CREATE INDEX "licenses_updated_at_idx" ON "licenses" USING btree ("updated_at");
  CREATE INDEX "licenses_created_at_idx" ON "licenses" USING btree ("created_at");
  CREATE INDEX "license_activations_license_idx" ON "license_activations" USING btree ("license_id");
  CREATE INDEX "license_activations_updated_at_idx" ON "license_activations" USING btree ("updated_at");
  CREATE INDEX "license_activations_created_at_idx" ON "license_activations" USING btree ("created_at");
  CREATE INDEX "loyalty_tiers_benefits_order_idx" ON "loyalty_tiers_benefits" USING btree ("_order");
  CREATE INDEX "loyalty_tiers_benefits_parent_id_idx" ON "loyalty_tiers_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "loyalty_tiers_slug_idx" ON "loyalty_tiers" USING btree ("slug");
  CREATE INDEX "loyalty_tiers_updated_at_idx" ON "loyalty_tiers" USING btree ("updated_at");
  CREATE INDEX "loyalty_tiers_created_at_idx" ON "loyalty_tiers" USING btree ("created_at");
  CREATE INDEX "loyalty_rewards_tier_required_idx" ON "loyalty_rewards" USING btree ("tier_required_id");
  CREATE INDEX "loyalty_rewards_updated_at_idx" ON "loyalty_rewards" USING btree ("updated_at");
  CREATE INDEX "loyalty_rewards_created_at_idx" ON "loyalty_rewards" USING btree ("created_at");
  CREATE UNIQUE INDEX "loyalty_points_user_idx" ON "loyalty_points" USING btree ("user_id");
  CREATE INDEX "loyalty_points_tier_idx" ON "loyalty_points" USING btree ("tier_id");
  CREATE UNIQUE INDEX "loyalty_points_referral_code_idx" ON "loyalty_points" USING btree ("referral_code");
  CREATE INDEX "loyalty_points_updated_at_idx" ON "loyalty_points" USING btree ("updated_at");
  CREATE INDEX "loyalty_points_created_at_idx" ON "loyalty_points" USING btree ("created_at");
  CREATE INDEX "loyalty_transactions_user_idx" ON "loyalty_transactions" USING btree ("user_id");
  CREATE INDEX "loyalty_transactions_related_order_idx" ON "loyalty_transactions" USING btree ("related_order_id");
  CREATE INDEX "loyalty_transactions_related_reward_idx" ON "loyalty_transactions" USING btree ("related_reward_id");
  CREATE INDEX "loyalty_transactions_updated_at_idx" ON "loyalty_transactions" USING btree ("updated_at");
  CREATE INDEX "loyalty_transactions_created_at_idx" ON "loyalty_transactions" USING btree ("created_at");
  CREATE INDEX "loyalty_redemptions_user_idx" ON "loyalty_redemptions" USING btree ("user_id");
  CREATE INDEX "loyalty_redemptions_reward_idx" ON "loyalty_redemptions" USING btree ("reward_id");
  CREATE UNIQUE INDEX "loyalty_redemptions_code_idx" ON "loyalty_redemptions" USING btree ("code");
  CREATE INDEX "loyalty_redemptions_used_in_order_idx" ON "loyalty_redemptions" USING btree ("used_in_order_id");
  CREATE INDEX "loyalty_redemptions_updated_at_idx" ON "loyalty_redemptions" USING btree ("updated_at");
  CREATE INDEX "loyalty_redemptions_created_at_idx" ON "loyalty_redemptions" USING btree ("created_at");
  CREATE INDEX "construction_services_features_order_idx" ON "construction_services_features" USING btree ("_order");
  CREATE INDEX "construction_services_features_parent_id_idx" ON "construction_services_features" USING btree ("_parent_id");
  CREATE INDEX "construction_services_process_steps_order_idx" ON "construction_services_process_steps" USING btree ("_order");
  CREATE INDEX "construction_services_process_steps_parent_id_idx" ON "construction_services_process_steps" USING btree ("_parent_id");
  CREATE INDEX "construction_services_service_types_order_idx" ON "construction_services_service_types" USING btree ("_order");
  CREATE INDEX "construction_services_service_types_parent_id_idx" ON "construction_services_service_types" USING btree ("_parent_id");
  CREATE INDEX "construction_services_usps_order_idx" ON "construction_services_usps" USING btree ("_order");
  CREATE INDEX "construction_services_usps_parent_id_idx" ON "construction_services_usps" USING btree ("_parent_id");
  CREATE INDEX "construction_services_faq_order_idx" ON "construction_services_faq" USING btree ("_order");
  CREATE INDEX "construction_services_faq_parent_id_idx" ON "construction_services_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "construction_services_slug_idx" ON "construction_services" USING btree ("slug");
  CREATE INDEX "construction_services_hero_image_idx" ON "construction_services" USING btree ("hero_image_id");
  CREATE INDEX "construction_services_updated_at_idx" ON "construction_services" USING btree ("updated_at");
  CREATE INDEX "construction_services_created_at_idx" ON "construction_services" USING btree ("created_at");
  CREATE INDEX "construction_services_rels_order_idx" ON "construction_services_rels" USING btree ("order");
  CREATE INDEX "construction_services_rels_parent_idx" ON "construction_services_rels" USING btree ("parent_id");
  CREATE INDEX "construction_services_rels_path_idx" ON "construction_services_rels" USING btree ("path");
  CREATE INDEX "construction_services_rels_media_id_idx" ON "construction_services_rels" USING btree ("media_id");
  CREATE INDEX "construction_projects_badges_order_idx" ON "construction_projects_badges" USING btree ("_order");
  CREATE INDEX "construction_projects_badges_parent_id_idx" ON "construction_projects_badges" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "construction_projects_slug_idx" ON "construction_projects" USING btree ("slug");
  CREATE INDEX "construction_projects_category_idx" ON "construction_projects" USING btree ("category_id");
  CREATE INDEX "construction_projects_featured_image_idx" ON "construction_projects" USING btree ("featured_image_id");
  CREATE INDEX "construction_projects_before_after_before_after_before_idx" ON "construction_projects" USING btree ("before_after_before_id");
  CREATE INDEX "construction_projects_before_after_before_after_after_idx" ON "construction_projects" USING btree ("before_after_after_id");
  CREATE INDEX "construction_projects_updated_at_idx" ON "construction_projects" USING btree ("updated_at");
  CREATE INDEX "construction_projects_created_at_idx" ON "construction_projects" USING btree ("created_at");
  CREATE INDEX "construction_projects_rels_order_idx" ON "construction_projects_rels" USING btree ("order");
  CREATE INDEX "construction_projects_rels_parent_idx" ON "construction_projects_rels" USING btree ("parent_id");
  CREATE INDEX "construction_projects_rels_path_idx" ON "construction_projects_rels" USING btree ("path");
  CREATE INDEX "construction_projects_rels_media_id_idx" ON "construction_projects_rels" USING btree ("media_id");
  CREATE INDEX "construction_reviews_project_idx" ON "construction_reviews" USING btree ("project_id");
  CREATE INDEX "construction_reviews_service_idx" ON "construction_reviews" USING btree ("service_id");
  CREATE INDEX "construction_reviews_updated_at_idx" ON "construction_reviews" USING btree ("updated_at");
  CREATE INDEX "construction_reviews_created_at_idx" ON "construction_reviews" USING btree ("created_at");
  CREATE INDEX "quote_requests_assigned_to_idx" ON "quote_requests" USING btree ("assigned_to_id");
  CREATE INDEX "quote_requests_updated_at_idx" ON "quote_requests" USING btree ("updated_at");
  CREATE INDEX "quote_requests_created_at_idx" ON "quote_requests" USING btree ("created_at");
  CREATE INDEX "quote_requests_rels_order_idx" ON "quote_requests_rels" USING btree ("order");
  CREATE INDEX "quote_requests_rels_parent_idx" ON "quote_requests_rels" USING btree ("parent_id");
  CREATE INDEX "quote_requests_rels_path_idx" ON "quote_requests_rels" USING btree ("path");
  CREATE INDEX "quote_requests_rels_media_id_idx" ON "quote_requests_rels" USING btree ("media_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscription_plans_fk" FOREIGN KEY ("subscription_plans_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_subscriptions_fk" FOREIGN KEY ("user_subscriptions_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_methods_fk" FOREIGN KEY ("payment_methods_id") REFERENCES "public"."payment_methods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gift_vouchers_fk" FOREIGN KEY ("gift_vouchers_id") REFERENCES "public"."gift_vouchers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_licenses_fk" FOREIGN KEY ("licenses_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_license_activations_fk" FOREIGN KEY ("license_activations_id") REFERENCES "public"."license_activations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_tiers_fk" FOREIGN KEY ("loyalty_tiers_id") REFERENCES "public"."loyalty_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_rewards_fk" FOREIGN KEY ("loyalty_rewards_id") REFERENCES "public"."loyalty_rewards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_points_fk" FOREIGN KEY ("loyalty_points_id") REFERENCES "public"."loyalty_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_transactions_fk" FOREIGN KEY ("loyalty_transactions_id") REFERENCES "public"."loyalty_transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_redemptions_fk" FOREIGN KEY ("loyalty_redemptions_id") REFERENCES "public"."loyalty_redemptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quote_requests_fk" FOREIGN KEY ("quote_requests_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_construction_services_id_idx" ON "pages_rels" USING btree ("construction_services_id");
  CREATE INDEX "pages_rels_construction_projects_id_idx" ON "pages_rels" USING btree ("construction_projects_id");
  CREATE INDEX "pages_rels_construction_reviews_id_idx" ON "pages_rels" USING btree ("construction_reviews_id");
  CREATE INDEX "_pages_v_rels_construction_services_id_idx" ON "_pages_v_rels" USING btree ("construction_services_id");
  CREATE INDEX "_pages_v_rels_construction_projects_id_idx" ON "_pages_v_rels" USING btree ("construction_projects_id");
  CREATE INDEX "_pages_v_rels_construction_reviews_id_idx" ON "_pages_v_rels" USING btree ("construction_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_subscription_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("subscription_plans_id");
  CREATE INDEX "payload_locked_documents_rels_user_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("user_subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_payment_methods_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_methods_id");
  CREATE INDEX "payload_locked_documents_rels_gift_vouchers_id_idx" ON "payload_locked_documents_rels" USING btree ("gift_vouchers_id");
  CREATE INDEX "payload_locked_documents_rels_licenses_id_idx" ON "payload_locked_documents_rels" USING btree ("licenses_id");
  CREATE INDEX "payload_locked_documents_rels_license_activations_id_idx" ON "payload_locked_documents_rels" USING btree ("license_activations_id");
  CREATE INDEX "payload_locked_documents_rels_loyalty_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_tiers_id");
  CREATE INDEX "payload_locked_documents_rels_loyalty_rewards_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_rewards_id");
  CREATE INDEX "payload_locked_documents_rels_loyalty_points_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_points_id");
  CREATE INDEX "payload_locked_documents_rels_loyalty_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_transactions_id");
  CREATE INDEX "payload_locked_documents_rels_loyalty_redemptions_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_redemptions_id");
  CREATE INDEX "payload_locked_documents_rels_construction_services_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_services_id");
  CREATE INDEX "payload_locked_documents_rels_construction_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_projects_id");
  CREATE INDEX "payload_locked_documents_rels_construction_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_quote_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("quote_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_construction_hero_avatars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_construction_hero_floating_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_construction_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_projects_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_reviews_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_bar_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner_trust_elements_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_construction_hero_avatars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_construction_hero_floating_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_construction_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_services_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_projects_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_reviews_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_bar_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner_trust_elements_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_variant_options_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_variant_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_mix_match_config_box_sizes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subscription_plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subscription_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "user_subscriptions_addons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "user_subscriptions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_methods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gift_vouchers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "licenses_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "licenses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "license_activations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_tiers_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_rewards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_transactions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_redemptions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_services_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_services_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_services_service_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_services_usps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_services_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_services_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_projects_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "construction_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quote_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quote_requests_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_construction_hero_avatars" CASCADE;
  DROP TABLE "pages_blocks_construction_hero_floating_badges" CASCADE;
  DROP TABLE "pages_blocks_construction_hero" CASCADE;
  DROP TABLE "pages_blocks_services_grid" CASCADE;
  DROP TABLE "pages_blocks_projects_grid" CASCADE;
  DROP TABLE "pages_blocks_reviews_grid" CASCADE;
  DROP TABLE "pages_blocks_stats_bar_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_bar" CASCADE;
  DROP TABLE "pages_blocks_cta_banner_buttons" CASCADE;
  DROP TABLE "pages_blocks_cta_banner_trust_elements_items" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_construction_hero_avatars" CASCADE;
  DROP TABLE "_pages_v_blocks_construction_hero_floating_badges" CASCADE;
  DROP TABLE "_pages_v_blocks_construction_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_projects_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_reviews_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_bar_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner_trust_elements_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE "products_variant_options_values" CASCADE;
  DROP TABLE "products_variant_options" CASCADE;
  DROP TABLE "products_mix_match_config_box_sizes" CASCADE;
  DROP TABLE "subscription_plans_features" CASCADE;
  DROP TABLE "subscription_plans" CASCADE;
  DROP TABLE "user_subscriptions_addons" CASCADE;
  DROP TABLE "user_subscriptions" CASCADE;
  DROP TABLE "payment_methods" CASCADE;
  DROP TABLE "gift_vouchers" CASCADE;
  DROP TABLE "licenses_downloads" CASCADE;
  DROP TABLE "licenses" CASCADE;
  DROP TABLE "license_activations" CASCADE;
  DROP TABLE "loyalty_tiers_benefits" CASCADE;
  DROP TABLE "loyalty_tiers" CASCADE;
  DROP TABLE "loyalty_rewards" CASCADE;
  DROP TABLE "loyalty_points" CASCADE;
  DROP TABLE "loyalty_transactions" CASCADE;
  DROP TABLE "loyalty_redemptions" CASCADE;
  DROP TABLE "construction_services_features" CASCADE;
  DROP TABLE "construction_services_process_steps" CASCADE;
  DROP TABLE "construction_services_service_types" CASCADE;
  DROP TABLE "construction_services_usps" CASCADE;
  DROP TABLE "construction_services_faq" CASCADE;
  DROP TABLE "construction_services" CASCADE;
  DROP TABLE "construction_services_rels" CASCADE;
  DROP TABLE "construction_projects_badges" CASCADE;
  DROP TABLE "construction_projects" CASCADE;
  DROP TABLE "construction_projects_rels" CASCADE;
  DROP TABLE "construction_reviews" CASCADE;
  DROP TABLE "quote_requests" CASCADE;
  DROP TABLE "quote_requests_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_construction_services_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_construction_projects_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_construction_reviews_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_construction_services_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_construction_projects_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_construction_reviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscription_plans_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_user_subscriptions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_methods_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_gift_vouchers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_licenses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_license_activations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_loyalty_tiers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_loyalty_rewards_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_loyalty_points_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_loyalty_transactions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_loyalty_redemptions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_construction_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_construction_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_construction_reviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_quote_requests_fk";
  
  ALTER TABLE "products" ALTER COLUMN "product_type" SET DATA TYPE text;
  ALTER TABLE "products" ALTER COLUMN "product_type" SET DEFAULT 'simple'::text;
  DROP TYPE "public"."enum_products_product_type";
  CREATE TYPE "public"."enum_products_product_type" AS ENUM('simple', 'grouped');
  ALTER TABLE "products" ALTER COLUMN "product_type" SET DEFAULT 'simple'::"public"."enum_products_product_type";
  ALTER TABLE "products" ALTER COLUMN "product_type" SET DATA TYPE "public"."enum_products_product_type" USING "product_type"::"public"."enum_products_product_type";
  DROP INDEX "pages_rels_construction_services_id_idx";
  DROP INDEX "pages_rels_construction_projects_id_idx";
  DROP INDEX "pages_rels_construction_reviews_id_idx";
  DROP INDEX "_pages_v_rels_construction_services_id_idx";
  DROP INDEX "_pages_v_rels_construction_projects_id_idx";
  DROP INDEX "_pages_v_rels_construction_reviews_id_idx";
  DROP INDEX "payload_locked_documents_rels_subscription_plans_id_idx";
  DROP INDEX "payload_locked_documents_rels_user_subscriptions_id_idx";
  DROP INDEX "payload_locked_documents_rels_payment_methods_id_idx";
  DROP INDEX "payload_locked_documents_rels_gift_vouchers_id_idx";
  DROP INDEX "payload_locked_documents_rels_licenses_id_idx";
  DROP INDEX "payload_locked_documents_rels_license_activations_id_idx";
  DROP INDEX "payload_locked_documents_rels_loyalty_tiers_id_idx";
  DROP INDEX "payload_locked_documents_rels_loyalty_rewards_id_idx";
  DROP INDEX "payload_locked_documents_rels_loyalty_points_id_idx";
  DROP INDEX "payload_locked_documents_rels_loyalty_transactions_id_idx";
  DROP INDEX "payload_locked_documents_rels_loyalty_redemptions_id_idx";
  DROP INDEX "payload_locked_documents_rels_construction_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_construction_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_construction_reviews_id_idx";
  DROP INDEX "payload_locked_documents_rels_quote_requests_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "construction_services_id";
  ALTER TABLE "pages_rels" DROP COLUMN "construction_projects_id";
  ALTER TABLE "pages_rels" DROP COLUMN "construction_reviews_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "construction_services_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "construction_projects_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "construction_reviews_id";
  ALTER TABLE "products" DROP COLUMN "configurator_settings_show_config_summary";
  ALTER TABLE "products" DROP COLUMN "configurator_settings_show_price_breakdown";
  ALTER TABLE "products" DROP COLUMN "mix_match_config_discount_percentage";
  ALTER TABLE "products" DROP COLUMN "mix_match_config_show_progress_bar";
  ALTER TABLE "products" DROP COLUMN "mix_match_config_show_category_filters";
  ALTER TABLE "clients" DROP COLUMN "features_volume_pricing";
  ALTER TABLE "clients" DROP COLUMN "features_compare_products";
  ALTER TABLE "clients" DROP COLUMN "features_quick_order";
  ALTER TABLE "clients" DROP COLUMN "features_recently_viewed";
  ALTER TABLE "clients" DROP COLUMN "features_mini_cart";
  ALTER TABLE "clients" DROP COLUMN "features_free_shipping_bar";
  ALTER TABLE "clients" DROP COLUMN "features_guest_checkout";
  ALTER TABLE "clients" DROP COLUMN "features_invoices";
  ALTER TABLE "clients" DROP COLUMN "features_order_tracking";
  ALTER TABLE "clients" DROP COLUMN "features_my_account";
  ALTER TABLE "clients" DROP COLUMN "features_returns";
  ALTER TABLE "clients" DROP COLUMN "features_recurring_orders";
  ALTER TABLE "clients" DROP COLUMN "features_addresses";
  ALTER TABLE "clients" DROP COLUMN "features_account_invoices";
  ALTER TABLE "clients" DROP COLUMN "features_notifications";
  ALTER TABLE "clients" DROP COLUMN "features_b2b";
  ALTER TABLE "clients" DROP COLUMN "features_group_pricing";
  ALTER TABLE "clients" DROP COLUMN "features_barcode_scanner";
  ALTER TABLE "clients" DROP COLUMN "features_subscriptions";
  ALTER TABLE "clients" DROP COLUMN "features_gift_vouchers";
  ALTER TABLE "clients" DROP COLUMN "features_licenses";
  ALTER TABLE "clients" DROP COLUMN "features_loyalty";
  ALTER TABLE "clients" DROP COLUMN "features_search";
  ALTER TABLE "clients" DROP COLUMN "features_newsletter";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscription_plans_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "user_subscriptions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payment_methods_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "gift_vouchers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "licenses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "license_activations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "loyalty_tiers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "loyalty_rewards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "loyalty_points_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "loyalty_transactions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "loyalty_redemptions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "construction_services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "construction_projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "construction_reviews_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "quote_requests_id";
  DROP TYPE "public"."enum_pages_blocks_construction_hero_avatars_color";
  DROP TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_color";
  DROP TYPE "public"."enum_pages_blocks_construction_hero_floating_badges_position";
  DROP TYPE "public"."enum_pages_blocks_services_grid_services_source";
  DROP TYPE "public"."enum_pages_blocks_services_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_projects_grid_projects_source";
  DROP TYPE "public"."enum_pages_blocks_projects_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_reviews_grid_reviews_source";
  DROP TYPE "public"."enum_pages_blocks_reviews_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_reviews_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_reviews_grid_average_rating_position";
  DROP TYPE "public"."enum_pages_blocks_stats_bar_stats_icon";
  DROP TYPE "public"."enum_pages_blocks_stats_bar_style";
  DROP TYPE "public"."enum_pages_blocks_stats_bar_layout";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_trust_elements_items_icon";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_style";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_alignment";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_size";
  DROP TYPE "public"."enum__pages_v_blocks_construction_hero_avatars_color";
  DROP TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_color";
  DROP TYPE "public"."enum__pages_v_blocks_construction_hero_floating_badges_position";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_services_source";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_projects_grid_projects_source";
  DROP TYPE "public"."enum__pages_v_blocks_projects_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_reviews_source";
  DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_reviews_grid_average_rating_position";
  DROP TYPE "public"."enum__pages_v_blocks_stats_bar_stats_icon";
  DROP TYPE "public"."enum__pages_v_blocks_stats_bar_style";
  DROP TYPE "public"."enum__pages_v_blocks_stats_bar_layout";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_trust_elements_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_size";
  DROP TYPE "public"."enum_products_variant_options_display_type";
  DROP TYPE "public"."enum_subscription_plans_billing_interval";
  DROP TYPE "public"."enum_user_subscriptions_status";
  DROP TYPE "public"."enum_payment_methods_type";
  DROP TYPE "public"."enum_payment_methods_card_brand";
  DROP TYPE "public"."enum_gift_vouchers_status";
  DROP TYPE "public"."enum_gift_vouchers_occasion";
  DROP TYPE "public"."enum_gift_vouchers_delivery_method";
  DROP TYPE "public"."enum_licenses_type";
  DROP TYPE "public"."enum_licenses_status";
  DROP TYPE "public"."enum_license_activations_status";
  DROP TYPE "public"."enum_loyalty_rewards_type";
  DROP TYPE "public"."enum_loyalty_transactions_type";
  DROP TYPE "public"."enum_loyalty_redemptions_status";
  DROP TYPE "public"."enum_construction_services_color";
  DROP TYPE "public"."enum_construction_services_status";
  DROP TYPE "public"."enum_construction_projects_status";
  DROP TYPE "public"."enum_construction_reviews_client_color";
  DROP TYPE "public"."enum_construction_reviews_status";
  DROP TYPE "public"."enum_quote_requests_project_type";
  DROP TYPE "public"."enum_quote_requests_budget";
  DROP TYPE "public"."enum_quote_requests_timeline";
  DROP TYPE "public"."enum_quote_requests_status";`)
}

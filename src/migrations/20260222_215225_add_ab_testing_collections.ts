import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."chatbot_kb_search_collections" AS ENUM('blog-posts', 'pages', 'faqs', 'products', 'cases');
  CREATE TYPE "public"."enum_products_variant_options_values_subscription_type" AS ENUM('personal', 'gift', 'trial');
  CREATE TYPE "public"."enum_subscription_plans_tier" AS ENUM('free', 'pro', 'enterprise');
  CREATE TYPE "public"."enum_ab_tests_target_page" AS ENUM('cart', 'checkout', 'login', 'registration', 'product', 'homepage');
  CREATE TYPE "public"."enum_ab_tests_status" AS ENUM('draft', 'running', 'paused', 'completed');
  CREATE TYPE "public"."enum_blog_posts_content_type" AS ENUM('article', 'guide', 'elearning', 'download', 'video');
  CREATE TYPE "public"."enum_blog_posts_content_access_access_level" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum__blog_posts_v_version_content_type" AS ENUM('article', 'guide', 'elearning', 'download', 'video');
  CREATE TYPE "public"."enum__blog_posts_v_version_content_access_access_level" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum_treatments_category" AS ENUM('fysiotherapie', 'manuele-therapie', 'sportfysiotherapie', 'kinderfysiotherapie', 'psychosomatisch', 'revalidatie', 'dry-needling', 'shockwave');
  CREATE TYPE "public"."enum_treatments_insurance" AS ENUM('covered', 'partial', 'not-covered');
  CREATE TYPE "public"."enum_treatments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__treatments_v_version_category" AS ENUM('fysiotherapie', 'manuele-therapie', 'sportfysiotherapie', 'kinderfysiotherapie', 'psychosomatisch', 'revalidatie', 'dry-needling', 'shockwave');
  CREATE TYPE "public"."enum__treatments_v_version_insurance" AS ENUM('covered', 'partial', 'not-covered');
  CREATE TYPE "public"."enum__treatments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_practitioners_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_practitioners_role" AS ENUM('owner', 'physio', 'manual', 'specialist');
  CREATE TYPE "public"."enum_practitioners_availability" AS ENUM('available', 'limited', 'unavailable');
  CREATE TYPE "public"."enum_practitioners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__practitioners_v_version_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__practitioners_v_version_role" AS ENUM('owner', 'physio', 'manual', 'specialist');
  CREATE TYPE "public"."enum__practitioners_v_version_availability" AS ENUM('available', 'limited', 'unavailable');
  CREATE TYPE "public"."enum__practitioners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_appointments_preferred_time" AS ENUM('morning', 'afternoon', 'evening', 'saturday');
  CREATE TYPE "public"."enum_appointments_insurance" AS ENUM('zilveren-kruis', 'cz', 'vgz', 'menzis', 'onvz', 'dsw', 'asr', 'other');
  CREATE TYPE "public"."enum_appointments_treatment" AS ENUM('unknown', 'manuele-therapie', 'sportfysiotherapie', 'kinderfysiotherapie', 'psychosomatisch', 'dry-needling', 'revalidatie');
  CREATE TYPE "public"."enum_appointments_has_referral" AS ENUM('no', 'gp', 'specialist');
  CREATE TYPE "public"."enum_appointments_type" AS ENUM('new', 'follow-up', 'question');
  CREATE TYPE "public"."enum_appointments_status" AS ENUM('new', 'confirmed', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_beauty_services_tags" AS ENUM('popular', 'new', 'promo', 'specialist', 'bestseller');
  CREATE TYPE "public"."enum_beauty_services_category" AS ENUM('hair', 'beauty', 'wellness', 'nails', 'bridal', 'color');
  CREATE TYPE "public"."enum_beauty_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__beauty_services_v_version_tags" AS ENUM('popular', 'new', 'promo', 'specialist', 'bestseller');
  CREATE TYPE "public"."enum__beauty_services_v_version_category" AS ENUM('hair', 'beauty', 'wellness', 'nails', 'bridal', 'color');
  CREATE TYPE "public"."enum__beauty_services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_stylists_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_stylists_role" AS ENUM('stylist', 'color-specialist', 'beauty-specialist', 'nail-artist', 'massage-therapist', 'bridal-specialist', 'owner');
  CREATE TYPE "public"."enum_stylists_availability" AS ENUM('available', 'limited', 'booked', 'unavailable');
  CREATE TYPE "public"."enum_stylists_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stylists_v_version_work_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__stylists_v_version_role" AS ENUM('stylist', 'color-specialist', 'beauty-specialist', 'nail-artist', 'massage-therapist', 'bridal-specialist', 'owner');
  CREATE TYPE "public"."enum__stylists_v_version_availability" AS ENUM('available', 'limited', 'booked', 'unavailable');
  CREATE TYPE "public"."enum__stylists_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_beauty_bookings_preferred_time_slots" AS ENUM('morning', 'afternoon', 'evening');
  CREATE TYPE "public"."enum_beauty_bookings_status" AS ENUM('new', 'confirmed', 'completed', 'cancelled', 'no-show');
  CREATE TYPE "public"."enum_menu_items_allergens_allergen" AS ENUM('gluten', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soy', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'lupin', 'molluscs');
  CREATE TYPE "public"."enum_menu_items_category" AS ENUM('starters', 'mains', 'desserts', 'drinks', 'wines', 'lunch', 'specials');
  CREATE TYPE "public"."enum_menu_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__menu_items_v_version_allergens_allergen" AS ENUM('gluten', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soy', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'lupin', 'molluscs');
  CREATE TYPE "public"."enum__menu_items_v_version_category" AS ENUM('starters', 'mains', 'desserts', 'drinks', 'wines', 'lunch', 'specials');
  CREATE TYPE "public"."enum__menu_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reservations_preferences" AS ENUM('window', 'terrace', 'inside', 'quiet', 'bar');
  CREATE TYPE "public"."enum_reservations_occasion" AS ENUM('regular', 'birthday', 'anniversary', 'business', 'romantic', 'group', 'other');
  CREATE TYPE "public"."enum_reservations_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no-show');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('live-music', 'wine-tasting', 'chefs-table', 'private-dinner', 'holiday-special', 'workshop', 'themed-night', 'beer-spirits');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('live-music', 'wine-tasting', 'chefs-table', 'private-dinner', 'holiday-special', 'workshop', 'themed-night', 'beer-spirits');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_meilisearch_settings_indexed_collections_collection" AS ENUM('products', 'blog-posts', 'pages', 'cases', 'faqs', 'testimonials', 'services');
  CREATE TYPE "public"."enum_meilisearch_settings_searchable_fields_products_field" AS ENUM('title', 'sku', 'ean', 'brand', 'description', 'shortDescription', 'categories', 'tags');
  CREATE TYPE "public"."enum_meilisearch_settings_searchable_fields_blog_posts_field" AS ENUM('title', 'excerpt', 'content', 'categories', 'tags', 'author');
  CREATE TYPE "public"."enum_meilisearch_settings_searchable_fields_pages_field" AS ENUM('title', 'metaDescription', 'content');
  CREATE TYPE "public"."enum_meilisearch_settings_filterable_fields_products_field" AS ENUM('brand', 'categories', 'price', 'stock', 'status', 'featured', 'condition', 'tags');
  CREATE TYPE "public"."enum_meilisearch_settings_filterable_fields_blog_posts_field" AS ENUM('categories', 'status', 'featured', 'publishedAt', 'author');
  CREATE TYPE "public"."enum_meilisearch_settings_sortable_fields_products_field" AS ENUM('price', 'createdAt', 'title', 'stock', 'salesCount');
  CREATE TYPE "public"."enum_meilisearch_settings_sortable_fields_blog_posts_field" AS ENUM('publishedAt', 'title', 'viewCount');
  CREATE TYPE "public"."enum_meilisearch_settings_ranking_rules_rule" AS ENUM('words', 'typo', 'proximity', 'attribute', 'sort', 'exactness');
  CREATE TYPE "public"."enum_meilisearch_settings_custom_ranking_attributes_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_meilisearch_settings_exclude_patterns_type" AS ENUM('url', 'content', 'field');
  CREATE TYPE "public"."enum_meilisearch_settings_exclude_statuses_status" AS ENUM('draft', 'archived', 'pending', 'sold-out');
  CREATE TYPE "public"."enum_chatbot_settings_model" AS ENUM('groq', 'gpt-4', 'gpt-3.5', 'ollama', 'hybrid');
  CREATE TYPE "public"."enum_chatbot_settings_position" AS ENUM('bottom-right', 'bottom-left', 'top-right', 'top-left');
  CREATE TYPE "public"."enum_chatbot_settings_button_icon" AS ENUM('chat', 'robot', 'lightbulb', 'question');
  CREATE TABLE "edition_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"user_id" integer,
  	"magazine_title" varchar NOT NULL,
  	"product_id" integer,
  	"active" boolean DEFAULT true,
  	"last_notified" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ab_tests_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"distribution" numeric DEFAULT 50 NOT NULL
  );
  
  CREATE TABLE "ab_tests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"target_page" "enum_ab_tests_target_page" NOT NULL,
  	"status" "enum_ab_tests_status" DEFAULT 'draft' NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"winner" varchar,
  	"total_participants" numeric DEFAULT 0,
  	"total_conversions" numeric DEFAULT 0,
  	"auto_winner_enabled" boolean DEFAULT true,
  	"auto_winner_conversion_threshold" numeric DEFAULT 100,
  	"auto_winner_confidence_level" numeric DEFAULT 95,
  	"client_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ab_test_results" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"test_id" integer NOT NULL,
  	"variant" varchar NOT NULL,
  	"user_id_id" integer,
  	"session_id" varchar,
  	"converted" boolean DEFAULT false,
  	"conversion_value" numeric,
  	"converted_at" timestamp(3) with time zone,
  	"order_id" integer,
  	"user_agent" varchar,
  	"referrer" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "treatments_symptoms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"symptom" varchar
  );
  
  CREATE TABLE "treatments_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "treatments_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "treatments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" "enum_treatments_category",
  	"icon" varchar,
  	"excerpt" varchar,
  	"description" jsonb,
  	"duration" numeric,
  	"intake_duration" numeric,
  	"price" numeric,
  	"intake_price" numeric,
  	"insurance" "enum_treatments_insurance" DEFAULT 'covered',
  	"average_treatments" varchar,
  	"success_rate" numeric,
  	"featured_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_treatments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "treatments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer,
  	"practitioners_id" integer
  );
  
  CREATE TABLE "_treatments_v_version_symptoms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"symptom" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_category" "enum__treatments_v_version_category",
  	"version_icon" varchar,
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_duration" numeric,
  	"version_intake_duration" numeric,
  	"version_price" numeric,
  	"version_intake_price" numeric,
  	"version_insurance" "enum__treatments_v_version_insurance" DEFAULT 'covered',
  	"version_average_treatments" varchar,
  	"version_success_rate" numeric,
  	"version_featured_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_keywords" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__treatments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_treatments_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer,
  	"practitioners_id" integer
  );
  
  CREATE TABLE "practitioners_specializations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"specialization" varchar
  );
  
  CREATE TABLE "practitioners_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"qualification" varchar,
  	"year" numeric
  );
  
  CREATE TABLE "practitioners_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_practitioners_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "practitioners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"emoji" varchar,
  	"initials" varchar,
  	"title" varchar,
  	"role" "enum_practitioners_role",
  	"bio" jsonb,
  	"availability" "enum_practitioners_availability" DEFAULT 'available',
  	"email" varchar,
  	"phone" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_practitioners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "practitioners_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer
  );
  
  CREATE TABLE "_practitioners_v_version_specializations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"specialization" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_practitioners_v_version_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"qualification" varchar,
  	"year" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_practitioners_v_version_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__practitioners_v_version_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_practitioners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_avatar_id" integer,
  	"version_emoji" varchar,
  	"version_initials" varchar,
  	"version_title" varchar,
  	"version_role" "enum__practitioners_v_version_role",
  	"version_bio" jsonb,
  	"version_availability" "enum__practitioners_v_version_availability" DEFAULT 'available',
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__practitioners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_practitioners_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treatments_id" integer
  );
  
  CREATE TABLE "appointments_preferred_time" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_appointments_preferred_time",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "appointments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"name" varchar,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"birth_date" timestamp(3) with time zone,
  	"insurance" "enum_appointments_insurance",
  	"treatment" "enum_appointments_treatment",
  	"complaint" varchar NOT NULL,
  	"has_referral" "enum_appointments_has_referral" DEFAULT 'no',
  	"type" "enum_appointments_type" DEFAULT 'new',
  	"status" "enum_appointments_status" DEFAULT 'new',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "beauty_services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar
  );
  
  CREATE TABLE "beauty_services_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "beauty_services_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_beauty_services_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "beauty_services_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "beauty_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum_beauty_services_category",
  	"icon" varchar,
  	"excerpt" varchar,
  	"description" jsonb,
  	"duration" numeric,
  	"price" numeric,
  	"price_from" numeric,
  	"price_to" numeric,
  	"bookable" boolean DEFAULT true,
  	"requires_consultation" boolean DEFAULT false,
  	"featured_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_beauty_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "beauty_services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer,
  	"stylists_id" integer
  );
  
  CREATE TABLE "_beauty_services_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"benefit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_beauty_services_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_beauty_services_v_version_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__beauty_services_v_version_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_beauty_services_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_beauty_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_category" "enum__beauty_services_v_version_category",
  	"version_icon" varchar,
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_duration" numeric,
  	"version_price" numeric,
  	"version_price_from" numeric,
  	"version_price_to" numeric,
  	"version_bookable" boolean DEFAULT true,
  	"version_requires_consultation" boolean DEFAULT false,
  	"version_featured_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_keywords" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__beauty_services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_beauty_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer,
  	"stylists_id" integer
  );
  
  CREATE TABLE "stylists_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"specialty" varchar
  );
  
  CREATE TABLE "stylists_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"certification" varchar,
  	"year" numeric,
  	"institution" varchar
  );
  
  CREATE TABLE "stylists_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_stylists_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "stylists_portfolio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "stylists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"emoji" varchar,
  	"initials" varchar,
  	"role" "enum_stylists_role",
  	"bio" jsonb,
  	"experience" numeric,
  	"availability" "enum_stylists_availability" DEFAULT 'available',
  	"start_time" varchar,
  	"end_time" varchar,
  	"bookable" boolean DEFAULT true,
  	"email" varchar,
  	"phone" varchar,
  	"instagram" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stylists_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stylists_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer
  );
  
  CREATE TABLE "_stylists_v_version_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"specialty" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stylists_v_version_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"certification" varchar,
  	"year" numeric,
  	"institution" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stylists_v_version_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__stylists_v_version_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_stylists_v_version_portfolio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stylists_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_avatar_id" integer,
  	"version_emoji" varchar,
  	"version_initials" varchar,
  	"version_role" "enum__stylists_v_version_role",
  	"version_bio" jsonb,
  	"version_experience" numeric,
  	"version_availability" "enum__stylists_v_version_availability" DEFAULT 'available',
  	"version_start_time" varchar,
  	"version_end_time" varchar,
  	"version_bookable" boolean DEFAULT true,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_instagram" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stylists_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_stylists_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beauty_services_id" integer
  );
  
  CREATE TABLE "beauty_bookings_preferred_time_slots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_beauty_bookings_preferred_time_slots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "beauty_bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"customer_name" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"service_id" integer,
  	"stylist_id" integer,
  	"date" timestamp(3) with time zone NOT NULL,
  	"time" varchar NOT NULL,
  	"remarks" varchar,
  	"is_first_visit" boolean DEFAULT false,
  	"marketing_consent" boolean DEFAULT false,
  	"status" "enum_beauty_bookings_status" DEFAULT 'new',
  	"total_price" numeric,
  	"duration" numeric,
  	"notes" varchar,
  	"confirmation_sent" boolean DEFAULT false,
  	"reminder_sent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menu_items_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" "enum_menu_items_allergens_allergen"
  );
  
  CREATE TABLE "menu_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum_menu_items_category" DEFAULT 'mains',
  	"description" varchar,
  	"ingredients" varchar,
  	"price" numeric,
  	"featured" boolean DEFAULT false,
  	"vegetarian" boolean DEFAULT false,
  	"vegan" boolean DEFAULT false,
  	"gluten_free" boolean DEFAULT false,
  	"image_id" integer,
  	"icon" varchar DEFAULT '🍽️',
  	"sort_order" numeric DEFAULT 0,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_menu_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_menu_items_v_version_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"allergen" "enum__menu_items_v_version_allergens_allergen",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_menu_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_category" "enum__menu_items_v_version_category" DEFAULT 'mains',
  	"version_description" varchar,
  	"version_ingredients" varchar,
  	"version_price" numeric,
  	"version_featured" boolean DEFAULT false,
  	"version_vegetarian" boolean DEFAULT false,
  	"version_vegan" boolean DEFAULT false,
  	"version_gluten_free" boolean DEFAULT false,
  	"version_image_id" integer,
  	"version_icon" varchar DEFAULT '🍽️',
  	"version_sort_order" numeric DEFAULT 0,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__menu_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "reservations_preferences" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_reservations_preferences",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "reservations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_name" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"customer_phone" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"time" varchar NOT NULL,
  	"guests" numeric DEFAULT 2 NOT NULL,
  	"occasion" "enum_reservations_occasion" DEFAULT 'regular',
  	"special_requests" varchar,
  	"status" "enum_reservations_status" DEFAULT 'pending' NOT NULL,
  	"confirmed" boolean DEFAULT false,
  	"reminded" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"assigned_table" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "events_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"event_type" "enum_events_event_type",
  	"excerpt" varchar,
  	"description" jsonb,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"start_time" varchar DEFAULT '19:00',
  	"duration" varchar,
  	"price" numeric,
  	"max_guests" numeric,
  	"featured" boolean DEFAULT false,
  	"booking_required" boolean DEFAULT true,
  	"booking_url" varchar,
  	"image_id" integer,
  	"icon" varchar DEFAULT '🎉',
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_event_type" "enum__events_v_version_event_type",
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_start_time" varchar DEFAULT '19:00',
  	"version_duration" varchar,
  	"version_price" numeric,
  	"version_max_guests" numeric,
  	"version_featured" boolean DEFAULT false,
  	"version_booking_required" boolean DEFAULT true,
  	"version_booking_url" varchar,
  	"version_image_id" integer,
  	"version_icon" varchar DEFAULT '🎉',
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "meilisearch_settings_indexed_collections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"collection" "enum_meilisearch_settings_indexed_collections_collection" NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"priority" numeric DEFAULT 1,
  	"index_name" varchar
  );
  
  CREATE TABLE "meilisearch_settings_searchable_fields_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_searchable_fields_products_field" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_searchable_fields_blog_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_searchable_fields_blog_posts_field" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_searchable_fields_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_searchable_fields_pages_field" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_filterable_fields_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_filterable_fields_products_field" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_filterable_fields_blog_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_filterable_fields_blog_posts_field" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_sortable_fields_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_sortable_fields_products_field" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_sortable_fields_blog_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" "enum_meilisearch_settings_sortable_fields_blog_posts_field" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_ranking_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rule" "enum_meilisearch_settings_ranking_rules_rule" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_custom_ranking_attributes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attribute" varchar NOT NULL,
  	"order" "enum_meilisearch_settings_custom_ranking_attributes_order" DEFAULT 'desc' NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_typo_tolerance_disable_on_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_synonyms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_stop_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_exclude_patterns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pattern" varchar NOT NULL,
  	"type" "enum_meilisearch_settings_exclude_patterns_type" DEFAULT 'url' NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings_exclude_statuses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" "enum_meilisearch_settings_exclude_statuses_status" NOT NULL
  );
  
  CREATE TABLE "meilisearch_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"typo_tolerance_enabled" boolean DEFAULT true,
  	"typo_tolerance_min_word_size_for_one_typo" numeric DEFAULT 4,
  	"typo_tolerance_min_word_size_for_two_typos" numeric DEFAULT 8,
  	"auto_indexing_enabled" boolean DEFAULT true,
  	"auto_indexing_index_on_publish" boolean DEFAULT true,
  	"auto_indexing_batch_size" numeric DEFAULT 100,
  	"auto_indexing_debounce_ms" numeric DEFAULT 1000,
  	"pagination_max_total_hits" numeric DEFAULT 1000,
  	"pagination_default_limit" numeric DEFAULT 20,
  	"pagination_max_limit" numeric DEFAULT 100,
  	"performance_enable_highlighting" boolean DEFAULT true,
  	"performance_highlight_pre_tag" varchar DEFAULT '<mark>',
  	"performance_highlight_post_tag" varchar DEFAULT '</mark>',
  	"performance_crop_length" numeric DEFAULT 200,
  	"performance_crop_marker" varchar DEFAULT '...',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "chatbot_settings_suggested_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_settings_rate_limiting_blocked_i_ps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ip" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_settings_moderation_blocked_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"model" "enum_chatbot_settings_model" DEFAULT 'groq' NOT NULL,
  	"temperature" numeric DEFAULT 0.7,
  	"max_tokens" numeric DEFAULT 500,
  	"context_window" numeric DEFAULT 5,
  	"position" "enum_chatbot_settings_position" DEFAULT 'bottom-right' NOT NULL,
  	"button_color" varchar DEFAULT '#0ea5e9',
  	"button_icon" "enum_chatbot_settings_button_icon" DEFAULT 'chat',
  	"welcome_message" varchar DEFAULT 'Hallo! Hoe kan ik je helpen?',
  	"placeholder" varchar DEFAULT 'Typ je vraag...',
  	"system_prompt" varchar,
  	"knowledge_base_integration_enabled" boolean DEFAULT true,
  	"knowledge_base_integration_max_results" numeric DEFAULT 3,
  	"knowledge_base_integration_include_source_links" boolean DEFAULT true,
  	"training_context" varchar,
  	"rate_limiting_enabled" boolean DEFAULT true,
  	"rate_limiting_max_messages_per_hour" numeric DEFAULT 20,
  	"rate_limiting_max_messages_per_day" numeric DEFAULT 50,
  	"rate_limiting_cooldown_seconds" numeric DEFAULT 3,
  	"moderation_enabled" boolean DEFAULT true,
  	"api_configuration_groq_api_key" varchar,
  	"api_configuration_openai_api_key" varchar,
  	"api_configuration_ollama_url" varchar,
  	"analytics_enable_logging" boolean DEFAULT true,
  	"analytics_enable_analytics" boolean DEFAULT true,
  	"analytics_retention_days" numeric DEFAULT 30,
  	"fallback_enable_fallback" boolean DEFAULT true,
  	"fallback_fallback_message" varchar DEFAULT 'Sorry, ik kan momenteel geen antwoord geven. Neem contact op via info@bedrijf.nl of bel 020-1234567.',
  	"fallback_contact_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "theme" ALTER COLUMN "primary_color" SET DEFAULT '#00897B';
  ALTER TABLE "theme" ALTER COLUMN "background_color" SET DEFAULT '#F5F7FA';
  ALTER TABLE "theme" ALTER COLUMN "surface_color" SET DEFAULT '#ffffff';
  ALTER TABLE "theme" ALTER COLUMN "border_color" SET DEFAULT '#E8ECF1';
  ALTER TABLE "products_variant_options_values" ADD COLUMN "subscription_type" "enum_products_variant_options_values_subscription_type";
  ALTER TABLE "products_variant_options_values" ADD COLUMN "issues" numeric;
  ALTER TABLE "products_variant_options_values" ADD COLUMN "discount_percentage" numeric;
  ALTER TABLE "products_variant_options_values" ADD COLUMN "auto_renew" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "magazine_title" varchar;
  ALTER TABLE "products" ADD COLUMN "is_subscription" boolean DEFAULT false;
  ALTER TABLE "subscription_plans" ADD COLUMN "allows_premium_content" boolean DEFAULT false;
  ALTER TABLE "subscription_plans" ADD COLUMN "tier" "enum_subscription_plans_tier" DEFAULT 'free';
  ALTER TABLE "blog_posts" ADD COLUMN "content_type" "enum_blog_posts_content_type" DEFAULT 'article';
  ALTER TABLE "blog_posts" ADD COLUMN "content_access_access_level" "enum_blog_posts_content_access_access_level" DEFAULT 'free';
  ALTER TABLE "blog_posts" ADD COLUMN "content_access_preview_length" numeric DEFAULT 200;
  ALTER TABLE "blog_posts" ADD COLUMN "content_access_lock_message" varchar;
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_content_type" "enum__blog_posts_v_version_content_type" DEFAULT 'article';
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_content_access_access_level" "enum__blog_posts_v_version_content_access_access_level" DEFAULT 'free';
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_content_access_preview_length" numeric DEFAULT 200;
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_content_access_lock_message" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "edition_notifications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ab_tests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ab_test_results_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "treatments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "practitioners_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appointments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "beauty_services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stylists_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "beauty_bookings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "menu_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reservations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "theme" ADD COLUMN "primary_light" varchar DEFAULT '#26A69A';
  ALTER TABLE "theme" ADD COLUMN "primary_glow" varchar DEFAULT 'rgba(0,137,123,0.12)';
  ALTER TABLE "theme" ADD COLUMN "secondary_light" varchar DEFAULT '#121F33';
  ALTER TABLE "theme" ADD COLUMN "grey_light" varchar DEFAULT '#F1F4F8';
  ALTER TABLE "theme" ADD COLUMN "grey_mid" varchar DEFAULT '#94A3B8';
  ALTER TABLE "theme" ADD COLUMN "grey_dark" varchar DEFAULT '#64748B';
  ALTER TABLE "edition_notifications" ADD CONSTRAINT "edition_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edition_notifications" ADD CONSTRAINT "edition_notifications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_tests_variants" ADD CONSTRAINT "ab_tests_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_test_id_ab_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ab_tests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_user_id_id_users_id_fk" FOREIGN KEY ("user_id_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treatments_symptoms" ADD CONSTRAINT "treatments_symptoms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_process" ADD CONSTRAINT "treatments_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_gallery" ADD CONSTRAINT "treatments_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treatments_gallery" ADD CONSTRAINT "treatments_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments" ADD CONSTRAINT "treatments_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_practitioners_fk" FOREIGN KEY ("practitioners_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_symptoms" ADD CONSTRAINT "_treatments_v_version_symptoms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_process" ADD CONSTRAINT "_treatments_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_gallery" ADD CONSTRAINT "_treatments_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_gallery" ADD CONSTRAINT "_treatments_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v" ADD CONSTRAINT "_treatments_v_parent_id_treatments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."treatments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_treatments_v" ADD CONSTRAINT "_treatments_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_treatments_v_rels" ADD CONSTRAINT "_treatments_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_rels" ADD CONSTRAINT "_treatments_v_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_rels" ADD CONSTRAINT "_treatments_v_rels_practitioners_fk" FOREIGN KEY ("practitioners_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practitioners_specializations" ADD CONSTRAINT "practitioners_specializations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practitioners_qualifications" ADD CONSTRAINT "practitioners_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practitioners_work_days" ADD CONSTRAINT "practitioners_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practitioners_rels" ADD CONSTRAINT "practitioners_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practitioners_rels" ADD CONSTRAINT "practitioners_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practitioners_v_version_specializations" ADD CONSTRAINT "_practitioners_v_version_specializations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practitioners_v_version_qualifications" ADD CONSTRAINT "_practitioners_v_version_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practitioners_v_version_work_days" ADD CONSTRAINT "_practitioners_v_version_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practitioners_v" ADD CONSTRAINT "_practitioners_v_parent_id_practitioners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practitioners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_practitioners_v" ADD CONSTRAINT "_practitioners_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_practitioners_v_rels" ADD CONSTRAINT "_practitioners_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_practitioners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practitioners_v_rels" ADD CONSTRAINT "_practitioners_v_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appointments_preferred_time" ADD CONSTRAINT "appointments_preferred_time_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_services_benefits" ADD CONSTRAINT "beauty_services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_services_process" ADD CONSTRAINT "beauty_services_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_services_tags" ADD CONSTRAINT "beauty_services_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_services_gallery" ADD CONSTRAINT "beauty_services_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "beauty_services_gallery" ADD CONSTRAINT "beauty_services_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_services" ADD CONSTRAINT "beauty_services_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "beauty_services_rels" ADD CONSTRAINT "beauty_services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_services_rels" ADD CONSTRAINT "beauty_services_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_services_rels" ADD CONSTRAINT "beauty_services_rels_stylists_fk" FOREIGN KEY ("stylists_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_version_benefits" ADD CONSTRAINT "_beauty_services_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_version_process" ADD CONSTRAINT "_beauty_services_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_version_tags" ADD CONSTRAINT "_beauty_services_v_version_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_version_gallery" ADD CONSTRAINT "_beauty_services_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_version_gallery" ADD CONSTRAINT "_beauty_services_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beauty_services_v" ADD CONSTRAINT "_beauty_services_v_parent_id_beauty_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_beauty_services_v" ADD CONSTRAINT "_beauty_services_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_rels" ADD CONSTRAINT "_beauty_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_beauty_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_rels" ADD CONSTRAINT "_beauty_services_v_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beauty_services_v_rels" ADD CONSTRAINT "_beauty_services_v_rels_stylists_fk" FOREIGN KEY ("stylists_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stylists_specialties" ADD CONSTRAINT "stylists_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stylists_certifications" ADD CONSTRAINT "stylists_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stylists_work_days" ADD CONSTRAINT "stylists_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stylists_portfolio" ADD CONSTRAINT "stylists_portfolio_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stylists_portfolio" ADD CONSTRAINT "stylists_portfolio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stylists" ADD CONSTRAINT "stylists_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stylists_rels" ADD CONSTRAINT "stylists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stylists_rels" ADD CONSTRAINT "stylists_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stylists_v_version_specialties" ADD CONSTRAINT "_stylists_v_version_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stylists_v_version_certifications" ADD CONSTRAINT "_stylists_v_version_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stylists_v_version_work_days" ADD CONSTRAINT "_stylists_v_version_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stylists_v_version_portfolio" ADD CONSTRAINT "_stylists_v_version_portfolio_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stylists_v_version_portfolio" ADD CONSTRAINT "_stylists_v_version_portfolio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stylists_v" ADD CONSTRAINT "_stylists_v_parent_id_stylists_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stylists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stylists_v" ADD CONSTRAINT "_stylists_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stylists_v_rels" ADD CONSTRAINT "_stylists_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stylists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stylists_v_rels" ADD CONSTRAINT "_stylists_v_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_bookings_preferred_time_slots" ADD CONSTRAINT "beauty_bookings_preferred_time_slots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beauty_bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beauty_bookings" ADD CONSTRAINT "beauty_bookings_service_id_beauty_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."beauty_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "beauty_bookings" ADD CONSTRAINT "beauty_bookings_stylist_id_stylists_id_fk" FOREIGN KEY ("stylist_id") REFERENCES "public"."stylists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_items_allergens" ADD CONSTRAINT "menu_items_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_items_v_version_allergens" ADD CONSTRAINT "_menu_items_v_version_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_items_v" ADD CONSTRAINT "_menu_items_v_parent_id_menu_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_items_v" ADD CONSTRAINT "_menu_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reservations_preferences" ADD CONSTRAINT "reservations_preferences_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_tags" ADD CONSTRAINT "events_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_tags" ADD CONSTRAINT "_events_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_indexed_collections" ADD CONSTRAINT "meilisearch_settings_indexed_collections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_searchable_fields_products" ADD CONSTRAINT "meilisearch_settings_searchable_fields_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_searchable_fields_blog_posts" ADD CONSTRAINT "meilisearch_settings_searchable_fields_blog_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_searchable_fields_pages" ADD CONSTRAINT "meilisearch_settings_searchable_fields_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_filterable_fields_products" ADD CONSTRAINT "meilisearch_settings_filterable_fields_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_filterable_fields_blog_posts" ADD CONSTRAINT "meilisearch_settings_filterable_fields_blog_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_sortable_fields_products" ADD CONSTRAINT "meilisearch_settings_sortable_fields_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_sortable_fields_blog_posts" ADD CONSTRAINT "meilisearch_settings_sortable_fields_blog_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_ranking_rules" ADD CONSTRAINT "meilisearch_settings_ranking_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_custom_ranking_attributes" ADD CONSTRAINT "meilisearch_settings_custom_ranking_attributes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_typo_tolerance_disable_on_words" ADD CONSTRAINT "meilisearch_settings_typo_tolerance_disable_on_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_synonyms" ADD CONSTRAINT "meilisearch_settings_synonyms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_stop_words" ADD CONSTRAINT "meilisearch_settings_stop_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_exclude_patterns" ADD CONSTRAINT "meilisearch_settings_exclude_patterns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meilisearch_settings_exclude_statuses" ADD CONSTRAINT "meilisearch_settings_exclude_statuses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meilisearch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_settings_suggested_questions" ADD CONSTRAINT "chatbot_settings_suggested_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_settings_rate_limiting_blocked_i_ps" ADD CONSTRAINT "chatbot_settings_rate_limiting_blocked_i_ps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_settings_moderation_blocked_keywords" ADD CONSTRAINT "chatbot_settings_moderation_blocked_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "edition_notifications_user_idx" ON "edition_notifications" USING btree ("user_id");
  CREATE INDEX "edition_notifications_product_idx" ON "edition_notifications" USING btree ("product_id");
  CREATE INDEX "edition_notifications_updated_at_idx" ON "edition_notifications" USING btree ("updated_at");
  CREATE INDEX "edition_notifications_created_at_idx" ON "edition_notifications" USING btree ("created_at");
  CREATE INDEX "ab_tests_variants_order_idx" ON "ab_tests_variants" USING btree ("_order");
  CREATE INDEX "ab_tests_variants_parent_id_idx" ON "ab_tests_variants" USING btree ("_parent_id");
  CREATE INDEX "ab_tests_client_idx" ON "ab_tests" USING btree ("client_id");
  CREATE INDEX "ab_tests_updated_at_idx" ON "ab_tests" USING btree ("updated_at");
  CREATE INDEX "ab_tests_created_at_idx" ON "ab_tests" USING btree ("created_at");
  CREATE INDEX "ab_test_results_test_idx" ON "ab_test_results" USING btree ("test_id");
  CREATE INDEX "ab_test_results_user_id_idx" ON "ab_test_results" USING btree ("user_id_id");
  CREATE INDEX "ab_test_results_order_idx" ON "ab_test_results" USING btree ("order_id");
  CREATE INDEX "ab_test_results_updated_at_idx" ON "ab_test_results" USING btree ("updated_at");
  CREATE INDEX "ab_test_results_created_at_idx" ON "ab_test_results" USING btree ("created_at");
  CREATE UNIQUE INDEX "test_sessionId_idx" ON "ab_test_results" USING btree ("test_id","session_id");
  CREATE INDEX "test_userId_idx" ON "ab_test_results" USING btree ("test_id","user_id_id");
  CREATE INDEX "test_variant_idx" ON "ab_test_results" USING btree ("test_id","variant");
  CREATE INDEX "converted_idx" ON "ab_test_results" USING btree ("converted");
  CREATE INDEX "treatments_symptoms_order_idx" ON "treatments_symptoms" USING btree ("_order");
  CREATE INDEX "treatments_symptoms_parent_id_idx" ON "treatments_symptoms" USING btree ("_parent_id");
  CREATE INDEX "treatments_process_order_idx" ON "treatments_process" USING btree ("_order");
  CREATE INDEX "treatments_process_parent_id_idx" ON "treatments_process" USING btree ("_parent_id");
  CREATE INDEX "treatments_gallery_order_idx" ON "treatments_gallery" USING btree ("_order");
  CREATE INDEX "treatments_gallery_parent_id_idx" ON "treatments_gallery" USING btree ("_parent_id");
  CREATE INDEX "treatments_gallery_image_idx" ON "treatments_gallery" USING btree ("image_id");
  CREATE INDEX "treatments_featured_image_idx" ON "treatments" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "treatments_slug_idx" ON "treatments" USING btree ("slug");
  CREATE INDEX "treatments_updated_at_idx" ON "treatments" USING btree ("updated_at");
  CREATE INDEX "treatments_created_at_idx" ON "treatments" USING btree ("created_at");
  CREATE INDEX "treatments__status_idx" ON "treatments" USING btree ("_status");
  CREATE INDEX "treatments_rels_order_idx" ON "treatments_rels" USING btree ("order");
  CREATE INDEX "treatments_rels_parent_idx" ON "treatments_rels" USING btree ("parent_id");
  CREATE INDEX "treatments_rels_path_idx" ON "treatments_rels" USING btree ("path");
  CREATE INDEX "treatments_rels_treatments_id_idx" ON "treatments_rels" USING btree ("treatments_id");
  CREATE INDEX "treatments_rels_practitioners_id_idx" ON "treatments_rels" USING btree ("practitioners_id");
  CREATE INDEX "_treatments_v_version_symptoms_order_idx" ON "_treatments_v_version_symptoms" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_symptoms_parent_id_idx" ON "_treatments_v_version_symptoms" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_process_order_idx" ON "_treatments_v_version_process" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_process_parent_id_idx" ON "_treatments_v_version_process" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_gallery_order_idx" ON "_treatments_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_gallery_parent_id_idx" ON "_treatments_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_gallery_image_idx" ON "_treatments_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_treatments_v_parent_idx" ON "_treatments_v" USING btree ("parent_id");
  CREATE INDEX "_treatments_v_version_version_featured_image_idx" ON "_treatments_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_treatments_v_version_version_slug_idx" ON "_treatments_v" USING btree ("version_slug");
  CREATE INDEX "_treatments_v_version_version_updated_at_idx" ON "_treatments_v" USING btree ("version_updated_at");
  CREATE INDEX "_treatments_v_version_version_created_at_idx" ON "_treatments_v" USING btree ("version_created_at");
  CREATE INDEX "_treatments_v_version_version__status_idx" ON "_treatments_v" USING btree ("version__status");
  CREATE INDEX "_treatments_v_created_at_idx" ON "_treatments_v" USING btree ("created_at");
  CREATE INDEX "_treatments_v_updated_at_idx" ON "_treatments_v" USING btree ("updated_at");
  CREATE INDEX "_treatments_v_latest_idx" ON "_treatments_v" USING btree ("latest");
  CREATE INDEX "_treatments_v_autosave_idx" ON "_treatments_v" USING btree ("autosave");
  CREATE INDEX "_treatments_v_rels_order_idx" ON "_treatments_v_rels" USING btree ("order");
  CREATE INDEX "_treatments_v_rels_parent_idx" ON "_treatments_v_rels" USING btree ("parent_id");
  CREATE INDEX "_treatments_v_rels_path_idx" ON "_treatments_v_rels" USING btree ("path");
  CREATE INDEX "_treatments_v_rels_treatments_id_idx" ON "_treatments_v_rels" USING btree ("treatments_id");
  CREATE INDEX "_treatments_v_rels_practitioners_id_idx" ON "_treatments_v_rels" USING btree ("practitioners_id");
  CREATE INDEX "practitioners_specializations_order_idx" ON "practitioners_specializations" USING btree ("_order");
  CREATE INDEX "practitioners_specializations_parent_id_idx" ON "practitioners_specializations" USING btree ("_parent_id");
  CREATE INDEX "practitioners_qualifications_order_idx" ON "practitioners_qualifications" USING btree ("_order");
  CREATE INDEX "practitioners_qualifications_parent_id_idx" ON "practitioners_qualifications" USING btree ("_parent_id");
  CREATE INDEX "practitioners_work_days_order_idx" ON "practitioners_work_days" USING btree ("order");
  CREATE INDEX "practitioners_work_days_parent_idx" ON "practitioners_work_days" USING btree ("parent_id");
  CREATE INDEX "practitioners_avatar_idx" ON "practitioners" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "practitioners_slug_idx" ON "practitioners" USING btree ("slug");
  CREATE INDEX "practitioners_updated_at_idx" ON "practitioners" USING btree ("updated_at");
  CREATE INDEX "practitioners_created_at_idx" ON "practitioners" USING btree ("created_at");
  CREATE INDEX "practitioners__status_idx" ON "practitioners" USING btree ("_status");
  CREATE INDEX "practitioners_rels_order_idx" ON "practitioners_rels" USING btree ("order");
  CREATE INDEX "practitioners_rels_parent_idx" ON "practitioners_rels" USING btree ("parent_id");
  CREATE INDEX "practitioners_rels_path_idx" ON "practitioners_rels" USING btree ("path");
  CREATE INDEX "practitioners_rels_treatments_id_idx" ON "practitioners_rels" USING btree ("treatments_id");
  CREATE INDEX "_practitioners_v_version_specializations_order_idx" ON "_practitioners_v_version_specializations" USING btree ("_order");
  CREATE INDEX "_practitioners_v_version_specializations_parent_id_idx" ON "_practitioners_v_version_specializations" USING btree ("_parent_id");
  CREATE INDEX "_practitioners_v_version_qualifications_order_idx" ON "_practitioners_v_version_qualifications" USING btree ("_order");
  CREATE INDEX "_practitioners_v_version_qualifications_parent_id_idx" ON "_practitioners_v_version_qualifications" USING btree ("_parent_id");
  CREATE INDEX "_practitioners_v_version_work_days_order_idx" ON "_practitioners_v_version_work_days" USING btree ("order");
  CREATE INDEX "_practitioners_v_version_work_days_parent_idx" ON "_practitioners_v_version_work_days" USING btree ("parent_id");
  CREATE INDEX "_practitioners_v_parent_idx" ON "_practitioners_v" USING btree ("parent_id");
  CREATE INDEX "_practitioners_v_version_version_avatar_idx" ON "_practitioners_v" USING btree ("version_avatar_id");
  CREATE INDEX "_practitioners_v_version_version_slug_idx" ON "_practitioners_v" USING btree ("version_slug");
  CREATE INDEX "_practitioners_v_version_version_updated_at_idx" ON "_practitioners_v" USING btree ("version_updated_at");
  CREATE INDEX "_practitioners_v_version_version_created_at_idx" ON "_practitioners_v" USING btree ("version_created_at");
  CREATE INDEX "_practitioners_v_version_version__status_idx" ON "_practitioners_v" USING btree ("version__status");
  CREATE INDEX "_practitioners_v_created_at_idx" ON "_practitioners_v" USING btree ("created_at");
  CREATE INDEX "_practitioners_v_updated_at_idx" ON "_practitioners_v" USING btree ("updated_at");
  CREATE INDEX "_practitioners_v_latest_idx" ON "_practitioners_v" USING btree ("latest");
  CREATE INDEX "_practitioners_v_autosave_idx" ON "_practitioners_v" USING btree ("autosave");
  CREATE INDEX "_practitioners_v_rels_order_idx" ON "_practitioners_v_rels" USING btree ("order");
  CREATE INDEX "_practitioners_v_rels_parent_idx" ON "_practitioners_v_rels" USING btree ("parent_id");
  CREATE INDEX "_practitioners_v_rels_path_idx" ON "_practitioners_v_rels" USING btree ("path");
  CREATE INDEX "_practitioners_v_rels_treatments_id_idx" ON "_practitioners_v_rels" USING btree ("treatments_id");
  CREATE INDEX "appointments_preferred_time_order_idx" ON "appointments_preferred_time" USING btree ("order");
  CREATE INDEX "appointments_preferred_time_parent_idx" ON "appointments_preferred_time" USING btree ("parent_id");
  CREATE INDEX "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
  CREATE INDEX "appointments_created_at_idx" ON "appointments" USING btree ("created_at");
  CREATE INDEX "beauty_services_benefits_order_idx" ON "beauty_services_benefits" USING btree ("_order");
  CREATE INDEX "beauty_services_benefits_parent_id_idx" ON "beauty_services_benefits" USING btree ("_parent_id");
  CREATE INDEX "beauty_services_process_order_idx" ON "beauty_services_process" USING btree ("_order");
  CREATE INDEX "beauty_services_process_parent_id_idx" ON "beauty_services_process" USING btree ("_parent_id");
  CREATE INDEX "beauty_services_tags_order_idx" ON "beauty_services_tags" USING btree ("order");
  CREATE INDEX "beauty_services_tags_parent_idx" ON "beauty_services_tags" USING btree ("parent_id");
  CREATE INDEX "beauty_services_gallery_order_idx" ON "beauty_services_gallery" USING btree ("_order");
  CREATE INDEX "beauty_services_gallery_parent_id_idx" ON "beauty_services_gallery" USING btree ("_parent_id");
  CREATE INDEX "beauty_services_gallery_image_idx" ON "beauty_services_gallery" USING btree ("image_id");
  CREATE INDEX "beauty_services_featured_image_idx" ON "beauty_services" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "beauty_services_slug_idx" ON "beauty_services" USING btree ("slug");
  CREATE INDEX "beauty_services_updated_at_idx" ON "beauty_services" USING btree ("updated_at");
  CREATE INDEX "beauty_services_created_at_idx" ON "beauty_services" USING btree ("created_at");
  CREATE INDEX "beauty_services__status_idx" ON "beauty_services" USING btree ("_status");
  CREATE INDEX "beauty_services_rels_order_idx" ON "beauty_services_rels" USING btree ("order");
  CREATE INDEX "beauty_services_rels_parent_idx" ON "beauty_services_rels" USING btree ("parent_id");
  CREATE INDEX "beauty_services_rels_path_idx" ON "beauty_services_rels" USING btree ("path");
  CREATE INDEX "beauty_services_rels_beauty_services_id_idx" ON "beauty_services_rels" USING btree ("beauty_services_id");
  CREATE INDEX "beauty_services_rels_stylists_id_idx" ON "beauty_services_rels" USING btree ("stylists_id");
  CREATE INDEX "_beauty_services_v_version_benefits_order_idx" ON "_beauty_services_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_beauty_services_v_version_benefits_parent_id_idx" ON "_beauty_services_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_beauty_services_v_version_process_order_idx" ON "_beauty_services_v_version_process" USING btree ("_order");
  CREATE INDEX "_beauty_services_v_version_process_parent_id_idx" ON "_beauty_services_v_version_process" USING btree ("_parent_id");
  CREATE INDEX "_beauty_services_v_version_tags_order_idx" ON "_beauty_services_v_version_tags" USING btree ("order");
  CREATE INDEX "_beauty_services_v_version_tags_parent_idx" ON "_beauty_services_v_version_tags" USING btree ("parent_id");
  CREATE INDEX "_beauty_services_v_version_gallery_order_idx" ON "_beauty_services_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_beauty_services_v_version_gallery_parent_id_idx" ON "_beauty_services_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_beauty_services_v_version_gallery_image_idx" ON "_beauty_services_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_beauty_services_v_parent_idx" ON "_beauty_services_v" USING btree ("parent_id");
  CREATE INDEX "_beauty_services_v_version_version_featured_image_idx" ON "_beauty_services_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_beauty_services_v_version_version_slug_idx" ON "_beauty_services_v" USING btree ("version_slug");
  CREATE INDEX "_beauty_services_v_version_version_updated_at_idx" ON "_beauty_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_beauty_services_v_version_version_created_at_idx" ON "_beauty_services_v" USING btree ("version_created_at");
  CREATE INDEX "_beauty_services_v_version_version__status_idx" ON "_beauty_services_v" USING btree ("version__status");
  CREATE INDEX "_beauty_services_v_created_at_idx" ON "_beauty_services_v" USING btree ("created_at");
  CREATE INDEX "_beauty_services_v_updated_at_idx" ON "_beauty_services_v" USING btree ("updated_at");
  CREATE INDEX "_beauty_services_v_latest_idx" ON "_beauty_services_v" USING btree ("latest");
  CREATE INDEX "_beauty_services_v_autosave_idx" ON "_beauty_services_v" USING btree ("autosave");
  CREATE INDEX "_beauty_services_v_rels_order_idx" ON "_beauty_services_v_rels" USING btree ("order");
  CREATE INDEX "_beauty_services_v_rels_parent_idx" ON "_beauty_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_beauty_services_v_rels_path_idx" ON "_beauty_services_v_rels" USING btree ("path");
  CREATE INDEX "_beauty_services_v_rels_beauty_services_id_idx" ON "_beauty_services_v_rels" USING btree ("beauty_services_id");
  CREATE INDEX "_beauty_services_v_rels_stylists_id_idx" ON "_beauty_services_v_rels" USING btree ("stylists_id");
  CREATE INDEX "stylists_specialties_order_idx" ON "stylists_specialties" USING btree ("_order");
  CREATE INDEX "stylists_specialties_parent_id_idx" ON "stylists_specialties" USING btree ("_parent_id");
  CREATE INDEX "stylists_certifications_order_idx" ON "stylists_certifications" USING btree ("_order");
  CREATE INDEX "stylists_certifications_parent_id_idx" ON "stylists_certifications" USING btree ("_parent_id");
  CREATE INDEX "stylists_work_days_order_idx" ON "stylists_work_days" USING btree ("order");
  CREATE INDEX "stylists_work_days_parent_idx" ON "stylists_work_days" USING btree ("parent_id");
  CREATE INDEX "stylists_portfolio_order_idx" ON "stylists_portfolio" USING btree ("_order");
  CREATE INDEX "stylists_portfolio_parent_id_idx" ON "stylists_portfolio" USING btree ("_parent_id");
  CREATE INDEX "stylists_portfolio_image_idx" ON "stylists_portfolio" USING btree ("image_id");
  CREATE INDEX "stylists_avatar_idx" ON "stylists" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "stylists_slug_idx" ON "stylists" USING btree ("slug");
  CREATE INDEX "stylists_updated_at_idx" ON "stylists" USING btree ("updated_at");
  CREATE INDEX "stylists_created_at_idx" ON "stylists" USING btree ("created_at");
  CREATE INDEX "stylists__status_idx" ON "stylists" USING btree ("_status");
  CREATE INDEX "stylists_rels_order_idx" ON "stylists_rels" USING btree ("order");
  CREATE INDEX "stylists_rels_parent_idx" ON "stylists_rels" USING btree ("parent_id");
  CREATE INDEX "stylists_rels_path_idx" ON "stylists_rels" USING btree ("path");
  CREATE INDEX "stylists_rels_beauty_services_id_idx" ON "stylists_rels" USING btree ("beauty_services_id");
  CREATE INDEX "_stylists_v_version_specialties_order_idx" ON "_stylists_v_version_specialties" USING btree ("_order");
  CREATE INDEX "_stylists_v_version_specialties_parent_id_idx" ON "_stylists_v_version_specialties" USING btree ("_parent_id");
  CREATE INDEX "_stylists_v_version_certifications_order_idx" ON "_stylists_v_version_certifications" USING btree ("_order");
  CREATE INDEX "_stylists_v_version_certifications_parent_id_idx" ON "_stylists_v_version_certifications" USING btree ("_parent_id");
  CREATE INDEX "_stylists_v_version_work_days_order_idx" ON "_stylists_v_version_work_days" USING btree ("order");
  CREATE INDEX "_stylists_v_version_work_days_parent_idx" ON "_stylists_v_version_work_days" USING btree ("parent_id");
  CREATE INDEX "_stylists_v_version_portfolio_order_idx" ON "_stylists_v_version_portfolio" USING btree ("_order");
  CREATE INDEX "_stylists_v_version_portfolio_parent_id_idx" ON "_stylists_v_version_portfolio" USING btree ("_parent_id");
  CREATE INDEX "_stylists_v_version_portfolio_image_idx" ON "_stylists_v_version_portfolio" USING btree ("image_id");
  CREATE INDEX "_stylists_v_parent_idx" ON "_stylists_v" USING btree ("parent_id");
  CREATE INDEX "_stylists_v_version_version_avatar_idx" ON "_stylists_v" USING btree ("version_avatar_id");
  CREATE INDEX "_stylists_v_version_version_slug_idx" ON "_stylists_v" USING btree ("version_slug");
  CREATE INDEX "_stylists_v_version_version_updated_at_idx" ON "_stylists_v" USING btree ("version_updated_at");
  CREATE INDEX "_stylists_v_version_version_created_at_idx" ON "_stylists_v" USING btree ("version_created_at");
  CREATE INDEX "_stylists_v_version_version__status_idx" ON "_stylists_v" USING btree ("version__status");
  CREATE INDEX "_stylists_v_created_at_idx" ON "_stylists_v" USING btree ("created_at");
  CREATE INDEX "_stylists_v_updated_at_idx" ON "_stylists_v" USING btree ("updated_at");
  CREATE INDEX "_stylists_v_latest_idx" ON "_stylists_v" USING btree ("latest");
  CREATE INDEX "_stylists_v_autosave_idx" ON "_stylists_v" USING btree ("autosave");
  CREATE INDEX "_stylists_v_rels_order_idx" ON "_stylists_v_rels" USING btree ("order");
  CREATE INDEX "_stylists_v_rels_parent_idx" ON "_stylists_v_rels" USING btree ("parent_id");
  CREATE INDEX "_stylists_v_rels_path_idx" ON "_stylists_v_rels" USING btree ("path");
  CREATE INDEX "_stylists_v_rels_beauty_services_id_idx" ON "_stylists_v_rels" USING btree ("beauty_services_id");
  CREATE INDEX "beauty_bookings_preferred_time_slots_order_idx" ON "beauty_bookings_preferred_time_slots" USING btree ("order");
  CREATE INDEX "beauty_bookings_preferred_time_slots_parent_idx" ON "beauty_bookings_preferred_time_slots" USING btree ("parent_id");
  CREATE INDEX "beauty_bookings_service_idx" ON "beauty_bookings" USING btree ("service_id");
  CREATE INDEX "beauty_bookings_stylist_idx" ON "beauty_bookings" USING btree ("stylist_id");
  CREATE INDEX "beauty_bookings_updated_at_idx" ON "beauty_bookings" USING btree ("updated_at");
  CREATE INDEX "beauty_bookings_created_at_idx" ON "beauty_bookings" USING btree ("created_at");
  CREATE INDEX "menu_items_allergens_order_idx" ON "menu_items_allergens" USING btree ("_order");
  CREATE INDEX "menu_items_allergens_parent_id_idx" ON "menu_items_allergens" USING btree ("_parent_id");
  CREATE INDEX "menu_items_image_idx" ON "menu_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "menu_items_slug_idx" ON "menu_items" USING btree ("slug");
  CREATE INDEX "menu_items_updated_at_idx" ON "menu_items" USING btree ("updated_at");
  CREATE INDEX "menu_items_created_at_idx" ON "menu_items" USING btree ("created_at");
  CREATE INDEX "menu_items__status_idx" ON "menu_items" USING btree ("_status");
  CREATE INDEX "_menu_items_v_version_allergens_order_idx" ON "_menu_items_v_version_allergens" USING btree ("_order");
  CREATE INDEX "_menu_items_v_version_allergens_parent_id_idx" ON "_menu_items_v_version_allergens" USING btree ("_parent_id");
  CREATE INDEX "_menu_items_v_parent_idx" ON "_menu_items_v" USING btree ("parent_id");
  CREATE INDEX "_menu_items_v_version_version_image_idx" ON "_menu_items_v" USING btree ("version_image_id");
  CREATE INDEX "_menu_items_v_version_version_slug_idx" ON "_menu_items_v" USING btree ("version_slug");
  CREATE INDEX "_menu_items_v_version_version_updated_at_idx" ON "_menu_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_menu_items_v_version_version_created_at_idx" ON "_menu_items_v" USING btree ("version_created_at");
  CREATE INDEX "_menu_items_v_version_version__status_idx" ON "_menu_items_v" USING btree ("version__status");
  CREATE INDEX "_menu_items_v_created_at_idx" ON "_menu_items_v" USING btree ("created_at");
  CREATE INDEX "_menu_items_v_updated_at_idx" ON "_menu_items_v" USING btree ("updated_at");
  CREATE INDEX "_menu_items_v_latest_idx" ON "_menu_items_v" USING btree ("latest");
  CREATE INDEX "_menu_items_v_autosave_idx" ON "_menu_items_v" USING btree ("autosave");
  CREATE INDEX "reservations_preferences_order_idx" ON "reservations_preferences" USING btree ("order");
  CREATE INDEX "reservations_preferences_parent_idx" ON "reservations_preferences" USING btree ("parent_id");
  CREATE INDEX "reservations_updated_at_idx" ON "reservations" USING btree ("updated_at");
  CREATE INDEX "reservations_created_at_idx" ON "reservations" USING btree ("created_at");
  CREATE INDEX "events_gallery_order_idx" ON "events_gallery" USING btree ("_order");
  CREATE INDEX "events_gallery_parent_id_idx" ON "events_gallery" USING btree ("_parent_id");
  CREATE INDEX "events_gallery_image_idx" ON "events_gallery" USING btree ("image_id");
  CREATE INDEX "events_tags_order_idx" ON "events_tags" USING btree ("_order");
  CREATE INDEX "events_tags_parent_id_idx" ON "events_tags" USING btree ("_parent_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_version_gallery_order_idx" ON "_events_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_events_v_version_gallery_parent_id_idx" ON "_events_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_gallery_image_idx" ON "_events_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_events_v_version_tags_order_idx" ON "_events_v_version_tags" USING btree ("_order");
  CREATE INDEX "_events_v_version_tags_parent_id_idx" ON "_events_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "meilisearch_settings_indexed_collections_order_idx" ON "meilisearch_settings_indexed_collections" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_indexed_collections_parent_id_idx" ON "meilisearch_settings_indexed_collections" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_searchable_fields_products_order_idx" ON "meilisearch_settings_searchable_fields_products" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_searchable_fields_products_parent_id_idx" ON "meilisearch_settings_searchable_fields_products" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_searchable_fields_blog_posts_order_idx" ON "meilisearch_settings_searchable_fields_blog_posts" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_searchable_fields_blog_posts_parent_id_idx" ON "meilisearch_settings_searchable_fields_blog_posts" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_searchable_fields_pages_order_idx" ON "meilisearch_settings_searchable_fields_pages" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_searchable_fields_pages_parent_id_idx" ON "meilisearch_settings_searchable_fields_pages" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_filterable_fields_products_order_idx" ON "meilisearch_settings_filterable_fields_products" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_filterable_fields_products_parent_id_idx" ON "meilisearch_settings_filterable_fields_products" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_filterable_fields_blog_posts_order_idx" ON "meilisearch_settings_filterable_fields_blog_posts" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_filterable_fields_blog_posts_parent_id_idx" ON "meilisearch_settings_filterable_fields_blog_posts" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_sortable_fields_products_order_idx" ON "meilisearch_settings_sortable_fields_products" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_sortable_fields_products_parent_id_idx" ON "meilisearch_settings_sortable_fields_products" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_sortable_fields_blog_posts_order_idx" ON "meilisearch_settings_sortable_fields_blog_posts" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_sortable_fields_blog_posts_parent_id_idx" ON "meilisearch_settings_sortable_fields_blog_posts" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_ranking_rules_order_idx" ON "meilisearch_settings_ranking_rules" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_ranking_rules_parent_id_idx" ON "meilisearch_settings_ranking_rules" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_custom_ranking_attributes_order_idx" ON "meilisearch_settings_custom_ranking_attributes" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_custom_ranking_attributes_parent_id_idx" ON "meilisearch_settings_custom_ranking_attributes" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_typo_tolerance_disable_on_words_order_idx" ON "meilisearch_settings_typo_tolerance_disable_on_words" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_typo_tolerance_disable_on_words_parent_id_idx" ON "meilisearch_settings_typo_tolerance_disable_on_words" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_synonyms_order_idx" ON "meilisearch_settings_synonyms" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_synonyms_parent_id_idx" ON "meilisearch_settings_synonyms" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_stop_words_order_idx" ON "meilisearch_settings_stop_words" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_stop_words_parent_id_idx" ON "meilisearch_settings_stop_words" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_exclude_patterns_order_idx" ON "meilisearch_settings_exclude_patterns" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_exclude_patterns_parent_id_idx" ON "meilisearch_settings_exclude_patterns" USING btree ("_parent_id");
  CREATE INDEX "meilisearch_settings_exclude_statuses_order_idx" ON "meilisearch_settings_exclude_statuses" USING btree ("_order");
  CREATE INDEX "meilisearch_settings_exclude_statuses_parent_id_idx" ON "meilisearch_settings_exclude_statuses" USING btree ("_parent_id");
  CREATE INDEX "chatbot_settings_suggested_questions_order_idx" ON "chatbot_settings_suggested_questions" USING btree ("_order");
  CREATE INDEX "chatbot_settings_suggested_questions_parent_id_idx" ON "chatbot_settings_suggested_questions" USING btree ("_parent_id");
  CREATE INDEX "chatbot_settings_rate_limiting_blocked_i_ps_order_idx" ON "chatbot_settings_rate_limiting_blocked_i_ps" USING btree ("_order");
  CREATE INDEX "chatbot_settings_rate_limiting_blocked_i_ps_parent_id_idx" ON "chatbot_settings_rate_limiting_blocked_i_ps" USING btree ("_parent_id");
  CREATE INDEX "chatbot_settings_moderation_blocked_keywords_order_idx" ON "chatbot_settings_moderation_blocked_keywords" USING btree ("_order");
  CREATE INDEX "chatbot_settings_moderation_blocked_keywords_parent_id_idx" ON "chatbot_settings_moderation_blocked_keywords" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_edition_notifications_fk" FOREIGN KEY ("edition_notifications_id") REFERENCES "public"."edition_notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ab_tests_fk" FOREIGN KEY ("ab_tests_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ab_test_results_fk" FOREIGN KEY ("ab_test_results_id") REFERENCES "public"."ab_test_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_practitioners_fk" FOREIGN KEY ("practitioners_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stylists_fk" FOREIGN KEY ("stylists_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_beauty_bookings_fk" FOREIGN KEY ("beauty_bookings_id") REFERENCES "public"."beauty_bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_fk" FOREIGN KEY ("reservations_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_edition_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("edition_notifications_id");
  CREATE INDEX "payload_locked_documents_rels_ab_tests_id_idx" ON "payload_locked_documents_rels" USING btree ("ab_tests_id");
  CREATE INDEX "payload_locked_documents_rels_ab_test_results_id_idx" ON "payload_locked_documents_rels" USING btree ("ab_test_results_id");
  CREATE INDEX "payload_locked_documents_rels_treatments_id_idx" ON "payload_locked_documents_rels" USING btree ("treatments_id");
  CREATE INDEX "payload_locked_documents_rels_practitioners_id_idx" ON "payload_locked_documents_rels" USING btree ("practitioners_id");
  CREATE INDEX "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");
  CREATE INDEX "payload_locked_documents_rels_beauty_services_id_idx" ON "payload_locked_documents_rels" USING btree ("beauty_services_id");
  CREATE INDEX "payload_locked_documents_rels_stylists_id_idx" ON "payload_locked_documents_rels" USING btree ("stylists_id");
  CREATE INDEX "payload_locked_documents_rels_beauty_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("beauty_bookings_id");
  CREATE INDEX "payload_locked_documents_rels_menu_items_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_items_id");
  CREATE INDEX "payload_locked_documents_rels_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "edition_notifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ab_tests_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ab_tests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ab_test_results" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "treatments_symptoms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "treatments_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "treatments_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "treatments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "treatments_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_treatments_v_version_symptoms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_treatments_v_version_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_treatments_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_treatments_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_treatments_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "practitioners_specializations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "practitioners_qualifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "practitioners_work_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "practitioners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "practitioners_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_practitioners_v_version_specializations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_practitioners_v_version_qualifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_practitioners_v_version_work_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_practitioners_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_practitioners_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "appointments_preferred_time" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "appointments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_services_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_services_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_services_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_services_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_services_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_beauty_services_v_version_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_beauty_services_v_version_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_beauty_services_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_beauty_services_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_beauty_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_beauty_services_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stylists_specialties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stylists_certifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stylists_work_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stylists_portfolio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stylists" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stylists_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stylists_v_version_specialties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stylists_v_version_certifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stylists_v_version_work_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stylists_v_version_portfolio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stylists_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stylists_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_bookings_preferred_time_slots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "beauty_bookings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items_allergens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_items_v_version_allergens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reservations_preferences" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reservations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_indexed_collections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_searchable_fields_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_searchable_fields_blog_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_searchable_fields_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_filterable_fields_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_filterable_fields_blog_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_sortable_fields_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_sortable_fields_blog_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_ranking_rules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_custom_ranking_attributes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_typo_tolerance_disable_on_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_synonyms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_stop_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_exclude_patterns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings_exclude_statuses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "meilisearch_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chatbot_settings_suggested_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chatbot_settings_rate_limiting_blocked_i_ps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chatbot_settings_moderation_blocked_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chatbot_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "edition_notifications" CASCADE;
  DROP TABLE "ab_tests_variants" CASCADE;
  DROP TABLE "ab_tests" CASCADE;
  DROP TABLE "ab_test_results" CASCADE;
  DROP TABLE "treatments_symptoms" CASCADE;
  DROP TABLE "treatments_process" CASCADE;
  DROP TABLE "treatments_gallery" CASCADE;
  DROP TABLE "treatments" CASCADE;
  DROP TABLE "treatments_rels" CASCADE;
  DROP TABLE "_treatments_v_version_symptoms" CASCADE;
  DROP TABLE "_treatments_v_version_process" CASCADE;
  DROP TABLE "_treatments_v_version_gallery" CASCADE;
  DROP TABLE "_treatments_v" CASCADE;
  DROP TABLE "_treatments_v_rels" CASCADE;
  DROP TABLE "practitioners_specializations" CASCADE;
  DROP TABLE "practitioners_qualifications" CASCADE;
  DROP TABLE "practitioners_work_days" CASCADE;
  DROP TABLE "practitioners" CASCADE;
  DROP TABLE "practitioners_rels" CASCADE;
  DROP TABLE "_practitioners_v_version_specializations" CASCADE;
  DROP TABLE "_practitioners_v_version_qualifications" CASCADE;
  DROP TABLE "_practitioners_v_version_work_days" CASCADE;
  DROP TABLE "_practitioners_v" CASCADE;
  DROP TABLE "_practitioners_v_rels" CASCADE;
  DROP TABLE "appointments_preferred_time" CASCADE;
  DROP TABLE "appointments" CASCADE;
  DROP TABLE "beauty_services_benefits" CASCADE;
  DROP TABLE "beauty_services_process" CASCADE;
  DROP TABLE "beauty_services_tags" CASCADE;
  DROP TABLE "beauty_services_gallery" CASCADE;
  DROP TABLE "beauty_services" CASCADE;
  DROP TABLE "beauty_services_rels" CASCADE;
  DROP TABLE "_beauty_services_v_version_benefits" CASCADE;
  DROP TABLE "_beauty_services_v_version_process" CASCADE;
  DROP TABLE "_beauty_services_v_version_tags" CASCADE;
  DROP TABLE "_beauty_services_v_version_gallery" CASCADE;
  DROP TABLE "_beauty_services_v" CASCADE;
  DROP TABLE "_beauty_services_v_rels" CASCADE;
  DROP TABLE "stylists_specialties" CASCADE;
  DROP TABLE "stylists_certifications" CASCADE;
  DROP TABLE "stylists_work_days" CASCADE;
  DROP TABLE "stylists_portfolio" CASCADE;
  DROP TABLE "stylists" CASCADE;
  DROP TABLE "stylists_rels" CASCADE;
  DROP TABLE "_stylists_v_version_specialties" CASCADE;
  DROP TABLE "_stylists_v_version_certifications" CASCADE;
  DROP TABLE "_stylists_v_version_work_days" CASCADE;
  DROP TABLE "_stylists_v_version_portfolio" CASCADE;
  DROP TABLE "_stylists_v" CASCADE;
  DROP TABLE "_stylists_v_rels" CASCADE;
  DROP TABLE "beauty_bookings_preferred_time_slots" CASCADE;
  DROP TABLE "beauty_bookings" CASCADE;
  DROP TABLE "menu_items_allergens" CASCADE;
  DROP TABLE "menu_items" CASCADE;
  DROP TABLE "_menu_items_v_version_allergens" CASCADE;
  DROP TABLE "_menu_items_v" CASCADE;
  DROP TABLE "reservations_preferences" CASCADE;
  DROP TABLE "reservations" CASCADE;
  DROP TABLE "events_gallery" CASCADE;
  DROP TABLE "events_tags" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v_version_gallery" CASCADE;
  DROP TABLE "_events_v_version_tags" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "meilisearch_settings_indexed_collections" CASCADE;
  DROP TABLE "meilisearch_settings_searchable_fields_products" CASCADE;
  DROP TABLE "meilisearch_settings_searchable_fields_blog_posts" CASCADE;
  DROP TABLE "meilisearch_settings_searchable_fields_pages" CASCADE;
  DROP TABLE "meilisearch_settings_filterable_fields_products" CASCADE;
  DROP TABLE "meilisearch_settings_filterable_fields_blog_posts" CASCADE;
  DROP TABLE "meilisearch_settings_sortable_fields_products" CASCADE;
  DROP TABLE "meilisearch_settings_sortable_fields_blog_posts" CASCADE;
  DROP TABLE "meilisearch_settings_ranking_rules" CASCADE;
  DROP TABLE "meilisearch_settings_custom_ranking_attributes" CASCADE;
  DROP TABLE "meilisearch_settings_typo_tolerance_disable_on_words" CASCADE;
  DROP TABLE "meilisearch_settings_synonyms" CASCADE;
  DROP TABLE "meilisearch_settings_stop_words" CASCADE;
  DROP TABLE "meilisearch_settings_exclude_patterns" CASCADE;
  DROP TABLE "meilisearch_settings_exclude_statuses" CASCADE;
  DROP TABLE "meilisearch_settings" CASCADE;
  DROP TABLE "chatbot_settings_suggested_questions" CASCADE;
  DROP TABLE "chatbot_settings_rate_limiting_blocked_i_ps" CASCADE;
  DROP TABLE "chatbot_settings_moderation_blocked_keywords" CASCADE;
  DROP TABLE "chatbot_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_edition_notifications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ab_tests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ab_test_results_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_treatments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_practitioners_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appointments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_beauty_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_stylists_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_beauty_bookings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_menu_items_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reservations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  DROP INDEX "payload_locked_documents_rels_edition_notifications_id_idx";
  DROP INDEX "payload_locked_documents_rels_ab_tests_id_idx";
  DROP INDEX "payload_locked_documents_rels_ab_test_results_id_idx";
  DROP INDEX "payload_locked_documents_rels_treatments_id_idx";
  DROP INDEX "payload_locked_documents_rels_practitioners_id_idx";
  DROP INDEX "payload_locked_documents_rels_appointments_id_idx";
  DROP INDEX "payload_locked_documents_rels_beauty_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_stylists_id_idx";
  DROP INDEX "payload_locked_documents_rels_beauty_bookings_id_idx";
  DROP INDEX "payload_locked_documents_rels_menu_items_id_idx";
  DROP INDEX "payload_locked_documents_rels_reservations_id_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  ALTER TABLE "theme" ALTER COLUMN "primary_color" SET DEFAULT '#00796B';
  ALTER TABLE "theme" ALTER COLUMN "background_color" SET DEFAULT '#ffffff';
  ALTER TABLE "theme" ALTER COLUMN "surface_color" SET DEFAULT '#f9fafb';
  ALTER TABLE "theme" ALTER COLUMN "border_color" SET DEFAULT '#e5e7eb';
  ALTER TABLE "products_variant_options_values" DROP COLUMN "subscription_type";
  ALTER TABLE "products_variant_options_values" DROP COLUMN "issues";
  ALTER TABLE "products_variant_options_values" DROP COLUMN "discount_percentage";
  ALTER TABLE "products_variant_options_values" DROP COLUMN "auto_renew";
  ALTER TABLE "products" DROP COLUMN "magazine_title";
  ALTER TABLE "products" DROP COLUMN "is_subscription";
  ALTER TABLE "subscription_plans" DROP COLUMN "allows_premium_content";
  ALTER TABLE "subscription_plans" DROP COLUMN "tier";
  ALTER TABLE "blog_posts" DROP COLUMN "content_type";
  ALTER TABLE "blog_posts" DROP COLUMN "content_access_access_level";
  ALTER TABLE "blog_posts" DROP COLUMN "content_access_preview_length";
  ALTER TABLE "blog_posts" DROP COLUMN "content_access_lock_message";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_content_type";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_content_access_access_level";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_content_access_preview_length";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_content_access_lock_message";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "edition_notifications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ab_tests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ab_test_results_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "treatments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "practitioners_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appointments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "beauty_services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stylists_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "beauty_bookings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "menu_items_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reservations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "theme" DROP COLUMN "primary_light";
  ALTER TABLE "theme" DROP COLUMN "primary_glow";
  ALTER TABLE "theme" DROP COLUMN "secondary_light";
  ALTER TABLE "theme" DROP COLUMN "grey_light";
  ALTER TABLE "theme" DROP COLUMN "grey_mid";
  ALTER TABLE "theme" DROP COLUMN "grey_dark";
  DROP TYPE "public"."chatbot_kb_search_collections";
  DROP TYPE "public"."enum_products_variant_options_values_subscription_type";
  DROP TYPE "public"."enum_subscription_plans_tier";
  DROP TYPE "public"."enum_ab_tests_target_page";
  DROP TYPE "public"."enum_ab_tests_status";
  DROP TYPE "public"."enum_blog_posts_content_type";
  DROP TYPE "public"."enum_blog_posts_content_access_access_level";
  DROP TYPE "public"."enum__blog_posts_v_version_content_type";
  DROP TYPE "public"."enum__blog_posts_v_version_content_access_access_level";
  DROP TYPE "public"."enum_treatments_category";
  DROP TYPE "public"."enum_treatments_insurance";
  DROP TYPE "public"."enum_treatments_status";
  DROP TYPE "public"."enum__treatments_v_version_category";
  DROP TYPE "public"."enum__treatments_v_version_insurance";
  DROP TYPE "public"."enum__treatments_v_version_status";
  DROP TYPE "public"."enum_practitioners_work_days";
  DROP TYPE "public"."enum_practitioners_role";
  DROP TYPE "public"."enum_practitioners_availability";
  DROP TYPE "public"."enum_practitioners_status";
  DROP TYPE "public"."enum__practitioners_v_version_work_days";
  DROP TYPE "public"."enum__practitioners_v_version_role";
  DROP TYPE "public"."enum__practitioners_v_version_availability";
  DROP TYPE "public"."enum__practitioners_v_version_status";
  DROP TYPE "public"."enum_appointments_preferred_time";
  DROP TYPE "public"."enum_appointments_insurance";
  DROP TYPE "public"."enum_appointments_treatment";
  DROP TYPE "public"."enum_appointments_has_referral";
  DROP TYPE "public"."enum_appointments_type";
  DROP TYPE "public"."enum_appointments_status";
  DROP TYPE "public"."enum_beauty_services_tags";
  DROP TYPE "public"."enum_beauty_services_category";
  DROP TYPE "public"."enum_beauty_services_status";
  DROP TYPE "public"."enum__beauty_services_v_version_tags";
  DROP TYPE "public"."enum__beauty_services_v_version_category";
  DROP TYPE "public"."enum__beauty_services_v_version_status";
  DROP TYPE "public"."enum_stylists_work_days";
  DROP TYPE "public"."enum_stylists_role";
  DROP TYPE "public"."enum_stylists_availability";
  DROP TYPE "public"."enum_stylists_status";
  DROP TYPE "public"."enum__stylists_v_version_work_days";
  DROP TYPE "public"."enum__stylists_v_version_role";
  DROP TYPE "public"."enum__stylists_v_version_availability";
  DROP TYPE "public"."enum__stylists_v_version_status";
  DROP TYPE "public"."enum_beauty_bookings_preferred_time_slots";
  DROP TYPE "public"."enum_beauty_bookings_status";
  DROP TYPE "public"."enum_menu_items_allergens_allergen";
  DROP TYPE "public"."enum_menu_items_category";
  DROP TYPE "public"."enum_menu_items_status";
  DROP TYPE "public"."enum__menu_items_v_version_allergens_allergen";
  DROP TYPE "public"."enum__menu_items_v_version_category";
  DROP TYPE "public"."enum__menu_items_v_version_status";
  DROP TYPE "public"."enum_reservations_preferences";
  DROP TYPE "public"."enum_reservations_occasion";
  DROP TYPE "public"."enum_reservations_status";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_event_type";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_meilisearch_settings_indexed_collections_collection";
  DROP TYPE "public"."enum_meilisearch_settings_searchable_fields_products_field";
  DROP TYPE "public"."enum_meilisearch_settings_searchable_fields_blog_posts_field";
  DROP TYPE "public"."enum_meilisearch_settings_searchable_fields_pages_field";
  DROP TYPE "public"."enum_meilisearch_settings_filterable_fields_products_field";
  DROP TYPE "public"."enum_meilisearch_settings_filterable_fields_blog_posts_field";
  DROP TYPE "public"."enum_meilisearch_settings_sortable_fields_products_field";
  DROP TYPE "public"."enum_meilisearch_settings_sortable_fields_blog_posts_field";
  DROP TYPE "public"."enum_meilisearch_settings_ranking_rules_rule";
  DROP TYPE "public"."enum_meilisearch_settings_custom_ranking_attributes_order";
  DROP TYPE "public"."enum_meilisearch_settings_exclude_patterns_type";
  DROP TYPE "public"."enum_meilisearch_settings_exclude_statuses_status";
  DROP TYPE "public"."enum_chatbot_settings_model";
  DROP TYPE "public"."enum_chatbot_settings_position";
  DROP TYPE "public"."enum_chatbot_settings_button_icon";`)
}

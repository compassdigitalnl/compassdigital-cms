import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ============================================================================
  // BASELINE MIGRATION - SAFETY CHECK
  // ============================================================================
  // This is the baseline schema migration generated from the current codebase.
  // It creates ALL tables/columns/indexes from scratch.
  //
  // IMPORTANT: This migration should only run on EMPTY databases (new clients).
  // For existing deployments (like Plastimed), the tables already exist.
  //
  // Safety check: Skip this migration if tables already exist
  // ============================================================================

  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      ) as table_exists
    `)

    // @ts-ignore - Result structure varies by adapter
    const tableExists = result?.rows?.[0]?.table_exists || result?.[0]?.table_exists

    if (tableExists) {
      console.log('[Migration] Baseline schema: Tables already exist (existing deployment)')
      console.log('[Migration] Skipping baseline migration to prevent errors')
      return
    }

    console.log('[Migration] Baseline schema: Empty database detected, running full schema migration...')
  } catch (error) {
    console.warn('[Migration] Could not check for existing tables:', error)
    console.warn('[Migration] Proceeding with migration anyway...')
  }

  // ============================================================================
  // FULL SCHEMA MIGRATION - Only runs if database is empty
  // ============================================================================

  await db.execute(sql`
   CREATE TYPE "public"."enum_users_addresses_type" AS ENUM('shipping', 'billing', 'both');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_users_account_type" AS ENUM('individual', 'b2b');
  CREATE TYPE "public"."enum_users_company_branch" AS ENUM('healthcare', 'hospitality', 'construction', 'industry', 'education', 'business_services', 'retail', 'logistics', 'other');
  CREATE TYPE "public"."enum_users_client_type" AS ENUM('website', 'webshop');
  CREATE TYPE "public"."enum_pages_blocks_spacer_height" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_pages_blocks_hero_style" AS ENUM('default', 'image', 'gradient', 'minimal');
  CREATE TYPE "public"."enum_pages_blocks_hero_layout" AS ENUM('centered', 'two-column');
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
  CREATE TYPE "public"."enum_pages_blocks_features_background_style" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_features_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_features_category" AS ENUM('all', 'algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps');
  CREATE TYPE "public"."enum_pages_blocks_features_layout" AS ENUM('horizontal', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum_pages_blocks_features_style" AS ENUM('cards', 'clean', 'trust-bar');
  CREATE TYPE "public"."enum_pages_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('full-width', 'card');
  CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_layout" AS ENUM('carousel', 'grid-2', 'grid-3');
  CREATE TYPE "public"."enum_pages_blocks_cases_source" AS ENUM('featured', 'manual', 'latest');
  CREATE TYPE "public"."enum_pages_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum_pages_blocks_logo_bar_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_logo_bar_category" AS ENUM('all', 'klant', 'partner', 'leverancier', 'certificering', 'media');
  CREATE TYPE "public"."enum_pages_blocks_logo_bar_display_mode" AS ENUM('image', 'text');
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
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_height" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style" AS ENUM('default', 'image', 'gradient', 'minimal');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_layout" AS ENUM('centered', 'two-column');
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
  CREATE TYPE "public"."enum__pages_v_blocks_features_background_style" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_features_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_features_category" AS ENUM('all', 'algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps');
  CREATE TYPE "public"."enum__pages_v_blocks_features_layout" AS ENUM('horizontal', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum__pages_v_blocks_features_style" AS ENUM('cards', 'clean', 'trust-bar');
  CREATE TYPE "public"."enum__pages_v_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('full-width', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_layout" AS ENUM('carousel', 'grid-2', 'grid-3');
  CREATE TYPE "public"."enum__pages_v_blocks_cases_source" AS ENUM('featured', 'manual', 'latest');
  CREATE TYPE "public"."enum__pages_v_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_category" AS ENUM('all', 'klant', 'partner', 'leverancier', 'certificering', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_display_mode" AS ENUM('image', 'text');
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
  CREATE TYPE "public"."enum_blog_posts_featured_tag" AS ENUM('none', 'guide', 'new', 'featured', 'tip', 'news');
  CREATE TYPE "public"."enum_blog_posts_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_version_featured_tag" AS ENUM('none', 'guide', 'new', 'featured', 'tip', 'news');
  CREATE TYPE "public"."enum__blog_posts_v_version_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3');
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_categories_icon" AS ENUM('BookOpen', 'Lightbulb', 'Sparkles', 'Stethoscope', 'ShieldCheck', 'Newspaper', 'GraduationCap', 'Microscope', 'Settings', 'TrendingUp', 'Target', 'Wrench');
  CREATE TYPE "public"."enum_blog_categories_color" AS ENUM('teal', 'blue', 'green', 'coral', 'purple', 'amber', 'pink');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('algemeen', 'producten', 'verzending', 'retourneren', 'betaling', 'account', 'support', 'overig');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_cases_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_services_icon_type" AS ENUM('lucide', 'upload');
  CREATE TYPE "public"."enum_services_category" AS ENUM('algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps');
  CREATE TYPE "public"."enum_services_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_partners_category" AS ENUM('klant', 'partner', 'leverancier', 'certificering', 'media');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_products_videos_platform" AS ENUM('youtube', 'vimeo', 'custom');
  CREATE TYPE "public"."enum_products_product_type" AS ENUM('simple', 'grouped');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published', 'sold-out', 'archived');
  CREATE TYPE "public"."enum_products_condition" AS ENUM('new', 'refurbished', 'used');
  CREATE TYPE "public"."enum_products_badge" AS ENUM('none', 'new', 'sale', 'popular', 'sold-out');
  CREATE TYPE "public"."enum_products_tax_class" AS ENUM('standard', 'reduced', 'zero');
  CREATE TYPE "public"."enum_products_stock_status" AS ENUM('in-stock', 'out-of-stock', 'on-backorder', 'discontinued');
  CREATE TYPE "public"."enum_products_weight_unit" AS ENUM('kg', 'g');
  CREATE TYPE "public"."enum_customer_groups_type" AS ENUM('b2c', 'b2b');
  CREATE TYPE "public"."enum_order_lists_icon" AS ENUM('clipboard-list', 'repeat', 'stethoscope', 'flask-conical', 'plus-circle', 'building-2', 'package');
  CREATE TYPE "public"."enum_order_lists_color" AS ENUM('teal', 'blue', 'amber', 'green');
  CREATE TYPE "public"."enum_orders_timeline_event" AS ENUM('order_placed', 'payment_received', 'processing', 'invoice_generated', 'shipped', 'in_transit', 'delivered', 'cancelled', 'return_requested', 'refunded', 'note_added');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'banktransfer');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_orders_shipping_provider" AS ENUM('postnl', 'dhl', 'dpd', 'ups', 'transmission', 'own', 'pickup');
  CREATE TYPE "public"."enum_orders_shipping_method" AS ENUM('standard', 'express', 'same_day', 'pickup');
  CREATE TYPE "public"."enum_invoices_status" AS ENUM('open', 'paid', 'overdue', 'cancelled', 'credit_note');
  CREATE TYPE "public"."enum_invoices_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'banktransfer', 'direct_debit');
  CREATE TYPE "public"."enum_recurring_orders_status" AS ENUM('active', 'paused', 'cancelled', 'expired');
  CREATE TYPE "public"."enum_recurring_orders_frequency_unit" AS ENUM('days', 'weeks', 'months');
  CREATE TYPE "public"."enum_recurring_orders_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'direct_debit');
  CREATE TYPE "public"."enum_returns_status" AS ENUM('pending', 'approved', 'rejected', 'label_sent', 'received', 'inspecting', 'refunded', 'replaced', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_returns_return_reason" AS ENUM('wrong_product', 'wrong_size', 'damaged', 'not_expected', 'duplicate', 'other');
  CREATE TYPE "public"."enum_returns_product_condition" AS ENUM('unopened', 'opened', 'damaged');
  CREATE TYPE "public"."enum_returns_preferred_resolution" AS ENUM('replacement', 'refund', 'store_credit', 'exchange');
  CREATE TYPE "public"."enum_returns_refund_method" AS ENUM('original', 'bank_transfer', 'store_credit');
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('order_shipped', 'order_delivered', 'order_cancelled', 'invoice_available', 'invoice_overdue', 'payment_reminder', 'stock_alert', 'price_change', 'recurring_order_reminder', 'recurring_order_processed', 'return_approved', 'return_rejected', 'return_received', 'refund_processed', 'system', 'account_update');
  CREATE TYPE "public"."enum_notifications_category" AS ENUM('all', 'orders', 'stock', 'system');
  CREATE TYPE "public"."enum_notifications_icon" AS ENUM('bell', 'truck', 'check-circle', 'package', 'file-text', 'repeat', 'rotate-ccw', 'banknote', 'alert-circle', 'settings', 'user');
  CREATE TYPE "public"."enum_notifications_icon_color" AS ENUM('green', 'teal', 'blue', 'amber', 'coral', 'grey');
  CREATE TYPE "public"."enum_notifications_priority" AS ENUM('low', 'normal', 'high', 'urgent');
  CREATE TYPE "public"."enum_recently_viewed_source" AS ENUM('direct', 'search', 'category', 'related', 'recently_viewed', 'recommendations', 'external');
  CREATE TYPE "public"."enum_recently_viewed_device" AS ENUM('desktop', 'mobile', 'tablet');
  CREATE TYPE "public"."enum_vendors_certifications_icon" AS ENUM('shield-check', 'award', 'leaf', 'star', 'check-circle');
  CREATE TYPE "public"."enum_workshops_target_audience" AS ENUM('nurses', 'doctors', 'care-workers', 'pharmacists', 'management');
  CREATE TYPE "public"."enum_workshops_location_type" AS ENUM('physical', 'online', 'hybrid');
  CREATE TYPE "public"."enum_workshops_category" AS ENUM('wondverzorging', 'handygiene', 'diagnostiek', 'sterilisatie', 'product-training', 'algemeen');
  CREATE TYPE "public"."enum_workshops_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TYPE "public"."enum_workshops_status" AS ENUM('upcoming', 'open', 'almost-full', 'full', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_client_requests_website_pages" AS ENUM('home', 'about', 'services', 'portfolio', 'blog', 'faq', 'contact');
  CREATE TYPE "public"."enum_client_requests_payment_methods" AS ENUM('ideal', 'creditcard', 'invoice', 'banktransfer', 'paypal');
  CREATE TYPE "public"."enum_client_requests_status" AS ENUM('pending', 'reviewing', 'approved', 'rejected');
  CREATE TYPE "public"."enum_client_requests_site_type" AS ENUM('website', 'webshop');
  CREATE TYPE "public"."enum_client_requests_expected_products" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('pending', 'provisioning', 'deploying', 'active', 'failed', 'suspended', 'archived');
  CREATE TYPE "public"."enum_clients_plan" AS ENUM('free', 'starter', 'professional', 'enterprise');
  CREATE TYPE "public"."enum_clients_template" AS ENUM('ecommerce', 'blog', 'b2b', 'portfolio', 'corporate');
  CREATE TYPE "public"."enum_clients_deployment_provider" AS ENUM('ploi', 'custom');
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
  CREATE TYPE "public"."enum_settings_default_product_template" AS ENUM('template1', 'template2', 'template3');
  CREATE TYPE "public"."enum_settings_default_blog_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3');
  CREATE TYPE "public"."enum_settings_default_shop_archive_template" AS ENUM('shoparchivetemplate1');
  CREATE TYPE "public"."enum_settings_default_cart_template" AS ENUM('carttemplate1');
  CREATE TYPE "public"."enum_settings_default_checkout_template" AS ENUM('checkouttemplate1');
  CREATE TYPE "public"."enum_settings_default_my_account_template" AS ENUM('myaccounttemplate1');
  CREATE TYPE "public"."enum_theme_font_scale" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_theme_border_radius" AS ENUM('none', 'sm', 'md', 'lg', 'xl', 'full');
  CREATE TYPE "public"."enum_theme_spacing" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_theme_container_width" AS ENUM('lg', 'xl', '2xl', '7xl');
  CREATE TYPE "public"."enum_theme_shadow_size" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_header_top_bar_left_messages_icon" AS ENUM('', 'BadgeCheck', 'Truck', 'Shield', 'Award', 'Phone', 'Mail', 'Clock', 'MapPin', 'CheckCircle', 'CreditCard', 'Lock', 'Zap', 'Gift', 'RefreshCw', 'Users');
  CREATE TYPE "public"."enum_header_custom_buttons_icon" AS ENUM('', 'Phone', 'Mail', 'MapPin', 'ShoppingCart', 'User', 'Clipboard', 'CreditCard', 'Search');
  CREATE TYPE "public"."enum_header_custom_buttons_style" AS ENUM('default', 'primary', 'secondary');
  CREATE TYPE "public"."enum_header_navigation_special_items_icon" AS ENUM('', 'Flame', 'Star', 'Gift', 'Sparkles', 'Package', 'Tag', 'Truck', 'Zap');
  CREATE TYPE "public"."enum_header_navigation_special_items_position" AS ENUM('start', 'end');
  CREATE TYPE "public"."enum_header_navigation_items_icon" AS ENUM('', 'Package', 'Building2', 'Users', 'Award', 'FileText', 'ShoppingCart', 'Mail', 'Phone', 'Home');
  CREATE TYPE "public"."enum_header_navigation_items_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_header_alert_bar_type" AS ENUM('info', 'success', 'warning', 'error', 'promo');
  CREATE TYPE "public"."enum_header_alert_bar_icon" AS ENUM('', 'BadgeCheck', 'Truck', 'Award', 'Gift', 'Zap', 'AlertCircle', 'Info', 'CheckCircle', 'Bell', 'Megaphone');
  CREATE TYPE "public"."enum_header_navigation_mode" AS ENUM('manual', 'categories', 'hybrid');
  CREATE TYPE "public"."enum_header_navigation_category_settings_mega_menu_style" AS ENUM('subcategories', 'with-products', 'full');
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
  
  CREATE TABLE "users_favorites" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"added_at" timestamp(3) with time zone
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
  	"company_branch" "enum_users_company_branch",
  	"company_website" varchar,
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
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" "enum_pages_blocks_spacer_height" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_hero_style" DEFAULT 'default',
  	"layout" "enum_pages_blocks_hero_layout" DEFAULT 'centered',
  	"section_label" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"title_accent" varchar,
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
  	"section_label" varchar,
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
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze categorieën',
  	"intro" varchar,
  	"source" "enum_pages_blocks_category_grid_source" DEFAULT 'auto',
  	"show_icon" boolean DEFAULT true,
  	"show_product_count" boolean DEFAULT true,
  	"layout" "enum_pages_blocks_category_grid_layout" DEFAULT 'grid-3',
  	"limit" numeric DEFAULT 10,
  	"show_quick_order_card" boolean DEFAULT false,
  	"quick_order_link" varchar DEFAULT '/quick-order',
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
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze diensten',
  	"intro" varchar,
  	"background_style" "enum_pages_blocks_features_background_style" DEFAULT 'light',
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
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'full-width',
  	"title" varchar,
  	"text" varchar,
  	"button_text" varchar DEFAULT 'Neem contact op',
  	"button_link" varchar DEFAULT '/contact',
  	"secondary_button_text" varchar,
  	"secondary_button_link" varchar,
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
  	"photo_id" integer,
  	"source" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
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
  	"display_mode" "enum_pages_blocks_logo_bar_display_mode" DEFAULT 'image',
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
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" "enum__pages_v_blocks_spacer_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_hero_style" DEFAULT 'default',
  	"layout" "enum__pages_v_blocks_hero_layout" DEFAULT 'centered',
  	"section_label" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"title_accent" varchar,
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
  	"section_label" varchar,
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
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze categorieën',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_category_grid_source" DEFAULT 'auto',
  	"show_icon" boolean DEFAULT true,
  	"show_product_count" boolean DEFAULT true,
  	"layout" "enum__pages_v_blocks_category_grid_layout" DEFAULT 'grid-3',
  	"limit" numeric DEFAULT 10,
  	"show_quick_order_card" boolean DEFAULT false,
  	"quick_order_link" varchar DEFAULT '/quick-order',
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
  	"section_label" varchar,
  	"heading" varchar DEFAULT 'Onze diensten',
  	"intro" varchar,
  	"background_style" "enum__pages_v_blocks_features_background_style" DEFAULT 'light',
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
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'full-width',
  	"title" varchar,
  	"text" varchar,
  	"button_text" varchar DEFAULT 'Neem contact op',
  	"button_link" varchar DEFAULT '/contact',
  	"secondary_button_text" varchar,
  	"secondary_button_link" varchar,
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
  	"source" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
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
  	"display_mode" "enum__pages_v_blocks_logo_bar_display_mode" DEFAULT 'image',
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
  
  CREATE TABLE "blog_posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "blog_posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"featured_image_emoji" varchar,
  	"featured_tag" "enum_blog_posts_featured_tag" DEFAULT 'none',
  	"content" jsonb,
  	"author_id" integer,
  	"author_bio" varchar,
  	"reading_time" numeric,
  	"view_count" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"template" "enum_blog_posts_template" DEFAULT 'blogtemplate1',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"enable_t_o_c" boolean DEFAULT true,
  	"enable_share" boolean DEFAULT true,
  	"enable_comments" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"status" "enum_blog_posts_status" DEFAULT 'draft',
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
  	"blog_categories_id" integer,
  	"products_id" integer,
  	"blog_posts_id" integer
  );
  
  CREATE TABLE "_blog_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_featured_image_emoji" varchar,
  	"version_featured_tag" "enum__blog_posts_v_version_featured_tag" DEFAULT 'none',
  	"version_content" jsonb,
  	"version_author_id" integer,
  	"version_author_bio" varchar,
  	"version_reading_time" numeric,
  	"version_view_count" numeric DEFAULT 0,
  	"version_featured" boolean DEFAULT false,
  	"version_template" "enum__blog_posts_v_version_template" DEFAULT 'blogtemplate1',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_enable_t_o_c" boolean DEFAULT true,
  	"version_enable_share" boolean DEFAULT true,
  	"version_enable_comments" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
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
  	"blog_categories_id" integer,
  	"products_id" integer,
  	"blog_posts_id" integer
  );
  
  CREATE TABLE "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"description" varchar,
  	"icon" "enum_blog_categories_icon" DEFAULT 'BookOpen',
  	"color" "enum_blog_categories_color" DEFAULT 'teal',
  	"image_id" integer,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"icon" varchar,
  	"show_in_navigation" boolean DEFAULT true,
  	"navigation_order" numeric DEFAULT 0,
  	"promo_banner_enabled" boolean DEFAULT false,
  	"promo_banner_title" varchar,
  	"promo_banner_subtitle" varchar,
  	"promo_banner_image_id" integer,
  	"promo_banner_button_text" varchar,
  	"promo_banner_button_link" varchar,
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
  
  CREATE TABLE "products_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "products_group_prices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group_id" integer NOT NULL,
  	"price" numeric NOT NULL,
  	"min_quantity" numeric DEFAULT 1
  );
  
  CREATE TABLE "products_volume_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"min_quantity" numeric NOT NULL,
  	"max_quantity" numeric,
  	"price" numeric NOT NULL,
  	"discount_percentage" numeric
  );
  
  CREATE TABLE "products_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"platform" "enum_products_videos_platform" DEFAULT 'youtube'
  );
  
  CREATE TABLE "products_child_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"is_default" boolean DEFAULT false
  );
  
  CREATE TABLE "products_meta_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "products_specifications_attributes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"unit" varchar
  );
  
  CREATE TABLE "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"product_type" "enum_products_product_type" DEFAULT 'simple' NOT NULL,
  	"sku" varchar,
  	"ean" varchar,
  	"mpn" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"brand_id" integer,
  	"manufacturer" varchar,
  	"status" "enum_products_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"condition" "enum_products_condition" DEFAULT 'new',
  	"warranty" varchar,
  	"release_date" timestamp(3) with time zone,
  	"badge" "enum_products_badge" DEFAULT 'none',
  	"price" numeric NOT NULL,
  	"sale_price" numeric,
  	"compare_at_price" numeric,
  	"cost_price" numeric,
  	"msrp" numeric,
  	"tax_class" "enum_products_tax_class" DEFAULT 'standard',
  	"includes_tax" boolean DEFAULT false,
  	"track_stock" boolean DEFAULT true,
  	"stock" numeric DEFAULT 0,
  	"stock_status" "enum_products_stock_status" DEFAULT 'in-stock',
  	"low_stock_threshold" numeric DEFAULT 5,
  	"backorders_allowed" boolean DEFAULT false,
  	"availability_date" timestamp(3) with time zone,
  	"weight" numeric,
  	"weight_unit" "enum_products_weight_unit" DEFAULT 'kg',
  	"dimensions_length" numeric,
  	"dimensions_width" numeric,
  	"dimensions_height" numeric,
  	"shipping_class" varchar,
  	"free_shipping" boolean DEFAULT false,
  	"min_order_quantity" numeric,
  	"max_order_quantity" numeric,
  	"order_multiple" numeric,
  	"lead_time" numeric,
  	"customizable" boolean DEFAULT false,
  	"quotation_required" boolean DEFAULT false,
  	"contract_pricing" boolean DEFAULT false,
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
  	"product_categories_id" integer,
  	"media_id" integer,
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
  	"icon" "enum_order_lists_icon" DEFAULT 'clipboard-list',
  	"color" "enum_order_lists_color" DEFAULT 'teal',
  	"is_pinned" boolean DEFAULT false,
  	"owner_id" integer NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"item_count" numeric,
  	"description" varchar,
  	"notes" varchar,
  	"last_ordered_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"sku" varchar,
  	"ean" varchar,
  	"parent_product_id" varchar,
  	"parent_product_title" varchar,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"price" numeric NOT NULL,
  	"subtotal" numeric
  );
  
  CREATE TABLE "orders_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event" "enum_orders_timeline_event" NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"location" varchar
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
  	"shipping_provider" "enum_orders_shipping_provider",
  	"tracking_code" varchar,
  	"tracking_url" varchar,
  	"shipping_method" "enum_orders_shipping_method" DEFAULT 'standard',
  	"expected_delivery_date" timestamp(3) with time zone,
  	"actual_delivery_date" timestamp(3) with time zone,
  	"notes" varchar,
  	"invoice_p_d_f_id" integer,
  	"invoice_number" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "invoices_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar NOT NULL,
  	"sku" varchar,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"line_total" numeric
  );
  
  CREATE TABLE "invoices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"invoice_number" varchar NOT NULL,
  	"order_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"invoice_date" timestamp(3) with time zone NOT NULL,
  	"due_date" timestamp(3) with time zone NOT NULL,
  	"payment_date" timestamp(3) with time zone,
  	"subtotal" numeric NOT NULL,
  	"tax" numeric DEFAULT 0,
  	"shipping_cost" numeric DEFAULT 0,
  	"discount" numeric DEFAULT 0,
  	"amount" numeric NOT NULL,
  	"status" "enum_invoices_status" DEFAULT 'open' NOT NULL,
  	"payment_method" "enum_invoices_payment_method",
  	"payment_reference" varchar,
  	"pdf_file_id" integer,
  	"notes" varchar,
  	"reminders_sent" numeric DEFAULT 0,
  	"last_reminder_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "recurring_orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"title" varchar,
  	"sku" varchar,
  	"brand" varchar,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"price" numeric NOT NULL,
  	"line_total" numeric
  );
  
  CREATE TABLE "recurring_orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference_number" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"status" "enum_recurring_orders_status" DEFAULT 'active' NOT NULL,
  	"frequency_value" numeric DEFAULT 1 NOT NULL,
  	"frequency_unit" "enum_recurring_orders_frequency_unit" DEFAULT 'weeks' NOT NULL,
  	"frequency_display_text" varchar,
  	"next_delivery_date" timestamp(3) with time zone NOT NULL,
  	"last_delivery_date" timestamp(3) with time zone,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"paused_date" timestamp(3) with time zone,
  	"estimated_total" numeric NOT NULL,
  	"delivery_count" numeric DEFAULT 0,
  	"total_spent" numeric DEFAULT 0,
  	"savings_per_delivery" numeric DEFAULT 0,
  	"shipping_address_name" varchar NOT NULL,
  	"shipping_address_company" varchar,
  	"shipping_address_street" varchar NOT NULL,
  	"shipping_address_house_number" varchar NOT NULL,
  	"shipping_address_postal_code" varchar NOT NULL,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_country" varchar DEFAULT 'Nederland',
  	"payment_method" "enum_recurring_orders_payment_method",
  	"notes" varchar,
  	"notify_before_delivery" boolean DEFAULT true,
  	"notify_days_before" numeric DEFAULT 2,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "recurring_orders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"orders_id" integer
  );
  
  CREATE TABLE "returns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"title" varchar NOT NULL,
  	"sku" varchar,
  	"brand" varchar,
  	"unit_price" numeric NOT NULL,
  	"quantity_ordered" numeric NOT NULL,
  	"quantity_returning" numeric NOT NULL,
  	"is_returnable" boolean DEFAULT true,
  	"return_value" numeric
  );
  
  CREATE TABLE "returns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"rma_number" varchar NOT NULL,
  	"order_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"status" "enum_returns_status" DEFAULT 'pending' NOT NULL,
  	"return_deadline" timestamp(3) with time zone,
  	"received_date" timestamp(3) with time zone,
  	"processed_date" timestamp(3) with time zone,
  	"return_reason" "enum_returns_return_reason" NOT NULL,
  	"reason_description" varchar,
  	"product_condition" "enum_returns_product_condition" NOT NULL,
  	"preferred_resolution" "enum_returns_preferred_resolution" NOT NULL,
  	"return_shipping_tracking_code" varchar,
  	"return_shipping_tracking_url" varchar,
  	"return_shipping_return_label_generated" boolean DEFAULT false,
  	"return_shipping_return_label_sent_date" timestamp(3) with time zone,
  	"return_shipping_shipping_cost_refund" numeric DEFAULT 0,
  	"return_value" numeric NOT NULL,
  	"refund_amount" numeric DEFAULT 0,
  	"refund_date" timestamp(3) with time zone,
  	"refund_method" "enum_returns_refund_method",
  	"inspection_notes" varchar,
  	"internal_notes" varchar,
  	"approval_date" timestamp(3) with time zone,
  	"rejection_reason" varchar,
  	"replacement_order_id" integer,
  	"store_credit_amount" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "returns_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_notifications_type" NOT NULL,
  	"category" "enum_notifications_category" DEFAULT 'all' NOT NULL,
  	"title" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"is_read" boolean DEFAULT false,
  	"read_at" timestamp(3) with time zone,
  	"related_order_id" integer,
  	"related_product_id" integer,
  	"related_invoice_id" integer,
  	"related_recurring_order_id" integer,
  	"related_return_id" integer,
  	"action_url" varchar,
  	"action_label" varchar,
  	"icon" "enum_notifications_icon" DEFAULT 'bell',
  	"icon_color" "enum_notifications_icon_color" DEFAULT 'teal',
  	"priority" "enum_notifications_priority" DEFAULT 'normal',
  	"expires_at" timestamp(3) with time zone,
  	"send_email" boolean DEFAULT false,
  	"email_sent" boolean DEFAULT false,
  	"email_sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "recently_viewed" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"session_id" varchar,
  	"product_id" integer NOT NULL,
  	"viewed_at" timestamp(3) with time zone NOT NULL,
  	"product_snapshot_title" varchar,
  	"product_snapshot_slug" varchar,
  	"product_snapshot_sku" varchar,
  	"product_snapshot_price" numeric,
  	"product_snapshot_image_url" varchar,
  	"product_snapshot_brand" varchar,
  	"referrer" varchar,
  	"source" "enum_recently_viewed_source",
  	"device" "enum_recently_viewed_device",
  	"time_on_page" numeric,
  	"scroll_depth" numeric,
  	"added_to_cart" boolean DEFAULT false,
  	"added_to_favorites" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vendors_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"icon" "enum_vendors_certifications_icon"
  );
  
  CREATE TABLE "vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_name" varchar,
  	"tagline" varchar,
  	"description" jsonb,
  	"logo_id" integer,
  	"banner_id" integer,
  	"banner_color" varchar,
  	"is_verified" boolean DEFAULT false,
  	"is_premium" boolean DEFAULT false,
  	"is_featured" boolean DEFAULT false,
  	"contact_website" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_address" varchar,
  	"contact_country" varchar,
  	"stats_product_count" numeric,
  	"stats_rating" numeric,
  	"stats_review_count" numeric,
  	"stats_established_year" numeric,
  	"delivery_delivery_time" varchar,
  	"delivery_free_shipping_from" numeric,
  	"delivery_offers_workshops" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vendors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "vendor_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vendor_id" integer NOT NULL,
  	"title" varchar,
  	"rating" numeric NOT NULL,
  	"comment" varchar NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_email" varchar,
  	"author_company" varchar,
  	"author_initials" varchar,
  	"is_approved" boolean DEFAULT false,
  	"is_verified_purchase" boolean DEFAULT false,
  	"moderation_notes" varchar,
  	"helpful_count" numeric DEFAULT 0,
  	"vendor_response_text" varchar,
  	"vendor_response_responded_at" timestamp(3) with time zone,
  	"review_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "workshops_target_audience" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_workshops_target_audience",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "workshops_learning_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"objective" varchar NOT NULL
  );
  
  CREATE TABLE "workshops" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"emoji" varchar,
  	"vendor_id" integer,
  	"instructor" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"duration" numeric,
  	"duration_display" varchar,
  	"location_type" "enum_workshops_location_type" DEFAULT 'physical' NOT NULL,
  	"location_name" varchar,
  	"location_address" varchar,
  	"location_city" varchar,
  	"registration_url" varchar,
  	"max_participants" numeric,
  	"current_participants" numeric DEFAULT 0,
  	"is_free" boolean DEFAULT false,
  	"price" numeric,
  	"price_display" varchar,
  	"category" "enum_workshops_category",
  	"level" "enum_workshops_level",
  	"status" "enum_workshops_status" DEFAULT 'upcoming' NOT NULL,
  	"is_featured" boolean DEFAULT false,
  	"prerequisites" varchar,
  	"certificate_awarded" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
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
  	"features_shop" boolean DEFAULT true,
  	"features_cart" boolean DEFAULT true,
  	"features_checkout" boolean DEFAULT true,
  	"features_wishlists" boolean DEFAULT false,
  	"features_product_reviews" boolean DEFAULT false,
  	"features_customer_groups" boolean DEFAULT false,
  	"features_vendors" boolean DEFAULT false,
  	"features_vendor_reviews" boolean DEFAULT false,
  	"features_workshops" boolean DEFAULT false,
  	"features_blog" boolean DEFAULT true,
  	"features_faq" boolean DEFAULT true,
  	"features_testimonials" boolean DEFAULT true,
  	"features_cases" boolean DEFAULT false,
  	"features_partners" boolean DEFAULT false,
  	"features_brands" boolean DEFAULT false,
  	"features_services" boolean DEFAULT false,
  	"features_order_lists" boolean DEFAULT false,
  	"features_multi_language" boolean DEFAULT false,
  	"features_ai_content" boolean DEFAULT false,
  	"features_authentication" boolean DEFAULT true,
  	"deployment_url" varchar,
  	"admin_url" varchar,
  	"deployment_provider" "enum_clients_deployment_provider",
  	"last_deployed_at" timestamp(3) with time zone,
  	"deployment_provider_id" varchar,
  	"last_deployment_id" varchar,
  	"database_url" varchar,
  	"database_provider_id" varchar,
  	"port" numeric,
  	"admin_email" varchar,
  	"initial_admin_password" varchar,
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
  	"media_id" integer,
  	"blog_posts_id" integer,
  	"blog_categories_id" integer,
  	"faqs_id" integer,
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
  	"invoices_id" integer,
  	"recurring_orders_id" integer,
  	"returns_id" integer,
  	"notifications_id" integer,
  	"recently_viewed_id" integer,
  	"vendors_id" integer,
  	"vendor_reviews_id" integer,
  	"workshops_id" integer,
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
  	"default_product_template" "enum_settings_default_product_template" DEFAULT 'template1',
  	"default_blog_template" "enum_settings_default_blog_template" DEFAULT 'blogtemplate1',
  	"default_shop_archive_template" "enum_settings_default_shop_archive_template" DEFAULT 'shoparchivetemplate1',
  	"default_cart_template" "enum_settings_default_cart_template" DEFAULT 'carttemplate1',
  	"default_checkout_template" "enum_settings_default_checkout_template" DEFAULT 'checkouttemplate1',
  	"default_my_account_template" "enum_settings_default_my_account_template" DEFAULT 'myaccounttemplate1',
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
  	"icon" "enum_header_top_bar_left_messages_icon",
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
  	"icon" "enum_header_custom_buttons_icon",
  	"style" "enum_header_custom_buttons_style" DEFAULT 'default'
  );
  
  CREATE TABLE "header_navigation_special_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_header_navigation_special_items_icon",
  	"url" varchar NOT NULL,
  	"highlight" boolean DEFAULT false,
  	"position" "enum_header_navigation_special_items_position" DEFAULT 'end'
  );
  
  CREATE TABLE "header_navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer
  );
  
  CREATE TABLE "header_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_header_navigation_items_icon",
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
  	"alert_bar_icon" "enum_header_alert_bar_icon",
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
  	"site_name_accent" varchar,
  	"enable_search" boolean DEFAULT true,
  	"search_placeholder" varchar DEFAULT 'Zoek producten...',
  	"show_phone" boolean DEFAULT true,
  	"show_wishlist" boolean DEFAULT false,
  	"show_account" boolean DEFAULT true,
  	"show_cart" boolean DEFAULT true,
  	"navigation_mode" "enum_header_navigation_mode" DEFAULT 'manual' NOT NULL,
  	"navigation_category_settings_show_icons" boolean DEFAULT true,
  	"navigation_category_settings_show_product_count" boolean DEFAULT true,
  	"navigation_category_settings_mega_menu_style" "enum_header_navigation_category_settings_mega_menu_style" DEFAULT 'subcategories',
  	"navigation_category_settings_max_items" numeric DEFAULT 10,
  	"navigation_category_settings_max_products_in_mega_menu" numeric DEFAULT 3,
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
  ALTER TABLE "users_favorites" ADD CONSTRAINT "users_favorites_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_favorites" ADD CONSTRAINT "users_favorites_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_stats" ADD CONSTRAINT "pages_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_stats" ADD CONSTRAINT "_pages_v_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "blog_posts_tags" ADD CONSTRAINT "blog_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_faq" ADD CONSTRAINT "blog_posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_tags" ADD CONSTRAINT "_blog_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_faq" ADD CONSTRAINT "_blog_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_parent_id_blog_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_promo_banner_image_id_media_id_fk" FOREIGN KEY ("promo_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_tags" ADD CONSTRAINT "products_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_group_prices" ADD CONSTRAINT "products_group_prices_group_id_customer_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."customer_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_group_prices" ADD CONSTRAINT "products_group_prices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_volume_pricing" ADD CONSTRAINT "products_volume_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_videos" ADD CONSTRAINT "products_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_child_products" ADD CONSTRAINT "products_child_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_child_products" ADD CONSTRAINT "products_child_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_meta_keywords" ADD CONSTRAINT "products_meta_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specifications_attributes" ADD CONSTRAINT "products_specifications_attributes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists" ADD CONSTRAINT "order_lists_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_timeline" ADD CONSTRAINT "orders_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_invoice_p_d_f_id_media_id_fk" FOREIGN KEY ("invoice_p_d_f_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices_items" ADD CONSTRAINT "invoices_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_pdf_file_id_media_id_fk" FOREIGN KEY ("pdf_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recurring_orders_items" ADD CONSTRAINT "recurring_orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recurring_orders_items" ADD CONSTRAINT "recurring_orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recurring_orders" ADD CONSTRAINT "recurring_orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recurring_orders_rels" ADD CONSTRAINT "recurring_orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recurring_orders_rels" ADD CONSTRAINT "recurring_orders_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns" ADD CONSTRAINT "returns_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns" ADD CONSTRAINT "returns_replacement_order_id_orders_id_fk" FOREIGN KEY ("replacement_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_order_id_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_product_id_products_id_fk" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_invoice_id_invoices_id_fk" FOREIGN KEY ("related_invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_recurring_order_id_recurring_orders_id_fk" FOREIGN KEY ("related_recurring_order_id") REFERENCES "public"."recurring_orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_return_id_returns_id_fk" FOREIGN KEY ("related_return_id") REFERENCES "public"."returns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vendors_certifications" ADD CONSTRAINT "vendors_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors" ADD CONSTRAINT "vendors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vendors" ADD CONSTRAINT "vendors_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vendors" ADD CONSTRAINT "vendors_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vendor_reviews" ADD CONSTRAINT "vendor_reviews_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshops_target_audience" ADD CONSTRAINT "workshops_target_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshops_learning_objectives" ADD CONSTRAINT "workshops_learning_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshops" ADD CONSTRAINT "workshops_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshops" ADD CONSTRAINT "workshops_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workshops" ADD CONSTRAINT "workshops_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_requests_website_pages" ADD CONSTRAINT "client_requests_website_pages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "client_requests_payment_methods" ADD CONSTRAINT "client_requests_payment_methods_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_created_user_id_users_id_fk" FOREIGN KEY ("created_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_created_client_id_clients_id_fk" FOREIGN KEY ("created_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recurring_orders_fk" FOREIGN KEY ("recurring_orders_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_returns_fk" FOREIGN KEY ("returns_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recently_viewed_fk" FOREIGN KEY ("recently_viewed_id") REFERENCES "public"."recently_viewed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendor_reviews_fk" FOREIGN KEY ("vendor_reviews_id") REFERENCES "public"."vendor_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workshops_fk" FOREIGN KEY ("workshops_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "header_navigation_special_items" ADD CONSTRAINT "header_navigation_special_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX "users_favorites_order_idx" ON "users_favorites" USING btree ("_order");
  CREATE INDEX "users_favorites_parent_id_idx" ON "users_favorites" USING btree ("_parent_id");
  CREATE INDEX "users_favorites_product_idx" ON "users_favorites" USING btree ("product_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_client_idx" ON "users" USING btree ("client_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_stats_order_idx" ON "pages_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_stats_parent_id_idx" ON "pages_blocks_hero_stats" USING btree ("_parent_id");
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
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_stats_order_idx" ON "_pages_v_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_stats_parent_id_idx" ON "_pages_v_blocks_hero_stats" USING btree ("_parent_id");
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
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "blog_posts_tags_order_idx" ON "blog_posts_tags" USING btree ("_order");
  CREATE INDEX "blog_posts_tags_parent_id_idx" ON "blog_posts_tags" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_faq_order_idx" ON "blog_posts_faq" USING btree ("_order");
  CREATE INDEX "blog_posts_faq_parent_id_idx" ON "blog_posts_faq" USING btree ("_parent_id");
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
  CREATE INDEX "blog_posts_rels_blog_categories_id_idx" ON "blog_posts_rels" USING btree ("blog_categories_id");
  CREATE INDEX "blog_posts_rels_products_id_idx" ON "blog_posts_rels" USING btree ("products_id");
  CREATE INDEX "blog_posts_rels_blog_posts_id_idx" ON "blog_posts_rels" USING btree ("blog_posts_id");
  CREATE INDEX "_blog_posts_v_version_tags_order_idx" ON "_blog_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_tags_parent_id_idx" ON "_blog_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_blog_posts_v_version_faq_order_idx" ON "_blog_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_faq_parent_id_idx" ON "_blog_posts_v_version_faq" USING btree ("_parent_id");
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
  CREATE INDEX "_blog_posts_v_rels_blog_categories_id_idx" ON "_blog_posts_v_rels" USING btree ("blog_categories_id");
  CREATE INDEX "_blog_posts_v_rels_products_id_idx" ON "_blog_posts_v_rels" USING btree ("products_id");
  CREATE INDEX "_blog_posts_v_rels_blog_posts_id_idx" ON "_blog_posts_v_rels" USING btree ("blog_posts_id");
  CREATE UNIQUE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX "blog_categories_parent_idx" ON "blog_categories" USING btree ("parent_id");
  CREATE INDEX "blog_categories_image_idx" ON "blog_categories" USING btree ("image_id");
  CREATE INDEX "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
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
  CREATE INDEX "product_categories_promo_banner_promo_banner_image_idx" ON "product_categories" USING btree ("promo_banner_image_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_meta_meta_image_idx" ON "brands" USING btree ("meta_image_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "products_tags_order_idx" ON "products_tags" USING btree ("_order");
  CREATE INDEX "products_tags_parent_id_idx" ON "products_tags" USING btree ("_parent_id");
  CREATE INDEX "products_group_prices_order_idx" ON "products_group_prices" USING btree ("_order");
  CREATE INDEX "products_group_prices_parent_id_idx" ON "products_group_prices" USING btree ("_parent_id");
  CREATE INDEX "products_group_prices_group_idx" ON "products_group_prices" USING btree ("group_id");
  CREATE INDEX "products_volume_pricing_order_idx" ON "products_volume_pricing" USING btree ("_order");
  CREATE INDEX "products_volume_pricing_parent_id_idx" ON "products_volume_pricing" USING btree ("_parent_id");
  CREATE INDEX "products_videos_order_idx" ON "products_videos" USING btree ("_order");
  CREATE INDEX "products_videos_parent_id_idx" ON "products_videos" USING btree ("_parent_id");
  CREATE INDEX "products_child_products_order_idx" ON "products_child_products" USING btree ("_order");
  CREATE INDEX "products_child_products_parent_id_idx" ON "products_child_products" USING btree ("_parent_id");
  CREATE INDEX "products_child_products_product_idx" ON "products_child_products" USING btree ("product_id");
  CREATE INDEX "products_meta_keywords_order_idx" ON "products_meta_keywords" USING btree ("_order");
  CREATE INDEX "products_meta_keywords_parent_id_idx" ON "products_meta_keywords" USING btree ("_parent_id");
  CREATE INDEX "products_specifications_attributes_order_idx" ON "products_specifications_attributes" USING btree ("_order");
  CREATE INDEX "products_specifications_attributes_parent_id_idx" ON "products_specifications_attributes" USING btree ("_parent_id");
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
  CREATE INDEX "products_rels_product_categories_id_idx" ON "products_rels" USING btree ("product_categories_id");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
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
  CREATE INDEX "orders_timeline_order_idx" ON "orders_timeline" USING btree ("_order");
  CREATE INDEX "orders_timeline_parent_id_idx" ON "orders_timeline" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_invoice_p_d_f_idx" ON "orders" USING btree ("invoice_p_d_f_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "invoices_items_order_idx" ON "invoices_items" USING btree ("_order");
  CREATE INDEX "invoices_items_parent_id_idx" ON "invoices_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");
  CREATE INDEX "invoices_order_idx" ON "invoices" USING btree ("order_id");
  CREATE INDEX "invoices_customer_idx" ON "invoices" USING btree ("customer_id");
  CREATE INDEX "invoices_pdf_file_idx" ON "invoices" USING btree ("pdf_file_id");
  CREATE INDEX "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
  CREATE INDEX "recurring_orders_items_order_idx" ON "recurring_orders_items" USING btree ("_order");
  CREATE INDEX "recurring_orders_items_parent_id_idx" ON "recurring_orders_items" USING btree ("_parent_id");
  CREATE INDEX "recurring_orders_items_product_idx" ON "recurring_orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "recurring_orders_reference_number_idx" ON "recurring_orders" USING btree ("reference_number");
  CREATE INDEX "recurring_orders_customer_idx" ON "recurring_orders" USING btree ("customer_id");
  CREATE INDEX "recurring_orders_updated_at_idx" ON "recurring_orders" USING btree ("updated_at");
  CREATE INDEX "recurring_orders_created_at_idx" ON "recurring_orders" USING btree ("created_at");
  CREATE INDEX "recurring_orders_rels_order_idx" ON "recurring_orders_rels" USING btree ("order");
  CREATE INDEX "recurring_orders_rels_parent_idx" ON "recurring_orders_rels" USING btree ("parent_id");
  CREATE INDEX "recurring_orders_rels_path_idx" ON "recurring_orders_rels" USING btree ("path");
  CREATE INDEX "recurring_orders_rels_orders_id_idx" ON "recurring_orders_rels" USING btree ("orders_id");
  CREATE INDEX "returns_items_order_idx" ON "returns_items" USING btree ("_order");
  CREATE INDEX "returns_items_parent_id_idx" ON "returns_items" USING btree ("_parent_id");
  CREATE INDEX "returns_items_product_idx" ON "returns_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "returns_rma_number_idx" ON "returns" USING btree ("rma_number");
  CREATE INDEX "returns_order_idx" ON "returns" USING btree ("order_id");
  CREATE INDEX "returns_customer_idx" ON "returns" USING btree ("customer_id");
  CREATE INDEX "returns_replacement_order_idx" ON "returns" USING btree ("replacement_order_id");
  CREATE INDEX "returns_updated_at_idx" ON "returns" USING btree ("updated_at");
  CREATE INDEX "returns_created_at_idx" ON "returns" USING btree ("created_at");
  CREATE INDEX "returns_rels_order_idx" ON "returns_rels" USING btree ("order");
  CREATE INDEX "returns_rels_parent_idx" ON "returns_rels" USING btree ("parent_id");
  CREATE INDEX "returns_rels_path_idx" ON "returns_rels" USING btree ("path");
  CREATE INDEX "returns_rels_media_id_idx" ON "returns_rels" USING btree ("media_id");
  CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");
  CREATE INDEX "notifications_related_order_idx" ON "notifications" USING btree ("related_order_id");
  CREATE INDEX "notifications_related_product_idx" ON "notifications" USING btree ("related_product_id");
  CREATE INDEX "notifications_related_invoice_idx" ON "notifications" USING btree ("related_invoice_id");
  CREATE INDEX "notifications_related_recurring_order_idx" ON "notifications" USING btree ("related_recurring_order_id");
  CREATE INDEX "notifications_related_return_idx" ON "notifications" USING btree ("related_return_id");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "recently_viewed_user_idx" ON "recently_viewed" USING btree ("user_id");
  CREATE INDEX "recently_viewed_product_idx" ON "recently_viewed" USING btree ("product_id");
  CREATE INDEX "recently_viewed_updated_at_idx" ON "recently_viewed" USING btree ("updated_at");
  CREATE INDEX "recently_viewed_created_at_idx" ON "recently_viewed" USING btree ("created_at");
  CREATE INDEX "vendors_certifications_order_idx" ON "vendors_certifications" USING btree ("_order");
  CREATE INDEX "vendors_certifications_parent_id_idx" ON "vendors_certifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vendors_slug_idx" ON "vendors" USING btree ("slug");
  CREATE INDEX "vendors_logo_idx" ON "vendors" USING btree ("logo_id");
  CREATE INDEX "vendors_banner_idx" ON "vendors" USING btree ("banner_id");
  CREATE INDEX "vendors_meta_meta_image_idx" ON "vendors" USING btree ("meta_image_id");
  CREATE INDEX "vendors_updated_at_idx" ON "vendors" USING btree ("updated_at");
  CREATE INDEX "vendors_created_at_idx" ON "vendors" USING btree ("created_at");
  CREATE INDEX "vendors_rels_order_idx" ON "vendors_rels" USING btree ("order");
  CREATE INDEX "vendors_rels_parent_idx" ON "vendors_rels" USING btree ("parent_id");
  CREATE INDEX "vendors_rels_path_idx" ON "vendors_rels" USING btree ("path");
  CREATE INDEX "vendors_rels_product_categories_id_idx" ON "vendors_rels" USING btree ("product_categories_id");
  CREATE INDEX "vendors_rels_products_id_idx" ON "vendors_rels" USING btree ("products_id");
  CREATE INDEX "vendor_reviews_vendor_idx" ON "vendor_reviews" USING btree ("vendor_id");
  CREATE INDEX "vendor_reviews_updated_at_idx" ON "vendor_reviews" USING btree ("updated_at");
  CREATE INDEX "vendor_reviews_created_at_idx" ON "vendor_reviews" USING btree ("created_at");
  CREATE INDEX "workshops_target_audience_order_idx" ON "workshops_target_audience" USING btree ("order");
  CREATE INDEX "workshops_target_audience_parent_idx" ON "workshops_target_audience" USING btree ("parent_id");
  CREATE INDEX "workshops_learning_objectives_order_idx" ON "workshops_learning_objectives" USING btree ("_order");
  CREATE INDEX "workshops_learning_objectives_parent_id_idx" ON "workshops_learning_objectives" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "workshops_slug_idx" ON "workshops" USING btree ("slug");
  CREATE INDEX "workshops_featured_image_idx" ON "workshops" USING btree ("featured_image_id");
  CREATE INDEX "workshops_vendor_idx" ON "workshops" USING btree ("vendor_id");
  CREATE INDEX "workshops_meta_meta_image_idx" ON "workshops" USING btree ("meta_image_id");
  CREATE INDEX "workshops_updated_at_idx" ON "workshops" USING btree ("updated_at");
  CREATE INDEX "workshops_created_at_idx" ON "workshops" USING btree ("created_at");
  CREATE INDEX "client_requests_website_pages_order_idx" ON "client_requests_website_pages" USING btree ("order");
  CREATE INDEX "client_requests_website_pages_parent_idx" ON "client_requests_website_pages" USING btree ("parent_id");
  CREATE INDEX "client_requests_payment_methods_order_idx" ON "client_requests_payment_methods" USING btree ("order");
  CREATE INDEX "client_requests_payment_methods_parent_idx" ON "client_requests_payment_methods" USING btree ("parent_id");
  CREATE INDEX "client_requests_created_user_idx" ON "client_requests" USING btree ("created_user_id");
  CREATE INDEX "client_requests_created_client_idx" ON "client_requests" USING btree ("created_client_id");
  CREATE INDEX "client_requests_updated_at_idx" ON "client_requests" USING btree ("updated_at");
  CREATE INDEX "client_requests_created_at_idx" ON "client_requests" USING btree ("created_at");
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
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
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
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX "payload_locked_documents_rels_recurring_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("recurring_orders_id");
  CREATE INDEX "payload_locked_documents_rels_returns_id_idx" ON "payload_locked_documents_rels" USING btree ("returns_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_recently_viewed_id_idx" ON "payload_locked_documents_rels" USING btree ("recently_viewed_id");
  CREATE INDEX "payload_locked_documents_rels_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("vendors_id");
  CREATE INDEX "payload_locked_documents_rels_vendor_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("vendor_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_workshops_id_idx" ON "payload_locked_documents_rels" USING btree ("workshops_id");
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
  CREATE INDEX "header_navigation_special_items_order_idx" ON "header_navigation_special_items" USING btree ("_order");
  CREATE INDEX "header_navigation_special_items_parent_id_idx" ON "header_navigation_special_items" USING btree ("_parent_id");
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
  DROP TABLE "users_favorites" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_blocks_hero_stats" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_two_column" CASCADE;
  DROP TABLE "pages_blocks_product_grid" CASCADE;
  DROP TABLE "pages_blocks_category_grid" CASCADE;
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_quick_order" CASCADE;
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
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_two_column" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_features_features" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_quick_order" CASCADE;
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
  DROP TABLE "media" CASCADE;
  DROP TABLE "blog_posts_tags" CASCADE;
  DROP TABLE "blog_posts_faq" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_rels" CASCADE;
  DROP TABLE "_blog_posts_v_version_tags" CASCADE;
  DROP TABLE "_blog_posts_v_version_faq" CASCADE;
  DROP TABLE "_blog_posts_v" CASCADE;
  DROP TABLE "_blog_posts_v_rels" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "cases_services" CASCADE;
  DROP TABLE "cases_gallery" CASCADE;
  DROP TABLE "cases" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "products_tags" CASCADE;
  DROP TABLE "products_group_prices" CASCADE;
  DROP TABLE "products_volume_pricing" CASCADE;
  DROP TABLE "products_videos" CASCADE;
  DROP TABLE "products_child_products" CASCADE;
  DROP TABLE "products_meta_keywords" CASCADE;
  DROP TABLE "products_specifications_attributes" CASCADE;
  DROP TABLE "products_specifications" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "customer_groups" CASCADE;
  DROP TABLE "order_lists_items" CASCADE;
  DROP TABLE "order_lists_share_with" CASCADE;
  DROP TABLE "order_lists" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders_timeline" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "invoices_items" CASCADE;
  DROP TABLE "invoices" CASCADE;
  DROP TABLE "recurring_orders_items" CASCADE;
  DROP TABLE "recurring_orders" CASCADE;
  DROP TABLE "recurring_orders_rels" CASCADE;
  DROP TABLE "returns_items" CASCADE;
  DROP TABLE "returns" CASCADE;
  DROP TABLE "returns_rels" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "recently_viewed" CASCADE;
  DROP TABLE "vendors_certifications" CASCADE;
  DROP TABLE "vendors" CASCADE;
  DROP TABLE "vendors_rels" CASCADE;
  DROP TABLE "vendor_reviews" CASCADE;
  DROP TABLE "workshops_target_audience" CASCADE;
  DROP TABLE "workshops_learning_objectives" CASCADE;
  DROP TABLE "workshops" CASCADE;
  DROP TABLE "client_requests_website_pages" CASCADE;
  DROP TABLE "client_requests_payment_methods" CASCADE;
  DROP TABLE "client_requests" CASCADE;
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
  DROP TABLE "header_navigation_special_items" CASCADE;
  DROP TABLE "header_navigation_items_children" CASCADE;
  DROP TABLE "header_navigation_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."enum_users_addresses_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_account_type";
  DROP TYPE "public"."enum_users_company_branch";
  DROP TYPE "public"."enum_users_client_type";
  DROP TYPE "public"."enum_pages_blocks_spacer_height";
  DROP TYPE "public"."enum_pages_blocks_hero_style";
  DROP TYPE "public"."enum_pages_blocks_hero_layout";
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
  DROP TYPE "public"."enum_pages_blocks_features_background_style";
  DROP TYPE "public"."enum_pages_blocks_features_source";
  DROP TYPE "public"."enum_pages_blocks_features_category";
  DROP TYPE "public"."enum_pages_blocks_features_layout";
  DROP TYPE "public"."enum_pages_blocks_features_style";
  DROP TYPE "public"."enum_pages_blocks_quick_order_input_mode";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_source";
  DROP TYPE "public"."enum_pages_blocks_testimonials_layout";
  DROP TYPE "public"."enum_pages_blocks_cases_source";
  DROP TYPE "public"."enum_pages_blocks_cases_layout";
  DROP TYPE "public"."enum_pages_blocks_logo_bar_source";
  DROP TYPE "public"."enum_pages_blocks_logo_bar_category";
  DROP TYPE "public"."enum_pages_blocks_logo_bar_display_mode";
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
  DROP TYPE "public"."enum__pages_v_blocks_spacer_height";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_layout";
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
  DROP TYPE "public"."enum__pages_v_blocks_features_background_style";
  DROP TYPE "public"."enum__pages_v_blocks_features_source";
  DROP TYPE "public"."enum__pages_v_blocks_features_category";
  DROP TYPE "public"."enum__pages_v_blocks_features_layout";
  DROP TYPE "public"."enum__pages_v_blocks_features_style";
  DROP TYPE "public"."enum__pages_v_blocks_quick_order_input_mode";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_style";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_layout";
  DROP TYPE "public"."enum__pages_v_blocks_cases_source";
  DROP TYPE "public"."enum__pages_v_blocks_cases_layout";
  DROP TYPE "public"."enum__pages_v_blocks_logo_bar_source";
  DROP TYPE "public"."enum__pages_v_blocks_logo_bar_category";
  DROP TYPE "public"."enum__pages_v_blocks_logo_bar_display_mode";
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
  DROP TYPE "public"."enum_blog_posts_featured_tag";
  DROP TYPE "public"."enum_blog_posts_template";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_featured_tag";
  DROP TYPE "public"."enum__blog_posts_v_version_template";
  DROP TYPE "public"."enum__blog_posts_v_version_status";
  DROP TYPE "public"."enum_blog_categories_icon";
  DROP TYPE "public"."enum_blog_categories_color";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum_cases_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_services_icon_type";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum_partners_category";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum_products_videos_platform";
  DROP TYPE "public"."enum_products_product_type";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_products_condition";
  DROP TYPE "public"."enum_products_badge";
  DROP TYPE "public"."enum_products_tax_class";
  DROP TYPE "public"."enum_products_stock_status";
  DROP TYPE "public"."enum_products_weight_unit";
  DROP TYPE "public"."enum_customer_groups_type";
  DROP TYPE "public"."enum_order_lists_icon";
  DROP TYPE "public"."enum_order_lists_color";
  DROP TYPE "public"."enum_orders_timeline_event";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_shipping_provider";
  DROP TYPE "public"."enum_orders_shipping_method";
  DROP TYPE "public"."enum_invoices_status";
  DROP TYPE "public"."enum_invoices_payment_method";
  DROP TYPE "public"."enum_recurring_orders_status";
  DROP TYPE "public"."enum_recurring_orders_frequency_unit";
  DROP TYPE "public"."enum_recurring_orders_payment_method";
  DROP TYPE "public"."enum_returns_status";
  DROP TYPE "public"."enum_returns_return_reason";
  DROP TYPE "public"."enum_returns_product_condition";
  DROP TYPE "public"."enum_returns_preferred_resolution";
  DROP TYPE "public"."enum_returns_refund_method";
  DROP TYPE "public"."enum_notifications_type";
  DROP TYPE "public"."enum_notifications_category";
  DROP TYPE "public"."enum_notifications_icon";
  DROP TYPE "public"."enum_notifications_icon_color";
  DROP TYPE "public"."enum_notifications_priority";
  DROP TYPE "public"."enum_recently_viewed_source";
  DROP TYPE "public"."enum_recently_viewed_device";
  DROP TYPE "public"."enum_vendors_certifications_icon";
  DROP TYPE "public"."enum_workshops_target_audience";
  DROP TYPE "public"."enum_workshops_location_type";
  DROP TYPE "public"."enum_workshops_category";
  DROP TYPE "public"."enum_workshops_level";
  DROP TYPE "public"."enum_workshops_status";
  DROP TYPE "public"."enum_client_requests_website_pages";
  DROP TYPE "public"."enum_client_requests_payment_methods";
  DROP TYPE "public"."enum_client_requests_status";
  DROP TYPE "public"."enum_client_requests_site_type";
  DROP TYPE "public"."enum_client_requests_expected_products";
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
  DROP TYPE "public"."enum_settings_default_product_template";
  DROP TYPE "public"."enum_settings_default_blog_template";
  DROP TYPE "public"."enum_settings_default_shop_archive_template";
  DROP TYPE "public"."enum_settings_default_cart_template";
  DROP TYPE "public"."enum_settings_default_checkout_template";
  DROP TYPE "public"."enum_settings_default_my_account_template";
  DROP TYPE "public"."enum_theme_font_scale";
  DROP TYPE "public"."enum_theme_border_radius";
  DROP TYPE "public"."enum_theme_spacing";
  DROP TYPE "public"."enum_theme_container_width";
  DROP TYPE "public"."enum_theme_shadow_size";
  DROP TYPE "public"."enum_header_top_bar_left_messages_icon";
  DROP TYPE "public"."enum_header_custom_buttons_icon";
  DROP TYPE "public"."enum_header_custom_buttons_style";
  DROP TYPE "public"."enum_header_navigation_special_items_icon";
  DROP TYPE "public"."enum_header_navigation_special_items_position";
  DROP TYPE "public"."enum_header_navigation_items_icon";
  DROP TYPE "public"."enum_header_navigation_items_type";
  DROP TYPE "public"."enum_header_alert_bar_type";
  DROP TYPE "public"."enum_header_alert_bar_icon";
  DROP TYPE "public"."enum_header_navigation_mode";
  DROP TYPE "public"."enum_header_navigation_category_settings_mega_menu_style";
  DROP TYPE "public"."enum_footer_columns_links_type";`)
}

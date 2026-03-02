import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."chatbot_kb_search_collections" AS ENUM('blog-posts', 'pages', 'faqs', 'products', 'cases');
  CREATE TYPE "public"."enum_users_addresses_type" AS ENUM('shipping', 'billing', 'both');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'admin', 'editor');
  CREATE TYPE "public"."enum_users_account_type" AS ENUM('individual', 'b2b');
  CREATE TYPE "public"."enum_users_company_branch" AS ENUM('healthcare', 'hospitality', 'construction', 'industry', 'education', 'business_services', 'retail', 'logistics', 'other');
  CREATE TYPE "public"."enum_users_client_type" AS ENUM('website', 'webshop');
  CREATE TYPE "public"."enum_pages_blocks_banner_variant" AS ENUM('announcement', 'promo', 'warning');
  CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_hero_buttons_style" AS ENUM('primary', 'secondary', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('default', 'split', 'centered');
  CREATE TYPE "public"."enum_pages_blocks_hero_background_style" AS ENUM('gradient', 'image', 'solid');
  CREATE TYPE "public"."enum_pages_blocks_hero_background_color" AS ENUM('navy', 'white', 'bg', 'teal');
  CREATE TYPE "public"."enum_pages_blocks_content_max_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_media_block_buttons_variant" AS ENUM('primary', 'secondary', 'outline', 'success', 'danger');
  CREATE TYPE "public"."enum_pages_blocks_media_block_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_media_block_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_media_block_split" AS ENUM('50-50', '60-40', '40-60');
  CREATE TYPE "public"."enum_pages_blocks_media_block_background_color" AS ENUM('white', 'bg', 'grey', 'tealLight', 'tealGlow', 'navy', 'navyLight');
  CREATE TYPE "public"."enum_pages_blocks_two_column_split" AS ENUM('50-50', '60-40', '40-60');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_source" AS ENUM('manual', 'featured', 'latest', 'category', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum_pages_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both');
  CREATE TYPE "public"."enum_pages_blocks_cta_buttons_style" AS ENUM('primary', 'secondary', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('centered', 'split', 'full-width');
  CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('dark', 'light', 'gradient');
  CREATE TYPE "public"."enum_pages_blocks_calltoaction_background_color" AS ENUM('white', 'grey', 'teal');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_background_color" AS ENUM('white', 'grey', 'teal', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_features_variant" AS ENUM('grid-3', 'grid-4', 'list');
  CREATE TYPE "public"."enum_pages_blocks_features_icon_style" AS ENUM('glow', 'solid', 'outlined');
  CREATE TYPE "public"."enum_pages_blocks_features_alignment" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_blocks_services_services_icon_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral');
  CREATE TYPE "public"."enum_pages_blocks_services_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_variant" AS ENUM('grid', 'carousel', 'featured');
  CREATE TYPE "public"."enum_pages_blocks_cases_source" AS ENUM('featured', 'manual', 'latest');
  CREATE TYPE "public"."enum_pages_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum_pages_blocks_logo_bar_variant" AS ENUM('light', 'white', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_stats_background_color" AS ENUM('white', 'grey', 'tealGradient', 'navyGradient');
  CREATE TYPE "public"."enum_pages_blocks_faq_variant" AS ENUM('single-column', 'two-column');
  CREATE TYPE "public"."enum_pages_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_team_photo_style" AS ENUM('square', 'circle');
  CREATE TYPE "public"."enum_pages_blocks_team_background_color" AS ENUM('white', 'bg', 'grey');
  CREATE TYPE "public"."enum_pages_blocks_blog_preview_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_comparison_rows_values_type" AS ENUM('check', 'x', 'text');
  CREATE TYPE "public"."enum_pages_blocks_infobox_variant" AS ENUM('info', 'success', 'warning', 'error');
  CREATE TYPE "public"."enum_pages_blocks_infobox_max_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_infobox_margin_top" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_infobox_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_video_source" AS ENUM('youtube', 'vimeo', 'upload');
  CREATE TYPE "public"."enum_pages_blocks_video_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', '21-9');
  CREATE TYPE "public"."enum_pages_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown', 'plaintext');
  CREATE TYPE "public"."enum_pages_blocks_map_height" AS ENUM('small', 'medium', 'large');
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
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_variant" AS ENUM('announcement', 'promo', 'warning');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_buttons_style" AS ENUM('primary', 'secondary', 'ghost');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('default', 'split', 'centered');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_background_style" AS ENUM('gradient', 'image', 'solid');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_background_color" AS ENUM('navy', 'white', 'bg', 'teal');
  CREATE TYPE "public"."enum__pages_v_blocks_content_max_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_buttons_variant" AS ENUM('primary', 'secondary', 'outline', 'success', 'danger');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_split" AS ENUM('50-50', '60-40', '40-60');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_background_color" AS ENUM('white', 'bg', 'grey', 'tealLight', 'tealGlow', 'navy', 'navyLight');
  CREATE TYPE "public"."enum__pages_v_blocks_two_column_split" AS ENUM('50-50', '60-40', '40-60');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_source" AS ENUM('manual', 'featured', 'latest', 'category', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_layout" AS ENUM('grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6');
  CREATE TYPE "public"."enum__pages_v_blocks_quick_order_input_mode" AS ENUM('textarea', 'single', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_buttons_style" AS ENUM('primary', 'secondary', 'ghost');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('centered', 'split', 'full-width');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_style" AS ENUM('dark', 'light', 'gradient');
  CREATE TYPE "public"."enum__pages_v_blocks_calltoaction_background_color" AS ENUM('white', 'grey', 'teal');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_background_color" AS ENUM('white', 'grey', 'teal', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_features_variant" AS ENUM('grid-3', 'grid-4', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_features_icon_style" AS ENUM('glow', 'solid', 'outlined');
  CREATE TYPE "public"."enum__pages_v_blocks_features_alignment" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_services_services_icon_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral');
  CREATE TYPE "public"."enum__pages_v_blocks_services_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_variant" AS ENUM('grid', 'carousel', 'featured');
  CREATE TYPE "public"."enum__pages_v_blocks_cases_source" AS ENUM('featured', 'manual', 'latest');
  CREATE TYPE "public"."enum__pages_v_blocks_cases_layout" AS ENUM('grid-2', 'grid-3', 'grid-4');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_bar_variant" AS ENUM('light', 'white', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_background_color" AS ENUM('white', 'grey', 'tealGradient', 'navyGradient');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_variant" AS ENUM('single-column', 'two-column');
  CREATE TYPE "public"."enum__pages_v_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_team_photo_style" AS ENUM('square', 'circle');
  CREATE TYPE "public"."enum__pages_v_blocks_team_background_color" AS ENUM('white', 'bg', 'grey');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_preview_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_rows_values_type" AS ENUM('check', 'x', 'text');
  CREATE TYPE "public"."enum__pages_v_blocks_infobox_variant" AS ENUM('info', 'success', 'warning', 'error');
  CREATE TYPE "public"."enum__pages_v_blocks_infobox_max_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_infobox_margin_top" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_infobox_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_video_source" AS ENUM('youtube', 'vimeo', 'upload');
  CREATE TYPE "public"."enum__pages_v_blocks_video_aspect_ratio" AS ENUM('16-9', '4-3', '1-1', '21-9');
  CREATE TYPE "public"."enum__pages_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown', 'plaintext');
  CREATE TYPE "public"."enum__pages_v_blocks_map_height" AS ENUM('small', 'medium', 'large');
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
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_partners_category" AS ENUM('klant', 'partner', 'leverancier', 'certificering', 'media');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_services_icon_type" AS ENUM('lucide', 'upload');
  CREATE TYPE "public"."enum_services_category" AS ENUM('algemeen', 'technisch', 'marketing', 'support', 'consulting', 'training', 'usps');
  CREATE TYPE "public"."enum_services_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('order_shipped', 'order_delivered', 'order_cancelled', 'invoice_available', 'invoice_overdue', 'payment_reminder', 'stock_alert', 'price_change', 'recurring_order_reminder', 'recurring_order_processed', 'return_approved', 'return_rejected', 'return_received', 'refund_processed', 'system', 'account_update');
  CREATE TYPE "public"."enum_notifications_category" AS ENUM('all', 'orders', 'stock', 'system');
  CREATE TYPE "public"."enum_notifications_icon" AS ENUM('bell', 'truck', 'check-circle', 'package', 'file-text', 'repeat', 'rotate-ccw', 'banknote', 'alert-circle', 'settings', 'user');
  CREATE TYPE "public"."enum_notifications_icon_color" AS ENUM('green', 'teal', 'blue', 'amber', 'coral', 'grey');
  CREATE TYPE "public"."enum_notifications_priority" AS ENUM('low', 'normal', 'high', 'urgent');
  CREATE TYPE "public"."enum_themes_status" AS ENUM('active', 'development', 'archived');
  CREATE TYPE "public"."enum_products_videos_platform" AS ENUM('youtube', 'vimeo', 'custom');
  CREATE TYPE "public"."enum_products_product_type" AS ENUM('simple', 'grouped', 'variable', 'mixAndMatch');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published', 'sold-out', 'archived');
  CREATE TYPE "public"."enum_products_condition" AS ENUM('new', 'refurbished', 'used');
  CREATE TYPE "public"."enum_products_badge" AS ENUM('none', 'new', 'sale', 'popular', 'sold-out');
  CREATE TYPE "public"."enum_products_tax_class" AS ENUM('standard', 'reduced', 'zero');
  CREATE TYPE "public"."enum_products_stock_status" AS ENUM('in-stock', 'out-of-stock', 'on-backorder', 'discontinued');
  CREATE TYPE "public"."enum_products_weight_unit" AS ENUM('kg', 'g');
  CREATE TYPE "public"."enum_recently_viewed_source" AS ENUM('direct', 'search', 'category', 'related', 'recently_viewed', 'recommendations', 'external');
  CREATE TYPE "public"."enum_recently_viewed_device" AS ENUM('desktop', 'mobile', 'tablet');
  CREATE TYPE "public"."enum_customers_account_type" AS ENUM('b2c', 'b2b');
  CREATE TYPE "public"."enum_customers_payment_terms" AS ENUM('immediate', '14', '30', '60', '90');
  CREATE TYPE "public"."enum_customers_language" AS ENUM('nl', 'en', 'de');
  CREATE TYPE "public"."enum_customers_currency" AS ENUM('EUR', 'USD', 'GBP');
  CREATE TYPE "public"."enum_customers_status" AS ENUM('pending', 'active', 'inactive', 'blocked');
  CREATE TYPE "public"."enum_customer_groups_type" AS ENUM('b2c', 'b2b');
  CREATE TYPE "public"."enum_addresses_type" AS ENUM('billing', 'shipping', 'both');
  CREATE TYPE "public"."enum_addresses_country" AS ENUM('NL', 'BE', 'DE', 'FR', 'GB', 'US', 'OTHER');
  CREATE TYPE "public"."enum_carts_items_discount_type" AS ENUM('none', 'percentage', 'fixed');
  CREATE TYPE "public"."enum_carts_coupons_discount_type" AS ENUM('percentage', 'fixed', 'free_shipping');
  CREATE TYPE "public"."enum_carts_status" AS ENUM('active', 'completed', 'abandoned', 'saved', 'quote');
  CREATE TYPE "public"."enum_carts_currency" AS ENUM('EUR', 'USD', 'GBP');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded', 'quote');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('ideal', 'creditcard', 'banktransfer', 'paypal', 'mollie', 'invoice');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_orders_shipping_method" AS ENUM('standard', 'express', 'pickup');
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('EUR', 'USD', 'GBP');
  CREATE TYPE "public"."enum_order_lists_icon" AS ENUM('clipboard-list', 'repeat', 'stethoscope', 'flask-conical', 'plus-circle', 'building-2', 'package');
  CREATE TYPE "public"."enum_order_lists_color" AS ENUM('teal', 'blue', 'amber', 'green');
  CREATE TYPE "public"."enum_recurring_orders_status" AS ENUM('active', 'paused', 'cancelled', 'expired');
  CREATE TYPE "public"."enum_recurring_orders_frequency_unit" AS ENUM('days', 'weeks', 'months');
  CREATE TYPE "public"."enum_recurring_orders_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'direct_debit');
  CREATE TYPE "public"."enum_invoices_status" AS ENUM('open', 'paid', 'overdue', 'cancelled', 'credit_note');
  CREATE TYPE "public"."enum_invoices_payment_method" AS ENUM('ideal', 'invoice', 'creditcard', 'banktransfer', 'direct_debit');
  CREATE TYPE "public"."enum_returns_status" AS ENUM('pending', 'approved', 'rejected', 'label_sent', 'received', 'inspecting', 'refunded', 'replaced', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_returns_return_reason" AS ENUM('wrong_product', 'wrong_size', 'damaged', 'not_expected', 'duplicate', 'other');
  CREATE TYPE "public"."enum_returns_product_condition" AS ENUM('unopened', 'opened', 'damaged');
  CREATE TYPE "public"."enum_returns_preferred_resolution" AS ENUM('replacement', 'refund', 'store_credit', 'exchange');
  CREATE TYPE "public"."enum_returns_refund_method" AS ENUM('original', 'bank_transfer', 'store_credit');
  CREATE TYPE "public"."enum_stock_reservations_status" AS ENUM('active', 'converted', 'released', 'expired');
  CREATE TYPE "public"."enum_subscription_plans_billing_interval" AS ENUM('monthly', 'yearly', 'lifetime');
  CREATE TYPE "public"."enum_subscription_plans_tier" AS ENUM('free', 'pro', 'enterprise');
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
  CREATE TYPE "public"."enum_ab_tests_target_page" AS ENUM('cart', 'checkout', 'login', 'registration', 'product', 'homepage');
  CREATE TYPE "public"."enum_ab_tests_status" AS ENUM('draft', 'running', 'paused', 'completed');
  CREATE TYPE "public"."enum_blog_posts_featured_tag" AS ENUM('none', 'guide', 'new', 'featured', 'tip', 'news');
  CREATE TYPE "public"."enum_blog_posts_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3');
  CREATE TYPE "public"."enum_blog_posts_content_type" AS ENUM('article', 'guide', 'elearning', 'download', 'video');
  CREATE TYPE "public"."enum_blog_posts_content_access_access_level" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_version_featured_tag" AS ENUM('none', 'guide', 'new', 'featured', 'tip', 'news');
  CREATE TYPE "public"."enum__blog_posts_v_version_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3');
  CREATE TYPE "public"."enum__blog_posts_v_version_content_type" AS ENUM('article', 'guide', 'elearning', 'download', 'video');
  CREATE TYPE "public"."enum__blog_posts_v_version_content_access_access_level" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_categories_icon" AS ENUM('BookOpen', 'Lightbulb', 'Sparkles', 'Stethoscope', 'ShieldCheck', 'Newspaper', 'GraduationCap', 'Microscope', 'Settings', 'TrendingUp', 'Target', 'Wrench');
  CREATE TYPE "public"."enum_blog_categories_color" AS ENUM('teal', 'blue', 'green', 'coral', 'purple', 'amber', 'pink');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('algemeen', 'producten', 'verzending', 'retourneren', 'betaling', 'account', 'support', 'overig');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_cases_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_vendors_certifications_icon" AS ENUM('shield-check', 'award', 'leaf', 'star', 'check-circle');
  CREATE TYPE "public"."enum_workshops_target_audience" AS ENUM('nurses', 'doctors', 'care-workers', 'pharmacists', 'management');
  CREATE TYPE "public"."enum_workshops_location_type" AS ENUM('physical', 'online', 'hybrid');
  CREATE TYPE "public"."enum_workshops_category" AS ENUM('wondverzorging', 'handygiene', 'diagnostiek', 'sterilisatie', 'product-training', 'algemeen');
  CREATE TYPE "public"."enum_workshops_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TYPE "public"."enum_workshops_status" AS ENUM('upcoming', 'open', 'almost-full', 'full', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_construction_services_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral');
  CREATE TYPE "public"."enum_construction_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_construction_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_construction_reviews_client_color" AS ENUM('teal', 'blue', 'green', 'purple', 'amber', 'coral');
  CREATE TYPE "public"."enum_construction_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_quote_requests_project_type" AS ENUM('nieuwbouw', 'renovatie', 'verduurzaming', 'aanbouw', 'utiliteitsbouw', 'herstelwerk');
  CREATE TYPE "public"."enum_quote_requests_budget" AS ENUM('< 50k', '50k-100k', '100k-250k', '250k-500k', '> 500k', 'unknown');
  CREATE TYPE "public"."enum_quote_requests_timeline" AS ENUM('asap', '3months', '6months', 'thisyear', 'nextyear', 'unknown');
  CREATE TYPE "public"."enum_quote_requests_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost');
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
  CREATE TYPE "public"."enum_email_subscribers_status" AS ENUM('enabled', 'disabled', 'blocklisted');
  CREATE TYPE "public"."enum_email_subscribers_source" AS ENUM('manual', 'website', 'import', 'api', 'checkout');
  CREATE TYPE "public"."enum_email_subscribers_sync_status" AS ENUM('synced', 'pending', 'error');
  CREATE TYPE "public"."enum_email_lists_type" AS ENUM('public', 'private');
  CREATE TYPE "public"."enum_email_lists_optin" AS ENUM('single', 'double');
  CREATE TYPE "public"."enum_email_lists_category" AS ENUM('newsletter', 'marketing', 'transactional', 'updates', 'customers', 'other');
  CREATE TYPE "public"."enum_email_lists_sync_status" AS ENUM('synced', 'pending', 'error');
  CREATE TYPE "public"."enum_email_templates_type" AS ENUM('campaign', 'transactional');
  CREATE TYPE "public"."enum_email_templates_category" AS ENUM('welcome', 'newsletter', 'promotional', 'transactional', 'notification', 'other');
  CREATE TYPE "public"."enum_email_templates_sync_status" AS ENUM('synced', 'pending', 'error');
  CREATE TYPE "public"."enum_email_api_keys_scopes" AS ENUM('subscribers:read', 'subscribers:create', 'subscribers:update', 'subscribers:delete', 'lists:read', 'lists:create', 'lists:update', 'lists:delete', 'campaigns:read', 'campaigns:create', 'campaigns:update', 'campaigns:send', 'campaigns:delete', 'templates:read', 'templates:create', 'templates:update', 'templates:delete', 'analytics:read', 'events:send', 'automation:read', 'automation:trigger');
  CREATE TYPE "public"."enum_email_api_keys_environment" AS ENUM('live', 'test');
  CREATE TYPE "public"."enum_email_api_keys_status" AS ENUM('active', 'inactive', 'revoked');
  CREATE TYPE "public"."enum_email_campaigns_content_type" AS ENUM('template', 'custom');
  CREATE TYPE "public"."enum_email_campaigns_timezone" AS ENUM('Europe/Amsterdam', 'America/New_York', 'America/Los_Angeles', 'UTC');
  CREATE TYPE "public"."enum_email_campaigns_status" AS ENUM('draft', 'scheduled', 'running', 'paused', 'finished', 'cancelled');
  CREATE TYPE "public"."enum_email_campaigns_category" AS ENUM('newsletter', 'promotional', 'product_update', 'announcement', 'other');
  CREATE TYPE "public"."enum_email_campaigns_sync_status" AS ENUM('synced', 'pending', 'error');
  CREATE TYPE "public"."enum_automation_rules_conditions_operator" AS ENUM('equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty');
  CREATE TYPE "public"."enum_automation_rules_actions_type" AS ENUM('send_email', 'add_to_list', 'remove_from_list', 'add_tag', 'remove_tag', 'wait', 'webhook');
  CREATE TYPE "public"."enum_automation_rules_actions_wait_duration_unit" AS ENUM('minutes', 'hours', 'days', 'weeks');
  CREATE TYPE "public"."enum_automation_rules_actions_webhook_method" AS ENUM('POST', 'GET', 'PUT', 'PATCH');
  CREATE TYPE "public"."enum_automation_rules_status" AS ENUM('draft', 'active', 'paused');
  CREATE TYPE "public"."enum_automation_rules_trigger_event_type" AS ENUM('user.signup', 'user.updated', 'user.login', 'subscriber.added', 'subscriber.confirmed', 'subscriber.unsubscribed', 'subscriber.list_changed', 'order.placed', 'order.completed', 'order.cancelled', 'cart.abandoned', 'product.purchased', 'email.opened', 'email.clicked', 'email.bounced', 'campaign.completed', 'custom.event');
  CREATE TYPE "public"."enum_automation_rules_timing_delay_unit" AS ENUM('minutes', 'hours', 'days', 'weeks');
  CREATE TYPE "public"."enum_automation_flows_entry_conditions_operator" AS ENUM('equals', 'greater_than', 'less_than', 'contains');
  CREATE TYPE "public"."enum_automation_flows_steps_type" AS ENUM('send_email', 'wait', 'add_to_list', 'remove_from_list', 'add_tag', 'remove_tag', 'condition', 'webhook', 'exit');
  CREATE TYPE "public"."enum_automation_flows_steps_wait_duration_unit" AS ENUM('hours', 'days', 'weeks');
  CREATE TYPE "public"."enum_automation_flows_steps_condition_operator" AS ENUM('equals', 'greater_than', 'contains');
  CREATE TYPE "public"."enum_automation_flows_exit_conditions_event_type" AS ENUM('subscriber.unsubscribed', 'order.placed', 'custom.event');
  CREATE TYPE "public"."enum_automation_flows_status" AS ENUM('draft', 'active', 'paused');
  CREATE TYPE "public"."enum_automation_flows_entry_trigger_event_type" AS ENUM('user.signup', 'subscriber.added', 'subscriber.confirmed', 'order.placed', 'cart.abandoned', 'email.clicked', 'custom.event');
  CREATE TYPE "public"."enum_flow_instances_status" AS ENUM('active', 'completed', 'exited', 'failed');
  CREATE TYPE "public"."enum_email_events_type" AS ENUM('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed', 'failed');
  CREATE TYPE "public"."enum_email_events_bounce_type" AS ENUM('hard', 'soft');
  CREATE TYPE "public"."enum_email_events_source" AS ENUM('campaign', 'automation', 'flow', 'transactional');
  CREATE TYPE "public"."enum_client_requests_website_pages" AS ENUM('home', 'about', 'services', 'portfolio', 'blog', 'faq', 'contact');
  CREATE TYPE "public"."enum_client_requests_payment_methods" AS ENUM('ideal', 'creditcard', 'invoice', 'banktransfer', 'paypal');
  CREATE TYPE "public"."enum_client_requests_status" AS ENUM('pending', 'reviewing', 'approved', 'rejected');
  CREATE TYPE "public"."enum_client_requests_site_type" AS ENUM('website', 'webshop');
  CREATE TYPE "public"."enum_client_requests_expected_products" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('pending', 'provisioning', 'deploying', 'active', 'failed', 'suspended', 'archived');
  CREATE TYPE "public"."enum_clients_plan" AS ENUM('free', 'starter', 'professional', 'enterprise');
  CREATE TYPE "public"."enum_clients_template" AS ENUM('ecommerce', 'blog', 'b2b', 'portfolio', 'corporate');
  CREATE TYPE "public"."enum_clients_deployment_provider" AS ENUM('vercel', 'ploi', 'custom');
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
  CREATE TYPE "public"."enum_settings_shop_filter_order_filter_id" AS ENUM('brands', 'materials', 'sizes', 'colors', 'stock', 'price');
  CREATE TYPE "public"."enum_settings_default_product_template" AS ENUM('template1', 'template2', 'template3');
  CREATE TYPE "public"."enum_settings_default_blog_template" AS ENUM('blogtemplate1', 'blogtemplate2', 'blogtemplate3');
  CREATE TYPE "public"."enum_settings_default_shop_archive_template" AS ENUM('shoparchivetemplate1');
  CREATE TYPE "public"."enum_settings_default_cart_template" AS ENUM('template1', 'template2');
  CREATE TYPE "public"."enum_settings_default_checkout_template" AS ENUM('checkouttemplate1');
  CREATE TYPE "public"."enum_settings_default_my_account_template" AS ENUM('myaccounttemplate1');
  CREATE TYPE "public"."enum_theme_container_width" AS ENUM('lg', 'xl', '2xl', '7xl');
  CREATE TYPE "public"."enum_header_topbar_messages_icon" AS ENUM('', 'BadgeCheck', 'Truck', 'Shield', 'Award', 'Zap', 'CreditCard', 'Lock', 'RefreshCw', 'CheckCircle');
  CREATE TYPE "public"."enum_header_topbar_right_links_icon" AS ENUM('', 'Phone', 'Mail', 'MapPin', 'Clock', 'Users');
  CREATE TYPE "public"."enum_header_special_nav_items_icon" AS ENUM('', 'Flame', 'Star', 'Gift', 'Sparkles', 'Package', 'Tag', 'Zap');
  CREATE TYPE "public"."enum_header_special_nav_items_position" AS ENUM('start', 'end');
  CREATE TYPE "public"."enum_header_manual_nav_items_icon" AS ENUM('', 'Home', 'Package', 'Building2', 'Users', 'Award', 'FileText', 'ShoppingCart', 'Mail', 'Phone', 'Info');
  CREATE TYPE "public"."enum_header_manual_nav_items_type" AS ENUM('page', 'external', 'mega');
  CREATE TYPE "public"."enum_header_search_categories_icon" AS ENUM('', 'Package', 'Sparkles', 'Flame', 'Star', 'Tag');
  CREATE TYPE "public"."enum_header_custom_action_buttons_icon" AS ENUM('Search', 'ShoppingCart', 'User', 'Heart', 'Scale', 'Clipboard', 'Phone', 'Mail', 'MapPin', 'Download', 'Bell', 'Settings');
  CREATE TYPE "public"."enum_header_custom_action_buttons_style" AS ENUM('default', 'primary', 'secondary');
  CREATE TYPE "public"."enum_header_layout_type" AS ENUM('mega-nav', 'single-row', 'minimal');
  CREATE TYPE "public"."enum_header_price_toggle_default_mode" AS ENUM('b2c', 'b2b');
  CREATE TYPE "public"."enum_header_alert_bar_type" AS ENUM('info', 'success', 'warning', 'error', 'promo');
  CREATE TYPE "public"."enum_header_alert_bar_icon" AS ENUM('', 'Info', 'CheckCircle', 'AlertCircle', 'XCircle', 'Gift', 'Zap', 'Bell', 'Megaphone', 'Award', 'Truck');
  CREATE TYPE "public"."enum_header_navigation_mode" AS ENUM('manual', 'categories', 'hybrid');
  CREATE TYPE "public"."enum_header_category_navigation_mega_menu_style" AS ENUM('subcategories', 'with-products', 'full');
  CREATE TYPE "public"."enum_header_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_header_mobile_drawer_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_header_sticky_behavior" AS ENUM('always', 'scroll-up', 'scroll-down');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('linkedin', 'instagram', 'facebook', 'youtube', 'twitter', 'tiktok');
  CREATE TYPE "public"."enum_footer_columns_links_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_footer_trust_badges_icon" AS ENUM('check', 'shield-check', 'star', 'award', 'lock', 'truck');
  CREATE TYPE "public"."enum_footer_legal_links_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_footer_logo_type" AS ENUM('text', 'image');
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
  
  CREATE TABLE "pages_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_banner_variant" DEFAULT 'announcement',
  	"message" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"dismissible" boolean DEFAULT true,
  	"dismissal_key" varchar,
  	"sticky" boolean DEFAULT false,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum_pages_blocks_hero_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'default',
  	"background_style" "enum_pages_blocks_hero_background_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"background_color" "enum_pages_blocks_hero_background_color" DEFAULT 'navy',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"max_width" "enum_pages_blocks_content_max_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_media_block_buttons_variant" DEFAULT 'primary',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_type" "enum_pages_blocks_media_block_media_type" DEFAULT 'image',
  	"media_position" "enum_pages_blocks_media_block_media_position" DEFAULT 'left',
  	"media_id" integer,
  	"video_url" varchar,
  	"split" "enum_pages_blocks_media_block_split" DEFAULT '50-50',
  	"subtitle" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"background_color" "enum_pages_blocks_media_block_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"split" "enum_pages_blocks_two_column_split" DEFAULT '50-50',
  	"column_one" jsonb,
  	"column_two" jsonb,
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
  
  CREATE TABLE "pages_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum_pages_blocks_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'centered',
  	"style" "enum_pages_blocks_cta_style" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_calltoaction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"button_label" varchar,
  	"button_link" varchar,
  	"background_color" "enum_pages_blocks_calltoaction_background_color" DEFAULT 'grey',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"hours" varchar
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"subtitle" varchar,
  	"address_street" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"show_map" boolean DEFAULT true,
  	"map_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"description" varchar,
  	"show_phone" boolean DEFAULT true,
  	"show_subject" boolean DEFAULT true,
  	"submit_to" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_email" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"success_message" varchar DEFAULT 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Blijf op de hoogte',
  	"button_label" varchar DEFAULT 'Inschrijven',
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Je email adres...',
  	"background_color" "enum_pages_blocks_newsletter_background_color" DEFAULT 'teal',
  	"privacy_text" varchar DEFAULT 'We respecteren je privacy. Geen spam.',
  	"success_message" varchar DEFAULT 'Bedankt voor je inschrijving! Check je inbox.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum_pages_blocks_features_variant" DEFAULT 'grid-3',
  	"icon_style" "enum_pages_blocks_features_icon_style" DEFAULT 'glow',
  	"alignment" "enum_pages_blocks_features_alignment" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"icon_color" "enum_pages_blocks_services_services_icon_color" DEFAULT 'teal',
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_text" varchar DEFAULT 'Meer info'
  );
  
  CREATE TABLE "pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_services_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"rating" numeric DEFAULT 5
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"variant" "enum_pages_blocks_testimonials_variant" DEFAULT 'grid',
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
  	"title" varchar,
  	"auto_scroll" boolean DEFAULT false,
  	"variant" "enum_pages_blocks_logo_bar_variant" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"value" varchar,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_stats_columns" DEFAULT '3',
  	"description" varchar,
  	"background_color" "enum_pages_blocks_stats_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_faqs" (
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
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum_pages_blocks_faq_variant" DEFAULT 'single-column',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"email" varchar,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"github" varchar
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_team_columns" DEFAULT '3',
  	"photo_style" "enum_pages_blocks_team_photo_style" DEFAULT 'square',
  	"background_color" "enum_pages_blocks_team_background_color" DEFAULT 'bg',
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
  	"title" varchar,
  	"allow_multiple" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_blog_preview_columns" DEFAULT '3',
  	"description" varchar,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_time" boolean DEFAULT false,
  	"show_category" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_comparison_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_comparison_rows_values_type" DEFAULT 'text',
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_infobox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_infobox_variant" DEFAULT 'info',
  	"icon" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"dismissible" boolean DEFAULT false,
  	"persistent" boolean DEFAULT false,
  	"storage_key" varchar,
  	"max_width" "enum_pages_blocks_infobox_max_width" DEFAULT 'wide',
  	"margin_top" "enum_pages_blocks_infobox_margin_top" DEFAULT 'md',
  	"margin_bottom" "enum_pages_blocks_infobox_margin_bottom" DEFAULT 'md',
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
  	"title" varchar,
  	"columns" "enum_pages_blocks_image_gallery_columns" DEFAULT '3',
  	"aspect_ratio" "enum_pages_blocks_image_gallery_aspect_ratio" DEFAULT '4-3',
  	"enable_lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"source" "enum_pages_blocks_video_source" DEFAULT 'youtube',
  	"aspect_ratio" "enum_pages_blocks_video_aspect_ratio" DEFAULT '16-9',
  	"youtube_url" varchar,
  	"vimeo_url" varchar,
  	"video_file_id" integer,
  	"poster_image_id" integer,
  	"caption" varchar,
  	"autoplay" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_pages_blocks_code_language" DEFAULT 'typescript',
  	"show_line_numbers" boolean DEFAULT true,
  	"filename" varchar,
  	"code" varchar,
  	"caption" varchar,
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
  	"products_id" integer,
  	"product_categories_id" integer,
  	"cases_id" integer,
  	"blog_posts_id" integer,
  	"construction_services_id" integer,
  	"construction_projects_id" integer,
  	"construction_reviews_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_banner_variant" DEFAULT 'announcement',
  	"message" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"dismissible" boolean DEFAULT true,
  	"dismissal_key" varchar,
  	"sticky" boolean DEFAULT false,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum__pages_v_blocks_hero_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'default',
  	"background_style" "enum__pages_v_blocks_hero_background_style" DEFAULT 'gradient',
  	"background_image_id" integer,
  	"background_color" "enum__pages_v_blocks_hero_background_color" DEFAULT 'navy',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"max_width" "enum__pages_v_blocks_content_max_width" DEFAULT 'narrow',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_media_block_buttons_variant" DEFAULT 'primary',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_type" "enum__pages_v_blocks_media_block_media_type" DEFAULT 'image',
  	"media_position" "enum__pages_v_blocks_media_block_media_position" DEFAULT 'left',
  	"media_id" integer,
  	"video_url" varchar,
  	"split" "enum__pages_v_blocks_media_block_split" DEFAULT '50-50',
  	"subtitle" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"background_color" "enum__pages_v_blocks_media_block_background_color" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"split" "enum__pages_v_blocks_two_column_split" DEFAULT '50-50',
  	"column_one" jsonb,
  	"column_two" jsonb,
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
  
  CREATE TABLE "_pages_v_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum__pages_v_blocks_cta_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'centered',
  	"style" "enum__pages_v_blocks_cta_style" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_calltoaction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"button_label" varchar,
  	"button_link" varchar,
  	"background_color" "enum__pages_v_blocks_calltoaction_background_color" DEFAULT 'grey',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"hours" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"subtitle" varchar,
  	"address_street" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"show_map" boolean DEFAULT true,
  	"map_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Neem contact op',
  	"description" varchar,
  	"show_phone" boolean DEFAULT true,
  	"show_subject" boolean DEFAULT true,
  	"submit_to" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_email" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"success_message" varchar DEFAULT 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Blijf op de hoogte',
  	"button_label" varchar DEFAULT 'Inschrijven',
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Je email adres...',
  	"background_color" "enum__pages_v_blocks_newsletter_background_color" DEFAULT 'teal',
  	"privacy_text" varchar DEFAULT 'We respecteren je privacy. Geen spam.',
  	"success_message" varchar DEFAULT 'Bedankt voor je inschrijving! Check je inbox.',
  	"error_message" varchar DEFAULT 'Er ging iets mis. Probeer het opnieuw.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum__pages_v_blocks_features_variant" DEFAULT 'grid-3',
  	"icon_style" "enum__pages_v_blocks_features_icon_style" DEFAULT 'glow',
  	"alignment" "enum__pages_v_blocks_features_alignment" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"icon_color" "enum__pages_v_blocks_services_services_icon_color" DEFAULT 'teal',
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_text" varchar DEFAULT 'Meer info',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_services_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"rating" numeric DEFAULT 5,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"variant" "enum__pages_v_blocks_testimonials_variant" DEFAULT 'grid',
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
  	"title" varchar,
  	"auto_scroll" boolean DEFAULT false,
  	"variant" "enum__pages_v_blocks_logo_bar_variant" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"value" varchar,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_stats_columns" DEFAULT '3',
  	"description" varchar,
  	"background_color" "enum__pages_v_blocks_stats_background_color" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_faqs" (
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
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum__pages_v_blocks_faq_variant" DEFAULT 'single-column',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"email" varchar,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"github" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_team_columns" DEFAULT '3',
  	"photo_style" "enum__pages_v_blocks_team_photo_style" DEFAULT 'square',
  	"background_color" "enum__pages_v_blocks_team_background_color" DEFAULT 'bg',
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
  	"title" varchar,
  	"allow_multiple" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blog_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_blog_preview_columns" DEFAULT '3',
  	"description" varchar,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_time" boolean DEFAULT false,
  	"show_category" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_comparison_rows_values_type" DEFAULT 'text',
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_infobox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_infobox_variant" DEFAULT 'info',
  	"icon" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"dismissible" boolean DEFAULT false,
  	"persistent" boolean DEFAULT false,
  	"storage_key" varchar,
  	"max_width" "enum__pages_v_blocks_infobox_max_width" DEFAULT 'wide',
  	"margin_top" "enum__pages_v_blocks_infobox_margin_top" DEFAULT 'md',
  	"margin_bottom" "enum__pages_v_blocks_infobox_margin_bottom" DEFAULT 'md',
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
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_image_gallery_columns" DEFAULT '3',
  	"aspect_ratio" "enum__pages_v_blocks_image_gallery_aspect_ratio" DEFAULT '4-3',
  	"enable_lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"source" "enum__pages_v_blocks_video_source" DEFAULT 'youtube',
  	"aspect_ratio" "enum__pages_v_blocks_video_aspect_ratio" DEFAULT '16-9',
  	"youtube_url" varchar,
  	"vimeo_url" varchar,
  	"video_file_id" integer,
  	"poster_image_id" integer,
  	"caption" varchar,
  	"autoplay" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__pages_v_blocks_code_language" DEFAULT 'typescript',
  	"show_line_numbers" boolean DEFAULT true,
  	"filename" varchar,
  	"code" varchar,
  	"caption" varchar,
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
  	"products_id" integer,
  	"product_categories_id" integer,
  	"cases_id" integer,
  	"blog_posts_id" integer,
  	"construction_services_id" integer,
  	"construction_projects_id" integer,
  	"construction_reviews_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
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
  
  CREATE TABLE "cookie_consents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"necessary" boolean DEFAULT true NOT NULL,
  	"analytics" boolean DEFAULT false NOT NULL,
  	"marketing" boolean DEFAULT false NOT NULL,
  	"consented_at" timestamp(3) with time zone NOT NULL,
  	"ip_address" varchar,
  	"user_agent" varchar,
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
  
  CREATE TABLE "themes_custom_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"token_name" varchar NOT NULL,
  	"token_value" varchar NOT NULL
  );
  
  CREATE TABLE "themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar,
  	"is_default" boolean DEFAULT false,
  	"primary_color" varchar,
  	"primary_color_light" varchar,
  	"primary_color_dark" varchar,
  	"dark_surface" varchar,
  	"dark_surface_light" varchar,
  	"body_font" varchar,
  	"heading_font" varchar,
  	"primary_gradient" varchar,
  	"hero_gradient" varchar,
  	"border_radius_sm" numeric,
  	"border_radius_md" numeric,
  	"template_count" numeric,
  	"unique_component_count" numeric,
  	"status" "enum_themes_status" DEFAULT 'active',
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
  	"magazine_title" varchar,
  	"product_type" "enum_products_product_type" DEFAULT 'simple' NOT NULL,
  	"is_subscription" boolean DEFAULT false,
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
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"account_type" "enum_customers_account_type" DEFAULT 'b2c' NOT NULL,
  	"company" varchar,
  	"vat_number" varchar,
  	"chamber_of_commerce" varchar,
  	"customer_group_id" integer,
  	"custom_pricing_role" varchar,
  	"discount" numeric,
  	"credit_limit" numeric,
  	"payment_terms" "enum_customers_payment_terms" DEFAULT 'immediate',
  	"addresses" jsonb,
  	"language" "enum_customers_language" DEFAULT 'nl',
  	"currency" "enum_customers_currency" DEFAULT 'EUR',
  	"newsletter" boolean DEFAULT false,
  	"marketing_emails" boolean DEFAULT false,
  	"order_notifications" boolean DEFAULT true,
  	"status" "enum_customers_status" DEFAULT 'pending' NOT NULL,
  	"approved_by_id" integer,
  	"approved_at" timestamp(3) with time zone,
  	"verified" boolean DEFAULT false,
  	"notes" varchar,
  	"total_orders" numeric DEFAULT 0,
  	"total_spent" numeric DEFAULT 0,
  	"average_order_value" numeric DEFAULT 0,
  	"last_order_date" timestamp(3) with time zone,
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
  
  CREATE TABLE "addresses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_addresses_type" DEFAULT 'both' NOT NULL,
  	"company" varchar,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"street" varchar NOT NULL,
  	"house_number" varchar NOT NULL,
  	"addition" varchar,
  	"postal_code" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"state" varchar,
  	"country" "enum_addresses_country" DEFAULT 'NL' NOT NULL,
  	"phone" varchar,
  	"delivery_instructions" varchar,
  	"access_code" varchar,
  	"business_hours" varchar,
  	"is_default" boolean DEFAULT false,
  	"is_validated" boolean DEFAULT false,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "carts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"variant_id" varchar,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"total_price" numeric,
  	"discount_type" "enum_carts_items_discount_type" DEFAULT 'none',
  	"discount_value" numeric,
  	"discount_reason" varchar,
  	"notes" varchar,
  	"added_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "carts_coupons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"discount_type" "enum_carts_coupons_discount_type",
  	"discount_value" numeric
  );
  
  CREATE TABLE "carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer,
  	"session_id" varchar,
  	"status" "enum_carts_status" DEFAULT 'active' NOT NULL,
  	"item_count" numeric DEFAULT 0,
  	"subtotal" numeric DEFAULT 0,
  	"discount_total" numeric DEFAULT 0,
  	"total" numeric DEFAULT 0,
  	"currency" "enum_carts_currency" DEFAULT 'EUR',
  	"customer_group_id" integer,
  	"expires_at" timestamp(3) with time zone,
  	"converted_to_order_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"product_snapshot_name" varchar,
  	"product_snapshot_sku" varchar,
  	"product_snapshot_image" varchar,
  	"variant_id" varchar,
  	"quantity" numeric NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"discount" numeric DEFAULT 0,
  	"total_price" numeric,
  	"notes" varchar
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"customer_id" integer,
  	"customer_email" varchar,
  	"billing_address_first_name" varchar NOT NULL,
  	"billing_address_last_name" varchar NOT NULL,
  	"billing_address_company" varchar,
  	"billing_address_street" varchar NOT NULL,
  	"billing_address_house_number" varchar NOT NULL,
  	"billing_address_addition" varchar,
  	"billing_address_postal_code" varchar NOT NULL,
  	"billing_address_city" varchar NOT NULL,
  	"billing_address_country" varchar NOT NULL,
  	"billing_address_phone" varchar,
  	"shipping_address_first_name" varchar NOT NULL,
  	"shipping_address_last_name" varchar NOT NULL,
  	"shipping_address_company" varchar,
  	"shipping_address_street" varchar NOT NULL,
  	"shipping_address_house_number" varchar NOT NULL,
  	"shipping_address_addition" varchar,
  	"shipping_address_postal_code" varchar NOT NULL,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_country" varchar NOT NULL,
  	"shipping_address_phone" varchar,
  	"payment_method" "enum_orders_payment_method" NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending',
  	"payment_transaction_id" varchar,
  	"payment_paid_at" timestamp(3) with time zone,
  	"shipping_method" "enum_orders_shipping_method" NOT NULL,
  	"shipping_cost" numeric DEFAULT 0,
  	"shipping_tracking_number" varchar,
  	"shipping_carrier" varchar,
  	"shipping_shipped_at" timestamp(3) with time zone,
  	"shipping_delivered_at" timestamp(3) with time zone,
  	"subtotal" numeric NOT NULL,
  	"discount_total" numeric DEFAULT 0,
  	"shipping_total" numeric DEFAULT 0,
  	"tax_total" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"currency" "enum_orders_currency" DEFAULT 'EUR',
  	"customer_notes" varchar,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
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
  
  CREATE TABLE "stock_reservations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"variant" varchar,
  	"quantity" numeric NOT NULL,
  	"cart_id" varchar,
  	"session" varchar,
  	"status" "enum_stock_reservations_status" DEFAULT 'active' NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"converted_to_order_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"allows_premium_content" boolean DEFAULT false,
  	"tier" "enum_subscription_plans_tier" DEFAULT 'free',
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
  	"content_type" "enum_blog_posts_content_type" DEFAULT 'article',
  	"content_access_access_level" "enum_blog_posts_content_access_access_level" DEFAULT 'free',
  	"content_access_preview_length" numeric DEFAULT 200,
  	"content_access_lock_message" varchar,
  	"enable_t_o_c" boolean DEFAULT true,
  	"enable_share" boolean DEFAULT true,
  	"enable_comments" boolean DEFAULT false,
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
  	"version_content_type" "enum__blog_posts_v_version_content_type" DEFAULT 'article',
  	"version_content_access_access_level" "enum__blog_posts_v_version_content_access_access_level" DEFAULT 'free',
  	"version_content_access_preview_length" numeric DEFAULT 200,
  	"version_content_access_lock_message" varchar,
  	"version_enable_t_o_c" boolean DEFAULT true,
  	"version_enable_share" boolean DEFAULT true,
  	"version_enable_comments" boolean DEFAULT false,
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
  
  CREATE TABLE "email_subscribers_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "email_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"status" "enum_email_subscribers_status" DEFAULT 'enabled' NOT NULL,
  	"tenant_id" integer,
  	"custom_fields" jsonb,
  	"preferences_marketing_emails" boolean DEFAULT true,
  	"preferences_product_updates" boolean DEFAULT true,
  	"preferences_newsletter" boolean DEFAULT false,
  	"source" "enum_email_subscribers_source" DEFAULT 'manual',
  	"listmonk_id" numeric,
  	"last_synced_at" timestamp(3) with time zone,
  	"sync_status" "enum_email_subscribers_sync_status" DEFAULT 'pending',
  	"sync_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_subscribers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"email_lists_id" integer
  );
  
  CREATE TABLE "email_lists_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "email_lists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_email_lists_type" DEFAULT 'private' NOT NULL,
  	"optin" "enum_email_lists_optin" DEFAULT 'single' NOT NULL,
  	"tenant_id" integer,
  	"subscriber_count" numeric DEFAULT 0,
  	"subscription_settings_welcome_email" boolean DEFAULT true,
  	"subscription_settings_welcome_email_template_id" integer,
  	"subscription_settings_confirmation_page" varchar,
  	"category" "enum_email_lists_category",
  	"listmonk_id" numeric,
  	"last_synced_at" timestamp(3) with time zone,
  	"sync_status" "enum_email_lists_sync_status" DEFAULT 'pending',
  	"sync_error" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_templates_variables_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"default_value" varchar,
  	"required" boolean DEFAULT false
  );
  
  CREATE TABLE "email_templates_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "email_templates_test_settings_test_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_email_templates_type" DEFAULT 'campaign' NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"default_subject" varchar,
  	"preheader" varchar,
  	"use_visual_editor" boolean DEFAULT true,
  	"grapes_data" jsonb,
  	"html" varchar NOT NULL,
  	"tenant_id" integer,
  	"category" "enum_email_templates_category",
  	"test_settings_last_tested_at" timestamp(3) with time zone,
  	"listmonk_id" numeric,
  	"last_synced_at" timestamp(3) with time zone,
  	"sync_status" "enum_email_templates_sync_status" DEFAULT 'pending',
  	"sync_error" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_api_keys_scopes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_email_api_keys_scopes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "email_api_keys_security_allowed_ips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ip" varchar NOT NULL
  );
  
  CREATE TABLE "email_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"key_hash" varchar NOT NULL,
  	"key_prefix" varchar NOT NULL,
  	"environment" "enum_email_api_keys_environment" DEFAULT 'test' NOT NULL,
  	"status" "enum_email_api_keys_status" DEFAULT 'active' NOT NULL,
  	"rate_limit_requests_per_minute" numeric DEFAULT 60 NOT NULL,
  	"rate_limit_requests_per_hour" numeric DEFAULT 1000 NOT NULL,
  	"rate_limit_requests_per_day" numeric DEFAULT 10000 NOT NULL,
  	"usage_total_requests" numeric DEFAULT 0,
  	"usage_last_used_at" timestamp(3) with time zone,
  	"usage_last_used_ip" varchar,
  	"usage_last_used_endpoint" varchar,
  	"security_expires_at" timestamp(3) with time zone,
  	"security_rotated_from" varchar,
  	"security_rotated_at" timestamp(3) with time zone,
  	"tenant_id" integer,
  	"created_by_id" integer,
  	"webhook_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_campaigns_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "email_campaigns_ab_test_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"subject" varchar,
  	"percentage" numeric
  );
  
  CREATE TABLE "email_campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"preheader" varchar,
  	"from_name" varchar,
  	"from_email" varchar,
  	"reply_to" varchar,
  	"content_type" "enum_email_campaigns_content_type" DEFAULT 'template' NOT NULL,
  	"template_id" integer,
  	"template_variables" jsonb,
  	"html" varchar,
  	"segment_rules_enabled" boolean DEFAULT false,
  	"segment_rules_query" varchar,
  	"scheduled_for" timestamp(3) with time zone,
  	"timezone" "enum_email_campaigns_timezone" DEFAULT 'Europe/Amsterdam',
  	"status" "enum_email_campaigns_status" DEFAULT 'draft' NOT NULL,
  	"started_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"stats_sent" numeric DEFAULT 0,
  	"stats_delivered" numeric DEFAULT 0,
  	"stats_bounced" numeric DEFAULT 0,
  	"stats_opened" numeric DEFAULT 0,
  	"stats_clicked" numeric DEFAULT 0,
  	"stats_open_rate" numeric DEFAULT 0,
  	"stats_click_rate" numeric DEFAULT 0,
  	"stats_bounce_rate" numeric DEFAULT 0,
  	"stats_unsubscribed" numeric DEFAULT 0,
  	"tenant_id" integer,
  	"category" "enum_email_campaigns_category",
  	"ab_test_enabled" boolean DEFAULT false,
  	"listmonk_campaign_id" numeric,
  	"last_synced_at" timestamp(3) with time zone,
  	"sync_status" "enum_email_campaigns_sync_status" DEFAULT 'pending',
  	"sync_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_campaigns_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"email_lists_id" integer
  );
  
  CREATE TABLE "automation_rules_conditions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"operator" "enum_automation_rules_conditions_operator" NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "automation_rules_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_automation_rules_actions_type" NOT NULL,
  	"email_template_id" integer,
  	"list_id" integer,
  	"tag_name" varchar,
  	"wait_duration_value" numeric,
  	"wait_duration_unit" "enum_automation_rules_actions_wait_duration_unit" DEFAULT 'hours',
  	"webhook_url" varchar,
  	"webhook_method" "enum_automation_rules_actions_webhook_method" DEFAULT 'POST'
  );
  
  CREATE TABLE "automation_rules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"status" "enum_automation_rules_status" DEFAULT 'draft' NOT NULL,
  	"trigger_event_type" "enum_automation_rules_trigger_event_type" NOT NULL,
  	"trigger_custom_event_name" varchar,
  	"timing_delay_enabled" boolean DEFAULT false,
  	"timing_delay_value" numeric DEFAULT 1,
  	"timing_delay_unit" "enum_automation_rules_timing_delay_unit" DEFAULT 'hours',
  	"timing_max_executions" numeric,
  	"stats_times_triggered" numeric DEFAULT 0,
  	"stats_times_succeeded" numeric DEFAULT 0,
  	"stats_times_failed" numeric DEFAULT 0,
  	"stats_last_triggered" timestamp(3) with time zone,
  	"stats_last_error" varchar,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "automation_flows_entry_conditions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"operator" "enum_automation_flows_entry_conditions_operator" NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "automation_flows_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_automation_flows_steps_type" NOT NULL,
  	"email_template_id" integer,
  	"wait_duration_value" numeric DEFAULT 1,
  	"wait_duration_unit" "enum_automation_flows_steps_wait_duration_unit" DEFAULT 'days',
  	"list_id" integer,
  	"tag_name" varchar,
  	"condition_field" varchar,
  	"condition_operator" "enum_automation_flows_steps_condition_operator",
  	"condition_value" varchar,
  	"condition_if_true" numeric,
  	"condition_if_false" numeric,
  	"webhook_url" varchar,
  	"exit_reason" varchar
  );
  
  CREATE TABLE "automation_flows_exit_conditions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event_type" "enum_automation_flows_exit_conditions_event_type",
  	"custom_event_name" varchar
  );
  
  CREATE TABLE "automation_flows" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"status" "enum_automation_flows_status" DEFAULT 'draft' NOT NULL,
  	"entry_trigger_event_type" "enum_automation_flows_entry_trigger_event_type" NOT NULL,
  	"entry_trigger_custom_event_name" varchar,
  	"stats_total_entries" numeric DEFAULT 0,
  	"stats_active_instances" numeric DEFAULT 0,
  	"stats_completed_instances" numeric DEFAULT 0,
  	"stats_exited_instances" numeric DEFAULT 0,
  	"stats_last_entry" timestamp(3) with time zone,
  	"settings_allow_reentry" boolean DEFAULT false,
  	"settings_max_entries_per_user" numeric,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "flow_instances_step_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_index" numeric NOT NULL,
  	"step_name" varchar NOT NULL,
  	"step_type" varchar NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"success" boolean DEFAULT true,
  	"error" varchar,
  	"metadata" jsonb
  );
  
  CREATE TABLE "flow_instances" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"flow_id" integer NOT NULL,
  	"subscriber_id" integer NOT NULL,
  	"status" "enum_flow_instances_status" DEFAULT 'active' NOT NULL,
  	"current_step" numeric DEFAULT 0 NOT NULL,
  	"current_step_name" varchar,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"next_step_scheduled_at" timestamp(3) with time zone,
  	"entry_event_data" jsonb,
  	"exit_reason" varchar,
  	"last_error" varchar,
  	"retry_count" numeric DEFAULT 0,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_email_events_type" NOT NULL,
  	"campaign_id" integer,
  	"subscriber_id" integer NOT NULL,
  	"template_id" integer,
  	"message_id" varchar,
  	"subject" varchar,
  	"recipient_email" varchar NOT NULL,
  	"clicked_url" varchar,
  	"bounce_type" "enum_email_events_bounce_type",
  	"bounce_reason" varchar,
  	"failure_reason" varchar,
  	"metadata" jsonb,
  	"source" "enum_email_events_source" DEFAULT 'campaign',
  	"tenant_id" integer,
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
  	"features_volume_pricing" boolean DEFAULT false,
  	"features_compare_products" boolean DEFAULT false,
  	"features_quick_order" boolean DEFAULT false,
  	"features_brands" boolean DEFAULT false,
  	"features_recently_viewed" boolean DEFAULT false,
  	"features_product_reviews" boolean DEFAULT false,
  	"features_cart" boolean DEFAULT true,
  	"features_mini_cart" boolean DEFAULT false,
  	"features_free_shipping_bar" boolean DEFAULT false,
  	"features_checkout" boolean DEFAULT true,
  	"features_guest_checkout" boolean DEFAULT false,
  	"features_invoices" boolean DEFAULT false,
  	"features_order_tracking" boolean DEFAULT false,
  	"features_my_account" boolean DEFAULT true,
  	"features_returns" boolean DEFAULT false,
  	"features_recurring_orders" boolean DEFAULT false,
  	"features_order_lists" boolean DEFAULT false,
  	"features_addresses" boolean DEFAULT false,
  	"features_account_invoices" boolean DEFAULT false,
  	"features_notifications" boolean DEFAULT false,
  	"features_b2b" boolean DEFAULT false,
  	"features_customer_groups" boolean DEFAULT false,
  	"features_group_pricing" boolean DEFAULT false,
  	"features_barcode_scanner" boolean DEFAULT false,
  	"features_vendors" boolean DEFAULT false,
  	"features_vendor_reviews" boolean DEFAULT false,
  	"features_workshops" boolean DEFAULT false,
  	"features_subscriptions" boolean DEFAULT false,
  	"features_gift_vouchers" boolean DEFAULT false,
  	"features_licenses" boolean DEFAULT false,
  	"features_loyalty" boolean DEFAULT false,
  	"features_blog" boolean DEFAULT true,
  	"features_faq" boolean DEFAULT true,
  	"features_testimonials" boolean DEFAULT true,
  	"features_cases" boolean DEFAULT false,
  	"features_partners" boolean DEFAULT false,
  	"features_services" boolean DEFAULT false,
  	"features_wishlists" boolean DEFAULT false,
  	"features_multi_language" boolean DEFAULT false,
  	"features_ai_content" boolean DEFAULT false,
  	"features_search" boolean DEFAULT false,
  	"features_newsletter" boolean DEFAULT false,
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
  	"cookie_consents_id" integer,
  	"partners_id" integer,
  	"services_id" integer,
  	"notifications_id" integer,
  	"themes_id" integer,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"brands_id" integer,
  	"recently_viewed_id" integer,
  	"edition_notifications_id" integer,
  	"customers_id" integer,
  	"customer_groups_id" integer,
  	"addresses_id" integer,
  	"carts_id" integer,
  	"orders_id" integer,
  	"order_lists_id" integer,
  	"recurring_orders_id" integer,
  	"invoices_id" integer,
  	"returns_id" integer,
  	"stock_reservations_id" integer,
  	"subscription_plans_id" integer,
  	"user_subscriptions_id" integer,
  	"payment_methods_id" integer,
  	"gift_vouchers_id" integer,
  	"licenses_id" integer,
  	"license_activations_id" integer,
  	"loyalty_tiers_id" integer,
  	"loyalty_rewards_id" integer,
  	"loyalty_points_id" integer,
  	"loyalty_transactions_id" integer,
  	"loyalty_redemptions_id" integer,
  	"ab_tests_id" integer,
  	"ab_test_results_id" integer,
  	"blog_posts_id" integer,
  	"blog_categories_id" integer,
  	"faqs_id" integer,
  	"cases_id" integer,
  	"testimonials_id" integer,
  	"vendors_id" integer,
  	"vendor_reviews_id" integer,
  	"workshops_id" integer,
  	"construction_services_id" integer,
  	"construction_projects_id" integer,
  	"construction_reviews_id" integer,
  	"quote_requests_id" integer,
  	"treatments_id" integer,
  	"practitioners_id" integer,
  	"appointments_id" integer,
  	"beauty_services_id" integer,
  	"stylists_id" integer,
  	"beauty_bookings_id" integer,
  	"menu_items_id" integer,
  	"reservations_id" integer,
  	"events_id" integer,
  	"email_subscribers_id" integer,
  	"email_lists_id" integer,
  	"email_templates_id" integer,
  	"email_api_keys_id" integer,
  	"email_campaigns_id" integer,
  	"automation_rules_id" integer,
  	"automation_flows_id" integer,
  	"flow_instances_id" integer,
  	"email_events_id" integer,
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
  	"users_id" integer,
  	"customers_id" integer
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
  
  CREATE TABLE "settings_shop_filter_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"filter_id" "enum_settings_shop_filter_order_filter_id" NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"display_name" varchar
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
  	"default_cart_template" "enum_settings_default_cart_template" DEFAULT 'template1',
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
  	"enable_guest_checkout" boolean DEFAULT false,
  	"require_b2_b_approval" boolean DEFAULT true,
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
  	"navy" varchar DEFAULT '#0A1628',
  	"navy_light" varchar DEFAULT '#121F33',
  	"teal" varchar DEFAULT '#00897B',
  	"teal_light" varchar DEFAULT '#26A69A',
  	"teal_dark" varchar DEFAULT '#00695C',
  	"green" varchar DEFAULT '#00C853',
  	"coral" varchar DEFAULT '#FF6B6B',
  	"amber" varchar DEFAULT '#F59E0B',
  	"blue" varchar DEFAULT '#2196F3',
  	"purple" varchar DEFAULT '#7C3AED',
  	"white" varchar DEFAULT '#FAFBFC',
  	"bg" varchar DEFAULT '#F5F7FA',
  	"grey" varchar DEFAULT '#E8ECF1',
  	"grey_mid" varchar DEFAULT '#94A3B8',
  	"grey_dark" varchar DEFAULT '#64748B',
  	"text" varchar DEFAULT '#1E293B',
  	"font_body" varchar DEFAULT '''Plus Jakarta Sans'', ''DM Sans'', system-ui, sans-serif',
  	"font_display" varchar DEFAULT '''DM Serif Display'', Georgia, serif',
  	"font_mono" varchar DEFAULT '''JetBrains Mono'', ''Courier New'', monospace',
  	"hero_size" numeric DEFAULT 36,
  	"section_size" numeric DEFAULT 24,
  	"card_title_size" numeric DEFAULT 18,
  	"body_lg_size" numeric DEFAULT 15,
  	"body_size" numeric DEFAULT 13,
  	"small_size" numeric DEFAULT 12,
  	"label_size" numeric DEFAULT 10,
  	"micro_size" numeric DEFAULT 8,
  	"sp1" numeric DEFAULT 4 NOT NULL,
  	"sp2" numeric DEFAULT 8 NOT NULL,
  	"sp3" numeric DEFAULT 12 NOT NULL,
  	"sp4" numeric DEFAULT 16 NOT NULL,
  	"sp6" numeric DEFAULT 24 NOT NULL,
  	"sp8" numeric DEFAULT 32 NOT NULL,
  	"sp12" numeric DEFAULT 48 NOT NULL,
  	"sp16" numeric DEFAULT 64 NOT NULL,
  	"sp20" numeric DEFAULT 80 NOT NULL,
  	"primary_gradient" varchar DEFAULT 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
  	"secondary_gradient" varchar DEFAULT 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)',
  	"hero_gradient" varchar DEFAULT 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)',
  	"accent_gradient" varchar DEFAULT 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
  	"container_width" "enum_theme_container_width" DEFAULT '7xl' NOT NULL,
  	"radius_sm" numeric DEFAULT 8 NOT NULL,
  	"radius_md" numeric DEFAULT 12 NOT NULL,
  	"radius_lg" numeric DEFAULT 16 NOT NULL,
  	"radius_xl" numeric DEFAULT 20 NOT NULL,
  	"radius_full" numeric DEFAULT 9999 NOT NULL,
  	"shadow_sm" varchar DEFAULT '0 1px 3px rgba(10, 22, 40, 0.06)' NOT NULL,
  	"shadow_md" varchar DEFAULT '0 4px 20px rgba(10, 22, 40, 0.08)' NOT NULL,
  	"shadow_lg" varchar DEFAULT '0 8px 40px rgba(10, 22, 40, 0.12)' NOT NULL,
  	"shadow_xl" varchar DEFAULT '0 20px 60px rgba(10, 22, 40, 0.16)' NOT NULL,
  	"z_dropdown" numeric DEFAULT 100 NOT NULL,
  	"z_sticky" numeric DEFAULT 200 NOT NULL,
  	"z_overlay" numeric DEFAULT 300 NOT NULL,
  	"z_modal" numeric DEFAULT 400 NOT NULL,
  	"z_toast" numeric DEFAULT 500 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_topbar_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_header_topbar_messages_icon",
  	"text" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "header_topbar_right_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"icon" "enum_header_topbar_right_links_icon"
  );
  
  CREATE TABLE "header_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"label" varchar,
  	"flag" varchar,
  	"is_default" boolean DEFAULT false
  );
  
  CREATE TABLE "header_special_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_header_special_nav_items_icon",
  	"url" varchar NOT NULL,
  	"highlight" boolean DEFAULT false,
  	"position" "enum_header_special_nav_items_position" DEFAULT 'end'
  );
  
  CREATE TABLE "header_manual_nav_items_mega_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "header_manual_nav_items_mega_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "header_manual_nav_items_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer
  );
  
  CREATE TABLE "header_manual_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_header_manual_nav_items_icon",
  	"type" "enum_header_manual_nav_items_type" DEFAULT 'page',
  	"page_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "header_search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" "enum_header_search_categories_icon"
  );
  
  CREATE TABLE "header_custom_action_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_header_custom_action_buttons_icon" NOT NULL,
  	"url" varchar NOT NULL,
  	"show_badge" boolean DEFAULT false,
  	"show_on_mobile" boolean DEFAULT true,
  	"style" "enum_header_custom_action_buttons_style" DEFAULT 'default'
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_type" "enum_header_layout_type" DEFAULT 'mega-nav' NOT NULL,
  	"show_topbar" boolean DEFAULT true,
  	"show_alert_bar" boolean DEFAULT false,
  	"show_navigation" boolean DEFAULT true,
  	"show_search_bar" boolean DEFAULT true,
  	"topbar_enabled" boolean DEFAULT true,
  	"topbar_bg_color" varchar DEFAULT 'var(--color-primary)',
  	"topbar_text_color" varchar DEFAULT 'var(--color-white)',
  	"enable_language_switcher" boolean DEFAULT false,
  	"enable_price_toggle" boolean DEFAULT false,
  	"price_toggle_default_mode" "enum_header_price_toggle_default_mode" DEFAULT 'b2c',
  	"price_toggle_b2c_label" varchar DEFAULT 'Particulier',
  	"price_toggle_b2b_label" varchar DEFAULT 'Zakelijk',
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
  	"logo_id" integer,
  	"logo_height" numeric DEFAULT 32,
  	"logo_url" varchar DEFAULT '/',
  	"site_name" varchar,
  	"site_name_accent" varchar,
  	"show_logo_on_mobile" boolean DEFAULT true,
  	"navigation_mode" "enum_header_navigation_mode" DEFAULT 'manual' NOT NULL,
  	"category_navigation_show_category_icons" boolean DEFAULT true,
  	"category_navigation_show_product_count" boolean DEFAULT true,
  	"category_navigation_mega_menu_style" "enum_header_category_navigation_mega_menu_style" DEFAULT 'subcategories',
  	"category_navigation_max_categories" numeric DEFAULT 8,
  	"category_navigation_max_products_in_mega" numeric DEFAULT 3,
  	"cta_button_enabled" boolean DEFAULT false,
  	"cta_button_text" varchar DEFAULT 'Contact',
  	"cta_button_link" varchar DEFAULT '/contact',
  	"cta_button_style" "enum_header_cta_button_style" DEFAULT 'primary',
  	"search_enabled" boolean DEFAULT true,
  	"search_placeholder" varchar DEFAULT 'Zoeken naar producten...',
  	"search_keyboard_shortcut" varchar DEFAULT '⌘K',
  	"enable_search_overlay" boolean DEFAULT true,
  	"enable_search_suggestions" boolean DEFAULT true,
  	"show_phone_button" boolean DEFAULT true,
  	"show_cart_button" boolean DEFAULT true,
  	"show_account_button" boolean DEFAULT true,
  	"show_wishlist_button" boolean DEFAULT false,
  	"mobile_drawer_width" numeric DEFAULT 320,
  	"mobile_drawer_position" "enum_header_mobile_drawer_position" DEFAULT 'left',
  	"show_mobile_contact_info" boolean DEFAULT true,
  	"mobile_contact_info_phone" varchar,
  	"mobile_contact_info_email" varchar,
  	"show_mobile_toggles" boolean DEFAULT true,
  	"mobile_breakpoint" numeric DEFAULT 768,
  	"use_theme_colors" boolean DEFAULT true,
  	"header_bg_color" varchar DEFAULT 'var(--color-white)',
  	"nav_bg_color" varchar DEFAULT 'var(--color-primary)',
  	"nav_text_color" varchar DEFAULT 'var(--color-white)',
  	"sticky_header_bg" varchar,
  	"sticky_header_shadow" boolean DEFAULT true,
  	"sticky_header" boolean DEFAULT true,
  	"sticky_behavior" "enum_header_sticky_behavior" DEFAULT 'always',
  	"hide_topbar_on_scroll" boolean DEFAULT false,
  	"enable_animations" boolean DEFAULT true,
  	"dropdown_open_delay" numeric DEFAULT 150,
  	"dropdown_close_delay" numeric DEFAULT 300,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" varchar,
  	"type" "enum_footer_columns_links_type" DEFAULT 'page',
  	"page_id" integer,
  	"external_url" varchar
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "footer_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_footer_trust_badges_icon" DEFAULT 'check',
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_footer_legal_links_type" DEFAULT 'page',
  	"page_id" integer,
  	"external_url" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_type" "enum_footer_logo_type" DEFAULT 'text',
  	"logo_text" varchar,
  	"logo_accent" varchar,
  	"logo_image_id" integer,
  	"tagline" varchar,
  	"show_contact_column" boolean DEFAULT true,
  	"contact_heading" varchar DEFAULT 'Contact',
  	"phone" varchar,
  	"email" varchar,
  	"address" varchar,
  	"opening_hours" varchar,
  	"copyright_text" varchar DEFAULT '© 2026 Compass B.V. — Alle rechten voorbehouden',
  	"bottom_text" jsonb,
  	"show_social_links" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
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
  
  ALTER TABLE "users_addresses" ADD CONSTRAINT "users_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_favorites" ADD CONSTRAINT "users_favorites_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_favorites" ADD CONSTRAINT "users_favorites_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_buttons" ADD CONSTRAINT "pages_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block_buttons" ADD CONSTRAINT "pages_blocks_media_block_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column" ADD CONSTRAINT "pages_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid" ADD CONSTRAINT "pages_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quick_order" ADD CONSTRAINT "pages_blocks_quick_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_buttons" ADD CONSTRAINT "pages_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_calltoaction" ADD CONSTRAINT "pages_blocks_calltoaction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_opening_hours" ADD CONSTRAINT "pages_blocks_contact_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_services" ADD CONSTRAINT "pages_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cases" ADD CONSTRAINT "pages_blocks_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_bar_logos" ADD CONSTRAINT "pages_blocks_logo_bar_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_bar_logos" ADD CONSTRAINT "pages_blocks_logo_bar_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_bar" ADD CONSTRAINT "pages_blocks_logo_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_faqs" ADD CONSTRAINT "pages_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_items" ADD CONSTRAINT "pages_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_preview" ADD CONSTRAINT "pages_blocks_blog_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_columns" ADD CONSTRAINT "pages_blocks_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows_values" ADD CONSTRAINT "pages_blocks_comparison_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows" ADD CONSTRAINT "pages_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison" ADD CONSTRAINT "pages_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_infobox" ADD CONSTRAINT "pages_blocks_infobox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_code" ADD CONSTRAINT "pages_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map" ADD CONSTRAINT "pages_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_banner" ADD CONSTRAINT "_pages_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block_buttons" ADD CONSTRAINT "_pages_v_blocks_media_block_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column" ADD CONSTRAINT "_pages_v_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid" ADD CONSTRAINT "_pages_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quick_order" ADD CONSTRAINT "_pages_v_blocks_quick_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_calltoaction" ADD CONSTRAINT "_pages_v_blocks_calltoaction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_opening_hours" ADD CONSTRAINT "_pages_v_blocks_contact_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_features" ADD CONSTRAINT "_pages_v_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_services" ADD CONSTRAINT "_pages_v_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cases" ADD CONSTRAINT "_pages_v_blocks_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_bar_logos" ADD CONSTRAINT "_pages_v_blocks_logo_bar_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_bar_logos" ADD CONSTRAINT "_pages_v_blocks_logo_bar_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_bar" ADD CONSTRAINT "_pages_v_blocks_logo_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_items" ADD CONSTRAINT "_pages_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_preview" ADD CONSTRAINT "_pages_v_blocks_blog_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_columns" ADD CONSTRAINT "_pages_v_blocks_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows_values" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison" ADD CONSTRAINT "_pages_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infobox" ADD CONSTRAINT "_pages_v_blocks_infobox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_code" ADD CONSTRAINT "_pages_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map" ADD CONSTRAINT "_pages_v_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_icon_upload_id_media_id_fk" FOREIGN KEY ("icon_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_order_id_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_product_id_products_id_fk" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_invoice_id_invoices_id_fk" FOREIGN KEY ("related_invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_recurring_order_id_recurring_orders_id_fk" FOREIGN KEY ("related_recurring_order_id") REFERENCES "public"."recurring_orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_return_id_returns_id_fk" FOREIGN KEY ("related_return_id") REFERENCES "public"."returns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes_custom_colors" ADD CONSTRAINT "themes_custom_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_promo_banner_image_id_media_id_fk" FOREIGN KEY ("promo_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edition_notifications" ADD CONSTRAINT "edition_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edition_notifications" ADD CONSTRAINT "edition_notifications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_customer_group_id_customer_groups_id_fk" FOREIGN KEY ("customer_group_id") REFERENCES "public"."customer_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts_coupons" ADD CONSTRAINT "carts_coupons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_group_id_customer_groups_id_fk" FOREIGN KEY ("customer_group_id") REFERENCES "public"."customer_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_converted_to_order_id_orders_id_fk" FOREIGN KEY ("converted_to_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_texts" ADD CONSTRAINT "orders_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_lists_items" ADD CONSTRAINT "order_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_lists_share_with" ADD CONSTRAINT "order_lists_share_with_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_lists" ADD CONSTRAINT "order_lists_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recurring_orders_items" ADD CONSTRAINT "recurring_orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recurring_orders_items" ADD CONSTRAINT "recurring_orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recurring_orders" ADD CONSTRAINT "recurring_orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recurring_orders_rels" ADD CONSTRAINT "recurring_orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recurring_orders_rels" ADD CONSTRAINT "recurring_orders_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices_items" ADD CONSTRAINT "invoices_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_pdf_file_id_media_id_fk" FOREIGN KEY ("pdf_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns" ADD CONSTRAINT "returns_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns" ADD CONSTRAINT "returns_replacement_order_id_orders_id_fk" FOREIGN KEY ("replacement_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_converted_to_order_id_orders_id_fk" FOREIGN KEY ("converted_to_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "ab_tests_variants" ADD CONSTRAINT "ab_tests_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_test_id_ab_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ab_tests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_user_id_id_users_id_fk" FOREIGN KEY ("user_id_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "email_subscribers_tags" ADD CONSTRAINT "email_subscribers_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_subscribers" ADD CONSTRAINT "email_subscribers_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_subscribers_rels" ADD CONSTRAINT "email_subscribers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."email_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_subscribers_rels" ADD CONSTRAINT "email_subscribers_rels_email_lists_fk" FOREIGN KEY ("email_lists_id") REFERENCES "public"."email_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_lists_tags" ADD CONSTRAINT "email_lists_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_lists" ADD CONSTRAINT "email_lists_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_lists" ADD CONSTRAINT "email_lists_subscription_settings_welcome_email_template_id_email_templates_id_fk" FOREIGN KEY ("subscription_settings_welcome_email_template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_templates_variables_list" ADD CONSTRAINT "email_templates_variables_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_templates_tags" ADD CONSTRAINT "email_templates_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_templates_test_settings_test_recipients" ADD CONSTRAINT "email_templates_test_settings_test_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_api_keys_scopes" ADD CONSTRAINT "email_api_keys_scopes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."email_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_api_keys_security_allowed_ips" ADD CONSTRAINT "email_api_keys_security_allowed_ips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_api_keys" ADD CONSTRAINT "email_api_keys_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_api_keys" ADD CONSTRAINT "email_api_keys_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_campaigns_tags" ADD CONSTRAINT "email_campaigns_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_campaigns_ab_test_variants" ADD CONSTRAINT "email_campaigns_ab_test_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_campaigns_rels" ADD CONSTRAINT "email_campaigns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."email_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_campaigns_rels" ADD CONSTRAINT "email_campaigns_rels_email_lists_fk" FOREIGN KEY ("email_lists_id") REFERENCES "public"."email_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_rules_conditions" ADD CONSTRAINT "automation_rules_conditions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_rules_actions" ADD CONSTRAINT "automation_rules_actions_email_template_id_email_templates_id_fk" FOREIGN KEY ("email_template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "automation_rules_actions" ADD CONSTRAINT "automation_rules_actions_list_id_email_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."email_lists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "automation_rules_actions" ADD CONSTRAINT "automation_rules_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "automation_flows_entry_conditions" ADD CONSTRAINT "automation_flows_entry_conditions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_flows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_flows_steps" ADD CONSTRAINT "automation_flows_steps_email_template_id_email_templates_id_fk" FOREIGN KEY ("email_template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "automation_flows_steps" ADD CONSTRAINT "automation_flows_steps_list_id_email_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."email_lists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "automation_flows_steps" ADD CONSTRAINT "automation_flows_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_flows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_flows_exit_conditions" ADD CONSTRAINT "automation_flows_exit_conditions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_flows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_flows" ADD CONSTRAINT "automation_flows_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "flow_instances_step_history" ADD CONSTRAINT "flow_instances_step_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flow_instances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flow_instances" ADD CONSTRAINT "flow_instances_flow_id_automation_flows_id_fk" FOREIGN KEY ("flow_id") REFERENCES "public"."automation_flows"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "flow_instances" ADD CONSTRAINT "flow_instances_subscriber_id_email_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."email_subscribers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "flow_instances" ADD CONSTRAINT "flow_instances_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_events" ADD CONSTRAINT "email_events_campaign_id_email_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."email_campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_events" ADD CONSTRAINT "email_events_subscriber_id_email_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."email_subscribers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_events" ADD CONSTRAINT "email_events_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_events" ADD CONSTRAINT "email_events_tenant_id_clients_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cookie_consents_fk" FOREIGN KEY ("cookie_consents_id") REFERENCES "public"."cookie_consents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recently_viewed_fk" FOREIGN KEY ("recently_viewed_id") REFERENCES "public"."recently_viewed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_edition_notifications_fk" FOREIGN KEY ("edition_notifications_id") REFERENCES "public"."edition_notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customer_groups_fk" FOREIGN KEY ("customer_groups_id") REFERENCES "public"."customer_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_addresses_fk" FOREIGN KEY ("addresses_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carts_fk" FOREIGN KEY ("carts_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_lists_fk" FOREIGN KEY ("order_lists_id") REFERENCES "public"."order_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recurring_orders_fk" FOREIGN KEY ("recurring_orders_id") REFERENCES "public"."recurring_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_returns_fk" FOREIGN KEY ("returns_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stock_reservations_fk" FOREIGN KEY ("stock_reservations_id") REFERENCES "public"."stock_reservations"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ab_tests_fk" FOREIGN KEY ("ab_tests_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ab_test_results_fk" FOREIGN KEY ("ab_test_results_id") REFERENCES "public"."ab_test_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendor_reviews_fk" FOREIGN KEY ("vendor_reviews_id") REFERENCES "public"."vendor_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workshops_fk" FOREIGN KEY ("workshops_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_services_fk" FOREIGN KEY ("construction_services_id") REFERENCES "public"."construction_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_projects_fk" FOREIGN KEY ("construction_projects_id") REFERENCES "public"."construction_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_construction_reviews_fk" FOREIGN KEY ("construction_reviews_id") REFERENCES "public"."construction_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quote_requests_fk" FOREIGN KEY ("quote_requests_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_practitioners_fk" FOREIGN KEY ("practitioners_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_beauty_services_fk" FOREIGN KEY ("beauty_services_id") REFERENCES "public"."beauty_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stylists_fk" FOREIGN KEY ("stylists_id") REFERENCES "public"."stylists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_beauty_bookings_fk" FOREIGN KEY ("beauty_bookings_id") REFERENCES "public"."beauty_bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_fk" FOREIGN KEY ("reservations_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_subscribers_fk" FOREIGN KEY ("email_subscribers_id") REFERENCES "public"."email_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_lists_fk" FOREIGN KEY ("email_lists_id") REFERENCES "public"."email_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_templates_fk" FOREIGN KEY ("email_templates_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_api_keys_fk" FOREIGN KEY ("email_api_keys_id") REFERENCES "public"."email_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_campaigns_fk" FOREIGN KEY ("email_campaigns_id") REFERENCES "public"."email_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_automation_rules_fk" FOREIGN KEY ("automation_rules_id") REFERENCES "public"."automation_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_automation_flows_fk" FOREIGN KEY ("automation_flows_id") REFERENCES "public"."automation_flows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_flow_instances_fk" FOREIGN KEY ("flow_instances_id") REFERENCES "public"."flow_instances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_events_fk" FOREIGN KEY ("email_events_id") REFERENCES "public"."email_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_requests_fk" FOREIGN KEY ("client_requests_id") REFERENCES "public"."client_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deployments_fk" FOREIGN KEY ("deployments_id") REFERENCES "public"."deployments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_hours" ADD CONSTRAINT "settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_shop_filter_order" ADD CONSTRAINT "settings_shop_filter_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_sitemap_exclude" ADD CONSTRAINT "settings_sitemap_exclude_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_robots_disallow" ADD CONSTRAINT "settings_robots_disallow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_white_id_media_id_fk" FOREIGN KEY ("logo_white_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_default_o_g_image_id_media_id_fk" FOREIGN KEY ("default_o_g_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_topbar_messages" ADD CONSTRAINT "header_topbar_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_topbar_right_links" ADD CONSTRAINT "header_topbar_right_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_languages" ADD CONSTRAINT "header_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_special_nav_items" ADD CONSTRAINT "header_special_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_manual_nav_items_mega_columns_links" ADD CONSTRAINT "header_manual_nav_items_mega_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_manual_nav_items_mega_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_manual_nav_items_mega_columns" ADD CONSTRAINT "header_manual_nav_items_mega_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_manual_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_manual_nav_items_sub_items" ADD CONSTRAINT "header_manual_nav_items_sub_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_manual_nav_items_sub_items" ADD CONSTRAINT "header_manual_nav_items_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_manual_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_manual_nav_items" ADD CONSTRAINT "header_manual_nav_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_manual_nav_items" ADD CONSTRAINT "header_manual_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_search_categories" ADD CONSTRAINT "header_search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_custom_action_buttons" ADD CONSTRAINT "header_custom_action_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_trust_badges" ADD CONSTRAINT "footer_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_image_id_media_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  CREATE INDEX "pages_blocks_banner_order_idx" ON "pages_blocks_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_banner_parent_id_idx" ON "pages_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_path_idx" ON "pages_blocks_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_buttons_order_idx" ON "pages_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_buttons_parent_id_idx" ON "pages_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_background_image_idx" ON "pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_buttons_order_idx" ON "pages_blocks_media_block_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_buttons_parent_id_idx" ON "pages_blocks_media_block_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
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
  CREATE INDEX "pages_blocks_quick_order_order_idx" ON "pages_blocks_quick_order" USING btree ("_order");
  CREATE INDEX "pages_blocks_quick_order_parent_id_idx" ON "pages_blocks_quick_order" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quick_order_path_idx" ON "pages_blocks_quick_order" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_buttons_order_idx" ON "pages_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_buttons_parent_id_idx" ON "pages_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_calltoaction_order_idx" ON "pages_blocks_calltoaction" USING btree ("_order");
  CREATE INDEX "pages_blocks_calltoaction_parent_id_idx" ON "pages_blocks_calltoaction" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_calltoaction_path_idx" ON "pages_blocks_calltoaction" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_opening_hours_order_idx" ON "pages_blocks_contact_opening_hours" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_opening_hours_parent_id_idx" ON "pages_blocks_contact_opening_hours" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_services_order_idx" ON "pages_blocks_services_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_services_parent_id_idx" ON "pages_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_order_idx" ON "pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "pages_blocks_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_avatar_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("avatar_id");
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
  CREATE INDEX "pages_blocks_faq_faqs_order_idx" ON "pages_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_faqs_parent_id_idx" ON "pages_blocks_faq_faqs" USING btree ("_parent_id");
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
  CREATE INDEX "pages_blocks_comparison_columns_order_idx" ON "pages_blocks_comparison_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_columns_parent_id_idx" ON "pages_blocks_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_rows_values_order_idx" ON "pages_blocks_comparison_rows_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_rows_values_parent_id_idx" ON "pages_blocks_comparison_rows_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_rows_order_idx" ON "pages_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_rows_parent_id_idx" ON "pages_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_order_idx" ON "pages_blocks_comparison" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_parent_id_idx" ON "pages_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_path_idx" ON "pages_blocks_comparison" USING btree ("_path");
  CREATE INDEX "pages_blocks_infobox_order_idx" ON "pages_blocks_infobox" USING btree ("_order");
  CREATE INDEX "pages_blocks_infobox_parent_id_idx" ON "pages_blocks_infobox" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_infobox_path_idx" ON "pages_blocks_infobox" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_video_file_idx" ON "pages_blocks_video" USING btree ("video_file_id");
  CREATE INDEX "pages_blocks_video_poster_image_idx" ON "pages_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "pages_blocks_code_order_idx" ON "pages_blocks_code" USING btree ("_order");
  CREATE INDEX "pages_blocks_code_parent_id_idx" ON "pages_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_code_path_idx" ON "pages_blocks_code" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_order_idx" ON "pages_blocks_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_parent_id_idx" ON "pages_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_path_idx" ON "pages_blocks_map" USING btree ("_path");
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
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "pages_rels_product_categories_id_idx" ON "pages_rels" USING btree ("product_categories_id");
  CREATE INDEX "pages_rels_cases_id_idx" ON "pages_rels" USING btree ("cases_id");
  CREATE INDEX "pages_rels_blog_posts_id_idx" ON "pages_rels" USING btree ("blog_posts_id");
  CREATE INDEX "pages_rels_construction_services_id_idx" ON "pages_rels" USING btree ("construction_services_id");
  CREATE INDEX "pages_rels_construction_projects_id_idx" ON "pages_rels" USING btree ("construction_projects_id");
  CREATE INDEX "pages_rels_construction_reviews_id_idx" ON "pages_rels" USING btree ("construction_reviews_id");
  CREATE INDEX "_pages_v_blocks_banner_order_idx" ON "_pages_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_banner_parent_id_idx" ON "_pages_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_banner_path_idx" ON "_pages_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_buttons_order_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_buttons_parent_id_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_background_image_idx" ON "_pages_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_buttons_order_idx" ON "_pages_v_blocks_media_block_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_buttons_parent_id_idx" ON "_pages_v_blocks_media_block_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
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
  CREATE INDEX "_pages_v_blocks_quick_order_order_idx" ON "_pages_v_blocks_quick_order" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quick_order_parent_id_idx" ON "_pages_v_blocks_quick_order" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quick_order_path_idx" ON "_pages_v_blocks_quick_order" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_buttons_order_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_buttons_parent_id_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_calltoaction_order_idx" ON "_pages_v_blocks_calltoaction" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_calltoaction_parent_id_idx" ON "_pages_v_blocks_calltoaction" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_calltoaction_path_idx" ON "_pages_v_blocks_calltoaction" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_opening_hours_order_idx" ON "_pages_v_blocks_contact_opening_hours" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_opening_hours_parent_id_idx" ON "_pages_v_blocks_contact_opening_hours" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_features_order_idx" ON "_pages_v_blocks_features_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_features_parent_id_idx" ON "_pages_v_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_services_order_idx" ON "_pages_v_blocks_services_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_services_parent_id_idx" ON "_pages_v_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_order_idx" ON "_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_parent_id_idx" ON "_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_path_idx" ON "_pages_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_avatar_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("avatar_id");
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
  CREATE INDEX "_pages_v_blocks_faq_faqs_order_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_faqs_parent_id_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_parent_id");
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
  CREATE INDEX "_pages_v_blocks_comparison_columns_order_idx" ON "_pages_v_blocks_comparison_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_columns_parent_id_idx" ON "_pages_v_blocks_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_rows_values_order_idx" ON "_pages_v_blocks_comparison_rows_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_rows_values_parent_id_idx" ON "_pages_v_blocks_comparison_rows_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_rows_order_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_rows_parent_id_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_order_idx" ON "_pages_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_parent_id_idx" ON "_pages_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_path_idx" ON "_pages_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_infobox_order_idx" ON "_pages_v_blocks_infobox" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_infobox_parent_id_idx" ON "_pages_v_blocks_infobox" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_infobox_path_idx" ON "_pages_v_blocks_infobox" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_video_file_idx" ON "_pages_v_blocks_video" USING btree ("video_file_id");
  CREATE INDEX "_pages_v_blocks_video_poster_image_idx" ON "_pages_v_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "_pages_v_blocks_code_order_idx" ON "_pages_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_code_parent_id_idx" ON "_pages_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_code_path_idx" ON "_pages_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_map_order_idx" ON "_pages_v_blocks_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_parent_id_idx" ON "_pages_v_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_path_idx" ON "_pages_v_blocks_map" USING btree ("_path");
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
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_rels_product_categories_id_idx" ON "_pages_v_rels" USING btree ("product_categories_id");
  CREATE INDEX "_pages_v_rels_cases_id_idx" ON "_pages_v_rels" USING btree ("cases_id");
  CREATE INDEX "_pages_v_rels_blog_posts_id_idx" ON "_pages_v_rels" USING btree ("blog_posts_id");
  CREATE INDEX "_pages_v_rels_construction_services_id_idx" ON "_pages_v_rels" USING btree ("construction_services_id");
  CREATE INDEX "_pages_v_rels_construction_projects_id_idx" ON "_pages_v_rels" USING btree ("construction_projects_id");
  CREATE INDEX "_pages_v_rels_construction_reviews_id_idx" ON "_pages_v_rels" USING btree ("construction_reviews_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "cookie_consents_session_id_idx" ON "cookie_consents" USING btree ("session_id");
  CREATE INDEX "cookie_consents_updated_at_idx" ON "cookie_consents" USING btree ("updated_at");
  CREATE INDEX "cookie_consents_created_at_idx" ON "cookie_consents" USING btree ("created_at");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "services_icon_upload_idx" ON "services" USING btree ("icon_upload_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");
  CREATE INDEX "notifications_related_order_idx" ON "notifications" USING btree ("related_order_id");
  CREATE INDEX "notifications_related_product_idx" ON "notifications" USING btree ("related_product_id");
  CREATE INDEX "notifications_related_invoice_idx" ON "notifications" USING btree ("related_invoice_id");
  CREATE INDEX "notifications_related_recurring_order_idx" ON "notifications" USING btree ("related_recurring_order_id");
  CREATE INDEX "notifications_related_return_idx" ON "notifications" USING btree ("related_return_id");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "themes_custom_colors_order_idx" ON "themes_custom_colors" USING btree ("_order");
  CREATE INDEX "themes_custom_colors_parent_id_idx" ON "themes_custom_colors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "themes_slug_idx" ON "themes" USING btree ("slug");
  CREATE INDEX "themes_updated_at_idx" ON "themes" USING btree ("updated_at");
  CREATE INDEX "themes_created_at_idx" ON "themes" USING btree ("created_at");
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
  CREATE INDEX "recently_viewed_user_idx" ON "recently_viewed" USING btree ("user_id");
  CREATE INDEX "recently_viewed_product_idx" ON "recently_viewed" USING btree ("product_id");
  CREATE INDEX "recently_viewed_updated_at_idx" ON "recently_viewed" USING btree ("updated_at");
  CREATE INDEX "recently_viewed_created_at_idx" ON "recently_viewed" USING btree ("created_at");
  CREATE INDEX "edition_notifications_user_idx" ON "edition_notifications" USING btree ("user_id");
  CREATE INDEX "edition_notifications_product_idx" ON "edition_notifications" USING btree ("product_id");
  CREATE INDEX "edition_notifications_updated_at_idx" ON "edition_notifications" USING btree ("updated_at");
  CREATE INDEX "edition_notifications_created_at_idx" ON "edition_notifications" USING btree ("created_at");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_customer_group_idx" ON "customers" USING btree ("customer_group_id");
  CREATE INDEX "customers_approved_by_idx" ON "customers" USING btree ("approved_by_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE UNIQUE INDEX "customer_groups_name_idx" ON "customer_groups" USING btree ("name");
  CREATE UNIQUE INDEX "customer_groups_slug_idx" ON "customer_groups" USING btree ("slug");
  CREATE INDEX "customer_groups_updated_at_idx" ON "customer_groups" USING btree ("updated_at");
  CREATE INDEX "customer_groups_created_at_idx" ON "customer_groups" USING btree ("created_at");
  CREATE INDEX "addresses_customer_idx" ON "addresses" USING btree ("customer_id");
  CREATE INDEX "addresses_updated_at_idx" ON "addresses" USING btree ("updated_at");
  CREATE INDEX "addresses_created_at_idx" ON "addresses" USING btree ("created_at");
  CREATE INDEX "carts_items_order_idx" ON "carts_items" USING btree ("_order");
  CREATE INDEX "carts_items_parent_id_idx" ON "carts_items" USING btree ("_parent_id");
  CREATE INDEX "carts_items_product_idx" ON "carts_items" USING btree ("product_id");
  CREATE INDEX "carts_coupons_order_idx" ON "carts_coupons" USING btree ("_order");
  CREATE INDEX "carts_coupons_parent_id_idx" ON "carts_coupons" USING btree ("_parent_id");
  CREATE INDEX "carts_customer_idx" ON "carts" USING btree ("customer_id");
  CREATE INDEX "carts_customer_group_idx" ON "carts" USING btree ("customer_group_id");
  CREATE INDEX "carts_converted_to_order_idx" ON "carts" USING btree ("converted_to_order_id");
  CREATE INDEX "carts_updated_at_idx" ON "carts" USING btree ("updated_at");
  CREATE INDEX "carts_created_at_idx" ON "carts" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "orders_texts_order_parent" ON "orders_texts" USING btree ("order","parent_id");
  CREATE INDEX "order_lists_items_order_idx" ON "order_lists_items" USING btree ("_order");
  CREATE INDEX "order_lists_items_parent_id_idx" ON "order_lists_items" USING btree ("_parent_id");
  CREATE INDEX "order_lists_items_product_idx" ON "order_lists_items" USING btree ("product_id");
  CREATE INDEX "order_lists_share_with_order_idx" ON "order_lists_share_with" USING btree ("_order");
  CREATE INDEX "order_lists_share_with_parent_id_idx" ON "order_lists_share_with" USING btree ("_parent_id");
  CREATE INDEX "order_lists_share_with_user_idx" ON "order_lists_share_with" USING btree ("user_id");
  CREATE INDEX "order_lists_owner_idx" ON "order_lists" USING btree ("owner_id");
  CREATE INDEX "order_lists_updated_at_idx" ON "order_lists" USING btree ("updated_at");
  CREATE INDEX "order_lists_created_at_idx" ON "order_lists" USING btree ("created_at");
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
  CREATE INDEX "invoices_items_order_idx" ON "invoices_items" USING btree ("_order");
  CREATE INDEX "invoices_items_parent_id_idx" ON "invoices_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");
  CREATE INDEX "invoices_order_idx" ON "invoices" USING btree ("order_id");
  CREATE INDEX "invoices_customer_idx" ON "invoices" USING btree ("customer_id");
  CREATE INDEX "invoices_pdf_file_idx" ON "invoices" USING btree ("pdf_file_id");
  CREATE INDEX "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
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
  CREATE INDEX "stock_reservations_product_idx" ON "stock_reservations" USING btree ("product_id");
  CREATE INDEX "stock_reservations_cart_id_idx" ON "stock_reservations" USING btree ("cart_id");
  CREATE INDEX "stock_reservations_session_idx" ON "stock_reservations" USING btree ("session");
  CREATE INDEX "stock_reservations_status_idx" ON "stock_reservations" USING btree ("status");
  CREATE INDEX "stock_reservations_expires_at_idx" ON "stock_reservations" USING btree ("expires_at");
  CREATE INDEX "stock_reservations_converted_to_order_idx" ON "stock_reservations" USING btree ("converted_to_order_id");
  CREATE INDEX "stock_reservations_updated_at_idx" ON "stock_reservations" USING btree ("updated_at");
  CREATE INDEX "stock_reservations_created_at_idx" ON "stock_reservations" USING btree ("created_at");
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
  CREATE INDEX "email_subscribers_tags_order_idx" ON "email_subscribers_tags" USING btree ("_order");
  CREATE INDEX "email_subscribers_tags_parent_id_idx" ON "email_subscribers_tags" USING btree ("_parent_id");
  CREATE INDEX "email_subscribers_email_idx" ON "email_subscribers" USING btree ("email");
  CREATE INDEX "email_subscribers_tenant_idx" ON "email_subscribers" USING btree ("tenant_id");
  CREATE INDEX "email_subscribers_listmonk_id_idx" ON "email_subscribers" USING btree ("listmonk_id");
  CREATE INDEX "email_subscribers_updated_at_idx" ON "email_subscribers" USING btree ("updated_at");
  CREATE INDEX "email_subscribers_created_at_idx" ON "email_subscribers" USING btree ("created_at");
  CREATE INDEX "email_subscribers_rels_order_idx" ON "email_subscribers_rels" USING btree ("order");
  CREATE INDEX "email_subscribers_rels_parent_idx" ON "email_subscribers_rels" USING btree ("parent_id");
  CREATE INDEX "email_subscribers_rels_path_idx" ON "email_subscribers_rels" USING btree ("path");
  CREATE INDEX "email_subscribers_rels_email_lists_id_idx" ON "email_subscribers_rels" USING btree ("email_lists_id");
  CREATE INDEX "email_lists_tags_order_idx" ON "email_lists_tags" USING btree ("_order");
  CREATE INDEX "email_lists_tags_parent_id_idx" ON "email_lists_tags" USING btree ("_parent_id");
  CREATE INDEX "email_lists_tenant_idx" ON "email_lists" USING btree ("tenant_id");
  CREATE INDEX "email_lists_subscription_settings_subscription_settings__idx" ON "email_lists" USING btree ("subscription_settings_welcome_email_template_id");
  CREATE INDEX "email_lists_listmonk_id_idx" ON "email_lists" USING btree ("listmonk_id");
  CREATE INDEX "email_lists_updated_at_idx" ON "email_lists" USING btree ("updated_at");
  CREATE INDEX "email_lists_created_at_idx" ON "email_lists" USING btree ("created_at");
  CREATE INDEX "email_templates_variables_list_order_idx" ON "email_templates_variables_list" USING btree ("_order");
  CREATE INDEX "email_templates_variables_list_parent_id_idx" ON "email_templates_variables_list" USING btree ("_parent_id");
  CREATE INDEX "email_templates_tags_order_idx" ON "email_templates_tags" USING btree ("_order");
  CREATE INDEX "email_templates_tags_parent_id_idx" ON "email_templates_tags" USING btree ("_parent_id");
  CREATE INDEX "email_templates_test_settings_test_recipients_order_idx" ON "email_templates_test_settings_test_recipients" USING btree ("_order");
  CREATE INDEX "email_templates_test_settings_test_recipients_parent_id_idx" ON "email_templates_test_settings_test_recipients" USING btree ("_parent_id");
  CREATE INDEX "email_templates_tenant_idx" ON "email_templates" USING btree ("tenant_id");
  CREATE INDEX "email_templates_listmonk_id_idx" ON "email_templates" USING btree ("listmonk_id");
  CREATE INDEX "email_templates_updated_at_idx" ON "email_templates" USING btree ("updated_at");
  CREATE INDEX "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
  CREATE INDEX "email_api_keys_scopes_order_idx" ON "email_api_keys_scopes" USING btree ("order");
  CREATE INDEX "email_api_keys_scopes_parent_idx" ON "email_api_keys_scopes" USING btree ("parent_id");
  CREATE INDEX "email_api_keys_security_allowed_ips_order_idx" ON "email_api_keys_security_allowed_ips" USING btree ("_order");
  CREATE INDEX "email_api_keys_security_allowed_ips_parent_id_idx" ON "email_api_keys_security_allowed_ips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "email_api_keys_key_hash_idx" ON "email_api_keys" USING btree ("key_hash");
  CREATE INDEX "email_api_keys_tenant_idx" ON "email_api_keys" USING btree ("tenant_id");
  CREATE INDEX "email_api_keys_created_by_idx" ON "email_api_keys" USING btree ("created_by_id");
  CREATE INDEX "email_api_keys_updated_at_idx" ON "email_api_keys" USING btree ("updated_at");
  CREATE INDEX "email_api_keys_created_at_idx" ON "email_api_keys" USING btree ("created_at");
  CREATE INDEX "email_campaigns_tags_order_idx" ON "email_campaigns_tags" USING btree ("_order");
  CREATE INDEX "email_campaigns_tags_parent_id_idx" ON "email_campaigns_tags" USING btree ("_parent_id");
  CREATE INDEX "email_campaigns_ab_test_variants_order_idx" ON "email_campaigns_ab_test_variants" USING btree ("_order");
  CREATE INDEX "email_campaigns_ab_test_variants_parent_id_idx" ON "email_campaigns_ab_test_variants" USING btree ("_parent_id");
  CREATE INDEX "email_campaigns_template_idx" ON "email_campaigns" USING btree ("template_id");
  CREATE INDEX "email_campaigns_tenant_idx" ON "email_campaigns" USING btree ("tenant_id");
  CREATE INDEX "email_campaigns_listmonk_campaign_id_idx" ON "email_campaigns" USING btree ("listmonk_campaign_id");
  CREATE INDEX "email_campaigns_updated_at_idx" ON "email_campaigns" USING btree ("updated_at");
  CREATE INDEX "email_campaigns_created_at_idx" ON "email_campaigns" USING btree ("created_at");
  CREATE INDEX "email_campaigns_rels_order_idx" ON "email_campaigns_rels" USING btree ("order");
  CREATE INDEX "email_campaigns_rels_parent_idx" ON "email_campaigns_rels" USING btree ("parent_id");
  CREATE INDEX "email_campaigns_rels_path_idx" ON "email_campaigns_rels" USING btree ("path");
  CREATE INDEX "email_campaigns_rels_email_lists_id_idx" ON "email_campaigns_rels" USING btree ("email_lists_id");
  CREATE INDEX "automation_rules_conditions_order_idx" ON "automation_rules_conditions" USING btree ("_order");
  CREATE INDEX "automation_rules_conditions_parent_id_idx" ON "automation_rules_conditions" USING btree ("_parent_id");
  CREATE INDEX "automation_rules_actions_order_idx" ON "automation_rules_actions" USING btree ("_order");
  CREATE INDEX "automation_rules_actions_parent_id_idx" ON "automation_rules_actions" USING btree ("_parent_id");
  CREATE INDEX "automation_rules_actions_email_template_idx" ON "automation_rules_actions" USING btree ("email_template_id");
  CREATE INDEX "automation_rules_actions_list_idx" ON "automation_rules_actions" USING btree ("list_id");
  CREATE INDEX "automation_rules_tenant_idx" ON "automation_rules" USING btree ("tenant_id");
  CREATE INDEX "automation_rules_updated_at_idx" ON "automation_rules" USING btree ("updated_at");
  CREATE INDEX "automation_rules_created_at_idx" ON "automation_rules" USING btree ("created_at");
  CREATE INDEX "automation_flows_entry_conditions_order_idx" ON "automation_flows_entry_conditions" USING btree ("_order");
  CREATE INDEX "automation_flows_entry_conditions_parent_id_idx" ON "automation_flows_entry_conditions" USING btree ("_parent_id");
  CREATE INDEX "automation_flows_steps_order_idx" ON "automation_flows_steps" USING btree ("_order");
  CREATE INDEX "automation_flows_steps_parent_id_idx" ON "automation_flows_steps" USING btree ("_parent_id");
  CREATE INDEX "automation_flows_steps_email_template_idx" ON "automation_flows_steps" USING btree ("email_template_id");
  CREATE INDEX "automation_flows_steps_list_idx" ON "automation_flows_steps" USING btree ("list_id");
  CREATE INDEX "automation_flows_exit_conditions_order_idx" ON "automation_flows_exit_conditions" USING btree ("_order");
  CREATE INDEX "automation_flows_exit_conditions_parent_id_idx" ON "automation_flows_exit_conditions" USING btree ("_parent_id");
  CREATE INDEX "automation_flows_tenant_idx" ON "automation_flows" USING btree ("tenant_id");
  CREATE INDEX "automation_flows_updated_at_idx" ON "automation_flows" USING btree ("updated_at");
  CREATE INDEX "automation_flows_created_at_idx" ON "automation_flows" USING btree ("created_at");
  CREATE INDEX "flow_instances_step_history_order_idx" ON "flow_instances_step_history" USING btree ("_order");
  CREATE INDEX "flow_instances_step_history_parent_id_idx" ON "flow_instances_step_history" USING btree ("_parent_id");
  CREATE INDEX "flow_instances_flow_idx" ON "flow_instances" USING btree ("flow_id");
  CREATE INDEX "flow_instances_subscriber_idx" ON "flow_instances" USING btree ("subscriber_id");
  CREATE INDEX "flow_instances_tenant_idx" ON "flow_instances" USING btree ("tenant_id");
  CREATE INDEX "flow_instances_updated_at_idx" ON "flow_instances" USING btree ("updated_at");
  CREATE INDEX "flow_instances_created_at_idx" ON "flow_instances" USING btree ("created_at");
  CREATE INDEX "email_events_campaign_idx" ON "email_events" USING btree ("campaign_id");
  CREATE INDEX "email_events_subscriber_idx" ON "email_events" USING btree ("subscriber_id");
  CREATE INDEX "email_events_template_idx" ON "email_events" USING btree ("template_id");
  CREATE INDEX "email_events_tenant_idx" ON "email_events" USING btree ("tenant_id");
  CREATE INDEX "email_events_updated_at_idx" ON "email_events" USING btree ("updated_at");
  CREATE INDEX "email_events_created_at_idx" ON "email_events" USING btree ("created_at");
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
  CREATE INDEX "payload_locked_documents_rels_cookie_consents_id_idx" ON "payload_locked_documents_rels" USING btree ("cookie_consents_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_themes_id_idx" ON "payload_locked_documents_rels" USING btree ("themes_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_recently_viewed_id_idx" ON "payload_locked_documents_rels" USING btree ("recently_viewed_id");
  CREATE INDEX "payload_locked_documents_rels_edition_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("edition_notifications_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_customer_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("customer_groups_id");
  CREATE INDEX "payload_locked_documents_rels_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("addresses_id");
  CREATE INDEX "payload_locked_documents_rels_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("carts_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_order_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("order_lists_id");
  CREATE INDEX "payload_locked_documents_rels_recurring_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("recurring_orders_id");
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX "payload_locked_documents_rels_returns_id_idx" ON "payload_locked_documents_rels" USING btree ("returns_id");
  CREATE INDEX "payload_locked_documents_rels_stock_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("stock_reservations_id");
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
  CREATE INDEX "payload_locked_documents_rels_ab_tests_id_idx" ON "payload_locked_documents_rels" USING btree ("ab_tests_id");
  CREATE INDEX "payload_locked_documents_rels_ab_test_results_id_idx" ON "payload_locked_documents_rels" USING btree ("ab_test_results_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("vendors_id");
  CREATE INDEX "payload_locked_documents_rels_vendor_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("vendor_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_workshops_id_idx" ON "payload_locked_documents_rels" USING btree ("workshops_id");
  CREATE INDEX "payload_locked_documents_rels_construction_services_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_services_id");
  CREATE INDEX "payload_locked_documents_rels_construction_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_projects_id");
  CREATE INDEX "payload_locked_documents_rels_construction_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("construction_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_quote_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("quote_requests_id");
  CREATE INDEX "payload_locked_documents_rels_treatments_id_idx" ON "payload_locked_documents_rels" USING btree ("treatments_id");
  CREATE INDEX "payload_locked_documents_rels_practitioners_id_idx" ON "payload_locked_documents_rels" USING btree ("practitioners_id");
  CREATE INDEX "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");
  CREATE INDEX "payload_locked_documents_rels_beauty_services_id_idx" ON "payload_locked_documents_rels" USING btree ("beauty_services_id");
  CREATE INDEX "payload_locked_documents_rels_stylists_id_idx" ON "payload_locked_documents_rels" USING btree ("stylists_id");
  CREATE INDEX "payload_locked_documents_rels_beauty_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("beauty_bookings_id");
  CREATE INDEX "payload_locked_documents_rels_menu_items_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_items_id");
  CREATE INDEX "payload_locked_documents_rels_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_email_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("email_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_email_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("email_lists_id");
  CREATE INDEX "payload_locked_documents_rels_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("email_templates_id");
  CREATE INDEX "payload_locked_documents_rels_email_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("email_api_keys_id");
  CREATE INDEX "payload_locked_documents_rels_email_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("email_campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_automation_rules_id_idx" ON "payload_locked_documents_rels" USING btree ("automation_rules_id");
  CREATE INDEX "payload_locked_documents_rels_automation_flows_id_idx" ON "payload_locked_documents_rels" USING btree ("automation_flows_id");
  CREATE INDEX "payload_locked_documents_rels_flow_instances_id_idx" ON "payload_locked_documents_rels" USING btree ("flow_instances_id");
  CREATE INDEX "payload_locked_documents_rels_email_events_id_idx" ON "payload_locked_documents_rels" USING btree ("email_events_id");
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
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "settings_hours_order_idx" ON "settings_hours" USING btree ("_order");
  CREATE INDEX "settings_hours_parent_id_idx" ON "settings_hours" USING btree ("_parent_id");
  CREATE INDEX "settings_shop_filter_order_order_idx" ON "settings_shop_filter_order" USING btree ("_order");
  CREATE INDEX "settings_shop_filter_order_parent_id_idx" ON "settings_shop_filter_order" USING btree ("_parent_id");
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
  CREATE INDEX "header_topbar_messages_order_idx" ON "header_topbar_messages" USING btree ("_order");
  CREATE INDEX "header_topbar_messages_parent_id_idx" ON "header_topbar_messages" USING btree ("_parent_id");
  CREATE INDEX "header_topbar_right_links_order_idx" ON "header_topbar_right_links" USING btree ("_order");
  CREATE INDEX "header_topbar_right_links_parent_id_idx" ON "header_topbar_right_links" USING btree ("_parent_id");
  CREATE INDEX "header_languages_order_idx" ON "header_languages" USING btree ("_order");
  CREATE INDEX "header_languages_parent_id_idx" ON "header_languages" USING btree ("_parent_id");
  CREATE INDEX "header_special_nav_items_order_idx" ON "header_special_nav_items" USING btree ("_order");
  CREATE INDEX "header_special_nav_items_parent_id_idx" ON "header_special_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_manual_nav_items_mega_columns_links_order_idx" ON "header_manual_nav_items_mega_columns_links" USING btree ("_order");
  CREATE INDEX "header_manual_nav_items_mega_columns_links_parent_id_idx" ON "header_manual_nav_items_mega_columns_links" USING btree ("_parent_id");
  CREATE INDEX "header_manual_nav_items_mega_columns_order_idx" ON "header_manual_nav_items_mega_columns" USING btree ("_order");
  CREATE INDEX "header_manual_nav_items_mega_columns_parent_id_idx" ON "header_manual_nav_items_mega_columns" USING btree ("_parent_id");
  CREATE INDEX "header_manual_nav_items_sub_items_order_idx" ON "header_manual_nav_items_sub_items" USING btree ("_order");
  CREATE INDEX "header_manual_nav_items_sub_items_parent_id_idx" ON "header_manual_nav_items_sub_items" USING btree ("_parent_id");
  CREATE INDEX "header_manual_nav_items_sub_items_page_idx" ON "header_manual_nav_items_sub_items" USING btree ("page_id");
  CREATE INDEX "header_manual_nav_items_order_idx" ON "header_manual_nav_items" USING btree ("_order");
  CREATE INDEX "header_manual_nav_items_parent_id_idx" ON "header_manual_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_manual_nav_items_page_idx" ON "header_manual_nav_items" USING btree ("page_id");
  CREATE INDEX "header_search_categories_order_idx" ON "header_search_categories" USING btree ("_order");
  CREATE INDEX "header_search_categories_parent_id_idx" ON "header_search_categories" USING btree ("_parent_id");
  CREATE INDEX "header_custom_action_buttons_order_idx" ON "header_custom_action_buttons" USING btree ("_order");
  CREATE INDEX "header_custom_action_buttons_parent_id_idx" ON "header_custom_action_buttons" USING btree ("_parent_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_page_idx" ON "footer_columns_links" USING btree ("page_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_trust_badges_order_idx" ON "footer_trust_badges" USING btree ("_order");
  CREATE INDEX "footer_trust_badges_parent_id_idx" ON "footer_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_page_idx" ON "footer_legal_links" USING btree ("page_id");
  CREATE INDEX "footer_logo_image_idx" ON "footer" USING btree ("logo_image_id");
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
  CREATE INDEX "chatbot_settings_moderation_blocked_keywords_parent_id_idx" ON "chatbot_settings_moderation_blocked_keywords" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_addresses" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_favorites" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_blocks_banner" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_blocks_hero_buttons" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block_buttons" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_two_column" CASCADE;
  DROP TABLE "pages_blocks_product_grid" CASCADE;
  DROP TABLE "pages_blocks_category_grid" CASCADE;
  DROP TABLE "pages_blocks_quick_order" CASCADE;
  DROP TABLE "pages_blocks_cta_buttons" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_calltoaction" CASCADE;
  DROP TABLE "pages_blocks_contact_opening_hours" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_services_services" CASCADE;
  DROP TABLE "pages_blocks_services" CASCADE;
  DROP TABLE "pages_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_cases" CASCADE;
  DROP TABLE "pages_blocks_logo_bar_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_bar" CASCADE;
  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_faq_faqs" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_team_members" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages_blocks_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_accordion" CASCADE;
  DROP TABLE "pages_blocks_blog_preview" CASCADE;
  DROP TABLE "pages_blocks_comparison_columns" CASCADE;
  DROP TABLE "pages_blocks_comparison_rows_values" CASCADE;
  DROP TABLE "pages_blocks_comparison_rows" CASCADE;
  DROP TABLE "pages_blocks_comparison" CASCADE;
  DROP TABLE "pages_blocks_infobox" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_code" CASCADE;
  DROP TABLE "pages_blocks_map" CASCADE;
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
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_two_column" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_quick_order" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_calltoaction" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_opening_hours" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_features_features" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_services_services" CASCADE;
  DROP TABLE "_pages_v_blocks_services" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_cases" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_bar_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_team_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_preview" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_rows_values" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison" CASCADE;
  DROP TABLE "_pages_v_blocks_infobox" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_code" CASCADE;
  DROP TABLE "_pages_v_blocks_map" CASCADE;
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
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "cookie_consents" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "themes_custom_colors" CASCADE;
  DROP TABLE "themes" CASCADE;
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
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "recently_viewed" CASCADE;
  DROP TABLE "edition_notifications" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "customer_groups" CASCADE;
  DROP TABLE "addresses" CASCADE;
  DROP TABLE "carts_items" CASCADE;
  DROP TABLE "carts_coupons" CASCADE;
  DROP TABLE "carts" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "orders_texts" CASCADE;
  DROP TABLE "order_lists_items" CASCADE;
  DROP TABLE "order_lists_share_with" CASCADE;
  DROP TABLE "order_lists" CASCADE;
  DROP TABLE "recurring_orders_items" CASCADE;
  DROP TABLE "recurring_orders" CASCADE;
  DROP TABLE "recurring_orders_rels" CASCADE;
  DROP TABLE "invoices_items" CASCADE;
  DROP TABLE "invoices" CASCADE;
  DROP TABLE "returns_items" CASCADE;
  DROP TABLE "returns" CASCADE;
  DROP TABLE "returns_rels" CASCADE;
  DROP TABLE "stock_reservations" CASCADE;
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
  DROP TABLE "ab_tests_variants" CASCADE;
  DROP TABLE "ab_tests" CASCADE;
  DROP TABLE "ab_test_results" CASCADE;
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
  DROP TABLE "vendors_certifications" CASCADE;
  DROP TABLE "vendors" CASCADE;
  DROP TABLE "vendors_rels" CASCADE;
  DROP TABLE "vendor_reviews" CASCADE;
  DROP TABLE "workshops_target_audience" CASCADE;
  DROP TABLE "workshops_learning_objectives" CASCADE;
  DROP TABLE "workshops" CASCADE;
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
  DROP TABLE "email_subscribers_tags" CASCADE;
  DROP TABLE "email_subscribers" CASCADE;
  DROP TABLE "email_subscribers_rels" CASCADE;
  DROP TABLE "email_lists_tags" CASCADE;
  DROP TABLE "email_lists" CASCADE;
  DROP TABLE "email_templates_variables_list" CASCADE;
  DROP TABLE "email_templates_tags" CASCADE;
  DROP TABLE "email_templates_test_settings_test_recipients" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "email_api_keys_scopes" CASCADE;
  DROP TABLE "email_api_keys_security_allowed_ips" CASCADE;
  DROP TABLE "email_api_keys" CASCADE;
  DROP TABLE "email_campaigns_tags" CASCADE;
  DROP TABLE "email_campaigns_ab_test_variants" CASCADE;
  DROP TABLE "email_campaigns" CASCADE;
  DROP TABLE "email_campaigns_rels" CASCADE;
  DROP TABLE "automation_rules_conditions" CASCADE;
  DROP TABLE "automation_rules_actions" CASCADE;
  DROP TABLE "automation_rules" CASCADE;
  DROP TABLE "automation_flows_entry_conditions" CASCADE;
  DROP TABLE "automation_flows_steps" CASCADE;
  DROP TABLE "automation_flows_exit_conditions" CASCADE;
  DROP TABLE "automation_flows" CASCADE;
  DROP TABLE "flow_instances_step_history" CASCADE;
  DROP TABLE "flow_instances" CASCADE;
  DROP TABLE "email_events" CASCADE;
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
  DROP TABLE "settings_shop_filter_order" CASCADE;
  DROP TABLE "settings_sitemap_exclude" CASCADE;
  DROP TABLE "settings_robots_disallow" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_rels" CASCADE;
  DROP TABLE "theme" CASCADE;
  DROP TABLE "header_topbar_messages" CASCADE;
  DROP TABLE "header_topbar_right_links" CASCADE;
  DROP TABLE "header_languages" CASCADE;
  DROP TABLE "header_special_nav_items" CASCADE;
  DROP TABLE "header_manual_nav_items_mega_columns_links" CASCADE;
  DROP TABLE "header_manual_nav_items_mega_columns" CASCADE;
  DROP TABLE "header_manual_nav_items_sub_items" CASCADE;
  DROP TABLE "header_manual_nav_items" CASCADE;
  DROP TABLE "header_search_categories" CASCADE;
  DROP TABLE "header_custom_action_buttons" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_trust_badges" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
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
  DROP TYPE "public"."chatbot_kb_search_collections";
  DROP TYPE "public"."enum_users_addresses_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_account_type";
  DROP TYPE "public"."enum_users_company_branch";
  DROP TYPE "public"."enum_users_client_type";
  DROP TYPE "public"."enum_pages_blocks_banner_variant";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_blocks_hero_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_background_style";
  DROP TYPE "public"."enum_pages_blocks_hero_background_color";
  DROP TYPE "public"."enum_pages_blocks_content_max_width";
  DROP TYPE "public"."enum_pages_blocks_media_block_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_media_block_media_type";
  DROP TYPE "public"."enum_pages_blocks_media_block_media_position";
  DROP TYPE "public"."enum_pages_blocks_media_block_split";
  DROP TYPE "public"."enum_pages_blocks_media_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_two_column_split";
  DROP TYPE "public"."enum_pages_blocks_product_grid_source";
  DROP TYPE "public"."enum_pages_blocks_product_grid_display_mode";
  DROP TYPE "public"."enum_pages_blocks_product_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_category_grid_source";
  DROP TYPE "public"."enum_pages_blocks_category_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_quick_order_input_mode";
  DROP TYPE "public"."enum_pages_blocks_cta_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_style";
  DROP TYPE "public"."enum_pages_blocks_calltoaction_background_color";
  DROP TYPE "public"."enum_pages_blocks_newsletter_background_color";
  DROP TYPE "public"."enum_pages_blocks_features_variant";
  DROP TYPE "public"."enum_pages_blocks_features_icon_style";
  DROP TYPE "public"."enum_pages_blocks_features_alignment";
  DROP TYPE "public"."enum_pages_blocks_services_services_icon_color";
  DROP TYPE "public"."enum_pages_blocks_services_columns";
  DROP TYPE "public"."enum_pages_blocks_testimonials_variant";
  DROP TYPE "public"."enum_pages_blocks_cases_source";
  DROP TYPE "public"."enum_pages_blocks_cases_layout";
  DROP TYPE "public"."enum_pages_blocks_logo_bar_variant";
  DROP TYPE "public"."enum_pages_blocks_stats_columns";
  DROP TYPE "public"."enum_pages_blocks_stats_background_color";
  DROP TYPE "public"."enum_pages_blocks_faq_variant";
  DROP TYPE "public"."enum_pages_blocks_team_columns";
  DROP TYPE "public"."enum_pages_blocks_team_photo_style";
  DROP TYPE "public"."enum_pages_blocks_team_background_color";
  DROP TYPE "public"."enum_pages_blocks_blog_preview_columns";
  DROP TYPE "public"."enum_pages_blocks_comparison_rows_values_type";
  DROP TYPE "public"."enum_pages_blocks_infobox_variant";
  DROP TYPE "public"."enum_pages_blocks_infobox_max_width";
  DROP TYPE "public"."enum_pages_blocks_infobox_margin_top";
  DROP TYPE "public"."enum_pages_blocks_infobox_margin_bottom";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_video_source";
  DROP TYPE "public"."enum_pages_blocks_video_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_code_language";
  DROP TYPE "public"."enum_pages_blocks_map_height";
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
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_banner_variant";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_size";
  DROP TYPE "public"."enum__pages_v_blocks_hero_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_background_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_content_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_media_position";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_split";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_two_column_split";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_quick_order_input_mode";
  DROP TYPE "public"."enum__pages_v_blocks_cta_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_style";
  DROP TYPE "public"."enum__pages_v_blocks_calltoaction_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_features_variant";
  DROP TYPE "public"."enum__pages_v_blocks_features_icon_style";
  DROP TYPE "public"."enum__pages_v_blocks_features_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_services_services_icon_color";
  DROP TYPE "public"."enum__pages_v_blocks_services_columns";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cases_source";
  DROP TYPE "public"."enum__pages_v_blocks_cases_layout";
  DROP TYPE "public"."enum__pages_v_blocks_logo_bar_variant";
  DROP TYPE "public"."enum__pages_v_blocks_stats_columns";
  DROP TYPE "public"."enum__pages_v_blocks_stats_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_faq_variant";
  DROP TYPE "public"."enum__pages_v_blocks_team_columns";
  DROP TYPE "public"."enum__pages_v_blocks_team_photo_style";
  DROP TYPE "public"."enum__pages_v_blocks_team_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_blog_preview_columns";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_rows_values_type";
  DROP TYPE "public"."enum__pages_v_blocks_infobox_variant";
  DROP TYPE "public"."enum__pages_v_blocks_infobox_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_infobox_margin_top";
  DROP TYPE "public"."enum__pages_v_blocks_infobox_margin_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_video_source";
  DROP TYPE "public"."enum__pages_v_blocks_video_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_code_language";
  DROP TYPE "public"."enum__pages_v_blocks_map_height";
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
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_partners_category";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum_services_icon_type";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum_notifications_type";
  DROP TYPE "public"."enum_notifications_category";
  DROP TYPE "public"."enum_notifications_icon";
  DROP TYPE "public"."enum_notifications_icon_color";
  DROP TYPE "public"."enum_notifications_priority";
  DROP TYPE "public"."enum_themes_status";
  DROP TYPE "public"."enum_products_videos_platform";
  DROP TYPE "public"."enum_products_product_type";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_products_condition";
  DROP TYPE "public"."enum_products_badge";
  DROP TYPE "public"."enum_products_tax_class";
  DROP TYPE "public"."enum_products_stock_status";
  DROP TYPE "public"."enum_products_weight_unit";
  DROP TYPE "public"."enum_recently_viewed_source";
  DROP TYPE "public"."enum_recently_viewed_device";
  DROP TYPE "public"."enum_customers_account_type";
  DROP TYPE "public"."enum_customers_payment_terms";
  DROP TYPE "public"."enum_customers_language";
  DROP TYPE "public"."enum_customers_currency";
  DROP TYPE "public"."enum_customers_status";
  DROP TYPE "public"."enum_customer_groups_type";
  DROP TYPE "public"."enum_addresses_type";
  DROP TYPE "public"."enum_addresses_country";
  DROP TYPE "public"."enum_carts_items_discount_type";
  DROP TYPE "public"."enum_carts_coupons_discount_type";
  DROP TYPE "public"."enum_carts_status";
  DROP TYPE "public"."enum_carts_currency";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_shipping_method";
  DROP TYPE "public"."enum_orders_currency";
  DROP TYPE "public"."enum_order_lists_icon";
  DROP TYPE "public"."enum_order_lists_color";
  DROP TYPE "public"."enum_recurring_orders_status";
  DROP TYPE "public"."enum_recurring_orders_frequency_unit";
  DROP TYPE "public"."enum_recurring_orders_payment_method";
  DROP TYPE "public"."enum_invoices_status";
  DROP TYPE "public"."enum_invoices_payment_method";
  DROP TYPE "public"."enum_returns_status";
  DROP TYPE "public"."enum_returns_return_reason";
  DROP TYPE "public"."enum_returns_product_condition";
  DROP TYPE "public"."enum_returns_preferred_resolution";
  DROP TYPE "public"."enum_returns_refund_method";
  DROP TYPE "public"."enum_stock_reservations_status";
  DROP TYPE "public"."enum_subscription_plans_billing_interval";
  DROP TYPE "public"."enum_subscription_plans_tier";
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
  DROP TYPE "public"."enum_ab_tests_target_page";
  DROP TYPE "public"."enum_ab_tests_status";
  DROP TYPE "public"."enum_blog_posts_featured_tag";
  DROP TYPE "public"."enum_blog_posts_template";
  DROP TYPE "public"."enum_blog_posts_content_type";
  DROP TYPE "public"."enum_blog_posts_content_access_access_level";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_featured_tag";
  DROP TYPE "public"."enum__blog_posts_v_version_template";
  DROP TYPE "public"."enum__blog_posts_v_version_content_type";
  DROP TYPE "public"."enum__blog_posts_v_version_content_access_access_level";
  DROP TYPE "public"."enum__blog_posts_v_version_status";
  DROP TYPE "public"."enum_blog_categories_icon";
  DROP TYPE "public"."enum_blog_categories_color";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum_cases_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_vendors_certifications_icon";
  DROP TYPE "public"."enum_workshops_target_audience";
  DROP TYPE "public"."enum_workshops_location_type";
  DROP TYPE "public"."enum_workshops_category";
  DROP TYPE "public"."enum_workshops_level";
  DROP TYPE "public"."enum_workshops_status";
  DROP TYPE "public"."enum_construction_services_color";
  DROP TYPE "public"."enum_construction_services_status";
  DROP TYPE "public"."enum_construction_projects_status";
  DROP TYPE "public"."enum_construction_reviews_client_color";
  DROP TYPE "public"."enum_construction_reviews_status";
  DROP TYPE "public"."enum_quote_requests_project_type";
  DROP TYPE "public"."enum_quote_requests_budget";
  DROP TYPE "public"."enum_quote_requests_timeline";
  DROP TYPE "public"."enum_quote_requests_status";
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
  DROP TYPE "public"."enum_email_subscribers_status";
  DROP TYPE "public"."enum_email_subscribers_source";
  DROP TYPE "public"."enum_email_subscribers_sync_status";
  DROP TYPE "public"."enum_email_lists_type";
  DROP TYPE "public"."enum_email_lists_optin";
  DROP TYPE "public"."enum_email_lists_category";
  DROP TYPE "public"."enum_email_lists_sync_status";
  DROP TYPE "public"."enum_email_templates_type";
  DROP TYPE "public"."enum_email_templates_category";
  DROP TYPE "public"."enum_email_templates_sync_status";
  DROP TYPE "public"."enum_email_api_keys_scopes";
  DROP TYPE "public"."enum_email_api_keys_environment";
  DROP TYPE "public"."enum_email_api_keys_status";
  DROP TYPE "public"."enum_email_campaigns_content_type";
  DROP TYPE "public"."enum_email_campaigns_timezone";
  DROP TYPE "public"."enum_email_campaigns_status";
  DROP TYPE "public"."enum_email_campaigns_category";
  DROP TYPE "public"."enum_email_campaigns_sync_status";
  DROP TYPE "public"."enum_automation_rules_conditions_operator";
  DROP TYPE "public"."enum_automation_rules_actions_type";
  DROP TYPE "public"."enum_automation_rules_actions_wait_duration_unit";
  DROP TYPE "public"."enum_automation_rules_actions_webhook_method";
  DROP TYPE "public"."enum_automation_rules_status";
  DROP TYPE "public"."enum_automation_rules_trigger_event_type";
  DROP TYPE "public"."enum_automation_rules_timing_delay_unit";
  DROP TYPE "public"."enum_automation_flows_entry_conditions_operator";
  DROP TYPE "public"."enum_automation_flows_steps_type";
  DROP TYPE "public"."enum_automation_flows_steps_wait_duration_unit";
  DROP TYPE "public"."enum_automation_flows_steps_condition_operator";
  DROP TYPE "public"."enum_automation_flows_exit_conditions_event_type";
  DROP TYPE "public"."enum_automation_flows_status";
  DROP TYPE "public"."enum_automation_flows_entry_trigger_event_type";
  DROP TYPE "public"."enum_flow_instances_status";
  DROP TYPE "public"."enum_email_events_type";
  DROP TYPE "public"."enum_email_events_bounce_type";
  DROP TYPE "public"."enum_email_events_source";
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
  DROP TYPE "public"."enum_settings_shop_filter_order_filter_id";
  DROP TYPE "public"."enum_settings_default_product_template";
  DROP TYPE "public"."enum_settings_default_blog_template";
  DROP TYPE "public"."enum_settings_default_shop_archive_template";
  DROP TYPE "public"."enum_settings_default_cart_template";
  DROP TYPE "public"."enum_settings_default_checkout_template";
  DROP TYPE "public"."enum_settings_default_my_account_template";
  DROP TYPE "public"."enum_theme_container_width";
  DROP TYPE "public"."enum_header_topbar_messages_icon";
  DROP TYPE "public"."enum_header_topbar_right_links_icon";
  DROP TYPE "public"."enum_header_special_nav_items_icon";
  DROP TYPE "public"."enum_header_special_nav_items_position";
  DROP TYPE "public"."enum_header_manual_nav_items_icon";
  DROP TYPE "public"."enum_header_manual_nav_items_type";
  DROP TYPE "public"."enum_header_search_categories_icon";
  DROP TYPE "public"."enum_header_custom_action_buttons_icon";
  DROP TYPE "public"."enum_header_custom_action_buttons_style";
  DROP TYPE "public"."enum_header_layout_type";
  DROP TYPE "public"."enum_header_price_toggle_default_mode";
  DROP TYPE "public"."enum_header_alert_bar_type";
  DROP TYPE "public"."enum_header_alert_bar_icon";
  DROP TYPE "public"."enum_header_navigation_mode";
  DROP TYPE "public"."enum_header_category_navigation_mega_menu_style";
  DROP TYPE "public"."enum_header_cta_button_style";
  DROP TYPE "public"."enum_header_mobile_drawer_position";
  DROP TYPE "public"."enum_header_sticky_behavior";
  DROP TYPE "public"."enum_footer_social_links_platform";
  DROP TYPE "public"."enum_footer_columns_links_type";
  DROP TYPE "public"."enum_footer_trust_badges_icon";
  DROP TYPE "public"."enum_footer_legal_links_type";
  DROP TYPE "public"."enum_footer_logo_type";
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

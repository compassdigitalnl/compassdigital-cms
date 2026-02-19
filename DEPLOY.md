Thu Feb 19 08:00:43 AM UTC 2026
=== 🚀 Starting Deployment ===
Time: Thu Feb 19 08:00:43 AM UTC 2026

✓ Changed to project directory

=== 📥 Pulling latest code ===
From https://github.com/compassdigitalnl/compassdigital-cms
 * branch            main       -> FETCH_HEAD
   07114d6..b5508f3  main       -> origin/main
Updating 07114d6..b5508f3
Fast-forward
 PLASTIMED_ISSUE_ANALYSIS.md              | 292 +++++++++++++++++++++++++++++++
 src/components/admin/HideCollections.tsx | 121 +++++++------
 src/lib/tenant/getTenantContext.ts       |  76 ++++++++
 src/middleware.ts                        |  75 ++++++--
 4 files changed, 496 insertions(+), 68 deletions(-)
 create mode 100644 PLASTIMED_ISSUE_ANALYSIS.md
 create mode 100644 src/lib/tenant/getTenantContext.ts
✓ Code updated

=== 📦 Installing dependencies ===
npm warn config production Use `--omit=dev` instead.up to date, audited 1194 packages in 5s

314 packages are looking for funding
  run `npm fund` for details

32 vulnerabilities (9 moderate, 23 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
✓ Dependencies installed

=== 🔨 Building application ===

> payload-business-website@1.0.0 build
> cross-env NODE_OPTIONS="--no-deprecation --max-old-space-size=2048" next build

[@sentry/nextjs] DEPRECATION WARNING: disableLogger is deprecated and will be removed in a future version. Use webpack.treeshake.removeDebugLogging instead.
[@sentry/nextjs] DEPRECATION WARNING: automaticVercelMonitors is deprecated and will be removed in a future version. Use webpack.automaticVercelMonitors instead.
   ▲ Next.js 15.5.12
   - Environments: .env
   - Experiments (use with caution):
     · clientTraceMetadata

   Creating an optimized production build ...
[@sentry/nextjs] DEPRECATION WARNING: It is recommended renaming your `sentry.client.config.ts` file, or moving its content to `instrumentation-client.ts`. When using Turbopack `sentry.client.config.ts` will no longer work. Read more about the `instrumentation-client.ts` file: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client✓ Compiled successfully in 33.6s
   Skipping validation of types
   Skipping linting
   Collecting page data ...
 ⚠ Using edge runtime on a page currently disables static generation for that page
   Generating static pages (0/23) ...
   Generating static pages (5/23) 
   Generating static pages (11/23) 
   Generating static pages (17/23) 
 ✓ Generating static pages (23/23)
   Finalizing page optimization ...
   Collecting build traces ...Route (app)                                     Size  First Load JS
┌ ƒ /                                          447 B         469 kB
├ ○ /_not-found                              1.16 kB         218 kB
├ ƒ /[slug]                                  2.83 kB         471 kB
├ ƒ /admin/[[...segments]]                     663 B        1.04 MB
├ ƒ /ai-playground                           12.6 kB         265 kB
├ ƒ /api/[...slug]                             363 B         218 kB
├ ƒ /api/admin/fix-client-urls                 436 B         218 kB
├ ƒ /api/admin/fix-plastimed                   436 B         218 kB
├ ƒ /api/admin/tenants/[id]                    436 B         218 kB
├ ƒ /api/admin/tenants/create                  437 B         218 kB
├ ƒ /api/admin/tenants/list                    436 B         218 kB
├ ƒ /api/ai/stream/[connectionId]              435 B         218 kB
├ ƒ /api/contact                               435 B         218 kB
├ ƒ /api/diag                                  436 B         218 kB
├ ƒ /api/graphql                               435 B         218 kB
├ ƒ /api/graphql-playground                    364 B         218 kB
├ ƒ /api/health                                435 B         218 kB
├ ƒ /api/multisafepay/affiliates/create        437 B         218 kB
├ ƒ /api/multisafepay/affiliates/status        435 B         218 kB
├ ƒ /api/multisafepay/payments/create-order    437 B         218 kB
├ ƒ /api/multisafepay/webhooks                 437 B         218 kB
├ ƒ /api/og                                    437 B         218 kB
├ ƒ /api/platform/clients                      436 B         218 kB
├ ƒ /api/platform/clients/[id]                 436 B         218 kB
├ ƒ /api/platform/clients/[id]/actions         435 B         218 kB
├ ƒ /api/platform/clients/[id]/deployments     436 B         218 kB
├ ƒ /api/platform/clients/[id]/health          436 B         218 kB
├ ƒ /api/platform/cron/health-checks           436 B         218 kB
├ ƒ /api/platform/provision                    436 B         218 kB
├ ƒ /api/platform/stats                        436 B         218 kB
├ ƒ /api/seed-homepage                         435 B         218 kB
├ ƒ /api/stripe/checkout/create-session        435 B         218 kB
├ ƒ /api/stripe/connect/account-status         437 B         218 kB
├ ƒ /api/stripe/connect/create-account         437 B         218 kB
├ ƒ /api/stripe/connect/onboarding-link        435 B         218 kB
├ ƒ /api/stripe/webhooks                       436 B         218 kB
├ ƒ /api/wizard/generate-site                  435 B         218 kB
├ ƒ /api/wizard/provision-site                 436 B         218 kB
├ ƒ /cart                                    3.46 kB         222 kB
├ ƒ /checkout                                4.58 kB         224 kB
├ ƒ /create-account                          3.81 kB         241 kB
├ ƒ /docs                                      436 B         218 kB
├ ƒ /find-order                              3.15 kB         239 kB
├ ƒ /forgot-password                         2.67 kB         240 kB
├ ƒ /login                                   3.61 kB         241 kB
├ ƒ /logout                                  1.41 kB         220 kB
├ ƒ /next/exit-preview                         435 B         218 kB
├ ƒ /next/preview                              436 B         218 kB
├ ƒ /next/seed                                 436 B         218 kB
├ ƒ /overview                                  435 B         218 kB
├ ○ /platform                                5.54 kB         234 kB
├ ○ /platform/clients                        7.49 kB         261 kB
├ ƒ /platform/clients/[id]                   7.01 kB         241 kB
├ ○ /platform/deployments                    1.66 kB         219 kB
├ ○ /platform/monitoring                     1.71 kB         219 kB
├ ○ /platform/settings                       8.67 kB         261 kB
├ ƒ /robots.txt                                436 B         218 kB
├ ƒ /setup                                     437 B         218 kB
├ ƒ /shop                                      353 B         219 kB
├ ƒ /shop-demo                                 354 B         219 kB
├ ƒ /shop/[slug]                             2.47 kB         221 kB
├ ƒ /site-generator                            33 kB         290 kB
├ ƒ /sitemap.xml                               436 B         218 kB
└ ƒ /tenant/[[...path]]                        436 B         218 kB
+ First Load JS shared by all                 217 kB
  ├ chunks/1157-9bfd8defcdd7a712.js           121 kB
  ├ chunks/4bd1b696-e54248d7df166844.js      54.4 kB
  ├ chunks/52774a7f-b26b6f7fdeb9c2ad.js      37.2 kB
  └ other shared chunks (total)              4.37 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

✓ Build completed

=== 🗄️  Running migrations ===

> payload-business-website@1.0.0 migrate
> node --env-file=.env --no-deprecation --import=tsx/esm src/scripts/migrate.ts

[migrate] Starting Payload migrations...
[migrate] TIP: Run with "yes | npm run migrate" if prompts appear
[08:01:52] WARN: No email adapter provided. Email will be written to console. More info at https://payloadcms.com/docs/email/overview.
[08:01:52] INFO: Reading migration files from /home/ploi/cms.compassdigital.nl/src/migrations
? It looks like you've run Payload in dev mode, meaning you've dynamically pushed changes to your database.

If you'd like to run migrations, data loss will occur. Would you like to proceed? › (y/N)✔ It looks like you've run Payload in dev mode, meaning you've dynamically pushed changes to your database.

If you'd like to run migrations, data loss will occur. Would you like to proceed? … yes[08:01:52] INFO: Migrating: 20260218_055843
[08:01:53] ERROR: Error running migration 20260218_055843 Failed query: 
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
  	"version" va⚠️  Migration failed or skipped, continuing...
✓ Migrations completed

=== 🔄 Restarting application ===
Restarting existing PM2 process...
[PM2] Applying action restartProcessId on app [cms-compassdigital](ids: [ 0 ])[PM2] [cms-compassdigital](0) ✓
┌────┬───────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                  │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼───────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ cms-compassdigital    │ default     │ N/A     │ fork    │ 340884   │ 0s     │ 27   │ online    │ 0%       │ 22.6mb   │ ploi     │ disabled │
│ 2  │ payload-cms           │ default     │ N/A     │ fork    │ 305327   │ 15h    │ 2    │ online    │ 0%       │ 73.5mb   │ ploi     │ disabled │
└────┴───────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /home/ploi/.pm2/dump.pm2
✓ Application restarted

=== ✅ Deployment Complete ===
Time: Thu Feb 19 08:01:54 AM UTC 2026

PM2 Status:
┌────┬───────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                  │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼───────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ cms-compassdigital    │ default     │ N/A     │ fork    │ 340884   │ 0s     │ 27   │ online    │ 0%       │ 68.6mb   │ ploi     │ disabled │
│ 2  │ payload-cms           │ default     │ N/A     │ fork    │ 305327   │ 15h    │ 2    │ online    │ 0%       │ 73.5mb   │ ploi     │ disabled │
└────┴───────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

Health check in 10 seconds...
{"status":"healthy","timestamp":"2026-02-19T08:02:04.459Z","uptime":10.310900446,"checks":{"database":{"status":"ok","latency":473},"memory":{"status":"warning","used":126,"total":159,"percentage":79},"environment":{"nodeEnv":"production","nodeVersion":"v22.22.0"}}}

🎉 Deployment finished!
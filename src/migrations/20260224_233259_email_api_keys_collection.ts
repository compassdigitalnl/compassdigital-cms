import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`email_api_keys_scopes\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`email_api_keys\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_api_keys_scopes_order_idx\` ON \`email_api_keys_scopes\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`email_api_keys_scopes_parent_idx\` ON \`email_api_keys_scopes\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_api_keys_security_allowed_ips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ip\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_api_keys\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_api_keys_security_allowed_ips_order_idx\` ON \`email_api_keys_security_allowed_ips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_api_keys_security_allowed_ips_parent_id_idx\` ON \`email_api_keys_security_allowed_ips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_api_keys\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`key_hash\` text NOT NULL,
  	\`key_prefix\` text NOT NULL,
  	\`environment\` text DEFAULT 'test' NOT NULL,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`rate_limit_requests_per_minute\` numeric DEFAULT 60 NOT NULL,
  	\`rate_limit_requests_per_hour\` numeric DEFAULT 1000 NOT NULL,
  	\`rate_limit_requests_per_day\` numeric DEFAULT 10000 NOT NULL,
  	\`usage_total_requests\` numeric DEFAULT 0,
  	\`usage_last_used_at\` text,
  	\`usage_last_used_ip\` text,
  	\`usage_last_used_endpoint\` text,
  	\`security_expires_at\` text,
  	\`security_rotated_from\` text,
  	\`security_rotated_at\` text,
  	\`tenant_id\` integer NOT NULL,
  	\`created_by_id\` integer,
  	\`webhook_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`email_api_keys_key_hash_idx\` ON \`email_api_keys\` (\`key_hash\`);`)
  await db.run(sql`CREATE INDEX \`email_api_keys_tenant_idx\` ON \`email_api_keys\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`email_api_keys_created_by_idx\` ON \`email_api_keys\` (\`created_by_id\`);`)
  await db.run(sql`CREATE INDEX \`email_api_keys_updated_at_idx\` ON \`email_api_keys\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_api_keys_created_at_idx\` ON \`email_api_keys\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`email_api_keys_id\` integer REFERENCES email_api_keys(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_api_keys_id_idx\` ON \`payload_locked_documents_rels\` (\`email_api_keys_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`email_api_keys_scopes\`;`)
  await db.run(sql`DROP TABLE \`email_api_keys_security_allowed_ips\`;`)
  await db.run(sql`DROP TABLE \`email_api_keys\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  	\`automation_rules_id\` integer,
  	\`automation_flows_id\` integer,
  	\`flow_instances_id\` integer,
  	\`email_events_id\` integer,
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
  	FOREIGN KEY (\`automation_rules_id\`) REFERENCES \`automation_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`automation_flows_id\`) REFERENCES \`automation_flows\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`flow_instances_id\`) REFERENCES \`flow_instances\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_events_id\`) REFERENCES \`email_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_requests_id\`) REFERENCES \`client_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`deployments_id\`) REFERENCES \`deployments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "media_id", "partners_id", "services_id", "notifications_id", "themes_id", "products_id", "product_categories_id", "brands_id", "recently_viewed_id", "edition_notifications_id", "customer_groups_id", "orders_id", "order_lists_id", "recurring_orders_id", "invoices_id", "returns_id", "subscription_plans_id", "user_subscriptions_id", "payment_methods_id", "gift_vouchers_id", "licenses_id", "license_activations_id", "loyalty_tiers_id", "loyalty_rewards_id", "loyalty_points_id", "loyalty_transactions_id", "loyalty_redemptions_id", "ab_tests_id", "ab_test_results_id", "blog_posts_id", "blog_categories_id", "faqs_id", "cases_id", "testimonials_id", "vendors_id", "vendor_reviews_id", "workshops_id", "construction_services_id", "construction_projects_id", "construction_reviews_id", "quote_requests_id", "treatments_id", "practitioners_id", "appointments_id", "beauty_services_id", "stylists_id", "beauty_bookings_id", "menu_items_id", "reservations_id", "events_id", "email_subscribers_id", "email_lists_id", "email_templates_id", "email_campaigns_id", "automation_rules_id", "automation_flows_id", "flow_instances_id", "email_events_id", "client_requests_id", "clients_id", "deployments_id", "forms_id", "form_submissions_id", "redirects_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "media_id", "partners_id", "services_id", "notifications_id", "themes_id", "products_id", "product_categories_id", "brands_id", "recently_viewed_id", "edition_notifications_id", "customer_groups_id", "orders_id", "order_lists_id", "recurring_orders_id", "invoices_id", "returns_id", "subscription_plans_id", "user_subscriptions_id", "payment_methods_id", "gift_vouchers_id", "licenses_id", "license_activations_id", "loyalty_tiers_id", "loyalty_rewards_id", "loyalty_points_id", "loyalty_transactions_id", "loyalty_redemptions_id", "ab_tests_id", "ab_test_results_id", "blog_posts_id", "blog_categories_id", "faqs_id", "cases_id", "testimonials_id", "vendors_id", "vendor_reviews_id", "workshops_id", "construction_services_id", "construction_projects_id", "construction_reviews_id", "quote_requests_id", "treatments_id", "practitioners_id", "appointments_id", "beauty_services_id", "stylists_id", "beauty_bookings_id", "menu_items_id", "reservations_id", "events_id", "email_subscribers_id", "email_lists_id", "email_templates_id", "email_campaigns_id", "automation_rules_id", "automation_flows_id", "flow_instances_id", "email_events_id", "client_requests_id", "clients_id", "deployments_id", "forms_id", "form_submissions_id", "redirects_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_automation_rules_id_idx\` ON \`payload_locked_documents_rels\` (\`automation_rules_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_automation_flows_id_idx\` ON \`payload_locked_documents_rels\` (\`automation_flows_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_flow_instances_id_idx\` ON \`payload_locked_documents_rels\` (\`flow_instances_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_events_id_idx\` ON \`payload_locked_documents_rels\` (\`email_events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`client_requests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_deployments_id_idx\` ON \`payload_locked_documents_rels\` (\`deployments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
}

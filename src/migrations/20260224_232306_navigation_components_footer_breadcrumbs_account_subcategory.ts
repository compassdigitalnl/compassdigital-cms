import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`automation_rules_conditions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`operator\` text NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`automation_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`automation_rules_conditions_order_idx\` ON \`automation_rules_conditions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`automation_rules_conditions_parent_id_idx\` ON \`automation_rules_conditions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`automation_rules_actions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`email_template_id\` integer,
  	\`list_id\` integer,
  	\`tag_name\` text,
  	\`wait_duration_value\` numeric,
  	\`wait_duration_unit\` text DEFAULT 'hours',
  	\`webhook_url\` text,
  	\`webhook_method\` text DEFAULT 'POST',
  	FOREIGN KEY (\`email_template_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`list_id\`) REFERENCES \`email_lists\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`automation_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`automation_rules_actions_order_idx\` ON \`automation_rules_actions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`automation_rules_actions_parent_id_idx\` ON \`automation_rules_actions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`automation_rules_actions_email_template_idx\` ON \`automation_rules_actions\` (\`email_template_id\`);`)
  await db.run(sql`CREATE INDEX \`automation_rules_actions_list_idx\` ON \`automation_rules_actions\` (\`list_id\`);`)
  await db.run(sql`CREATE TABLE \`automation_rules\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`trigger_event_type\` text NOT NULL,
  	\`trigger_custom_event_name\` text,
  	\`timing_delay_enabled\` integer DEFAULT false,
  	\`timing_delay_value\` numeric DEFAULT 1,
  	\`timing_delay_unit\` text DEFAULT 'hours',
  	\`timing_max_executions\` numeric,
  	\`stats_times_triggered\` numeric DEFAULT 0,
  	\`stats_times_succeeded\` numeric DEFAULT 0,
  	\`stats_times_failed\` numeric DEFAULT 0,
  	\`stats_last_triggered\` text,
  	\`stats_last_error\` text,
  	\`tenant_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`automation_rules_tenant_idx\` ON \`automation_rules\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`automation_rules_updated_at_idx\` ON \`automation_rules\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`automation_rules_created_at_idx\` ON \`automation_rules\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`automation_flows_entry_conditions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`operator\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`automation_flows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`automation_flows_entry_conditions_order_idx\` ON \`automation_flows_entry_conditions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`automation_flows_entry_conditions_parent_id_idx\` ON \`automation_flows_entry_conditions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`automation_flows_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`email_template_id\` integer,
  	\`wait_duration_value\` numeric DEFAULT 1,
  	\`wait_duration_unit\` text DEFAULT 'days',
  	\`list_id\` integer,
  	\`tag_name\` text,
  	\`condition_field\` text,
  	\`condition_operator\` text,
  	\`condition_value\` text,
  	\`condition_if_true\` numeric,
  	\`condition_if_false\` numeric,
  	\`webhook_url\` text,
  	\`exit_reason\` text,
  	FOREIGN KEY (\`email_template_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`list_id\`) REFERENCES \`email_lists\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`automation_flows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`automation_flows_steps_order_idx\` ON \`automation_flows_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`automation_flows_steps_parent_id_idx\` ON \`automation_flows_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`automation_flows_steps_email_template_idx\` ON \`automation_flows_steps\` (\`email_template_id\`);`)
  await db.run(sql`CREATE INDEX \`automation_flows_steps_list_idx\` ON \`automation_flows_steps\` (\`list_id\`);`)
  await db.run(sql`CREATE TABLE \`automation_flows_exit_conditions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`event_type\` text,
  	\`custom_event_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`automation_flows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`automation_flows_exit_conditions_order_idx\` ON \`automation_flows_exit_conditions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`automation_flows_exit_conditions_parent_id_idx\` ON \`automation_flows_exit_conditions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`automation_flows\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`entry_trigger_event_type\` text NOT NULL,
  	\`entry_trigger_custom_event_name\` text,
  	\`stats_total_entries\` numeric DEFAULT 0,
  	\`stats_active_instances\` numeric DEFAULT 0,
  	\`stats_completed_instances\` numeric DEFAULT 0,
  	\`stats_exited_instances\` numeric DEFAULT 0,
  	\`stats_last_entry\` text,
  	\`settings_allow_reentry\` integer DEFAULT false,
  	\`settings_max_entries_per_user\` numeric,
  	\`tenant_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`automation_flows_tenant_idx\` ON \`automation_flows\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`automation_flows_updated_at_idx\` ON \`automation_flows\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`automation_flows_created_at_idx\` ON \`automation_flows\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`flow_instances_step_history\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`step_index\` numeric NOT NULL,
  	\`step_name\` text NOT NULL,
  	\`step_type\` text NOT NULL,
  	\`executed_at\` text NOT NULL,
  	\`success\` integer DEFAULT true,
  	\`error\` text,
  	\`metadata\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`flow_instances\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`flow_instances_step_history_order_idx\` ON \`flow_instances_step_history\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`flow_instances_step_history_parent_id_idx\` ON \`flow_instances_step_history\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`flow_instances\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`flow_id\` integer NOT NULL,
  	\`subscriber_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`current_step\` numeric DEFAULT 0 NOT NULL,
  	\`current_step_name\` text,
  	\`started_at\` text NOT NULL,
  	\`completed_at\` text,
  	\`next_step_scheduled_at\` text,
  	\`entry_event_data\` text,
  	\`exit_reason\` text,
  	\`last_error\` text,
  	\`retry_count\` numeric DEFAULT 0,
  	\`tenant_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`flow_id\`) REFERENCES \`automation_flows\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`subscriber_id\`) REFERENCES \`email_subscribers\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`flow_instances_flow_idx\` ON \`flow_instances\` (\`flow_id\`);`)
  await db.run(sql`CREATE INDEX \`flow_instances_subscriber_idx\` ON \`flow_instances\` (\`subscriber_id\`);`)
  await db.run(sql`CREATE INDEX \`flow_instances_tenant_idx\` ON \`flow_instances\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`flow_instances_updated_at_idx\` ON \`flow_instances\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`flow_instances_created_at_idx\` ON \`flow_instances\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`email_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`campaign_id\` integer,
  	\`subscriber_id\` integer NOT NULL,
  	\`template_id\` integer,
  	\`message_id\` text,
  	\`subject\` text,
  	\`recipient_email\` text NOT NULL,
  	\`clicked_url\` text,
  	\`bounce_type\` text,
  	\`bounce_reason\` text,
  	\`failure_reason\` text,
  	\`metadata\` text,
  	\`source\` text DEFAULT 'campaign',
  	\`tenant_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`campaign_id\`) REFERENCES \`email_campaigns\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`subscriber_id\`) REFERENCES \`email_subscribers\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`template_id\`) REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`tenant_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`email_events_campaign_idx\` ON \`email_events\` (\`campaign_id\`);`)
  await db.run(sql`CREATE INDEX \`email_events_subscriber_idx\` ON \`email_events\` (\`subscriber_id\`);`)
  await db.run(sql`CREATE INDEX \`email_events_template_idx\` ON \`email_events\` (\`template_id\`);`)
  await db.run(sql`CREATE INDEX \`email_events_tenant_idx\` ON \`email_events\` (\`tenant_id\`);`)
  await db.run(sql`CREATE INDEX \`email_events_updated_at_idx\` ON \`email_events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_events_created_at_idx\` ON \`email_events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`footer_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_social_links_order_idx\` ON \`footer_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_social_links_parent_id_idx\` ON \`footer_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_trust_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'check',
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_trust_badges_order_idx\` ON \`footer_trust_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_trust_badges_parent_id_idx\` ON \`footer_trust_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_legal_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`page_id\` integer,
  	\`external_url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_legal_links_order_idx\` ON \`footer_legal_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_legal_links_parent_id_idx\` ON \`footer_legal_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_legal_links_page_idx\` ON \`footer_legal_links\` (\`page_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer_columns\`("_order", "_parent_id", "id", "heading") SELECT "_order", "_parent_id", "id", "heading" FROM \`footer_columns\`;`)
  await db.run(sql`DROP TABLE \`footer_columns\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer_columns\` RENAME TO \`footer_columns\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`footer_columns_order_idx\` ON \`footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_columns_parent_id_idx\` ON \`footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`automation_rules_id\` integer REFERENCES automation_rules(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`automation_flows_id\` integer REFERENCES automation_flows(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`flow_instances_id\` integer REFERENCES flow_instances(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`email_events_id\` integer REFERENCES email_events(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_automation_rules_id_idx\` ON \`payload_locked_documents_rels\` (\`automation_rules_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_automation_flows_id_idx\` ON \`payload_locked_documents_rels\` (\`automation_flows_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_flow_instances_id_idx\` ON \`payload_locked_documents_rels\` (\`flow_instances_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_events_id_idx\` ON \`payload_locked_documents_rels\` (\`email_events_id\`);`)
  await db.run(sql`ALTER TABLE \`footer_columns_links\` ADD \`icon\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`logo_type\` text DEFAULT 'text';`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`logo_text\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`logo_accent\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`logo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`tagline\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`show_contact_column\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`contact_heading\` text DEFAULT 'Contact';`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`phone\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`email\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`address\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`opening_hours\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`copyright_text\` text DEFAULT '© 2026 Compass B.V. — Alle rechten voorbehouden';`)
  await db.run(sql`CREATE INDEX \`footer_logo_image_idx\` ON \`footer\` (\`logo_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`automation_rules_conditions\`;`)
  await db.run(sql`DROP TABLE \`automation_rules_actions\`;`)
  await db.run(sql`DROP TABLE \`automation_rules\`;`)
  await db.run(sql`DROP TABLE \`automation_flows_entry_conditions\`;`)
  await db.run(sql`DROP TABLE \`automation_flows_steps\`;`)
  await db.run(sql`DROP TABLE \`automation_flows_exit_conditions\`;`)
  await db.run(sql`DROP TABLE \`automation_flows\`;`)
  await db.run(sql`DROP TABLE \`flow_instances_step_history\`;`)
  await db.run(sql`DROP TABLE \`flow_instances\`;`)
  await db.run(sql`DROP TABLE \`email_events\`;`)
  await db.run(sql`DROP TABLE \`footer_social_links\`;`)
  await db.run(sql`DROP TABLE \`footer_trust_badges\`;`)
  await db.run(sql`DROP TABLE \`footer_legal_links\`;`)
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "media_id", "partners_id", "services_id", "notifications_id", "themes_id", "products_id", "product_categories_id", "brands_id", "recently_viewed_id", "edition_notifications_id", "customer_groups_id", "orders_id", "order_lists_id", "recurring_orders_id", "invoices_id", "returns_id", "subscription_plans_id", "user_subscriptions_id", "payment_methods_id", "gift_vouchers_id", "licenses_id", "license_activations_id", "loyalty_tiers_id", "loyalty_rewards_id", "loyalty_points_id", "loyalty_transactions_id", "loyalty_redemptions_id", "ab_tests_id", "ab_test_results_id", "blog_posts_id", "blog_categories_id", "faqs_id", "cases_id", "testimonials_id", "vendors_id", "vendor_reviews_id", "workshops_id", "construction_services_id", "construction_projects_id", "construction_reviews_id", "quote_requests_id", "treatments_id", "practitioners_id", "appointments_id", "beauty_services_id", "stylists_id", "beauty_bookings_id", "menu_items_id", "reservations_id", "events_id", "email_subscribers_id", "email_lists_id", "email_templates_id", "email_campaigns_id", "client_requests_id", "clients_id", "deployments_id", "forms_id", "form_submissions_id", "redirects_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "media_id", "partners_id", "services_id", "notifications_id", "themes_id", "products_id", "product_categories_id", "brands_id", "recently_viewed_id", "edition_notifications_id", "customer_groups_id", "orders_id", "order_lists_id", "recurring_orders_id", "invoices_id", "returns_id", "subscription_plans_id", "user_subscriptions_id", "payment_methods_id", "gift_vouchers_id", "licenses_id", "license_activations_id", "loyalty_tiers_id", "loyalty_rewards_id", "loyalty_points_id", "loyalty_transactions_id", "loyalty_redemptions_id", "ab_tests_id", "ab_test_results_id", "blog_posts_id", "blog_categories_id", "faqs_id", "cases_id", "testimonials_id", "vendors_id", "vendor_reviews_id", "workshops_id", "construction_services_id", "construction_projects_id", "construction_reviews_id", "quote_requests_id", "treatments_id", "practitioners_id", "appointments_id", "beauty_services_id", "stylists_id", "beauty_bookings_id", "menu_items_id", "reservations_id", "events_id", "email_subscribers_id", "email_lists_id", "email_templates_id", "email_campaigns_id", "client_requests_id", "clients_id", "deployments_id", "forms_id", "form_submissions_id", "redirects_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`client_requests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_deployments_id_idx\` ON \`payload_locked_documents_rels\` (\`deployments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`bottom_text\` text,
  	\`show_social_links\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer\`("id", "bottom_text", "show_social_links", "updated_at", "created_at") SELECT "id", "bottom_text", "show_social_links", "updated_at", "created_at" FROM \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer\` RENAME TO \`footer\`;`)
  await db.run(sql`CREATE TABLE \`__new_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer_columns\`("_order", "_parent_id", "id", "heading") SELECT "_order", "_parent_id", "id", "heading" FROM \`footer_columns\`;`)
  await db.run(sql`DROP TABLE \`footer_columns\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer_columns\` RENAME TO \`footer_columns\`;`)
  await db.run(sql`CREATE INDEX \`footer_columns_order_idx\` ON \`footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_columns_parent_id_idx\` ON \`footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`footer_columns_links\` DROP COLUMN \`icon\`;`)
}

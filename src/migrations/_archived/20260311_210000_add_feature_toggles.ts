import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Migration: Add featureToggles columns to e_commerce_settings
 *
 * Adds all feature toggle checkboxes as boolean columns.
 * These control which collections/features are visible in the admin sidebar and frontend.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  const columns = [
    'feature_toggles_enable_products',
    'feature_toggles_enable_brands',
    'feature_toggles_enable_branches',
    'feature_toggles_enable_recently_viewed',
    'feature_toggles_enable_edition_notifications',
    'feature_toggles_enable_reviews',
    'feature_toggles_enable_wishlist',
    'feature_toggles_enable_orders',
    'feature_toggles_enable_invoices',
    'feature_toggles_enable_returns',
    'feature_toggles_enable_promotions',
    'feature_toggles_enable_quick_order',
    'feature_toggles_enable_order_lists',
    'feature_toggles_enable_recurring_orders',
    'feature_toggles_enable_notifications',
    'feature_toggles_enable_loyalty',
    'feature_toggles_enable_subscriptions',
    'feature_toggles_enable_gift_vouchers',
    'feature_toggles_enable_licenses',
    'feature_toggles_enable_customer_groups',
    'feature_toggles_enable_company_accounts',
    'feature_toggles_enable_approval_workflow',
    'feature_toggles_enable_quotes',
    'feature_toggles_enable_vendors',
    'feature_toggles_enable_vendor_reviews',
    'feature_toggles_enable_workshops',
    'feature_toggles_enable_blog',
    'feature_toggles_enable_testimonials',
    'feature_toggles_enable_cases',
    'feature_toggles_enable_partners',
    'feature_toggles_enable_services',
    'feature_toggles_enable_magazines',
    'feature_toggles_enable_experiences',
    'feature_toggles_enable_construction',
    'feature_toggles_enable_hospitality',
    'feature_toggles_enable_beauty',
    'feature_toggles_enable_horeca',
    'feature_toggles_enable_ab_testing',
    'feature_toggles_enable_push_notifications',
    'feature_toggles_enable_stock_notifications',
  ]

  for (const col of columns) {
    await db.query(`ALTER TABLE e_commerce_settings ADD COLUMN IF NOT EXISTS "${col}" boolean`)
  }

  // B2B feature toggles (in B2B Instellingen tab, group: b2bFeatures)
  const b2bColumns = [
    'b2b_features_enable_customer_groups',
    'b2b_features_enable_company_accounts',
    'b2b_features_enable_approval_workflow',
    'b2b_features_enable_quotes',
  ]

  for (const col of b2bColumns) {
    await db.query(`ALTER TABLE e_commerce_settings ADD COLUMN IF NOT EXISTS "${col}" boolean`)
  }

  payload.logger.info('Migration: feature toggles + b2b feature columns added to e_commerce_settings')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const db = payload.db?.pool
  if (!db) return

  const columns = [
    'feature_toggles_enable_products',
    'feature_toggles_enable_brands',
    'feature_toggles_enable_branches',
    'feature_toggles_enable_recently_viewed',
    'feature_toggles_enable_edition_notifications',
    'feature_toggles_enable_reviews',
    'feature_toggles_enable_wishlist',
    'feature_toggles_enable_orders',
    'feature_toggles_enable_invoices',
    'feature_toggles_enable_returns',
    'feature_toggles_enable_promotions',
    'feature_toggles_enable_quick_order',
    'feature_toggles_enable_order_lists',
    'feature_toggles_enable_recurring_orders',
    'feature_toggles_enable_notifications',
    'feature_toggles_enable_loyalty',
    'feature_toggles_enable_subscriptions',
    'feature_toggles_enable_gift_vouchers',
    'feature_toggles_enable_licenses',
    'feature_toggles_enable_customer_groups',
    'feature_toggles_enable_company_accounts',
    'feature_toggles_enable_approval_workflow',
    'feature_toggles_enable_quotes',
    'feature_toggles_enable_vendors',
    'feature_toggles_enable_vendor_reviews',
    'feature_toggles_enable_workshops',
    'feature_toggles_enable_blog',
    'feature_toggles_enable_testimonials',
    'feature_toggles_enable_cases',
    'feature_toggles_enable_partners',
    'feature_toggles_enable_services',
    'feature_toggles_enable_magazines',
    'feature_toggles_enable_experiences',
    'feature_toggles_enable_construction',
    'feature_toggles_enable_hospitality',
    'feature_toggles_enable_beauty',
    'feature_toggles_enable_horeca',
    'feature_toggles_enable_ab_testing',
    'feature_toggles_enable_push_notifications',
    'feature_toggles_enable_stock_notifications',
  ]

  for (const col of columns) {
    await db.query(`ALTER TABLE e_commerce_settings DROP COLUMN IF EXISTS "${col}"`)
  }

  const b2bColumns = [
    'b2b_features_enable_customer_groups',
    'b2b_features_enable_company_accounts',
    'b2b_features_enable_approval_workflow',
    'b2b_features_enable_quotes',
  ]

  for (const col of b2bColumns) {
    await db.query(`ALTER TABLE e_commerce_settings DROP COLUMN IF EXISTS "${col}"`)
  }
}

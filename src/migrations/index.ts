import * as migration_20260305_000000_baseline from './20260305_000000_baseline';
import * as migration_20260305_190000_add_product_type_tables from './20260305_190000_add_product_type_tables';
import * as migration_20260305_200000_add_canonical_and_hide_from_catalog from './20260305_200000_add_canonical_and_hide_from_catalog';
import * as migration_20260305_220000_add_button_tokens from './20260305_220000_add_button_tokens';
import * as migration_20260306_120000_add_subscription_pages from './20260306_120000_add_subscription_pages';
import * as migration_20260306_130000_add_magazines from './20260306_130000_add_magazines';
import * as migration_20260306_140000_expand_magazines_subscriptions from './20260306_140000_expand_magazines_subscriptions';
import * as migration_20260306_170000_chatbot_avatar_image from './20260306_170000_chatbot_avatar_image';
import * as migration_20260306_180000_chatbot_conversation_flows from './20260306_180000_chatbot_conversation_flows';
import * as migration_20260308_120000_add_email_notification_settings from './20260308_120000_add_email_notification_settings';
import * as migration_20260308_140000_add_abandoned_cart_and_carrier_settings from './20260308_140000_add_abandoned_cart_and_carrier_settings';
import * as migration_20260308_160000_extend_quotes_for_conversion from './20260308_160000_extend_quotes_for_conversion';
import * as migration_20260309_060000_add_settings_template_columns from './20260309_060000_add_settings_template_columns';
import * as migration_20260309_120000_add_two_factor_auth from './20260309_120000_add_two_factor_auth';
import * as migration_20260309_140000_b2b_company_accounts from './20260309_140000_b2b_company_accounts';
import * as migration_20260309_160000_b2b_approval_requests from './20260309_160000_b2b_approval_requests';
import * as migration_20260309_180000_add_content_scheduling from './20260309_180000_add_content_scheduling';
import * as migration_20260309_200000_add_uptime_incidents from './20260309_200000_add_uptime_incidents';

export const migrations = [
  {
    up: migration_20260305_000000_baseline.up,
    down: migration_20260305_000000_baseline.down,
    name: '20260305_000000_baseline',
  },
  {
    up: migration_20260305_190000_add_product_type_tables.up,
    down: migration_20260305_190000_add_product_type_tables.down,
    name: '20260305_190000_add_product_type_tables',
  },
  {
    up: migration_20260305_200000_add_canonical_and_hide_from_catalog.up,
    down: migration_20260305_200000_add_canonical_and_hide_from_catalog.down,
    name: '20260305_200000_add_canonical_and_hide_from_catalog',
  },
  {
    up: migration_20260305_220000_add_button_tokens.up,
    down: migration_20260305_220000_add_button_tokens.down,
    name: '20260305_220000_add_button_tokens',
  },
  {
    up: migration_20260306_120000_add_subscription_pages.up,
    down: migration_20260306_120000_add_subscription_pages.down,
    name: '20260306_120000_add_subscription_pages',
  },
  {
    up: migration_20260306_130000_add_magazines.up,
    down: migration_20260306_130000_add_magazines.down,
    name: '20260306_130000_add_magazines',
  },
  {
    up: migration_20260306_140000_expand_magazines_subscriptions.up,
    down: migration_20260306_140000_expand_magazines_subscriptions.down,
    name: '20260306_140000_expand_magazines_subscriptions',
  },
  {
    up: migration_20260306_170000_chatbot_avatar_image.up,
    down: migration_20260306_170000_chatbot_avatar_image.down,
    name: '20260306_170000_chatbot_avatar_image',
  },
  {
    up: migration_20260306_180000_chatbot_conversation_flows.up,
    down: migration_20260306_180000_chatbot_conversation_flows.down,
    name: '20260306_180000_chatbot_conversation_flows',
  },
  {
    up: migration_20260308_120000_add_email_notification_settings.up,
    down: migration_20260308_120000_add_email_notification_settings.down,
    name: '20260308_120000_add_email_notification_settings',
  },
  {
    up: migration_20260308_140000_add_abandoned_cart_and_carrier_settings.up,
    down: migration_20260308_140000_add_abandoned_cart_and_carrier_settings.down,
    name: '20260308_140000_add_abandoned_cart_and_carrier_settings',
  },
  {
    up: migration_20260308_160000_extend_quotes_for_conversion.up,
    down: migration_20260308_160000_extend_quotes_for_conversion.down,
    name: '20260308_160000_extend_quotes_for_conversion',
  },
  {
    up: migration_20260309_060000_add_settings_template_columns.up,
    down: migration_20260309_060000_add_settings_template_columns.down,
    name: '20260309_060000_add_settings_template_columns',
  },
  {
    up: migration_20260309_120000_add_two_factor_auth.up,
    down: migration_20260309_120000_add_two_factor_auth.down,
    name: '20260309_120000_add_two_factor_auth',
  },
  {
    up: migration_20260309_140000_b2b_company_accounts.up,
    down: migration_20260309_140000_b2b_company_accounts.down,
    name: '20260309_140000_b2b_company_accounts',
  },
  {
    up: migration_20260309_160000_b2b_approval_requests.up,
    down: migration_20260309_160000_b2b_approval_requests.down,
    name: '20260309_160000_b2b_approval_requests',
  },
  {
    up: migration_20260309_180000_add_content_scheduling.up,
    down: migration_20260309_180000_add_content_scheduling.down,
    name: '20260309_180000_add_content_scheduling',
  },
  {
    up: migration_20260309_200000_add_uptime_incidents.up,
    down: migration_20260309_200000_add_uptime_incidents.down,
    name: '20260309_200000_add_uptime_incidents',
  },
];

import * as migration_20260221_083030_baseline_schema from './old/20260221_083030_baseline_schema';
import * as migration_20260221_215821_sprint1_with_variable_products from './old/20260221_215821_sprint1_with_variable_products';
import * as migration_20260222_215225_add_ab_testing_collections from './old/20260222_215225_add_ab_testing_collections';
import * as migration_20260222_215445_update_settings_ecommerce_fields from './old/20260222_215445_update_settings_ecommerce_fields';
import * as migration_20260222_233500_fix_blogposts_duplicate_meta from './old/20260222_233500_fix_blogposts_duplicate_meta';
import * as migration_20260223_115055_add_theme_status_colors_and_gradients from './old/20260223_115055_add_theme_status_colors_and_gradients';
import * as migration_20260224_110327_add_compass_design_tokens from './old/20260224_110327_add_compass_design_tokens';
import * as migration_20260224_120000_add_themes_collection from './old/20260224_120000_add_themes_collection';
import * as migration_20260224_200947_sprint10_schema from './old/20260224_200947_sprint10_schema';
import * as migration_20260224_211305_email_marketing_collections from './old/20260224_211305_email_marketing_collections';
import * as migration_20260224_211435_email_marketing_indexes from './old/20260224_211435_email_marketing_indexes';
import * as migration_20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory from './old/20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory';
import * as migration_20260224_233259_email_api_keys_collection from './old/20260224_233259_email_api_keys_collection';
import * as migration_20260302_170000_add_module_tables from './20260302_170000_add_module_tables';
import * as migration_20260303_120000_brands_hierarchy from './20260303_120000_brands_hierarchy';
import * as migration_20260303_130000_checkout_flow_field from './20260303_130000_checkout_flow_field';
import * as migration_20260303_140000_add_category_content from './20260303_140000_add_category_content';
import * as migration_20260303_160000_add_template4_enum from './20260303_160000_add_template4_enum';
import * as migration_20260303_190000_add_guest_checkout_fields from './20260303_190000_add_guest_checkout_fields';
import * as migration_20260304_100000_add_shipping_methods from './20260304_100000_add_shipping_methods';
import * as migration_20260304_110000_add_checkout_payment_options from './20260304_110000_add_checkout_payment_options';
import * as migration_20260304_120000_add_ecommerce_settings from './20260304_120000_add_ecommerce_settings';
import * as migration_20260304_130000_add_instant_search_display from './20260304_130000_add_instant_search_display';
import * as migration_20260304_140000_add_brands_tagline_certifications from './20260304_140000_add_brands_tagline_certifications';
import * as migration_20260304_150000_add_brands_template_setting from './20260304_150000_add_brands_template_setting';
import * as migration_20260305_100000_add_discount_codes from './20260305_100000_add_discount_codes';
import * as migration_20260304_170000_extend_orders_addresses from './20260304_170000_extend_orders_addresses';
import * as migration_20260304_180000_account_template_field from './20260304_180000_account_template_field';
import * as migration_20260305_120000_quotes_collection from './20260305_120000_quotes_collection';

export const migrations = [
  {
    up: migration_20260221_083030_baseline_schema.up,
    down: migration_20260221_083030_baseline_schema.down,
    name: '20260221_083030_baseline_schema',
  },
  {
    up: migration_20260221_215821_sprint1_with_variable_products.up,
    down: migration_20260221_215821_sprint1_with_variable_products.down,
    name: '20260221_215821_sprint1_with_variable_products',
  },
  {
    up: migration_20260222_215225_add_ab_testing_collections.up,
    down: migration_20260222_215225_add_ab_testing_collections.down,
    name: '20260222_215225_add_ab_testing_collections',
  },
  {
    up: migration_20260222_215445_update_settings_ecommerce_fields.up,
    down: migration_20260222_215445_update_settings_ecommerce_fields.down,
    name: '20260222_215445_update_settings_ecommerce_fields',
  },
  {
    up: migration_20260222_233500_fix_blogposts_duplicate_meta.up,
    down: migration_20260222_233500_fix_blogposts_duplicate_meta.down,
    name: '20260222_233500_fix_blogposts_duplicate_meta',
  },
  {
    up: migration_20260223_115055_add_theme_status_colors_and_gradients.up,
    down: migration_20260223_115055_add_theme_status_colors_and_gradients.down,
    name: '20260223_115055_add_theme_status_colors_and_gradients',
  },
  {
    up: migration_20260224_110327_add_compass_design_tokens.up,
    down: migration_20260224_110327_add_compass_design_tokens.down,
    name: '20260224_110327_add_compass_design_tokens',
  },
  {
    up: migration_20260224_120000_add_themes_collection.up,
    down: migration_20260224_120000_add_themes_collection.down,
    name: '20260224_120000_add_themes_collection',
  },
  {
    up: migration_20260224_200947_sprint10_schema.up,
    down: migration_20260224_200947_sprint10_schema.down,
    name: '20260224_200947_sprint10_schema',
  },
  {
    up: migration_20260224_211305_email_marketing_collections.up,
    down: migration_20260224_211305_email_marketing_collections.down,
    name: '20260224_211305_email_marketing_collections',
  },
  {
    up: migration_20260224_211435_email_marketing_indexes.up,
    down: migration_20260224_211435_email_marketing_indexes.down,
    name: '20260224_211435_email_marketing_indexes',
  },
  {
    up: migration_20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory.up,
    down: migration_20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory.down,
    name: '20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory',
  },
  {
    up: migration_20260224_233259_email_api_keys_collection.up,
    down: migration_20260224_233259_email_api_keys_collection.down,
    name: '20260224_233259_email_api_keys_collection',
  },
  {
    up: migration_20260302_170000_add_module_tables.up,
    down: migration_20260302_170000_add_module_tables.down,
    name: '20260302_170000_add_module_tables',
  },
  {
    up: migration_20260303_120000_brands_hierarchy.up,
    down: migration_20260303_120000_brands_hierarchy.down,
    name: '20260303_120000_brands_hierarchy',
  },
  {
    up: migration_20260303_130000_checkout_flow_field.up,
    down: migration_20260303_130000_checkout_flow_field.down,
    name: '20260303_130000_checkout_flow_field',
  },
  {
    up: migration_20260303_140000_add_category_content.up,
    down: migration_20260303_140000_add_category_content.down,
    name: '20260303_140000_add_category_content',
  },
  {
    up: migration_20260303_160000_add_template4_enum.up,
    down: migration_20260303_160000_add_template4_enum.down,
    name: '20260303_160000_add_template4_enum',
  },
  {
    up: migration_20260303_190000_add_guest_checkout_fields.up,
    down: migration_20260303_190000_add_guest_checkout_fields.down,
    name: '20260303_190000_add_guest_checkout_fields',
  },
  {
    up: migration_20260304_100000_add_shipping_methods.up,
    down: migration_20260304_100000_add_shipping_methods.down,
    name: '20260304_100000_add_shipping_methods',
  },
  {
    up: migration_20260304_110000_add_checkout_payment_options.up,
    down: migration_20260304_110000_add_checkout_payment_options.down,
    name: '20260304_110000_add_checkout_payment_options',
  },
  {
    up: migration_20260304_120000_add_ecommerce_settings.up,
    down: migration_20260304_120000_add_ecommerce_settings.down,
    name: '20260304_120000_add_ecommerce_settings',
  },
  {
    up: migration_20260304_130000_add_instant_search_display.up,
    down: migration_20260304_130000_add_instant_search_display.down,
    name: '20260304_130000_add_instant_search_display',
  },
  {
    up: migration_20260304_140000_add_brands_tagline_certifications.up,
    down: migration_20260304_140000_add_brands_tagline_certifications.down,
    name: '20260304_140000_add_brands_tagline_certifications',
  },
  {
    up: migration_20260304_150000_add_brands_template_setting.up,
    down: migration_20260304_150000_add_brands_template_setting.down,
    name: '20260304_150000_add_brands_template_setting',
  },
  {
    up: migration_20260305_100000_add_discount_codes.up,
    down: migration_20260305_100000_add_discount_codes.down,
    name: '20260305_100000_add_discount_codes',
  },
  {
    up: migration_20260304_170000_extend_orders_addresses.up,
    down: migration_20260304_170000_extend_orders_addresses.down,
    name: '20260304_170000_extend_orders_addresses',
  },
  {
    up: migration_20260304_180000_account_template_field.up,
    down: migration_20260304_180000_account_template_field.down,
    name: '20260304_180000_account_template_field',
  },
  {
    up: migration_20260305_120000_quotes_collection.up,
    down: migration_20260305_120000_quotes_collection.down,
    name: '20260305_120000_quotes_collection',
  },
];

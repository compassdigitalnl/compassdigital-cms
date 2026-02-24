import * as migration_20260221_083030_baseline_schema from './20260221_083030_baseline_schema';
import * as migration_20260221_215821_sprint1_with_variable_products from './20260221_215821_sprint1_with_variable_products';
import * as migration_20260222_215225_add_ab_testing_collections from './20260222_215225_add_ab_testing_collections';
import * as migration_20260222_215445_update_settings_ecommerce_fields from './20260222_215445_update_settings_ecommerce_fields';
import * as migration_20260222_233500_fix_blogposts_duplicate_meta from './20260222_233500_fix_blogposts_duplicate_meta';
import * as migration_20260223_115055_add_theme_status_colors_and_gradients from './20260223_115055_add_theme_status_colors_and_gradients';
import * as migration_20260224_110327_add_compass_design_tokens from './20260224_110327_add_compass_design_tokens';
import * as migration_20260224_120000_add_themes_collection from './20260224_120000_add_themes_collection';
import * as migration_20260224_200947_sprint10_schema from './20260224_200947_sprint10_schema';
import * as migration_20260224_211305_email_marketing_collections from './20260224_211305_email_marketing_collections';
import * as migration_20260224_211435_email_marketing_indexes from './20260224_211435_email_marketing_indexes';
import * as migration_20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory from './20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory';

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
    name: '20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory'
  },
];

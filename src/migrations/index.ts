import * as migration_20260221_083030_baseline_schema from './20260221_083030_baseline_schema';
import * as migration_20260221_215821_sprint1_with_variable_products from './20260221_215821_sprint1_with_variable_products';
import * as migration_20260222_215225_add_ab_testing_collections from './20260222_215225_add_ab_testing_collections';
import * as migration_20260222_215445_update_settings_ecommerce_fields from './20260222_215445_update_settings_ecommerce_fields';
import * as migration_20260222_233500_fix_blogposts_duplicate_meta from './20260222_233500_fix_blogposts_duplicate_meta';

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
];

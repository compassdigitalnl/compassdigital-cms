import * as migration_20260221_083030_baseline_schema from './20260221_083030_baseline_schema';
import * as migration_20260221_215821_sprint1_with_variable_products from './20260221_215821_sprint1_with_variable_products';

export const migrations = [
  {
    up: migration_20260221_083030_baseline_schema.up,
    down: migration_20260221_083030_baseline_schema.down,
    name: '20260221_083030_baseline_schema',
  },
  {
    up: migration_20260221_215821_sprint1_with_variable_products.up,
    down: migration_20260221_215821_sprint1_with_variable_products.down,
    name: '20260221_215821_sprint1_with_variable_products'
  },
];

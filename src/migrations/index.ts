import * as migration_20260305_000000_baseline from './20260305_000000_baseline';
import * as migration_20260305_190000_add_product_type_tables from './20260305_190000_add_product_type_tables';

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
];

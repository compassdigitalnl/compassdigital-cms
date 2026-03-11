import * as migration_20260311_000000_consolidated_full_schema from './20260311_000000_consolidated_full_schema';

export const migrations = [
  {
    up: migration_20260311_000000_consolidated_full_schema.up,
    down: migration_20260311_000000_consolidated_full_schema.down,
    name: '20260311_000000_consolidated_full_schema',
  },
];

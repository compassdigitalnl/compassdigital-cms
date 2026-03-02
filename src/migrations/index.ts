import * as migration_20260302_170000_complete_schema from './20260302_170000_complete_schema';

export const migrations = [
  {
    up: migration_20260302_170000_complete_schema.up,
    down: migration_20260302_170000_complete_schema.down,
    name: '20260302_170000_complete_schema'
  },
];

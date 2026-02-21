import * as migration_20260221_083030_baseline_schema from './20260221_083030_baseline_schema';
import * as migration_20260221_215215_complete_sprint1_schema from './20260221_215215_complete_sprint1_schema';

export const migrations = [
  {
    up: migration_20260221_083030_baseline_schema.up,
    down: migration_20260221_083030_baseline_schema.down,
    name: '20260221_083030_baseline_schema',
  },
  {
    up: migration_20260221_215215_complete_sprint1_schema.up,
    down: migration_20260221_215215_complete_sprint1_schema.down,
    name: '20260221_215215_complete_sprint1_schema'
  },
];

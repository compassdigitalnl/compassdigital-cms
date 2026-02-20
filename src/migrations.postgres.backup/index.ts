import * as migration_20260218_055843 from './20260218_055843';
import * as migration_20260218_103115 from './20260218_103115';

export const migrations = [
  {
    up: migration_20260218_055843.up,
    down: migration_20260218_055843.down,
    name: '20260218_055843',
  },
  {
    up: migration_20260218_103115.up,
    down: migration_20260218_103115.down,
    name: '20260218_103115'
  },
];

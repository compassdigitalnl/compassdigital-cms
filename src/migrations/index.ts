import * as migration_20260313_200000_digital_library from './20260313_200000_digital_library'

export const migrations = [
  {
    up: migration_20260313_200000_digital_library.up,
    down: migration_20260313_200000_digital_library.down,
    name: '20260313_200000_digital_library',
  },
];

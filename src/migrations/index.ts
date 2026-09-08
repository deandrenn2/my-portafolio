import * as migration_20260908_025417_init from './20260908_025417_init';

export const migrations = [
  {
    up: migration_20260908_025417_init.up,
    down: migration_20260908_025417_init.down,
    name: '20260908_025417_init'
  },
];

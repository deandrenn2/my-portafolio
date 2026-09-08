import * as migration_20260908_025417_init from './20260908_025417_init';
import * as migration_20260908_180259_add_contact_settings from './20260908_180259_add_contact_settings';

export const migrations = [
  {
    up: migration_20260908_025417_init.up,
    down: migration_20260908_025417_init.down,
    name: '20260908_025417_init'
  },
  {
    up: migration_20260908_180259_add_contact_settings.up,
    down: migration_20260908_180259_add_contact_settings.down,
    name: '20260908_180259_add_contact_settings'
  },
];

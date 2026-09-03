import * as migration_20260903_190956_inicial from './20260903_190956_inicial';

export const migrations = [
  {
    up: migration_20260903_190956_inicial.up,
    down: migration_20260903_190956_inicial.down,
    name: '20260903_190956_inicial'
  },
];

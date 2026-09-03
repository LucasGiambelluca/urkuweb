import * as migration_20260903_190956_inicial from './20260903_190956_inicial';
import * as migration_20260903_193441_agregar_rol from './20260903_193441_agregar_rol';

export const migrations = [
  {
    up: migration_20260903_190956_inicial.up,
    down: migration_20260903_190956_inicial.down,
    name: '20260903_190956_inicial',
  },
  {
    up: migration_20260903_193441_agregar_rol.up,
    down: migration_20260903_193441_agregar_rol.down,
    name: '20260903_193441_agregar_rol'
  },
];

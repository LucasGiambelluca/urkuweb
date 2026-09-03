import * as migration_20260903_190956_inicial from './20260903_190956_inicial';
import * as migration_20260903_193441_agregar_rol from './20260903_193441_agregar_rol';
import * as migration_20260903_201741_consultas from './20260903_201741_consultas';
import * as migration_20260903_205031_sponsors from './20260903_205031_sponsors';

export const migrations = [
  {
    up: migration_20260903_190956_inicial.up,
    down: migration_20260903_190956_inicial.down,
    name: '20260903_190956_inicial',
  },
  {
    up: migration_20260903_193441_agregar_rol.up,
    down: migration_20260903_193441_agregar_rol.down,
    name: '20260903_193441_agregar_rol',
  },
  {
    up: migration_20260903_201741_consultas.up,
    down: migration_20260903_201741_consultas.down,
    name: '20260903_201741_consultas',
  },
  {
    up: migration_20260903_205031_sponsors.up,
    down: migration_20260903_205031_sponsors.down,
    name: '20260903_205031_sponsors'
  },
];

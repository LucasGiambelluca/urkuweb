import * as migration_20260903_190956_inicial from './20260903_190956_inicial';
import * as migration_20260903_193441_agregar_rol from './20260903_193441_agregar_rol';
import * as migration_20260903_201741_consultas from './20260903_201741_consultas';
import * as migration_20260903_205031_sponsors from './20260903_205031_sponsors';
import * as migration_20260903_215202_globales from './20260903_215202_globales';
import * as migration_20260903_221046_alquiler from './20260903_221046_alquiler';
import * as migration_20260903_222736_whatsapp_alquiler from './20260903_222736_whatsapp_alquiler';
import * as migration_20260904_002849_home_bloques from './20260904_002849_home_bloques';
import * as migration_20260904_141216_popup from './20260904_141216_popup';

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
    name: '20260903_205031_sponsors',
  },
  {
    up: migration_20260903_215202_globales.up,
    down: migration_20260903_215202_globales.down,
    name: '20260903_215202_globales',
  },
  {
    up: migration_20260903_221046_alquiler.up,
    down: migration_20260903_221046_alquiler.down,
    name: '20260903_221046_alquiler',
  },
  {
    up: migration_20260903_222736_whatsapp_alquiler.up,
    down: migration_20260903_222736_whatsapp_alquiler.down,
    name: '20260903_222736_whatsapp_alquiler',
  },
  {
    up: migration_20260904_002849_home_bloques.up,
    down: migration_20260904_002849_home_bloques.down,
    name: '20260904_002849_home_bloques',
  },
  {
    up: migration_20260904_141216_popup.up,
    down: migration_20260904_141216_popup.down,
    name: '20260904_141216_popup'
  },
];

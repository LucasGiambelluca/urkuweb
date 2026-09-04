import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';
import { BLOQUES_DE_SECCION } from '../blocks/secciones';

/** El orden con el que la home venia armada antes de existir el armador. */
const ORDEN_INICIAL = [
  'cifras',
  'historia',
  'lineaDeTiempo',
  'streaming',
  'visita',
  'servicios',
  'impacto',
  'comercio',
  'sponsors',
  'novedades',
].map((blockType) => ({ blockType }));

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Armado de la home',
  admin: {
    group: 'Contenido del sitio',
    description:
      'Que secciones aparecen en la portada y en que orden. El menu, la portada, el contacto y el pie son fijos.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'secciones',
      type: 'blocks',
      label: 'Secciones',
      minRows: 1,
      blocks: BLOQUES_DE_SECCION,
      defaultValue: ORDEN_INICIAL,
      admin: {
        description:
          'Arrastra para reordenar. Sacar una seccion no borra su contenido: vuelve a aparecer si la agregas de nuevo.',
      },
    },
  ],
};

import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Numeros: GlobalConfig = {
  slug: 'numeros',
  label: 'Numeros del predio',
  admin: {
    group: 'Contenido del sitio',
    description: 'Las cifras que se repiten a lo largo de la home.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'puestos',
      type: 'text',
      required: true,
      defaultValue: '2.200+',
      label: 'Puestos activos',
      admin: { description: 'Se escribe tal cual se muestra, con el signo mas si corresponde.' },
    },
    {
      name: 'personasDiarias',
      type: 'text',
      required: true,
      defaultValue: '5.000+',
      label: 'Personas por dia',
    },
    {
      name: 'empleos',
      type: 'text',
      required: true,
      defaultValue: '5.000+',
      label: 'Empleos generados',
    },
    {
      name: 'aniosTrayectoria',
      type: 'text',
      required: true,
      defaultValue: '30+',
      label: 'Anios de trayectoria',
      admin: {
        description:
          'A confirmar con el cliente: hasta ahora la web decia 30+ arriba y 25+ mas abajo.',
      },
    },
    {
      name: 'diasActividad',
      type: 'text',
      required: true,
      defaultValue: '365',
      label: 'Dias de actividad al anio',
    },
  ],
};

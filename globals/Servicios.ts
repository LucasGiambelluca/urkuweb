import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Servicios: GlobalConfig = {
  slug: 'servicios',
  label: 'Precios de servicios',
  admin: {
    group: 'Contenido del sitio',
    description: 'Tarifas de internet y estacionamiento.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'internet',
      type: 'group',
      label: 'Vouchers de internet',
      fields: [
        {
          name: 'diario',
          type: 'group',
          label: 'Voucher diario',
          fields: [
            { name: 'precio', type: 'text', required: true, defaultValue: '$1.000', label: 'Precio' },
            { name: 'moneda', type: 'text', required: true, defaultValue: 'ARS', label: 'Moneda' },
            {
              name: 'detalle',
              type: 'text',
              required: true,
              defaultValue: 'Valido por 24 horas para 1 dispositivo.',
              label: 'Detalle',
            },
          ],
        },
        {
          name: 'mensual',
          type: 'group',
          label: 'Voucher mensual',
          fields: [
            { name: 'precio', type: 'text', required: true, defaultValue: '$10.000', label: 'Precio' },
            { name: 'moneda', type: 'text', required: true, defaultValue: 'ARS', label: 'Moneda' },
            {
              name: 'detalle',
              type: 'text',
              required: true,
              defaultValue: '30 dias corridos para locatarios y personal.',
              label: 'Detalle',
            },
          ],
        },
      ],
    },
    {
      name: 'estacionamiento',
      type: 'group',
      label: 'Estacionamiento',
      fields: [
        { name: 'precio', type: 'text', required: true, defaultValue: '$10.000', label: 'Precio' },
        { name: 'moneda', type: 'text', required: true, defaultValue: 'ARS', label: 'Moneda' },
        {
          name: 'titulo',
          type: 'text',
          required: true,
          defaultValue: 'Estadia Completa',
          label: 'Nombre de la tarifa',
        },
      ],
    },
  ],
};

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
      name: 'alquiler',
      type: 'group',
      label: 'Alquiler de puestos',
      fields: [
        {
          name: 'condiciones',
          type: 'array',
          label: 'Condiciones',
          minRows: 1,
          labels: { singular: 'Condicion', plural: 'Condiciones' },
          admin: {
            description:
              'Se muestran como lista en la seccion de alquiler. El orden de esta lista es el orden en que se ven.',
          },
          defaultValue: [
            { titulo: 'Valor Mensual', detalle: '$1.900.000 ARS (Con expensas incluidas)' },
            {
              titulo: 'Forma de Pago',
              detalle: 'Pago completo del mes o hasta el 50% (Solo Transferencia)',
            },
            { titulo: 'Medidas del Puesto', detalle: 'Puesto de 2x2 Mts listo para operar' },
            { titulo: 'Condicion Fiscal', detalle: 'Monotributo (Minimo Categoria C)' },
            { titulo: 'Documentacion', detalle: 'DNI original en mano al momento de firmar' },
            { titulo: 'Cobros Electronicos', detalle: 'POSNET habilitado para ventas con tarjeta' },
          ],
          fields: [
            { name: 'titulo', type: 'text', required: true, label: 'Titulo' },
            { name: 'detalle', type: 'text', required: true, label: 'Detalle' },
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

import type { CollectionConfig } from 'payload';
import { soloAdmin, soloAutenticado } from '../access/roles';

export const Consultas: CollectionConfig = {
  slug: 'consultas',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['estado', 'tipo', 'nombre', 'email', 'createdAt'],
    group: 'Consultas',
    description: 'Mensajes que llegan por los formularios del sitio.',
  },
  labels: {
    singular: 'Consulta',
    plural: 'Consultas',
  },
  access: {
    // Cerrado por la API REST. El alta la hace la Server Action con la API
    // local de Payload, que corre en el servidor y no pasa por estas reglas.
    // Asi el formulario graba pero nadie puede insertar consultas desde afuera.
    create: () => false,
    read: soloAutenticado,
    update: soloAutenticado,
    delete: soloAdmin,
  },
  fields: [
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'nueva',
      label: 'Estado',
      options: [
        { label: 'Nueva', value: 'nueva' },
        { label: 'Leida', value: 'leida' },
        { label: 'Respondida', value: 'respondida' },
        { label: 'Cerrada', value: 'cerrada' },
      ],
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      label: 'Origen',
      options: [
        { label: 'Contacto', value: 'contacto' },
        { label: 'Publicidad', value: 'publicidad' },
      ],
      admin: { readOnly: true },
    },
    { name: 'nombre', type: 'text', required: true, label: 'Nombre', admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, label: 'Correo', admin: { readOnly: true } },
    { name: 'telefono', type: 'text', label: 'Telefono', admin: { readOnly: true } },
    { name: 'empresa', type: 'text', label: 'Empresa', admin: { readOnly: true } },
    { name: 'asunto', type: 'text', label: 'Asunto', admin: { readOnly: true } },
    {
      name: 'formato',
      type: 'text',
      label: 'Formato publicitario de interes',
      admin: {
        readOnly: true,
        description: 'Solo se completa en las consultas que llegan por publicidad.',
      },
    },
    {
      name: 'mensaje',
      type: 'textarea',
      required: true,
      label: 'Mensaje',
      admin: { readOnly: true },
    },
  ],
};

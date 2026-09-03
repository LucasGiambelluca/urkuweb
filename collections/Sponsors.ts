import type { CollectionConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { soloAutenticado } from '../access/roles';

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'categoria', 'orden', 'activo'],
    group: 'Contenido del sitio',
    description: 'Marcas que aparecen en la seccion de sponsors de la home.',
  },
  labels: {
    singular: 'Sponsor',
    plural: 'Sponsors',
  },
  access: {
    // La home los muestra sin sesion, asi que la lectura publica se limita a
    // los que estan activos. Los dados de baja solo se ven desde el panel.
    read: ({ req: { user } }) => {
      if (user) return true;
      return { activo: { equals: true } };
    },
    create: soloAutenticado,
    update: soloAutenticado,
    delete: soloAutenticado,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/');
      },
    ],
    afterDelete: [
      () => {
        revalidatePath('/');
      },
    ],
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre de la marca',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
      admin: {
        description: 'Preferentemente PNG o WEBP con fondo transparente.',
      },
    },
    {
      name: 'categoria',
      type: 'text',
      label: 'Rubro',
      admin: {
        description: 'Se muestra debajo del logo. Por ejemplo: Seguridad, Banca Institucional.',
      },
    },
    {
      name: 'sitioWeb',
      type: 'text',
      label: 'Sitio web (opcional)',
    },
    {
      name: 'tamano',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      label: 'Tamano del logo',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Grande', value: 'grande' },
      ],
      admin: {
        description:
          'Ajuste fino para que logos de proporciones distintas se vean parejos. Si el logo se ve chico, proba con Grande.',
      },
    },
    {
      name: 'orden',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Orden',
      admin: {
        description: 'De menor a mayor. Los de numero mas bajo aparecen primero.',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      label: 'Visible en el sitio',
      admin: {
        description: 'Destildar para sacarlo de la web sin borrar la ficha.',
      },
    },
  ],
};

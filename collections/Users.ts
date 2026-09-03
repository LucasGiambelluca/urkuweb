import type { CollectionConfig } from 'payload';
import {
  adminOSiMismo,
  campoSoloAdmin,
  soloAdmin,
  soloAdminSalvoSiMismo,
} from '../access/roles';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'rol', 'updatedAt'],
    group: 'Administracion',
  },
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  access: {
    // Antes esto era `() => true`: la lista de mails de administradores se
    // podia leer sin sesion desde /api/users.
    read: adminOSiMismo,
    create: soloAdmin,
    update: adminOSiMismo,
    delete: soloAdminSalvoSiMismo,
  },
  fields: [
    {
      name: 'rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: 'Rol',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Sin esto, un editor se edita a si mismo y se asciende.
        update: campoSoloAdmin,
        create: campoSoloAdmin,
      },
      admin: {
        description:
          'El administrador gestiona usuarios. El editor edita el contenido del sitio y ve las consultas.',
      },
    },
  ],
};

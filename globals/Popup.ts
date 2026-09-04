import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Popup: GlobalConfig = {
  slug: 'popup',
  label: 'Popup de bienvenida',
  admin: {
    group: 'Contenido del sitio',
    description: 'El aviso que aparece al entrar al sitio. Se muestra cada vez que alguien abre la portada.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mostrar el popup al entrar al sitio',
      admin: {
        description: 'Apagado, el popup no aparece aunque haya una imagen cargada.',
      },
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen del popup',
      admin: {
        description:
          'Se muestra entera, sin recortar. El texto que leen los lectores de pantalla sale del campo de texto alternativo de la imagen.',
      },
    },
    {
      name: 'enlace',
      type: 'text',
      label: 'A donde lleva la imagen',
      admin: {
        description:
          'Opcional. Una seccion del sitio (#contacto) o una direccion completa (https://...). Si queda vacio, la imagen no se puede clickear.',
      },
    },
  ],
};

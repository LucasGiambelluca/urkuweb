import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { es } from '@payloadcms/translations/languages/es';
import { formBuilderPlugin, formBuilderTranslations } from '@payloadcms/plugin-form-builder';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Posts } from './collections/Posts';
import { Consultas } from './collections/Consultas';
import { Sponsors } from './collections/Sponsors';
import { Numeros } from './globals/Numeros';
import { Servicios } from './globals/Servicios';
import { Contacto } from './globals/Contacto';
import { Home } from './globals/Home';
import { Popup } from './globals/Popup';
import { soloAdmin, soloAutenticado } from './access/roles';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const connectionString = process.env.DATABASE_URL || '';

// Sin secreto no se arranca. El valor por defecto que habia aca era publico:
// cualquiera que leyera el repositorio podia firmar sesiones validas.
const payloadSecret = process.env.PAYLOAD_SECRET;
if (!payloadSecret) {
  throw new Error('Falta PAYLOAD_SECRET en el entorno.');
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      // Sin espacio inicial: Payload ya separa el titulo del sufijo.
      titleSuffix: '- Paseo Urkupina',
      icons: [{ rel: 'icon', type: 'image/png', url: '/icon.png' }],
    },
    // Vista previa en vivo del armado de la home: muestra la pagina al lado
    // del formulario y la refresca al guardar.
    //
    // La url sale de NEXT_PUBLIC_SERVER_URL. En desarrollo Next toma el
    // primer puerto libre a partir del 3000, asi que si esa variable apunta
    // a un puerto donde no hay nada, la vista previa aparece en blanco.
    livePreview: {
      url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      globals: ['home'],
      breakpoints: [
        { name: 'celular', label: 'Celular', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'escritorio', label: 'Escritorio', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Categories, Media, Posts, Consultas, Sponsors],
  globals: [Numeros, Servicios, Contacto, Home, Popup],
  plugins: [
    formBuilderPlugin({
      // Solo los tipos que el cliente va a usar. Los de pago, pais, provincia,
      // fecha y archivo se apagan: el plugin los trae y en este sitio no hacen
      // mas que ensuciar el selector de campos.
      //
      // El tipo "mensaje" tambien queda apagado: guarda su texto en un campo
      // richText y habria que aplanarlo para dibujarlo. Nadie lo pidio.
      fields: {
        checkbox: true,
        country: false,
        date: false,
        email: true,
        message: false,
        number: true,
        payment: false,
        select: true,
        state: false,
        text: true,
        textarea: true,
        upload: false,
      },
      formOverrides: {
        labels: { singular: 'Formulario', plural: 'Formularios' },
        admin: {
          group: 'Contenido del sitio',
          description:
            'Los formularios que se pueden mostrar en la portada. Cada campo lleva su etiqueta y su ancho.',
        },
        access: {
          // La home se dibuja del lado del servidor con la API local, que no
          // pasa por estas reglas, asi que no hace falta exponer las
          // definiciones por la API REST.
          read: soloAutenticado,
          create: soloAutenticado,
          update: soloAutenticado,
          delete: soloAdmin,
        },
      },
      formSubmissionOverrides: {
        labels: { singular: 'Inscripción', plural: 'Inscripciones' },
        admin: {
          group: 'Consultas',
          description: 'Lo que carga la gente en los formularios del sitio.',
        },
        access: {
          // Cerrado por la API REST. El alta la hace la Server Action con la
          // API local, igual que las consultas.
          create: () => false,
          read: soloAutenticado,
          update: soloAutenticado,
          delete: soloAdmin,
        },
      },
    }),
  ],
  editor: lexicalEditor({}),
  // Necesario para el redimensionado de imagenes que pide collections/Media.ts
  // (miniatura y tarjeta). Sin esto, subir el logo de un sponsor falla.
  sharp,
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
    translations: formBuilderTranslations,
  },
  // Postgres corre en la misma maquina y se accede por loopback, asi que no
  // lleva SSL. El condicional anterior lo activaba solo para Supabase.
  db: postgresAdapter({
    pool: {
      connectionString,
    },
  }),
});

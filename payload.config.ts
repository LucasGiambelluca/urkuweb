import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Posts } from './collections/Posts';

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
  },
  collections: [Users, Categories, Media, Posts],
  editor: lexicalEditor({}),
  // Necesario para el redimensionado de imagenes que pide collections/Media.ts
  // (miniatura y tarjeta). Sin esto, subir el logo de un sponsor falla.
  sharp,
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Postgres corre en la misma maquina y se accede por loopback, asi que no
  // lleva SSL. El condicional anterior lo activaba solo para Supabase.
  db: postgresAdapter({
    pool: {
      connectionString,
    },
  }),
});

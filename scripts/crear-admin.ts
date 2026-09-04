/**
 * Crea un usuario administrador.
 *
 * La contrasena se pasa por entorno, no se escribe aca: este repositorio
 * tiene remoto publico y lo que entra al historial de git no sale mas.
 *
 * Uso: ADMIN_EMAIL='...' ADMIN_PASSWORD='...' npm run crear:admin
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el entorno.');
  process.exit(1);
}

const crear = async () => {
  const payload = await getPayload({ config });

  const existente = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  });

  if (existente.docs.length > 0) {
    console.log(`- usuario ${email}: ya existe, se omite`);
    return;
  }

  await payload.create({
    collection: 'users',
    data: { email, password, rol: 'admin' },
    overrideAccess: true,
  });

  console.log(`+ usuario ${email}: creado como administrador`);
};

try {
  await crear();
} catch (error) {
  console.error('Fallo la creacion del administrador:', error);
  process.exit(1);
}

process.exit(0);

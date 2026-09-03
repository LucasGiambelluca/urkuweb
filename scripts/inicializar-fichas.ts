/**
 * Escribe las tres fichas con sus valores por defecto.
 *
 * Una ficha de Payload no tiene fila en la base hasta que se guarda por
 * primera vez. Sin esto, la home consulta fichas vacias y cae al respaldo.
 *
 * Es idempotente: si la ficha ya tiene datos, no la pisa.
 *
 * Uso: npm run inicializar:fichas
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const FICHAS = ['numeros', 'servicios', 'contacto'] as const;

const inicializar = async () => {
  const payload = await getPayload({ config });

  for (const slug of FICHAS) {
    const actual = await payload.findGlobal({ slug, overrideAccess: true });

    // updatedAt solo existe si la ficha ya se guardo alguna vez.
    if (actual && 'updatedAt' in actual && actual.updatedAt) {
      console.log(`- ${slug}: ya tiene datos, se omite`);
      continue;
    }

    await payload.updateGlobal({ slug, data: {}, overrideAccess: true });
    console.log(`+ ${slug}: inicializada con los valores por defecto`);
  }
};

try {
  await inicializar();
} catch (error) {
  console.error('Fallo la inicializacion:', error);
  process.exit(1);
}

process.exit(0);

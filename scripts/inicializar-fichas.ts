/**
 * Escribe las tres fichas con sus valores por defecto.
 *
 * Una ficha de Payload no tiene fila en la base hasta que se guarda por
 * primera vez. Sin esto, la home consulta fichas vacias y cae al respaldo.
 *
 * Es idempotente: si la ficha ya tiene datos, no la pisa.
 *
 * LIMITACION: la idempotencia se mide por ficha entera, no por campo. Si mas
 * adelante se le agrega un campo nuevo a una ficha que ya fue inicializada,
 * este script la saltea y el campo queda vacio. En ese caso hay que cargarlo
 * desde el panel, o borrar la fila de esa ficha y volver a correr el script.
 *
 * Uso: npm run inicializar:fichas
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const FICHAS = ['numeros', 'servicios', 'contacto', 'home', 'popup'] as const;

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

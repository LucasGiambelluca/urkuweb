/**
 * Sube el banner de EXPOURKU a Media y lo deja asignado a la ficha del popup.
 *
 * Deja el popup APAGADO: la imagen queda lista y el cliente decide cuando
 * mostrarla. Sembrar algo que aparece solo en la cara del visitante seria
 * tomar por el una decision que no es nuestra.
 *
 * Es idempotente: si la ficha ya tiene una imagen, no la pisa.
 *
 * Uso: npm run sembrar:popup
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';
import config from '../payload.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const raizDelProyecto = path.resolve(dirname, '..');

const ARCHIVO = path.join(raizDelProyecto, 'public', 'images', 'popup', 'expourku.jpg');
const ALT = 'EXPOURKU en el Paseo de Compras Rene Gonzalo Rojas Paz. Vivi la experiencia.';

const sembrar = async () => {
  const payload = await getPayload({ config });

  const actual = await payload.findGlobal({ slug: 'popup', overrideAccess: true });
  if (actual?.imagen) {
    console.log('- popup: ya tiene una imagen cargada, se omite');
    return;
  }

  const imagen = await payload.create({
    collection: 'media',
    data: { alt: ALT },
    filePath: ARCHIVO,
    overrideAccess: true,
  });

  // Si asignar la imagen falla, se borra el archivo recien subido: sin esto
  // queda huerfano en Media y la proxima corrida sube otra copia.
  try {
    await payload.updateGlobal({
      slug: 'popup',
      data: { imagen: imagen.id, activo: false },
      overrideAccess: true,
    });
  } catch (error) {
    await payload.delete({ collection: 'media', id: imagen.id, overrideAccess: true });
    throw error;
  }

  console.log('+ popup: banner de EXPOURKU cargado y asignado, con el popup apagado');
};

// Con await de nivel superior, no con sembrar().catch(). `payload run` termina
// el proceso apenas el modulo deja de evaluarse.
try {
  await sembrar();
} catch (error) {
  console.error('Fallo la siembra del popup:', error);
  process.exit(1);
}

process.exit(0);

/**
 * Carga los cinco sponsors que estaban hardcodeados en SponsorShowcase.
 *
 * Es idempotente: si un sponsor ya existe por nombre, no lo duplica. Se puede
 * correr en desarrollo y en produccion sin pensar.
 *
 * Uso: npm run sembrar:sponsors
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';
import config from '../payload.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const raizDelProyecto = path.resolve(dirname, '..');

const SPONSORS = [
  {
    nombre: 'Commander Security',
    archivo: 'commandersecurity.png',
    categoria: 'Seguridad',
    tamano: 'grande' as const,
    orden: 10,
  },
  {
    nombre: 'Prosegur Seguridad',
    archivo: 'prosegur-vector-logo.png',
    categoria: 'Seguridad',
    tamano: 'grande' as const,
    orden: 20,
  },
  {
    nombre: 'Acudir Emergencias',
    archivo: 'Acudir-01-1.png',
    categoria: 'Emergencias Medicas',
    tamano: 'normal' as const,
    orden: 30,
  },
  {
    nombre: 'Banco Provincia',
    archivo: 'Banco_Provincia_(Bs.As.,_2021).svg.webp',
    categoria: 'Banca Institucional',
    tamano: 'normal' as const,
    orden: 40,
  },
  {
    nombre: 'Banco Credicoop',
    archivo: 'creedicop.png',
    categoria: 'Banca Cooperativa',
    tamano: 'normal' as const,
    orden: 50,
  },
];

const sembrar = async () => {
  const payload = await getPayload({ config });

  for (const sponsor of SPONSORS) {
    const existentes = await payload.find({
      collection: 'sponsors',
      where: { nombre: { equals: sponsor.nombre } },
      limit: 1,
      overrideAccess: true,
    });

    if (existentes.totalDocs > 0) {
      console.log(`- ${sponsor.nombre}: ya existe, se omite`);
      continue;
    }

    const logo = await payload.create({
      collection: 'media',
      data: { alt: `Logo de ${sponsor.nombre}` },
      filePath: path.join(raizDelProyecto, 'public', 'images', 'sponsors', sponsor.archivo),
      overrideAccess: true,
    });

    await payload.create({
      collection: 'sponsors',
      data: {
        nombre: sponsor.nombre,
        logo: logo.id,
        categoria: sponsor.categoria,
        tamano: sponsor.tamano,
        orden: sponsor.orden,
        activo: true,
      },
      overrideAccess: true,
    });

    console.log(`+ ${sponsor.nombre}: cargado`);
  }

  const total = await payload.count({ collection: 'sponsors', overrideAccess: true });
  console.log(`\nSponsors en la base: ${total.totalDocs}`);
  process.exit(0);
};

sembrar().catch((error) => {
  console.error('Fallo la siembra:', error);
  process.exit(1);
});

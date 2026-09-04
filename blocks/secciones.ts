import type { Block } from 'payload';

/**
 * Cada bloque corresponde a una seccion que ya existe en la home.
 *
 * La mayoria no lleva campos propios a proposito: su contenido sale de las
 * fichas y colecciones que ya existen (numeros, precios, contacto, sponsors).
 * El bloque solo dice "esta seccion va aca". Agregar campos por bloque es
 * facil despues; empezar con campos que nadie pidio, no.
 */
const bloque = (slug: string, singular: string): Block => ({
  slug,
  labels: { singular, plural: singular },
  // Sin campos: el bloque solo dice "esta seccion va aca". Payload lo acepta
  // y en el panel se ve como una fila con su nombre, que es exactamente lo
  // que hace falta para agregar, sacar y reordenar.
  fields: [],
});

export const BLOQUES_DE_SECCION: Block[] = [
  bloque('cifras', 'Cifras del predio'),
  bloque('historia', 'Historia'),
  bloque('lineaDeTiempo', 'Linea de tiempo'),
  bloque('streaming', 'Streaming ULIVE'),
  bloque('visita', 'Como visitarnos'),
  bloque('servicios', 'Servicios'),
  bloque('impacto', 'Impacto'),
  bloque('comercio', 'Comercio'),
  bloque('sponsors', 'Sponsors'),
  {
    slug: 'novedades',
    labels: { singular: 'Novedades', plural: 'Novedades' },
    fields: [
      {
        name: 'cantidad',
        type: 'number',
        required: true,
        defaultValue: 6,
        min: 1,
        max: 12,
        label: 'Cuantas notas mostrar',
      },
    ],
  },
];

export const SLUGS_DE_BLOQUE = BLOQUES_DE_SECCION.map((b) => b.slug);

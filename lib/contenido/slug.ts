/**
 * Convierte un titulo en un slug apto para una direccion web.
 *
 * Saca los acentos en vez de borrarlos, para que "Ampliación" quede
 * "ampliacion" y no "ampliacin": el cliente escribe con tildes y el slug
 * tiene que seguir siendo legible.
 */
export const aSlug = (texto: string): string =>
  texto
    .normalize('NFD')
    // Marcas diacriticas: quedan sueltas despues de normalizar.
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

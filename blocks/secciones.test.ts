import { describe, expect, it } from 'vitest';
import { BLOQUES_DE_SECCION, SLUGS_DE_BLOQUE } from './secciones';

describe('bloques de seccion', () => {
  it('define los diez bloques', () => {
    expect(BLOQUES_DE_SECCION).toHaveLength(10);
  });

  it('no repite slugs', () => {
    const slugs = BLOQUES_DE_SECCION.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('cada bloque tiene una etiqueta legible', () => {
    for (const bloque of BLOQUES_DE_SECCION) {
      expect(bloque.labels?.singular).toBeTruthy();
    }
  });

  it('expone los slugs como lista', () => {
    expect(SLUGS_DE_BLOQUE).toContain('sponsors');
    expect(SLUGS_DE_BLOQUE).toContain('novedades');
    expect(SLUGS_DE_BLOQUE).toHaveLength(10);
  });
});

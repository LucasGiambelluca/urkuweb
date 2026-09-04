import { describe, expect, it } from 'vitest';
import type { Post } from '@/payload-types';
import {
  NOVEDADES_RESPALDO,
  aNovedadVisible,
  ordenarNovedades,
  textoPlano,
  type NovedadVisible,
} from './novedades';

/** Arma un richText de Lexical con los parrafos que se le pasen. */
const richText = (...parrafos: string[]) =>
  ({
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: parrafos.map((texto) => ({
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', version: 1, text: texto }],
      })),
    },
  }) as Post['content'];

const post = (parcial: Partial<Post> = {}): Post => ({
  id: 1,
  title: 'Ampliacion del estacionamiento',
  slug: 'ampliacion-del-estacionamiento',
  category: { id: 1, name: 'Obras', slug: 'obras', updatedAt: '', createdAt: '' },
  content: richText('Se suman doscientas cocheras nuevas.'),
  status: 'published',
  publishedAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z',
  createdAt: '2026-07-20T12:00:00.000Z',
  ...parcial,
});

describe('textoPlano', () => {
  it('junta el texto de los parrafos', () => {
    expect(textoPlano(richText('Primero.', 'Segundo.'))).toBe('Primero. Segundo.');
  });

  it('devuelve vacio si no hay contenido', () => {
    expect(textoPlano(undefined)).toBe('');
  });
});

describe('aNovedadVisible', () => {
  const ahora = new Date('2026-08-15T00:00:00.000Z');

  it('usa el slug como identificador, para que el enlace sea legible', () => {
    expect(aNovedadVisible(post(), ahora).id).toBe('ampliacion-del-estacionamiento');
  });

  it('toma el nombre de la categoria', () => {
    expect(aNovedadVisible(post(), ahora).category).toBe('Obras');
  });

  it('deja la categoria vacia si vino sin poblar', () => {
    expect(aNovedadVisible(post({ category: 7 }), ahora).category).toBe('');
  });

  it('toma la url de la imagen destacada', () => {
    const conImagen = post({
      featuredImage: { id: 3, alt: 'Cocheras', url: '/media/cocheras.jpg', updatedAt: '', createdAt: '' },
    });
    expect(aNovedadVisible(conImagen, ahora).image).toBe('/media/cocheras.jpg');
  });

  it('prefiere la descripcion SEO como resumen', () => {
    const conSeo = post({ seoDescription: 'Doscientas cocheras mas.' });
    expect(aNovedadVisible(conSeo, ahora).content).toBe('Doscientas cocheras mas.');
  });

  it('cae al cuerpo del articulo si no hay descripcion SEO', () => {
    expect(aNovedadVisible(post(), ahora).content).toBe('Se suman doscientas cocheras nuevas.');
  });

  it('usa la fecha de publicacion', () => {
    expect(aNovedadVisible(post(), ahora).created_at).toBe('2026-08-01T12:00:00.000Z');
  });

  it('cae a la fecha de creacion si no hay fecha de publicacion', () => {
    expect(aNovedadVisible(post({ publishedAt: null }), ahora).created_at).toBe(
      '2026-07-20T12:00:00.000Z',
    );
  });

  it('marca como proxima la nota con fecha futura', () => {
    const futura = post({ publishedAt: '2026-09-30T12:00:00.000Z' });
    expect(aNovedadVisible(futura, ahora).isUpcoming).toBe(true);
  });

  it('no marca como proxima la nota ya publicada', () => {
    expect(aNovedadVisible(post(), ahora).isUpcoming).toBe(false);
  });
});

describe('NOVEDADES_RESPALDO', () => {
  it('trae las seis notas de ejemplo', () => {
    expect(NOVEDADES_RESPALDO).toHaveLength(6);
  });

  it('todas tienen imagen, para que la seccion no quede con huecos', () => {
    for (const novedad of NOVEDADES_RESPALDO) {
      expect(novedad.image).toBeTruthy();
    }
  });
});

describe('ordenarNovedades', () => {
  const novedad = (id: string, fecha?: string): NovedadVisible => ({
    id,
    title: id,
    content: '',
    created_at: fecha,
  });

  it('deja primero la mas reciente', () => {
    const orden = ordenarNovedades([
      novedad('vieja', '2026-01-01T00:00:00.000Z'),
      novedad('nueva', '2026-09-01T00:00:00.000Z'),
      novedad('media', '2026-05-01T00:00:00.000Z'),
    ]).map((n) => n.id);
    expect(orden).toEqual(['nueva', 'media', 'vieja']);
  });

  it('manda al final las que no tienen fecha', () => {
    const orden = ordenarNovedades([
      novedad('sin-fecha'),
      novedad('con-fecha', '2026-01-01T00:00:00.000Z'),
    ]).map((n) => n.id);
    expect(orden).toEqual(['con-fecha', 'sin-fecha']);
  });

  it('no modifica la lista original', () => {
    const lista = [novedad('a', '2026-01-01T00:00:00.000Z'), novedad('b', '2026-09-01T00:00:00.000Z')];
    ordenarNovedades(lista);
    expect(lista.map((n) => n.id)).toEqual(['a', 'b']);
  });
});

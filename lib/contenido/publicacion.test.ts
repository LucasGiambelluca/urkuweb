import { describe, expect, it } from 'vitest';
import { completarFechaDePublicacion } from './publicacion';

const ahora = new Date('2026-09-04T15:00:00.000Z');

describe('completarFechaDePublicacion', () => {
  it('pone la fecha del momento al publicar sin fecha', () => {
    const datos = completarFechaDePublicacion({ status: 'published' }, undefined, ahora);
    expect(datos.publishedAt).toBe('2026-09-04T15:00:00.000Z');
  });

  it('respeta la fecha que cargo el editor', () => {
    const datos = completarFechaDePublicacion(
      { status: 'published', publishedAt: '2027-01-15T10:00:00.000Z' },
      undefined,
      ahora,
    );
    expect(datos.publishedAt).toBe('2027-01-15T10:00:00.000Z');
  });

  it('no le pone fecha a un borrador', () => {
    const datos = completarFechaDePublicacion({ status: 'draft' }, undefined, ahora);
    expect(datos.publishedAt).toBeUndefined();
  });

  it('trata la cadena vacia como falta de fecha', () => {
    const datos = completarFechaDePublicacion(
      { status: 'published', publishedAt: '' },
      undefined,
      ahora,
    );
    expect(datos.publishedAt).toBe('2026-09-04T15:00:00.000Z');
  });

  it('completa cuando la edicion no trae el estado pero la nota ya estaba publicada', () => {
    const datos = completarFechaDePublicacion({}, { status: 'published' }, ahora);
    expect(datos.publishedAt).toBe('2026-09-04T15:00:00.000Z');
  });

  it('no completa si la nota guardada sigue siendo un borrador', () => {
    const datos = completarFechaDePublicacion({}, { status: 'draft' }, ahora);
    expect(datos.publishedAt).toBeUndefined();
  });

  it('respeta la fecha que ya tenia la nota guardada', () => {
    const datos = completarFechaDePublicacion(
      { status: 'published' },
      { status: 'published', publishedAt: '2026-08-01T10:00:00.000Z' },
      ahora,
    );
    expect(datos.publishedAt).toBeUndefined();
  });

  it('deja intacto el resto de los campos', () => {
    const datos = completarFechaDePublicacion(
      { status: 'published', title: 'Una nota' },
      undefined,
      ahora,
    );
    expect(datos.title).toBe('Una nota');
  });

  it('no vuelve a pisar la fecha cuando se despublica y se vuelve a publicar', () => {
    const despublicada = completarFechaDePublicacion(
      { status: 'draft' },
      { status: 'published', publishedAt: '2026-08-01T10:00:00.000Z' },
      ahora,
    );
    expect(despublicada.publishedAt).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { aSlug } from './slug';

describe('aSlug', () => {
  it('convierte un titulo normal a minusculas con guiones', () => {
    expect(aSlug('Optimizacion Envios Nacionales')).toBe('optimizacion-envios-nacionales');
  });

  it('saca los acentos en vez de borrarlos', () => {
    expect(aSlug('Ampliación del predio')).toBe('ampliacion-del-predio');
  });

  it('la ene con tilde queda como ene simple', () => {
    // Normalizar con NFD separa la ene de su virgulilla igual que separa una
    // vocal de su acento, asi que la Ñ pierde la marca y queda "n" en vez de
    // desaparecer del todo.
    expect(aSlug('Urkupiña')).toBe('urkupina');
  });

  it('reemplaza signos de puntuacion por guiones', () => {
    expect(aSlug('¿Qué pasó? ¡Genial!')).toBe('que-paso-genial');
  });

  it('colapsa espacios multiples en un solo guion', () => {
    expect(aSlug('Titulo   con    espacios')).toBe('titulo-con-espacios');
  });

  it('saca los guiones del principio y del final', () => {
    expect(aSlug('  Nota Nueva Con Espacios y Ñ  ')).toBe('nota-nueva-con-espacios-y-n');
  });

  it('no deja guiones colgando cuando el titulo empieza o termina con simbolos', () => {
    expect(aSlug('---hola---')).toBe('hola');
  });

  it('una cadena vacia da un slug vacio', () => {
    expect(aSlug('')).toBe('');
  });
});

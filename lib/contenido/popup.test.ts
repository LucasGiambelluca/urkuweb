import { describe, expect, it } from 'vitest';
import { aPopupVisible, esEnlaceExterno, type FichaDePopup } from './popup';

const imagen = {
  url: '/media/expourku.jpg',
  alt: 'Banner de EXPOURKU',
  width: 1206,
  height: 788,
};

const ficha = (parcial: Partial<FichaDePopup> = {}): FichaDePopup => ({
  activo: true,
  imagen,
  ...parcial,
});

describe('esEnlaceExterno', () => {
  it('reconoce una direccion completa', () => {
    expect(esEnlaceExterno('https://instagram.com/urkupina.s.a')).toBe(true);
  });

  it('acepta http ademas de https', () => {
    expect(esEnlaceExterno('http://ejemplo.com')).toBe(true);
  });

  it('no toma por externa un ancla del sitio', () => {
    expect(esEnlaceExterno('#contacto')).toBe(false);
  });

  it('no toma por externa una ruta del sitio', () => {
    expect(esEnlaceExterno('/novedades')).toBe(false);
  });
});

describe('aPopupVisible', () => {
  it('devuelve los datos cuando esta prendido y hay imagen', () => {
    expect(aPopupVisible(ficha())).toEqual({
      imagen: '/media/expourku.jpg',
      alt: 'Banner de EXPOURKU',
      ancho: 1206,
      alto: 788,
      enlace: undefined,
    });
  });

  it('no muestra nada con el interruptor apagado', () => {
    expect(aPopupVisible(ficha({ activo: false }))).toBeNull();
  });

  it('no muestra nada si nunca se cargo una imagen', () => {
    expect(aPopupVisible(ficha({ imagen: null }))).toBeNull();
  });

  it('no muestra nada si la relacion vino sin poblar', () => {
    expect(aPopupVisible(ficha({ imagen: 7 }))).toBeNull();
  });

  it('no muestra nada si la imagen no tiene url', () => {
    expect(aPopupVisible(ficha({ imagen: { ...imagen, url: null } }))).toBeNull();
  });

  it('no muestra nada si falta el tamano, porque next/image lo necesita', () => {
    expect(aPopupVisible(ficha({ imagen: { ...imagen, width: null } }))).toBeNull();
  });

  it('no muestra nada si la ficha no existe', () => {
    expect(aPopupVisible(null)).toBeNull();
  });

  it('pasa el enlace cuando esta cargado', () => {
    expect(aPopupVisible(ficha({ enlace: '#contacto' }))?.enlace).toBe('#contacto');
  });

  it('trata un enlace en blanco como si no hubiera', () => {
    expect(aPopupVisible(ficha({ enlace: '   ' }))?.enlace).toBeUndefined();
  });
});

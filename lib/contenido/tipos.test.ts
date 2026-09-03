import { describe, expect, it } from 'vitest';
import { enlaceWhatsapp, sinMas } from './tipos';

describe('sinMas', () => {
  it('quita el signo mas del final', () => {
    expect(sinMas('2.200+')).toBe('2.200');
  });

  it('deja intacto un valor sin signo', () => {
    expect(sinMas('365')).toBe('365');
  });
});

describe('enlaceWhatsapp', () => {
  it('arma el enlace con el mensaje codificado', () => {
    const url = enlaceWhatsapp({
      numero: '541124240338',
      mensaje: 'Hola, quiero consultar',
    });
    expect(url).toBe('https://wa.me/541124240338?text=Hola%2C%20quiero%20consultar');
  });

  it('codifica los caracteres con acento', () => {
    const url = enlaceWhatsapp({ numero: '1', mensaje: 'Urkupiña' });
    expect(url).toContain('Urkupi%C3%B1a');
  });
});

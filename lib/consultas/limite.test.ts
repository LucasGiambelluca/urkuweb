import { beforeEach, describe, expect, it } from 'vitest';
import { LimitadorEnvios } from './limite';

describe('LimitadorEnvios', () => {
  let ahora: number;
  let limitador: LimitadorEnvios;

  beforeEach(() => {
    ahora = 1_000_000;
    limitador = new LimitadorEnvios({ maximo: 3, ventanaMs: 60_000, reloj: () => ahora });
  });

  it('deja pasar los primeros envios', () => {
    expect(limitador.permitir('1.2.3.4')).toBe(true);
    expect(limitador.permitir('1.2.3.4')).toBe(true);
    expect(limitador.permitir('1.2.3.4')).toBe(true);
  });

  it('bloquea al superar el maximo', () => {
    limitador.permitir('1.2.3.4');
    limitador.permitir('1.2.3.4');
    limitador.permitir('1.2.3.4');
    expect(limitador.permitir('1.2.3.4')).toBe(false);
  });

  it('cuenta cada IP por separado', () => {
    limitador.permitir('1.2.3.4');
    limitador.permitir('1.2.3.4');
    limitador.permitir('1.2.3.4');
    expect(limitador.permitir('5.6.7.8')).toBe(true);
  });

  it('vuelve a permitir cuando pasa la ventana', () => {
    limitador.permitir('1.2.3.4');
    limitador.permitir('1.2.3.4');
    limitador.permitir('1.2.3.4');
    expect(limitador.permitir('1.2.3.4')).toBe(false);
    ahora += 60_001;
    expect(limitador.permitir('1.2.3.4')).toBe(true);
  });

  it('no acumula IPs viejas para siempre', () => {
    limitador.permitir('1.2.3.4');
    ahora += 60_001;
    limitador.permitir('5.6.7.8');
    expect(limitador.cantidadDeIpsEnMemoria()).toBe(1);
  });
});

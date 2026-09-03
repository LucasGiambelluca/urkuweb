import { describe, expect, it } from 'vitest';
import { sinMas } from './tipos';

describe('sinMas', () => {
  it('quita el signo mas del final', () => {
    expect(sinMas('2.200+')).toBe('2.200');
  });

  it('deja intacto un valor sin signo', () => {
    expect(sinMas('365')).toBe('365');
  });
});

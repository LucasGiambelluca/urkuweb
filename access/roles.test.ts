import { describe, expect, it } from 'vitest';
import {
  adminOSiMismo,
  campoSoloAdmin,
  soloAdmin,
  soloAdminSalvoSiMismo,
  soloAutenticado,
} from './roles';

const admin = { id: 1, rol: 'admin' as const };
const editor = { id: 2, rol: 'editor' as const };

// Payload pasa un objeto con req adentro. Se arma lo minimo que las reglas leen.
const contexto = (user: unknown, id?: unknown) => ({ req: { user }, id }) as never;

describe('soloAdmin', () => {
  it('deja pasar al admin', () => {
    expect(soloAdmin(contexto(admin))).toBe(true);
  });

  it('rechaza al editor', () => {
    expect(soloAdmin(contexto(editor))).toBe(false);
  });

  it('rechaza al anonimo', () => {
    expect(soloAdmin(contexto(null))).toBe(false);
  });
});

describe('adminOSiMismo', () => {
  it('el admin accede a todo', () => {
    expect(adminOSiMismo(contexto(admin))).toBe(true);
  });

  it('el editor queda limitado a su propio registro', () => {
    expect(adminOSiMismo(contexto(editor))).toEqual({ id: { equals: 2 } });
  });

  it('rechaza al anonimo', () => {
    expect(adminOSiMismo(contexto(null))).toBe(false);
  });
});

describe('soloAdminSalvoSiMismo', () => {
  it('el admin puede borrar a otro', () => {
    expect(soloAdminSalvoSiMismo(contexto(admin, 2))).toBe(true);
  });

  it('el admin no puede borrarse a si mismo', () => {
    expect(soloAdminSalvoSiMismo(contexto(admin, 1))).toBe(false);
  });

  it('compara ids aunque vengan como texto', () => {
    expect(soloAdminSalvoSiMismo(contexto(admin, '1'))).toBe(false);
  });

  it('rechaza al editor', () => {
    expect(soloAdminSalvoSiMismo(contexto(editor, 3))).toBe(false);
  });
});

describe('campoSoloAdmin', () => {
  it('deja al admin editar el campo', () => {
    expect(campoSoloAdmin(contexto(admin))).toBe(true);
  });

  it('impide que un editor se ascienda', () => {
    expect(campoSoloAdmin(contexto(editor))).toBe(false);
  });
});

describe('soloAutenticado', () => {
  it('deja pasar a cualquiera con sesion', () => {
    expect(soloAutenticado(contexto(editor))).toBe(true);
  });

  it('deja pasar al admin', () => {
    expect(soloAutenticado(contexto(admin))).toBe(true);
  });

  it('rechaza al anonimo', () => {
    expect(soloAutenticado(contexto(null))).toBe(false);
  });
});

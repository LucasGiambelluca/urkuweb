import type { Access, FieldAccess } from 'payload';

export type Rol = 'admin' | 'editor';

type UsuarioConRol = {
  id: number | string;
  rol?: Rol;
};

const comoUsuario = (user: unknown): UsuarioConRol | null =>
  user ? (user as UsuarioConRol) : null;

const esAdmin = (user: unknown): boolean => comoUsuario(user)?.rol === 'admin';

/** Cualquiera con sesion iniciada, sin importar el rol. */
export const soloAutenticado: Access = ({ req: { user } }) => Boolean(user);

/** Solo administradores. */
export const soloAdmin: Access = ({ req: { user } }) => esAdmin(user);

/**
 * El admin ve y edita todo. El editor queda restringido a su propio registro,
 * devolviendo una condicion de consulta en vez de un booleano: asi Payload
 * filtra tambien los listados, no solo el acceso directo.
 */
export const adminOSiMismo: Access = ({ req: { user } }) => {
  const actual = comoUsuario(user);
  if (!actual) return false;
  if (esAdmin(actual)) return true;
  return { id: { equals: actual.id } };
};

/**
 * Borrar usuarios es solo de admin, y ademas nadie puede borrarse a si mismo:
 * es la forma mas facil de quedarse sin ningun administrador.
 */
export const soloAdminSalvoSiMismo: Access = ({ req: { user }, id }) => {
  const actual = comoUsuario(user);
  if (!actual || !esAdmin(actual)) return false;
  if (id === undefined || id === null) return true;
  return String(actual.id) !== String(id);
};

/**
 * Acceso a nivel de campo para `rol`. Tiene que ser de campo y no de pantalla:
 * ocultarlo en el admin no impide mandarlo por la API.
 */
export const campoSoloAdmin: FieldAccess = ({ req: { user } }) => esAdmin(user);

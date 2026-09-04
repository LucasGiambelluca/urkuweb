/** Lo unico que hace falta mirar de una nota para decidir su fecha. */
type DatosDePublicacion = {
  status?: string | null;
  publishedAt?: string | null;
};

/**
 * Completa la fecha de publicacion de una nota que sale publicada sin fecha.
 *
 * Sin esto, una nota publicada con la fecha vacia queda con `publishedAt` en
 * null, y Postgres ordena los nulos primero cuando se pide fecha descendente:
 * las notas sin fecha se ponian adelante de todas las demas y, con el limite
 * de la home, dejaban afuera a las que si tenian fecha.
 *
 * `anterior` es el documento tal como estaba guardado: en una edicion parcial
 * el estado y la fecha pueden no venir en los datos nuevos.
 *
 * `ahora` se pasa por parametro para poder probarlo sin depender del reloj.
 */
export const completarFechaDePublicacion = <T extends DatosDePublicacion>(
  datos: T,
  anterior: DatosDePublicacion | undefined,
  ahora: Date = new Date(),
): T & DatosDePublicacion => {
  const estado = datos.status ?? anterior?.status;
  if (estado !== 'published') return datos;

  // La cadena vacia llega desde el panel cuando se borra el campo.
  const fecha = datos.publishedAt || anterior?.publishedAt;
  if (fecha) return datos;

  return { ...datos, publishedAt: ahora.toISOString() };
};

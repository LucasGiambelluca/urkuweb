export type TipoConsulta = 'contacto' | 'publicidad';

export type DatosConsulta = {
  tipo: TipoConsulta;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  asunto: string;
  formato: string;
  mensaje: string;
};

export type EntradaConsulta = Partial<Record<keyof DatosConsulta | 'trampa', string>>;

export type ResultadoValidacion =
  | { ok: true; datos: DatosConsulta }
  | { ok: false; errores: Record<string, string>; esSpam: boolean };

const TIPOS: TipoConsulta[] = ['contacto', 'publicidad'];
const LARGO_MINIMO_MENSAJE = 10;
const LARGO_MAXIMO_MENSAJE = 5000;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const limpiar = (valor: string | undefined): string => (valor ?? '').trim();

export function validarConsulta(entrada: EntradaConsulta): ResultadoValidacion {
  // Campo trampa: es invisible para las personas, asi que si viene con algo
  // lo cargo un bot. Se descarta sin explicar por que.
  if (limpiar(entrada.trampa) !== '') {
    return { ok: false, errores: {}, esSpam: true };
  }

  const errores: Record<string, string> = {};

  const tipo = limpiar(entrada.tipo);
  if (!TIPOS.includes(tipo as TipoConsulta)) {
    errores.tipo = 'Tipo de consulta invalido.';
  }

  const nombre = limpiar(entrada.nombre);
  if (nombre === '') {
    errores.nombre = 'El nombre y apellido son obligatorios.';
  }

  const email = limpiar(entrada.email).toLowerCase();
  if (email === '') {
    errores.email = 'El correo electronico es obligatorio.';
  } else if (!FORMATO_EMAIL.test(email)) {
    errores.email = 'Ingresa un correo electronico valido.';
  }

  // El mensaje es obligatorio en el formulario de contacto, donde es todo el
  // contenido de la consulta. En el de publicidad la pantalla lo marca como
  // opcional —lo que importa ahi es la empresa, el contacto y el formato—, y
  // el servidor tiene que respetar lo que la pantalla promete.
  const mensaje = limpiar(entrada.mensaje);
  const mensajeEsObligatorio = tipo === 'contacto';

  if (mensaje === '') {
    if (mensajeEsObligatorio) {
      errores.mensaje = 'El mensaje no puede estar vacio.';
    }
  } else if (mensajeEsObligatorio && mensaje.length < LARGO_MINIMO_MENSAJE) {
    errores.mensaje = `El mensaje debe contener al menos ${LARGO_MINIMO_MENSAJE} caracteres.`;
  } else if (mensaje.length > LARGO_MAXIMO_MENSAJE) {
    errores.mensaje = 'El mensaje es demasiado largo.';
  }

  if (Object.keys(errores).length > 0) {
    return { ok: false, errores, esSpam: false };
  }

  return {
    ok: true,
    datos: {
      tipo: tipo as TipoConsulta,
      nombre,
      email,
      telefono: limpiar(entrada.telefono),
      empresa: limpiar(entrada.empresa),
      asunto: limpiar(entrada.asunto),
      formato: limpiar(entrada.formato),
      mensaje,
    },
  };
}

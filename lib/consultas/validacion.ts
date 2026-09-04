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
const LARGO_MAXIMO_NOMBRE = 120;
const LARGO_MAXIMO_TELEFONO = 40;
const LARGO_MAXIMO_EMPRESA = 160;
const LARGO_MAXIMO_ASUNTO = 160;
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
  } else if (nombre.length > LARGO_MAXIMO_NOMBRE) {
    errores.nombre = 'El nombre es demasiado largo.';
  }

  const email = limpiar(entrada.email).toLowerCase();
  if (email === '') {
    errores.email = 'El correo electronico es obligatorio.';
  } else if (!FORMATO_EMAIL.test(email)) {
    errores.email = 'Ingresa un correo electronico valido.';
  }

  // Telefono, empresa y asunto son opcionales: si vienen vacios no es un
  // error, solo se valida el largo cuando traen algo.
  const telefono = limpiar(entrada.telefono);
  if (telefono !== '' && telefono.length > LARGO_MAXIMO_TELEFONO) {
    errores.telefono = 'El telefono es demasiado largo.';
  }

  const empresa = limpiar(entrada.empresa);
  if (empresa !== '' && empresa.length > LARGO_MAXIMO_EMPRESA) {
    errores.empresa = 'El nombre de la empresa es demasiado largo.';
  }

  const asunto = limpiar(entrada.asunto);
  if (asunto !== '' && asunto.length > LARGO_MAXIMO_ASUNTO) {
    errores.asunto = 'El asunto es demasiado largo.';
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
      telefono,
      empresa,
      asunto,
      formato: limpiar(entrada.formato),
      mensaje,
    },
  };
}

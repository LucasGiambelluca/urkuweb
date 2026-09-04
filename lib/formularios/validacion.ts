/**
 * Un campo tal como lo define el constructor de formularios del panel.
 *
 * Se declara aca en vez de importar el tipo generado por Payload para que
 * esta pieza se pueda probar sin levantar el CMS. Solo se declara lo que la
 * validacion mira.
 */
export type CampoDeFormulario = {
  blockType: string;
  name: string;
  label?: string;
  required?: boolean | null;
  options?: { label: string; value: string }[] | null;
};

export type ResultadoDeValidacion =
  | { ok: true; valores: Record<string, string> }
  | { ok: false; errores: Record<string, string> };

const LARGO_MAXIMO_TEXTO = 200;
const LARGO_MAXIMO_AREA = 2000;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida lo que cargo el visitante contra la definicion del formulario.
 *
 * La definicion la arma el cliente en el panel, asi que la validacion no puede
 * estar escrita a mano para un formulario concreto: se deduce del tipo de cada
 * campo. El tope de largo es lo que evita que un envio enorme llegue hasta
 * Payload y vuelva como un error generico que al visitante no le dice nada.
 */
export const validarRespuesta = (
  campos: CampoDeFormulario[],
  entrada: Record<string, string | undefined>,
): ResultadoDeValidacion => {
  const errores: Record<string, string> = {};
  const valores: Record<string, string> = {};

  for (const campo of campos) {
    const valor = (entrada[campo.name] ?? '').trim();

    if (valor === '') {
      if (campo.required) errores[campo.name] = 'Este campo es obligatorio.';
      else valores[campo.name] = '';
      continue;
    }

    const tope = campo.blockType === 'textarea' ? LARGO_MAXIMO_AREA : LARGO_MAXIMO_TEXTO;
    if (valor.length > tope) {
      errores[campo.name] = 'Este texto es demasiado largo.';
      continue;
    }

    if (campo.blockType === 'email' && !FORMATO_EMAIL.test(valor)) {
      errores[campo.name] = 'Ingresá un correo electrónico válido.';
      continue;
    }

    if (campo.blockType === 'number' && Number.isNaN(Number(valor))) {
      errores[campo.name] = 'Ingresá un número.';
      continue;
    }

    if (campo.blockType === 'select') {
      const permitidas = (campo.options ?? []).map((o) => o.value);
      if (!permitidas.includes(valor)) {
        errores[campo.name] = 'Elegí una de las opciones.';
        continue;
      }
    }

    valores[campo.name] = valor;
  }

  if (Object.keys(errores).length > 0) return { ok: false, errores };
  return { ok: true, valores };
};

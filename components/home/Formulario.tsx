'use client';

import { useActionState } from 'react';
import { enviarFormulario } from '@/app/actions/formularios';
import { estadoInicial } from '@/lib/formularios/estado';
import type { CampoDeFormulario } from '@/lib/formularios/validacion';

type PropsDeFormulario = {
  id: string | number;
  campos: CampoDeFormulario[];
  /** Ancho de cada campo en porcentaje, tal como lo dejo el panel. */
  anchos: Record<string, number>;
  textoDelBoton: string;
  mensajeDeGracias: string;
};

const CLASE_CAMPO =
  'w-full rounded-2xl border border-border-subtle bg-white dark:bg-[#0E1626] px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#EB2347]';

/**
 * Dibuja un formulario armado desde el panel.
 *
 * No sabe nada del formulario concreto: recorre la definicion y arma el campo
 * que corresponda a cada tipo. Por eso cambiar una etiqueta no toca codigo.
 */
export default function Formulario({
  id,
  campos,
  anchos,
  textoDelBoton,
  mensajeDeGracias,
}: PropsDeFormulario) {
  const [resultado, accionEnviar, enviando] = useActionState(enviarFormulario, estadoInicial);

  if (resultado.estado === 'ok') {
    return (
      <p
        role="status"
        className="rounded-2xl border border-emerald-600/30 bg-emerald-500/10 px-6 py-5 text-base text-foreground"
      >
        {mensajeDeGracias}
      </p>
    );
  }

  return (
    <form action={accionEnviar} noValidate className="flex flex-wrap gap-4">
      <input type="hidden" name="formulario" value={String(id)} />

      {/* Campo trampa: invisible para las personas, tentador para un bot. */}
      <input
        type="text"
        name="sitioWeb"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {campos.map((campo) => {
        const error = resultado.errores[campo.name];
        const idError = `${campo.name}-error`;
        // El ancho lo elige el cliente en el panel. La mitad es el unico corte
        // que hace falta: mas granularidad no le sirve a nadie.
        const mitad = (anchos[campo.name] ?? 100) <= 50;

        return (
          <div key={campo.name} className={mitad ? 'w-full sm:w-[calc(50%-0.5rem)]' : 'w-full'}>
            <label
              htmlFor={campo.name}
              className="mb-2 block text-xs font-semibold uppercase tracking-[.15em] text-muted"
            >
              {campo.label}
              {campo.required ? <span className="text-[#EB2347]"> *</span> : null}
            </label>

            {campo.blockType === 'textarea' ? (
              <textarea
                id={campo.name}
                name={campo.name}
                rows={4}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? idError : undefined}
                className={CLASE_CAMPO}
              />
            ) : campo.blockType === 'select' ? (
              <select
                id={campo.name}
                name={campo.name}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? idError : undefined}
                className={CLASE_CAMPO}
                defaultValue=""
              >
                <option value="">Elegí una opción</option>
                {(campo.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : campo.blockType === 'checkbox' ? (
              <input
                id={campo.name}
                name={campo.name}
                type="checkbox"
                value="si"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? idError : undefined}
                className="h-5 w-5 rounded border-border-subtle"
              />
            ) : (
              <input
                id={campo.name}
                name={campo.name}
                type={campo.blockType === 'email' ? 'email' : campo.blockType === 'number' ? 'number' : 'text'}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? idError : undefined}
                className={CLASE_CAMPO}
              />
            )}

            {error ? (
              <p id={idError} className="mt-2 text-sm text-[#EB2347]">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={enviando}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-[#EB2347] px-9 py-4 text-base font-semibold text-white shadow-xl shadow-[#EB2347]/25 transition-all hover:scale-105 hover:bg-[#C41A3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {enviando ? 'Enviando...' : textoDelBoton}
      </button>

      <p aria-live="polite" className="w-full text-sm text-[#EB2347]">
        {resultado.mensajeGeneral ?? ''}
      </p>
    </form>
  );
}

# Formularios configurables — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el cliente arme formularios desde el panel y los muestre en la home con una imagen al lado, sin pedir código para cambiar una etiqueta.

**Architecture:** `@payloadcms/plugin-form-builder` aporta las colecciones `forms` y `form-submissions`. Un bloque nuevo del armador elige qué formulario mostrar, con qué imagen y de qué lado. Una Server Action valida contra la definición del formulario y guarda con la API local, igual que hace hoy el formulario de contacto.

**Tech Stack:** Payload 3.88, `@payloadcms/plugin-form-builder` 3.88.0, Next 16, Tailwind v4.

**Referencia:** `docs/superpowers/specs/2026-09-04-formularios-configurables-design.md`

---

## Convenciones

- **[LOCAL]** en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`, con el túnel SSH abierto (`ssh -N -L 5433:127.0.0.1:5432 root@2.25.115.107`) y `npm run dev` en `http://localhost:3000`.
- **[VPS]** por SSH contra `root@2.25.115.107`.
- Código y comentarios en español, **sin tildes dentro del código**. Los textos que ve el visitante **sí llevan tildes**.
- Ningún paso avanza si la verificación no da lo esperado.
- Punto de partida: **103 pruebas pasando**.

## Estado de partida verificado

Todo esto se comprobó leyendo el paquete y el código, no de memoria:

- El plugin expone `formBuilderPlugin(config)`. **Fusiona sus traducciones solo**, aplanando el envoltorio: no hay que pasarle nada a `i18n.translations`.
- `FormBuilderPluginConfig` acepta `fields`, `formOverrides`, `formSubmissionOverrides`, `defaultToEmail`, `beforeEmail`, `handlePayment`, `redirectRelationships`, `uploadCollections`.
- `formOverrides` y `formSubmissionOverrides` son `{ fields?: FieldsOverride } & Partial<Omit<CollectionConfig, 'fields'>>`, así que aceptan `slug`, `labels`, `admin` y `access`.
- Los slugs por defecto son **`forms`** y **`form-submissions`**.
- `form-submissions` guarda `form` (relación) y `submissionData`, un arreglo de `{ field: text, value: textarea }`.
- `forms` guarda `title`, `fields`, `submitButtonLabel`, `confirmationType`, `confirmationMessage`, `redirect` y `emails`.
- Cada campo del formulario tiene `blockType`, `name`, `label`, `required` y **`width`** (porcentaje). El `width` es lo que permite las dos columnas sin clavarlo en el código.
- El paquete ya quedó instalado al inspeccionarlo; la Task 1 confirma la versión y commitea el lockfile.

---

## Task 1: Registrar el plugin

**Files:**
- Modify: `payload.config.ts`
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Confirmar la instalación**

**[LOCAL]**
```bash
npm install @payloadcms/plugin-form-builder@3.88.0
node -e "console.log(require('./node_modules/@payloadcms/plugin-form-builder/package.json').version)"
```

Esperado: `3.88.0`.

- [ ] **Step 2: Registrar el plugin**

En `payload.config.ts`, agregar los imports junto a los que ya están:

```ts
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { soloAdmin, soloAutenticado } from './access/roles';
```

Agregar la clave `plugins` al objeto que recibe `buildConfig`, después de `globals`:

```ts
  plugins: [
    formBuilderPlugin({
      // Solo los tipos que el cliente va a usar. Los de pago, pais, provincia,
      // fecha y archivo se apagan: el plugin los trae y en este sitio no hacen
      // mas que ensuciar el selector de campos.
      // El tipo "mensaje" queda apagado: guarda su texto en un campo
      // richText y habria que aplanarlo para dibujarlo. Nadie lo pidio.
      fields: {
        checkbox: true,
        country: false,
        date: false,
        email: true,
        message: false,
        number: true,
        payment: false,
        select: true,
        state: false,
        text: true,
        textarea: true,
        upload: false,
      },
      formOverrides: {
        labels: { singular: 'Formulario', plural: 'Formularios' },
        admin: {
          group: 'Contenido del sitio',
          description:
            'Los formularios que se pueden mostrar en la portada. Cada campo lleva su etiqueta y su ancho.',
        },
        access: {
          // La home se dibuja del lado del servidor con la API local, que no
          // pasa por estas reglas, asi que no hace falta exponer las
          // definiciones por la API REST.
          read: soloAutenticado,
          create: soloAutenticado,
          update: soloAutenticado,
          delete: soloAdmin,
        },
      },
      formSubmissionOverrides: {
        labels: { singular: 'Inscripción', plural: 'Inscripciones' },
        admin: {
          group: 'Consultas',
          description: 'Lo que carga la gente en los formularios del sitio.',
        },
        access: {
          // Cerrado por la API REST. El alta la hace la Server Action con la
          // API local, igual que las consultas.
          create: () => false,
          read: soloAutenticado,
          update: soloAutenticado,
          delete: soloAdmin,
        },
      },
    }),
  ],
```

**No hay que tocar `i18n`.** El plugin fusiona sus propias traducciones dentro de `config.i18n.translations` segun los idiomas soportados, y aplana el envoltorio antes de hacerlo (`dist/index.js`, lineas 44-45: `flattenedTranslations[lang] = entry.translations`). Pasarle `formBuilderTranslations` a mano guarda datos mal formados en la configuracion.

Agregar este comentario arriba de `plugins`, para que nadie lo reintroduzca:

```ts
  // El plugin de formularios fusiona sus propias traducciones dentro de
  // i18n.translations segun los idiomas soportados, asi que no hay que
  // pasarselas a mano.
```

- [ ] **Step 3: Generar tipos y migración**

**[LOCAL]**
```bash
npx payload generate:types
npx payload migrate:create formularios
```

- [ ] **Step 4: Validar la migración sobre base limpia**

La base de desarrollo aplica el esquema por empuje automático, así que si no se valida aparte, producción sería el primer lugar donde la migración corre de verdad.

**[LOCAL]**
```bash
PASS=$(ssh -o BatchMode=yes root@2.25.115.107 'source /root/.urkupina-db-credentials; echo "$urkupina_db_password"')
ssh -o BatchMode=yes root@2.25.115.107 'sudo -u postgres psql -q -c "DROP DATABASE IF EXISTS urkupina_migtest;" -c "CREATE DATABASE urkupina_migtest OWNER urkupina;"'
DATABASE_URL="postgresql://urkupina:${PASS}@127.0.0.1:5433/urkupina_migtest" npx payload migrate
ssh -o BatchMode=yes root@2.25.115.107 'sudo -u postgres psql -q -c "DROP DATABASE urkupina_migtest;"'
```

Esperado: todas las migraciones aplican sin errores. `urkupina_migtest` es descartable y se borra al final; **no tocar `urkupina_dev` ni `urkupina_prod`**.

- [ ] **Step 5: Verificar en el panel**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit
```

Esperado: **103 pruebas**, tsc limpio.

Abrir `http://localhost:3000/admin`. En la barra tiene que aparecer **Formularios** bajo "Contenido del sitio" e **Inscripciones** bajo "Consultas". Al crear un formulario, el selector de campos debe ofrecer solo texto, área de texto, correo, número, desplegable y casilla.

- [ ] **Step 6: Commit**

```bash
git add payload.config.ts package.json package-lock.json payload-types.ts migrations/
git commit -m "feat: constructor de formularios en el panel

Registra el plugin oficial con los tipos de campo que se usan, las etiquetas
en espanol y los permisos del proyecto: las inscripciones no se pueden dar de
alta por la API REST, igual que las consultas."
```

---

## Task 2: La validación

Una función pura valida lo que carga el visitante contra la definición del formulario. Va antes que todo lo demás porque no depende de Payload ni del navegador.

**Files:**
- Create: `lib/formularios/validacion.ts`
- Test: `lib/formularios/validacion.test.ts`

- [ ] **Step 1: Escribir las pruebas**

Crear `lib/formularios/validacion.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { validarRespuesta, type CampoDeFormulario } from './validacion';

const texto = (extra: Partial<CampoDeFormulario> = {}): CampoDeFormulario => ({
  blockType: 'text',
  name: 'razonSocial',
  label: 'Razón social',
  required: true,
  ...extra,
});

describe('validarRespuesta', () => {
  it('acepta una respuesta completa', () => {
    const r = validarRespuesta([texto()], { razonSocial: 'Textiles del Sur' });
    expect(r.ok).toBe(true);
  });

  it('marca el campo obligatorio vacio', () => {
    const r = validarRespuesta([texto()], { razonSocial: '   ' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.razonSocial).toBe('Este campo es obligatorio.');
  });

  it('deja pasar un campo opcional vacio', () => {
    const r = validarRespuesta([texto({ name: 'cargo', required: false })], { cargo: '' });
    expect(r.ok).toBe(true);
  });

  it('rechaza un correo mal escrito', () => {
    const campo = texto({ blockType: 'email', name: 'email', label: 'Correo' });
    const r = validarRespuesta([campo], { email: 'sin-arroba' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.email).toBe('Ingresá un correo electrónico válido.');
  });

  it('acepta un correo bien escrito', () => {
    const campo = texto({ blockType: 'email', name: 'email', label: 'Correo' });
    expect(validarRespuesta([campo], { email: 'hola@ejemplo.com' }).ok).toBe(true);
  });

  it('rechaza un numero que no es numero', () => {
    const campo = texto({ blockType: 'number', name: 'cantidad', label: 'Cantidad' });
    const r = validarRespuesta([campo], { cantidad: 'diez' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.cantidad).toBe('Ingresá un número.');
  });

  it('rechaza una opcion que no esta en la lista', () => {
    const campo: CampoDeFormulario = {
      blockType: 'select',
      name: 'rubro',
      label: 'Rubro',
      required: true,
      options: [{ label: 'Textil', value: 'textil' }],
    };
    const r = validarRespuesta([campo], { rubro: 'mineria' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.rubro).toBe('Elegí una de las opciones.');
  });

  it('acepta el largo justo en el tope de un texto', () => {
    expect(validarRespuesta([texto()], { razonSocial: 'a'.repeat(200) }).ok).toBe(true);
  });

  it('rechaza un texto mas largo que el tope', () => {
    const r = validarRespuesta([texto()], { razonSocial: 'a'.repeat(201) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.razonSocial).toBe('Este texto es demasiado largo.');
  });

  it('el area de texto tolera mas largo que un texto', () => {
    const campo = texto({ blockType: 'textarea', name: 'mensaje', label: 'Mensaje' });
    expect(validarRespuesta([campo], { mensaje: 'a'.repeat(2000) }).ok).toBe(true);
    expect(validarRespuesta([campo], { mensaje: 'a'.repeat(2001) }).ok).toBe(false);
  });

  it('devuelve los valores limpios cuando esta todo bien', () => {
    const r = validarRespuesta([texto()], { razonSocial: '  Textiles del Sur  ' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.valores).toEqual({ razonSocial: 'Textiles del Sur' });
  });

  it('una definicion sin campos no rompe', () => {
    expect(validarRespuesta([], {}).ok).toBe(true);
  });
});
```

- [ ] **Step 2: Verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: falla con `Cannot find module './validacion'`.

- [ ] **Step 3: Escribir el modulo**

Crear `lib/formularios/validacion.ts`:

```ts
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
```

- [ ] **Step 4: Verificar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit && npx eslint lib/formularios/
```

Esperado: **115 pruebas pasando** (103 + 12), tsc y eslint limpios.

- [ ] **Step 5: Commit**

```bash
git add lib/formularios/validacion.ts lib/formularios/validacion.test.ts
git commit -m "feat: validar una respuesta contra la definicion del formulario

La definicion la arma el cliente en el panel, asi que la validacion se deduce
del tipo de cada campo en vez de estar escrita para un formulario concreto."
```

---

## Task 3: La Server Action

**Files:**
- Create: `lib/formularios/estado.ts`
- Create: `app/actions/formularios.ts`

- [ ] **Step 1: El estado compartido**

Crear `lib/formularios/estado.ts`:

```ts
/**
 * Estado del envio de un formulario, compartido entre la Server Action y el
 * componente de cliente.
 *
 * Vive aca y no en app/actions/formularios.ts a proposito: un archivo con
 * 'use server' convierte TODOS sus exports en referencias remotas, no solo las
 * funciones async. Es el mismo motivo por el que existe lib/consultas/estado.ts.
 */
export type EstadoDeEnvio = {
  estado: 'inicial' | 'ok' | 'error';
  errores: Record<string, string>;
  mensajeGeneral?: string;
};

export const estadoInicial: EstadoDeEnvio = { estado: 'inicial', errores: {} };
```

- [ ] **Step 2: La accion**

Crear `app/actions/formularios.ts`:

```ts
'use server';

import { getPayload } from 'payload';
import { headers } from 'next/headers';
import config from '@payload-config';
import { validarRespuesta, type CampoDeFormulario } from '@/lib/formularios/validacion';
import { LimitadorEnvios } from '@/lib/consultas/limite';
import type { EstadoDeEnvio } from '@/lib/formularios/estado';

/**
 * Cinco envios por hora y por IP, en una instancia propia.
 *
 * Separada de la del formulario de contacto a proposito: si comparten el
 * contador, alguien que mando cinco consultas se queda sin poder inscribirse.
 */
const limitador = new LimitadorEnvios({ maximo: 5, ventanaMs: 60 * 60 * 1000 });

const ipDelVisitante = async (): Promise<string> => {
  const cabeceras = await headers();
  const reenviada = cabeceras.get('x-forwarded-for');
  if (reenviada) return reenviada.split(',')[0].trim();
  return cabeceras.get('x-real-ip') ?? 'desconocida';
};

export async function enviarFormulario(
  _estadoPrevio: EstadoDeEnvio,
  formData: FormData,
): Promise<EstadoDeEnvio> {
  const idDelFormulario = String(formData.get('formulario') ?? '');

  // Campo trampa: es invisible para las personas, asi que si viene con algo lo
  // cargo un bot. Se le contesta lo mismo que a un envio bueno: si se le avisa
  // que fue detectado, el bot ajusta y vuelve.
  if (String(formData.get('sitioWeb') ?? '').trim() !== '') {
    return { estado: 'ok', errores: {} };
  }

  try {
    const payload = await getPayload({ config });
    const definicion = await payload.findByID({
      collection: 'forms',
      id: idDelFormulario,
      depth: 0,
      overrideAccess: true,
    });

    const campos = (definicion.fields ?? []) as unknown as CampoDeFormulario[];

    const entrada: Record<string, string> = {};
    for (const campo of campos) {
      entrada[campo.name] = String(formData.get(campo.name) ?? '');
    }

    const resultado = validarRespuesta(campos, entrada);
    if (!resultado.ok) {
      return {
        estado: 'error',
        errores: resultado.errores,
        mensajeGeneral: 'Revisá los campos marcados.',
      };
    }

    if (!limitador.permitir(await ipDelVisitante())) {
      return {
        estado: 'error',
        errores: {},
        mensajeGeneral:
          'Recibimos varios envíos desde esta conexión. Esperá un rato antes de mandar otro.',
      };
    }

    await payload.create({
      collection: 'form-submissions',
      data: {
        form: definicion.id,
        submissionData: Object.entries(resultado.valores).map(([field, value]) => ({
          field,
          value,
        })),
      },
      // La coleccion tiene create cerrado para la API REST. Aca corremos del
      // lado del servidor, que es el unico camino habilitado para dar de alta.
      overrideAccess: true,
    });
  } catch (error) {
    console.error('[formularios] no se pudo guardar la respuesta:', error);
    return {
      estado: 'error',
      errores: {},
      mensajeGeneral:
        'No pudimos registrar tus datos. Volvé a intentar en unos minutos o escribinos por WhatsApp.',
    };
  }

  return { estado: 'ok', errores: {} };
}
```

- [ ] **Step 3: Verificar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit && npx eslint app/actions/ lib/formularios/
```

Esperado: 115 pruebas, tsc y eslint limpios.

- [ ] **Step 4: Commit**

```bash
git add app/actions/formularios.ts lib/formularios/estado.ts
git commit -m "feat: recibir y guardar las respuestas de los formularios

Mismo camino que las consultas: campo trampa, validacion, limite por IP y
alta con la API local, que es el unico camino habilitado."
```

---

## Task 4: El formulario en pantalla

**Files:**
- Create: `components/home/Formulario.tsx`

- [ ] **Step 1: Escribir el componente**

Crear `components/home/Formulario.tsx`:

```tsx
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
```

- [ ] **Step 2: Verificar**

**[LOCAL]**
```bash
npx tsc --noEmit && npx eslint components/home/Formulario.tsx
```

Esperado: los dos limpios.

- [ ] **Step 3: Commit**

```bash
git add components/home/Formulario.tsx
git commit -m "feat: dibujar un formulario armado desde el panel

Recorre la definicion y arma el campo que corresponde a cada tipo, asi que
cambiar una etiqueta no toca codigo. El ancho de cada campo sale del panel."
```

---

## Task 5: El bloque del armador

**Files:**
- Modify: `blocks/secciones.ts`
- Modify: `blocks/secciones.test.ts`
- Create: `components/home/BloqueFormulario.tsx`
- Modify: `components/home/Secciones.tsx`
- Modify: `app/(frontend)/page.tsx`

- [ ] **Step 1: Actualizar la prueba de los bloques**

`blocks/secciones.test.ts` hoy afirma que hay **diez** bloques. Con el nuevo son once. Cambiar las dos afirmaciones:

```ts
  it('define los once bloques', () => {
    expect(BLOQUES_DE_SECCION).toHaveLength(11);
  });
```

y

```ts
  it('expone los slugs como lista', () => {
    expect(SLUGS_DE_BLOQUE).toContain('sponsors');
    expect(SLUGS_DE_BLOQUE).toContain('novedades');
    expect(SLUGS_DE_BLOQUE).toContain('formulario');
    expect(SLUGS_DE_BLOQUE).toHaveLength(11);
  });
```

- [ ] **Step 2: Verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: fallan las dos pruebas de `blocks/secciones.test.ts`, porque todavía hay diez bloques.

- [ ] **Step 3: Agregar el bloque**

En `blocks/secciones.ts`, agregar al final del arreglo `BLOQUES_DE_SECCION`, después del bloque de novedades:

```ts
  {
    slug: 'formulario',
    labels: { singular: 'Formulario', plural: 'Formularios' },
    admin: { group: 'Secciones' },
    fields: [
      {
        name: 'formulario',
        type: 'relationship',
        relationTo: 'forms',
        required: true,
        label: 'Que formulario mostrar',
      },
      {
        name: 'imagen',
        type: 'upload',
        relationTo: 'media',
        label: 'Imagen que va al lado',
        admin: {
          description: 'Opcional. Sin imagen, el formulario ocupa todo el ancho.',
        },
      },
      {
        name: 'lado',
        type: 'select',
        defaultValue: 'izquierda',
        label: 'De que lado va la imagen',
        options: [
          { label: 'Izquierda', value: 'izquierda' },
          { label: 'Derecha', value: 'derecha' },
        ],
      },
      {
        name: 'ancla',
        type: 'text',
        label: 'Nombre para enlazar desde afuera',
        admin: {
          description:
            'Opcional. Si escribis "inscripcion", el popup y los enlaces pueden apuntar a #inscripcion.',
        },
      },
    ],
  },
```

- [ ] **Step 4: El componente de la seccion**

Crear `components/home/BloqueFormulario.tsx`:

```tsx
import Image from 'next/image';
import Formulario from '@/components/home/Formulario';
import type { CampoDeFormulario } from '@/lib/formularios/validacion';

export type FormularioVisible = {
  id: string | number;
  titulo: string;
  campos: CampoDeFormulario[];
  anchos: Record<string, number>;
  textoDelBoton: string;
  mensajeDeGracias: string;
  imagen?: { url: string; alt: string; ancho: number; alto: number };
  lado: 'izquierda' | 'derecha';
  ancla?: string;
};

/**
 * La seccion que muestra un formulario con una imagen al lado.
 *
 * Componente de servidor: la pagina ya consulto la definicion, aca solo se
 * arma el JSX. El formulario en si es de cliente porque maneja el envio.
 */
export default function BloqueFormulario({ formulario }: { formulario: FormularioVisible }) {
  const { imagen } = formulario;

  return (
    <section
      id={formulario.ancla || undefined}
      className="relative section-lg scroll-mt-20"
      aria-label={formulario.titulo}
    >
      <div className="mx-auto max-w-7xl content-pad">
        <h2 className="mb-12 font-display text-[clamp(36px,5vw,72px)] uppercase leading-[.9] tracking-[-.05em] text-foreground">
          {formulario.titulo}
        </h2>

        <div
          className={`flex flex-col gap-12 lg:flex-row lg:items-start ${
            formulario.lado === 'derecha' ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {imagen ? (
            <div className="w-full lg:w-1/2">
              <Image
                src={imagen.url}
                alt={imagen.alt}
                width={imagen.ancho}
                height={imagen.alto}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full rounded-[30px]"
              />
            </div>
          ) : null}

          <div className={imagen ? 'w-full lg:w-1/2' : 'w-full'}>
            <Formulario
              id={formulario.id}
              campos={formulario.campos}
              anchos={formulario.anchos}
              textoDelBoton={formulario.textoDelBoton}
              mensajeDeGracias={formulario.mensajeDeGracias}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Enganchar el bloque**

En `components/home/Secciones.tsx`:

Agregar el import:

```tsx
import BloqueFormulario, { type FormularioVisible } from "@/components/home/BloqueFormulario";
```

Ampliar el tipo `BloqueDeSeccion` con los campos del bloque nuevo:

```tsx
export type BloqueDeSeccion = {
  id?: string | null;
  blockType: string;
  cantidad?: number;
  ancla?: string | null;
  lado?: string | null;
  formulario?: unknown;
  imagen?: unknown;
};
```

Agregar `formularios` a `PropsDeSecciones`:

```tsx
  formularios: Record<string, FormularioVisible>;
```

y a la desestructuración del componente. Después, antes del `default` del `switch`:

```tsx
          case 'formulario': {
            // El bloque guarda a que formulario apunta; la pagina ya trajo su
            // definicion. Si el formulario se borro del panel, no se dibuja
            // nada en vez de romper la pagina.
            const visible = bloque.id ? formularios[bloque.id] : undefined;
            return visible ? <BloqueFormulario key={key} formulario={visible} /> : null;
          }
```

- [ ] **Step 6: La pagina trae las definiciones**

En `app/(frontend)/page.tsx`, agregar el import:

```tsx
import { type FormularioVisible } from "@/components/home/BloqueFormulario";
```

y la función, junto a las otras `obtener*`:

```tsx
/**
 * Trae la definicion de cada formulario que aparezca en los bloques.
 *
 * Se resuelve aca y no dentro del componente porque la home ya consulta todo
 * de una: asi el bloque recibe datos listos y sigue siendo de servidor puro.
 */
async function obtenerFormularios(
  bloques: BloqueDeSeccion[],
): Promise<Record<string, FormularioVisible>> {
  const deFormulario = bloques.filter((b) => b.blockType === 'formulario' && b.id);
  if (deFormulario.length === 0) return {};

  try {
    const payload = await getPayload({ config });
    const salida: Record<string, FormularioVisible> = {};

    for (const bloque of deFormulario) {
      const referencia = bloque.formulario;
      const idDelFormulario =
        typeof referencia === 'object' && referencia !== null
          ? (referencia as { id: string | number }).id
          : (referencia as string | number);
      if (idDelFormulario == null) continue;

      const definicion = await payload.findByID({
        collection: 'forms',
        id: idDelFormulario,
        depth: 0,
      });

      const campos = (definicion.fields ?? []) as unknown as (CampoDeFormulario & {
        width?: number | null;
      })[];

      const anchos: Record<string, number> = {};
      for (const campo of campos) anchos[campo.name] = campo.width ?? 100;

      const imagen = bloque.imagen;
      const imagenVisible =
        typeof imagen === 'object' && imagen !== null && 'url' in imagen
          ? {
              url: String((imagen as { url: string }).url),
              alt: String((imagen as { alt?: string }).alt ?? ''),
              ancho: Number((imagen as { width?: number }).width ?? 0),
              alto: Number((imagen as { height?: number }).height ?? 0),
            }
          : undefined;

      salida[String(bloque.id)] = {
        id: definicion.id,
        titulo: definicion.title,
        campos,
        anchos,
        textoDelBoton: definicion.submitButtonLabel || 'Enviar',
        mensajeDeGracias:
          textoPlano(definicion.confirmationMessage as never) ||
          '¡Gracias! Recibimos tus datos.',
        imagen: imagenVisible && imagenVisible.ancho > 0 ? imagenVisible : undefined,
        lado: bloque.lado === 'derecha' ? 'derecha' : 'izquierda',
        ancla: bloque.ancla ?? undefined,
      };
    }

    return salida;
  } catch (error) {
    console.error('[home] no se pudieron leer los formularios:', error);
    return {};
  }
}
```

Agregar el import del tipo de campo, junto a los otros de `lib`:

```tsx
import { type CampoDeFormulario } from "@/lib/formularios/validacion";
// textoPlano ya existe y aplana el richText de Lexical a texto corrido.
import { textoPlano } from "@/lib/contenido/novedades";
```

En el cuerpo de `Home`, después de calcular `bloques`, agregar:

```tsx
  const formularios = await obtenerFormularios(bloques);
```

Va después del `Promise.all` y no dentro, porque necesita saber qué bloques hay.

Y pasarlo al componente:

```tsx
          sponsors={sponsors}
          novedades={novedades}
          formularios={formularios}
```

- [ ] **Step 7: Verificar**

**[LOCAL]**
```bash
npx payload generate:types
npx payload migrate:create bloque-formulario
npm test && npx tsc --noEmit && npm run build
```

Esperado: **115 pruebas**, tsc limpio, build exitoso. El bloque agrega campos a la ficha `home`, así que genera una migración propia.

Validar esa migración contra base limpia con el mismo procedimiento del Task 1, Step 4.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: bloque de formulario en el armador de la home

Elige que formulario mostrar, con que imagen y de que lado. El ancla la
escribe el cliente: si el identificador estuviera fijo en el codigo, dos
bloques de formulario compartirian el mismo y los enlaces se romperian en
silencio."
```

---

## Task 6: Sembrar el formulario de EXPOURKU

**Files:**
- Create: `scripts/sembrar-formulario-expo.ts`
- Modify: `package.json`

- [ ] **Step 1: El script**

Antes de escribir, **leer `scripts/sembrar-popup.ts`**: es el molde de la idempotencia y del `await` de nivel superior.

Crear `scripts/sembrar-formulario-expo.ts`:

```ts
/**
 * Crea el formulario de inscripcion de expositores de EXPOURKU y lo deja
 * puesto en la home, con el ancla "inscripcion" para que el popup apunte ahi.
 *
 * Es una siembra, no codigo: despues se edita todo desde el panel.
 * Es idempotente: si el formulario ya existe, no lo duplica.
 *
 * Uso: npm run sembrar:formulario-expo
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const TITULO = 'Inscripción de expositores EXPOURKU';

/** Los once campos que paso el cliente. El ancho es el que ocupan en pantalla. */
const CAMPOS = [
  { name: 'razonSocial', label: 'Razón social', required: true, width: 50 },
  { name: 'nombreComercial', label: 'Nombre comercial / Marca', required: true, width: 50 },
  { name: 'cuit', label: 'CUIT', required: true, width: 50 },
  { name: 'rubro', label: 'Rubro / actividad', required: true, width: 50 },
  { name: 'responsable', label: 'Nombre y apellido del responsable', required: true, width: 50 },
  { name: 'cargo', label: 'Cargo', required: false, width: 50 },
  { name: 'telefono', label: 'Teléfono / WhatsApp', required: true, width: 50 },
  { name: 'instagram', label: 'Instagram', required: false, width: 50 },
  { name: 'paginaWeb', label: 'Página web', required: false, width: 50 },
  { name: 'localidad', label: 'Localidad / Provincia', required: false, width: 50 },
];

const sembrar = async () => {
  const payload = await getPayload({ config });

  const existentes = await payload.find({
    collection: 'forms',
    where: { title: { equals: TITULO } },
    limit: 1,
    overrideAccess: true,
  });

  if (existentes.totalDocs > 0) {
    console.log('- formulario de EXPOURKU: ya existe, se omite');
    return;
  }

  const formulario = await payload.create({
    collection: 'forms',
    data: {
      title: TITULO,
      submitButtonLabel: 'Quiero participar',
      confirmationType: 'message',
      // Obligatorio cuando el tipo de confirmacion es "message": la coleccion
      // del plugin lo declara required. Ademas es el texto que la home lee con
      // textoPlano para reemplazar al formulario despues de enviarlo.
      confirmationMessage: {
        root: {
          type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
          children: [{
            type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0,
            children: [{
              type: 'text', version: 1, format: 0, detail: 0, mode: 'normal', style: '',
              text: '¡Gracias! Recibimos tus datos y te vamos a contactar a la brevedad.',
            }],
          }],
        },
      },
      fields: [
        ...CAMPOS.map((c) => ({ blockType: 'text' as const, ...c })),
        // El correo va aparte porque su tipo valida el formato.
        {
          blockType: 'email' as const,
          name: 'email',
          label: 'Correo electrónico',
          required: true,
          width: 50,
        },
      ],
    } as never,
    overrideAccess: true,
  });

  const home = await payload.findGlobal({ slug: 'home', overrideAccess: true });
  const secciones = (home.secciones ?? []) as { blockType: string }[];

  await payload.updateGlobal({
    slug: 'home',
    data: {
      secciones: [
        ...secciones,
        {
          blockType: 'formulario',
          formulario: formulario.id,
          lado: 'izquierda',
          ancla: 'inscripcion',
        },
      ],
    } as never,
    overrideAccess: true,
  });

  console.log('+ formulario de EXPOURKU: creado y agregado a la home con el ancla "inscripcion"');
};

// Con await de nivel superior, no con sembrar().catch(). `payload run` termina
// el proceso apenas el modulo deja de evaluarse.
try {
  await sembrar();
} catch (error) {
  console.error('Fallo la siembra del formulario:', error);
  process.exit(1);
}

process.exit(0);
```

- [ ] **Step 2: El comando**

En `package.json`, dentro de `scripts`, después de `sembrar:popup`:

```json
    "sembrar:formulario-expo": "payload run scripts/sembrar-formulario-expo.ts",
```

- [ ] **Step 3: Sembrar y verificar la idempotencia**

**[LOCAL]**
```bash
npm run sembrar:formulario-expo
npm run sembrar:formulario-expo
```

Esperado: la primera imprime `+ formulario de EXPOURKU: creado...`; la segunda, `- formulario de EXPOURKU: ya existe, se omite`.

```bash
curl -s "http://localhost:3000/?qa=$RANDOM" | grep -c 'id="inscripcion"'
```

Esperado: **1**.

- [ ] **Step 4: Commit**

```bash
git add scripts/sembrar-formulario-expo.ts package.json
git commit -m "feat: sembrar el formulario de inscripcion de EXPOURKU

Los once campos que paso el cliente, con el ancla inscripcion para que el
popup apunte ahi. Es una siembra: despues se edita todo desde el panel."
```

---

## Task 7: Probarlo en el navegador

- [ ] **Step 1: Recorrido del visitante**

**[LOCAL]** Abrir `http://localhost:3000/` y comprobar, una por una:

| Qué | Esperado |
|---|---|
| La sección aparece con el título del formulario | Sí |
| Imagen a la izquierda, formulario a la derecha | Sí |
| Enviar vacío | Se marcan los ocho obligatorios, cada uno en su campo |
| Correo mal escrito | "Ingresá un correo electrónico válido" en ese campo |
| Enviar bien | Aparece el mensaje de gracias en lugar del formulario |
| Sexto envío en una hora | "Recibimos varios envíos desde esta conexión" |
| Botón mientras envía | Dice "Enviando..." y queda deshabilitado |
| En 390px | Una sola columna, sin scroll horizontal |

- [ ] **Step 2: Verificar la inscripcion guardada**

**[LOCAL]** En `http://localhost:3000/admin`, entrar a **Inscripciones**. Tiene que estar la respuesta, con el formulario al que pertenece y los pares campo-valor.

- [ ] **Step 3: El popup lleva al formulario**

**[LOCAL]** En el panel, en **Popup de bienvenida**, cargar `#inscripcion` en "A dónde lleva la imagen" y guardar. Recargar la home, hacer click en el banner: tiene que cerrar el popup y bajar hasta el formulario.

- [ ] **Step 4: Cambiar una etiqueta sin tocar codigo**

Es la prueba que justifica toda la tarea. En el panel, en **Formularios**, cambiar la etiqueta de "CUIT" por "CUIT / CUIL" y guardar. Recargar la home: el campo tiene que decir lo nuevo, sin desplegar nada.

- [ ] **Step 5: Un formulario borrado no rompe la pagina**

En el panel, borrar el formulario. Recargar la home: la sección no aparece y **el resto de la página carga normal**. Después volver a sembrarlo con `npm run sembrar:formulario-expo`.

---

## Task 8: Desplegar

- [ ] **Step 1: Verificar antes de publicar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit && npm run build
```

- [ ] **Step 2: Publicar**

**[LOCAL]**
```bash
git push vps main
```

**[VPS]**
```bash
/usr/local/bin/urkupina-deploy.sh
```

El script saca backup, aplica las migraciones antes del build, reconstruye, recarga pm2 y verifica que responda 200.

- [ ] **Step 3: Sembrar en produccion**

**[VPS]**
```bash
cd /var/www/urkupina-system
export NODE_ENV=production
set -a; . ./.env; set +a
npm run sembrar:formulario-expo
npm run build && pm2 reload urkupina --update-env
```

El rebuild es necesario porque la home es estática y se genera antes de que el formulario exista.

- [ ] **Step 4: Verificar**

**[VPS]**
```bash
curl -s -o /dev/null -w 'home:  %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
echo "seccion del formulario: $(curl -s https://urkupinasa.com/ | grep -c 'id="inscripcion"')"
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -tAc "SELECT count(*) FROM payload_migrations WHERE name='dev';"
```

Esperado: 200 en las dos rutas, **1** sección de formulario, y **0** migraciones `dev`.

- [ ] **Step 5: Apuntar el popup**

En `https://urkupinasa.com/admin`, en **Popup de bienvenida**, cargar `#inscripcion` en "A dónde lleva la imagen" y guardar. Desde el panel el hook purga la caché solo, así que no hace falta reconstruir.

- [ ] **Step 6: Backup**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

---

## Cierre

- [ ] El cliente crea un formulario desde el panel y elige tipo, etiqueta y ancho de cada campo.
- [ ] Cambiar una etiqueta no requiere desplegar nada.
- [ ] El bloque se agrega, se saca y se reordena desde el armador de la home.
- [ ] La imagen va del lado que se elija, y sin imagen el formulario ocupa todo el ancho.
- [ ] El popup lleva al formulario con `#inscripcion`.
- [ ] Los errores salen marcados en su campo.
- [ ] El campo trampa y el límite por IP funcionan.
- [ ] Un formulario borrado no rompe la página.
- [ ] Las inscripciones se ven en el panel.
- [ ] Las pruebas pasan.

**Prueba manual antes de dar la tarea por cerrada:** desde el panel, agregar un campo nuevo al formulario, mirar la web, y sacarlo. Es el recorrido que justifica haber elegido un constructor en vez de escribir los once campos en el código.

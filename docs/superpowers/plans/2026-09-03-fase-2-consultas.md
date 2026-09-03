# Fase 2 — Consultas

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que las consultas que llegan por la web se guarden en la base y se administren desde el panel, en vez de perderse como pasa hoy.

**Architecture:** La validación vive en un módulo de funciones puras (`lib/consultas/validacion.ts`), probado con Vitest y usado por el servidor como única autoridad. El alta se hace con una Server Action que escribe por la API local de Payload; la colección tiene `create` cerrado, así que nadie puede insertar consultas desde afuera por REST. Los formularios pasan a `useActionState` de React 19, sin estado propio de envío.

**Tech Stack:** Next.js 16, React 19.2.4, Payload 3.88, PostgreSQL 17, Vitest.

**Referencia:** `docs/superpowers/specs/2026-09-03-panel-admin-urkupina-design.md`, secciones 4.2 y 4.5.

---

## Estado de partida verificado

- `components/home/ContactSection.tsx:70` — `handleSubmit` valida en el navegador y después simula el envío con `setTimeout(..., 1200)`. No persiste nada. Campos: `nombre`, `email`, `telefono`, `asunto` (General / Alquiler / Publicidad / Visita), `mensaje`.
- `components/home/AdvertisingSection.tsx:96` — `handleSubmit` solo hace `setIsSubmitted(true)`. **Los campos del formulario no tienen atributo `name`**, así que el formulario es incapaz de enviar datos aunque se lo conectara. Campos por `id`: `asunto`, `empresa`, `email-ad`, `telefono-ad`, `formato`, `mensaje-ad`.
- El alias `@payload-config` está configurado en `tsconfig.json` y es como importa la config el route de Payload.
- `access/roles.ts` tiene `soloAdmin`, `adminOSiMismo`, `soloAdminSalvoSiMismo` y `campoSoloAdmin`, con 12 pruebas. **No tiene** una regla de "cualquiera con sesión": se agrega en esta fase, que es donde por primera vez hace falta.
- nginx pasa `X-Real-IP` y `X-Forwarded-For` al puerto 3000, así que la Server Action puede leer la IP real.

## Convenciones

- Los comandos **[LOCAL]** se corren en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`, con el túnel SSH abierto.
- Los comandos **[VPS]** se corren por SSH contra `root@2.25.115.107`.
- Código y comentarios en español, sin tildes dentro del código.
- Ningún paso avanza si la verificación no da lo esperado.

---

## Task 1: Módulo de validación

Se escriben primero las pruebas. Esta validación es la que manda: la del navegador es comodidad, se saltea con la consola abierta.

**Files:**
- Create: `lib/consultas/validacion.ts`
- Test: `lib/consultas/validacion.test.ts`

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `lib/consultas/validacion.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { validarConsulta } from './validacion';

const base = {
  tipo: 'contacto',
  nombre: 'Carlos Rodriguez',
  email: 'carlos@ejemplo.com',
  telefono: '11 2345-6789',
  empresa: '',
  asunto: 'General',
  formato: '',
  mensaje: 'Quisiera consultar por los horarios de la feria.',
  trampa: '',
};

describe('validarConsulta', () => {
  it('acepta una consulta completa', () => {
    const r = validarConsulta(base);
    expect(r.ok).toBe(true);
  });

  it('normaliza los espacios sobrantes', () => {
    const r = validarConsulta({ ...base, nombre: '  Carlos  ', email: '  CARLOS@Ejemplo.com ' });
    expect(r.ok && r.datos.nombre).toBe('Carlos');
    expect(r.ok && r.datos.email).toBe('carlos@ejemplo.com');
  });

  it('exige el nombre', () => {
    const r = validarConsulta({ ...base, nombre: '   ' });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.errores.nombre).toBeTruthy();
  });

  it('exige el email', () => {
    const r = validarConsulta({ ...base, email: '' });
    expect(!r.ok && r.errores.email).toBeTruthy();
  });

  it('rechaza un email con formato invalido', () => {
    const r = validarConsulta({ ...base, email: 'carlos@sinpunto' });
    expect(!r.ok && r.errores.email).toBeTruthy();
  });

  it('exige el mensaje', () => {
    const r = validarConsulta({ ...base, mensaje: '' });
    expect(!r.ok && r.errores.mensaje).toBeTruthy();
  });

  it('rechaza un mensaje demasiado corto', () => {
    const r = validarConsulta({ ...base, mensaje: 'hola' });
    expect(!r.ok && r.errores.mensaje).toBeTruthy();
  });

  it('rechaza un mensaje desmesurado', () => {
    const r = validarConsulta({ ...base, mensaje: 'a'.repeat(5001) });
    expect(!r.ok && r.errores.mensaje).toBeTruthy();
  });

  it('rechaza un tipo que no existe', () => {
    const r = validarConsulta({ ...base, tipo: 'cualquiera' });
    expect(!r.ok && r.errores.tipo).toBeTruthy();
  });

  it('acepta el tipo publicidad', () => {
    const r = validarConsulta({ ...base, tipo: 'publicidad', empresa: 'Textil SA' });
    expect(r.ok).toBe(true);
    expect(r.ok && r.datos.empresa).toBe('Textil SA');
  });

  it('conserva el formato publicitario elegido', () => {
    const r = validarConsulta({ ...base, tipo: 'publicidad', formato: 'carteleria' });
    expect(r.ok && r.datos.formato).toBe('carteleria');
  });

  it('descarta el envio si la trampa viene llena', () => {
    const r = validarConsulta({ ...base, trampa: 'http://spam.example' });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.esSpam).toBe(true);
  });

  it('el telefono es opcional', () => {
    const r = validarConsulta({ ...base, telefono: '' });
    expect(r.ok).toBe(true);
  });

  it('acumula todos los errores juntos, no solo el primero', () => {
    const r = validarConsulta({ ...base, nombre: '', email: '', mensaje: '' });
    expect(!r.ok && Object.keys(r.errores)).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: falla porque `./validacion` no existe.

- [ ] **Step 3: Escribir el módulo**

Crear `lib/consultas/validacion.ts`:

```ts
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

  const mensaje = limpiar(entrada.mensaje);
  if (mensaje === '') {
    errores.mensaje = 'El mensaje no puede estar vacio.';
  } else if (mensaje.length < LARGO_MINIMO_MENSAJE) {
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
```

- [ ] **Step 4: Correr y verificar que pasa**

**[LOCAL]**
```bash
npm test
```

Esperado: `26 passed` (12 de roles + 14 de validación).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: validacion de consultas del sitio

Funciones puras con pruebas. La validacion del servidor es la que manda:
la del navegador se saltea con la consola abierta."
```

---

## Task 2: Límite de envíos por IP

**Files:**
- Create: `lib/consultas/limite.ts`
- Test: `lib/consultas/limite.test.ts`

- [ ] **Step 1: Escribir las pruebas**

Crear `lib/consultas/limite.test.ts`:

```ts
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
```

- [ ] **Step 2: Correr y verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: falla porque `./limite` no existe.

- [ ] **Step 3: Escribir el módulo**

Crear `lib/consultas/limite.ts`:

```ts
type Opciones = {
  maximo: number;
  ventanaMs: number;
  reloj?: () => number;
};

/**
 * Limite de envios por IP, en memoria.
 *
 * Alcanza porque la aplicacion corre en un unico proceso bajo pm2 en modo
 * fork. Si algun dia se pasa a varias instancias, esto deja de ser exacto y
 * hay que moverlo a la base o a un almacen compartido. El contador se pierde
 * al reiniciar, que es aceptable: el peor caso es que un spammer recupere sus
 * intentos despues de un deploy.
 */
export class LimitadorEnvios {
  private readonly maximo: number;
  private readonly ventanaMs: number;
  private readonly reloj: () => number;
  private registros = new Map<string, number[]>();

  constructor({ maximo, ventanaMs, reloj = Date.now }: Opciones) {
    this.maximo = maximo;
    this.ventanaMs = ventanaMs;
    this.reloj = reloj;
  }

  permitir(ip: string): boolean {
    const ahora = this.reloj();
    this.purgar(ahora);

    const intentos = (this.registros.get(ip) ?? []).filter(
      (momento) => ahora - momento < this.ventanaMs,
    );

    if (intentos.length >= this.maximo) {
      this.registros.set(ip, intentos);
      return false;
    }

    intentos.push(ahora);
    this.registros.set(ip, intentos);
    return true;
  }

  cantidadDeIpsEnMemoria(): number {
    return this.registros.size;
  }

  /** Evita que el mapa crezca sin limite con IPs que ya no importan. */
  private purgar(ahora: number): void {
    for (const [ip, intentos] of this.registros) {
      const vigentes = intentos.filter((momento) => ahora - momento < this.ventanaMs);
      if (vigentes.length === 0) {
        this.registros.delete(ip);
      } else {
        this.registros.set(ip, vigentes);
      }
    }
  }
}

/** Instancia compartida: 5 envios por hora y por IP. */
export const limitadorDeConsultas = new LimitadorEnvios({
  maximo: 5,
  ventanaMs: 60 * 60 * 1000,
});
```

- [ ] **Step 4: Correr y verificar**

**[LOCAL]**
```bash
npm test
```

Esperado: `31 passed`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: limite de envios por IP para los formularios

En memoria, suficiente para un unico proceso pm2 en modo fork. La
limitacion esta documentada en el propio modulo."
```

---

## Task 3: Colección `consultas`

**Files:**
- Create: `collections/Consultas.ts`
- Modify: `access/roles.ts` (agregar `soloAutenticado`)
- Modify: `access/roles.test.ts` (sus pruebas)
- Modify: `payload.config.ts` (registrar la colección)

- [ ] **Step 1: Agregar las pruebas de la regla nueva**

En `access/roles.test.ts`, agregar `soloAutenticado` al import y este bloque al final:

```ts
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
```

- [ ] **Step 2: Verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: falla porque `soloAutenticado` no está exportado.

- [ ] **Step 3: Agregar la regla**

En `access/roles.ts`, antes de `soloAdmin`:

```ts
/** Cualquiera con sesion iniciada, sin importar el rol. */
export const soloAutenticado: Access = ({ req: { user } }) => Boolean(user);
```

- [ ] **Step 4: Verificar que pasa**

**[LOCAL]**
```bash
npm test
```

Esperado: `34 passed`.

- [ ] **Step 5: Crear la colección**

Crear `collections/Consultas.ts`:

```ts
import type { CollectionConfig } from 'payload';
import { soloAdmin, soloAutenticado } from '../access/roles';

export const Consultas: CollectionConfig = {
  slug: 'consultas',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['estado', 'tipo', 'nombre', 'email', 'createdAt'],
    group: 'Consultas',
    description: 'Mensajes que llegan por los formularios del sitio.',
  },
  labels: {
    singular: 'Consulta',
    plural: 'Consultas',
  },
  access: {
    // Cerrado por la API REST. El alta la hace la Server Action con la API
    // local de Payload, que corre en el servidor y no pasa por estas reglas.
    // Asi el formulario graba pero nadie puede insertar consultas desde afuera.
    create: () => false,
    read: soloAutenticado,
    update: soloAutenticado,
    delete: soloAdmin,
  },
  fields: [
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'nueva',
      label: 'Estado',
      options: [
        { label: 'Nueva', value: 'nueva' },
        { label: 'Leida', value: 'leida' },
        { label: 'Respondida', value: 'respondida' },
        { label: 'Cerrada', value: 'cerrada' },
      ],
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      label: 'Origen',
      options: [
        { label: 'Contacto', value: 'contacto' },
        { label: 'Publicidad', value: 'publicidad' },
      ],
      admin: { readOnly: true },
    },
    { name: 'nombre', type: 'text', required: true, label: 'Nombre', admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, label: 'Correo', admin: { readOnly: true } },
    { name: 'telefono', type: 'text', label: 'Telefono', admin: { readOnly: true } },
    { name: 'empresa', type: 'text', label: 'Empresa', admin: { readOnly: true } },
    { name: 'asunto', type: 'text', label: 'Asunto', admin: { readOnly: true } },
    {
      name: 'formato',
      type: 'text',
      label: 'Formato publicitario de interes',
      admin: {
        readOnly: true,
        description: 'Solo se completa en las consultas que llegan por publicidad.',
      },
    },
    {
      name: 'mensaje',
      type: 'textarea',
      required: true,
      label: 'Mensaje',
      admin: { readOnly: true },
    },
  ],
};
```

Los campos del visitante van en solo lectura a propósito: son un registro de lo que la persona escribió, no algo que el equipo deba editar. Lo único que se cambia desde el panel es el `estado`.

- [ ] **Step 6: Registrar la colección**

En `payload.config.ts`, importar `Consultas` desde `./collections/Consultas` y agregarla al arreglo:

```ts
  collections: [Users, Categories, Media, Posts, Consultas],
```

- [ ] **Step 7: Verificar tipos y pruebas**

**[LOCAL]**
```bash
npx tsc --noEmit && npm test
```

Esperado: sin errores de tipos y `34 passed`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: coleccion de consultas del sitio

Guarda lo que llega por los formularios, con estado para seguimiento.
create queda cerrado por REST: el alta la hace la Server Action con la
API local. Los campos del visitante son de solo lectura en el panel."
```

---

## Task 4: Migración de la colección

**Files:**
- Create: `migrations/<timestamp>_consultas.ts` (lo genera Payload)

- [ ] **Step 1: Generar y aplicar en desarrollo**

**[LOCAL]** — con el túnel abierto:
```bash
npx payload migrate:create consultas
npx payload migrate
npx payload migrate:status
```

Esperado: la migración figura como aplicada.

- [ ] **Step 2: Verificar la tabla**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_dev -c "\d consultas"
```

Esperado: la tabla con las columnas `estado`, `tipo`, `nombre`, `email`, `telefono`, `empresa`, `asunto`, `formato`, `mensaje`, `created_at`, `updated_at`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: migracion de la tabla de consultas"
```

---

## Task 5: Server Action

**Files:**
- Create: `app/actions/consultas.ts`

- [ ] **Step 1: Escribir la acción**

Crear `app/actions/consultas.ts`:

```ts
'use server';

import { getPayload } from 'payload';
import { headers } from 'next/headers';
import config from '@payload-config';
import { validarConsulta } from '@/lib/consultas/validacion';
import { limitadorDeConsultas } from '@/lib/consultas/limite';

export type EstadoEnvio = {
  estado: 'inicial' | 'ok' | 'error';
  errores: Record<string, string>;
  mensajeGeneral?: string;
};

export const estadoInicial: EstadoEnvio = { estado: 'inicial', errores: {} };

const ipDelVisitante = async (): Promise<string> => {
  const cabeceras = await headers();
  const reenviada = cabeceras.get('x-forwarded-for');
  if (reenviada) return reenviada.split(',')[0].trim();
  return cabeceras.get('x-real-ip') ?? 'desconocida';
};

export async function enviarConsulta(
  _estadoPrevio: EstadoEnvio,
  formData: FormData,
): Promise<EstadoEnvio> {
  const texto = (campo: string) => (formData.get(campo) as string | null) ?? '';

  const resultado = validarConsulta({
    tipo: texto('tipo'),
    nombre: texto('nombre'),
    email: texto('email'),
    telefono: texto('telefono'),
    empresa: texto('empresa'),
    asunto: texto('asunto'),
    formato: texto('formato'),
    mensaje: texto('mensaje'),
    trampa: texto('sitioWeb'),
  });

  if (!resultado.ok) {
    // Al spam se le contesta lo mismo que a un envio bueno: si se le avisa
    // que fue detectado, el bot ajusta y vuelve.
    if (resultado.esSpam) {
      return { estado: 'ok', errores: {} };
    }
    return {
      estado: 'error',
      errores: resultado.errores,
      mensajeGeneral: 'Revisa los campos marcados.',
    };
  }

  if (!limitadorDeConsultas.permitir(await ipDelVisitante())) {
    return {
      estado: 'error',
      errores: {},
      mensajeGeneral:
        'Recibimos varias consultas desde esta conexion. Espera un rato antes de enviar otra.',
    };
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: 'consultas',
      data: { ...resultado.datos, estado: 'nueva' },
      overrideAccess: true,
    });
  } catch (error) {
    console.error('[consultas] no se pudo guardar la consulta:', error);
    return {
      estado: 'error',
      errores: {},
      mensajeGeneral:
        'No pudimos registrar tu consulta. Volve a intentar en unos minutos o escribinos por WhatsApp.',
    };
  }

  return { estado: 'ok', errores: {} };
}
```

- [ ] **Step 2: Verificar tipos**

**[LOCAL]**
```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Server Action para guardar consultas

Valida en el servidor, aplica limite por IP y escribe con la API local de
Payload. Si el guardado falla el formulario lo dice: nunca mas un gracias
falso como el que habia."
```

---

## Task 6: Conectar el formulario de contacto

**Files:**
- Modify: `components/home/ContactSection.tsx`

- [ ] **Step 1: Reemplazar el estado de envío**

En `ContactSection.tsx`:

1. Agregar al inicio del archivo, después de `"use client"`:

```tsx
import { useActionState } from 'react';
import { enviarConsulta, estadoInicial } from '@/app/actions/consultas';
```

2. Reemplazar los estados `errors` y `status` y la función `handleSubmit` por:

```tsx
  const [resultado, accionEnviar, enviando] = useActionState(enviarConsulta, estadoInicial);

  // La validacion del navegador queda como comodidad, para marcar el campo
  // sin ir al servidor. La que manda es la del servidor.
  const errors = resultado.errores;
  const status = enviando ? 'submitting' : resultado.estado === 'ok' ? 'success' : resultado.estado === 'error' ? 'error' : 'idle';
```

3. Cambiar la etiqueta del formulario de `onSubmit={handleSubmit}` a `action={accionEnviar}`.

4. Agregar dentro del formulario, como primeros elementos:

```tsx
                <input type="hidden" name="tipo" value="contacto" />
                {/* Campo trampa: invisible para las personas, lo llenan los bots. */}
                <input
                  type="text"
                  name="sitioWeb"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
```

5. Los campos ya tienen `name` (`nombre`, `email`, `telefono`, `asunto`, `mensaje`), así que no hay que renombrarlos. Sacar `value={formData.x}` y `onChange={handleChange}` de cada uno: con Server Actions el formulario viaja por `FormData` y no hace falta estado controlado. **En el `select` de asunto, reemplazar `value` por `defaultValue="General"`**, para que siga apareciendo preseleccionado. Borrar `formData`, `setFormData`, `handleChange` y `validateForm`, que quedan sin uso.

Nota sobre el comportamiento esperado: con campos no controlados y Server Actions, React limpia el formulario cuando la acción termina bien y **conserva lo escrito cuando devuelve error**. Es justo lo que se busca: que un fallo no le borre el mensaje a la persona.

6. Donde se muestra el error general, usar `resultado.mensajeGeneral`.

- [ ] **Step 2: Verificar tipos y build**

**[LOCAL]**
```bash
npx tsc --noEmit && npm run build
```

Esperado: sin errores.

- [ ] **Step 3: Probar a mano**

Levantar `npm run dev`, ir a la sección de contacto, enviar una consulta real y comprobar en `http://localhost:3000/admin` que aparece en Consultas con estado Nueva.

Probar además: enviar con el mensaje vacío y comprobar que el error viene del servidor y que lo escrito no se pierde.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: el formulario de contacto guarda de verdad

Reemplaza el setTimeout que simulaba el envio por una Server Action.
Suma campo trampa contra bots y muestra los errores reales del servidor."
```

---

## Task 7: Conectar el formulario de publicidad

Este hay que rehacerlo de fondo: hoy no tiene estado y **sus campos no tienen atributo `name`**, así que es incapaz de enviar datos.

**Files:**
- Modify: `components/home/AdvertisingSection.tsx`

- [ ] **Step 1: Poner `name` a cada campo**

En el formulario del modal, agregar el atributo `name` a cada control, respetando los `id` que ya existen:

| `id` actual | `name` a agregar |
|---|---|
| `asunto` | `asunto` |
| `empresa` | `empresa` |
| `email-ad` | `email` |
| `telefono-ad` | `telefono` |
| `formato` | `formato` |
| `mensaje-ad` | `mensaje` |

- [ ] **Step 2: Conectar la acción**

1. Importar:

```tsx
import { useActionState } from 'react';
import { enviarConsulta, estadoInicial } from '@/app/actions/consultas';
```

2. Reemplazar `handleSubmit` y `isSubmitted` por:

```tsx
  const [resultado, accionEnviar, enviando] = useActionState(enviarConsulta, estadoInicial);
  const isSubmitted = resultado.estado === 'ok';
```

3. Cambiar `onSubmit={handleSubmit}` por `action={accionEnviar}`.

4. Agregar como primeros elementos del formulario:

```tsx
                      <input type="hidden" name="tipo" value="publicidad" />
                      <input type="hidden" name="nombre" value="Consulta de publicidad" />
                      {/* Campo trampa: invisible para las personas, lo llenan los bots. */}
                      <input
                        type="text"
                        name="sitioWeb"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute left-[-9999px] h-0 w-0 opacity-0"
                      />
```

El campo `nombre` es obligatorio en la validación y este formulario no lo pide: pide empresa. Se manda un valor fijo para no romper la regla y que la empresa quede en su propio campo.

5. Mostrar el error general con `resultado.mensajeGeneral` arriba de los botones, y deshabilitar el botón de envío mientras `enviando` sea verdadero.

6. El `select` de formato conserva su `name="formato"`. Ese dato se guarda en su propio campo de la colección: dice qué formato publicitario le interesa al anunciante, que es lo más útil de un contacto comercial. Perderlo dejaría el lead a medias.

- [ ] **Step 3: Verificar tipos y build**

**[LOCAL]**
```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Probar a mano**

Levantar `npm run dev`, abrir el modal de publicidad, enviar y comprobar que la consulta aparece en el panel con tipo Publicidad.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: el formulario de publicidad guarda de verdad

Estaba doblemente roto: no leia los campos y ademas ninguno tenia
atributo name, asi que el formulario era incapaz de enviar datos."
```

---

## Task 8: Desplegar y verificar en producción

- [ ] **Step 1: Verificar antes de publicar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit && npm run build
```

- [ ] **Step 2: Publicar y desplegar**

**[LOCAL]**
```bash
git push vps main
```

**[VPS]**
```bash
/usr/local/bin/urkupina-deploy.sh
cd /var/www/urkupina-system
set -a; . ./.env; set +a
npx payload migrate
pm2 reload urkupina --update-env
```

- [ ] **Step 3: Verificar que la tabla existe en producción**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "\dt consultas"
```

- [ ] **Step 4: Verificar que la API está cerrada**

**[VPS]**
```bash
curl -s -o /dev/null -w 'GET  /api/consultas sin sesion: %{http_code}\n' https://urkupinasa.com/api/consultas
curl -s -o /dev/null -w 'POST /api/consultas sin sesion: %{http_code}\n' \
  -X POST -H 'Content-Type: application/json' \
  -d '{"tipo":"contacto","nombre":"intruso","email":"a@b.com","mensaje":"insertado por la api"}' \
  https://urkupinasa.com/api/consultas
```

Esperado: **403 en las dos**. La lectura exige sesión y el alta por REST está cerrada.

- [ ] **Step 5: Enviar una consulta real de punta a punta**

Desde el navegador, en `https://urkupinasa.com`, completar el formulario de contacto y enviarlo.

**[VPS]** — comprobar que llegó:
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "SELECT id, estado, tipo, nombre, email, created_at FROM consultas ORDER BY id DESC LIMIT 5;"
```

Esperado: la consulta recién enviada, con estado `nueva`.

- [ ] **Step 6: Borrar la consulta de prueba desde el panel**

Entrar a `https://urkupinasa.com/admin`, sección Consultas, y borrarla. De paso queda verificado que el panel la muestra y que el borrado funciona.

- [ ] **Step 7: Backup**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

---

## Cierre de la Fase 2

- [ ] Las consultas de los dos formularios se guardan en la base.
- [ ] Se ven y se administran desde el panel, con estado.
- [ ] `POST /api/consultas` sin sesión devuelve 403.
- [ ] `GET /api/consultas` sin sesión devuelve 403.
- [ ] Un envío fallido muestra un error real y no un "gracias" falso.
- [ ] El campo trampa y el límite por IP están activos.
- [ ] Las pruebas pasan con `npm test`.

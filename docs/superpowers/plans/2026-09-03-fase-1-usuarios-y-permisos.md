# Fase 1 — Usuarios y permisos

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que existan dos roles con permisos reales —administrador y editor—, que un editor no pueda ascenderse ni borrar usuarios, y que la colección de usuarios deje de ser de lectura pública.

**Architecture:** Las reglas de acceso se extraen a un módulo propio de funciones puras (`access/roles.ts`), en vez de escribirlas en línea dentro de las colecciones. Así se prueban sin levantar la aplicación ni tocar la base, y se reutilizan en las colecciones que vienen en las fases siguientes. `Users` gana un campo `rol` con restricción a nivel de campo, que es la única capa que la API respeta: ocultar el campo en la pantalla no impide mandarlo por HTTP.

**Tech Stack:** Payload 3.88, PostgreSQL 17, Vitest para las pruebas.

**Referencia:** `docs/superpowers/specs/2026-09-03-panel-admin-urkupina-design.md`, sección 4.3.

---

## Estado de partida

- Fase 0 cerrada: producción corre contra `urkupina_prod` en el VPS, con esquema por migraciones y backups verificados.
- Existe **un solo usuario**: `id=1`, `lucasdavigiambelluca@gmail.com`. Es el dueño y tiene que quedar como `admin`.
- `collections/Users.ts` hoy tiene `access: { read: () => true }` y **ningún campo propio**.
- El proyecto **no tiene ninguna prueba** ni framework de pruebas instalado.

## Convenciones

- Los comandos **[LOCAL]** se corren en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`, con el túnel SSH abierto (ver `docs/desarrollo.md`).
- Los comandos **[VPS]** se corren por SSH contra `root@2.25.115.107`.
- Ningún paso avanza si la verificación no da lo esperado.

---

## Task 1: Arnés de pruebas

Sin esto no se puede hacer TDD en las tareas siguientes. Se instala solo lo mínimo: las reglas de acceso son funciones puras y no necesitan base de datos ni servidor.

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (script `test`)

- [ ] **Step 1: Instalar Vitest**

**[LOCAL]**
```bash
npm install -D vitest
```

- [ ] **Step 2: Crear la configuración**

Crear `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**'],
  },
  resolve: {
    alias: {
      '@': dirname,
    },
  },
});
```

- [ ] **Step 3: Agregar el script**

En `package.json`, dentro de `scripts`:

```json
    "test": "vitest run",
```

- [ ] **Step 4: Prueba de humo, para verificar que el arnés corre**

Crear `access/humo.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('arnes de pruebas', () => {
  it('corre', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Correr las pruebas**

**[LOCAL]**
```bash
npm test
```

Esperado: `1 passed`.

- [ ] **Step 6: Borrar la prueba de humo**

**[LOCAL]**
```bash
rm access/humo.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: instalar Vitest como arnes de pruebas

Las reglas de acceso que vienen en la Fase 1 son funciones puras y se
prueban sin levantar la aplicacion ni tocar la base."
```

---

## Task 2: Módulo de reglas de acceso

Se escriben primero las pruebas, después las funciones.

**Files:**
- Create: `access/roles.ts`
- Test: `access/roles.test.ts`

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `access/roles.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  adminOSiMismo,
  campoSoloAdmin,
  soloAdmin,
  soloAdminSalvoSiMismo,
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
```

- [ ] **Step 2: Correr y verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: falla con `Failed to resolve import "./roles"`. Todavía no existe.

- [ ] **Step 3: Escribir el módulo**

Crear `access/roles.ts`:

```ts
import type { Access, FieldAccess } from 'payload';

export type Rol = 'admin' | 'editor';

type UsuarioConRol = {
  id: number | string;
  rol?: Rol;
};

const comoUsuario = (user: unknown): UsuarioConRol | null =>
  user ? (user as UsuarioConRol) : null;

const esAdmin = (user: unknown): boolean => comoUsuario(user)?.rol === 'admin';

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
```

- [ ] **Step 4: Correr y verificar que pasa**

**[LOCAL]**
```bash
npm test
```

Esperado: `12 passed`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: modulo de reglas de acceso por rol

Funciones puras en access/roles.ts, con pruebas. Se extraen del cuerpo de
las colecciones para poder probarlas sin levantar la aplicacion y para
reutilizarlas en las colecciones de las fases siguientes."
```

---

## Task 3: Campo `rol` y reglas aplicadas a Users

**Files:**
- Modify: `collections/Users.ts`

- [ ] **Step 1: Reescribir la colección**

`collections/Users.ts` completo:

```ts
import type { CollectionConfig } from 'payload';
import {
  adminOSiMismo,
  campoSoloAdmin,
  soloAdmin,
  soloAdminSalvoSiMismo,
} from '../access/roles';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'rol', 'updatedAt'],
    group: 'Administracion',
  },
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  access: {
    // Antes esto era `() => true`: la lista de mails de administradores se
    // podia leer sin sesion desde /api/users.
    read: adminOSiMismo,
    create: soloAdmin,
    update: adminOSiMismo,
    delete: soloAdminSalvoSiMismo,
  },
  fields: [
    {
      name: 'rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: 'Rol',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Sin esto, un editor se edita a si mismo y se asciende.
        update: campoSoloAdmin,
        create: campoSoloAdmin,
      },
      admin: {
        description:
          'El administrador gestiona usuarios. El editor edita el contenido del sitio y ve las consultas.',
      },
    },
  ],
};
```

- [ ] **Step 2: Verificar que compila**

**[LOCAL]**
```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: rol de usuario y permisos en la coleccion Users

- Campo rol (admin/editor), obligatorio, editor por defecto
- read pasa de () => true a exigir sesion: /api/users era publico y
  devolvia los mails de los administradores
- create solo admin; update admin o el propio usuario; delete solo admin
  y nunca sobre uno mismo
- El campo rol lleva restriccion a nivel de campo, no de pantalla"
```

---

## Task 4: Migración y asignación del rol al usuario existente

Payload crea la columna con valor por defecto `editor`. Como el único usuario que existe es el dueño, si no se corrige queda como editor y **nadie puede administrar usuarios**.

**Files:**
- Create: `migrations/<timestamp>_agregar-rol.ts` (lo genera Payload)

- [ ] **Step 1: Generar la migración contra la base de desarrollo**

**[LOCAL]** — con el túnel abierto:
```bash
npx payload migrate:create agregar-rol
ls -1 migrations/
```

Esperado: un archivo nuevo `<timestamp>_agregar-rol.ts`.

- [ ] **Step 2: Agregar la corrección de datos a la migración**

Abrir el archivo generado y, al final de la función `up`, antes de que cierre, agregar:

```ts
  // Los usuarios que ya existian son anteriores a la existencia de roles.
  // El unico que hay es el dueno del sitio, que tiene que quedar como
  // administrador; si quedara como editor nadie podria gestionar usuarios.
  await db.execute(sql`UPDATE users SET rol = 'admin';`);
```

Verificar que `sql` y `db` estén entre los parámetros o importados en el archivo generado. Payload genera la firma `export async function up({ db, payload, req }: MigrateUpArgs): Promise<void>` y el import de `sql` desde `@payloadcms/db-postgres`.

- [ ] **Step 3: Aplicar en desarrollo**

**[LOCAL]**
```bash
npx payload migrate
npx payload migrate:status
```

Esperado: la migración figura como aplicada (`Yes`).

- [ ] **Step 4: Verificar el resultado en desarrollo**

**[LOCAL]** — la base de desarrollo no tiene usuarios, así que se crea uno para probar:

Levantar `npm run dev`, entrar a `http://localhost:3000/admin`, crear el primer usuario de desarrollo, y comprobar que en la pantalla del usuario aparece el selector **Rol**.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: migracion del campo rol

Agrega la columna rol y asciende a administrador a los usuarios que ya
existian. Sin ese UPDATE el unico usuario del sitio quedaria como editor
y nadie podria gestionar usuarios."
```

---

## Task 5: Panel en español con identidad de Urkupiña

**Files:**
- Modify: `payload.config.ts`

- [ ] **Step 1: Agregar el idioma**

En `payload.config.ts`, importar:

```ts
import { es } from '@payloadcms/translations/languages/es';
```

Y dentro de `buildConfig`:

```ts
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
```

- [ ] **Step 2: Poner el título y el ícono del panel**

Dentro de `admin`, junto a `user` e `importMap`:

```ts
    meta: {
      titleSuffix: ' - Paseo Urkupina',
      icons: [{ rel: 'icon', type: 'image/png', url: '/icon.png' }],
    },
```

- [ ] **Step 3: Verificar que compila y construye**

**[LOCAL]**
```bash
npx tsc --noEmit && npm run build
```

Esperado: sin errores.

- [ ] **Step 4: Verificar en el navegador**

Levantar `npm run dev` y abrir `http://localhost:3000/admin`. Esperado: la interfaz en español y la pestaña con el sufijo del sitio.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: panel de administracion en espanol

Idioma es como unico soportado y por defecto, mas titulo e icono propios."
```

---

## Task 6: Desplegar y verificar en producción

**Files:**
- Ninguno. Es despliegue y verificación.

- [ ] **Step 1: Correr las pruebas antes de publicar**

**[LOCAL]**
```bash
npm test && npm run build
```

Esperado: todas las pruebas pasan y el build termina bien.

- [ ] **Step 2: Publicar**

**[LOCAL]**
```bash
git push vps main
```

- [ ] **Step 3: Desplegar y aplicar la migración**

**[VPS]**
```bash
/usr/local/bin/urkupina-deploy.sh
cd /var/www/urkupina-system
set -a; . ./.env; set +a
npx payload migrate
pm2 reload urkupina --update-env
```

Esperado: `Deploy OK` y la migración aplicada.

- [ ] **Step 4: Verificar que el dueño quedó como administrador**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "SELECT id, email, rol FROM users;"
```

Esperado: `1 | lucasdavigiambelluca@gmail.com | admin`. **Si dice `editor`, el UPDATE de la migración no corrió**: corregilo antes de seguir, o quedás sin administrador.

- [ ] **Step 5: Verificar que la fuga de mails quedó cerrada**

**[VPS]**
```bash
curl -s -o /dev/null -w 'api/users sin sesion: %{http_code}\n' https://urkupinasa.com/api/users
curl -s https://urkupinasa.com/api/users | head -c 200
```

Esperado: **403**, y un cuerpo con el error de permisos. Antes devolvía 200 con la lista de mails.

- [ ] **Step 6: Verificar el panel**

**[VPS]**
```bash
curl -s -o /dev/null -w 'home:  %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
```

Esperado: ambos 200.

- [ ] **Step 7: Backup**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

---

## Cierre de la Fase 1

- [ ] Existen dos roles y el dueño del sitio es administrador.
- [ ] `/api/users` sin sesión devuelve 403, no la lista de mails.
- [ ] Un editor no puede crear usuarios, ni borrarlos, ni cambiar su propio rol.
- [ ] Nadie puede borrarse a sí mismo.
- [ ] El panel está en español.
- [ ] Las pruebas de las reglas de acceso pasan y corren con `npm test`.

**Prueba manual recomendada antes de dar la fase por cerrada:** crear un usuario de prueba con rol editor, entrar al panel con esa cuenta y comprobar que no ve la sección de usuarios y que no puede cambiarse el rol. Después borrarlo.

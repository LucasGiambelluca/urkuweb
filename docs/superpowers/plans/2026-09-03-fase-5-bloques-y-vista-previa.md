# Fase 5 — Armador de bloques y vista previa

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el cliente arme la home desde el panel —agregando, sacando y reordenando secciones— y vea el resultado mientras edita.

**Architecture:** Una ficha `home` con un campo de bloques. Cada bloque corresponde a una sección que ya existe; el componente no cambia, solo pasa a invocarse desde una lista en vez de estar clavado en el JSX. `app/(frontend)/page.tsx` recorre los bloques y renderiza cada uno. Se activa Live Preview de Payload, que muestra la página al lado del formulario y la refresca al guardar.

**Tech Stack:** Payload 3.88 (campo `blocks` + `admin.livePreview`), `@payloadcms/live-preview-react` 3.88.0, Next 16.

**Referencia:** `docs/superpowers/specs/2026-09-03-panel-admin-urkupina-design.md`, sección "2.ter".

---

## Alcance, y qué NO es

Esto construye un armador de bloques al estilo Gutenberg: una lista de secciones que se agregan, se sacan y se reordenan desde un formulario, con vista previa al lado.

**No** construye un editor tipo Elementor, donde se arrastran cajas sobre la página misma. Payload no provee eso y hacerlo sería un proyecto aparte. Está dicho en el spec y conviene repetirlo acá para que nadie lo lea como si estuviera incluido.

## Decisión de diseño: qué queda fijo

La idea original era dejar fijas las secciones institucionales. Al aterrizarla aparece un problema: `Story` y `Timeline` están **en el medio** de la secuencia actual, y no se pueden intercalar elementos fijos dentro de una lista reordenable sin congelar todo lo que los rodea.

Entonces lo fijo pasa a ser el **marco** de la página:

| Fijo | Por qué |
|---|---|
| `Navbar` | Navegación, no es contenido |
| `Hero` | Es la entrada del sitio; si se puede sacar, se puede quedar sin portada |
| `ContactSection` | Cierra la página, y el formulario tiene que estar siempre |
| `SiteFooter` | Pie, no es contenido |

Todo lo que va entre el hero y el contacto pasa a ser bloque. Son diez.

## Estado de partida verificado

- `app/(frontend)/page.tsx` renderiza doce secciones en orden fijo y ya consulta sponsors, números, precios y contacto en paralelo.
- Los componentes de sección ya reciben sus datos por props: `HeroStats`, `ImpactGrid`, `VisitSection`, `CommerceSection` reciben `numeros`; `ServicesHubSection` recibe `precios`, `numeros` y `contacto`; `SponsorShowcase` recibe `sponsors`; `Story` recibe `numeros`; `StreamingPreview` recibe `canalYoutube`. Eso es lo que hace viable esta fase: no hay que reescribirlos, solo invocarlos desde una lista.
- `livePreview` existe en la configuración de Payload 3.88 y `@payloadcms/live-preview-react@3.88.0` está publicado en la misma versión.
- Hay 41 pruebas pasando.

## Convenciones

- **[LOCAL]** en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`, con el túnel SSH abierto. El servidor de desarrollo elige el primer puerto libre a partir del 3000; hoy cae en el 3003 porque hay otros proyectos ocupando los anteriores.
- **[VPS]** por SSH contra `root@2.25.115.107`.
- Código y comentarios en español, sin tildes dentro del código. **Los textos que ve el visitante sí llevan tildes.**
- Ningún paso avanza si la verificación no da lo esperado.

---

## Task 1: Definir los bloques

**Files:**
- Create: `blocks/secciones.ts`
- Test: `blocks/secciones.test.ts`

- [ ] **Step 1: Escribir las pruebas**

Crear `blocks/secciones.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { BLOQUES_DE_SECCION, SLUGS_DE_BLOQUE } from './secciones';

describe('bloques de seccion', () => {
  it('define los diez bloques', () => {
    expect(BLOQUES_DE_SECCION).toHaveLength(10);
  });

  it('no repite slugs', () => {
    const slugs = BLOQUES_DE_SECCION.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('cada bloque tiene una etiqueta legible', () => {
    for (const bloque of BLOQUES_DE_SECCION) {
      expect(bloque.labels?.singular).toBeTruthy();
    }
  });

  it('expone los slugs como lista', () => {
    expect(SLUGS_DE_BLOQUE).toContain('sponsors');
    expect(SLUGS_DE_BLOQUE).toContain('novedades');
    expect(SLUGS_DE_BLOQUE).toHaveLength(10);
  });
});
```

- [ ] **Step 2: Verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: falla porque `./secciones` no existe.

- [ ] **Step 3: Escribir los bloques**

Crear `blocks/secciones.ts`:

```ts
import type { Block } from 'payload';

/**
 * Cada bloque corresponde a una seccion que ya existe en la home.
 *
 * La mayoria no lleva campos propios a proposito: su contenido sale de las
 * fichas y colecciones que ya existen (numeros, precios, contacto, sponsors).
 * El bloque solo dice "esta seccion va aca". Agregar campos por bloque es
 * facil despues; empezar con campos que nadie pidio, no.
 */
const bloque = (slug: string, singular: string): Block => ({
  slug,
  labels: { singular, plural: singular },
  // Sin campos: el bloque solo dice "esta seccion va aca". Payload lo acepta
  // y en el panel se ve como una fila con su nombre, que es exactamente lo
  // que hace falta para agregar, sacar y reordenar.
  fields: [],
});

export const BLOQUES_DE_SECCION: Block[] = [
  bloque('cifras', 'Cifras del predio'),
  bloque('historia', 'Historia'),
  bloque('lineaDeTiempo', 'Linea de tiempo'),
  bloque('streaming', 'Streaming ULIVE'),
  bloque('visita', 'Como visitarnos'),
  bloque('servicios', 'Servicios'),
  bloque('impacto', 'Impacto'),
  bloque('comercio', 'Comercio'),
  bloque('sponsors', 'Sponsors'),
  {
    slug: 'novedades',
    labels: { singular: 'Novedades', plural: 'Novedades' },
    admin: { group: 'Secciones' },
    fields: [
      {
        name: 'cantidad',
        type: 'number',
        required: true,
        defaultValue: 6,
        min: 1,
        max: 12,
        label: 'Cuantas notas mostrar',
      },
    ],
  },
];

export const SLUGS_DE_BLOQUE = BLOQUES_DE_SECCION.map((b) => b.slug);
```

Solo el bloque de novedades lleva un campo, porque es el único donde hay algo real que elegir: cuántas notas mostrar. Los demás van sin campos a propósito — su contenido ya sale de las fichas y colecciones existentes. Agregar campos por bloque más adelante es fácil; empezar con campos que nadie pidió, no.

- [ ] **Step 4: Verificar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit
```

Esperado: **45 pruebas pasando**.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: definir los bloques de seccion de la home

Diez bloques, uno por seccion existente. Casi ninguno lleva campos propios:
su contenido sale de las fichas y colecciones que ya existen."
```

---

## Task 2: La ficha `home`

**Files:**
- Create: `globals/Home.ts`
- Modify: `payload.config.ts`

- [ ] **Step 1: Crear la ficha**

Crear `globals/Home.ts`:

```ts
import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';
import { BLOQUES_DE_SECCION } from '../blocks/secciones';

/** El orden con el que la home venia armada antes de existir el armador. */
const ORDEN_INICIAL = [
  'cifras',
  'historia',
  'lineaDeTiempo',
  'streaming',
  'visita',
  'servicios',
  'impacto',
  'comercio',
  'sponsors',
  'novedades',
].map((blockType) => ({ blockType }));

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Armado de la home',
  admin: {
    group: 'Contenido del sitio',
    description:
      'Que secciones aparecen en la portada y en que orden. El menu, la portada, el contacto y el pie son fijos.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'secciones',
      type: 'blocks',
      label: 'Secciones',
      minRows: 1,
      blocks: BLOQUES_DE_SECCION,
      defaultValue: ORDEN_INICIAL,
      admin: {
        description:
          'Arrastra para reordenar. Sacar una seccion no borra su contenido: vuelve a aparecer si la agregas de nuevo.',
      },
    },
  ],
};
```

- [ ] **Step 2: Registrar y migrar**

En `payload.config.ts`, importar `Home` y agregarla: `globals: [Numeros, Servicios, Contacto, Home],`

**[LOCAL]**
```bash
npx payload generate:types
npx payload migrate:create home-bloques
```

- [ ] **Step 3: Validar la migración sobre base limpia**

Es el procedimiento que ya usamos: la base de desarrollo aplica el esquema por empuje automático, así que si no se valida aparte, producción sería el primer lugar donde la migración corre de verdad.

**[LOCAL]**
```bash
PASS=$(ssh -o BatchMode=yes root@2.25.115.107 'source /root/.urkupina-db-credentials; echo "$urkupina_db_password"')
ssh -o BatchMode=yes root@2.25.115.107 'sudo -u postgres psql -q -c "DROP DATABASE IF EXISTS urkupina_migtest;" -c "CREATE DATABASE urkupina_migtest OWNER urkupina;"'
DATABASE_URL="postgresql://urkupina:${PASS}@127.0.0.1:5433/urkupina_migtest" npx payload migrate
ssh -o BatchMode=yes root@2.25.115.107 'sudo -u postgres psql -q -c "DROP DATABASE urkupina_migtest;"'
```

Esperado: todas las migraciones aplican sin errores.

- [ ] **Step 4: Aplicar en desarrollo e inicializar**

**[LOCAL]**
```bash
npx payload migrate:fresh
npm run inicializar:fichas
npm run sembrar:sponsors
```

`migrate:fresh` deja la base de desarrollo construida solo con migraciones, que es como va a estar producción. Borra los datos de desarrollo, incluido el usuario del panel: hay que volver a crearlo.

Agregar `'home'` a la lista `FICHAS` de `scripts/inicializar-fichas.ts` antes de correrlo.

- [ ] **Step 5: Verificar el orden inicial**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_dev -c "\dt" | grep home
```

Esperado: las tablas de la ficha `home` y sus bloques.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: ficha de armado de la home

Campo de bloques con el orden actual como valor por defecto, para que
activar el armador no cambie nada de lo que se ve hoy."
```

---

## Task 3: La home renderiza los bloques

**Files:**
- Modify: `app/(frontend)/page.tsx`
- Create: `components/home/Secciones.tsx`

- [ ] **Step 1: Componente que traduce bloque a sección**

Crear `components/home/Secciones.tsx`, un componente de servidor que recibe la lista de bloques y todos los datos ya consultados, y renderiza cada sección en orden. Un `switch` sobre `blockType` que devuelve el componente correspondiente, pasándole las props que ya recibe hoy.

Debe manejar el caso de un `blockType` desconocido devolviendo `null` en vez de romper: si alguien borra un bloque del código y quedó usado en la base, la página tiene que seguir cargando.

- [ ] **Step 2: La home consulta la ficha**

En `app/(frontend)/page.tsx`, agregar `obtenerSecciones()` con el mismo patrón try/catch de las otras, leyendo `payload.findGlobal({ slug: 'home' })`. Si falla o viene vacía, usar el orden por defecto escrito en el código, para que una caída de base no deje la página sin secciones.

Reemplazar las diez secciones fijas del JSX por `<Secciones bloques={secciones} ... />`, dejando `Navbar`, `Hero`, `ContactSection` y `SiteFooter` donde están.

- [ ] **Step 3: Verificar que la página se ve igual**

**[LOCAL]**
```bash
npm run build
```

Levantar el servidor y comparar la home contra la de producción: tiene que verse exactamente igual, porque el orden por defecto es el actual.

- [ ] **Step 4: Probar el armador**

En el panel, en "Armado de la home": sacar una sección, reordenar dos, guardar y recargar la home. Verificar que el cambio se refleja.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: la home se arma desde los bloques del panel

El marco (menu, portada, contacto y pie) queda fijo. Todo lo del medio sale
de la ficha de armado. Un bloque desconocido se ignora en vez de romper la
pagina."
```

---

## Task 4: Vista previa en vivo

**Files:**
- Modify: `payload.config.ts`
- Create: `components/RefrescarAlGuardar.tsx`
- Modify: `app/(frontend)/layout.tsx`

- [ ] **Step 1: Instalar el paquete**

**[LOCAL]**
```bash
npm install @payloadcms/live-preview-react@3.88.0
```

Se fija la versión exacta para que coincida con el resto de los paquetes de Payload.

- [ ] **Step 2: Configurar la vista previa**

En `payload.config.ts`, dentro de `admin`:

```ts
    livePreview: {
      url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      globals: ['home'],
      breakpoints: [
        { name: 'celular', label: 'Celular', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'escritorio', label: 'Escritorio', width: 1440, height: 900 },
      ],
    },
```

**Ojo con `NEXT_PUBLIC_SERVER_URL` en desarrollo:** el servidor no siempre queda en el 3000, porque elige el primer puerto libre. Si la vista previa aparece en blanco, es que apunta a un puerto donde no hay nada. Ajustar la variable en `.env.local` al puerto real.

- [ ] **Step 3: Refrescar la página al guardar**

Crear `components/RefrescarAlGuardar.tsx`:

```tsx
'use client';

import { RefreshRouteOnSave as RefrescarPayload } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

/**
 * Escucha los avisos que manda el panel al guardar y refresca la ruta, para
 * que la vista previa muestre el cambio sin recargar a mano.
 */
export const RefrescarAlGuardar = ({ url }: { url: string }) => {
  const router = useRouter();
  return <RefrescarPayload refresh={() => router.refresh()} serverURL={url} />;
};
```

Montarlo en `app/(frontend)/layout.tsx`, pasándole `process.env.NEXT_PUBLIC_SERVER_URL`.

- [ ] **Step 4: Probar la vista previa**

En el panel, abrir "Armado de la home". Tiene que aparecer el botón de vista previa en vivo, con la página al lado. Reordenar un bloque, guardar, y verificar que la vista previa se actualiza sola. Probar los tres tamaños de pantalla.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: vista previa en vivo del armado de la home

El panel muestra la pagina al lado del formulario y la refresca al guardar,
con tres tamanios de pantalla."
```

---

## Task 5: Novedades reales

Esto venía de la Fase 4 y entra acá porque el bloque de novedades no tiene sentido mostrando notas de mentira.

**Files:**
- Modify: `components/home/NewsFeed.tsx`, `app/(frontend)/page.tsx`

- [ ] **Step 1: Consultar los posts**

`NewsFeed` hoy muestra `fallbackPosts`, un arreglo hardcodeado. Pasa a recibir los posts por props desde la home, que los consulta de la colección `posts` filtrando por `status: 'published'`, ordenados por fecha, con el límite que indique el bloque.

Si no hay ninguno publicado, se sigue usando el respaldo: una sección de novedades vacía se ve peor que una con contenido de ejemplo, y el cliente todavía no cargó notas.

- [ ] **Step 2: Verificar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit && npm run build
```

Crear una nota desde el panel, publicarla, y verificar que aparece en la home reemplazando al respaldo.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: las novedades salen de la coleccion posts

Si no hay ninguna publicada se muestra el respaldo, para no dejar la
seccion vacia mientras el cliente todavia no cargo notas."
```

---

## Task 6: Desplegar y verificar

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

El script ya exporta `NODE_ENV=production` antes de migrar y verifica el `BUILD_ID` antes de dar el deploy por bueno.

- [ ] **Step 3: Inicializar la ficha nueva y reconstruir**

**[VPS]**
```bash
cd /var/www/urkupina-system
export NODE_ENV=production
set -a; . ./.env; set +a
npm run inicializar:fichas
npm run build && pm2 reload urkupina --update-env
```

El rebuild es necesario porque la home es estática y se genera antes de que la ficha tenga datos. Es la misma secuencia que en las fases 3a y 3b.

- [ ] **Step 4: Verificar**

**[VPS]**
```bash
H=$(curl -s https://urkupinasa.com/)
echo "secciones presentes: $(echo "$H" | grep -oE 'id="(sponsors|contacto|publicidad|stats)"' | sort -u | tr '\n' ' ')"
curl -s -o /dev/null -w 'home:  %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -tAc "SELECT count(*) FROM payload_migrations WHERE name='dev';"
```

Esperado: la home igual que antes, 200 en las dos rutas, y **0** filas `dev` en las migraciones.

- [ ] **Step 5: Backup**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

---

## Cierre de la Fase 5

- [ ] El cliente agrega, saca y reordena secciones desde el panel.
- [ ] Sacar una sección no borra nada: se puede volver a agregar.
- [ ] La vista previa muestra la página al lado y se actualiza al guardar.
- [ ] La home se ve igual que antes con el orden por defecto.
- [ ] Un bloque desconocido no rompe la página.
- [ ] Las novedades salen de `posts`.
- [ ] Las pruebas pasan.

**Prueba manual antes de dar la fase por cerrada:** desde el panel, dejar la home con solo tres secciones, guardar, mirar la web, y después volver al orden original. Es el recorrido que va a hacer el cliente el primer día.

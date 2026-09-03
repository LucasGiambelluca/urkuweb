# Fase 3a — Sponsors administrables

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el equipo pueda agregar, editar, reordenar y dar de baja sponsors desde el panel, subiendo el logo de cada uno, sin tocar código ni pedir un deploy.

**Architecture:** `app/page.tsx` pasa a ser componente de servidor asíncrono y consulta con la API local de Payload; `SponsorShowcase` deja de tener su arreglo hardcodeado y recibe los sponsors por props. Si la base falla, la sección cae a los cinco sponsors actuales escritos en el código como respaldo, así una caída de base nunca deja la home rota. Los cinco logos existentes se cargan a `media` con un script de siembra, no a mano.

**Tech Stack:** Payload 3.88 con almacenamiento local en `public/media`, sharp para los tamaños derivados, PostgreSQL 17, Next 16.

**Referencia:** `docs/superpowers/specs/2026-09-03-panel-admin-urkupina-design.md`, secciones 4.2 y 4.4.

---

## Estado de partida verificado

- `components/home/SponsorShowcase.tsx:9` — arreglo `SPONSORS` con 5 entradas: `name`, `logo` (ruta a `/public/images/sponsors/`), `category` y `sizeClass`. Se renderiza en la línea 210.
- Solo hay **dos valores distintos de `sizeClass`**, afinados a mano:
  - `max-h-24 sm:max-h-28 max-w-[90%]` — Commander Security y Prosegur
  - `max-h-20 sm:max-h-24 max-w-[85%]` — Acudir, Banco Provincia y Credicoop
- `collections/Media.ts` ya está configurado con `staticDir: 'public/media'` y dos tamaños derivados (`thumbnail` y `card`). `sharp` ya está instalado y pasado a `buildConfig`.
- **`public/media` no está en `.gitignore`.** Es un riesgo real: en la Fase 0 se corrió `git clean -fd` sobre la carpeta de producción, y eso borra archivos no rastreados. Si el cliente hubiera subido logos, se habrían perdido.
- `app/page.tsx` es un componente de servidor sincrónico que solo compone secciones; no consulta nada.

## Convenciones

- Los comandos **[LOCAL]** se corren en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`, con el túnel SSH abierto.
- Los comandos **[VPS]** se corren por SSH contra `root@2.25.115.107`.
- Código y comentarios en español, sin tildes dentro del código.
- Ningún paso avanza si la verificación no da lo esperado.

---

## Task 1: Proteger los archivos subidos

Va primero porque es la única tarea que previene pérdida de datos del cliente.

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Ignorar la carpeta de subidas**

Agregar al final de `.gitignore`:

```
# Archivos subidos desde el panel. Son datos del cliente, no codigo.
# Ademas de no ensuciar el repositorio, estar ignorados los protege de un
# `git clean -fd`, que borra los archivos no rastreados.
/public/media/
```

- [ ] **Step 2: Verificar**

**[LOCAL]**
```bash
mkdir -p public/media
git check-ignore -v public/media && echo "OK: protegido"
```

Esperado: la regla de `.gitignore` que lo excluye, y `OK: protegido`.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignorar public/media, que son archivos del cliente

Ademas de no ensuciar el repositorio, estar ignorado protege esos archivos
de un git clean -fd, que en la Fase 0 se corrio sobre produccion."
```

---

## Task 2: Colección `sponsors`

**Files:**
- Create: `collections/Sponsors.ts`
- Modify: `payload.config.ts`

- [ ] **Step 1: Crear la colección**

Crear `collections/Sponsors.ts`:

```ts
import type { CollectionConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { soloAutenticado } from '../access/roles';

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'categoria', 'orden', 'activo'],
    group: 'Contenido del sitio',
    description: 'Marcas que aparecen en la seccion de sponsors de la home.',
  },
  labels: {
    singular: 'Sponsor',
    plural: 'Sponsors',
  },
  access: {
    // La home los muestra sin sesion, asi que la lectura publica se limita a
    // los que estan activos. Los dados de baja solo se ven desde el panel.
    read: ({ req: { user } }) => {
      if (user) return true;
      return { activo: { equals: true } };
    },
    create: soloAutenticado,
    update: soloAutenticado,
    delete: soloAutenticado,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/');
      },
    ],
    afterDelete: [
      () => {
        revalidatePath('/');
      },
    ],
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre de la marca',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
      admin: {
        description: 'Preferentemente PNG o WEBP con fondo transparente.',
      },
    },
    {
      name: 'categoria',
      type: 'text',
      label: 'Rubro',
      admin: {
        description: 'Se muestra debajo del logo. Por ejemplo: Seguridad, Banca Institucional.',
      },
    },
    {
      name: 'sitioWeb',
      type: 'text',
      label: 'Sitio web (opcional)',
    },
    {
      name: 'tamano',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      label: 'Tamano del logo',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Grande', value: 'grande' },
      ],
      admin: {
        description:
          'Ajuste fino para que logos de proporciones distintas se vean parejos. Si el logo se ve chico, proba con Grande.',
      },
    },
    {
      name: 'orden',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Orden',
      admin: {
        description: 'De menor a mayor. Los de numero mas bajo aparecen primero.',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      label: 'Visible en el sitio',
      admin: {
        description: 'Destildar para sacarlo de la web sin borrar la ficha.',
      },
    },
  ],
};
```

El campo `tamano` existe porque los cinco logos actuales tienen dos ajustes distintos de altura, afinados a mano para que se vean parejos. Sin ese campo, o se pierde el ajuste o hay que pedir un deploy cada vez que entra un logo de proporciones raras.

- [ ] **Step 2: Registrar la colección**

En `payload.config.ts`, importar `Sponsors` desde `./collections/Sponsors` y agregarla al arreglo:

```ts
  collections: [Users, Categories, Media, Posts, Consultas, Sponsors],
```

- [ ] **Step 3: Verificar tipos**

**[LOCAL]**
```bash
npx tsc --noEmit && npm test
```

Esperado: sin errores y 37 pruebas pasando.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: coleccion de sponsors

Lectura publica limitada a los activos, para que dar de baja un sponsor no
obligue a borrar su ficha. Revalida la home al guardar y al borrar."
```

---

## Task 3: Migración

**Files:**
- Create: `migrations/<timestamp>_sponsors.ts` (lo genera Payload)

- [ ] **Step 1: Generar y aplicar en desarrollo**

**[LOCAL]** — con el túnel abierto:
```bash
npx payload migrate:create sponsors
npx payload migrate
npx payload migrate:status
```

Esperado: la migración aparece aplicada.

- [ ] **Step 2: Verificar la tabla**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_dev -c "\d sponsors"
```

Esperado: columnas `nombre`, `logo_id`, `categoria`, `sitio_web`, `tamano`, `orden`, `activo`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: migracion de la tabla de sponsors"
```

---

## Task 4: Script de siembra de los sponsors actuales

Los cinco logos ya existen en `public/images/sponsors/`. Cargarlos a mano desde el panel es trabajo repetido y propenso a que se pierda alguno; un script lo hace igual en las dos bases y queda como registro de qué había.

**Files:**
- Create: `scripts/sembrar-sponsors.ts`
- Modify: `package.json` (script `sembrar:sponsors`)

- [ ] **Step 1: Escribir el script**

Crear `scripts/sembrar-sponsors.ts`:

```ts
/**
 * Carga los cinco sponsors que estaban hardcodeados en SponsorShowcase.
 *
 * Es idempotente: si un sponsor ya existe por nombre, no lo duplica. Se puede
 * correr en desarrollo y en produccion sin pensar.
 *
 * Uso: npm run sembrar:sponsors
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';
import config from '../payload.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const raizDelProyecto = path.resolve(dirname, '..');

const SPONSORS = [
  {
    nombre: 'Commander Security',
    archivo: 'commandersecurity.png',
    categoria: 'Seguridad',
    tamano: 'grande' as const,
    orden: 10,
  },
  {
    nombre: 'Prosegur Seguridad',
    archivo: 'prosegur-vector-logo.png',
    categoria: 'Seguridad',
    tamano: 'grande' as const,
    orden: 20,
  },
  {
    nombre: 'Acudir Emergencias',
    archivo: 'Acudir-01-1.png',
    categoria: 'Emergencias Medicas',
    tamano: 'normal' as const,
    orden: 30,
  },
  {
    nombre: 'Banco Provincia',
    archivo: 'Banco_Provincia_(Bs.As.,_2021).svg.webp',
    categoria: 'Banca Institucional',
    tamano: 'normal' as const,
    orden: 40,
  },
  {
    nombre: 'Banco Credicoop',
    archivo: 'creedicop.png',
    categoria: 'Banca Cooperativa',
    tamano: 'normal' as const,
    orden: 50,
  },
];

const sembrar = async () => {
  const payload = await getPayload({ config });

  for (const sponsor of SPONSORS) {
    const existentes = await payload.find({
      collection: 'sponsors',
      where: { nombre: { equals: sponsor.nombre } },
      limit: 1,
      overrideAccess: true,
    });

    if (existentes.totalDocs > 0) {
      console.log(`- ${sponsor.nombre}: ya existe, se omite`);
      continue;
    }

    const logo = await payload.create({
      collection: 'media',
      data: { alt: `Logo de ${sponsor.nombre}` },
      filePath: path.join(raizDelProyecto, 'public', 'images', 'sponsors', sponsor.archivo),
      overrideAccess: true,
    });

    await payload.create({
      collection: 'sponsors',
      data: {
        nombre: sponsor.nombre,
        logo: logo.id,
        categoria: sponsor.categoria,
        tamano: sponsor.tamano,
        orden: sponsor.orden,
        activo: true,
      },
      overrideAccess: true,
    });

    console.log(`+ ${sponsor.nombre}: cargado`);
  }

  const total = await payload.count({ collection: 'sponsors', overrideAccess: true });
  console.log(`\nSponsors en la base: ${total.totalDocs}`);
  process.exit(0);
};

sembrar().catch((error) => {
  console.error('Fallo la siembra:', error);
  process.exit(1);
});
```

- [ ] **Step 2: Agregar el script a package.json**

En `scripts`:

```json
    "sembrar:sponsors": "payload run scripts/sembrar-sponsors.ts",
```

Se usa `payload run` y no `node` porque carga el entorno y resuelve TypeScript igual que el resto del CLI.

- [ ] **Step 3: Correr en desarrollo**

**[LOCAL]** — con el túnel abierto:
```bash
npm run sembrar:sponsors
```

Esperado: cinco líneas `+ ... cargado` y `Sponsors en la base: 5`.

- [ ] **Step 4: Verificar que es idempotente**

**[LOCAL]**
```bash
npm run sembrar:sponsors
```

Esperado: cinco líneas `ya existe, se omite` y `Sponsors en la base: 5`. Si duplica, hay que corregir antes de correrlo en producción.

- [ ] **Step 5: Verificar que los archivos se escribieron**

**[LOCAL]**
```bash
ls public/media/
```

Esperado: los cinco archivos originales más sus versiones `-thumbnail` y `-card` generadas por sharp.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: siembra de los sponsors que estaban hardcodeados

Idempotente por nombre: se puede correr en las dos bases sin duplicar."
```

---

## Task 5: La home consulta los sponsors

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/home/SponsorShowcase.tsx`

- [ ] **Step 1: Convertir la home en componente de servidor asíncrono**

`app/page.tsx` completo:

```tsx
import { getPayload } from 'payload';
import config from '@payload-config';

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HeroStats from "@/components/home/HeroStats";
import Story from "@/components/home/Story";
import Timeline from "@/components/home/Timeline";
import StreamingPreview from "@/components/home/StreamingPreview";
import VisitSection from "@/components/home/VisitSection";
import ServicesHubSection from "@/components/home/ServicesHubSection";
import ImpactGrid from "@/components/home/ImpactGrid";
import CommerceSection from "@/components/home/CommerceSection";
import SponsorShowcase, { type SponsorVisible } from "@/components/home/SponsorShowcase";
import AdvertisingSection from "@/components/home/AdvertisingSection";
import NewsFeed from "@/components/home/NewsFeed";
import ContactSection from "@/components/home/ContactSection";
import SiteFooter from "@/components/layout/SiteFooter";

/**
 * Si la base no responde se devuelve null y cada seccion cae a sus valores de
 * respaldo. Hasta ahora el contenido era estatico y la home no se caia nunca:
 * seria un retroceso que una caida de base la deje en blanco.
 */
async function obtenerSponsors(): Promise<SponsorVisible[] | null> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'sponsors',
      where: { activo: { equals: true } },
      sort: 'orden',
      limit: 50,
      depth: 1,
    });

    return docs.map((sponsor) => ({
      nombre: sponsor.nombre,
      categoria: sponsor.categoria ?? '',
      tamano: sponsor.tamano === 'grande' ? 'grande' : 'normal',
      logo:
        typeof sponsor.logo === 'object' && sponsor.logo !== null
          ? (sponsor.logo.url ?? '')
          : '',
      alt:
        typeof sponsor.logo === 'object' && sponsor.logo !== null
          ? (sponsor.logo.alt ?? sponsor.nombre)
          : sponsor.nombre,
    }));
  } catch (error) {
    console.error('[home] no se pudieron leer los sponsors:', error);
    return null;
  }
}

export default async function Home() {
  const sponsors = await obtenerSponsors();

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <HeroStats />
        <Story />
        <Timeline />
        <StreamingPreview />
        <VisitSection />
        <ServicesHubSection />
        <ImpactGrid />
        <CommerceSection />
        <SponsorShowcase sponsors={sponsors} />
        <NewsFeed />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Que SponsorShowcase reciba los datos**

En `components/home/SponsorShowcase.tsx`:

1. Exportar el tipo y renombrar el arreglo actual como respaldo:

```tsx
export type SponsorVisible = {
  nombre: string;
  categoria: string;
  tamano: 'normal' | 'grande';
  logo: string;
  alt: string;
};

/**
 * Respaldo: es lo que habia hardcodeado antes de que los sponsors salieran de
 * la base. Se usa solo si la consulta falla, para que una caida de base no
 * deje la seccion vacia.
 */
const SPONSORS_RESPALDO: SponsorVisible[] = [
  { nombre: 'Commander Security', logo: '/images/sponsors/commandersecurity.png', categoria: 'Seguridad', tamano: 'grande', alt: 'Logo de Commander Security' },
  { nombre: 'Prosegur Seguridad', logo: '/images/sponsors/prosegur-vector-logo.png', categoria: 'Seguridad', tamano: 'grande', alt: 'Logo de Prosegur Seguridad' },
  { nombre: 'Acudir Emergencias', logo: '/images/sponsors/Acudir-01-1.png', categoria: 'Emergencias Medicas', tamano: 'normal', alt: 'Logo de Acudir Emergencias' },
  { nombre: 'Banco Provincia', logo: '/images/sponsors/Banco_Provincia_(Bs.As.,_2021).svg.webp', categoria: 'Banca Institucional', tamano: 'normal', alt: 'Logo de Banco Provincia' },
  { nombre: 'Banco Credicoop', logo: '/images/sponsors/creedicop.png', categoria: 'Banca Cooperativa', tamano: 'normal', alt: 'Logo de Banco Credicoop' },
];

const CLASES_POR_TAMANO: Record<SponsorVisible['tamano'], string> = {
  grande: 'max-h-24 sm:max-h-28 max-w-[90%]',
  normal: 'max-h-20 sm:max-h-24 max-w-[85%]',
};
```

2. Cambiar la firma del componente:

```tsx
export default function SponsorShowcase({ sponsors }: { sponsors?: SponsorVisible[] | null }) {
  // Si la consulta fallo (null) se usa el respaldo. Si devolvio una lista
  // vacia se respeta: puede ser que los hayan dado de baja a proposito.
  const lista = sponsors ?? SPONSORS_RESPALDO;
```

3. En el `map` de la línea ~210, reemplazar las referencias: `item.name` → `item.nombre`, `item.category` → `item.categoria`, `item.logo` sigue igual, y `item.sizeClass` → `CLASES_POR_TAMANO[item.tamano]`. El `alt` de la imagen pasa a ser `item.alt`.

4. Recorrer `lista` en vez de `SPONSORS`.

- [ ] **Step 3: Verificar tipos, pruebas y build**

**[LOCAL]**
```bash
npx tsc --noEmit && npm test && npm run build
```

- [ ] **Step 4: Probar a mano**

Levantar `npm run dev` y abrir `http://localhost:3000`. Esperado: la sección de sponsors se ve igual que antes, con los cinco logos y sus tamaños respectivos.

Después, en `http://localhost:3000/admin`, cambiar el orden de uno y destildarle "Visible en el sitio" a otro. Recargar la home y comprobar que el cambio se refleja.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: los sponsors salen de la base

La home pasa a ser componente de servidor asincrono y baja los sponsors por
props. Si la consulta falla se usa el respaldo hardcodeado, para que una
caida de base no deje la seccion vacia."
```

---

## Task 6: Desplegar y verificar

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
```

El script ya corre las migraciones antes del build y verifica el `BUILD_ID`.

- [ ] **Step 3: Sembrar los sponsors en producción**

**[VPS]**
```bash
cd /var/www/urkupina-system
set -a; . ./.env; set +a
npm run sembrar:sponsors
```

Esperado: cinco `+ ... cargado` y `Sponsors en la base: 5`.

- [ ] **Step 4: Verificar en la base y en el disco**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "SELECT id, nombre, categoria, tamano, orden, activo FROM sponsors ORDER BY orden;"
ls -la /var/www/urkupina-system/public/media/ | head
```

- [ ] **Step 5: Verificar el sitio**

**[VPS]**
```bash
curl -s -o /dev/null -w 'home:  %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
curl -s https://urkupinasa.com/ | grep -c 'Commander Security'
```

Esperado: 200, 200, y al menos una coincidencia del nombre de un sponsor en el HTML.

- [ ] **Step 6: Comprobar que una imagen subida se sirve**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
RUTA=$(PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -tAc "SELECT url FROM media LIMIT 1;")
echo "url en la base: $RUTA"
curl -s -o /dev/null -w 'imagen: %{http_code}\n' "https://urkupinasa.com${RUTA}"
```

Esperado: **200**. Si da 404, el almacenamiento local no está sirviendo los archivos y hay que resolverlo antes de dar la fase por cerrada: sin esto el cliente sube un logo y no se ve.

- [ ] **Step 7: Backup**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

---

## Cierre de la Fase 3a

- [ ] Los cinco sponsors están en la base con su logo.
- [ ] La home los muestra desde la base, con el mismo aspecto que antes.
- [ ] Una imagen subida por el panel se sirve con 200.
- [ ] Dar de baja un sponsor lo saca de la web sin borrar su ficha.
- [ ] Cambiar el orden se refleja en la home.
- [ ] `public/media` está ignorado por git.
- [ ] Las 37 pruebas siguen pasando.

**Prueba manual antes de dar por cerrada la fase:** entrar al panel, crear un sponsor nuevo con un logo cualquiera, verlo aparecer en la home, y después borrarlo. Es el recorrido exacto que va a hacer el cliente.

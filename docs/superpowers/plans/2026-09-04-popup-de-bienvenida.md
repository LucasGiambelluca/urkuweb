# Popup de bienvenida — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el cliente prenda, apague y cambie desde el panel un popup promocional que aparece al abrir la home.

**Architecture:** Una ficha `popup` con interruptor, imagen y enlace opcional. `app/(frontend)/page.tsx` la consulta junto con las demás y monta un componente cliente que dibuja el modal. El componente se renderiza en el HTML del servidor para que no aparezca de golpe, y un `<noscript>` lo oculta cuando no hay JavaScript, para que el visitante nunca quede con un overlay que no puede cerrar.

**Tech Stack:** Payload 3.88 (global + campo `upload`), Next 16, `next/image`, lucide-react (ya instalado).

**Referencia:** `docs/superpowers/specs/2026-09-04-popup-de-bienvenida-design.md`

---

## Convenciones

- **[LOCAL]** en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`, con el túnel SSH abierto (`ssh -N -L 5433:127.0.0.1:5432 root@2.25.115.107`) y `npm run dev` corriendo.
- **[VPS]** por SSH contra `root@2.25.115.107`.
- Código y comentarios en español, sin tildes dentro del código. **Los textos que ve el visitante sí llevan tildes.**
- Ningún paso avanza si la verificación no da lo esperado.
- Punto de partida: **71 pruebas pasando**.

---

## Estado de partida verificado

- Las fichas existentes (`Numeros`, `Servicios`, `Contacto`, `Home`) comparten el mismo molde: `label`, `admin.group: 'Contenido del sitio'`, `access` con lectura pública y `update: soloAutenticado`, y `hooks.afterChange` llamando `purgarCacheDeLaHome()`.
- `collections/Sponsors.ts` ya usa `type: 'upload', relationTo: 'media'` para el logo. Es el molde del campo de imagen.
- `scripts/sembrar-sponsors.ts` ya sube archivos a Media con `payload.create({ collection: 'media', filePath })`. Es el molde de la siembra.
- `public/images/` está rastreado por git (`public/media/` no lo está). La imagen semilla va en `public/images/`.
- `app/(frontend)/page.tsx` consulta seis fichas en paralelo con `Promise.all`, cada una con su try/catch y su respaldo.
- El JPEG del cliente está en `C:\Users\Lucas\Desktop\URKUWeb\WhatsApp Image 2026-09-03 at 11.36.09 AM.jpeg` (1206×788).

---

## Task 1: El tipo y la decisión de mostrarlo

Una función pura decide si hay popup que mostrar. Va primero porque no depende de la ficha ni de los tipos generados, así que se puede probar sin tocar la base.

**Files:**
- Create: `lib/contenido/popup.ts`
- Test: `lib/contenido/popup.test.ts`

- [ ] **Step 1: Escribir las pruebas**

Crear `lib/contenido/popup.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { aPopupVisible, esEnlaceExterno, type FichaDePopup } from './popup';

const imagen = {
  url: '/media/expourku.jpg',
  alt: 'Banner de EXPOURKU',
  width: 1206,
  height: 788,
};

const ficha = (parcial: Partial<FichaDePopup> = {}): FichaDePopup => ({
  activo: true,
  imagen,
  ...parcial,
});

describe('esEnlaceExterno', () => {
  it('reconoce una direccion completa', () => {
    expect(esEnlaceExterno('https://instagram.com/urkupina.s.a')).toBe(true);
  });

  it('acepta http ademas de https', () => {
    expect(esEnlaceExterno('http://ejemplo.com')).toBe(true);
  });

  it('no toma por externa un ancla del sitio', () => {
    expect(esEnlaceExterno('#contacto')).toBe(false);
  });

  it('no toma por externa una ruta del sitio', () => {
    expect(esEnlaceExterno('/novedades')).toBe(false);
  });
});

describe('aPopupVisible', () => {
  it('devuelve los datos cuando esta prendido y hay imagen', () => {
    expect(aPopupVisible(ficha())).toEqual({
      imagen: '/media/expourku.jpg',
      alt: 'Banner de EXPOURKU',
      ancho: 1206,
      alto: 788,
      enlace: undefined,
    });
  });

  it('no muestra nada con el interruptor apagado', () => {
    expect(aPopupVisible(ficha({ activo: false }))).toBeNull();
  });

  it('no muestra nada si nunca se cargo una imagen', () => {
    expect(aPopupVisible(ficha({ imagen: null }))).toBeNull();
  });

  it('no muestra nada si la relacion vino sin poblar', () => {
    expect(aPopupVisible(ficha({ imagen: 7 }))).toBeNull();
  });

  it('no muestra nada si la imagen no tiene url', () => {
    expect(aPopupVisible(ficha({ imagen: { ...imagen, url: null } }))).toBeNull();
  });

  it('no muestra nada si falta el tamano, porque next/image lo necesita', () => {
    expect(aPopupVisible(ficha({ imagen: { ...imagen, width: null } }))).toBeNull();
  });

  it('no muestra nada si la ficha no existe', () => {
    expect(aPopupVisible(null)).toBeNull();
  });

  it('pasa el enlace cuando esta cargado', () => {
    expect(aPopupVisible(ficha({ enlace: '#contacto' }))?.enlace).toBe('#contacto');
  });

  it('trata un enlace en blanco como si no hubiera', () => {
    expect(aPopupVisible(ficha({ enlace: '   ' }))?.enlace).toBeUndefined();
  });
});
```

- [ ] **Step 2: Verificar que falla**

**[LOCAL]**
```bash
npm test
```

Esperado: falla con `Cannot find module './popup'`.

- [ ] **Step 3: Escribir el modulo**

Crear `lib/contenido/popup.ts`:

```ts
/**
 * Forma de la ficha tal como la necesita el popup. Se define aca en vez de
 * importar el tipo generado por Payload para que esta pieza se pueda probar
 * sin depender de que los tipos esten regenerados.
 */
export type FichaDePopup = {
  activo?: boolean | null;
  imagen?:
    | number
    | string
    | {
        url?: string | null;
        alt?: string | null;
        width?: number | null;
        height?: number | null;
      }
    | null;
  enlace?: string | null;
};

/** Lo que necesita el componente para dibujar el modal. */
export type PopupVisible = {
  imagen: string;
  alt: string;
  ancho: number;
  alto: number;
  enlace?: string;
};

/**
 * Un enlace que sale del sitio se abre en pestana nueva; un ancla o una ruta
 * propia, en la misma. Se decide por el protocolo y no por otra cosa: es lo
 * unico que distingue de forma confiable un destino externo.
 */
export const esEnlaceExterno = (enlace: string): boolean => /^https?:\/\//i.test(enlace);

/**
 * Decide si hay popup que mostrar y arma sus datos.
 *
 * Devuelve null en vez de un objeto a medias: prendido pero sin imagen no es
 * un error que haya que avisar, es simplemente que todavia no hay nada que
 * mostrar. Un recuadro vacio se ve peor que ningun popup.
 */
export const aPopupVisible = (ficha: FichaDePopup | null | undefined): PopupVisible | null => {
  if (!ficha?.activo) return null;

  const { imagen } = ficha;
  // Si la consulta no pidio depth, la relacion llega como id y no hay nada
  // que dibujar.
  if (typeof imagen !== 'object' || imagen === null) return null;
  // next/image necesita el tamano para reservar el espacio y no mover la
  // pagina cuando termina de cargar.
  if (!imagen.url || !imagen.width || !imagen.height) return null;

  const enlace = ficha.enlace?.trim();

  return {
    imagen: imagen.url,
    alt: imagen.alt ?? '',
    ancho: imagen.width,
    alto: imagen.height,
    enlace: enlace ? enlace : undefined,
  };
};
```

- [ ] **Step 4: Verificar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit
```

Esperado: **84 pruebas pasando**, tsc sin errores.

- [ ] **Step 5: Commit**

```bash
git add lib/contenido/popup.ts lib/contenido/popup.test.ts
git commit -m "feat: decidir cuando se muestra el popup

Funcion pura: prendido y con imagen poblada, o nada. Prendido sin imagen no
es un error que haya que avisar, es que todavia no hay nada que mostrar."
```

---

## Task 2: La ficha del panel

**Files:**
- Create: `globals/Popup.ts`
- Modify: `payload.config.ts`
- Modify: `scripts/inicializar-fichas.ts`

- [ ] **Step 1: Crear la ficha**

Crear `globals/Popup.ts`:

```ts
import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Popup: GlobalConfig = {
  slug: 'popup',
  label: 'Popup de bienvenida',
  admin: {
    group: 'Contenido del sitio',
    description: 'El aviso que aparece al entrar al sitio. Se muestra cada vez que alguien abre la portada.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mostrar el popup al entrar al sitio',
      admin: {
        description: 'Apagado, el popup no aparece aunque haya una imagen cargada.',
      },
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen del popup',
      admin: {
        description:
          'Se muestra entera, sin recortar. El texto que leen los lectores de pantalla sale del campo de texto alternativo de la imagen.',
      },
    },
    {
      name: 'enlace',
      type: 'text',
      label: 'A donde lleva la imagen',
      admin: {
        description:
          'Opcional. Una seccion del sitio (#contacto) o una direccion completa (https://...). Si queda vacio, la imagen no se puede clickear.',
      },
    },
  ],
};
```

- [ ] **Step 2: Registrarla**

En `payload.config.ts`, agregar el import junto a los otros globals:

```ts
import { Popup } from './globals/Popup';
```

y sumarla a la lista:

```ts
  globals: [Numeros, Servicios, Contacto, Home, Popup],
```

En `scripts/inicializar-fichas.ts`, cambiar la lista:

```ts
const FICHAS = ['numeros', 'servicios', 'contacto', 'home', 'popup'] as const;
```

- [ ] **Step 3: Generar tipos y migración**

**[LOCAL]**
```bash
npx payload generate:types
npx payload migrate:create popup
```

- [ ] **Step 4: Validar la migración sobre base limpia**

La base de desarrollo aplica el esquema por empuje automático, así que si no se valida aparte, producción sería el primer lugar donde la migración corre de verdad. Es el mismo procedimiento de las fases anteriores.

**[LOCAL]**
```bash
PASS=$(ssh -o BatchMode=yes root@2.25.115.107 'source /root/.urkupina-db-credentials; echo "$urkupina_db_password"')
ssh -o BatchMode=yes root@2.25.115.107 'sudo -u postgres psql -q -c "DROP DATABASE IF EXISTS urkupina_migtest;" -c "CREATE DATABASE urkupina_migtest OWNER urkupina;"'
DATABASE_URL="postgresql://urkupina:${PASS}@127.0.0.1:5433/urkupina_migtest" npx payload migrate
ssh -o BatchMode=yes root@2.25.115.107 'sudo -u postgres psql -q -c "DROP DATABASE urkupina_migtest;"'
```

Esperado: todas las migraciones aplican sin errores.

- [ ] **Step 5: Inicializar la ficha en desarrollo**

**[LOCAL]**
```bash
npm run inicializar:fichas
```

Esperado: `+ popup: inicializada con los valores por defecto` y las otras cuatro salteadas.

- [ ] **Step 6: Verificar que aparece en el panel**

**[LOCAL]** Abrir `http://localhost:3000/admin`. En la barra, bajo "Contenido del sitio", tiene que estar **"Popup de bienvenida"** con los tres campos y el interruptor apagado.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: ficha del popup de bienvenida

Interruptor, imagen y enlace opcional. Arranca apagada: el popup no aparece
hasta que alguien lo prenda a proposito."
```

---

## Task 3: El componente del modal

**Files:**
- Create: `components/home/PopupBienvenida.tsx`

- [ ] **Step 1: Escribir el componente**

Crear `components/home/PopupBienvenida.tsx`:

```tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { esEnlaceExterno, type PopupVisible } from '@/lib/contenido/popup';

/** Lo que el atrapador de foco considera alcanzable con Tab. */
const ALCANZABLES = 'a[href], button:not([disabled])';

/**
 * El aviso que aparece al abrir la portada.
 *
 * Arranca abierto y se renderiza tambien en el servidor, para que no aparezca
 * de golpe una vez que la pagina ya se veia. El costo de eso es que sin
 * JavaScript el boton de cerrar no responde, asi que un <noscript> lo oculta:
 * quien no tenga JavaScript se pierde una promocion, no el sitio.
 */
export default function PopupBienvenida({ popup }: { popup: PopupVisible }) {
  const [abierto, setAbierto] = useState(true);
  const dialogoRef = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const focoPrevio = useRef<HTMLElement | null>(null);

  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    if (!abierto) return;

    focoPrevio.current = document.activeElement as HTMLElement | null;
    cerrarRef.current?.focus();

    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        cerrar();
        return;
      }
      if (evento.key !== 'Tab' || !dialogoRef.current) return;

      // Atrapa el foco: mientras el modal esta abierto, Tab no se escapa a la
      // pagina de atras, que para el visitante esta tapada.
      const focos = [...dialogoRef.current.querySelectorAll<HTMLElement>(ALCANZABLES)];
      if (focos.length === 0) return;

      const primero = focos[0];
      const ultimo = focos[focos.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', alTeclear);
    const desbordeOriginal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = desbordeOriginal;
      focoPrevio.current?.focus?.();
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  const imagen = (
    <Image
      src={popup.imagen}
      alt={popup.alt}
      width={popup.ancho}
      height={popup.alto}
      sizes="(max-width: 960px) 92vw, 900px"
      priority
      className="h-auto w-full rounded-2xl"
    />
  );

  const externo = popup.enlace ? esEnlaceExterno(popup.enlace) : false;

  return (
    <>
      {/* Sin JavaScript el boton de cerrar no responde: mejor no mostrarlo. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: '<style>#popup-bienvenida{display:none!important}</style>',
        }}
      />

      <div
        id="popup-bienvenida"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={cerrar}
      >
        <div
          ref={dialogoRef}
          role="dialog"
          aria-modal="true"
          aria-label="Aviso"
          // El click en la imagen no tiene que cerrar el modal; el del fondo si.
          onClick={(evento) => evento.stopPropagation()}
          className="relative w-full max-w-[900px]"
        >
          {popup.enlace ? (
            <a
              href={popup.enlace}
              target={externo ? '_blank' : undefined}
              rel={externo ? 'noopener noreferrer' : undefined}
              // Un ancla del sitio navega por debajo del modal: si no se
              // cierra, el visitante no ve a donde lo llevo.
              onClick={externo ? undefined : cerrar}
              className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
            >
              {imagen}
            </a>
          ) : (
            imagen
          )}

          <button
            ref={cerrarRef}
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#0E1626] text-white shadow-xl transition hover:bg-[#EB2347] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verificar que compila**

**[LOCAL]**
```bash
npx tsc --noEmit && npx eslint components/home/PopupBienvenida.tsx
```

Esperado: sin errores en ninguno de los dos.

- [ ] **Step 3: Commit**

```bash
git add components/home/PopupBienvenida.tsx
git commit -m "feat: modal del popup de bienvenida

Cierra con el boton, con un click en el fondo y con Escape. Atrapa el foco
mientras esta abierto y lo devuelve al cerrar. Un <noscript> lo oculta si no
hay JavaScript, para no dejar al visitante con un overlay que no puede
cerrar."
```

---

## Task 4: Montarlo en la home

**Files:**
- Modify: `app/(frontend)/page.tsx`

- [ ] **Step 1: Agregar la consulta**

En `app/(frontend)/page.tsx`, sumar el import:

```tsx
import PopupBienvenida from "@/components/home/PopupBienvenida";
import { aPopupVisible, type PopupVisible } from "@/lib/contenido/popup";
```

y la función, junto a las otras `obtener*`:

```tsx
async function obtenerPopup(): Promise<PopupVisible | null> {
  try {
    const payload = await getPayload({ config });
    // depth 1 trae la imagen poblada; sin eso llega solo el id.
    const popup = await payload.findGlobal({ slug: 'popup', depth: 1 });
    return aPopupVisible(popup);
  } catch (error) {
    console.error('[home] no se pudo leer el popup:', error);
    return null;
  }
}
```

- [ ] **Step 2: Sumarla al Promise.all y montar el componente**

Cambiar la desestructuración:

```tsx
  const [sponsors, numeros, precios, contacto, secciones, notas, popup] = await Promise.all([
    obtenerSponsors(),
    obtenerNumeros(),
    obtenerPrecios(),
    obtenerContacto(),
    obtenerSecciones(),
    obtenerNovedades(),
    obtenerPopup(),
  ]);
```

y montar el componente dentro del fragmento, antes de `<Navbar />`:

```tsx
  return (
    <>
      {popup && <PopupBienvenida popup={popup} />}
      <Navbar />
```

Va fuera de `<Secciones>` a propósito: es parte del marco fijo de la página, no una sección que el cliente pueda reordenar o sacar desde el armador.

- [ ] **Step 3: Verificar**

**[LOCAL]**
```bash
npm test && npx tsc --noEmit && npm run build
```

Esperado: 84 pruebas, tsc limpio, build exitoso.

- [ ] **Step 4: Verificar que apagado no cambia nada**

**[LOCAL]**
```bash
curl -s "http://localhost:3000/?qa=$RANDOM" | grep -c 'popup-bienvenida'
```

Esperado: **0**. La ficha arranca apagada, así que la home tiene que verse exactamente como antes.

- [ ] **Step 5: Commit**

```bash
git add "app/(frontend)/page.tsx"
git commit -m "feat: la home monta el popup de bienvenida

Va fuera del armador de secciones: es parte del marco fijo de la pagina. Si
la consulta falla no hay popup y la home carga igual."
```

---

## Task 5: Sembrar el banner de EXPOURKU

**Files:**
- Create: `public/images/popup/expourku.jpg`
- Create: `scripts/sembrar-popup.ts`
- Modify: `package.json`

- [ ] **Step 1: Copiar la imagen del cliente**

El archivo original tiene espacios en el nombre y vive fuera del proyecto.

**[LOCAL]**
```bash
mkdir -p public/images/popup
cp "../WhatsApp Image 2026-09-03 at 11.36.09 AM.jpeg" public/images/popup/expourku.jpg
ls -la public/images/popup/
```

Esperado: `expourku.jpg`, alrededor de 150 KB.

- [ ] **Step 2: Escribir el script de siembra**

Crear `scripts/sembrar-popup.ts`:

```ts
/**
 * Sube el banner de EXPOURKU a Media y lo deja asignado a la ficha del popup.
 *
 * Deja el popup APAGADO: la imagen queda lista y el cliente decide cuando
 * mostrarla. Sembrar algo que aparece solo en la cara del visitante seria
 * tomar por el una decision que no es nuestra.
 *
 * Es idempotente: si la ficha ya tiene una imagen, no la pisa.
 *
 * Uso: npm run sembrar:popup
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';
import config from '../payload.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const raizDelProyecto = path.resolve(dirname, '..');

const ARCHIVO = path.join(raizDelProyecto, 'public', 'images', 'popup', 'expourku.jpg');
const ALT = 'EXPOURKU en el Paseo de Compras Rene Gonzalo Rojas Paz. Vivi la experiencia.';

const sembrar = async () => {
  const payload = await getPayload({ config });

  const actual = await payload.findGlobal({ slug: 'popup', overrideAccess: true });
  if (actual?.imagen) {
    console.log('- popup: ya tiene una imagen cargada, se omite');
    return;
  }

  const imagen = await payload.create({
    collection: 'media',
    data: { alt: ALT },
    filePath: ARCHIVO,
    overrideAccess: true,
  });

  // Si asignar la imagen falla, se borra el archivo recien subido: sin esto
  // queda huerfano en Media y la proxima corrida sube otra copia.
  try {
    await payload.updateGlobal({
      slug: 'popup',
      data: { imagen: imagen.id, activo: false },
      overrideAccess: true,
    });
  } catch (error) {
    await payload.delete({ collection: 'media', id: imagen.id, overrideAccess: true });
    throw error;
  }

  console.log('+ popup: banner de EXPOURKU cargado y asignado, con el popup apagado');
};

// Con await de nivel superior, no con sembrar().catch(). `payload run` termina
// el proceso apenas el modulo deja de evaluarse.
try {
  await sembrar();
} catch (error) {
  console.error('Fallo la siembra del popup:', error);
  process.exit(1);
}

process.exit(0);
```

- [ ] **Step 3: Agregar el comando**

En `package.json`, dentro de `scripts`, después de `sembrar:sponsors`:

```json
    "sembrar:popup": "payload run scripts/sembrar-popup.ts",
```

- [ ] **Step 4: Sembrar y verificar**

**[LOCAL]**
```bash
npm run sembrar:popup
npm run sembrar:popup
```

Esperado: la primera corrida imprime `+ popup: banner de EXPOURKU cargado y asignado, con el popup apagado`; la segunda, `- popup: ya tiene una imagen cargada, se omite`. Eso comprueba la idempotencia.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: sembrar el banner de EXPOURKU en el popup

Deja la imagen cargada y el popup apagado: cuando aparece en la cara del
visitante lo decide el cliente, no la siembra."
```

---

## Task 6: Probarlo en el navegador

- [ ] **Step 1: Prenderlo desde el panel**

**[LOCAL]** En `http://localhost:3000/admin`, entrar a "Popup de bienvenida", marcar **"Mostrar el popup al entrar al sitio"** y guardar.

- [ ] **Step 2: Verificar que aparece**

**[LOCAL]**
```bash
curl -s "http://localhost:3000/?qa=$RANDOM" | grep -c 'popup-bienvenida'
```

Esperado: **1**.

- [ ] **Step 3: Recorrido manual**

Abrir `http://localhost:3000/` y comprobar, una por una:

| Qué | Esperado |
|---|---|
| Al cargar | El banner aparece centrado, entero, sin recortes |
| Botón ✕ | Cierra |
| Click en el fondo oscuro | Cierra |
| Tecla Escape | Cierra |
| Click sobre la imagen (sin enlace) | **No** cierra |
| Tab con el modal abierto | El foco no se va a la página de atrás |
| Al cerrar | El scroll de la página vuelve a funcionar |
| Recargar | Vuelve a aparecer (se muestra en cada carga, es lo pedido) |

- [ ] **Step 4: Probar el enlace**

En el panel, cargar `#contacto` en "A donde lleva la imagen" y guardar. Recargar la home, hacer click en la imagen: tiene que cerrar el popup y bajar hasta el formulario de contacto.

Después cambiarlo por `https://www.instagram.com/urkupina.s.a/` y comprobar que abre en una pestaña nueva y **no** cierra el popup.

Por último, vaciar el campo y guardar: la imagen vuelve a no ser clickeable.

- [ ] **Step 5: Probar en celular**

En el panel, en "Armado de la home", usar la vista previa en **Celular (390×844)** con el popup prendido. El banner tiene que entrar sin scroll horizontal y el botón de cerrar tiene que quedar dentro de la pantalla.

- [ ] **Step 6: Apagarlo antes de seguir**

Volver a "Popup de bienvenida", desmarcar el interruptor y guardar. Se despliega apagado; lo prende el cliente cuando la campaña esté lista.

---

## Task 7: Desplegar

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

- [ ] **Step 3: Migrar, inicializar y sembrar**

**[VPS]**
```bash
cd /var/www/urkupina-system
export NODE_ENV=production
set -a; . ./.env; set +a
npx payload migrate
npm run inicializar:fichas
npm run sembrar:popup
npm run build && pm2 reload urkupina --update-env
```

El rebuild es necesario porque la home es estática y se genera antes de que la ficha tenga datos. Es la misma secuencia de las fases 3a, 3b y 5.

- [ ] **Step 4: Verificar**

**[VPS]**
```bash
curl -s -o /dev/null -w 'home:  %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
echo "popup en el html (debe ser 0, se despliega apagado): $(curl -s https://urkupinasa.com/ | grep -c popup-bienvenida)"
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -tAc "SELECT count(*) FROM popup;"
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -tAc "SELECT count(*) FROM payload_migrations WHERE name='dev';"
```

Esperado: 200 en las dos rutas, **0** apariciones del popup (se despliega apagado), **1** fila en `popup`, y **0** migraciones `dev`.

- [ ] **Step 5: Backup**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

---

## Cierre

- [ ] El cliente prende y apaga el popup desde el panel.
- [ ] El cliente cambia la imagen desde el panel.
- [ ] El enlace es opcional: vacío, la imagen no se clickea.
- [ ] Cierra con el botón, con el fondo y con Escape.
- [ ] El foco queda atrapado mientras está abierto y vuelve a su lugar al cerrar.
- [ ] Sin JavaScript no hay popup, y el sitio sigue usable.
- [ ] Prendido sin imagen no muestra un recuadro vacío.
- [ ] Una caída de base no deja la home sin cargar.
- [ ] Las pruebas pasan.

**Prueba manual antes de dar la tarea por cerrada:** desde el panel, subir una imagen distinta a la de EXPOURKU, prender el popup, mirar la web, y volver a dejarlo apagado. Es el recorrido que va a hacer el cliente cuando cambie de campaña.

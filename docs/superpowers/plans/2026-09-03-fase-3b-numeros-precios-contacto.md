# Fase 3b — Números, precios y datos de contacto

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que los números del predio, los precios de internet y estacionamiento, y los datos de contacto se editen desde el panel, en un solo lugar cada uno.

**Architecture:** Tres fichas únicas de Payload (globals). `app/page.tsx` las consulta junto con los sponsors en una sola tanda paralela y las baja por props. Cada componente conserva sus valores actuales como respaldo, así una caída de base nunca deja la home rota ni sin datos de contacto.

**Tech Stack:** Payload 3.88, PostgreSQL 17, Next 16.

**Referencia:** `docs/superpowers/specs/2026-09-03-panel-admin-urkupina-design.md`, secciones 4.2 y 4.4.

---

## Estado de partida verificado

**Números repetidos en cuatro componentes renderizados** (`AdvertisingSection` también los tiene, pero no se renderiza en la home, así que queda afuera):

| Componente | Qué dice |
|---|---|
| `HeroStats.tsx:9-25` | 2.200+ puestos, 5.000+ personas diarias, **30+** años, 365 días |
| `ImpactGrid.tsx:9-21` | 2.200+ puestos, 5.000+ empleos, **25+** años |
| `VisitSection.tsx:13` | "Más de 2.200 locales de fabricantes textiles directos." |
| `CommerceSection.tsx:161` | "Más de 2.200 locales clasificados" |

**La web se contradice:** `HeroStats` anuncia 30+ años de trayectoria y `ImpactGrid` dice 25+. Además "5.000+" figura como *personas diarias* en uno y como *empleos* en otro. Son datos distintos con el mismo número; puede ser correcto, pero conviene que el cliente lo confirme.

**Precios en `ServicesHubSection.tsx`** — son de dos servicios distintos, no todos de internet:

| Línea | Qué es | Valor |
|---|---|---|
| 388 | Estacionamiento, "Estadía Completa" | $10.000 ARS |
| 490 | Internet, acceso por 1 día | $1.000 ARS |
| 502 | Internet, acceso por 1 mes | $10.000 ARS |
| 601 | Internet, repetido en el modal | $1.000 ARS |
| 605 | Internet, repetido en el modal | $10.000 ARS |

**Datos de contacto repetidos en tres componentes:**

- Dirección: `René Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina` (`ContactSection.tsx:298`)
- Mail: `contacto.urku@gmail.com` (`ContactSection.tsx:311`, `SiteFooter.tsx:305`)
- WhatsApp: `541124240338`, mostrado como `+54 11 2424-0338`, con mensaje predefinido (`ContactSection.tsx:330`, `SiteFooter.tsx:295`, `FloatingWhatsApp.tsx:9`)
- Horario: `Lunes, miércoles y sábado de 7:00 a 14:00 hs.` (`ContactSection.tsx:354`)
- Redes: Instagram `urkupina.s.a`, Facebook `urkupinaSA`, YouTube `@ULIVE_STREAM` (`ContactSection.tsx:369-389`, `SiteFooter.tsx:163-183`)

`FloatingWhatsApp` es hijo de `SiteFooter`, así que recibe el dato por props desde ahí.

## Convenciones

- **[LOCAL]** en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`, con el túnel SSH abierto.
- **[VPS]** por SSH contra `root@2.25.115.107`.
- Código y comentarios en español, sin tildes dentro del código.
- Ningún paso avanza si la verificación no da lo esperado.

---

## Task 1: Las tres fichas

**Files:**
- Create: `globals/Numeros.ts`, `globals/Servicios.ts`, `globals/Contacto.ts`
- Create: `globals/revalidar.ts`
- Modify: `payload.config.ts`

- [ ] **Step 1: Función compartida de revalidación**

Crear `globals/revalidar.ts`:

```ts
import { revalidatePath } from 'next/cache';

/**
 * revalidatePath solo funciona dentro del contexto de una peticion de Next.
 * Guardar desde el panel lo tiene; un script de linea de comandos o una
 * migracion, no, y ahi tira "static generation store missing".
 */
export const purgarCacheDeLaHome = () => {
  try {
    revalidatePath('/');
  } catch {
    // Fuera de una peticion no hay cache que purgar: no es un error.
  }
};
```

- [ ] **Step 2: Ficha de números**

Crear `globals/Numeros.ts`:

```ts
import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Numeros: GlobalConfig = {
  slug: 'numeros',
  label: 'Numeros del predio',
  admin: {
    group: 'Contenido del sitio',
    description: 'Las cifras que se repiten a lo largo de la home.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'puestos',
      type: 'text',
      required: true,
      defaultValue: '2.200+',
      label: 'Puestos activos',
      admin: { description: 'Se escribe tal cual se muestra, con el signo mas si corresponde.' },
    },
    {
      name: 'personasDiarias',
      type: 'text',
      required: true,
      defaultValue: '5.000+',
      label: 'Personas por dia',
    },
    {
      name: 'empleos',
      type: 'text',
      required: true,
      defaultValue: '5.000+',
      label: 'Empleos generados',
    },
    {
      name: 'aniosTrayectoria',
      type: 'text',
      required: true,
      defaultValue: '30+',
      label: 'Anios de trayectoria',
      admin: {
        description:
          'A confirmar con el cliente: hasta ahora la web decia 30+ arriba y 25+ mas abajo.',
      },
    },
    {
      name: 'diasActividad',
      type: 'text',
      required: true,
      defaultValue: '365',
      label: 'Dias de actividad al anio',
    },
  ],
};
```

- [ ] **Step 3: Ficha de servicios y precios**

Crear `globals/Servicios.ts`:

```ts
import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Servicios: GlobalConfig = {
  slug: 'servicios',
  label: 'Precios de servicios',
  admin: {
    group: 'Contenido del sitio',
    description: 'Tarifas de internet y estacionamiento.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'internet',
      type: 'group',
      label: 'Vouchers de internet',
      fields: [
        {
          name: 'diario',
          type: 'group',
          label: 'Voucher diario',
          fields: [
            { name: 'precio', type: 'text', required: true, defaultValue: '$1.000', label: 'Precio' },
            { name: 'moneda', type: 'text', required: true, defaultValue: 'ARS', label: 'Moneda' },
            {
              name: 'detalle',
              type: 'text',
              required: true,
              defaultValue: 'Valido por 24 horas para 1 dispositivo.',
              label: 'Detalle',
            },
          ],
        },
        {
          name: 'mensual',
          type: 'group',
          label: 'Voucher mensual',
          fields: [
            { name: 'precio', type: 'text', required: true, defaultValue: '$10.000', label: 'Precio' },
            { name: 'moneda', type: 'text', required: true, defaultValue: 'ARS', label: 'Moneda' },
            {
              name: 'detalle',
              type: 'text',
              required: true,
              defaultValue: '30 dias corridos para locatarios y personal.',
              label: 'Detalle',
            },
          ],
        },
      ],
    },
    {
      name: 'estacionamiento',
      type: 'group',
      label: 'Estacionamiento',
      fields: [
        { name: 'precio', type: 'text', required: true, defaultValue: '$10.000', label: 'Precio' },
        { name: 'moneda', type: 'text', required: true, defaultValue: 'ARS', label: 'Moneda' },
        {
          name: 'titulo',
          type: 'text',
          required: true,
          defaultValue: 'Estadia Completa',
          label: 'Nombre de la tarifa',
        },
      ],
    },
  ],
};
```

- [ ] **Step 4: Ficha de contacto**

Crear `globals/Contacto.ts`:

```ts
import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Contacto: GlobalConfig = {
  slug: 'contacto',
  label: 'Contacto y redes',
  admin: {
    group: 'Contenido del sitio',
    description: 'Datos que aparecen en la seccion de contacto, el pie y el boton flotante.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'direccion',
      type: 'textarea',
      required: true,
      defaultValue:
        'Rene Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina',
      label: 'Direccion del predio',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      defaultValue: 'contacto.urku@gmail.com',
      label: 'Correo de contacto',
    },
    {
      name: 'horarios',
      type: 'text',
      required: true,
      defaultValue: 'Lunes, miercoles y sabado de 7:00 a 14:00 hs.',
      label: 'Horario de atencion',
    },
    {
      name: 'whatsapp',
      type: 'group',
      label: 'WhatsApp',
      fields: [
        {
          name: 'numero',
          type: 'text',
          required: true,
          defaultValue: '541124240338',
          label: 'Numero, solo digitos',
          admin: { description: 'Con codigo de pais y sin espacios ni signos. Es el que usa el enlace.' },
        },
        {
          name: 'visible',
          type: 'text',
          required: true,
          defaultValue: '+54 11 2424-0338',
          label: 'Como se muestra',
        },
        {
          name: 'mensaje',
          type: 'text',
          required: true,
          defaultValue: 'Hola Feria Urkupina, quisiera realizar una consulta.',
          label: 'Mensaje predefinido',
          admin: { description: 'Es el texto que aparece ya escrito cuando alguien abre el chat.' },
        },
      ],
    },
    {
      name: 'redes',
      type: 'group',
      label: 'Redes sociales',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          defaultValue: 'https://www.instagram.com/urkupina.s.a/?hl=es',
          label: 'Instagram',
        },
        {
          name: 'facebook',
          type: 'text',
          defaultValue: 'https://www.facebook.com/urkupinaSA/?locale=es_LA',
          label: 'Facebook',
        },
        {
          name: 'youtube',
          type: 'text',
          defaultValue: 'https://youtube.com/@ULIVE_STREAM',
          label: 'YouTube',
        },
      ],
    },
  ],
};
```

- [ ] **Step 5: Registrar las fichas**

En `payload.config.ts`, importarlas y agregar junto a `collections`:

```ts
  globals: [Numeros, Servicios, Contacto],
```

- [ ] **Step 6: Verificar**

**[LOCAL]**
```bash
npx tsc --noEmit && npm test
```

Esperado: sin errores y 37 pruebas pasando.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: fichas de numeros, precios y contacto

Tres globals de Payload con los valores actuales del sitio como valores por
defecto. Lectura publica, escritura con sesion, y revalidacion de la home al
guardar."
```

---

## Task 2: Migración

- [ ] **Step 1: Generar y aplicar**

**[LOCAL]**
```bash
npx payload migrate:create globales
npx payload migrate
npx payload migrate:status
```

- [ ] **Step 2: Verificar las tablas**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_dev -c "\dt" | grep -E "numeros|servicios|contacto"
```

Esperado: las tres tablas.

- [ ] **Step 3: Script de inicialización**

Una ficha recién creada no tiene fila en la base hasta que se guarda por primera vez. Este script la escribe con los valores por defecto, para no depender de que alguien entre al panel y apriete Guardar tres veces.

Crear `scripts/inicializar-fichas.ts`:

```ts
/**
 * Escribe las tres fichas con sus valores por defecto.
 *
 * Una ficha de Payload no tiene fila en la base hasta que se guarda por
 * primera vez. Sin esto, la home consulta fichas vacias y cae al respaldo.
 *
 * Es idempotente: si la ficha ya tiene datos, no la pisa.
 *
 * Uso: npm run inicializar:fichas
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const FICHAS = ['numeros', 'servicios', 'contacto'] as const;

const inicializar = async () => {
  const payload = await getPayload({ config });

  for (const slug of FICHAS) {
    const actual = await payload.findGlobal({ slug, overrideAccess: true });

    // updatedAt solo existe si la ficha ya se guardo alguna vez.
    if (actual && 'updatedAt' in actual && actual.updatedAt) {
      console.log(`- ${slug}: ya tiene datos, se omite`);
      continue;
    }

    await payload.updateGlobal({ slug, data: {}, overrideAccess: true });
    console.log(`+ ${slug}: inicializada con los valores por defecto`);
  }
};

try {
  await inicializar();
} catch (error) {
  console.error('Fallo la inicializacion:', error);
  process.exit(1);
}

process.exit(0);
```

Se usa `await` de nivel superior y no `inicializar().catch()`: `payload run` termina el proceso apenas el módulo deja de evaluarse, y con la otra forma la promesa queda pendiente y el script sale con éxito sin haber hecho nada. Ya nos pasó con la siembra de sponsors.

Agregar a `scripts` en `package.json`:

```json
    "inicializar:fichas": "payload run scripts/inicializar-fichas.ts",
```

- [ ] **Step 4: Correr en desarrollo y verificar idempotencia**

**[LOCAL]**
```bash
npm run inicializar:fichas
npm run inicializar:fichas
```

Esperado: la primera corrida imprime tres `+ ... inicializada`; la segunda, tres `- ... ya tiene datos, se omite`.

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_dev -c "SELECT puestos, anios_trayectoria FROM numeros;"
```

Esperado: una fila con `2.200+` y `30+`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: migracion e inicializacion de las fichas de contenido"
```

---

## Task 3: Los números en la home

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/home/HeroStats.tsx`, `ImpactGrid.tsx`, `VisitSection.tsx`, `CommerceSection.tsx`
- Create: `lib/contenido/tipos.ts`

- [ ] **Step 1: Tipos compartidos**

Crear `lib/contenido/tipos.ts`:

```ts
export type NumerosDelPredio = {
  puestos: string;
  personasDiarias: string;
  empleos: string;
  aniosTrayectoria: string;
  diasActividad: string;
};

/**
 * Valores de respaldo: son los que estaban escritos en los componentes antes
 * de que salieran de la base. Se usan solo si la consulta falla, para que una
 * caida de base no deje la home sin numeros.
 */
export const NUMEROS_RESPALDO: NumerosDelPredio = {
  puestos: '2.200+',
  personasDiarias: '5.000+',
  empleos: '5.000+',
  aniosTrayectoria: '30+',
  diasActividad: '365',
};
```

- [ ] **Step 2: Consultar la ficha en la home**

En `app/page.tsx`, agregar junto a `obtenerSponsors`:

```tsx
async function obtenerNumeros(): Promise<NumerosDelPredio | null> {
  try {
    const payload = await getPayload({ config });
    const numeros = await payload.findGlobal({ slug: 'numeros' });
    return {
      puestos: numeros.puestos,
      personasDiarias: numeros.personasDiarias,
      empleos: numeros.empleos,
      aniosTrayectoria: numeros.aniosTrayectoria,
      diasActividad: numeros.diasActividad,
    };
  } catch (error) {
    console.error('[home] no se pudieron leer los numeros:', error);
    return null;
  }
}
```

Y en el componente, resolver las dos consultas en paralelo:

```tsx
export default async function Home() {
  const [sponsors, numeros] = await Promise.all([obtenerSponsors(), obtenerNumeros()]);
  const cifras = numeros ?? NUMEROS_RESPALDO;
```

Se usa `Promise.all` para que el tiempo de carga lo marque la consulta más lenta y no la suma de todas.

Pasar `numeros={cifras}` a `HeroStats`, `ImpactGrid`, `VisitSection` y `CommerceSection`.

- [ ] **Step 3: HeroStats**

Cambiar la firma a `export default function HeroStats({ numeros }: { numeros: NumerosDelPredio })` y en `STATS_DATA` reemplazar los `value` fijos por los del objeto: `numeros.puestos`, `numeros.personasDiarias`, `numeros.aniosTrayectoria`, `numeros.diasActividad`. Como `STATS_DATA` es una constante de módulo, hay que moverla adentro del componente o convertirla en función que reciba los números. Los `icon` y `label` quedan en el código.

- [ ] **Step 4: ImpactGrid**

Igual que el anterior: `number` de los tres items pasa a ser `numeros.puestos`, `numeros.empleos` y `numeros.aniosTrayectoria`. Los `title`, `description` e `image` quedan en el código.

Ojo: acá está la mitad de la contradicción. Al tomar `aniosTrayectoria` de la ficha, los dos bloques van a mostrar el mismo valor, que es el objetivo.

- [ ] **Step 5: VisitSection y CommerceSection**

En `VisitSection.tsx:13` el texto `"Más de 2.200 locales de fabricantes textiles directos."` pasa a construirse con el número: `` `Más de ${numeros.puestos} locales de fabricantes textiles directos.` ``. Como `numeros.puestos` trae el `+` incluido, quitar el "+" duplicado si queda raro: el valor por defecto es `2.200+`, así que el texto diría "Más de 2.200+ locales". **Usar el número sin el signo**: agregar en `lib/contenido/tipos.ts` una función auxiliar

```ts
/** Quita el "+" final, para textos que ya dicen "Mas de ...". */
export const sinMas = (valor: string): string => valor.replace(/\+$/, '');
```

y usar `sinMas(numeros.puestos)` en los dos textos.

En `CommerceSection.tsx:161`, lo mismo con `"Más de 2.200 locales clasificados"`.

- [ ] **Step 6: Verificar**

**[LOCAL]**
```bash
npx tsc --noEmit && npm test && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: los numeros del predio salen de la ficha

Cuatro componentes dejan de repetir las mismas cifras. De paso se resuelve
la contradiccion: la home decia 30+ anios arriba y 25+ mas abajo."
```

---

## Task 4: Los precios en ServicesHubSection

**Files:**
- Modify: `app/page.tsx`, `components/home/ServicesHubSection.tsx`, `lib/contenido/tipos.ts`

- [ ] **Step 1: Tipos y respaldo**

Agregar a `lib/contenido/tipos.ts`:

```ts
export type PrecioSimple = { precio: string; moneda: string };

export type PreciosDeServicios = {
  internet: {
    diario: PrecioSimple & { detalle: string };
    mensual: PrecioSimple & { detalle: string };
  };
  estacionamiento: PrecioSimple & { titulo: string };
};

export const PRECIOS_RESPALDO: PreciosDeServicios = {
  internet: {
    diario: { precio: '$1.000', moneda: 'ARS', detalle: 'Valido por 24 horas para 1 dispositivo.' },
    mensual: { precio: '$10.000', moneda: 'ARS', detalle: '30 dias corridos para locatarios y personal.' },
  },
  estacionamiento: { precio: '$10.000', moneda: 'ARS', titulo: 'Estadia Completa' },
};
```

- [ ] **Step 2: Consultar y pasar por props**

En `app/page.tsx`, agregar `obtenerPrecios()` con el mismo patrón (try/catch, `findGlobal({ slug: 'servicios' })`), sumarla al `Promise.all`, y pasar `precios={precios ?? PRECIOS_RESPALDO}` a `ServicesHubSection`.

- [ ] **Step 3: Reemplazar los cinco valores**

En `ServicesHubSection.tsx`, cambiar la firma para recibir `precios` y reemplazar:

| Línea aprox. | Antes | Después |
|---|---|---|
| 385 | `Estadía Completa` | `{precios.estacionamiento.titulo}` |
| 388 | `$10.000` | `{precios.estacionamiento.precio}` |
| 389 | `ARS` | `{precios.estacionamiento.moneda}` |
| 490 | `$1.000` + `ARS` | `{precios.internet.diario.precio}` y `.moneda` |
| 493 | `Válido por 24 horas para 1 dispositivo.` | `{precios.internet.diario.detalle}` |
| 502 | `$10.000` + `ARS` | `{precios.internet.mensual.precio}` y `.moneda` |
| 505 | `30 días corridos para locatarios y personal.` | `{precios.internet.mensual.detalle}` |
| 601 | `Voucher Diario - $1.000 ARS` | usar los valores de `diario` |
| 605 | `Voucher Mensual - $10.000 ARS` | usar los valores de `mensual` |

Buscar en todo el archivo `$1.000` y `$10.000` y confirmar que no quede ninguno hardcodeado. Reportar cuántos se reemplazaron.

- [ ] **Step 4: Verificar**

**[LOCAL]**
```bash
npx tsc --noEmit && npm test && npm run build
grep -c '\$1\.000\|\$10\.000' components/home/ServicesHubSection.tsx
```

Esperado: el `grep` devuelve **0**.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: los precios de internet y estacionamiento salen de la ficha

Estaban escritos cinco veces en el mismo archivo. Cambiar una tarifa era
cinco ediciones de JSX y un deploy."
```

---

## Task 5: Los datos de contacto

**Files:**
- Modify: `app/page.tsx`, `components/home/ContactSection.tsx`, `components/layout/SiteFooter.tsx`, `components/layout/FloatingWhatsApp.tsx`, `lib/contenido/tipos.ts`

- [ ] **Step 1: Tipos y respaldo**

Agregar a `lib/contenido/tipos.ts`:

```ts
export type DatosDeContacto = {
  direccion: string;
  email: string;
  horarios: string;
  whatsapp: { numero: string; visible: string; mensaje: string };
  redes: { instagram: string; facebook: string; youtube: string };
};

export const CONTACTO_RESPALDO: DatosDeContacto = {
  direccion: 'Rene Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina',
  email: 'contacto.urku@gmail.com',
  horarios: 'Lunes, miercoles y sabado de 7:00 a 14:00 hs.',
  whatsapp: {
    numero: '541124240338',
    visible: '+54 11 2424-0338',
    mensaje: 'Hola Feria Urkupina, quisiera realizar una consulta.',
  },
  redes: {
    instagram: 'https://www.instagram.com/urkupina.s.a/?hl=es',
    facebook: 'https://www.facebook.com/urkupinaSA/?locale=es_LA',
    youtube: 'https://youtube.com/@ULIVE_STREAM',
  },
};

/** Arma el enlace de WhatsApp con el mensaje ya escrito. */
export const enlaceWhatsapp = (whatsapp: DatosDeContacto['whatsapp']): string =>
  `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(whatsapp.mensaje)}`;
```

`enlaceWhatsapp` existe para que el enlace se arme en un solo lugar: hoy la misma URL con el mismo texto codificado a mano está repetida en tres archivos.

- [ ] **Step 2: Pruebas de `enlaceWhatsapp`**

Crear `lib/contenido/tipos.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { enlaceWhatsapp, sinMas } from './tipos';

describe('enlaceWhatsapp', () => {
  it('arma el enlace con el mensaje codificado', () => {
    const url = enlaceWhatsapp({
      numero: '541124240338',
      visible: '+54 11 2424-0338',
      mensaje: 'Hola, quiero consultar',
    });
    expect(url).toBe('https://wa.me/541124240338?text=Hola%2C%20quiero%20consultar');
  });

  it('codifica los caracteres con acento', () => {
    const url = enlaceWhatsapp({ numero: '1', visible: '1', mensaje: 'Urkupiña' });
    expect(url).toContain('Urkupi%C3%B1a');
  });
});

describe('sinMas', () => {
  it('quita el signo mas del final', () => {
    expect(sinMas('2.200+')).toBe('2.200');
  });

  it('deja intacto un valor sin signo', () => {
    expect(sinMas('365')).toBe('365');
  });
});
```

Correr `npm test`. Esperado: **41 pruebas pasando**.

- [ ] **Step 3: Consultar y distribuir**

En `app/page.tsx`, agregar `obtenerContacto()`, sumarla al `Promise.all` y pasar `contacto={contacto ?? CONTACTO_RESPALDO}` a `ContactSection` y `SiteFooter`.

- [ ] **Step 4: ContactSection**

Reemplazar por los valores de la ficha: la dirección (línea 298), el mail (311 y 314), el enlace de WhatsApp (330) con `enlaceWhatsapp(contacto.whatsapp)`, el número visible (335), el horario (354) y las tres redes (369, 379, 389).

- [ ] **Step 5: SiteFooter y FloatingWhatsApp**

`SiteFooter` recibe `contacto` y reemplaza las redes (163, 173, 183), el WhatsApp (295, 300) y el mail (305, 308). Además le pasa a `FloatingWhatsApp` la prop `whatsapp={contacto.whatsapp}`.

`FloatingWhatsApp` cambia su constante `whatsappUrl` por `enlaceWhatsapp(whatsapp)` a partir de la prop recibida.

- [ ] **Step 6: Verificar que no quede nada hardcodeado**

**[LOCAL]**
```bash
grep -rn 'wa\.me/54\|contacto\.urku@gmail\|instagram\.com/urkupina\|facebook\.com/urkupinaSA\|youtube\.com/@ULIVE' components/ | grep -v RESPALDO
```

Esperado: **sin resultados**. Si aparece alguno, falta reemplazarlo.

- [ ] **Step 7: Verificar y commit**

**[LOCAL]**
```bash
npx tsc --noEmit && npm test && npm run build
```

```bash
git add -A
git commit -m "feat: los datos de contacto salen de la ficha

Mail, WhatsApp, direccion, horario y redes estaban repetidos en tres
componentes. El enlace de WhatsApp se arma en un solo lugar, con el mensaje
predefinido codificado por codigo en vez de a mano."
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

- [ ] **Step 3: Inicializar las fichas en producción**

Las fichas no tienen fila en la base hasta que se guardan por primera vez.

**[VPS]**
```bash
cd /var/www/urkupina-system
set -a; . ./.env; set +a
npm run inicializar:fichas
```

Esperado: tres líneas `+ ... inicializada con los valores por defecto`.

- [ ] **Step 4: Reconstruir**

La home es estática y se generó antes de que las fichas tuvieran datos, igual que pasó con los sponsors en la 3a.

**[VPS]**
```bash
cd /var/www/urkupina-system && npm run build && pm2 reload urkupina --update-env
```

- [ ] **Step 5: Verificar en el sitio**

**[VPS]**
```bash
H=$(curl -s https://urkupinasa.com/)
echo "puestos:   $(echo "$H" | grep -c '2.200')"
echo "anios:     $(echo "$H" | grep -oE '2[05]\+|30\+' | sort -u | tr '\n' ' ')"
echo "precios:   $(echo "$H" | grep -c '10.000')"
echo "mail:      $(echo "$H" | grep -c 'contacto.urku@gmail.com')"
echo "whatsapp:  $(echo "$H" | grep -c 'wa.me/541124240338')"
curl -s -o /dev/null -w 'home:  %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
```

Esperado: los datos presentes, **un solo valor de años** (no 30+ y 25+ a la vez), y 200 en las dos rutas.

- [ ] **Step 6: Backup**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

---

## Cierre de la Fase 3b

- [ ] Las tres fichas se editan desde el panel.
- [ ] Los números aparecen una sola vez en la base y se reflejan en los cuatro componentes.
- [ ] La contradicción de los años de trayectoria quedó resuelta.
- [ ] Los cinco precios de `ServicesHubSection` salen de la ficha; el `grep` de valores hardcodeados da 0.
- [ ] Mail, WhatsApp, dirección, horario y redes salen de la ficha.
- [ ] Ningún componente conserva datos de contacto escritos a mano, salvo los respaldos.
- [ ] 41 pruebas pasando.

**Pendiente para el cliente:** confirmar si son 25 o 30 años de trayectoria. Hasta que lo diga queda en 30+, que es lo que mostraba el bloque principal.

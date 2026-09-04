# Popup de bienvenida — diseño

**Fecha:** 2026-09-04
**Estado:** aprobado por el cliente en la conversación, pendiente de plan de implementación.

## Qué se construye

Un popup promocional que aparece al abrir la home. El cliente lo prende y lo apaga desde el panel, y cambia la imagen cuando cambia la campaña. El primer diseño es el banner de **EXPOURKU** que dejó el cliente en la raíz del proyecto (`WhatsApp Image 2026-09-03 at 11.36.09 AM.jpeg`, JPEG apaisado de 1206×788, relación 3:2).

## Decisiones tomadas

| Decisión | Elegido | Alternativas descartadas |
|---|---|---|
| Dónde vive la configuración | Global nuevo `popup` | Un grupo dentro de `home`; una colección `popups` con varias campañas |
| Cada cuánto lo ve un visitante | **En cada carga de la home** | Una vez por día; una vez por sesión; una vez hasta que cambie la imagen |
| Enlace | Campo opcional. Vacío = imagen no clickeable | Sin enlace; enlace fijo a `#contacto` |
| Vencimiento | Solo el interruptor | Fecha de fin opcional; fecha de inicio y fin |

**Sobre la frecuencia:** el cliente eligió mostrarlo en cada carga. Es la opción más insistente: un visitante que va a una sección y vuelve al inicio lo ve de nuevo. Queda escrito acá porque es la decisión más fácil de cambiar después (una línea) y la más probable de querer revisar cuando el sitio tenga tráfico.

**Sobre el vencimiento:** EXPOURKU es un evento con fecha. Sin fecha de fin, si nadie apaga el interruptor el sitio sigue anunciando un evento que ya pasó. El cliente lo asumió a propósito para no sumar campos.

## Arquitectura

Sigue el patrón que ya usan las otras fichas del sitio:

```
globals/Popup.ts          ficha del panel
lib/contenido/popup.ts    tipo + decision de si se muestra (puro, con pruebas)
components/home/PopupBienvenida.tsx   el modal (client component)
app/(frontend)/page.tsx   consulta la ficha y monta el componente
```

### Ficha `popup`

Global con `slug: 'popup'`, etiqueta **"Popup de bienvenida"**, grupo `Contenido del sitio`.
Acceso: lectura pública, escritura `soloAutenticado` — igual que `numeros`, `servicios`, `contacto` y `home`.
Hook `afterChange` que llama `purgarCacheDeLaHome()`, como el resto de las fichas.

| Campo | Tipo | Requerido | Etiqueta |
|---|---|---|---|
| `activo` | `checkbox` | sí, `defaultValue: false` | "Mostrar el popup al entrar al sitio" |
| `imagen` | `upload` a `media` | no | "Imagen del popup" |
| `enlace` | `text` | no | "A dónde lleva la imagen" |

El texto alternativo no es un campo del popup: sale del `alt` de la ficha de Media, que ya es obligatorio.

### Decisión de mostrarlo

`lib/contenido/popup.ts` expone el tipo y una función pura:

- `PopupVisible = { imagen: string; alt: string; ancho: number; alto: number; enlace?: string }`
- `aPopupVisible(ficha)` devuelve `PopupVisible | null`.

Devuelve `null` cuando el interruptor está apagado, cuando no hay imagen cargada, o cuando la relación vino sin poblar. Que sea una función pura es lo que la hace testeable sin levantar base.

**Se usa la imagen original, no los tamaños de Media.** `thumbnail` (400×300) y `card` (800×600) recortan al centro; a un banner 3:2 le cortarían el logo y la bajada. El ancho y el alto salen del documento de Media, que los guarda.

### El componente

`components/home/PopupBienvenida.tsx`, client component. Recibe un `PopupVisible` por props; la página ya hizo la consulta.

- Fondo oscuro translúcido, tarjeta centrada, imagen en su proporción real. Hasta 900px en escritorio, 92% del ancho en celular.
- Botón de cerrar (✕) sobre la esquina superior derecha de la imagen.
- Se cierra con el botón, con un click en el fondo, y con Escape.
- Si hay enlace, la imagen es un `<a>`. Externo (arranca con `http`) abre en pestaña nueva con `rel="noopener noreferrer"`; un ancla del sitio (`#contacto`) navega en la misma pestaña y cierra el popup.
- `next/image` con `sizes` declarado.

### Sin parpadeo y sin trabar el sitio

El componente se renderiza en el HTML del servidor: el popup ya está en la respuesta, no aparece de golpe después de hidratar.

El costo de eso es que sin JavaScript el botón de cerrar no funciona y el overlay quedaría trabando el sitio. Se resuelve con un `<noscript>` que lo oculta por CSS:

```html
<noscript><style>#popup-bienvenida{display:none}</style></noscript>
```

Sin JavaScript no hay popup, que es la falla segura: el visitante pierde una promoción, no el sitio.

### Flujo de datos

`page.tsx` agrega `obtenerPopup()` al `Promise.all` que ya consulta sponsors, números, precios, contacto, secciones y novedades. Mismo patrón try/catch: si la base no responde, devuelve `null` y no hay popup.

El popup se monta **fuera** de `<Secciones>`, al nivel de `<Navbar>` y `<Hero>`: es parte del marco fijo de la página, no una sección que el cliente pueda reordenar.

## Manejo de errores

| Situación | Qué pasa |
|---|---|
| La base no responde | No hay popup. La home carga normal, con el error en el log |
| Interruptor prendido, sin imagen | No hay popup. No queda un recuadro vacío |
| La relación de imagen vino sin poblar | No hay popup |
| Enlace vacío | La imagen se muestra, sin ser clickeable |
| JavaScript apagado | No hay popup |

## Accesibilidad

- `role="dialog"` y `aria-modal="true"`, con `aria-label="Aviso"`. El contenido lo describe el `alt` de la imagen, así que el diálogo no lo repite.
- Al abrir, el foco va al botón de cerrar. Queda atrapado dentro del modal mientras está abierto.
- Al cerrar, el foco vuelve al elemento que lo tenía antes.
- El scroll del fondo se bloquea mientras el popup está abierto.
- El botón de cerrar tiene `aria-label="Cerrar"`.

## Pruebas

**Unitarias** sobre `aPopupVisible`: apagado, prendido sin imagen, prendido con imagen, relación sin poblar, con y sin enlace, y la clasificación de enlace externo contra ancla interna.

**En el navegador:** que aparezca al cargar la home, que cierre con las tres vías, que el foco se comporte, que en 390px entre sin scroll horizontal, y que apagando el interruptor desde el panel desaparezca.

## Migración y despliegue

La ficha nueva crea tablas: hace falta `payload migrate:create popup` y validar la migración contra una base limpia, como en las fases anteriores.

`scripts/inicializar-fichas.ts` tiene que incluir `'popup'` en su lista.

Se agrega `scripts/sembrar-popup.ts` (patrón de `sembrar-sponsors.ts`) que sube el JPEG de EXPOURKU a Media con su alt y lo deja asignado a la ficha, con el interruptor **apagado**. El cliente lo prende cuando quiera. Se copia el archivo a un nombre sin espacios antes de subirlo.

## Fuera de alcance

- Memoria de "ya lo vi" (cookies, localStorage). Se descartó al elegir mostrarlo en cada carga.
- Fecha de inicio o de fin.
- Varias campañas rotativas.
- Mostrarlo en páginas que no sean la home.
- Animación de entrada más allá de un fundido simple.

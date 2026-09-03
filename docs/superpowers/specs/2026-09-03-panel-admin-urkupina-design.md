# Panel de administración y persistencia de datos — urkupinasa.com

**Fecha:** 2026-09-03
**Estado:** Diseño aprobado, pendiente de plan de implementación

## 1. Qué se pide

Dos cosas, en palabras del cliente:

1. Que toda la información que recopila la web quede guardada en una base de datos, accesible desde un panel.
2. Que desde ese mismo panel se administren los datos que hoy están cargados en la página (cantidad de puestos, valores de internet, sponsors con su imagen, etc.), con un administrador general que pueda crear otros usuarios con permisos para editar contenido.

## 2. Estado actual verificado

El sitio está en producción en un VPS (`2.25.115.107`, Ubuntu 24.04): nginx hace de proxy al puerto 3000, donde corre Next.js 16.2.9 bajo pm2 (proceso `urkupina`), desde `/var/www/urkupina-system`. Certificado Let's Encrypt válido, ufw activo permitiendo solo SSH y nginx.

### Payload ya está instalado y no se usa

El proyecto tiene Payload CMS 3.88 configurado: panel en `/admin`, API en `/api`, adaptador Postgres apuntando a Supabase, y almacenamiento de imágenes en el S3 de Supabase. Existen las colecciones `Users`, `Media`, `Posts` y `Categories`.

Sin embargo `app/page.tsx` no lee un solo dato de la base. Todo el contenido está escrito a mano dentro de los componentes.

### Los formularios no guardan nada

- `components/home/ContactSection.tsx:76` — simula el envío con un `setTimeout`. No persiste ni envía.
- `components/home/AdvertisingSection.tsx:96` — no tiene estado: no lee lo que la persona escribe. Muestra el mensaje de éxito y cierra.

Toda consulta recibida hasta hoy se perdió.

### El contenido está duplicado

- Precios de internet, cinco veces en `components/home/ServicesHubSection.tsx`: líneas 388, 490, 502, 601 y 605.
- Cantidad de puestos, en cinco archivos: `HeroStats.tsx:9`, `VisitSection.tsx:13`, `ImpactGrid.tsx:9`, `CommerceSection.tsx:161`, `AdvertisingSection.tsx:27`.
- Sponsors, array `SPONSORS` en `components/home/SponsorShowcase.tsx:9`, con los logos como rutas a `/public/images/sponsors`.

Consecuencia observable: **la página se contradice a sí misma.** `HeroStats.tsx:20` anuncia "30+ AÑOS DE TRAYECTORIA" y `ImpactGrid.tsx:17` dice "25+ Años". El valor "5.000+" figura como personas diarias en un bloque y como empleos en otro.

### Código muerto

Trece componentes existen en el repo pero no los importa nadie: `CTA`, `EcosystemDiagram`, `EducationCards`, `EventsCalendar`, `FeatureGrid`, `MarketDays`, `Milestones`, `ParkingSection`, `Quote`, `RentalsSection`, `TransformationSteps`, `WifiVouchersSection`, `MegaFooter`.

Entre ellos `WifiVouchersSection`, que contiene una segunda versión de los precios de internet. No es la que se ve en el sitio.

### Problemas de seguridad y operación

- `collections/Users.ts:10` tiene `access: { read: () => true }`. La colección de usuarios es de lectura pública: `GET /api/users` devuelve los mails de los administradores.
- `collections/Posts.ts:40-63` dispara un webhook a `VERCEL_REVALIDATION_WEBHOOK_URL`, que vale `https://your-vercel-site.vercel.app` — un placeholder. Cada publicación hace una petición que falla.
- El hook revalida `/novedades` y `/novedades/[slug]`, rutas que no existen en `app/`.
- En el servidor conviven `.env` y `.env.local`. Next prioriza `.env.local`, así que gana `NEXT_PUBLIC_SERVER_URL=http://localhost:3000` sobre el valor correcto. Hoy no rompe nada porque ningún componente lo usa; es una bomba de tiempo.
- El código no está bajo control de versiones: `/var/www/urkupina-system` no es un repositorio y el repo local no tiene ningún commit. No existe punto de retorno.
- El `.env.local` local y el del servidor apuntan a la misma base de datos.

## 2.bis Enmienda del 2026-09-03: se perdió el acceso a Supabase

Durante la ejecución de la Fase 0 se descubrió que **las credenciales del proyecto Supabase están vencidas y no hay forma de recuperarlas**. Verificado desde el VPS:

- La contraseña de la base falla en los dos puertos del pooler: `password authentication failed for user "postgres"`.
- La anon key del `.env` devuelve `{"message":"Invalid API key"}`.
- Las credenciales S3 hacen fallar el listado del bucket.
- El proyecto en sí responde (no está pausado): los endpoints devuelven errores propios de Supabase. Lo que cambió son las claves.

**Consecuencias en producción, anteriores a este trabajo:**

- `/admin` y `/api/users` vienen devolviendo **HTTP 500**. El panel está caído desde antes de empezar. El log de pm2 repite `cannot connect to Postgres`.
- `components/home/NewsFeed.tsx:96` consulta Supabase directo desde el navegador y falla, pero tiene un respaldo hardcodeado (`fallbackPosts`), así que muestra noticias falsas sin avisar. Por eso nadie lo notó.
- La home funciona porque no consulta la base ni una vez.

**Qué cambia en el diseño:**

1. **No hay migración de datos.** Payload recrea el esquema desde cero contra `urkupina_prod`. Se pierde lo que hubiera en el CMS; el contenido del sitio está hardcodeado y no se ve afectado.
2. **Las imágenes pasan a disco local del VPS.** Era opcional, ahora es obligatorio: el S3 de Supabase es inaccesible. Se saca el plugin `s3Storage`.
3. **Se elimina todo el rastro de Supabase del código**, que pasó a ser código muerto: `lib/supabase.ts`, la consulta de `NewsFeed`, el stub de `proxy.ts`, el `remotePatterns` de `next.config.ts:9`, el condicional SSL de `payload.config.ts:34` y las dependencias `@supabase/*`.
4. **El backup externo va a la máquina local** por tarea programada, porque el destino previsto era el bucket de Supabase.
5. **Hay que crear el primer administrador** con el asistente de Payload en `/admin`.

Si algún día se recupera el acceso al proyecto, los datos siguen ahí y se pueden importar. No bloquea nada.

## 3. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Alcance del contenido editable | Curado: lo que cambia (sponsors, precios, números, novedades, contacto). El texto institucional queda en el código |
| Panel | El admin que ya trae Payload, en español y con logo propio. No se construye panel a medida |
| Roles | Dos: administrador y editor |
| Aviso de consultas nuevas | Solo se guardan en la base. Sin envío de mails por ahora |
| Orden de trabajo | Ordenar el deploy primero, después construir. Sin entorno de staging |
| Base de datos | PostgreSQL instalado en el VPS, con dos bases: producción y desarrollo. Backups automáticos obligatorios. **Enmienda: sin migración de datos, el esquema se recrea desde cero** |
| Imágenes | **Enmienda: a disco local del VPS.** El S3 de Supabase es inaccesible |
| Backup externo | **Enmienda: copia diaria a la máquina local** por tarea programada de Windows |
| Componentes huérfanos | Se borran |
| Página de detalle de novedades | Fuera de alcance en esta entrega |

MariaDB quedó descartado: Payload 3 solo ofrece adaptadores para PostgreSQL, SQLite y MongoDB. Usar MySQL o MariaDB obligaría a reescribir a mano toda la capa de datos del CMS.

## 4. Arquitectura

### 4.1 Base de datos

PostgreSQL 16 en el VPS, escuchando solo en localhost (sin puerto expuesto a internet; ufw ya bloquea todo lo que no sea 22, 80 y 443). Dos bases:

- `urkupina_prod` — la que usa el sitio en vivo.
- `urkupina_dev` — contra la que se desarrolla, con el mismo esquema.

Cada una con su usuario y su contraseña propia. El esquema y los datos actuales se copian desde Supabase con `pg_dump` y se restauran con `pg_restore`.

**Backups, condición innegociable de esta decisión:** `pg_dump` diario por cron, comprimido, con retención de 7 copias diarias y 4 semanales en `/var/backups/urkupina`. La copia externa la baja la máquina local por SSH con una tarea programada de Windows. Sin una copia fuera de la máquina, un fallo de disco borra la base entera. Esto entra en la Fase 0, no después.

Limitación asumida y aceptada: la copia externa solo ocurre los días que la máquina local esté encendida y con red. Los backups del VPS corren igual todos los días; lo que queda desparejo es la copia de resguardo. Si más adelante se quiere cobertura pareja, se le enchufa un destino de objetos (R2 o B2) sin rehacer nada.

Las imágenes se guardan en disco local del VPS, bajo `public/media`, y las sirve nginx. El plugin `s3Storage` se elimina de `payload.config.ts` junto con las variables `SUPABASE_S3_*`.

### 4.2 Modelo de datos

**Fichas únicas** (globals: una sola instancia, se editan como un formulario):

`numeros` — Números del predio

- `puestos` (texto, hoy "2.200+")
- `personasDiarias` (texto, hoy "5.000+")
- `empleos` (texto, hoy "5.000+")
- `aniosTrayectoria` (texto — **a confirmar con el cliente: hoy la web dice 30+ y 25+ en dos lugares distintos**)
- `diasActividad` (texto, hoy "365")

Los íconos, etiquetas y textos descriptivos de `HeroStats` e `ImpactGrid` quedan en el código. Desde el panel se edita el número, no la presentación.

`internet` — Vouchers WiFi

- `planes` (lista ordenable), cada uno con: `nombre`, `precio` (número), `moneda` (por defecto ARS), `duracion`, `dispositivos`, `descripcion`, `beneficios` (lista de textos), `destacado` (casilla)

`contacto` — Contacto y redes

- `email`, `telefono`
- `whatsapp`: `numero` y `mensajePredefinido`
- `direccion`, `horarios` (lista de día + horario)
- `instagram`, `facebook`, `youtube`

**Listados** (colecciones):

`sponsors`

- `nombre` (obligatorio), `logo` (relación a `media`, obligatorio), `categoria`, `sitioWeb`, `orden` (número), `activo` (casilla, por defecto verdadero)
- Los logos actuales de `/public/images/sponsors` se cargan a `media` como parte de la migración.

`consultas`

- `tipo`: `contacto` o `publicidad`
- `nombre`, `empresa`, `email`, `telefono`, `asunto`, `mensaje`
- `estado`: `nueva`, `leida`, `respondida`, `cerrada` (por defecto `nueva`)
- `createdAt` lo pone Payload solo
- Columnas por defecto en el listado: estado, tipo, nombre, email, fecha

`posts` y `categories` ya existen y están bien construidos. Se enchufa `NewsFeed` a `posts`.

### 4.3 Permisos

A `users` se le agrega `rol`: `admin` o `editor`, obligatorio, por defecto `editor`.

| Acción | Admin | Editor |
|---|---|---|
| Entrar al panel | Sí | Sí |
| Editar fichas, sponsors, posts | Sí | Sí |
| Ver consultas y cambiar su estado | Sí | Sí |
| Borrar consultas | Sí | No |
| Crear, editar y borrar usuarios | Sí | No |
| Cambiar el rol de alguien | Sí | No |

Reglas concretas:

- `users.read` pasa de `() => true` a exigir sesión iniciada. Corrige la filtración de mails.
- `users.create`, `users.delete` y `users.update` sobre otro usuario: solo admin. Un editor puede editar su propio registro (cambiar su contraseña).
- El campo `rol` lleva `access.update` a nivel de campo restringido a admin. Sin esto, un editor edita su propio registro y se asciende. La restricción tiene que ser de campo, no de pantalla: ocultar el campo en el admin no impide mandar el dato por la API.
- Lectura pública, solo donde la web la necesita: `sponsors` con `activo: true`, las tres fichas, y `posts` publicados (esta última ya existe en `Posts.ts:12`).
- `consultas.create` queda en `() => false`, es decir cerrado por la API REST. El alta se hace desde las Server Actions con la API local de Payload, que corre del lado del servidor y no pasa por esas reglas. Así el formulario graba pero nadie puede insertar consultas desde afuera. `consultas.read` exige sesión.

### 4.4 Cómo llega el contenido a la web

Los componentes son `"use client"` porque usan framer-motion, así que no pueden consultar la base por su cuenta.

`app/page.tsx` pasa a ser componente de servidor asíncrono. Obtiene todo con la API local de Payload (`getPayload`), que va directo a la base dentro del mismo proceso, sin dar una vuelta por HTTP. Las consultas salen en paralelo con `Promise.all`. Los datos bajan a los componentes por props; cada componente pierde su array hardcodeado y queda puro.

Los tipos salen de `payload-types.ts`, que Payload regenera solo. Si cambia un campo, el compilador marca dónde rompe.

**Publicación inmediata:** cada colección y ficha lleva un hook `afterChange` que llama a `revalidatePath('/')`. Es el patrón que ya usa `Posts.ts:28`. Se guarda en el panel y el cambio se ve al recargar.

**Red de seguridad:** si una consulta a la base falla, la sección cae a los valores actuales, escritos en el código como respaldo. Hoy el contenido es estático y la web no se cae nunca; sería un retroceso que después de esta tarea una caída de la base deje la home en blanco.

**Limpieza:** se elimina el webhook de Vercel de `Posts.ts:40-63` y sus dos variables de entorno. No tiene sentido en un VPS y hoy solo genera peticiones fallidas.

### 4.5 Captura de consultas

Server Actions en `app/actions/consultas.ts`, no rutas de API. Es lo estándar en Next 16 y evita dejar un endpoint abierto.

- `ContactSection`: se reemplaza el `setTimeout` de la línea 76 por el guardado real.
- `AdvertisingSection`: se reescribe el formulario. Hoy no tiene estado y no lee los campos.
- La validación se hace en el servidor. La actual vive en el navegador y se saltea con la consola abierta.
- Anti-spam: campo trampa invisible más límite de envíos por IP. Sin captcha por ahora; se suma si aparece spam real.
- Manejo de errores: si el guardado falla, el formulario muestra un error real y conserva lo escrito. Nunca un falso "gracias" como hoy.

A partir de esta entrega el sitio guarda datos personales de terceros. Los roles limitan quién los ve. Definir cuánto tiempo se conservan es decisión del cliente y no bloquea el trabajo.

## 5. Fases

Ordenadas por riesgo: primero lo que protege, después lo que hoy cuesta plata, al final lo cosmético. Cada fase termina desplegada y funcionando; si el trabajo se corta en el medio, lo entregado sirve.

**Fase 0 — Ordenar**

1. Commit del código actual como punto de retorno y push al repo `webcms` ya configurado.
2. `.gitignore` ya cubre `.env*` (líneas 33 y 45-46), verificado. Igual se revisa el primer commit archivo por archivo antes de empujarlo, porque una vez publicado un secreto en GitHub hay que rotarlo, no alcanza con borrarlo.
3. Sacar el `.env.local` sobrante del servidor.
4. Instalar PostgreSQL en el VPS, crear `urkupina_prod` y `urkupina_dev`.
5. Copiar esquema y datos desde Supabase con `pg_dump`.
6. Backup automático diario con copia fuera del VPS.
7. Script de deploy repetible: `git pull`, `npm ci`, `build`, `pm2 reload`.
8. Cambiar el `DATABASE_URL` de producción a la base local y verificar el sitio.

**Fase 1 — Usuarios y permisos**

Campo `rol`, reglas de acceso, cierre de la lectura pública de `users`, panel en español con logo. Va primero porque todo lo demás se apoya en esto.

**Fase 2 — Consultas**

Colección `consultas`, Server Actions, los dos formularios enchufados. Antes que el contenido porque es lo único de la lista que está costando plata mientras tanto.

**Fase 3 — Contenido**

Las tres fichas, `sponsors`, migración de los logos a `media`, componentes pasados a props.

**Fase 4 — Cierre**

`NewsFeed` lee de `posts`, se borran los trece huérfanos y el webhook muerto.

## 6. Verificación

El proyecto no tiene ningún test. No se propone llenarlo de tests, sino cubrir las dos partes donde un error es caro y silencioso:

- **Reglas de permisos**: que un editor no pueda ascenderse a admin, ni borrar consultas, ni crear usuarios. Que un anónimo no pueda leer `users` ni `consultas`.
- **Validación de formularios en servidor**: campos obligatorios, formato de mail, largo mínimo del mensaje, campo trampa.

Son funciones puras, se prueban con Vitest sin levantar el sitio. El resto se verifica a mano contra una lista de chequeo por fase.

**Migraciones de esquema:** `package.json:10` define `payload db:push`, que aplica cambios directo contra la base. Para producción se generan migraciones versionadas y se corren como paso del deploy. `db:push` queda reservado para `urkupina_dev`.

## 7. Riesgos

| Riesgo | Mitigación |
|---|---|
| Perder la base al mover de Supabase al VPS | Ya no aplica: no hay datos que mover. El esquema se recrea vacío |
| Backups a cargo propio de acá en más | Cron diario en el VPS más copia a la máquina local, en la Fase 0. Verificar que la restauración funcione, no solo que el archivo se genere |
| La copia externa depende de que la máquina local esté prendida | Riesgo aceptado a cambio de no sumar servicios. El script avisa si pasaron más de tres días sin copia |
| Una migración rompe producción | Migraciones versionadas, backup previo a cada deploy, punto de retorno en git |
| La base cae y la home queda vacía | Valores de respaldo en el código por sección |
| Un editor se asciende a admin | Restricción a nivel de campo, no de interfaz. Cubierto por tests |
| Spam en los formularios | Campo trampa y límite por IP. Captcha si hace falta |

## 8. Fuera de alcance

- Página de detalle de novedades (`/novedades/[slug]`).
- Recuperar los datos que quedaron en Supabase. Si vuelve el acceso, se importan aparte.
- Aviso por mail de consultas nuevas.
- Entorno de staging.
- Publicar cualquiera de los trece componentes huérfanos como sección nueva.
- Convertir la home en un armador de páginas por bloques.

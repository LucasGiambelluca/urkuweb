# Formularios configurables — diseño

**Fecha:** 2026-09-04
**Estado:** aprobado por el cliente en la conversación, pendiente de plan de implementación.

## Qué se construye

Un constructor de formularios en el panel, y un bloque para mostrarlos en la home con una imagen al lado. El cliente arma los campos y cambia las etiquetas sin pedir código.

El caso que lo dispara es la **inscripción de expositores de EXPOURKU**. David pasó los once campos:

| Campo | Obligatorio |
|---|---|
| Razón social | sí |
| Nombre comercial / Marca | sí |
| CUIT | sí |
| Rubro / actividad | sí |
| Nombre y apellido del responsable | sí |
| Cargo | no |
| Teléfono / WhatsApp | sí |
| Correo electrónico | sí |
| Instagram | no |
| Página web | no |
| Localidad / Provincia | no |

Y pidió que el banner del popup de EXPOURKU lleve a ese formulario.

## Decisiones tomadas

| Decisión | Elegido | Alternativas descartadas |
|---|---|---|
| Motor | `@payloadcms/plugin-form-builder` 3.88.0 | Constructor propio; bloque dedicado solo a EXPOURKU |
| Dónde vive el formulario | Sección de la home; el popup lleva ahí | Dentro del popup; en los dos lados |
| Validación de CUIT | **Ninguna, campo de texto** | Once dígitos con dígito verificador |
| Horizonte | Van a venir más formularios | Solo este |

**Sobre el motor:** el plugin es oficial y coincide exactamente con la versión de Payload del proyecto. Su costo real es que las respuestas se guardan como pares campo-valor, no como columnas: en la bandeja se lee `CUIT: 30-12345678-9` en una lista, no una columna ordenable. Para once campos de datos de empresa se lee bien igual, y reimplementar un constructor de formularios para ahorrar eso no cierra.

**Sobre la ubicación:** el pedido original era que el popup *fuera* el formulario. Once campos, ocho obligatorios, dentro de un modal que aparece en cada carga, en celular, es una pantalla de scroll que la gente cierra. Además contradice lo que pidió David, que fue que el banner **mande a** el formulario. Queda como sección de la home, visible aunque alguien cierre el popup.

**Sobre el CUIT:** se planteó validarlo (es el único dato que no se corrige mirándolo, y es el que hace falta para facturar). El cliente eligió dejarlo como texto libre.

## Arquitectura

```
payload.config.ts                    registra el plugin y sus etiquetas en espanol
blocks/secciones.ts                  suma el bloque "formulario"
lib/formularios/validacion.ts        valida una respuesta contra la definicion (puro, con pruebas)
app/actions/formularios.ts           Server Action: valida, limita por IP, guarda
components/home/BloqueFormulario.tsx arma la seccion: imagen a un lado, formulario al otro
components/home/Formulario.tsx       dibuja los campos y maneja el envio (cliente)
components/home/Secciones.tsx        traduce el bloque a la seccion
scripts/sembrar-formulario-expo.ts   crea el formulario de EXPOURKU y lo deja en la home
```

### Las colecciones del plugin

**Formularios**, grupo `Contenido del sitio`. El cliente crea uno, le pone nombre y arma los campos eligiendo tipo, etiqueta y si es obligatorio. También define el texto del botón y el mensaje de gracias.

Tipos de campo habilitados: texto, área de texto, correo, número, desplegable, casilla y texto intercalado. **Se desactivan los de pago**, que el plugin trae y acá solo estorban.

**Inscripciones**, grupo `Consultas`, al lado de las que ya existen. Cada respuesta guarda a qué formulario pertenece y los valores cargados.

Las etiquetas del panel se sobrescriben al español con `formOverrides` y `formSubmissionOverrides`, para no repetir el defecto que se arregló hoy en `Posts`, `Categories` y `Media`.

### Permisos

Copian el patrón de `consultas`, que está probado:

| | |
|---|---|
| Formularios | Lectura y escritura `soloAutenticado` |
| Inscripciones | Alta **cerrada por la API REST** (`create: () => false`), lectura y edición `soloAutenticado`, borrado `soloAdmin` |

El alta real la hace la Server Action con la API local y `overrideAccess: true`, que corre en el servidor y no pasa por esas reglas. Así el formulario graba pero nadie puede insertar inscripciones desde afuera.

La lectura de los formularios tambien queda cerrada: la home se dibuja del lado del servidor con la API local, que no pasa por el control de acceso, asi que no hace falta exponer las definiciones por la API REST.

### El bloque

Slug `formulario`, etiqueta **"Formulario"**. Cuatro campos:

| Campo | Tipo | Para qué |
|---|---|---|
| `formulario` | relación a `forms`, requerido | Cuál mostrar |
| `imagen` | upload a `media`, opcional | La que va al lado. Sin imagen, el formulario ocupa todo el ancho |
| `lado` | select `izquierda`/`derecha`, por defecto `izquierda` | De qué lado va la imagen |
| `ancla` | texto, opcional | El nombre para enlazar desde afuera. `inscripcion` → el popup apunta a `#inscripcion` |

El campo `ancla` existe porque el identificador no puede estar fijo en el código: si el cliente agrega dos bloques de formulario, los dos tendrían el mismo `id` y el enlace del popup se rompería en silencio. Así lo elige y lo ve.

### En pantalla

Dos columnas en escritorio, apiladas en celular con la imagen arriba. La imagen lleva `sizes` declarado desde el principio.

Once campos es mucho, así que el formulario va **en dos columnas dentro de su mitad** en escritorio —CUIT, cargo y localidad no necesitan el ancho completo— y una sola columna en celular.

El título de la sección sale del nombre del formulario.

### El envío

`app/actions/formularios.ts` sigue el camino de `app/actions/consultas.ts`:

1. Campo trampa oculto. Si viene con algo, se responde "gracias" y no se guarda nada. Al spam no se le avisa que fue detectado.
2. `validarRespuesta(definicion, entrada)` en `lib/formularios/validacion.ts`: función pura, con pruebas. Comprueba obligatorios, formato de correo, que los números sean números, que el valor de un desplegable esté entre las opciones, y **topes de largo**: 200 caracteres para un campo de texto y 2000 para un area de texto, que es el defecto que se arreglo hoy en el formulario de contacto.
3. Límite por IP con `LimitadorEnvios`, **cinco envios por hora en una instancia propia**, separada del formulario de contacto. Si comparten contador, alguien que mandó cinco consultas se queda sin poder inscribirse a la expo.
4. `payload.create({ collection: 'form-submissions', overrideAccess: true })`.

### Accesibilidad

Igual que `ContactSection`, que se verificó hoy y está bien armado: `aria-invalid` y `aria-describedby` en los campos con error, y el resultado anunciado en una región `aria-live`.

## Manejo de errores

| Situación | Qué pasa |
|---|---|
| Campo obligatorio vacío | Error marcado en ese campo |
| Correo mal escrito | Error marcado en ese campo |
| Texto más largo que el tope | Error marcado en ese campo |
| Campo trampa con contenido | Se responde "gracias", no se guarda |
| Sexto envío en una hora desde la misma IP | Mensaje pidiendo que espere |
| La base no responde | Mensaje al visitante, error en el log, la página no se cae |
| El bloque apunta a un formulario borrado | La sección no se dibuja, en vez de romper la página |

## Pruebas

**Unitarias** sobre `validarRespuesta`: obligatorio vacío y con contenido, correo válido e inválido, número no numérico, opción de desplegable fuera de la lista, tope de largo justo y pasado, campo trampa, y una definición sin campos.

**En el navegador:** enviar bien, enviar con errores, comprobar que el foco y los avisos funcionan, verlo en 390px, y que el popup con `#inscripcion` cierre y baje hasta el formulario.

## Migración y despliegue

El plugin agrega unas seis tablas: hace falta `payload migrate:create formularios` y **validar la migración contra una base limpia y descartable**, como en las cuatro fases anteriores.

`scripts/sembrar-formulario-expo.ts` crea el formulario de EXPOURKU con los once campos, agrega el bloque a la ficha `home` y le pone el ancla `inscripcion`. Es una siembra, no código: después se edita todo desde el panel. Es idempotente, como las otras.

Después del despliegue hay que dejar el popup apuntando a `#inscripcion`, que se hace desde el panel sin tocar código.

## Fuera de alcance

- **Aviso por correo de cada inscripción.** Sin adaptador SMTP no funciona. Las inscripciones quedan en el panel y alguien tiene que entrar a mirarlas. **Es el riesgo más concreto de esta entrega:** si esperan enterarse sin entrar al panel, hay que resolver eso antes de anunciar la expo.
- **Exportar a Excel.** Payload no lo trae de fábrica.
- **Validación de CUIT.**
- Redirigir a otra página después de enviar: se muestra el mensaje de gracias y punto.
- Que el formulario se pueda mostrar dentro del popup.

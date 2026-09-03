# Fase 0 — Infraestructura y punto de retorno

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar el proyecto con control de versiones, base de datos propia en el VPS con backups verificados y un deploy repetible, sin que el sitio en vivo deje de funcionar en ningún momento.

**Architecture:** El código actual se congela en git como punto de retorno. Se instala PostgreSQL 17 en el VPS escuchando solo en localhost, con dos bases: `urkupina_prod` y `urkupina_dev`. Como no hay acceso al proyecto Supabase, **el esquema no se migra: lo recrea Payload desde cero** a partir de `payload.config.ts`. Todo el código que dependía de Supabase se elimina y las imágenes pasan a disco local. La base de desarrollo se accede desde la máquina local por túnel SSH, sin abrir puertos a internet.

**Tech Stack:** Ubuntu 24.04, PostgreSQL 17 (repositorio PGDG), pm2, nginx, git, tarea programada de Windows para bajar los backups.

**Enmienda del 2026-09-03:** las credenciales de Supabase resultaron vencidas y sin recuperación. Las tareas 5 y 6 originales (volcar y restaurar) quedaron sin efecto y fueron reemplazadas. Ver la sección "2.bis" del spec.

**Referencia:** `docs/superpowers/specs/2026-09-03-panel-admin-urkupina-design.md`

---

## Convenciones de este plan

- Los comandos marcados **[LOCAL]** se corren en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`.
- Los comandos marcados **[VPS]** se corren en una sesión SSH a `root@2.25.115.107`.
- **Ningún paso avanza si la verificación no da lo esperado.** Cada tarea tiene su vuelta atrás documentada.
- El sitio está en producción. Las tareas 1 a 7 no lo tocan. La 8 y la 9 sí, y tienen rollback explícito.

---

## Task 1: Congelar el código actual en git

Sin esto no hay punto de retorno. Es lo primero.

**Files:**
- Modify: repositorio completo en `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system`

- [ ] **Step 1: Verificar que ningún archivo con secretos vaya a entrar**

**[LOCAL]**
```bash
git check-ignore -v .env .env.local
```

Esperado: dos líneas, una por archivo, mostrando la regla de `.gitignore` que los excluye. Si alguno **no** aparece, frená y agregalo al `.gitignore` antes de seguir.

- [ ] **Step 2: Preparar el commit y revisar la lista de archivos**

**[LOCAL]**
```bash
git add -A
git diff --cached --name-only | grep -E '(^|/)\.env' || echo "OK: ningun .env staged"
```

Esperado: `OK: ningun .env staged`. Si imprime cualquier ruta, sacala con `git restore --staged <archivo>` y corregí el `.gitignore`.

- [ ] **Step 3: Verificar que no se cuele nada pesado**

**[LOCAL]**
```bash
git diff --cached --numstat | wc -l
git ls-files --cached | grep -E 'node_modules|\.next/|tsbuildinfo' || echo "OK: sin artefactos de build"
```

Esperado: la primera línea da la cantidad de archivos (unos cientos, no miles). La segunda imprime `OK: sin artefactos de build`.

- [ ] **Step 4: Commit**

**[LOCAL]**
```bash
git commit -m "chore: snapshot del sitio en produccion antes del panel de administracion

Estado tal cual esta desplegado en el VPS al 2026-09-03.
Sirve como punto de retorno: hasta ahora el codigo no estaba versionado.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HpBZC5hebq6mL5MqvAr5qz"
```

- [ ] **Step 5: Verificar el commit**

**[LOCAL]**
```bash
git log --oneline -1
git show --stat HEAD | tail -5
```

Esperado: un commit con el mensaje de arriba y el resumen de archivos.

- [ ] **Step 6: Push al repositorio remoto**

**[LOCAL]**
```bash
git push -u origin main
```

Esperado: `branch 'main' set up to track 'origin/main'`.

Si pide credenciales, el push necesita autenticación de GitHub. Corré `! gh auth login` en el prompt de Claude Code para hacerlo de forma interactiva, o configurá un token personal. No dejes el token escrito en ningún archivo del repo.

- [ ] **Step 7: Verificar que llegó al remoto**

**[LOCAL]**
```bash
git ls-remote origin main
```

Esperado: una línea con el hash del commit, que tiene que coincidir con el de `git rev-parse HEAD`.

---

## Task 2: Confirmar que producción y el repo son el mismo código

El código del VPS se copió a mano. Si difiere de tu copia local, el punto de retorno de la Task 1 es falso. Hay que comprobarlo antes de confiar en él.

**Files:**
- Read-only. Esta tarea no modifica nada.

- [ ] **Step 1: Sacar las huellas de los archivos fuente en producción**

**[VPS]**
```bash
cd /var/www/urkupina-system
find app components collections lib styles public -type f 2>/dev/null | sort | xargs md5sum > /tmp/prod.md5
md5sum package.json next.config.ts payload.config.ts tsconfig.json proxy.ts >> /tmp/prod.md5
wc -l /tmp/prod.md5
```

Esperado: la cantidad de archivos comparados.

- [ ] **Step 2: Traer ese listado a la máquina local**

**[LOCAL]**
```bash
scp root@2.25.115.107:/tmp/prod.md5 ./prod.md5
```

- [ ] **Step 3: Sacar las mismas huellas localmente y comparar**

**[LOCAL]**
```bash
find app components collections lib styles public -type f | sort | xargs md5sum > local.md5
md5sum package.json next.config.ts payload.config.ts tsconfig.json proxy.ts >> local.md5
diff <(sort -k2 prod.md5) <(sort -k2 local.md5) && echo "IDENTICOS" || echo "HAY DIFERENCIAS"
```

Esperado: `IDENTICOS`.

Si aparecen diferencias, **no sigas**. Revisá archivo por archivo cuál versión es la buena: la de producción es la que están viendo los usuarios, así que normalmente gana esa. Traela, commiteala y volvé a correr esta comparación hasta que dé idéntico.

- [ ] **Step 4: Limpiar los archivos temporales**

**[LOCAL]**
```bash
rm -f prod.md5 local.md5
```

**[VPS]**
```bash
rm -f /tmp/prod.md5
```

---

## Task 3: Instalar PostgreSQL 17 en el VPS

Se usa PostgreSQL 17 del repositorio oficial PGDG en vez del 16 que trae Ubuntu, porque `pg_dump` solo puede volcar bases de una versión igual o menor a la suya. Todavía no sabemos qué versión corre Supabase; con el cliente 17 estamos cubiertos pase lo que pase.

**Files:**
- Create: `/etc/apt/sources.list.d/pgdg.list` (lo genera el script oficial)

- [ ] **Step 1: Agregar el repositorio oficial de PostgreSQL**

**[VPS]**
```bash
apt-get update
apt-get install -y postgresql-common curl ca-certificates
/usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
```

Esperado: termina con `You can now start installing packages from apt.postgresql.org.`

- [ ] **Step 2: Instalar servidor y cliente**

**[VPS]**
```bash
apt-get update
apt-get install -y postgresql-17 postgresql-client-17
```

- [ ] **Step 3: Verificar que arrancó y que escucha solo en localhost**

**[VPS]**
```bash
systemctl is-active postgresql
ss -tlnp | grep 5432
```

Esperado: `active`, y la línea de `ss` mostrando `127.0.0.1:5432`. **Si aparece `0.0.0.0:5432` la base está expuesta a internet.** En ese caso, editá `listen_addresses = 'localhost'` en `/etc/postgresql/17/main/postgresql.conf`, corré `systemctl restart postgresql` y volvé a verificar.

- [ ] **Step 4: Verificar la versión del cliente**

**[VPS]**
```bash
pg_dump --version
```

Esperado: `pg_dump (PostgreSQL) 17.x`.

---

## Task 4: Crear usuario y bases

**Files:**
- Create: `/root/.urkupina-db-credentials` (permisos 600)

- [ ] **Step 1: Generar una contraseña fuerte y guardarla**

**[VPS]**
```bash
DBPASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)
umask 077
echo "urkupina_db_password=$DBPASS" > /root/.urkupina-db-credentials
chmod 600 /root/.urkupina-db-credentials
cat /root/.urkupina-db-credentials
```

Esperado: la línea con la contraseña generada. Anotala, se usa en las tareas 6 y 9.

- [ ] **Step 2: Crear el rol y las dos bases**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
CREATE ROLE urkupina WITH LOGIN PASSWORD '$urkupina_db_password';
CREATE DATABASE urkupina_prod OWNER urkupina;
CREATE DATABASE urkupina_dev  OWNER urkupina;
SQL
```

Esperado: `CREATE ROLE`, `CREATE DATABASE`, `CREATE DATABASE`.

- [ ] **Step 3: Verificar que el usuario puede conectarse**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "SELECT current_database(), current_user;"
```

Esperado: una fila con `urkupina_prod | urkupina`.

---

## Task 5: Sacar Supabase del código y pasar las imágenes a disco local

**Reemplaza a las tareas originales 5 y 6 (volcar y restaurar desde Supabase), que quedaron sin efecto: no hay acceso al proyecto y no hay datos que migrar.**

Las credenciales de Supabase están vencidas, así que todo el código que las usa es código muerto que solo puede confundir. Y el almacenamiento de imágenes tiene que dejar de apuntar a un bucket inalcanzable.

**Files:**
- Modify: `payload.config.ts` (sacar el plugin `s3Storage` y el condicional de SSL)
- Modify: `next.config.ts:5-13` (sacar `remotePatterns` de Supabase)
- Modify: `components/home/NewsFeed.tsx` (sacar la consulta a Supabase, dejar el respaldo)
- Modify: `package.json` (sacar las dependencias `@supabase/*`)
- Delete: `lib/supabase.ts`
- Delete: `proxy.ts`

- [ ] **Step 1: Sacar el plugin de S3 de la configuración de Payload**

En `payload.config.ts`, eliminar el import `s3Storage`, el bloque entero `plugins: [...]` y el condicional de SSL. El adaptador de base queda así:

```ts
  db: postgresAdapter({
    pool: {
      connectionString,
    },
  }),
```

La conexión es por loopback contra el Postgres del propio VPS, así que SSL no corresponde. El condicional viejo activaba SSL solo si la cadena contenía la palabra `supabase`.

- [ ] **Step 2: Configurar el almacenamiento local en la colección Media**

`collections/Media.ts` ya tiene `staticDir: 'public/media'`, que es lo que se necesita. Verificar que siga así y que la carpeta exista:

```bash
grep -n 'staticDir' collections/Media.ts
mkdir -p public/media
```

Esperado: la línea con `staticDir: 'public/media'`.

- [ ] **Step 3: Sacar el dominio de Supabase de la configuración de imágenes**

`next.config.ts` queda:

```ts
import { withPayload } from '@payloadcms/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default withPayload(nextConfig);
```

Las imágenes ahora se sirven desde el propio dominio, así que `remotePatterns` no hace falta.

- [ ] **Step 4: Sacar la consulta a Supabase de NewsFeed**

En `components/home/NewsFeed.tsx`, eliminar el import de `@/lib/supabase` y reemplazar el cuerpo de `loadPosts` por el respaldo, que ya existe:

```tsx
  useEffect(() => {
    setPosts(fallbackPosts);
    setLoading(false);
  }, []);
```

Es provisorio y honesto: hoy ese componente ya muestra `fallbackPosts` porque la consulta falla en silencio. En la Fase 4 pasa a leer de `posts` vía Payload.

- [ ] **Step 5: Borrar los archivos muertos**

```bash
rm -f lib/supabase.ts proxy.ts
```

`proxy.ts` era un stub que importaba `@supabase/ssr` y devolvía la respuesta sin hacer nada.

- [ ] **Step 6: Sacar las dependencias**

```bash
npm uninstall @supabase/ssr @supabase/supabase-js @payloadcms/storage-s3 @aws-sdk/client-s3
```

- [ ] **Step 7: Verificar que compila**

```bash
npm run build
```

Esperado: build exitoso. Si falla por algún import de Supabase que quedó suelto, seguí el error y sacalo.

- [ ] **Step 8: Limpiar las variables muertas del entorno**

Sacar de `.env` y `.env.local` las líneas `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_*`, `VERCEL_REVALIDATION_*`. La única que queda de esa familia es `DATABASE_URL`, que en la Task 9 pasa a apuntar al Postgres local.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: eliminar Supabase del proyecto

Las credenciales del proyecto Supabase estan vencidas y sin recuperacion:
la base rechaza la contrasena, la anon key devuelve Invalid API key y el
bucket S3 rechaza el listado. El codigo que las usaba era codigo muerto.

- Se saca el plugin s3Storage: las imagenes van a disco local
- Se saca la consulta directa de NewsFeed, que ya fallaba en silencio
- Se borran lib/supabase.ts y proxy.ts
- Se quitan las dependencias @supabase/* y las de S3

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HpBZC5hebq6mL5MqvAr5qz"
```

---

## Task 6: Backups diarios en el VPS

**Files:**
- Create: `/usr/local/bin/urkupina-backup.sh`
- Create: entrada en el crontab de root

- [ ] **Step 1: Crear el script**

**[VPS]** — escribir `/usr/local/bin/urkupina-backup.sh`:

```bash
#!/bin/bash
set -euo pipefail

source /root/.urkupina-db-credentials
DESTINO=/var/backups/urkupina
FECHA=$(date +%F)
ARCHIVO="$DESTINO/urkupina_prod-$FECHA.dump"

mkdir -p "$DESTINO"

PGPASSWORD="$urkupina_db_password" pg_dump -h 127.0.0.1 -U urkupina -d urkupina_prod -Fc -f "$ARCHIVO"

# Retencion: 7 diarios
find "$DESTINO" -name 'urkupina_prod-*.dump' -mtime +7 -delete

# Retencion: copia semanal los domingos, se conservan 4
if [ "$(date +%u)" = "7" ]; then
  cp "$ARCHIVO" "$DESTINO/semanal-$FECHA.dump"
  ls -1t "$DESTINO"/semanal-*.dump | tail -n +5 | xargs -r rm -f
fi

echo "Backup OK: $ARCHIVO ($(du -h "$ARCHIVO" | cut -f1))"
```

**[VPS]**
```bash
chmod 700 /usr/local/bin/urkupina-backup.sh
bash -n /usr/local/bin/urkupina-backup.sh && echo "OK: sintaxis valida"
```

- [ ] **Step 2: Correrlo a mano**

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
ls -lh /var/backups/urkupina/
```

Esperado: `Backup OK:` con la ruta y el tamaño.

- [ ] **Step 3: Probar la restauración de verdad**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
sudo -u postgres psql -c "CREATE DATABASE urkupina_pruebarestore OWNER urkupina;"
PGPASSWORD="$urkupina_db_password" pg_restore --no-owner --no-privileges \
  -h 127.0.0.1 -U urkupina -d urkupina_pruebarestore \
  "$(ls -1t /var/backups/urkupina/urkupina_prod-*.dump | head -1)"
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_pruebarestore -tAc "\dt" | wc -l
sudo -u postgres psql -c "DROP DATABASE urkupina_pruebarestore;"
```

Esperado: la restauración corre sin errores y el conteo de tablas coincide con el de `urkupina_prod`. Un backup que nunca se restauró no es un backup.

- [ ] **Step 4: Programar el cron diario**

**[VPS]**
```bash
( crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/urkupina-backup.sh >> /var/log/urkupina-backup.log 2>&1" ) | crontab -
crontab -l | grep urkupina
```

Esperado: la línea del cron a las 03:00.

---

## Task 7: Copia automática de los backups a la máquina local

El VPS guarda los dumps; la máquina local se los baja. Se usa clave SSH, no contraseña: además de que un script con la contraseña escrita adentro es un riesgo, la de root del VPS se va a rotar.

**Files:**
- Create: `~/.ssh/id_ed25519` en la máquina local (si no existe)
- Create: `C:\Users\Lucas\Scripts\bajar-backups-urkupina.ps1`
- Create: tarea programada de Windows

- [ ] **Step 1: Generar la clave SSH en la máquina local**

**[LOCAL]**
```bash
ls ~/.ssh/id_ed25519.pub 2>/dev/null || ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

Esperado: la clave pública. Si ya existía, se reutiliza.

- [ ] **Step 2: Autorizar esa clave en el VPS**

**[VPS]** — pegando el contenido del paso anterior:
```bash
mkdir -p /root/.ssh && chmod 700 /root/.ssh
echo "<clave publica del paso 1>" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

- [ ] **Step 3: Verificar que entra sin contraseña**

**[LOCAL]**
```bash
ssh -o BatchMode=yes root@2.25.115.107 "echo CONEXION_POR_CLAVE_OK"
```

Esperado: `CONEXION_POR_CLAVE_OK` sin que pida contraseña. Si la pide, la clave no quedó bien autorizada.

- [ ] **Step 4: Crear el script de descarga**

**[LOCAL]** — escribir `C:\Users\Lucas\Scripts\bajar-backups-urkupina.ps1`:

```powershell
$ErrorActionPreference = "Stop"
$destino = "C:\Backups\urkupina"
$vps = "root@2.25.115.107"

New-Item -ItemType Directory -Force -Path $destino | Out-Null

# Trae el dump mas reciente del VPS
$ultimo = ssh -o BatchMode=yes $vps "ls -1t /var/backups/urkupina/urkupina_prod-*.dump | head -1"
if (-not $ultimo) { throw "El VPS no devolvio ningun backup" }

$nombre = Split-Path $ultimo -Leaf
scp -o BatchMode=yes "${vps}:${ultimo}" "$destino\$nombre"

# Retencion local: 30 copias
Get-ChildItem "$destino\urkupina_prod-*.dump" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 30 |
  Remove-Item -Force

# Aviso si hace mas de 3 dias que no entra una copia nueva
$masNuevo = Get-ChildItem "$destino\urkupina_prod-*.dump" |
  Sort-Object LastWriteTime -Descending | Select-Object -First 1
$dias = (New-TimeSpan -Start $masNuevo.LastWriteTime -End (Get-Date)).Days
if ($dias -gt 3) {
  Write-Warning "El backup mas nuevo tiene $dias dias. Revisar el VPS."
}

Write-Output "Backup bajado: $nombre"
```

- [ ] **Step 5: Probar el script a mano**

**[LOCAL]**
```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\Lucas\Scripts\bajar-backups-urkupina.ps1
dir C:\Backups\urkupina
```

Esperado: `Backup bajado:` con el nombre del archivo, y el archivo listado.

- [ ] **Step 6: Programar la tarea diaria**

**[LOCAL]**
```powershell
schtasks /Create /TN "Backup Urkupina" /TR "powershell -ExecutionPolicy Bypass -File C:\Users\Lucas\Scripts\bajar-backups-urkupina.ps1" /SC DAILY /ST 09:00 /F
schtasks /Query /TN "Backup Urkupina"
```

Esperado: la tarea creada, a las 09:00. Se elige un horario de mañana porque la máquina tiene que estar encendida; el dump del VPS ya se generó a las 03:00.

**Limitación aceptada:** los días que la máquina esté apagada no hay copia externa. Los backups del VPS corren igual. El aviso del paso 4 avisa si se acumulan tres días sin copia.

---

## Task 8: Convertir producción en un checkout de git y armar el deploy

A partir de acá se toca el servidor de producción. La Task 2 ya confirmó que el código es idéntico al del repo, así que el `reset --hard` no pierde nada.

**Files:**
- Create: `/usr/local/bin/urkupina-deploy.sh`
- Modify: `/var/www/urkupina-system` (pasa a ser un repositorio git)

- [ ] **Step 1: Copia de seguridad completa de la carpeta**

**[VPS]**
```bash
tar czf /root/urkupina-system-$(date +%F).tar.gz -C /var/www urkupina-system
ls -lh /root/urkupina-system-*.tar.gz
```

Esperado: el tar creado. Esta es la vuelta atrás de toda la tarea.

- [ ] **Step 2: Guardar el `.env` y sacar el `.env.local` sobrante**

**[VPS]**
```bash
cd /var/www/urkupina-system
cp .env /root/env-produccion-$(date +%F).bak
diff .env .env.local || true
mv .env.local /root/env.local-retirado-$(date +%F).bak
ls -la .env*
```

Esperado: queda solo `.env`. El `.env.local` era el que pisaba `NEXT_PUBLIC_SERVER_URL` con `localhost:3000`.

- [ ] **Step 3: Inicializar git sobre la carpeta y apuntar al remoto**

**[VPS]**
```bash
cd /var/www/urkupina-system
git init
git remote add origin https://github.com/juanmbogetti-ship-it/webcms.git
git fetch origin main
```

Esperado: el fetch trae el commit de la Task 1.

- [ ] **Step 4: Alinear la carpeta con el repositorio**

**[VPS]**
```bash
cd /var/www/urkupina-system
git reset --hard origin/main
git status --short
ls -la .env
```

Esperado: `git status` sin cambios pendientes, y el `.env` **sigue estando** (está en `.gitignore`, el reset no lo toca). Si el `.env` desapareció, restauralo con `cp /root/env-produccion-*.bak .env`.

- [ ] **Step 5: Crear el script de deploy**

**[VPS]** — escribir `/usr/local/bin/urkupina-deploy.sh`:

```bash
#!/bin/bash
set -euo pipefail

cd /var/www/urkupina-system

echo "==> Backup previo de la base"
/usr/local/bin/urkupina-backup.sh

echo "==> Trayendo cambios"
git fetch origin main
git reset --hard origin/main

echo "==> Dependencias"
npm ci

echo "==> Build"
npm run build

echo "==> Reiniciando la aplicacion"
pm2 reload urkupina --update-env

echo "==> Verificando que responda"
sleep 3
CODIGO=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/)
if [ "$CODIGO" != "200" ]; then
  echo "ERROR: el sitio respondio $CODIGO. Revisar con: pm2 logs urkupina --lines 50"
  exit 1
fi

echo "Deploy OK"
```

**[VPS]**
```bash
chmod 700 /usr/local/bin/urkupina-deploy.sh
```

- [ ] **Step 6: Probar el deploy completo**

**[VPS]**
```bash
/usr/local/bin/urkupina-deploy.sh
```

Esperado: termina en `Deploy OK`. Este build además aplica la salida del `.env.local`.

- [ ] **Step 7: Verificar el sitio en vivo**

**[VPS]**
```bash
curl -s -o /dev/null -w 'home: %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
pm2 list
```

Esperado: `home: 200`, el panel respondiendo (200 o 307 si redirige al login) y el proceso `urkupina` en `online`.

**Vuelta atrás si algo salió mal:**
```bash
pm2 stop urkupina
rm -rf /var/www/urkupina-system
tar xzf /root/urkupina-system-$(date +%F).tar.gz -C /var/www
pm2 start urkupina
```

---

## Task 9: Pasar producción a la base local y generar el esquema

Acá el panel vuelve a funcionar. Hoy `/admin` devuelve 500 porque Payload no puede conectarse a Supabase; al terminar esta tarea conecta contra el Postgres del VPS, crea las tablas desde cero y permite crear el primer administrador.

La vuelta atrás ya no es "volver a Supabase", porque Supabase está muerto. La vuelta atrás real es el tar de la Task 8 más el backup de la base.

**Files:**
- Modify: `/var/www/urkupina-system/.env` (variable `DATABASE_URL`)

- [ ] **Step 1: Guardar la cadena vieja por registro**

**[VPS]**
```bash
grep -m1 '^DATABASE_URL=' /var/www/urkupina-system/.env > /root/database-url-supabase.bak
chmod 600 /root/database-url-supabase.bak
```

No sirve para volver, porque esas credenciales están vencidas. Se guarda por si algún día se recupera el proyecto y hay que identificarlo.

- [ ] **Step 2: Apuntar a la base local**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
cd /var/www/urkupina-system
sed -i "s#^DATABASE_URL=.*#DATABASE_URL=postgresql://urkupina:${urkupina_db_password}@127.0.0.1:5432/urkupina_prod#" .env
grep -m1 '^DATABASE_URL=' .env | sed -E 's#:[^:@]+@#:<oculta>@#'
```

Esperado: la cadena apuntando a `127.0.0.1:5432/urkupina_prod`.

Nota: el condicional de SSL que había en `payload.config.ts` se eliminó en la Task 5. La conexión es por loopback contra el Postgres de la misma máquina, así que SSL no corresponde.

- [ ] **Step 3: Generar el esquema con las migraciones de Payload**

La base está vacía. Payload crea las tablas a partir de `payload.config.ts`.

**[VPS]**
```bash
cd /var/www/urkupina-system
npx payload migrate:create inicial
ls migrations/
```

Esperado: un archivo de migración creado bajo `migrations/`.

**[VPS]**
```bash
npx payload migrate
```

Esperado: la migración se aplica sin errores.

- [ ] **Step 4: Verificar que las tablas existen**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "\dt"
```

Esperado: las tablas de Payload (`users`, `media`, `posts`, `categories`, `payload_migrations` y sus auxiliares).

- [ ] **Step 5: Reconstruir y reiniciar**

**[VPS]**
```bash
cd /var/www/urkupina-system
npm run build
pm2 reload urkupina --update-env
sleep 3
```

- [ ] **Step 6: Verificar que el panel volvió a funcionar**

**[VPS]**
```bash
curl -s -o /dev/null -w 'home:  %{http_code}\n' https://urkupinasa.com/
curl -s -o /dev/null -w 'admin: %{http_code}\n' https://urkupinasa.com/admin
pm2 logs urkupina --lines 40 --nostream | grep -iE 'cannot connect|password authentication' || echo "OK: sin errores de base en el log"
```

Esperado: `home: 200`, **`admin: 200`** (hoy da 500) y `OK: sin errores de base en el log`.

- [ ] **Step 7: Crear el primer administrador**

Abrí `https://urkupinasa.com/admin` en el navegador. Como la tabla `users` está vacía, Payload muestra el asistente de creación del primer usuario. Creá la cuenta del administrador general con una contraseña fuerte y guardala en un gestor de contraseñas.

**[VPS]** — verificar que quedó:
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "SELECT id, email, created_at FROM users;"
```

Esperado: una fila con el mail del administrador.

- [ ] **Step 8: Confirmar que el tráfico real llega a la base local**

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_prod -c "
SELECT sum(seq_scan + idx_scan) AS consultas_recibidas
FROM pg_stat_user_tables WHERE schemaname='public';"
```

Esperado: un número mayor a cero, que crece al recargar el panel.

- [ ] **Step 9: Backup inmediato**

Recién creado el administrador, sacá una copia. Es el primer dato real de la base nueva.

**[VPS]**
```bash
/usr/local/bin/urkupina-backup.sh
```

**Vuelta atrás de toda la tarea:**
```bash
pm2 stop urkupina
rm -rf /var/www/urkupina-system
tar xzf /root/urkupina-system-$(date +%F).tar.gz -C /var/www
pm2 start urkupina
```

Restaurar el código deja el sitio como estaba: la home funcionando y `/admin` en 500, que es el estado previo.

---

No borres ni pauses el proyecto de Supabase. Queda como respaldo hasta que la base local acumule al menos siete días de backups verificados. Anotá la fecha de corte.

---

## Task 10: Base de desarrollo accesible desde la máquina local

PostgreSQL escucha solo en localhost, así que desde tu máquina se llega por un túnel SSH. Nada queda expuesto a internet.

**Files:**
- Modify: `C:\Users\Lucas\Desktop\URKUWeb\urkupina-system\.env.local`

- [ ] **Step 1: Cargar el esquema en la base de desarrollo**

Se copia el esquema recién creado en producción, así ambas bases arrancan iguales.

**[VPS]**
```bash
source /root/.urkupina-db-credentials
PGPASSWORD="$urkupina_db_password" pg_dump -h 127.0.0.1 -U urkupina -d urkupina_prod --schema-only -Fc -f /tmp/esquema.dump
PGPASSWORD="$urkupina_db_password" pg_restore --no-owner --no-privileges \
  -h 127.0.0.1 -U urkupina -d urkupina_dev /tmp/esquema.dump
rm -f /tmp/esquema.dump
PGPASSWORD="$urkupina_db_password" psql -h 127.0.0.1 -U urkupina -d urkupina_dev -c "\dt" | head -20
```

Esperado: el listado de tablas, igual al de `urkupina_prod`. Solo el esquema: la base de desarrollo arranca sin datos, y el administrador se crea aparte con el asistente de Payload en `http://localhost:3000/admin`.

- [ ] **Step 2: Abrir el túnel desde la máquina local**

**[LOCAL]** — en una terminal aparte, que queda abierta mientras desarrollás:
```bash
ssh -N -L 5433:127.0.0.1:5432 root@2.25.115.107
```

El puerto local 5433 evita chocar con cualquier PostgreSQL que tengas instalado en Windows.

- [ ] **Step 3: Apuntar el entorno local a la base de desarrollo**

**[LOCAL]** — editar `.env.local` y reemplazar la línea `DATABASE_URL` por:
```
DATABASE_URL=postgresql://urkupina:<contraseña de /root/.urkupina-db-credentials>@127.0.0.1:5433/urkupina_dev
```

- [ ] **Step 4: Verificar que el entorno local levanta contra la base de desarrollo**

**[LOCAL]**
```bash
npm run dev
```

Abrí `http://localhost:3000/admin`. Esperado: el panel carga y podés iniciar sesión con los usuarios de la copia.

Con esto, cualquier `payload db:push` que corras desde tu máquina impacta en `urkupina_dev` y ya no puede tocar producción.

- [ ] **Step 5: Documentar el arranque para el próximo día**

**[LOCAL]** — crear `docs/desarrollo.md` con este contenido exacto:

````markdown
# Cómo levantar el entorno de desarrollo

La base de datos de desarrollo (`urkupina_dev`) vive en el VPS y solo escucha en
localhost. Se llega por un túnel SSH. **Sin el túnel abierto, la aplicación no
conecta y `npm run dev` falla al consultar la base.**

## Cada vez que te sentás a trabajar

1. Abrí una terminal y dejala abierta con el túnel:

   ```bash
   ssh -N -L 5433:127.0.0.1:5432 root@2.25.115.107
   ```

2. En otra terminal, dentro de `urkupina-system`:

   ```bash
   npm run dev
   ```

3. La web queda en `http://localhost:3000` y el panel en
   `http://localhost:3000/admin`.

## Qué base estás tocando

`.env.local` apunta a `127.0.0.1:5433/urkupina_dev`, que a través del túnel es
la base de desarrollo del VPS. Producción usa `urkupina_prod` y no se toca desde
acá.

`payload db:push` es seguro en este entorno: impacta únicamente en
`urkupina_dev`. Para producción se usan migraciones versionadas.

## Si algo no conecta

- `ECONNREFUSED 127.0.0.1:5433` → el túnel está cerrado. Volvé al paso 1.
- `password authentication failed` → la contraseña de `.env.local` no coincide
  con la del VPS, que está en `/root/.urkupina-db-credentials`.

## Publicar a producción

```bash
git push
```

Y en el VPS:

```bash
/usr/local/bin/urkupina-deploy.sh
```

El script hace backup de la base, trae los cambios, reconstruye, reinicia y
verifica que el sitio responda antes de dar por bueno el deploy.
````

- [ ] **Step 6: Commit de la documentación**

**[LOCAL]**
```bash
git add docs/desarrollo.md docs/superpowers/
git commit -m "docs: spec del panel, plan de infraestructura y guia de desarrollo

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HpBZC5hebq6mL5MqvAr5qz"
git push
```

---

## Cierre de la Fase 0

Al terminar tenés que poder responder que sí a todo esto:

- [ ] El código está en GitHub y coincide con lo que corre en producción.
- [ ] `/var/www/urkupina-system` es un checkout de git, no una copia a mano.
- [ ] `urkupina-deploy.sh` deja un cambio en producción con un solo comando, y verifica que el sitio responda.
- [ ] PostgreSQL corre en el VPS escuchando solo en localhost, con `urkupina_prod` y `urkupina_dev`.
- [ ] Producción usa la base local y el sitio responde 200.
- [ ] El backup diario está programado **y se probó restaurándolo**.
- [ ] La máquina local desarrolla contra `urkupina_dev` por túnel SSH.
- [ ] Supabase sigue existiendo, intacto, como respaldo.

Pendiente fuera de este plan, para hablar con el dueño del VPS: rotar la contraseña de root, pasar a autenticación por clave SSH y desactivar `PasswordAuthentication`.

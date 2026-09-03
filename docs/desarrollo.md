# Cómo levantar el entorno de desarrollo

La base de datos de desarrollo (`urkupina_dev`) vive en el VPS y solo escucha en localhost. Se llega por un túnel SSH. **Sin el túnel abierto, la aplicación no conecta y las consultas fallan.**

## Cada vez que te sentás a trabajar

1. Abrí una terminal y dejala abierta con el túnel:

   ```bash
   ssh -N -L 5433:127.0.0.1:5432 root@2.25.115.107
   ```

   Se usa el 5433 local para no chocar con un PostgreSQL instalado en Windows.

2. En otra terminal, dentro de `urkupina-system`:

   ```bash
   npm run dev
   ```

3. La web queda en `http://localhost:3000` y el panel en `http://localhost:3000/admin`.

## Qué base estás tocando

`.env.local` apunta a `127.0.0.1:5433/urkupina_dev`, que a través del túnel es la base de desarrollo del VPS. Producción usa `urkupina_prod` y no se toca desde acá.

La contraseña de la base está en el VPS, en `/root/.urkupina-db-credentials`.

## Migraciones

El esquema se versiona en `migrations/`. Las dos bases arrancan iguales.

```bash
npx payload migrate:status   # que hay aplicado
npx payload migrate:create <nombre>   # generar una migracion nueva tras cambiar collections
npx payload migrate          # aplicar las pendientes
```

`payload db:push` aplica cambios sin dejar registro y **solo se usa contra `urkupina_dev`**, nunca contra producción.

## Publicar a producción

```bash
git push vps main
```

Y en el VPS:

```bash
/usr/local/bin/urkupina-deploy.sh
```

El script saca un backup de la base, trae los cambios, corre `npm ci`, reconstruye, reinicia con pm2 y verifica que el sitio responda 200 antes de dar el deploy por bueno. Si la verificación falla, sale con error y lo dice.

Las migraciones pendientes se aplican a mano en el VPS con `npx payload migrate` antes de reiniciar.

## Backups

- El VPS saca un dump diario a las 03:00 en `/var/backups/urkupina` (7 diarios, 4 semanales).
- La máquina local baja el más reciente a las 09:00 a `C:\Backups\urkupina`, por la tarea programada "Backup Urkupina".
- Los días que la máquina esté apagada no hay copia externa. El script avisa si pasaron más de 3 días.

## Si algo no conecta

- `ECONNREFUSED 127.0.0.1:5433` → el túnel está cerrado. Volvé al paso 1.
- `password authentication failed` → la contraseña de `.env.local` no coincide con la del VPS.
- `Falta PAYLOAD_SECRET en el entorno` → `.env.local` incompleto. Payload no arranca sin ese valor, a propósito.

## Notas del entorno

- El proyecto es ESM: `package.json` tiene `"type": "module"`. Sin eso, el CLI de Payload no puede cargar la config.
- Las imágenes se guardan en disco local (`public/media`), no en un servicio externo.
- Si `node_modules` queda a medias en Windows (Next tiene rutas muy largas y algunas herramientas de copia las truncan), la señal es `Cannot find module next/dist/bin/next`. Se arregla con `rm -rf node_modules && npm install`.

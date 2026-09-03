# Scripts de operacion

Copia versionada de los scripts que corren en el VPS, en `/usr/local/bin/`.
Estan aca porque hasta ahora vivian solo en el servidor: si se perdia la
maquina, se perdian con ella.

**No se ejecutan desde el repositorio.** Al modificarlos hay que copiarlos:

```bash
scp scripts/urkupina-deploy.sh root@2.25.115.107:/usr/local/bin/
ssh root@2.25.115.107 "chmod 700 /usr/local/bin/urkupina-deploy.sh"
```

## urkupina-deploy.sh

Publica a produccion: backup de la base, `git reset --hard` contra el repo
bare del VPS, `npm ci`, migraciones, build, `pm2 reload` y verificacion.

El orden importa: **las migraciones van antes del build**. El CLI de Payload
escribe dentro de `.next` y le borra el `BUILD_ID` a un build ya hecho, con lo
cual la aplicacion arranca, no encuentra el build de produccion y pm2 la deja
en `errored`. Eso tiro el sitio abajo una vez, el 2026-09-03.

Al final verifica dos cosas antes de dar el deploy por bueno: que el sitio
responda 200 y que exista `.next/BUILD_ID`.

## urkupina-backup.sh

`pg_dump` de `urkupina_prod` a `/var/backups/urkupina`, con retencion de 7
copias diarias y 4 semanales. Lo dispara cron todos los dias a las 03:00, y
tambien lo llama el script de deploy antes de tocar nada.

La copia fuera del VPS la baja la maquina local con la tarea programada
"Backup Urkupina" (`C:\Users\Lucas\Scripts\bajar-backups-urkupina.ps1`).

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

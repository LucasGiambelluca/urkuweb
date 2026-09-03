#!/bin/bash
set -euo pipefail

cd /var/www/urkupina-system

echo "==> Backup previo de la base"
/usr/local/bin/urkupina-backup.sh

echo "==> Trayendo cambios"
git fetch vps main
git reset --hard vps/main

echo "==> Dependencias"
npm ci

# Las migraciones van ANTES del build, no despues. El CLI de Payload escribe
# dentro de .next y le borra el BUILD_ID a un build ya hecho: la aplicacion
# arranca, no encuentra el build de produccion y pm2 la deja en errored.
echo "==> Migraciones de base"
set -a; . ./.env; set +a
# NODE_ENV=production es obligatorio: sin esta variable, el adaptador de
# Postgres de Payload entra en modo desarrollo y EMPUJA el esquema directo
# contra la base en vez de aplicar las migraciones, dejando una fila "dev"
# con batch -1 y las migraciones sin registrar. Paso en produccion el
# 2026-09-03.
export NODE_ENV=production
npx payload migrate

echo "==> Build"
npm run build

echo "==> Reiniciando la aplicacion"
pm2 reload urkupina --update-env

echo "==> Verificando que responda"
sleep 5
CODIGO=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/)
if [ "$CODIGO" != "200" ]; then
  echo "ERROR: el sitio respondio $CODIGO. Revisar con: pm2 logs urkupina --lines 50"
  exit 1
fi

# Un build sin BUILD_ID arranca igual la primera vez pero muere al reiniciar.
if [ ! -f .next/BUILD_ID ]; then
  echo "ERROR: falta .next/BUILD_ID. El build quedo incompleto o algo lo piso."
  exit 1
fi

echo "Deploy OK"

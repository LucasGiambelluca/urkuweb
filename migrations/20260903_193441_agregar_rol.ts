import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_rol" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ADD COLUMN "rol" "enum_users_rol" DEFAULT 'editor' NOT NULL;`)

  // La columna entra con 'editor' por defecto, pero los usuarios que ya
  // existian son anteriores a que existieran los roles: son los duenos del
  // sitio. Si quedaran como editores nadie podria gestionar usuarios y el
  // panel quedaria sin administrador.
  await db.execute(sql`UPDATE "users" SET "rol" = 'admin';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "rol";
  DROP TYPE "public"."enum_users_rol";`)
}

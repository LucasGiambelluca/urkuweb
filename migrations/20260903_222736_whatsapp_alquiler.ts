import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contacto" ADD COLUMN "whatsapp_alquiler_numero" varchar DEFAULT '541168615707' NOT NULL;
  ALTER TABLE "contacto" ADD COLUMN "whatsapp_alquiler_mensaje" varchar DEFAULT 'Hola! Quiero consultar por el alquiler de un puesto en Paseo Urkupina' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contacto" DROP COLUMN "whatsapp_alquiler_numero";
  ALTER TABLE "contacto" DROP COLUMN "whatsapp_alquiler_mensaje";`)
}

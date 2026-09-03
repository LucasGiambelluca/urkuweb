import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "servicios_alquiler_condiciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"detalle" varchar NOT NULL
  );
  
  ALTER TABLE "servicios_alquiler_condiciones" ADD CONSTRAINT "servicios_alquiler_condiciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "servicios_alquiler_condiciones_order_idx" ON "servicios_alquiler_condiciones" USING btree ("_order");
  CREATE INDEX "servicios_alquiler_condiciones_parent_id_idx" ON "servicios_alquiler_condiciones" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "servicios_alquiler_condiciones" CASCADE;`)
}

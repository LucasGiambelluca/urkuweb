import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_formulario_lado" AS ENUM('izquierda', 'derecha');
  CREATE TABLE "home_blocks_formulario" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"formulario_id" integer NOT NULL,
  	"imagen_id" integer,
  	"lado" "enum_home_blocks_formulario_lado" DEFAULT 'izquierda',
  	"ancla" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "home_blocks_formulario" ADD CONSTRAINT "home_blocks_formulario_formulario_id_forms_id_fk" FOREIGN KEY ("formulario_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_formulario" ADD CONSTRAINT "home_blocks_formulario_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_formulario" ADD CONSTRAINT "home_blocks_formulario_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_formulario_order_idx" ON "home_blocks_formulario" USING btree ("_order");
  CREATE INDEX "home_blocks_formulario_parent_id_idx" ON "home_blocks_formulario" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_formulario_path_idx" ON "home_blocks_formulario" USING btree ("_path");
  CREATE INDEX "home_blocks_formulario_formulario_idx" ON "home_blocks_formulario" USING btree ("formulario_id");
  CREATE INDEX "home_blocks_formulario_imagen_idx" ON "home_blocks_formulario" USING btree ("imagen_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_blocks_formulario" CASCADE;
  DROP TYPE "public"."enum_home_blocks_formulario_lado";`)
}

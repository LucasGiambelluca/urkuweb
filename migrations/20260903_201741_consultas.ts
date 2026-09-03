import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_consultas_estado" AS ENUM('nueva', 'leida', 'respondida', 'cerrada');
  CREATE TYPE "public"."enum_consultas_tipo" AS ENUM('contacto', 'publicidad');
  CREATE TABLE "consultas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"estado" "enum_consultas_estado" DEFAULT 'nueva' NOT NULL,
  	"tipo" "enum_consultas_tipo" NOT NULL,
  	"nombre" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telefono" varchar,
  	"empresa" varchar,
  	"asunto" varchar,
  	"formato" varchar,
  	"mensaje" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultas_id" integer;
  CREATE INDEX "consultas_updated_at_idx" ON "consultas" USING btree ("updated_at");
  CREATE INDEX "consultas_created_at_idx" ON "consultas" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultas_fk" FOREIGN KEY ("consultas_id") REFERENCES "public"."consultas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_consultas_id_idx" ON "payload_locked_documents_rels" USING btree ("consultas_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "consultas" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "consultas" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultas_fk";
  
  DROP INDEX "payload_locked_documents_rels_consultas_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultas_id";
  DROP TYPE "public"."enum_consultas_estado";
  DROP TYPE "public"."enum_consultas_tipo";`)
}

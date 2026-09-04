import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_blocks_cifras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_historia" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_linea_de_tiempo" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_streaming" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_visita" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_servicios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_impacto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_comercio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_novedades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cantidad" numeric DEFAULT 6 NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "servicios" ALTER COLUMN "internet_diario_detalle" SET DEFAULT 'Válido por 24 horas para 1 dispositivo.';
  ALTER TABLE "servicios" ALTER COLUMN "internet_mensual_detalle" SET DEFAULT '30 días corridos para locatarios y personal.';
  ALTER TABLE "servicios" ALTER COLUMN "estacionamiento_titulo" SET DEFAULT 'Estadía Completa';
  ALTER TABLE "contacto" ALTER COLUMN "direccion" SET DEFAULT 'René Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina';
  ALTER TABLE "contacto" ALTER COLUMN "horarios" SET DEFAULT 'Lunes, miércoles y sábado de 7:00 a 14:00 hs.';
  ALTER TABLE "contacto" ALTER COLUMN "whatsapp_mensaje" SET DEFAULT 'Hola Feria Urkupiña, quisiera realizar una consulta.';
  ALTER TABLE "contacto" ALTER COLUMN "whatsapp_alquiler_mensaje" SET DEFAULT 'Hola! Quiero consultar por el alquiler de un puesto en Paseo Urkupiña';
  ALTER TABLE "home_blocks_cifras" ADD CONSTRAINT "home_blocks_cifras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_historia" ADD CONSTRAINT "home_blocks_historia_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_linea_de_tiempo" ADD CONSTRAINT "home_blocks_linea_de_tiempo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_streaming" ADD CONSTRAINT "home_blocks_streaming_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_visita" ADD CONSTRAINT "home_blocks_visita_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_servicios" ADD CONSTRAINT "home_blocks_servicios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_impacto" ADD CONSTRAINT "home_blocks_impacto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_comercio" ADD CONSTRAINT "home_blocks_comercio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_sponsors" ADD CONSTRAINT "home_blocks_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_novedades" ADD CONSTRAINT "home_blocks_novedades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_cifras_order_idx" ON "home_blocks_cifras" USING btree ("_order");
  CREATE INDEX "home_blocks_cifras_parent_id_idx" ON "home_blocks_cifras" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_cifras_path_idx" ON "home_blocks_cifras" USING btree ("_path");
  CREATE INDEX "home_blocks_historia_order_idx" ON "home_blocks_historia" USING btree ("_order");
  CREATE INDEX "home_blocks_historia_parent_id_idx" ON "home_blocks_historia" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_historia_path_idx" ON "home_blocks_historia" USING btree ("_path");
  CREATE INDEX "home_blocks_linea_de_tiempo_order_idx" ON "home_blocks_linea_de_tiempo" USING btree ("_order");
  CREATE INDEX "home_blocks_linea_de_tiempo_parent_id_idx" ON "home_blocks_linea_de_tiempo" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_linea_de_tiempo_path_idx" ON "home_blocks_linea_de_tiempo" USING btree ("_path");
  CREATE INDEX "home_blocks_streaming_order_idx" ON "home_blocks_streaming" USING btree ("_order");
  CREATE INDEX "home_blocks_streaming_parent_id_idx" ON "home_blocks_streaming" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_streaming_path_idx" ON "home_blocks_streaming" USING btree ("_path");
  CREATE INDEX "home_blocks_visita_order_idx" ON "home_blocks_visita" USING btree ("_order");
  CREATE INDEX "home_blocks_visita_parent_id_idx" ON "home_blocks_visita" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_visita_path_idx" ON "home_blocks_visita" USING btree ("_path");
  CREATE INDEX "home_blocks_servicios_order_idx" ON "home_blocks_servicios" USING btree ("_order");
  CREATE INDEX "home_blocks_servicios_parent_id_idx" ON "home_blocks_servicios" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_servicios_path_idx" ON "home_blocks_servicios" USING btree ("_path");
  CREATE INDEX "home_blocks_impacto_order_idx" ON "home_blocks_impacto" USING btree ("_order");
  CREATE INDEX "home_blocks_impacto_parent_id_idx" ON "home_blocks_impacto" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_impacto_path_idx" ON "home_blocks_impacto" USING btree ("_path");
  CREATE INDEX "home_blocks_comercio_order_idx" ON "home_blocks_comercio" USING btree ("_order");
  CREATE INDEX "home_blocks_comercio_parent_id_idx" ON "home_blocks_comercio" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_comercio_path_idx" ON "home_blocks_comercio" USING btree ("_path");
  CREATE INDEX "home_blocks_sponsors_order_idx" ON "home_blocks_sponsors" USING btree ("_order");
  CREATE INDEX "home_blocks_sponsors_parent_id_idx" ON "home_blocks_sponsors" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_sponsors_path_idx" ON "home_blocks_sponsors" USING btree ("_path");
  CREATE INDEX "home_blocks_novedades_order_idx" ON "home_blocks_novedades" USING btree ("_order");
  CREATE INDEX "home_blocks_novedades_parent_id_idx" ON "home_blocks_novedades" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_novedades_path_idx" ON "home_blocks_novedades" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_cifras" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_historia" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_linea_de_tiempo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_streaming" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_visita" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_servicios" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_impacto" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_comercio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_novedades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_blocks_cifras" CASCADE;
  DROP TABLE "home_blocks_historia" CASCADE;
  DROP TABLE "home_blocks_linea_de_tiempo" CASCADE;
  DROP TABLE "home_blocks_streaming" CASCADE;
  DROP TABLE "home_blocks_visita" CASCADE;
  DROP TABLE "home_blocks_servicios" CASCADE;
  DROP TABLE "home_blocks_impacto" CASCADE;
  DROP TABLE "home_blocks_comercio" CASCADE;
  DROP TABLE "home_blocks_sponsors" CASCADE;
  DROP TABLE "home_blocks_novedades" CASCADE;
  DROP TABLE "home" CASCADE;
  ALTER TABLE "servicios" ALTER COLUMN "internet_diario_detalle" SET DEFAULT 'Valido por 24 horas para 1 dispositivo.';
  ALTER TABLE "servicios" ALTER COLUMN "internet_mensual_detalle" SET DEFAULT '30 dias corridos para locatarios y personal.';
  ALTER TABLE "servicios" ALTER COLUMN "estacionamiento_titulo" SET DEFAULT 'Estadia Completa';
  ALTER TABLE "contacto" ALTER COLUMN "direccion" SET DEFAULT 'Rene Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina';
  ALTER TABLE "contacto" ALTER COLUMN "horarios" SET DEFAULT 'Lunes, miercoles y sabado de 7:00 a 14:00 hs.';
  ALTER TABLE "contacto" ALTER COLUMN "whatsapp_mensaje" SET DEFAULT 'Hola Feria Urkupina, quisiera realizar una consulta.';
  ALTER TABLE "contacto" ALTER COLUMN "whatsapp_alquiler_mensaje" SET DEFAULT 'Hola! Quiero consultar por el alquiler de un puesto en Paseo Urkupina';`)
}

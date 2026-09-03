import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "numeros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"puestos" varchar DEFAULT '2.200+' NOT NULL,
  	"personas_diarias" varchar DEFAULT '5.000+' NOT NULL,
  	"empleos" varchar DEFAULT '5.000+' NOT NULL,
  	"anios_trayectoria" varchar DEFAULT '30+' NOT NULL,
  	"dias_actividad" varchar DEFAULT '365' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "servicios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internet_diario_precio" varchar DEFAULT '$1.000' NOT NULL,
  	"internet_diario_moneda" varchar DEFAULT 'ARS' NOT NULL,
  	"internet_diario_detalle" varchar DEFAULT 'Valido por 24 horas para 1 dispositivo.' NOT NULL,
  	"internet_mensual_precio" varchar DEFAULT '$10.000' NOT NULL,
  	"internet_mensual_moneda" varchar DEFAULT 'ARS' NOT NULL,
  	"internet_mensual_detalle" varchar DEFAULT '30 dias corridos para locatarios y personal.' NOT NULL,
  	"estacionamiento_precio" varchar DEFAULT '$10.000' NOT NULL,
  	"estacionamiento_moneda" varchar DEFAULT 'ARS' NOT NULL,
  	"estacionamiento_titulo" varchar DEFAULT 'Estadia Completa' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contacto" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"direccion" varchar DEFAULT 'Rene Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina' NOT NULL,
  	"email" varchar DEFAULT 'contacto.urku@gmail.com' NOT NULL,
  	"horarios" varchar DEFAULT 'Lunes, miercoles y sabado de 7:00 a 14:00 hs.' NOT NULL,
  	"whatsapp_numero" varchar DEFAULT '541124240338' NOT NULL,
  	"whatsapp_visible" varchar DEFAULT '+54 11 2424-0338' NOT NULL,
  	"whatsapp_mensaje" varchar DEFAULT 'Hola Feria Urkupina, quisiera realizar una consulta.' NOT NULL,
  	"redes_instagram" varchar DEFAULT 'https://www.instagram.com/urkupina.s.a/?hl=es',
  	"redes_facebook" varchar DEFAULT 'https://www.facebook.com/urkupinaSA/?locale=es_LA',
  	"redes_youtube" varchar DEFAULT 'https://youtube.com/@ULIVE_STREAM',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "numeros" CASCADE;
  DROP TABLE "servicios" CASCADE;
  DROP TABLE "contacto" CASCADE;`)
}

import { getPayload } from 'payload';
import config from '@payload-config';

import {
  NUMEROS_RESPALDO,
  PRECIOS_RESPALDO,
  CONTACTO_RESPALDO,
  ALQUILER_RESPALDO,
  type NumerosDelPredio,
  type PreciosDeServicios,
  type DatosDeContacto,
} from "@/lib/contenido/tipos";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Secciones, { type BloqueDeSeccion } from "@/components/home/Secciones";
import { type SponsorVisible } from "@/components/home/SponsorShowcase";
import ContactSection from "@/components/home/ContactSection";
import SiteFooter from "@/components/layout/SiteFooter";

/**
 * Orden con el que la home venia armada antes de existir el armador (es el
 * mismo que trae la ficha "home" como valor inicial). Se usa como respaldo:
 * una caida de base no puede dejar la pagina sin secciones.
 */
const ORDEN_POR_DEFECTO: BloqueDeSeccion[] = [
  'cifras', 'historia', 'lineaDeTiempo', 'streaming', 'visita',
  'servicios', 'impacto', 'comercio', 'sponsors', 'novedades',
].map((blockType) => ({ blockType }));

/**
 * Si la base no responde se devuelve null y la seccion cae a sus valores de
 * respaldo. Hasta ahora el contenido era estatico y la home no se caia nunca:
 * seria un retroceso que una caida de base la deje en blanco.
 */
async function obtenerSponsors(): Promise<SponsorVisible[] | null> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'sponsors',
      where: { activo: { equals: true } },
      sort: 'orden',
      limit: 50,
      depth: 1,
    });

    return docs.map((sponsor) => ({
      nombre: sponsor.nombre,
      categoria: sponsor.categoria ?? '',
      tamano: sponsor.tamano === 'grande' ? 'grande' : 'normal',
      logo:
        typeof sponsor.logo === 'object' && sponsor.logo !== null
          ? (sponsor.logo.url ?? '')
          : '',
      alt:
        typeof sponsor.logo === 'object' && sponsor.logo !== null
          ? (sponsor.logo.alt ?? sponsor.nombre)
          : sponsor.nombre,
    }));
  } catch (error) {
    console.error('[home] no se pudieron leer los sponsors:', error);
    return null;
  }
}

async function obtenerNumeros(): Promise<NumerosDelPredio | null> {
  try {
    const payload = await getPayload({ config });
    const numeros = await payload.findGlobal({ slug: 'numeros' });
    return {
      puestos: numeros.puestos,
      personasDiarias: numeros.personasDiarias,
      empleos: numeros.empleos,
      aniosTrayectoria: numeros.aniosTrayectoria,
      diasActividad: numeros.diasActividad,
    };
  } catch (error) {
    console.error('[home] no se pudieron leer los numeros:', error);
    return null;
  }
}

async function obtenerPrecios(): Promise<PreciosDeServicios | null> {
  try {
    const payload = await getPayload({ config });
    const servicios = await payload.findGlobal({ slug: 'servicios' });
    const condiciones = servicios.alquiler?.condiciones;
    return {
      internet: {
        diario: {
          precio: servicios.internet.diario.precio,
          moneda: servicios.internet.diario.moneda,
          detalle: servicios.internet.diario.detalle,
        },
        mensual: {
          precio: servicios.internet.mensual.precio,
          moneda: servicios.internet.mensual.moneda,
          detalle: servicios.internet.mensual.detalle,
        },
      },
      estacionamiento: {
        precio: servicios.estacionamiento.precio,
        moneda: servicios.estacionamiento.moneda,
        titulo: servicios.estacionamiento.titulo,
      },
      alquiler:
        condiciones && condiciones.length > 0
          ? condiciones.map((condicion) => ({
              titulo: condicion.titulo,
              detalle: condicion.detalle,
            }))
          : ALQUILER_RESPALDO,
    };
  } catch (error) {
    console.error('[home] no se pudieron leer los precios:', error);
    return null;
  }
}

async function obtenerSecciones(): Promise<BloqueDeSeccion[] | null> {
  try {
    const payload = await getPayload({ config });
    const home = await payload.findGlobal({ slug: 'home' });
    return home.secciones ?? null;
  } catch (error) {
    console.error('[home] no se pudo leer el armado de secciones:', error);
    return null;
  }
}

async function obtenerContacto(): Promise<DatosDeContacto | null> {
  try {
    const payload = await getPayload({ config });
    const contacto = await payload.findGlobal({ slug: 'contacto' });
    return {
      direccion: contacto.direccion,
      email: contacto.email,
      horarios: contacto.horarios,
      whatsapp: {
        numero: contacto.whatsapp.numero,
        visible: contacto.whatsapp.visible,
        mensaje: contacto.whatsapp.mensaje,
      },
      whatsappAlquiler: {
        numero: contacto.whatsappAlquiler.numero,
        mensaje: contacto.whatsappAlquiler.mensaje,
      },
      redes: {
        instagram: contacto.redes?.instagram ?? '',
        facebook: contacto.redes?.facebook ?? '',
        youtube: contacto.redes?.youtube ?? '',
      },
    };
  } catch (error) {
    console.error('[home] no se pudo leer el contacto:', error);
    return null;
  }
}

export default async function Home() {
  const [sponsors, numeros, precios, contacto, secciones] = await Promise.all([
    obtenerSponsors(),
    obtenerNumeros(),
    obtenerPrecios(),
    obtenerContacto(),
    obtenerSecciones(),
  ]);
  const cifras = numeros ?? NUMEROS_RESPALDO;
  const tarifas = precios ?? PRECIOS_RESPALDO;
  const datosContacto = contacto ?? CONTACTO_RESPALDO;
  // Si la consulta fallo (null) o la ficha quedo sin bloques (lista vacia),
  // se arma con el orden por defecto: una caida de base no puede dejar la
  // home sin secciones.
  const bloques = secciones && secciones.length > 0 ? secciones : ORDEN_POR_DEFECTO;

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Secciones
          bloques={bloques}
          numeros={cifras}
          precios={tarifas}
          contacto={datosContacto}
          sponsors={sponsors}
        />
        <ContactSection contacto={datosContacto} />
      </main>
      <SiteFooter contacto={datosContacto} />
    </>
  );
}

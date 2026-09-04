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
import {
  NOVEDADES_RESPALDO,
  aNovedadVisible,
  ordenarNovedades,
  type NovedadVisible,
} from "@/lib/contenido/novedades";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Secciones, { type BloqueDeSeccion } from "@/components/home/Secciones";
import { type SponsorVisible } from "@/components/home/SponsorShowcase";
import ContactSection from "@/components/home/ContactSection";
import SiteFooter from "@/components/layout/SiteFooter";
import PopupBienvenida from "@/components/home/PopupBienvenida";
import { aPopupVisible, type PopupVisible } from "@/lib/contenido/popup";

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

/**
 * Tope del campo "cantidad" del bloque de novedades. Se consultan todas de
 * una y despues cada bloque se queda con las que pidio: asi la consulta sigue
 * saliendo en paralelo con las demas, sin esperar a saber que dice la ficha.
 */
const MAXIMO_DE_NOVEDADES = 12;

async function obtenerNovedades(): Promise<NovedadVisible[] | null> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      // La fecha de publicacion manda; las notas que no la tienen cargada se
      // ordenan por cuando se crearon.
      sort: ['-publishedAt', '-createdAt'],
      limit: MAXIMO_DE_NOVEDADES,
      // depth 1 trae la categoria y la imagen destacada pobladas.
      depth: 1,
    });

    return ordenarNovedades(docs.map((post) => aNovedadVisible(post)));
  } catch (error) {
    console.error('[home] no se pudieron leer las novedades:', error);
    return null;
  }
}

async function obtenerPopup(): Promise<PopupVisible | null> {
  try {
    const payload = await getPayload({ config });
    // depth 1 trae la imagen poblada; sin eso llega solo el id.
    const popup = await payload.findGlobal({ slug: 'popup', depth: 1 });
    return aPopupVisible(popup);
  } catch (error) {
    console.error('[home] no se pudo leer el popup:', error);
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
  const [sponsors, numeros, precios, contacto, secciones, notas, popup] = await Promise.all([
    obtenerSponsors(),
    obtenerNumeros(),
    obtenerPrecios(),
    obtenerContacto(),
    obtenerSecciones(),
    obtenerNovedades(),
    obtenerPopup(),
  ]);
  const cifras = numeros ?? NUMEROS_RESPALDO;
  const tarifas = precios ?? PRECIOS_RESPALDO;
  const datosContacto = contacto ?? CONTACTO_RESPALDO;
  // Si la consulta fallo (null) o la ficha quedo sin bloques (lista vacia),
  // se arma con el orden por defecto: una caida de base no puede dejar la
  // home sin secciones.
  const bloques = secciones && secciones.length > 0 ? secciones : ORDEN_POR_DEFECTO;
  // Mientras no haya ninguna nota publicada se muestran las de ejemplo: una
  // seccion de novedades vacia se ve peor que una con contenido de muestra.
  const novedades = notas && notas.length > 0 ? notas : NOVEDADES_RESPALDO;

  return (
    <>
      {popup && <PopupBienvenida popup={popup} />}
      <Navbar />
      <main id="main">
        <Hero />
        <Secciones
          bloques={bloques}
          numeros={cifras}
          precios={tarifas}
          contacto={datosContacto}
          sponsors={sponsors}
          novedades={novedades}
        />
        <ContactSection contacto={datosContacto} />
      </main>
      <SiteFooter contacto={datosContacto} />
    </>
  );
}

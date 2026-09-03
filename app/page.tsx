import { getPayload } from 'payload';
import config from '@payload-config';

import {
  NUMEROS_RESPALDO,
  PRECIOS_RESPALDO,
  type NumerosDelPredio,
  type PreciosDeServicios,
} from "@/lib/contenido/tipos";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HeroStats from "@/components/home/HeroStats";
import Story from "@/components/home/Story";
import Timeline from "@/components/home/Timeline";
import StreamingPreview from "@/components/home/StreamingPreview";
import VisitSection from "@/components/home/VisitSection";
import ServicesHubSection from "@/components/home/ServicesHubSection";
import ImpactGrid from "@/components/home/ImpactGrid";
import CommerceSection from "@/components/home/CommerceSection";
import SponsorShowcase, { type SponsorVisible } from "@/components/home/SponsorShowcase";
import NewsFeed from "@/components/home/NewsFeed";
import ContactSection from "@/components/home/ContactSection";
import SiteFooter from "@/components/layout/SiteFooter";

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
    };
  } catch (error) {
    console.error('[home] no se pudieron leer los precios:', error);
    return null;
  }
}

export default async function Home() {
  const [sponsors, numeros, precios] = await Promise.all([
    obtenerSponsors(),
    obtenerNumeros(),
    obtenerPrecios(),
  ]);
  const cifras = numeros ?? NUMEROS_RESPALDO;
  const tarifas = precios ?? PRECIOS_RESPALDO;

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <HeroStats numeros={cifras} />
        <Story />
        <Timeline />
        <StreamingPreview />
        <VisitSection numeros={cifras} />
        <ServicesHubSection precios={tarifas} />
        <ImpactGrid numeros={cifras} />
        <CommerceSection numeros={cifras} />
        <SponsorShowcase sponsors={sponsors} />
        <NewsFeed />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}

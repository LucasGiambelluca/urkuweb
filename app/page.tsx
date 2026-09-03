import { getPayload } from 'payload';
import config from '@payload-config';

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

export default async function Home() {
  const sponsors = await obtenerSponsors();

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <HeroStats />
        <Story />
        <Timeline />
        <StreamingPreview />
        <VisitSection />
        <ServicesHubSection />
        <ImpactGrid />
        <CommerceSection />
        <SponsorShowcase sponsors={sponsors} />
        <NewsFeed />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}

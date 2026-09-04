import type {
  NumerosDelPredio,
  PreciosDeServicios,
  DatosDeContacto,
} from "@/lib/contenido/tipos";

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

/**
 * Forma minima de un bloque de la ficha "home". Se define suelta (en vez de
 * importar el tipo union que genera Payload) a proposito: el orden por
 * defecto que se usa cuando la consulta falla no trae "id" ni "blockName",
 * y el blockType tiene que poder ser cualquier string para que un bloque
 * desconocido no rompa el tipado ni el render.
 */
export type BloqueDeSeccion = {
  id?: string | null;
  blockType: string;
  cantidad?: number;
};

type PropsDeSecciones = {
  bloques: BloqueDeSeccion[];
  numeros: NumerosDelPredio;
  precios: PreciosDeServicios;
  contacto: DatosDeContacto;
  sponsors: SponsorVisible[] | null;
};

/**
 * Traduce los bloques de la ficha "home" a las secciones que van entre la
 * portada y el contacto. Componente de servidor: solo arma JSX a partir de
 * datos que ya se consultaron en la pagina, no consulta nada por su cuenta.
 */
export default function Secciones({ bloques, numeros, precios, contacto, sponsors }: PropsDeSecciones) {
  return (
    <>
      {bloques.map((bloque, indice) => {
        // Los bloques de Payload traen "id"; si falta (como en el orden por
        // defecto, que no pasa por la base), se cae al indice.
        const key = bloque.id ?? indice;

        switch (bloque.blockType) {
          case 'cifras':
            return <HeroStats key={key} numeros={numeros} />;
          case 'historia':
            return <Story key={key} numeros={numeros} />;
          case 'lineaDeTiempo':
            return <Timeline key={key} />;
          case 'streaming':
            return <StreamingPreview key={key} canalYoutube={contacto.redes.youtube} />;
          case 'visita':
            return <VisitSection key={key} numeros={numeros} />;
          case 'servicios':
            return <ServicesHubSection key={key} precios={precios} numeros={numeros} contacto={contacto} />;
          case 'impacto':
            return <ImpactGrid key={key} numeros={numeros} />;
          case 'comercio':
            return <CommerceSection key={key} numeros={numeros} />;
          case 'sponsors':
            return <SponsorShowcase key={key} sponsors={sponsors} />;
          case 'novedades':
            // El bloque trae "cantidad" pero NewsFeed todavia no recibe
            // props: se deja el campo listo del lado de Payload sin
            // inventarle una prop al componente que no la acepta.
            return <NewsFeed key={key} />;
          default:
            // Un blockType que no reconocemos no puede tirar abajo la
            // pagina: pasa si alguien saca un bloque del codigo (deja de
            // registrarse en BLOQUES_DE_SECCION) pero la ficha en la base
            // todavia lo tiene guardado en "secciones".
            return null;
        }
      })}
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ChevronDown, MapPin, MoveRight } from "lucide-react";
import { useState } from "react";

import Formulario from "@/components/home/Formulario";
import type { CampoDeFormulario } from "@/lib/formularios/validacion";

type FormularioExpo = {
  id: string | number;
  campos: CampoDeFormulario[];
  anchos: Record<string, number>;
  textoDelBoton: string;
  mensajeDeGracias: string;
};

const BENEFICIOS = [
  ["01", "Exposición directa", "Tu propuesta frente a quienes ya recorren el paseo con intención comercial."],
  ["02", "Nuevos contactos", "Compradores, comerciantes, fabricantes y revendedores en un mismo recorrido."],
  ["03", "Demostración", "Un contexto pensado para presentar productos, activaciones y lanzamientos."],
  ["04", "Continuidad", "Una oportunidad para abrir conversaciones, alianzas y nuevos canales."],
];

const RUBROS = [
  ["Autos & motos", "Movilidad, financiación y utilitarios."],
  ["Telas & insumos", "Textiles, materias primas y accesorios."],
  ["Electrohogar", "Tecnología, línea blanca y productos para el hogar."],
  ["Bancos & fintech", "Financiación, cobros y medios de pago."],
  ["Maquinaria", "Equipamiento, máquinas y soluciones de producción."],
  ["Servicios B2B", "Logística, seguros, telecomunicaciones y software."],
];

const PLANES = {
  stands: { label: "Stands", value: "21 espacios", detail: "14 laterales y 7 centrales para propuestas comerciales." },
  escenario: { label: "Escenario", value: "16 × 20 m", detail: "Escenario y pasarela para presentaciones en vivo." },
  gastronomia: { label: "Gastronomía", value: "10 food trucks", detail: "Zona proyectada para acompañar el recorrido." },
};

const TAB_IMAGES: Record<keyof typeof PLANES, { src: string; alt: string; title: string }> = {
  stands: {
    src: "/images/events/eventoexpo.jpeg",
    alt: "Stands y área comercial EXPO URKU 2026",
    title: "Zona de Stands & Exposición Comercial",
  },
  escenario: {
    src: "/images/events/eventoexpo2.jpeg",
    alt: "Escenario principal y pasarela EXPO URKU 2026",
    title: "Escenario Principal & Presentaciones",
  },
  gastronomia: {
    src: "/images/events/decenital.jpg",
    alt: "Zona gastronómica Paseo Urkupiña",
    title: "Patio Gastronómico & Recreación",
  },
};

export default function ExpoExperience({ formulario }: { formulario: FormularioExpo | null }) {
  const [planoActivo, setPlanoActivo] = useState<keyof typeof PLANES>("stands");
  const [rubroAbierto, setRubroAbierto] = useState(0);

  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-[#FAF9F5] text-[#0B1933] dark:bg-[#060911] dark:text-[#F4F6FB] transition-colors duration-500 focus:outline-none">
      {/* INVERTED MINIMALIST 100VH HERO SECTION */}
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FAF9F5] text-[#0B1933] dark:bg-[#060911] dark:text-[#F4F6FB] pt-28 pb-16 lg:py-0 transition-colors duration-500" aria-label="Portada EXPO URKU 2026">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B1933_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.05] dark:opacity-[0.08]" aria-hidden="true" />
        
        {/* Ambient background blur accents */}
        <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-[#EB2347]/10 dark:bg-[#EB2347]/20 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-[#1C9FE4]/10 dark:bg-[#1C9FE4]/20 blur-3xl pointer-events-none" aria-hidden="true" />

        {/* FLAT Image Outside Grid Left: elemtnsleft.png (-18px) */}
        <div className="absolute -left-[61px] top-1/2 -translate-y-1/2 z-10 hidden lg:block pointer-events-none select-none">
          <Image
            src="/images/events/elemtnsleft.png"
            alt=""
            width={340}
            height={640}
            className="h-[520px] xl:h-[620px] w-auto object-contain object-left"
            aria-hidden="true"
          />
        </div>

        {/* FLAT Image Outside Grid Right: elementsright.png (-81px) */}
        <div className="absolute -right-[81px] top-1/2 -translate-y-1/2 z-10 hidden lg:block pointer-events-none select-none">
          <Image
            src="/images/events/elementsright.png"
            alt=""
            width={300}
            height={600}
            className="h-[480px] xl:h-[580px] w-auto object-contain object-right"
            aria-hidden="true"
          />
        </div>

        {/* Main Grid Container (Centered Content) */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            
            {/* Left Content Column */}
            <div className="flex flex-col items-start text-left">
              {/* Event Feature Badge */}
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#0B1933]/15 bg-white/90 text-[#0B1933] dark:border-white/20 dark:bg-white/10 dark:text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[.18em] shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#EB2347] animate-pulse" aria-hidden="true" />
                <span>Ronda de Negocios · 2026</span>
              </div>

              {/* Logo EXPO URKU (Crisp, High Contrast on Light/Dark Canvas) */}
              <div className="mb-6 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px]">
                <Image
                  src="/images/logoexpourku.png"
                  alt="Logo EXPO URKU 2026 - Ronda de Negocios"
                  width={700}
                  height={241}
                  priority
                  className="h-auto w-full object-contain filter dark:brightness-110"
                />
              </div>

              {/* Main Headline */}
              <h1 className="max-w-2xl font-display text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold uppercase leading-[.92] tracking-[-.05em] text-[#0B1933] dark:text-white">
                Donde los negocios se encuentran.
              </h1>

              {/* Subtitle */}
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#3B465A] dark:text-white/80 sm:text-xl font-normal">
                Un nuevo espacio para conectar marcas, comerciantes, fabricantes, revendedores y compradores de todo el país.
              </p>

              {/* CTA Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-4 sm:gap-6">
                <a
                  href="#inscripcion"
                  className="group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#EB2347] px-8 py-4 text-sm font-extrabold uppercase tracking-[.1em] text-white shadow-xl shadow-[#EB2347]/20 transition-all duration-300 hover:bg-[#0B1933] dark:hover:bg-white dark:hover:text-[#0B1933] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1933] focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Quiero participar <ArrowRight className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" size={18} aria-hidden="true" />
                </a>
                <a
                  href="#espacio"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[#0B1933]/25 bg-white/60 text-[#0B1933] dark:border-white/30 dark:bg-white/10 dark:text-white transition-all duration-300 hover:border-[#0B1933] hover:bg-white dark:hover:bg-white dark:hover:text-[#0B1933] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1933] focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Conocé el espacio <ArrowDownRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Right Card / Visual Feature */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#0B1933]/10 bg-white text-[#0B1933] dark:border-white/15 dark:bg-[#0F1C36] dark:text-white p-4 shadow-2xl shadow-[#0B1933]/10 sm:p-6 transition-colors duration-500">
                {/* Visual Image container */}
                <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-[#0B1933] sm:h-72">
                  <Image
                    src="/images/popup/expourku.jpg"
                    alt="Paseo Urkupiña predio comercial"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1933]/90 via-[#0B1933]/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#7DD3FC]">Lomas de Zamora</span>
                    <p className="mt-1 font-display text-xl font-bold uppercase tracking-tight">Paseo Comercial Urkupiña</p>
                  </div>
                </div>

                {/* Event Schedule Info */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#0B1933]/10 dark:border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-[.14em] text-[#606C80] dark:text-white/70">Fechas</span>
                    <span className="font-display text-lg font-extrabold text-[#0B1933] dark:text-white">16 · 18 · 19 · 21 Nov 2026</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#0B1933]/10 dark:border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-[.14em] text-[#606C80] dark:text-white/70">Horario</span>
                    <span className="font-display text-base font-bold text-[#0B1933] dark:text-white">07:00 a 17:00 hs</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold uppercase tracking-[.14em] text-[#606C80] dark:text-white/70">Ubicación</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#EB2347]">Bruno Tavano 4900</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INSTANCIA COMERCIAL */}
      <section className="relative bg-white dark:bg-[#080E1C] py-24 sm:py-32 transition-colors duration-500" aria-labelledby="instancia-comercial-title">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#D3183B] dark:text-[#EB2347]">Una nueva instancia comercial</p>
          <div className="mt-6 grid gap-12 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <h2 id="instancia-comercial-title" className="max-w-4xl font-display text-[clamp(2.8rem,6vw,5.8rem)] font-bold uppercase leading-[.88] tracking-[-.055em] text-[#0B1933] dark:text-white">
              Una expo que nace dentro de un ecosistema comercial real.
            </h2>
            <p className="max-w-md border-l-2 border-[#EB2347] pl-6 text-lg leading-relaxed text-[#394356] dark:text-white/80">
              Una experiencia construida alrededor de un público que llega a buscar productos, proveedores y oportunidades.
            </p>
          </div>
        </div>
      </section>

      {/* METRICAS */}
      <section className="bg-[#273961] dark:bg-[#0B1832] py-20 text-white sm:py-28 transition-colors duration-500" aria-label="Estadísticas e impacto comercial">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#7DD3FC]">El contexto</p>
          <div className="mt-10 grid gap-y-10 md:grid-cols-4 md:gap-x-8">
            {[["6–8K", "Visitantes por jornada"], ["2.500", "Puestos comerciales"], ["2.500", "Propietarios de puestos"], ["1.500", "Autos en estacionamiento"]].map(([numero, etiqueta]) => (
              <div key={etiqueta} className="border-l border-white/25 dark:border-white/20 pl-5 first:border-l-0 first:pl-0">
                <p className="font-display text-6xl font-bold leading-none tracking-[-.06em] sm:text-7xl">{numero}</p>
                <p className="mt-3 max-w-32 text-xs font-bold uppercase leading-relaxed tracking-[.14em] text-white/80">{etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-[#FAF9F5] dark:bg-[#060911] transition-colors duration-500" aria-labelledby="beneficios-title">
        {/* FLAT Image Outside Grid Left: imgurkuexpo1.png (-18px) */}
        <div className="absolute -left-[61px] top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none select-none">
          <Image
            src="/images/events/imgurkuexpo1.png"
            alt="EXPO URKU Evento Izquierda"
            width={320}
            height={620}
            className="h-[460px] xl:h-[560px] w-auto object-contain object-left"
          />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#D3183B] dark:text-[#EB2347]">Más que un stand</p>
              <h2 id="beneficios-title" className="mt-3 font-display text-5xl font-bold uppercase leading-[.85] tracking-[-.05em] sm:text-7xl text-[#0B1933] dark:text-white">Razones para estar</h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-[#394356] dark:text-white/80">Una selección de beneficios para entender la oportunidad sin convertirla en una lista interminable.</p>
          </div>
          <div className="mt-14 grid gap-x-0 gap-y-px bg-[#D9DEE5] dark:bg-white/10 md:grid-cols-2">
            {BENEFICIOS.map(([numero, titulo, descripcion]) => (
              <article key={numero} className="group bg-[#F7F6F1] dark:bg-[#0F1C36] px-7 py-9 transition-colors hover:bg-white dark:hover:bg-[#142647] sm:px-10 sm:py-12">
                <span className="font-display text-2xl font-bold text-[#D3183B] dark:text-[#EB2347]">{numero}</span>
                <h3 className="mt-10 font-display text-4xl font-bold uppercase leading-none tracking-[-.04em] text-[#0B1933] dark:text-white">{titulo}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-[#394356] dark:text-white/80">{descripcion}</p>
                <MoveRight className="mt-8 text-[#0284C7] dark:text-[#38BDF8] transition-transform group-hover:translate-x-2 motion-reduce:transform-none" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EL ESPACIO */}
      <section id="espacio" className="bg-[#0B1933] dark:bg-[#040A17] py-24 text-white sm:py-32 transition-colors duration-500" aria-labelledby="espacio-title">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#7DD3FC]">El espacio</p>
          <div className="mt-4 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <h2 id="espacio-title" className="max-w-3xl font-display text-[clamp(2.8rem,6vw,5.8rem)] font-bold uppercase leading-[.84] tracking-[-.055em]">1.300 m² para hacer negocios</h2>
            <p className="max-w-sm text-lg leading-relaxed text-white/80">Explorá las piezas centrales de la propuesta espacial.</p>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div className="flex flex-col justify-between">
              <div className="space-y-1" role="tablist" aria-label="Planos del espacio EXPO URKU">
                {(Object.entries(PLANES) as [keyof typeof PLANES, (typeof PLANES)[keyof typeof PLANES]][]).map(([clave, plan]) => {
                  const esActivo = planoActivo === clave;
                  return (
                    <button
                      key={clave}
                      id={`tab-${clave}`}
                      role="tab"
                      aria-selected={esActivo}
                      aria-controls={`panel-${clave}`}
                      onClick={() => setPlanoActivo(clave)}
                      className={`flex min-h-[56px] w-full items-center justify-between border-b border-white/20 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3FC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1933] ${
                        esActivo ? "text-white" : "text-white/60 hover:text-white/90"
                      }`}
                    >
                      <span className="font-display text-3xl font-bold uppercase tracking-[-.03em]">{plan.label}</span>
                      <span className={`h-3 w-3 rotate-45 transition-colors ${esActivo ? "bg-[#EB2347]" : "bg-white/30"}`} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <div
                id={`panel-${planoActivo}`}
                role="tabpanel"
                aria-labelledby={`tab-${planoActivo}`}
                className="mt-12 border-l-2 border-[#EB2347] pl-5 focus-visible:outline-none"
              >
                <p className="font-display text-4xl font-bold uppercase leading-none">{PLANES[planoActivo].value}</p>
                <p className="mt-3 max-w-xs leading-relaxed text-white/80">{PLANES[planoActivo].detail}</p>
              </div>
            </div>
            
            {/* Right Panel Image Showcase for selected Tab */}
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10 dark:border-white/15 bg-[#0B1933] dark:bg-[#071126] p-3 shadow-2xl sm:p-4" aria-label="Vista del espacio seleccionado">
              <div className="relative h-full w-full min-h-[380px] overflow-hidden rounded-2xl bg-[#0B1933]">
                <Image
                  key={planoActivo}
                  src={TAB_IMAGES[planoActivo].src}
                  alt={TAB_IMAGES[planoActivo].alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1933]/90 via-[#0B1933]/30 to-transparent" />
                
                {/* Active Tab Badge */}
                <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 backdrop-blur-md border border-white/20">
                  <span className="h-2 w-2 rounded-full bg-[#EB2347] animate-pulse" aria-hidden="true" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                    {PLANES[planoActivo].label} · {PLANES[planoActivo].value}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#7DD3FC]">Infraestructura EXPO URKU</span>
                  <p className="mt-1 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                    {TAB_IMAGES[planoActivo].title}
                  </p>
                  <p className="mt-1.5 text-xs text-white/80 max-w-md leading-relaxed">
                    {PLANES[planoActivo].detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RUBROS / PARA QUIÉN ES */}
      <section className="py-24 sm:py-32 bg-[#FAF9F5] dark:bg-[#060911] text-[#0B1933] dark:text-white transition-colors duration-500" aria-labelledby="rubros-title">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-10 lg:grid-cols-[.76fr_1.24fr] lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#D3183B] dark:text-[#EB2347]">Para quién es</p>
            <h2 id="rubros-title" className="mt-4 font-display text-5xl font-bold uppercase leading-[.85] tracking-[-.05em] sm:text-6xl text-[#0B1933] dark:text-white">Marcas que mueven el paseo</h2>
            <p className="mt-8 max-w-md leading-relaxed text-[#394356] dark:text-white/80">Sectores llamados a presentar soluciones que sumen valor a la comunidad comercial de Urkupiña.</p>
          </div>
          <div className="border-t border-[#BFC6D0] dark:border-white/20">
            {RUBROS.map(([titulo, detalle], indice) => {
              const estaAbierto = rubroAbierto === indice;
              const botonId = `rubro-btn-${indice}`;
              const contenidoId = `rubro-content-${indice}`;
              return (
                <div key={titulo} className="border-b border-[#BFC6D0] dark:border-white/20">
                  <button
                    id={botonId}
                    aria-expanded={estaAbierto}
                    aria-controls={contenidoId}
                    onClick={() => setRubroAbierto(estaAbierto ? -1 : indice)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1933] dark:focus-visible:ring-white focus-visible:ring-offset-2"
                  >
                    <span className="font-display text-3xl font-bold uppercase leading-none tracking-[-.04em] sm:text-4xl text-[#0B1933] dark:text-white">{titulo}</span>
                    <ChevronDown className={`shrink-0 text-[#EB2347] transition-transform motion-reduce:transform-none ${estaAbierto ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {estaAbierto && (
                    <div id={contenidoId} role="region" aria-labelledby={botonId} className="max-w-lg pb-6">
                      <p className="text-lg leading-relaxed text-[#394356] dark:text-white/80">{detalle}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* JORNADAS */}
      <section className="relative overflow-hidden bg-[#1C9FE4] dark:bg-[#0284C7] py-20 text-[#0B1933] dark:text-white sm:py-28 transition-colors duration-500" aria-labelledby="jornadas-title">
        {/* FLAT Image Outside Grid Right: imgurkuexpo.png (-81px) */}
        <div className="absolute -right-[81px] top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none select-none">
          <Image
            src="/images/events/imgurkuexpo.png"
            alt="EXPO URKU Evento Derecha Cuatro Jornadas"
            width={320}
            height={620}
            className="h-[460px] xl:h-[560px] w-auto object-contain object-right"
          />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[.22em]">Cuatro jornadas</p>
          <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <h2 id="jornadas-title" className="max-w-3xl font-display text-[clamp(2.8rem,6vw,5.8rem)] font-bold uppercase leading-[.84] tracking-[-.055em] text-[#0B1933] dark:text-white">Una misma oportunidad</h2>
            <p className="max-w-sm text-lg leading-relaxed text-[#0B1933]/85 dark:text-white/90">En horario de feria, para conversar con un flujo comercial real.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-y-9 border-t border-[#0B1933]/30 dark:border-white/30 pt-7 sm:grid-cols-4">
            {[["Lun", "16"], ["Mié", "18"], ["Jue", "19"], ["Sáb", "21"]].map(([dia, numero]) => (
              <div key={numero} className="border-l border-[#0B1933]/30 dark:border-white/30 pl-5 first:border-l-0 first:pl-0">
                <p className="font-display text-6xl font-bold leading-none tracking-[-.06em] sm:text-7xl text-[#0B1933] dark:text-white">{numero}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[.18em]">{dia} · Noviembre</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm font-bold uppercase tracking-[.18em]">7:00 a 17:00 hs</p>
        </div>
      </section>

      {/* INSCRIPCION */}
      <section id="inscripcion" className="relative bg-white dark:bg-[#080E1C] py-24 sm:py-32 transition-colors duration-500" aria-labelledby="inscripcion-title">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[#F4F2EA] dark:bg-[#0B162C]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[.85fr_1.15fr] lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#D3183B] dark:text-[#EB2347]">Participá</p>
            <h2 id="inscripcion-title" className="mt-4 font-display text-[clamp(3.2rem,5.5vw,5.5rem)] font-bold uppercase leading-[.84] tracking-[-.055em] text-[#0B1933] dark:text-white">Hagamos que suceda</h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#394356] dark:text-white/80">Marcas, empresas, proveedores y aliados estratégicos están invitados a ser parte de esta nueva ronda de negocios.</p>
            
            {/* QR Code Consultation Box */}
            <div className="mt-10 max-w-md rounded-2xl border-2 border-[#0B1933]/15 bg-[#FAF9F5] text-[#0B1933] dark:border-white/20 dark:bg-[#0F1C36] dark:text-white p-6 shadow-lg shadow-[#0B1933]/5 transition-all hover:border-[#EB2347]/40">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-[#0B1933]/10 bg-white dark:border-white/20 p-2 shadow-inner">
                  <Image
                    src="/images/events/qrexpourku.png"
                    alt="Código QR para consultar por espacios disponibles en EXPO URKU 2026"
                    width={473}
                    height={473}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <span className="inline-block rounded-full bg-[#EB2347]/10 dark:bg-[#EB2347]/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#EB2347]">
                    Contacto directo
                  </span>
                  <h3 className="mt-2 font-display text-xl font-extrabold uppercase leading-tight text-[#0B1933] dark:text-white">
                    Consultá por espacios disponibles
                  </h3>
                  <p className="mt-1 text-xs text-[#526076] dark:text-white/70 leading-relaxed">
                    Escaneá el código QR con la cámara de tu celular para recibir atención personalizada de nuestro equipo comercial.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 text-sm leading-relaxed text-[#394356] dark:text-white/80">
              <MapPin className="mt-1 shrink-0 text-[#EB2347]" size={18} aria-hidden="true" />
              <span>Bruno Tavano 4900 · Lomas de Zamora</span>
            </div>
          </div>
          <div className="bg-[#F7F6F1] dark:bg-[#0F1C36] p-6 sm:p-10 rounded-2xl border border-[#0B1933]/10 dark:border-white/15 shadow-lg transition-colors duration-500">
            {formulario ? (
              <Formulario {...formulario} />
            ) : (
              <div className="flex flex-col justify-between space-y-8">
                <div>
                  <p className="font-display text-3xl font-extrabold uppercase text-[#0B1933] dark:text-white">Inscripciones próximamente</p>
                  <p className="mt-4 max-w-md leading-relaxed text-[#394356] dark:text-white/80">
                    Para consultas sobre participación, escribinos por los canales oficiales de Urkupiña.
                  </p>
                  <Link
                    href="/#contacto"
                    className="mt-6 group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#EB2347] px-8 py-4 text-sm font-extrabold uppercase tracking-[.1em] text-white shadow-xl shadow-[#EB2347]/20 transition-all duration-300 hover:bg-[#0B1933] dark:hover:bg-white dark:hover:text-[#0B1933] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1933] focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    Contactar <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                  </Link>
                </div>

                {/* Sello Sudamérica inside the Contact Square */}
                <div className="pt-6 border-t border-[#0B1933]/10 dark:border-white/15 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative h-24 sm:h-28 w-24 sm:w-28 shrink-0">
                    <Image
                      src="/images/events/feriasudamerica.png"
                      alt="La Mayor Feria de Sudamérica - Paseo Comercial Urkupiña"
                      width={526}
                      height={780}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-display text-base font-extrabold uppercase leading-tight text-[#0B1933] dark:text-white">
                      La mayor feria comercial de Sudamérica
                    </h3>
                    <p className="mt-1 text-xs text-[#526076] dark:text-white/70 leading-relaxed">
                      Impulsando el desarrollo del polo textil e industrial del país con proyección internacional.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

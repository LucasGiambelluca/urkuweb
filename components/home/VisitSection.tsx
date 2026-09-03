"use client";

import { useState } from "react";
import Image from "next/image";
import MaskedImage from "@/components/ui/MaskedImage";
import { Clock, MapPin, Bus, Train, Car, Ticket, CheckCircle2, ChevronRight, ShieldCheck, ExternalLink, CreditCard, Maximize2, X, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { sinMas, type NumerosDelPredio } from "@/lib/contenido/tipos";

const TRANSPORT_OPTIONS = [
  {
    icon: Bus,
    title: "Colectivos (Parada Directa)",
    desc: "Líneas 31, 283, 306, 405, 540, 542, 550 y 551 (bajada directa en la dársena de entrada sobre Ribera Sur).",
  },
  {
    icon: Train,
    title: "Tren (Belgrano Sur)",
    desc: "Estación Ing. Budge / Estación La Salada (a 5 minutos del predio Urkupiña).",
  },
  {
    icon: Car,
    title: "En Auto (Acceso Rápido)",
    desc: "Por Av. General Paz → Bajada Puente La Noria → Camino de la Ribera Sur hasta Feria Urkupiña.",
  },
];

export default function VisitSection({ numeros }: { numeros: NumerosDelPredio }) {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapsDirectUrl = "https://www.google.com/maps/place/Feria+Urkupi%C3%B1a/@-34.7198672,-58.4735439,17z";

  const LEGEND_ITEMS = [
    { id: "entradas", icon: "🚪", label: "Entradas", desc: "Ingresos principales por Av. Ribera Sur y Virrey de Vevia." },
    { id: "banos", icon: "🚻", label: "Baños", desc: "Sanitarios públicos higienizados en cada nave de ventas." },
    { id: "puestos", icon: "🛍️", label: "Puestos", desc: `Más de ${sinMas(numeros.puestos)} locales de fabricantes textiles directos.` },
    { id: "estacionamiento", icon: "🚗", label: "Estacionamiento", desc: "Playas custodiadas con seguridad privada y monitoreo 24 hs." },
  ];

  return (
    <section
      id="visitar"
      className="relative overflow-hidden section-xl bg-background scroll-mt-20 border-b border-border-subtle"
      aria-label="Información para visitar el Paseo Urkupiña"
    >
      {/* Pattern texture: Crosses at left:0 outside grid */}
      <div className="absolute left-0 top-1/4 w-32 md:w-44 h-40 opacity-30 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/patron-cruces.png"
          alt=""
          fill
          className="object-contain object-left dark:invert"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl content-pad">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#EB2347]" />
            <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
              Planificá tu Visita
            </span>
          </div>

          <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.04em] text-foreground">
            <span className="relative inline-block">
              Visitá el paseo
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-5 pointer-events-none">
                <Image
                  src="/images/masks/brush-stroke-4.png"
                  alt=""
                  fill
                  className="object-contain object-left filter drop-shadow-sm"
                />
              </span>
            </span>
          </h2>

          <p className="mt-4 max-w-3xl text-lg md:text-xl font-normal text-muted leading-relaxed">
            La Salada · Buenos Aires. Un punto estratégico donde convergen producción, innovación y comercio.
          </p>
        </motion.div>

        {/* 2-Column Main Layout: Map Left (60%), Info Right (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* MAP & HOTSPOTS COLUMN (Left: 60% / 7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Interactive Map Glass Card */}
            <div className="relative overflow-hidden rounded-[32px] border border-border-subtle bg-white dark:bg-[#0E1626] p-5 md:p-6 transition-all duration-300 hover:shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EB2347]/10 text-[#EB2347] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                      Ubicación del predio
                    </h3>
                    <p className="text-xs text-muted font-medium">
                      Feria Urkupiña · Av. Ribera Sur y Virgil, Ingeniero Budge, La Salada
                    </p>
                  </div>
                </div>

                <a
                  href={mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#243A60] dark:bg-white/10 hover:bg-[#1B2A49] dark:hover:bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
                >
                  Abrir en Google Maps
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Google Maps Embed Frame with Custom Animated Urkupiña Brand Pin */}
              <div className="relative w-full overflow-hidden rounded-[24px] border border-border-subtle bg-black/5 shadow-inner" style={{ aspectRatio: "16 / 10" }}>
                {/* Embed map centered at exact coordinates -34.7198672, -58.4735439 */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.771971714571!2d-58.4761188!3d-34.7198628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcce8617bf524f%3A0x6258fa95738807c1!2sFeria%20Urkupi%C3%B1a!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
                  title="Mapa del Paseo de Compras Urkupiña"
                  aria-label="Mapa interactivo de ubicación de Urkupiña"
                  className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[105%] dark:invert-[90%] dark:hue-rotate-180"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Animated Urkupiña Brand Custom Map Pin Overlay */}
                <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center group">
                  {/* Outer Pulsing Wave Ring */}
                  <div className="absolute -top-3 h-14 w-14 rounded-full border-2 border-[#EB2347] bg-[#EB2347]/30 animate-ping motion-reduce:animate-none pointer-events-none" />

                  {/* Brand Pin Badge */}
                  <div className="relative flex items-center gap-2 rounded-2xl bg-[#243A60] border-2 border-[#EB2347] px-3.5 py-1.5 shadow-2xl text-white backdrop-blur-md">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#EB2347] animate-pulse" />
                    <div className="flex flex-col text-left">
                      <span className="font-display text-sm uppercase tracking-wide font-bold leading-tight">
                        Feria Urkupiña
                      </span>
                      <span className="text-xs text-white/80 font-sans leading-none">
                        La Salada · Predio Oficial
                      </span>
                    </div>
                  </div>

                  {/* Pin Teardrop Arrow Pointer */}
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#EB2347] -mt-0.5 shadow-md" />
                </div>
              </div>

              {/* Map Sectors & Legend Hotspots */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                  Sectores & Referencias del predio
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {LEGEND_ITEMS.map((item) => {
                    const isSelected = activeSector === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSector(isSelected ? null : item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveSector(isSelected ? null : item.id);
                          }
                        }}
                        tabIndex={0}
                        aria-pressed={isSelected}
                        className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EB2347] ${isSelected
                          ? "bg-[#EB2347]/10 border-[#EB2347] text-foreground shadow-sm"
                          : "bg-white/40 dark:bg-white/[0.03] border-border-subtle hover:border-foreground/30 text-foreground/80"
                          }`}
                      >
                        <div className="flex items-center gap-2 text-base mb-1">
                          <span>{item.icon}</span>
                          <span className="font-semibold text-xs text-foreground">{item.label}</span>
                        </div>
                        <span className="text-xs text-muted line-clamp-2 leading-relaxed">
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* INFO CARDS COLUMN (Right: 40% / 5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Card 1: Horarios */}
            <div className="rounded-[28px] border border-border-subtle bg-white dark:bg-[#0E1626] p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#243A60] dark:bg-white/10 text-white shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                    Horarios de Atención
                  </h3>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 size={15} /> Atención administrativa días de Feria y Viernes de de 8:00 a 14:00 hs.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle">
                <p className="text-sm text-muted leading-relaxed">
                  <strong className="text-foreground font-semibold">Días de Feria comercial:</strong> Abierto Lunes, Miércoles y Sabádo de 7:00 a 14:00 hs.
                </p>
              </div>
            </div>

            {/* Card 2: Cómo Llegar (Transport Options Grid) */}
            <div className="rounded-[28px] border border-border-subtle bg-white dark:bg-[#0E1626] p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#243A60]/10 dark:bg-white/10 text-[#243A60] dark:text-white shrink-0">
                  <MapPin size={20} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                  Cómo Llegar a Feria Urkupiña
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {TRANSPORT_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/40 dark:bg-white/[0.03] border border-border-subtle">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EB2347]/10 text-[#EB2347] shrink-0 mt-0.5">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted leading-relaxed mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex justify-end">
                <Button variant="tertiary" href={mapsDirectUrl} target="_blank">
                  <span>Abrir en Google Maps</span>
                  <ExternalLink size={15} aria-hidden="true" />
                </Button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* FULL-WIDTH PANORAMIC BANNER: Tarjeta de Servicios Urkupiña (Ultra-Wide Landscape Artwork Showcase) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          onClick={() => setIsModalOpen(true)}
          className="group relative mt-10 w-full cursor-pointer overflow-hidden rounded-[20px] site-image border border-white/25 bg-gradient-to-r from-[#1B2A49] via-[#243A60] to-[#0D1525] shadow-2xl transition-all duration-500 hover:border-[#EB2347]/80 hover:shadow-[#EB2347]/20"
        >
          {/* Subtle Art-Director Vignette & Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none z-10" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#EB2347]/25 blur-[100px] pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#243A60]/50 blur-[100px] pointer-events-none" />

          {/* Ultra-Wide Panoramic Image Frame (Compact Vertical Height, Maximum Visual Span) */}
          <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
            <Image
              src="/images/tarjeta-servicios.jpg"
              alt="Adquiere tu Tarjeta de Servicios Urkupiña - Afiche Oficial"
              fill
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              priority
            />
          </div>

          {/* Arrow Left Icon Pointing to Action */}
          <div className="absolute right-48 sm:right-60 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none hidden lg:block">
            <Image
              src="/images/icons/arrowleft.png"
              alt=""
              width={80}
              height={80}
              className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-xl"
            />
          </div>
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20 flex items-center gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 border border-white/20 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-lg tracking-wide uppercase">
              <Sparkles size={13} className="text-[#EB2347]" />
              Tarjeta de Servicios Urkupiña
            </span>
          </div>

          {/* Floating Glass Action Bar (Bottom Bar) */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 z-20 flex items-center justify-between gap-3 pointer-events-none">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-black/70 border border-white/15 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white/90 shadow-md">
              <ShieldCheck size={14} className="text-emerald-400" />
              Acceso a baños, estacionamiento y servicios
            </span>

            <div className="flex items-center gap-2.5 ml-auto pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-black/60 hover:bg-black/85 border border-white/25 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white shadow-xl transition-all hover:scale-105"
              >
                <Maximize2 size={14} />
                <span>Ampliar</span>
              </button>

              <a
                href="#contacto"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 rounded-full bg-[#EB2347] hover:bg-[#C41A3A] px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-[#EB2347]/40 transition-all hover:scale-105"
              >
                <span>¡Obtén la tuya!</span>
                <ChevronRight size={15} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Preview Modal for Tarjeta de Servicios */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full overflow-hidden rounded-3xl border border-white/20 bg-[#1B2A49] shadow-2xl p-4 md:p-6 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-[#EB2347] transition-colors focus:outline-none"
                aria-label="Cerrar vista previa"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                <h3 className="font-display text-2xl uppercase tracking-tight text-white flex items-center gap-2">
                  <CreditCard className="text-[#EB2347]" />
                  Tarjeta de Servicios Urkupiña
                </h3>
                <p className="text-xs text-white/70">
                  Adquiere tu tarjeta para mayor comodidad y dinamismo dentro de la feria
                </p>
              </div>

              {/* Modal High-Res Image Container */}
              <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50" style={{ maxHeight: "75vh" }}>
                <Image
                  src="/images/tarjeta-servicios.jpg"
                  alt="Tarjeta de Servicios Urkupiña - Afiche Completo"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                />
              </div>

              {/* Modal Footer CTA */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <span className="text-xs text-white/70">
                  Disponible en la administración y cabinas habilitadas del Paseo Urkupiña.
                </span>
                <a
                  href="#contacto"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#EB2347] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#C41A3A]"
                >
                  Solicitar información por contacto
                  <ChevronRight size={14} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


"use client";

import { Car, MapPin, CreditCard, Bus, ShieldCheck, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const PARKING_CARDS = [
  {
    icon: Car,
    title: "Tarifas & Estadías",
    badge: "Precios Transparentes",
    content: (
      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
          <span className="text-sm font-medium text-white/80">Estadía Completa:</span>
          <span className="text-2xl font-extrabold text-[#EB2347] tracking-tight">$10.000</span>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Acceso ilimitado durante toda la jornada comercial con custodia permanente.
        </p>
      </div>
    ),
  },
  {
    icon: MapPin,
    title: "Ingresos Vehiculares",
    badge: "2 Portones Principales",
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <div className="flex items-start gap-2">
          <span className="font-bold text-white shrink-0">· Portón Norte:</span>
          <span>Acceso por Camino de la Ribera Sur y Tabano.</span>
        </div>
        <div className="flex items-start gap-2 border-t border-white/10 pt-2">
          <span className="font-bold text-white shrink-0">· Portón Sur:</span>
          <span>Ingreso secundario por calle Arana Goidi (Portón 6).</span>
        </div>
      </div>
    ),
  },
  {
    icon: CreditCard,
    title: "Medios de Pago",
    badge: "Cobro Ágil",
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <div className="flex flex-wrap items-center gap-2 text-white font-medium">
          <span className="rounded-lg bg-white/10 px-2.5 py-1">✓ Mercado Pago (QR)</span>
          <span className="rounded-lg bg-white/10 px-2.5 py-1">✓ Débito / Crédito</span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed pt-1">
          Aboná de forma rápida en cabinas de cobro o tótems automatizados.
        </p>
      </div>
    ),
  },
  {
    icon: Bus,
    title: "Micros & Camiones",
    badge: "Playa Especializada",
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <p className="leading-relaxed">
          Dársenas maniobrables para <strong className="text-white">buses de tours de compras</strong> y vehículos de carga pesada.
        </p>
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm border-t border-white/10 pt-2">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Vigilancia y cámaras 24 hs</span>
        </div>
      </div>
    ),
  },
];

export default function ParkingSection() {
  return (
    <section
      id="estacionamiento"
      className="relative overflow-hidden bg-[#1B2A49] text-white section-lg scroll-mt-20 border-white/10"
      aria-label="Información de estacionamiento del Paseo Urkupiña"
    >
      {/* Ambient background glow */}
      <div
        className="absolute right-0 top-1/3 h-[550px] w-[550px] rounded-full bg-[#EB2347]/15 blur-[170px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 bottom-0 h-[450px] w-[450px] rounded-full bg-[#243A60]/30 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Section Header matching Sponsors identity for Dark Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-[2px] w-12 bg-[#EB2347]" />
              <span className="text-xs font-semibold uppercase tracking-[.35em] text-white/70">
                Estacionamiento Custodiado
              </span>
            </div>

            <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.04em] text-white font-bold">
              Estacionamiento
            </h2>

            <p className="mt-4 max-w-2xl text-base md:text-lg font-normal text-white/80 leading-relaxed">
              Más de 1.500 cocheras disponibles con acceso directo al paseo y seguridad monitoreada las 24 horas.
            </p>
          </div>

          {/* Live Availability Badge & Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Disponibilidad: <strong className="text-white font-bold">84% libre</strong></span>
            </div>

            <Button variant="secondary" isDarkBackground href="#visitar">
              <span>Cómo llegar</span>
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </motion.div>

        {/* 4 Feature Cards Grid (No Default Shadow, Hover Shadow Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PARKING_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between rounded-[30px] border border-white/15 bg-white/10 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-white/30"
              >
                <div>
                  {/* Top Icon & Badge Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EB2347] text-white shadow-md shrink-0">
                      <Icon size={26} aria-hidden="true" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl uppercase tracking-tight text-white font-bold mb-4">
                    {card.title}
                  </h3>

                  {card.content}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner - Ingreso Automatizado (No Default Shadow, Hover Shadow Only) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 overflow-hidden rounded-[30px] border border-white/15 bg-white/10 p-8 text-white backdrop-blur-xl transition duration-500 hover:shadow-2xl relative"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EB2347] text-white shadow-md shrink-0">
                <Sparkles size={30} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-white font-bold">
                  Ingreso Automatizado & Monitoreado
                </h3>
                <p className="text-sm md:text-base text-white/80 mt-1 max-w-2xl leading-relaxed">
                  Playas totalmente iluminadas, circuito cerrado de cámaras de alta definición e ingresos ágiles sobre Camino de la Ribera.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button variant="secondary" isDarkBackground href="#visitar">
                <MapPin size={16} aria-hidden="true" />
                <span>Ver mapa interactivo</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

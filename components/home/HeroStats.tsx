"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { NumerosDelPredio } from "@/lib/contenido/tipos";

export default function HeroStats({ numeros }: { numeros: NumerosDelPredio }) {
  const STATS_DATA = [
    {
      icon: "/images/icons/houseicon.png",
      value: numeros.puestos,
      label: "PUESTOS ACTIVOS",
    },
    {
      icon: "/images/icons/expositores.png",
      value: numeros.personasDiarias,
      label: "PERSONAS DIARIAS",
    },
    {
      icon: "/images/icons/provicna.png",
      value: numeros.aniosTrayectoria,
      label: "AÑOS DE TRAYECTORIA",
    },
    {
      icon: "/images/icons/compradores.png",
      value: numeros.diasActividad,
      label: "DÍAS DE ACTIVIDAD",
    },
  ];

  return (
    <section
      id="stats"
      className="relative bg-background py-10 md:py-14 scroll-mt-20 overflow-hidden border-b border-border-subtle"
      aria-label="Estadísticas e impacto numérico del Paseo Urkupiña"
    >

      <div className="mx-auto max-w-7xl content-pad relative">
        {/* Arrow Left Icon Positioned Next to Column 4 Outside Site Grid */}
        <div className="hidden lg:block absolute -right-12 xl:-right-20 top-1/2 -translate-y-1/2 pointer-events-none select-none z-10">
          <Image
            src="/images/icons/arrowleft.png"
            alt=""
            width={80}
            height={80}
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle">
          {STATS_DATA.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center gap-4 py-5 px-4 md:px-6 group relative"
            >
              {/* Icon from /images/icons/ */}
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 flex items-center justify-center">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={64}
                  height={64}
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Number Value and Label */}
              <div className="flex flex-col items-start">
                <span className="font-display text-3xl sm:text-4xl md:text-[42px] font-black text-foreground leading-none tracking-tight">
                  {item.value}
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted mt-1.5 leading-tight">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

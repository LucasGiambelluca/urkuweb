"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { NumerosDelPredio } from "@/lib/contenido/tipos";

export default function ImpactGrid({ numeros }: { numeros: NumerosDelPredio }) {
  const IMPACT_ITEMS = [
    {
      number: numeros.puestos,
      title: "Puestos",
      description:
        "Un espacio donde miles de fabricantes y comerciantes desarrollan sus negocios.",
      image: "/images/one.png",
    },
    {
      number: numeros.empleos,
      title: "Empleos",
      description:
        "Una comunidad productiva que genera oportunidades directas e indirectas.",
      image: "/images/pasillos.png",
    },
    {
      number: numeros.aniosTrayectoria,
      title: "Años",
      description:
        "Historia, experiencia y evolución acompañando al sector textil.",
      image: "/images/decenital.png",
    },
  ];

  return (
    <section
      id="impacto"
      className="relative overflow-hidden bg-background section-lg scroll-mt-20 border-b border-border-subtle"
      aria-label="Impacto en números del Paseo Urkupiña"
    >
      {/* Background decoration */}
      <div
        className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#EB2347]/10 blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#EB2347]" />
            <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
              Nuestro impacto
            </span>
          </div>

          <h2 className="max-w-4xl font-display text-4xl sm:text-6xl lg:text-8xl uppercase leading-[.9] tracking-tight text-foreground font-bold">
            Una comunidad que mueve la industria
          </h2>
        </motion.div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {IMPACT_ITEMS.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`group relative overflow-hidden rounded-[28px] md:rounded-[36px] site-image border border-border-subtle shadow-2xl ${
                index === 0
                  ? "lg:col-span-7 h-[380px] sm:h-[440px] lg:h-[620px]"
                  : "lg:col-span-5 h-[340px] sm:h-[380px] lg:h-[298px]"
              }`}
            >
              {/* Card Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="site-image object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay for high text contrast */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#243A60] via-[#243A60]/75 to-transparent"
                aria-hidden="true"
              />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase leading-none text-white">
                    {item.number}
                  </p>

                  <h3 className="mt-1 md:mt-2 font-display text-2xl sm:text-3xl lg:text-4xl uppercase leading-none text-white font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 md:mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-white/85">
                    {item.description}
                  </p>
                </div>

                <div
                  className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-[#EB2347] text-white shadow-lg shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                  aria-hidden="true"
                >
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
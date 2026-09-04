"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const TIMELINE = [
  {
    year: "1998",
    title: "El comienzo",
    text: "Nace Urkupiña como un espacio de encuentro para fabricantes y comerciantes, impulsando nuevas oportunidades comerciales.",
    image: "/images/pasillos.png",
  },
  {
    year: "2005",
    title: "Crecimiento",
    text: "La comunidad continúa creciendo y se consolida como un punto estratégico para miles de emprendedores.",
    image: "/images/feria-hero.jpg",
  },
  {
    year: "2015",
    title: "Una comunidad productiva",
    text: "Nuevas generaciones de fabricantes se incorporan formando una red cada vez más amplia.",
    image: "/images/feria-cta.jpg",
  },
  {
    year: "2026",
    title: "El futuro",
    text: "Una plataforma preparada para conectar fabricantes, clientes y nuevas oportunidades digitales.",
    image: "/images/hero-real.jpg",
  },
];

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="relative overflow-hidden bg-background section-lg scroll-mt-20 border-b border-border-subtle"
      aria-label="Nuestra evolución e historia de crecimiento"
    >
      {/* Pattern texture: Diagonal lines in middle right outside timeline */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 md:w-44 h-40 opacity-30 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/patron-lineas.png"
          alt=""
          fill
          // Tamano fijo por clases w-32/md:w-44, no crece con el viewport
          sizes="(min-width: 768px) 176px, 128px"
          className="object-contain object-right dark:invert"
        />
      </div>

      {/* Aesthetic Urkupiña Favicon Emblem at Timeline Bottom Right */}
      <div className="absolute right-4 sm:right-12 bottom-4 w-24 sm:w-32 h-24 sm:h-32 opacity-25 hover:opacity-45 transition-all duration-500 pointer-events-none select-none z-0">
        <Image
          src="/favicon.png"
          alt=""
          fill
          // Tamano fijo por clases w-24/sm:w-32, no crece con el viewport
          sizes="(min-width: 640px) 128px, 96px"
          className="object-contain object-right-bottom filter drop-shadow-2xl"
        />
      </div>

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#EB2347]" />
            <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
              Nuestra evolución
            </span>
          </div>

          <h2 className="font-display text-[clamp(36px,5vw,72px)] uppercase leading-none tracking-tight text-foreground font-bold">
            Una historia de{" "}
            <span className="relative inline-block text-[#EB2347]">
              crecimiento
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-5 pointer-events-none">
                <Image
                  src="/images/masks/brush-stroke-2.png"
                  alt=""
                  fill
                  className="object-contain object-left filter drop-shadow-sm"
                />
              </span>
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed font-normal max-w-2xl">
            Años de desarrollo constante uniendo la mayor comunidad textil de fabricantes y comerciantes.
          </p>
        </motion.div>

        {/* Timeline Items Container */}
        <div className="relative">
          {/* Vertical Timeline Center Line */}
          <div
            className="absolute left-4 top-0 h-full w-px bg-border-subtle md:left-1/2"
            aria-hidden="true"
          />

          <div className="space-y-10 md:space-y-12">
            {TIMELINE.map((item, index) => {
              const isFutureCard = item.year === "2026";

              return (
                <motion.article
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative grid gap-6 items-center md:grid-cols-2"
                >
                  {/* Timeline Node Dot */}
                  <div
                    className="absolute left-[8px] top-1/2 -translate-y-1/2 z-10 h-4 w-4 rounded-full border-2 border-white bg-[#EB2347] md:left-1/2 md:-translate-x-1/2 shadow-md"
                    aria-hidden="true"
                  />

                  {/* Image Column */}
                  <div
                    className={`pl-10 md:pl-0 ${index % 2 === 0 ? "md:pr-10" : "md:order-2 md:pl-10"
                      }`}
                  >
                    {isFutureCard ? (
                      /* Solid Navy Logo Card Treatment for 2026 "El Futuro" */
                      <div className="site-image relative aspect-[16/8] md:aspect-[16/7] bg-[#243A60] p-6 md:p-8 flex flex-col items-center justify-center text-center text-white border border-border-subtle shadow-xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#243A60] via-[#1B2A49] to-[#0D1525] opacity-90" />
                        <div className="relative z-10 flex flex-col items-center">
                          <Image
                            src="/assets/logonav.png"
                            alt="Urkupiña"
                            width={220}
                            height={50}
                            className="h-12 w-auto object-contain brightness-125 mb-2"
                          />
                          <span className="text-xs font-semibold uppercase tracking-[.3em] text-[#EB2347]">
                            Plataforma Digital 2026
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Photo Card with Standardized site-image class */
                      <div className="site-image relative aspect-[16/8] md:aspect-[16/7] overflow-hidden border border-border-subtle shadow-xl group">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          // Columna de una grilla de 2 dentro de max-w-7xl
                          // (1280px): 100% abajo de md, 640px (mitad) de ahi en mas
                          sizes="(max-width: 768px) 100vw, 640px"
                          className="site-image object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Text Content Column */}
                  <div
                    className={`pl-10 md:pl-0 flex flex-col justify-center ${index % 2 === 0
                        ? ""
                        : "md:order-1 md:items-end md:text-right"
                      }`}
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-display text-4xl md:text-5xl font-extrabold text-[#EB2347] tracking-tight">
                        {item.year}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-foreground font-bold">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm md:text-base leading-relaxed text-muted max-w-md">
                      {item.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
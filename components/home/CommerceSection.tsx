"use client";

import { useState } from "react";
import Image from "next/image";
import { QrCode, Truck, ShoppingBag, ArrowRight, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { sinMas, type NumerosDelPredio } from "@/lib/contenido/tipos";

const FEATURES = [
  {
    icon: QrCode,
    title: "Conectividad & Códigos QR",
    desc: "Cada puesto tiene su código QR oficial para pagos digitales inmediatos y catálogo digital actualizado en tiempo real.",
    tag: "Cobro Inmediato",
  },
  {
    icon: Truck,
    title: "Despacho & Logística Integrada",
    desc: "Envíos a todo el país desde el mismo predio con empresas de transporte integradas y seguimiento de encomiendas.",
    tag: "Envíos Nacionales",
  },
];

const CATEGORIES = [
  { name: "Indumentaria Textil", count: "850+ Puestos", icon: "👔" },
  { name: "Moda Infantil & Bebés", count: "420+ Puestos", icon: "👕" },
  { name: "Telas & Insumos", count: "310+ Puestos", icon: "🧵" },
  { name: "Calzado & Marroquinería", count: "290+ Puestos", icon: "👟" },
  { name: "Blanquería & Hogar", count: "210+ Puestos", icon: "🧶" },
  { name: "Ropa Deportiva", count: "380+ Puestos", icon: "⚽" },
  { name: "Bolsos & Equipaje", count: "190+ Puestos", icon: "🎒" },
  { name: "Confección & Artesanías", count: "160+ Puestos", icon: "🎨" },
];

export default function CommerceSection({ numeros }: { numeros: NumerosDelPredio }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section
      id="rubros"
      className="relative overflow-hidden bg-background section-lg scroll-mt-20 border-b border-border-subtle"
      aria-label="Información de rubros y catálogos unificados de Urkupiña"
    >
      {/* Ambient background light */}
      <div
        className="absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#243A60]/10 dark:bg-[#243A60]/20 blur-[170px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-[#EB2347]/10 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Section Header */}
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
              <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
                Comercio & Catálogos
              </span>
            </div>

            <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.04em] text-foreground">
              Rubros <br />
              <span className="relative inline-block text-[#EB2347]">
                comerciales
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

            <p className="mt-4 max-w-2xl text-lg md:text-xl font-normal text-muted leading-relaxed">
              Tecnología y logística al servicio de la industria textil.
            </p>
          </div>

          <a
            href="#contacto"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#243A60] dark:bg-white/10 hover:bg-[#1B2A49] dark:hover:bg-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#243A60]"
          >
            Ver catálogo completo
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </motion.div>

        {/* 2-Up Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                tabIndex={0}
                className="group relative flex flex-col justify-between rounded-[28px] border border-border-subtle bg-white dark:bg-[#0E1626] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#EB2347]/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#EB2347]"
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#243A60] text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#EB2347]">
                      <Icon size={26} aria-hidden="true" />
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EB2347]/10 border border-[#EB2347]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#EB2347]">
                      <Tag size={12} aria-hidden="true" />
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl uppercase tracking-tight text-foreground mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2 text-xs font-semibold text-foreground/80 group-hover:text-[#EB2347] transition-colors">
                  <span>Saber más sobre {item.title}</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Category Tags Grid Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 rounded-[32px] border border-border-subtle bg-white/40 dark:bg-white/[0.03] p-6 md:p-8 backdrop-blur-xl shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-[#EB2347]" aria-hidden="true" />
              <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                Principales Rubros Textiles
              </h3>
            </div>

            <span className="text-xs text-muted font-medium">
              Más de {sinMas(numeros.puestos)} locales clasificados
            </span>
          </div>

          {/* Interactive Responsive Grid of Category Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(isSelected ? null : cat.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveCategory(isSelected ? null : cat.name);
                    }
                  }}
                  tabIndex={0}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EB2347] ${isSelected
                      ? "bg-[#EB2347]/10 border-[#EB2347] text-foreground shadow-md"
                      : "bg-white/60 dark:bg-white/[0.04] border-border-subtle hover:border-foreground/30 text-foreground/80 hover:bg-white/80 dark:hover:bg-white/[0.07]"
                    }`}
                >
                  <div className="flex items-center gap-2 text-base mb-1">
                    <span>{cat.icon}</span>
                    <span className="font-semibold text-xs text-foreground leading-tight">{cat.name}</span>
                  </div>
                  <span className="text-xs text-muted font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={13} className="text-emerald-500" aria-hidden="true" />
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

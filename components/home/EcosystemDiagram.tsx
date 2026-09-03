"use client";

import { motion } from "framer-motion";
import { Factory, Landmark, Truck, ShoppingBag } from "lucide-react";

const nodes = [
  {
    title: "1. Fabricantes Textiles",
    subtitle: "Producción & Confección",
    description: "Diseño local, moldería y confección a escala. El origen directo de la mercadería nacional.",
    icon: Factory,
    glow: "group-hover:bg-[#243A60]/10 border-[#243A60]/25"
  },
  {
    title: "2. Locales Mayoristas",
    subtitle: "Paseo de Compras Físico",
    description: "Los 2.200 puestos dentro de Urkupiña S.A. que funcionan como exhibición y punto de venta físico.",
    icon: Landmark,
    glow: "group-hover:bg-purple-500/10 border-purple-500/20"
  },
  {
    title: "3. Red de Logística",
    subtitle: "Distribución Federal",
    description: "Servicios de carga consolidados, colectivos de compra de larga distancia y despachos puerta a puerta.",
    icon: Truck,
    glow: "group-hover:bg-emerald-500/10 border-emerald-500/20"
  },
  {
    title: "4. Comerciantes & Showrooms",
    subtitle: "Punto de Venta Final",
    description: "Locales comerciales de todo el país y showrooms digitales que se abastecen en el polo textil.",
    icon: ShoppingBag,
    glow: "group-hover:bg-amber-500/10 border-amber-500/20"
  }
];

export default function EcosystemDiagram() {
  return (
    <section id="ecosistema" className="section-lg bg-background relative overflow-hidden border-b border-[#243A60]/10 scroll-mt-20">
      
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/10 w-[400px] h-[400px] bg-[var(--color-brand-navy)]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-[var(--color-brand-navy)]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#243A60]/40 bg-[#243A60]/10 px-4 py-2 text-sm text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-[#EB2347] inline-block" />
            Estructura
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            El Ecosistema Urkupiña
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Una cadena de valor integrada y transparente que impulsa el comercio textil nacional desde los rollos de tela hasta el consumidor final.
          </p>
        </div>

        {/* Bento/Connected Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative rounded-3xl border border-border-subtle bg-border-subtle/50 p-8 backdrop-blur-md flex flex-col justify-between min-h-[320px] transition-all duration-300"
              >
                <div className={`absolute inset-0 rounded-3xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${node.glow}`} />

                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-border-subtle/50 text-foreground mb-6 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-foreground transition-colors">
                    {node.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
                    {node.subtitle}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-subtle group-hover:text-muted transition-colors duration-300">
                  {node.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Interconnection flow chart graphic representation */}
        <div className="mt-20 hidden lg:flex justify-center items-center gap-4 text-foreground/20 select-none font-bold text-lg">
          <span>Diseño</span>
          <span className="animate-pulse">→</span>
          <span>Feria</span>
          <span className="animate-pulse">→</span>
          <span>Logística</span>
          <span className="animate-pulse">→</span>
          <span>Punto de Venta</span>
        </div>

      </div>
    </section>
  );
}

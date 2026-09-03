"use client";

import { motion } from "framer-motion";
import { Clock, Calendar, CheckCircle } from "lucide-react";

const fairDays = [
  {
    day: "Lunes",
    title: "Feria Mayorista Nocturna",
    time: "22:00 hs - 06:00 hs (+1)",
    focus: "Preparación de Stock Semanal",
    description: "La feria abre sus puertas por la noche para abastecer a los comerciantes que inician su semana comercial. Es la jornada ideal para encontrar las novedades absolutas de temporada.",
    points: ["Abastecimiento anticipado", "Trato exclusivo mayorista", "Mayor variedad de talles y modelos"],
    bgGradient: "from-zinc-900 via-zinc-950 to-black",
  },
  {
    day: "Miércoles",
    title: "Jornada Central de Ventas",
    time: "06:00 hs - 16:00 hs",
    focus: "Envíos y Distribución Federal",
    description: "El día más activo de la logística federal. Ideal para compradores del interior que coordinan envíos consolidados y encomiendas express directo a las provincias.",
    points: ["Logística federal activa", "Descuentos por cantidad", "Coordinación rápida de despachos"],
    bgGradient: "from-zinc-900 via-zinc-950 to-black",
  },
  {
    day: "Sábado",
    title: "Feria de Fin de Semana",
    time: "08:00 hs - 18:00 hs",
    focus: "Minorista y Mayorista General",
    description: "Una jornada abierta tanto al comerciante minorista como al público general. El predio se llena de familias y revendedores que buscan los mejores precios directos de fábrica.",
    points: ["Precios accesibles al público", "Ambiente familiar y seguro", "Promociones especiales de liquidación"],
    bgGradient: "from-zinc-900 via-zinc-950 to-black",
  }
];

export default function MarketDays() {
  return (
    <section id="feria" className="section-lg bg-background relative overflow-hidden border-b border-[#243A60]/10 scroll-mt-20">
      
      {/* Background graphic elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-border-subtle/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#243A60]/40 bg-[#243A60]/10 px-4 py-2 text-sm text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-[#EB2347] inline-block" />
            Días de Feria
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Calendario de Actividades
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Conocé la dinámica de nuestras tres jornadas de feria semanales. Cada día tiene un enfoque especializado para optimizar las compras y la distribución.
          </p>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {fairDays.map((item, index) => {
            return (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className={`group rounded-3xl border border-border-subtle bg-gradient-to-b ${item.bgGradient} p-10 backdrop-blur-md flex flex-col justify-between transition-all duration-300 relative`}
              >
                <div className="absolute inset-0 rounded-3xl border border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-foreground/80 transition-colors">
                      Feria Urkupiña
                    </span>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-border-subtle/50 text-foreground">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-4xl font-black text-foreground mb-2">{item.day}</h3>
                  <h4 className="text-xl font-bold text-muted mb-6">{item.title}</h4>
                  
                  <div className="flex items-center gap-3 text-foreground/80 mb-4 bg-border-subtle/50 border border-[#243A60]/10 py-3 px-4 rounded-2xl">
                    <Clock size={18} className="text-muted" />
                    <span className="font-semibold text-sm">{item.time}</span>
                  </div>

                  <p className="text-sm text-subtle leading-relaxed mb-8 group-hover:text-muted transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-border-subtle pt-8 mt-4">
                  <div className="text-xs uppercase text-foreground/30 tracking-widest font-bold mb-4">
                    Enfoque del Día
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-6 bg-border-subtle/50 py-2 px-3 rounded-lg border border-[#243A60]/10 inline-block">
                    {item.focus}
                  </div>
                  
                  <ul className="space-y-3">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-xs text-muted">
                        <CheckCircle size={14} className="text-subtle mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

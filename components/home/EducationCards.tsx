"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowUpRight, BookOpen, Layers, Coins, Ship } from "lucide-react";

const courses = [
  {
    title: "E-commerce & Canales Digitales",
    description: "Aprendé a digitalizar tus catálogos, configurar pasarelas de pago digitales y gestionar ventas a través de redes sociales y WhatsApp Business.",
    icon: BookOpen,
    duration: "4 clases",
    level: "Inicial"
  },
  {
    title: "Moldería y Tendencias de Moda",
    description: "Patronaje industrial avanzado y tendencias internacionales adaptadas al mercado argentino de confección masiva.",
    icon: Layers,
    duration: "6 clases",
    level: "Intermedio"
  },
  {
    title: "Costos y Finanzas para Talleres",
    description: "Cómo calcular el costo real de tus prendas, márgenes de ganancia mayorista y optimización del flujo de caja.",
    icon: Coins,
    duration: "3 clases",
    level: "Inicial"
  },
  {
    title: "Logística y Despacho Federal",
    description: "Optimización de costos de envío, acuerdos de flete consolidado y empaque seguro para mercadería textil pesada.",
    icon: Ship,
    duration: "2 clases",
    level: "Básico"
  }
];

export default function EducationCards() {
  return (
    <section id="educacion" className="section-lg relative overflow-hidden border-b border-[#243A60]/10 scroll-mt-20">

      {/* Locked dark background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#060A13" }} aria-hidden="true" />
      {/* Diagonal accents */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 450 450" fill="none" className="w-full h-full">
          <polygon points="0,0 450,0 0,450" fill="rgba(36,58,96,0.10)" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 350 350" fill="none" className="w-full h-full">
          <polygon points="350,350 0,350 350,0" fill="rgba(235,35,71,0.05)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#243A60]/40 bg-[#243A60]/10 px-4 py-2 text-sm text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-[#EB2347] inline-block" />
              <GraduationCap className="h-4 w-4" />
              <span>Capacitaciones Gratuitas</span>
            </div>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Academia para Fabricantes
            </h2>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Impulsamos el crecimiento de nuestros puesteros y talleres textiles. Ofrecemos herramientas técnicas y comerciales gratuitas para escalar los negocios familiares.
            </p>
          </div>
          <div>
            <button className="rounded-full px-6 py-3 font-semibold text-white text-sm hover:scale-105 transition flex items-center gap-2" style={{ background: "#EB2347" }}>
              <span>Ver Todos los Cursos</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-3xl border border-[#243A60]/15 overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
              >
                {/* Card image background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: "url('/images/feria-hero.jpg')" }}
                />
                {/* Card overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(160deg, rgba(6,10,19,0.90) 0%, rgba(20,30,55,0.82) 60%, rgba(6,10,19,0.95) 100%)" }}
                />
                {/* Top hover line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EB2347] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#243A60]/20 text-white border border-[#243A60]/40">
                        <Icon size={20} />
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-300 border border-[#243A60]/40 rounded-full px-3 py-1 bg-[#243A60]/20">
                          {course.duration}
                        </span>
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-300 border border-[#243A60]/40 rounded-full px-3 py-1 bg-[#243A60]/20">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">
                      {course.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {course.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

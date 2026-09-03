"use client";

import { motion } from "framer-motion";

export default function Quote() {
  return (
    <section id="cita" className="section-lg bg-background relative overflow-hidden border-b border-[#243A60]/10 scroll-mt-20">
      
      {/* Background glow shadow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-border-subtle/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-5xl content-pad relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-border-subtle bg-gradient-to-b from-white/10 to-transparent p-12 md:p-20 backdrop-blur-md text-center"
        >
          {/* Big quotation marks decoration */}
          <span className="absolute -top-6 left-12 text-[120px] font-serif font-black text-foreground/5 leading-none select-none">“</span>
          
          <blockquote className="text-2xl md:text-3xl italic text-foreground/95 leading-relaxed font-light">
            "Aquí no solo se comercializan prendas. Se teje el sustento diario de miles de familias y se forja el futuro de marcas de moda que luego llegan a todos los rincones del país."
          </blockquote>
          
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center font-bold text-foreground border border-border-subtle">
              U
            </div>
            <div>
              <div className="font-semibold text-foreground text-base">Comunidad Urkupiña</div>
              <div className="text-sm font-medium text-[#64748B] mt-0.5">Fuerza Productiva de Costureros y Diseñadores Textiles</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

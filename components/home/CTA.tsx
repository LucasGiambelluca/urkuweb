"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section id="cta-comercial" className="relative overflow-hidden bg-background section-md scroll-mt-20 border-b border-border-subtle">
      <div className="mx-auto max-w-7xl content-pad relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-r from-[#243A60] via-[#1B2A49] to-[#0D1525] p-8 md:p-10 lg:p-12 text-white transition-all duration-300 hover:shadow-xl backdrop-blur-xl"
        >
          {/* Background image & gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "url('/images/feria-cta.jpg')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#243A60]/95 via-[#1B2A49]/90 to-[#0D1525]/95"
            aria-hidden="true"
          />

          {/* Red top accent glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EB2347] to-transparent" />

          {/* Wide & Narrow Horizontal Layout (Desktop: Flex Row, Mobile: Flex Col) */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.3em] text-[#EB2347]">
                <Sparkles size={14} aria-hidden="true" />
                <span>Oportunidad Comercial</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight font-bold">
                ¿Querés publicitar o <span className="text-[#EB2347]">vender con nosotros?</span>
              </h2>

              <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
                Sumá tu taller textil a la plataforma institucional digital o reservá espacios publicitarios dentro del predio comercial de mayor afluencia.
              </p>
            </div>

            {/* Right Buttons Group (Horizontal Row) */}
            <div className="flex flex-wrap items-center gap-4 shrink-0 w-full sm:w-auto">
              <Button variant="primary" href="#publicidad">
                <span>Publicitar con Nosotros</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Button>

              <Button variant="secondary" isDarkBackground href="#alquilar">
                <span>Registrar Taller Textil</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

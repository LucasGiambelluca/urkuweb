"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-[#102a5c] dark:bg-[#060911] section-xl scroll-mt-20 flex items-center min-h-[85vh] z-20 transition-colors duration-500"
      aria-label="Presentación principal de Paseo Urkupiña"
    >
      {/* Background Hero Video (Decorative, aria-hidden=true) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/assets/urku.mp4" type="video/mp4" />
        </video>

        {/* Dark Gradient Overlay for high text contrast (WCAG >= 4.5:1) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#102a5c]/95 via-[#102a5c]/80 to-[#102a5c]/40 dark:from-[#060911]/98 dark:via-[#080C14]/92 dark:to-[#080C14]/65 transition-colors duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102a5c] via-transparent to-transparent dark:from-[#060911] dark:via-transparent dark:to-transparent transition-colors duration-500" />
      </div>

      {/* Ambient Red Glow in Dark Mode */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-transparent dark:bg-[#EB2347]/10 blur-[180px] pointer-events-none transition-all duration-500" aria-hidden="true" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center content-pad w-full py-12">
        <div className="max-w-5xl">

          {/* Subtitle / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="h-[2px] w-12 bg-[#EB2347]" />
            <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
              Polo Textil Líder
            </span>
          </motion.div>

          {/* First Heading on the page: H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[clamp(48px,8vw,120px)] uppercase leading-[.88] tracking-[-.05em] text-white"
          >
            Más que una feria. <br />
            <span className="relative inline-block text-[#EB2347]">
              La cuna de fabricantes.
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-5 pointer-events-none">
                <Image
                  src="/images/masks/brush-stroke-4.png"
                  alt=""
                  fill
                  className="object-contain object-left filter drop-shadow-sm"
                />
              </span>
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-white/85"
          >
            Más de 30 años conectando fabricantes, comerciantes y oportunidades dentro del mayor polo textil del país.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            {/* Primary CTA */}
            <Link
              href="#visitar"
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-[#EB2347] px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#EB2347]/30 transition hover:bg-[#C41A3A] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#EB2347] focus:ring-offset-2 focus:ring-offset-[#102a5c]"
            >
              Planificá tu visita
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="#historia"
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#243A60] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#102a5c]"
            >
              Conocé nuestra historia
            </Link>

            {/* Tertiary CTA (Text link) */}
            <Link
              href="#streaming"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold text-white/85 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Mirá la transmisión en vivo
              <ExternalLink size={15} aria-hidden="true" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Floating Badge (Mayoristas y Minoristas Graphic Badge PNG - Overlapping Sections 1 & 2) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -bottom-8 sm:-bottom-10 right-6 sm:right-12 md:right-16 z-50 hidden lg:block"
      >
        <div className="transition-transform duration-300 hover:scale-105 filter drop-shadow-2xl">
          <Image
            src="/images/masks/badge-mayoristas.png"
            alt="Mayoristas y Minoristas de todo el país"
            width={280}
            height={98}
            className="w-64 sm:w-72 md:w-80 h-auto object-contain"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
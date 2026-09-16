"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-[#102a5c] dark:bg-[#060911] section-xl scroll-mt-20 flex items-center min-h-[85vh] z-30 transition-colors duration-500"
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#102a5c]/95 via-[#102a5c]/85 to-[#102a5c]/50 dark:from-[#060911]/98 dark:via-[#080C14]/92 dark:to-[#080C14]/65 transition-colors duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102a5c] via-transparent to-transparent dark:from-[#060911] dark:via-transparent dark:to-transparent transition-colors duration-500" />
      </div>

      {/* Ambient Red Glow in Dark Mode */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-transparent dark:bg-[#EB2347]/10 blur-[180px] pointer-events-none transition-all duration-500" aria-hidden="true" />

      {/* FLAT Image Outside Grid Left: elemtnsleft.png (-61px) */}
      <div className="absolute -left-[61px] top-1/2 -translate-y-1/2 z-10 hidden lg:block pointer-events-none select-none">
        <Image
          src="/images/events/elemtnsleft.png"
          alt=""
          width={340}
          height={640}
          className="h-[480px] xl:h-[580px] w-auto object-contain object-left"
          aria-hidden="true"
        />
      </div>

      {/* FLAT Image Outside Grid Right: elementsright.png (-81px, top: 265px) */}
      <div className="absolute -right-[81px] top-[265px] z-10 hidden lg:block pointer-events-none select-none">
        <Image
          src="/images/events/elementsright.png"
          alt=""
          width={300}
          height={600}
          className="h-[440px] xl:h-[540px] w-auto object-contain object-right"
          aria-hidden="true"
        />
      </div>

      {/* FLAT Image Outside Grid Right: imgurkuexpo.png (-81px, top: 265px) */}
      <div className="absolute -right-[81px] top-[265px] z-20 hidden xl:block pointer-events-none select-none">
        <Image
          src="/images/events/imgurkuexpo.png"
          alt="EXPO URKU Evento Derecha"
          width={320}
          height={620}
          className="h-[440px] xl:h-[540px] w-auto object-contain object-right"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-30 mx-auto flex max-w-7xl items-center content-pad w-full py-16 lg:py-24">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_auto]">
          
          {/* First / Main Column */}
          <div className="flex flex-col items-start max-w-3xl">
            {/* Main Headline Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-white shadow-sm backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-[#EB2347] animate-pulse" aria-hidden="true" />
              <span>Predio Comercial e Industrial</span>
            </motion.div>

            {/* First Heading on the page: H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(42px,6.5vw,98px)] uppercase leading-[.9] tracking-[-.05em] text-white"
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
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-white/90 font-normal"
            >
              Más de 30 años conectando fabricantes, comerciantes y oportunidades dentro del mayor polo textil del país.
            </motion.p>

            {/* Main CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="#visitar"
                className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#EB2347] px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-xl shadow-[#EB2347]/30 transition-all duration-300 hover:bg-[#C41A3A] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2 focus-visible:ring-offset-[#102a5c]"
              >
                Planificá tu visita
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/expo-urku-2026"
                className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#1C9FE4] px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-xl shadow-[#1C9FE4]/30 transition-all duration-300 hover:bg-[#0284C7] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9FE4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#102a5c] lg:hidden"
              >
                EXPOURKU 2026
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                href="#historia"
                className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[#102a5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#102a5c]"
              >
                Conocé nuestra historia
              </Link>

              <Link
                href="#streaming"
                className="inline-flex min-h-[52px] items-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider text-white/85 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Transmisión en vivo
                <ExternalLink size={15} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Second Column of Hero Row (Vertically Centered with Row) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:flex flex-col items-center justify-center self-center my-auto shrink-0"
          >
            <Link
              href="/expo-urku-2026"
              className="group relative flex items-center gap-4 rounded-3xl border border-[#1C9FE4]/40 bg-[#1C9FE4]/15 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#1C9FE4] hover:bg-[#1C9FE4]/25 hover:shadow-2xl hover:shadow-[#1C9FE4]/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1C9FE4] text-white shadow-lg transition-transform group-hover:scale-110">
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#7DD3FC]">
                  Evento Destacado
                </span>
                <span className="font-display text-xl font-extrabold uppercase tracking-tight text-white">
                  EXPOURKU 2026
                </span>
                <span className="text-xs text-white/80">
                  Ronda de negocios · Nov 2026
                </span>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Floating Badge (Mayoristas y Minoristas Graphic Badge PNG) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -bottom-8 sm:-bottom-10 right-6 sm:right-12 md:right-16 lg:right-[22rem] xl:right-[24rem] z-50 hidden lg:block"
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

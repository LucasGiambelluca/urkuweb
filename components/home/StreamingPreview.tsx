"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, ArrowRight, ExternalLink, Radio, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import UliveLogo from "@/components/ui/UliveLogo";


const PROGRAMS = [
  {
    icon: Radio,
    title: "Streaming 24/7",
    text: "Eventos, entrevistas y cobertura permanente desde el paseo.",
  },
  {
    icon: CalendarDays,
    title: "Agenda de Emisión",
    text: "Conocé las próximas actividades y transmisiones especiales.",
  },
];

export default function StreamingPreview({ canalYoutube }: { canalYoutube: string }) {
  const [isPlaying, setIsPlaying] = useState(false); // NO Autoplay on load
  const [isMuted, setIsMuted] = useState(false);
  const channelUrl = canalYoutube;

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Embed URL with unmuted sound (mute=0) when user plays
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=UUcHLi56DvkHp_bgHiZzUaSw&autoplay=1&mute=${isMuted ? "1" : "0"}&enablejsapi=1`;

  return (
    <section
      id="streaming"
      className="relative overflow-hidden bg-[#F6F8FC] dark:bg-background section-lg scroll-mt-20 border-b border-border-subtle"
      aria-label="Reproductor de transmisión en vivo de Urkupiña"
    >
      {/* Pattern texture: Crosses at bottom right outside grid */}
      <div className="absolute right-0 bottom-6 w-32 md:w-44 h-40 opacity-30 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/patron-cruces.png"
          alt=""
          fill
          className="object-contain object-right dark:invert"
        />
      </div>

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Header with ULIVE Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="mb-4 flex items-center">
              <UliveLogo className="h-8 md:h-10 w-auto text-foreground" />
            </div>

            <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.04em] text-foreground">
              <span className="relative inline-block">
                En vivo desde el paseo
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

            <p className="mt-4 max-w-2xl text-lg text-muted">
              Transmitimos las 24 horas para que no te pierdas nada del movimiento.
            </p>
          </div>

          {/* Actions group */}
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" href={channelUrl}>
              <span>Ver en YouTube</span>
              <ExternalLink size={16} aria-hidden="true" />
            </Button>
          </div>
        </motion.div>

        {/* Main Player Container - Sponsors Style White Card (No Default Shadow) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[30px] border border-border-subtle bg-white dark:bg-[#0E1626] p-6 md:p-8 transition duration-500 hover:shadow-xl"
        >
          {/* Top Player Toolbar with ULIVE Logo and LIVE Badge */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <UliveLogo className="h-5 w-auto text-foreground" />
              <span className="h-4 w-px bg-border-subtle" />
              <span className="text-sm font-semibold uppercase tracking-wider text-muted">
                Transmisión Oficial ULIVE
              </span>
            </div>

            {/* LIVE Badge (Pulsing Red Dot + EN VIVO) */}
            <div className="flex items-center gap-2 rounded-full bg-[#EB2347]/10 border border-[#EB2347]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#EB2347]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EB2347] animate-pulse motion-reduce:animate-none" />
              <span>EN VIVO</span>
            </div>
          </div>

          {/* Embedded Video Screen Container */}
          <div
            className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[20px] site-image bg-neutral-900 group cursor-pointer"
            style={{ aspectRatio: "16 / 9" }}
            onClick={!isPlaying ? togglePlayPause : undefined}
          >
            {isPlaying ? (
              <iframe
                key={isMuted ? "muted" : "unmuted"}
                src={embedUrl}
                title="Reproductor de transmisión en vivo de Urkupiña"
                className="absolute left-0 top-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              /* High-Res Video Cover / Thumbnail */
              <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
                {/* Video Cover Image */}
                <Image
                  src="/images/feria-hero.jpg"
                  alt="Portada de transmisión en vivo Urkupiña"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Dark Gradient Overlay for optimal contrast & inviting mood */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0F15]/90 via-[#0B0F15]/50 to-transparent"
                  aria-hidden="true"
                />

                {/* Highly Visible & Accessible Central Play Button */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePlayPause();
                      }
                    }}
                    tabIndex={0}
                    aria-label="Reproducir transmisión en vivo de Urkupiña"
                    className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-[#EB2347] text-white shadow-[0_0_50px_rgba(235,35,71,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C41A3A] focus:outline-none focus:ring-4 focus:ring-[#EB2347] focus:ring-offset-4 focus:ring-offset-black cursor-pointer"
                  >
                    {/* Animated Pulsing Ring Behind Play Icon */}
                    <span className="absolute inset-0 rounded-full bg-[#EB2347]/40 animate-ping motion-reduce:animate-none pointer-events-none" />
                    <Play size={38} className="ml-1 fill-white text-white drop-shadow-md" />
                  </button>

                  <h3 className="mt-6 text-xl md:text-2xl font-bold tracking-tight text-white uppercase font-display">
                    Hacé clic para reproducir la señal en vivo
                  </h3>

                  <p className="mt-2 text-sm text-white/80 max-w-md">
                    Transmitiendo directo desde el Paseo Urkupiña las 24 horas.
                  </p>
                </div>
              </div>
            )}

            {/* Player Controls Overlay Bar (when video is active) */}
            {isPlaying && (
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      togglePlayPause();
                    }
                  }}
                  tabIndex={0}
                  aria-label={isPlaying ? "Pausar transmisión en vivo" : "Reproducir transmisión en vivo"}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition hover:scale-110 hover:bg-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347] focus:ring-offset-2 focus:ring-offset-black"
                  title={isPlaying ? "Pausar video" : "Reproducir video"}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleMute();
                    }
                  }}
                  tabIndex={0}
                  aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition hover:scale-110 hover:bg-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347] focus:ring-offset-2 focus:ring-offset-black"
                  title={isMuted ? "Activar audio" : "Silenciar audio"}
                >
                  {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-green-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 px-2 md:flex-row pt-4 border-t border-border-subtle">
            <p className="text-center text-sm font-medium text-muted md:text-left">
              Transmitiendo las 24 horas con audio en directo. Conocé la producción, novedades y eventos directo desde Urkupiña.
            </p>
          </div>
        </motion.div>

        {/* Programs Cards matching Sponsors section card design (No Default Shadow) */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {PROGRAMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-6 rounded-[30px] border border-border-subtle bg-white dark:bg-[#0E1626] p-8 transition duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EB2347] text-white shadow-md shrink-0">
                  <Icon size={28} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold uppercase text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-base leading-relaxed text-muted">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
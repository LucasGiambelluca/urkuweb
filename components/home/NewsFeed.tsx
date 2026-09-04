"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { getCategoryStyle } from "@/lib/constants/blog";
import { NOVEDADES_RESPALDO, type NovedadVisible } from "@/lib/contenido/novedades";

/**
 * Las novedades llegan ya consultadas desde la home. Antes se pedian a
 * Supabase desde el navegador con credenciales vencidas, la consulta fallaba
 * en silencio y siempre se veia el respaldo.
 */
export default function NewsFeed({ novedades }: { novedades: NovedadVisible[] }) {
  const posts = novedades;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track window resize & container dimensions for responsive carousel math
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Breakpoints: Desktop (>=1024px, 3 cards), Tablet (640-1023px, 2 cards), Mobile (<640px, 1 card + 25%+ peek)
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const step = isDesktop ? 3 : isTablet ? 2 : 1;
  const visibleCount = isDesktop ? 3 : isTablet ? 2 : 1;
  const maxIndex = Math.max(0, posts.length - visibleCount);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - step));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + step));
  };

  // Card translate distance math
  const gap = isDesktop ? 24 : isTablet ? 24 : 16;
  let itemWidth = 300;
  if (containerWidth > 0) {
    if (isDesktop) {
      itemWidth = (containerWidth - 2 * gap) / 3;
    } else if (isTablet) {
      itemWidth = (containerWidth - 1 * gap) / 2;
    } else {
      // 76% card width on mobile -> remaining ~24% container space + gap leaves >25% of card #2 visible peeking
      itemWidth = containerWidth * 0.76;
    }
  }

  const translateX = -currentIndex * (itemWidth + gap);
  const maxDragLeft = maxIndex * (itemWidth + gap);

  return (
    <section
      id="noticias"
      className="relative overflow-hidden bg-[#F7F7F5] dark:bg-[#080C14] section-lg scroll-mt-20 transition-colors duration-300"
      aria-label="Noticias y novedades del Paseo Urkupiña"
    >
      {/* Ambient glow light background */}
      <div
        className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#243A60]/10 dark:bg-[#EB2347]/10 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Header section with Title, Description, CTA, and Navigation Arrows */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end mb-12"
        >
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-[2px] w-12 bg-[#EB2347]" />
              <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
                Novedades e Información
              </span>
            </div>

            <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.05em] text-foreground">
              Blog e <br /> Institucionales
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:max-w-2xl">
            <p className="text-base md:text-lg leading-relaxed text-muted">
              Mantenete al tanto de los últimos anuncios oficiales, mejoras de logística y novedades operativas del paseo de compras.
            </p>

            <div className="flex items-center gap-3 shrink-0">
              <Button variant="primary" href="/novedades" className="shrink-0 whitespace-nowrap">
                <span>Ver todas</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Button>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  aria-label="Ver noticias anteriores"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 dark:border-white/15 bg-white dark:bg-[#0E1626] text-foreground transition-all duration-200 hover:bg-[#EB2347] hover:text-white hover:border-[#EB2347] dark:hover:bg-[#EB2347] dark:hover:border-[#EB2347] focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-foreground dark:disabled:hover:bg-[#0E1626] disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  aria-label="Ver noticias siguientes"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 dark:border-white/15 bg-white dark:bg-[#0E1626] text-foreground transition-all duration-200 hover:bg-[#EB2347] hover:text-white hover:border-[#EB2347] dark:hover:bg-[#EB2347] dark:hover:border-[#EB2347] focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-foreground dark:disabled:hover:bg-[#0E1626] disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Draggable News Carousel Track */}
        <div ref={containerRef} className="relative overflow-hidden py-4 select-none">
          <motion.div
            drag="x"
            dragConstraints={{ left: -maxDragLeft, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_e, info) => {
              const swipeThreshold = 40;
              if (info.offset.x < -swipeThreshold) {
                handleNext();
              } else if (info.offset.x > swipeThreshold) {
                handlePrev();
              }
            }}
            animate={{ x: translateX }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="flex cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ gap: `${gap}px` }}
          >
            {posts.map((post, index) => {
              // La cinta de "Próximamente" la decide el dato: una nota con
              // fecha futura, o una del respaldo marcada como tal. Antes
              // habia un respaldo por posicion (las dos primeras tarjetas),
              // que quedo muerto cuando las novedades pasaron a salir de la
              // base con el campo siempre definido.
              const isUpcoming = post.isUpcoming ?? false;
              const catStyle = getCategoryStyle(post.category);

              return (
                <motion.div
                  key={post.id}
                  style={{ width: `${itemWidth}px` }}
                  className="shrink-0"
                >
                  <Link
                    href={`/novedades/${post.id}`}
                    aria-label={`Ver noticia ${index + 1}: ${post.title}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E1626] p-8 shadow-sm dark:shadow-md transition duration-500 hover:-translate-y-2 hover:shadow-xl dark:hover:border-[#EB2347]/40 dark:hover:shadow-2xl dark:hover:shadow-black/50 focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2 block h-full"
                  >
                    {/* Diagonal Red Ribbon Bullet Badge for Próximamente */}
                    {isUpcoming && (
                      <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden pointer-events-none z-20">
                        <div className="absolute top-6 -right-10 w-44 rotate-45 bg-gradient-to-r from-[#EB2347] via-[#FF2E55] to-[#C41A3A] text-white text-[10px] font-black uppercase tracking-[0.22em] py-1.5 shadow-lg shadow-[#EB2347]/35 border-y border-white/30 flex items-center justify-center gap-1.5 text-center">
                          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          <span>Próximamente</span>
                        </div>
                      </div>
                    )}

                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative h-48 w-full overflow-hidden site-image mb-6 border border-slate-200/80 dark:border-white/10 shadow-md">
                        <Image
                          src={post.image || NOVEDADES_RESPALDO[index % NOVEDADES_RESPALDO.length].image || "/images/one.png"}
                          alt={`Imagen destacada de ${post.title}`}
                          fill
                          // Sin esto Next sirve el archivo mas grande del
                          // srcset para una tarjeta que nunca pasa de un
                          // tercio del ancho. Los cortes siguen a los del
                          // carrusel: una tarjeta en celular, dos en tablet,
                          // tres en escritorio.
                          sizes="(max-width: 640px) 76vw, (max-width: 1024px) 45vw, 30vw"
                          className="site-image object-cover transition duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                      </div>

                      {/* Date & Category Info */}
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${catStyle.badgeBg} ${catStyle.badgeText} border ${catStyle.badgeBorder}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${catStyle.dotColor}`} aria-hidden="true" />
                          {post.category || "Cultura"}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.15em] text-[#EB2347]">
                          <Calendar size={13} aria-hidden="true" />
                          <span>
                            {post.created_at
                              ? new Date(post.created_at).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Anuncio"}
                          </span>
                        </div>
                      </div>



                      {/* High Contrast Header */}
                      <h3 className="font-display text-2xl uppercase tracking-tight text-foreground group-hover:text-[#EB2347] transition-colors mb-3 pr-4">
                        {post.title}
                      </h3>

                      {/* Accessible Body Content */}
                      <p className="text-sm md:text-base leading-relaxed text-muted">
                        {post.content.length > 130
                          ? `${post.content.slice(0, 130)}...`
                          : post.content}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir al grupo ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-[#EB2347]"
                    : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

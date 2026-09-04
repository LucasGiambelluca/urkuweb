"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MaskedImage from "@/components/ui/MaskedImage";
import { Store, Users, Zap, Truck, CheckCircle2, ArrowRight, Download, X, Send, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

const BENEFITS = [
  {
    icon: Store,
    title: "2.200+ Puestos activos",
    desc: "Infraestructura textil consolidada en un ecosistema de alta rotación.",
  },
  {
    icon: Users,
    title: "Tráfico de 5.000+ personas diarias",
    desc: "Afluencia permanente de compradores mayoristas y minoristas.",
  },
  {
    icon: Zap,
    title: "Infraestructura integral",
    desc: "Suministro eléctrico trifásico, agua corriente y vigilancia 24/7.",
  },
  {
    icon: Truck,
    title: "Acceso a logística integrada",
    desc: "Dársenas de carga y recepción de paquetería directa dentro del predio.",
  },
];

export default function RentalsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Trap focus and handle ESC key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === "Escape") {
        setIsModalOpen(false);
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
    }, 2500);
  };

  return (
    <section
      id="alquilar"
      className="relative overflow-hidden bg-background section-lg scroll-mt-20 border-b border-border-subtle"
      aria-label="Información para alquilar puestos y oportunidades comerciales en Urkupiña"
    >
      {/* Pattern texture: Red dots halftone at right:0 outside grid */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 md:w-44 h-40 opacity-30 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/halftone.svg"
          alt=""
          fill
          // Tamano fijo por clases w-32/md:w-44, no crece con el viewport
          sizes="(min-width: 768px) 176px, 128px"
          className="object-contain object-right"
        />
      </div>

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* LEFT TEXT & BENEFITS COLUMN (50% / 6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <div className="mb-6 flex items-center gap-4">
                <span className="h-[2px] w-12 bg-[#EB2347]" />
                <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
                  Oportunidad Comercial
                </span>
              </div>

              <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.04em] text-foreground font-bold">
                <span className="relative inline-block">
                  Alquilá tu puesto
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

              <p className="mt-4 text-base md:text-lg text-muted leading-relaxed">
                Formá parte del polo comercial textil de mayor crecimiento de la región. Directo de fábrica a comerciante sin intermediarios.
              </p>
            </div>

            {/* Benefits Stack Cards */}
            <div className="mt-8 flex flex-col gap-4">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="flex items-start gap-4 p-4 rounded-[20px] bg-white dark:bg-[#0E1626] border border-border-subtle transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EB2347]/10 text-[#EB2347] shrink-0 mt-0.5">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {b.title}
                      </h3>
                      <p className="text-sm text-muted mt-0.5 leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <span>Consultar disponibilidad</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Button>

              <Button variant="secondary" href="#contacto">
                <Download size={16} aria-hidden="true" />
                <span>Descargar requisitos</span>
              </Button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE COLUMN (50% / 6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative overflow-hidden site-image rounded-[36px] border border-border-subtle bg-white dark:bg-[#0E1626] p-3 transition-all duration-300 hover:shadow-xl">
              {/* Aerial Photography Image */}
              <MaskedImage
                src="/images/decenital.png"
                alt="Vista aérea del predio Paseo Urkupiña"
                fill
                // Columna de 6/12 en una grilla dentro de max-w-7xl (1280px):
                // 100% de ancho abajo de lg, 640px (mitad) de ahi en mas
                sizes="(max-width: 1024px) 100vw, 640px"
                wrapperClassName="w-full site-image rounded-[28px] aspect-[4/3]"
                imageClassName="site-image object-cover transition-transform duration-700 hover:scale-105"
                maskSrc="/images/masks/maskelements.png"
                priority
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                aria-hidden="true"
              />

              {/* Overlaid Floating Metrics Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-2xl bg-white/90 dark:bg-[#0B111E]/90 border border-white/40 dark:border-white/10 p-4 backdrop-blur-md text-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Sparkles size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Convocatoria 2026</span>
                    <span className="text-sm font-extrabold text-foreground">Puestos comerciales disponibles</span>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#EB2347] bg-[#EB2347]/10 px-3 py-1.5 rounded-full border border-[#EB2347]/20">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Garantía Oficial
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Accessible Form Modal for Inquiry */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-border-subtle bg-background p-6 md:p-8 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Cerrar formulario de consulta"
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-foreground transition hover:bg-[#EB2347] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#EB2347]"
              >
                <X size={18} aria-hidden="true" />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                    <CheckCircle2 size={36} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                    ¡Consulta Enviada!
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    Nos pondremos en contacto a la brevedad con la información técnica y de disponibilidad.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#EB2347]">
                      Disponibilidad & Alquileres
                    </span>
                    <h3 id="modal-title" className="font-display text-3xl uppercase tracking-tight text-foreground mt-1">
                      Consultar por un Puesto
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Completá tus datos para coordinar una visita y consultar condiciones de alquiler.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Pre-filled Subject */}
                    <div>
                      <label htmlFor="asunto-rental" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Asunto
                      </label>
                      <input
                        type="text"
                        id="asunto-rental"
                        readOnly
                        value="Consulta de Alquiler de Puesto Comercial"
                        className="w-full rounded-xl border border-border-subtle bg-white/20 dark:bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-[#EB2347] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="nombre" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Nombre y Apellido *
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="nombre"
                        required
                        placeholder="Ej. Carlos Rodríguez"
                        className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email-rental" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Email de Contacto *
                        </label>
                        <input
                          type="email"
                          id="email-rental"
                          required
                          placeholder="carlos@ejemplo.com"
                          className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                        />
                      </div>

                      <div>
                        <label htmlFor="telefono-rental" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="telefono-rental"
                          required
                          placeholder="11 2345-6789"
                          className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rubro" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Rubro Comercial *
                      </label>
                      <select
                        id="rubro"
                        required
                        className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                      >
                        <option value="" className="bg-white dark:bg-[#0E1626] text-foreground">Seleccionar rubro...</option>
                        <option value="indumentaria-hombre" className="bg-white dark:bg-[#0E1626] text-foreground">Indumentaria Masculina</option>
                        <option value="indumentaria-mujer" className="bg-white dark:bg-[#0E1626] text-foreground">Indumentaria Femenina</option>
                        <option value="infantil" className="bg-white dark:bg-[#0E1626] text-foreground">Moda Infantil & Bebés</option>
                        <option value="calzado" className="bg-white dark:bg-[#0E1626] text-foreground">Calzado & Marroquinería</option>
                        <option value="telas" className="bg-white dark:bg-[#0E1626] text-foreground">Telas & Insumos</option>
                        <option value="otro" className="bg-white dark:bg-[#0E1626] text-foreground">Otro Rubro</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mensaje" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Mensaje (Opcional)
                      </label>
                      <textarea
                        id="mensaje"
                        rows={3}
                        placeholder="Comentarios sobre la ubicación o dimensiones requeridas..."
                        className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#EB2347] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#EB2347]/25 transition hover:bg-[#C41A3A] focus:outline-none focus:ring-2 focus:ring-[#EB2347] cursor-pointer"
                      >
                        <Send size={16} aria-hidden="true" />
                        Enviar Consulta Commercial
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

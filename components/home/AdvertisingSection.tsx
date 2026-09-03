"use client";

import { useState, useEffect, useRef, useCallback, useActionState } from "react";
import Image from "next/image";
import { Monitor, Radio, FileText, Award, Eye, Calendar, Sparkles, ArrowRight, Download, Send, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { enviarConsulta } from "@/app/actions/consultas";
import { estadoInicial } from "@/lib/consultas/estado";

const AD_FORMATS = [
  {
    icon: Monitor,
    title: "Cartelería Digital en el Predio",
    desc: "Pantallas LED de alta definición y gran formato ubicadas estratégicamente en pasillos de alto tránsito y accesos.",
    tag: "Alto Impacto Visual",
    gridClass: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: Radio,
    title: "Espacios en Transmisión ULIVE",
    desc: "Zócalos publicitarios, spots en streaming 24/7 y menciones en directo durante la programación oficial.",
    tag: "Audiencia Digital",
    gridClass: "md:col-span-1",
  },
  {
    icon: FileText,
    title: "Publicidad en Catálogos Online",
    desc: "Banners destacados y posicionamiento preferencial en la plataforma digital unificada de los 2.200 puestos.",
    tag: "Conversion Directa",
    gridClass: "md:col-span-1",
  },
  {
    icon: Award,
    title: "Sponsorship de Eventos Comunitarios",
    desc: "Presencia institucional exclusiva como sponsor principal en desfiles, festivales y jornadas de capacitación.",
    tag: "Posicionamiento de Marca",
    gridClass: "md:col-span-2 lg:col-span-1",
  },
];

const STATS = [
  { icon: Eye, value: "5.000+", label: "Personas diarias" },
  { icon: Calendar, value: "365", label: "Días de actividad" },
  { icon: Sparkles, value: "100K+", label: "Impresiones mensuales" },
];

export default function AdvertisingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Estable, porque el formulario la usa dentro de un efecto.
  const cerrarModal = useCallback(() => setIsModalOpen(false), []);

  // Trap focus & ESC key for modal accessibility
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

  return (
    <section
      id="publicidad"
      className="relative overflow-hidden bg-background section-lg scroll-mt-20 border-b border-border-subtle"
      aria-label="Información de publicidad y soluciones para anunciantes en Urkupiña"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-[#EB2347]/10 blur-[180px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-10 h-[500px] w-[500px] rounded-full bg-[#243A60]/15 blur-[170px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-[2px] w-12 bg-[#EB2347]" />
              <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
                Publicidad & Anunciantes
              </span>
            </div>

            <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.04em] text-foreground">
              <span className="relative inline-block text-[#EB2347]">
                Tu marca
                <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-5 pointer-events-none">
                  <Image
                    src="/images/masks/brush-stroke-4.png"
                    alt=""
                    fill
                    className="object-contain object-left filter drop-shadow-sm"
                  />
                </span>
              </span>{" "}
              en el centro del movimiento
            </h2>

            <p className="mt-4 max-w-2xl text-lg md:text-xl font-normal text-muted leading-relaxed">
              Llegá a miles de comerciantes y fabricantes todos los días.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 rounded-3xl border border-border-subtle bg-white/40 dark:bg-white/[0.03] p-4 md:p-6 backdrop-blur-xl shrink-0">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EB2347]/10 text-[#EB2347]">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-foreground leading-none block">
                      {s.value}
                    </span>
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider block mt-0.5">
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Bento-Grid Layout for Ad Formats (2x2 / 4 format cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AD_FORMATS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                tabIndex={0}
                className={`group relative flex flex-col justify-between rounded-[32px] border border-border-subtle bg-white dark:bg-[#0E1626] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#EB2347]/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#EB2347] ${item.gridClass}`}
              >
                <div>
                  {/* Icon & Tag Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#243A60] dark:bg-white/10 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#EB2347]">
                      <Icon size={28} aria-hidden="true" />
                    </div>

                    <span className="rounded-full bg-white/60 dark:bg-white/[0.06] border border-border-subtle px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  {/* Proper Heading Hierarchy: H3 for format titles */}
                  <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm md:text-base text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-semibold text-foreground/80 group-hover:text-[#EB2347] transition-colors">
                  <span>Formato publicitario verificado</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Bar (CTAs) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[30px] border border-border-subtle bg-white dark:bg-[#0E1626] p-8 transition duration-500 hover:shadow-xl"
        >
          <div>
            <h3 className="font-display text-3xl uppercase tracking-tight text-foreground font-bold">
              ¿Querés promocionar tu marca en Urkupiña?
            </h3>
            <p className="text-base text-muted mt-1 max-w-xl leading-relaxed">
              Diseñamos paquetes publicitarios a medida según el público objetivo y la frecuencia de emisión que requiera tu empresa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <span>Solicitar cotización</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Accessible Quotation Form Modal */}
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

            {/* Modal Container */}
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-ad-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-border-subtle bg-background p-6 md:p-8 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Cerrar formulario de cotización"
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-foreground transition hover:bg-[#EB2347] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#EB2347]"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <FormularioPublicidad alCerrar={cerrarModal} refPrimerCampo={firstInputRef} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * El formulario vive en su propio componente y no en la seccion, para que el
 * estado del envio se pierda al cerrar el modal. Si el hook estuviera en el
 * padre, que nunca se desmonta, al reabrir el modal seguiria mostrando el
 * panel de exito del envio anterior en lugar de un formulario limpio.
 */
function FormularioPublicidad({
  alCerrar,
  refPrimerCampo,
}: {
  alCerrar: () => void;
  refPrimerCampo: React.RefObject<HTMLInputElement | null>;
}) {
  const [resultado, accionEnviar, enviando] = useActionState(enviarConsulta, estadoInicial);
  const isSubmitted = resultado.estado === "ok";

  // Se cierra solo despues del exito, como hacia antes de conectar el guardado.
  useEffect(() => {
    if (!isSubmitted) return;
    const temporizador = setTimeout(alCerrar, 2500);
    return () => clearTimeout(temporizador);
  }, [isSubmitted, alCerrar]);

  return (
    <>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                    <CheckCircle2 size={36} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                    ¡Solicitud Recibida!
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    Nuestro equipo de publicidad se comunicará contigo a la brevedad con la propuesta tarifaria y el Media Kit.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#EB2347]">
                      Publicidad & Anunciantes
                    </span>
                    <h3 id="modal-ad-title" className="font-display text-3xl uppercase tracking-tight text-foreground mt-1">
                      Solicitar Cotización
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Completá el formulario para recibir el Media Kit y la propuesta publicitaria a medida.
                    </p>
                  </div>

                  <form action={accionEnviar} className="space-y-4">
                    <input type="hidden" name="tipo" value="publicidad" />
                    <input type="hidden" name="nombre" value="Consulta de publicidad" />
                    {/* Campo trampa: invisible para las personas, lo llenan los bots. */}
                    <input
                      type="text"
                      name="sitioWeb"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    {/* Pre-filled Subject */}
                    <div>
                      <label htmlFor="asunto" className="block text-xs font-semibold text-foreground mb-1">
                        Asunto
                      </label>
                      <input
                        type="text"
                        id="asunto"
                        name="asunto"
                        readOnly
                        value="Solicitud de Cotización Publicitaria"
                        className="w-full rounded-xl border border-border-subtle bg-white/20 dark:bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-[#EB2347] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="empresa" className="block text-xs font-semibold text-foreground mb-1">
                        Empresa / Marca *
                      </label>
                      <input
                        ref={refPrimerCampo}
                        type="text"
                        id="empresa"
                        name="empresa"
                        required
                        placeholder="Ej. Textil Argentina S.A."
                        className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email-ad" className="block text-xs font-semibold text-foreground mb-1">
                          Email de Contacto *
                        </label>
                        <input
                          type="email"
                          id="email-ad"
                          name="email"
                          required
                          placeholder="contacto@marca.com"
                          className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                        />
                      </div>

                      <div>
                        <label htmlFor="telefono-ad" className="block text-xs font-semibold text-foreground mb-1">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="telefono-ad"
                          name="telefono"
                          required
                          placeholder="11 2345-6789"
                          className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="formato" className="block text-xs font-semibold text-foreground mb-1">
                        Formato Publicitario de Interés *
                      </label>
                      <select
                        id="formato"
                        name="formato"
                        required
                        className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                      >
                        <option value="">Seleccionar formato...</option>
                        <option value="carteleria">Cartelería Digital en el Predio</option>
                        <option value="ulive">Espacios en Transmisión ULIVE</option>
                        <option value="catalogos">Publicidad en Catálogos Online</option>
                        <option value="sponsorship">Sponsorship de Eventos</option>
                        <option value="integral">Paquete Integral 360°</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mensaje-ad" className="block text-xs font-semibold text-foreground mb-1">
                        Detalle del requerimiento (Opcional)
                      </label>
                      <textarea
                        id="mensaje-ad"
                        name="mensaje"
                        rows={3}
                        placeholder="Comentarios sobre la campaña, período estimado o presupuesto..."
                        className="w-full rounded-xl border border-border-subtle bg-white/40 dark:bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20 resize-none"
                      />
                    </div>

                    {resultado.estado === "error" && (
                      <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                        <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
                        <span>
                          {resultado.mensajeGeneral ??
                            "Por favor, corregí los campos indicados antes de enviar."}
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={enviando}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#EB2347] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#EB2347]/25 transition hover:bg-[#C41A3A] focus:outline-none focus:ring-2 focus:ring-[#EB2347] disabled:opacity-60 cursor-pointer"
                      >
                        <Send size={16} aria-hidden="true" />
                        Enviar Solicitud de Cotización
                      </button>
                    </div>
                  </form>
                </div>
              )}
    </>
  );
}

"use client";

import { useState } from "react";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { enlaceWhatsapp, type DatosDeContacto } from "@/lib/contenido/tipos";

export default function FloatingWhatsApp({ whatsapp }: { whatsapp: DatosDeContacto['whatsapp'] }) {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappUrl = enlaceWhatsapp(whatsapp);

  return (
    <aside
      aria-label="Atención flotante por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto"
    >
      {/* Expanded Legend / Popover Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-sm w-80 sm:w-96 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#243A60]/95 via-[#1B2A49]/95 to-[#0D1525]/95 p-5 text-white shadow-2xl backdrop-blur-xl"
          >
            {/* Ambient Background Light */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#EB2347]/20 blur-2xl pointer-events-none" />

            {/* Header with Close Button */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                  <MessageCircle size={20} />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-base uppercase tracking-tight text-white font-bold leading-none">
                    Urkupiña WhatsApp
                  </h4>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                    ● En línea · Atención Comercial
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors focus:outline-none"
                aria-label="Minimizar aviso de WhatsApp"
              >
                <X size={15} />
              </button>
            </div>

            {/* Legend Content */}
            <div className="relative z-10 space-y-2 mb-4">
              <p className="text-sm text-white/90 leading-relaxed">
                ¡Hola! 👋 ¿Tenés dudas sobre alquileres, horarios, compras mayoristas o servicios en la feria?
              </p>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/90 flex items-center gap-2">
                <Sparkles size={14} className="text-[#EB2347] shrink-0" />
                <span>Chateá directamente con nuestro equipo oficial.</span>
              </div>
            </div>

            {/* Action CTA Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <span>Iniciar chat por WhatsApp</span>
              <Send size={15} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* Pulsing Aura Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-[#EB2347] opacity-75 blur animate-pulse group-hover:opacity-100 transition duration-300" />

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex items-center gap-3 rounded-full bg-[#243A60] dark:bg-[#1B2A49] border-2 border-emerald-500 px-4 py-3 text-white shadow-2xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Abrir chat de WhatsApp con Urkupiña"
        >
          {/* WhatsApp Icon Circle */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shrink-0">
            <MessageCircle size={22} />
          </div>

          {/* Quick Legend Label */}
          <div className="hidden sm:flex flex-col items-start text-left pr-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 leading-none">
              WhatsApp Oficial
            </span>
            <span className="text-sm font-bold text-white mt-1 leading-none">
              {whatsapp.visible}
            </span>
          </div>

          {/* Indicator Dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </button>
      </motion.div>
    </aside>
  );
}

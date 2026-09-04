"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, X, QrCode, CheckCircle2, ShieldCheck, Zap, MapPin, ArrowRight, Info, UserCheck, Smartphone, Eye } from "lucide-react";
import Button from "@/components/ui/Button";

export default function WifiVouchersSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="wifi-vouchers"
      className="relative overflow-hidden bg-[#1B2A49] text-white pb-24 pt-8 scroll-mt-20 border-b border-white/10"
      aria-label="Vouchers de Internet WiFi en Paseo Urkupiña"
    >
      {/* Background Ambient Glows & Patterns */}
      <div
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-[#EB2347]/10 blur-[180px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Halftone texture background overlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 md:w-64 h-64 opacity-15 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/halftone.svg"
          alt=""
          fill
          // Tamano fijo por clases w-48/md:w-64, no crece con el viewport
          sizes="(min-width: 768px) 256px, 192px"
          className="object-contain object-right"
        />
      </div>

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Banner Splitter Container: Flat, Wide Splitter layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT COLUMN: Text Content & Pricing Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              {/* Subtitle Badge */}
              <div className="mb-6 flex items-center gap-4">
                <span className="h-[2px] w-12 bg-[#EB2347]" />
                <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
                  Conectividad en el predio
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="font-display text-[clamp(36px,4.5vw,72px)] sm:text-[clamp(42px,5vw,80px)] lg:text-[clamp(36px,3.8vw,56px)] xl:text-[clamp(44px,4.5vw,76px)] uppercase leading-[.88] tracking-[-.05em] text-white font-bold">
                Vouchers de{" "}
                <span className="relative inline-block text-[#EB2347]">
                  Internet
                  <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-5 pointer-events-none">
                    <Image
                      src="/images/masks/brush-stroke-4.png"
                      alt=""
                      fill
                      className="object-contain object-left filter drop-shadow-sm"
                    />
                  </span>
                </span>{" "}
                disponibles
              </h2>

              <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed font-normal max-w-xl">
                Navegá a máxima velocidad en la red WiFi FULL 5Ghz & 6Ghz de Paseo Urkupiña. Conexión rápida, estable y segura durante toda tu visita o jornada comercial.
              </p>

              {/* Flat Price Banner Pills */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="rounded-2xl bg-white/10 px-5 py-3 border border-white/15 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-white/60 block">
                    Acceso 1 Día
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-display text-2xl font-black text-white">$1.000</span>
                    <span className="text-xs text-white/60 font-semibold">ARS</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#EB2347]/20 px-5 py-3 border border-[#EB2347]/40 backdrop-blur-sm relative">
                  <span className="absolute -top-2.5 right-3 bg-[#EB2347] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                    RECOMENDADO
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-white/70 block">
                    Acceso 1 Mes
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-display text-2xl font-black text-white">$10.000</span>
                    <span className="text-xs text-white/60 font-semibold">ARS</span>
                  </div>
                </div>
              </div>

              {/* Quick Specs Checklist */}
              <div className="mt-8 space-y-2.5 text-xs text-white/70 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#EB2347] shrink-0" />
                  <span>WiFi 5Ghz & 6Ghz con cobertura total en todas las naves</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#EB2347] shrink-0" />
                  <span>Disponibles para comprar en las cajas e informes del predio</span>
                </div>
              </div>
            </div>

            {/* CTA Button opening Modal */}
            <div className="mt-10 flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EB2347] hover:bg-[#C41A3A] px-8 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#EB2347]/30"
              >
                <span>Ver Planes y Más Información</span>
                <Info size={18} />
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Visual Cards Image Graphic (Without borders, background-free, larger size) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center p-2 sm:p-4"
          >
            <div className="relative w-full max-w-4xl lg:max-w-5xl group cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <Image
                src="/images/wifi-vouchers-cards.png"
                alt="Tarjetas Voucher WiFi Diario y Mensual Urkupiña"
                width={1200}
                height={780}
                className="w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.03]"
                priority
              />
            </div>

            {/* Short Legal Disclaimer Caption */}
            <p className="mt-3 text-[11px] text-white/50 text-center font-normal italic tracking-wide">
              * Imágenes con fines meramente ilustrativos. Los datos, códigos y diseños mostrados en las tarjetas de muestra pueden diferir de los vigentes al momento de la compra.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE INFORMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl rounded-[32px] bg-[#0A1428] border border-white/20 p-6 sm:p-10 text-white shadow-2xl z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col justify-between"
            >
              {/* Top Bar with Close Button */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi size={20} className="text-[#EB2347]" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#EB2347]">
                      SERVICIO DE CONECTIVIDAD OFICIAL
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white font-extrabold">
                    Vouchers WiFi Urkupiña
                  </h3>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/15 shrink-0"
                  aria-label="Cerrar ventana de información"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="py-6 space-y-8 overflow-y-auto pr-2 custom-scrollbar">

                {/* Visual Image Preview Inside Modal */}
                <div className="relative w-full flex flex-col items-center justify-center py-2">
                  <Image
                    src="/images/wifi-vouchers-cards.png"
                    alt="Vouchers WiFi Urkupiña"
                    width={1100}
                    height={700}
                    className="w-full max-w-3xl h-auto object-contain"
                  />
                  <p className="mt-2 text-[10px] sm:text-[11px] text-white/40 text-center font-normal italic">
                    * Imágenes ilustrativas. La información y formato exhibido en las tarjetas de muestra es de carácter referencial.
                  </p>
                </div>

                {/* Plans Comparison Table Grid */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-[#EB2347]" />
                    Planes & Tarifas Disponibles
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Plan Diario */}
                    <div className="rounded-2xl bg-white/5 p-5 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono uppercase tracking-widest text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded border border-blue-400/30 font-bold">
                            Acceso por 1 Día
                          </span>
                          <span className="text-[10px] text-white/50 font-mono">D_0003</span>
                        </div>
                        <div className="font-display text-3xl font-black text-white mt-2">
                          $1.000 <span className="text-xs text-white/60 font-semibold">ARS</span>
                        </div>
                        <p className="mt-2 text-xs text-white/70 leading-relaxed font-normal">
                          Ideal para visitantes, compradores eventuales y jornadas diarias de compras.
                        </p>
                      </div>

                      <ul className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-white/80">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#EB2347]" />
                          <span>24 Horas continuas de acceso</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#EB2347]" />
                          <span>Válido para 1 dispositivo</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#EB2347]" />
                          <span>Conexión 5Ghz & 6Ghz</span>
                        </li>
                      </ul>
                    </div>

                    {/* Plan Mensual */}
                    <div className="rounded-2xl bg-[#EB2347]/10 p-5 border border-[#EB2347]/30 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                        <div className="absolute top-3 -right-8 w-32 rotate-45 bg-[#EB2347] text-white text-[8px] font-black uppercase text-center py-1">
                          RECOMENDADO
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono uppercase tracking-widest text-white bg-[#EB2347] px-2.5 py-0.5 rounded font-black">
                            Acceso por 1 Mes
                          </span>
                          <span className="text-[10px] text-white/50 font-mono mr-6">M_0030</span>
                        </div>
                        <div className="font-display text-3xl font-black text-white mt-2">
                          $10.000 <span className="text-xs text-white/60 font-semibold">ARS</span>
                        </div>
                        <p className="mt-2 text-xs text-white/70 leading-relaxed font-normal">
                          Diseñado para locatarios, fabricantes, puesteros y comerciantes permanentes.
                        </p>
                      </div>

                      <ul className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-white/80">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#EB2347]" />
                          <span>30 Días corridos de navegación 24/7</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#EB2347]" />
                          <span>Prioridad de velocidad en el predio</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#EB2347]" />
                          <span>Soporte técnico dedicado</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Instructions Section */}
                <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                    <Smartphone size={16} className="text-[#EB2347]" />
                    ¿Cómo activar tu Voucher?
                  </h4>

                  <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/80">
                    <li className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="font-mono font-bold text-[#EB2347] block mb-1">PASO 1</span>
                      <span>Raspa la banda rascable de la tarjeta para descubrir tu clave de acceso.</span>
                    </li>
                    <li className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="font-mono font-bold text-[#EB2347] block mb-1">PASO 2</span>
                      <span>Escanea el QR o conectate en tu celular a la red <strong>"Urk FULL 5G"</strong> o <strong>"Urk FULL 6G"</strong>.</span>
                    </li>
                    <li className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="font-mono font-bold text-[#EB2347] block mb-1">PASO 3</span>
                      <span>Introducí el código numérico y navega a máxima velocidad de inmediato.</span>
                    </li>
                  </ol>
                </div>

                {/* Point of Sale Info */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#EB2347]/20 to-blue-600/20 border border-white/15">
                  <MapPin size={24} className="text-[#EB2347] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <h5 className="font-bold text-white uppercase tracking-wider mb-1">
                      ¿Dónde adquirir los Vouchers?
                    </h5>
                    <p className="text-white/70 leading-relaxed font-normal">
                      Podés comprar tus tarjetas físicas de acceso WiFi en todos los <strong>puntos de venta, cajas e informes oficiales</strong> distribuidos dentro del predio comercial de Urkupiña.
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                <span className="text-xs text-white/50 hidden sm:inline">
                  Red Oficial Paseo de Compras Urkupiña
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-[#102A5C] hover:bg-white/90 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Entendido / Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

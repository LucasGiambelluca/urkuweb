"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Car,
  Wifi,
  Phone,
  MessageCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  ArrowRight,
  Sparkles,
  QrCode,
  Smartphone,
  Eye,
  X
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { PreciosDeServicios } from "@/lib/contenido/tipos";

// Puestos Libres Data from Attached Image 1
const AVAILABLE_BOOTHS = [
  { sector: "Sector A1", row: "Fila 1", booth: "Puesto 7", status: "Disponible" },
  { sector: "Sector A1", row: "Fila 1", booth: "Puesto 8", status: "Disponible" },
  { sector: "Sector A6", row: "Fila 11", booth: "Puesto 5", status: "Disponible" },
  { sector: "Sector A6", row: "Fila 11", booth: "Puesto 6", status: "Disponible" },
  { sector: "Sector A6", row: "Fila 11", booth: "Puesto 7", status: "Disponible" },
  { sector: "Sector A6", row: "Fila 12", booth: "Puesto 6", status: "Disponible" },
  { sector: "Sector A6", row: "Fila 12", booth: "Puesto 8", status: "Disponible" },
];

// Payment Calendar Schedule from Attached Image 2
const PAYMENT_SCHEDULE = [
  { days: "Días 1 al 5", Concept: "Pago del Alquiler mensual" },
  { days: "Días 5 al 10", Concept: "Primer Pago de Expensas" },
  { days: "Días 10 al 15", Concept: "Segundo Pago de Expensas" },
];

export default function ServicesHubSection({ precios }: { precios: PreciosDeServicios }) {
  const [activeTab, setActiveTab] = useState<"puestos" | "estacionamiento" | "internet">("internet");
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  React.useEffect(() => {
    const handleHashAndEvents = () => {
      const hash = window.location.hash;
      if (hash === "#puestos" || hash === "#alquiler") {
        setActiveTab("puestos");
      } else if (hash === "#estacionamiento" || hash === "#estacionar") {
        setActiveTab("estacionamiento");
      } else if (hash === "#wifi-vouchers" || hash === "#internet") {
        setActiveTab("internet");
      }
    };

    const handleCustomTabEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail === "puestos" || customEvent.detail === "estacionamiento" || customEvent.detail === "internet") {
          setActiveTab(customEvent.detail);
        }
      }
    };

    handleHashAndEvents();
    window.addEventListener("hashchange", handleHashAndEvents);
    window.addEventListener("select-service-tab", handleCustomTabEvent);

    return () => {
      window.removeEventListener("hashchange", handleHashAndEvents);
      window.removeEventListener("select-service-tab", handleCustomTabEvent);
    };
  }, []);

  return (
    <section
      id="servicios-predio"
      className="relative overflow-hidden bg-[#1B2A49] text-white section-lg scroll-mt-20 border-b border-white/10"
      aria-label="Servicios, Alquiler de Puestos, Estacionamiento y Conectividad en Paseo Urkupiña"
    >
      {/* Background Ambient Glows & Textures */}
      <div
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-[#EB2347]/10 blur-[180px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Halftone texture overlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 md:w-64 h-64 opacity-10 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/halftone.svg"
          alt=""
          fill
          className="object-contain object-right"
        />
      </div>

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-[2px] w-12 bg-[#EB2347]" />
            <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
              Infraestructura & Servicios
            </span>
            <span className="h-[2px] w-12 bg-[#EB2347]" />
          </div>

          <h2 className="font-display text-[clamp(40px,5.5vw,84px)] uppercase leading-[.9] tracking-[-.04em] text-white font-bold">
            Servicios del{" "}
            <span className="relative inline-block text-[#EB2347]">
              Paseo
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

          <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed font-normal">
            Todo lo que necesitás para tu visita o tu negocio en un solo lugar: alquiler de puestos, estacionamiento custodiado e Internet WiFi de alta velocidad.
          </p>
        </motion.div>

        {/* Flat Accessible Navigation Tabs Switcher (No borders, clean flat pills) */}
        <div className="mb-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Pestañas de servicios del predio"
            className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/5 p-2 backdrop-blur-md"
          >
            <button
              role="tab"
              id="tab-puestos"
              aria-selected={activeTab === "puestos"}
              aria-controls="panel-puestos"
              onClick={() => setActiveTab("puestos")}
              className={`flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm sm:text-base font-extrabold uppercase tracking-wider transition-all duration-300 ${activeTab === "puestos"
                  ? "bg-[#EB2347] text-white shadow-lg shadow-[#EB2347]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
            >
              <Store size={20} />
              <span>Alquiler de Puestos</span>
            </button>

            <button
              role="tab"
              id="tab-estacionamiento"
              aria-selected={activeTab === "estacionamiento"}
              aria-controls="panel-estacionamiento"
              onClick={() => setActiveTab("estacionamiento")}
              className={`flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm sm:text-base font-extrabold uppercase tracking-wider transition-all duration-300 ${activeTab === "estacionamiento"
                  ? "bg-[#EB2347] text-white shadow-lg shadow-[#EB2347]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
            >
              <Car size={20} />
              <span>Estacionamiento</span>
            </button>

            <button
              role="tab"
              id="tab-internet"
              aria-selected={activeTab === "internet"}
              aria-controls="panel-internet"
              onClick={() => setActiveTab("internet")}
              className={`flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm sm:text-base font-extrabold uppercase tracking-wider transition-all duration-300 ${activeTab === "internet"
                  ? "bg-[#EB2347] text-white shadow-lg shadow-[#EB2347]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
            >
              <Wifi size={20} />
              <span>Vouchers de Internet</span>
            </button>
          </div>
        </div>

        {/* TAB PANELS CONTENT */}
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* TAB 1: ALQUILER DE PUESTOS (PUESTOS LIBRES & REQUISITOS) */}
          {/* ========================================================================= */}
          {activeTab === "puestos" && (
            <motion.div
              key="puestos"
              id="panel-puestos"
              role="tabpanel"
              aria-labelledby="tab-puestos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Top Banner Callout for Renting */}
              <div className="rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-8 sm:p-10 backdrop-blur-md">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8">
                    <span className="inline-block rounded-full bg-[#EB2347] px-4 py-1 text-xs font-black uppercase tracking-widest text-white mb-4">
                      OPORTUNIDAD COMERCIAL
                    </span>
                    <h3 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase font-black tracking-tight text-white leading-tight">
                      Sos Emprendedor? Vení a Urkupiña y Alquilá tu Puesto
                    </h3>
                    <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                      Sumate al paseo textil más grande del país. Formá parte de una comunidad comercial con más de 5.000 clientes diarios y seguridad garantizada.
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-4">
                    <a
                      href="https://wa.me/541168615707?text=Hola!%20Quiero%20consultar%20por%20el%20alquiler%20de%20un%20puesto%20en%20Paseo%20Urkupi%C3%B1a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] px-8 py-4 text-base font-extrabold uppercase tracking-wider text-white transition-all hover:scale-105 shadow-lg shadow-[#25D366]/30 w-full sm:w-auto justify-center"
                    >
                      <MessageCircle size={24} />
                      <span>Consultar por WhatsApp</span>
                    </a>
                    <div className="text-sm font-semibold text-white/70 flex items-center gap-2">
                      <Phone size={18} className="text-[#EB2347]" />
                      <span>Tel. Consulta: <strong>11-6861-5707</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2 Cols: Puestos Libres & Requisitos */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COL: Puestos Libres Disponibles */}
                <div className="lg:col-span-6 rounded-3xl bg-white/5 p-8 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-display text-2xl sm:text-3xl uppercase font-bold text-white flex items-center gap-3">
                        <Store size={28} className="text-[#EB2347]" />
                        <span>Puestos Libres</span>
                      </h4>
                      <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                        Disponibilidad Inmediata
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed font-normal">
                      Ubicaciones estratégicas disponibles en el paseo principal para comenzar a vender hoy mismo:
                    </p>

                    <div className="space-y-3">
                      {AVAILABLE_BOOTHS.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-sm sm:text-base font-medium"
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#EB2347]" />
                            <span className="font-bold text-white font-mono">{item.sector}</span>
                            <span className="text-white/60">·</span>
                            <span className="text-white/80">{item.row}</span>
                          </div>
                          <span className="font-display font-extrabold text-xl text-[#EB2347]">
                            {item.booth}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm text-white/60">
                    <span>* Sujeto a confirmación al momento del contacto</span>
                    <span className="font-bold text-white">Medidas: 2x2 Mts</span>
                  </div>
                </div>

                {/* RIGHT COL: Requisitos para Alquilar & Cronograma */}
                <div className="lg:col-span-6 space-y-8">
                  {/* Requisitos */}
                  <div className="rounded-3xl bg-white/5 p-8 backdrop-blur-md">
                    <h4 className="font-display text-2xl sm:text-3xl uppercase font-bold text-white mb-6 flex items-center gap-3">
                      <CheckCircle2 size={28} className="text-[#EB2347]" />
                      <span>Requisitos para Alquilar</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {precios.alquiler.map((condicion, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white/5">
                          <span className="text-xs uppercase font-mono tracking-widest text-[#EB2347] font-bold block mb-1">
                            {condicion.titulo}
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-white leading-snug block">
                            {condicion.detalle}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fechas de Pago */}
                  <div className="rounded-3xl bg-white/5 p-8 backdrop-blur-md">
                    <h4 className="font-display text-2xl uppercase font-bold text-white mb-4 flex items-center gap-3">
                      <Calendar size={24} className="text-[#EB2347]" />
                      <span>Cronograma de Fechas de Pago</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {PAYMENT_SCHEDULE.map((sch, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white/5">
                          <span className="font-mono font-bold text-white block mb-1">
                            {sch.days}
                          </span>
                          <span className="text-xs text-white/70">
                            {sch.Concept}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-white/50 italic">
                      * Pasando las fechas correspondientes del mes recuerde que aplica un recargo administrativo.
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ESTACIONAMIENTO CUSTODIADO */}
          {/* ========================================================================= */}
          {activeTab === "estacionamiento" && (
            <motion.div
              key="estacionamiento"
              id="panel-estacionamiento"
              role="tabpanel"
              aria-labelledby="tab-estacionamiento"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* Tarifas & Estadía Completa */}
                <div className="lg:col-span-4 rounded-3xl bg-white/5 p-8 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EB2347]/20 text-[#EB2347] mb-6">
                      <Car size={32} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#EB2347] bg-[#EB2347]/20 px-3 py-1 rounded-full">
                      Tarifa Oficial
                    </span>
                    <h3 className="font-display text-3xl font-bold uppercase text-white mt-4">
                      {precios.estacionamiento.titulo}
                    </h3>
                    <div className="my-6">
                      <span className="font-display text-5xl font-black text-white">{precios.estacionamiento.precio}</span>
                      <span className="text-sm font-bold text-white/60 ml-2">{precios.estacionamiento.moneda}</span>
                    </div>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                      Acceso libre durante toda la jornada comercial con personal de custodia permanente en todo el predio.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60">
                    Cobro ágil en ingresos por efectivo y medios digitales.
                  </div>
                </div>

                {/* Ingresos Vehiculares & Seguridad */}
                <div className="lg:col-span-8 rounded-3xl bg-white/5 p-8 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-3xl font-bold uppercase text-white mb-6 flex items-center gap-3">
                      <MapPin size={28} className="text-[#EB2347]" />
                      <span>Accesos Vehiculares & Custodia 24/7</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div className="p-6 rounded-2xl bg-white/5">
                        <span className="text-xs uppercase font-mono font-bold text-[#EB2347] block mb-2">
                          PORTÓN NORTE
                        </span>
                        <h4 className="font-bold text-base text-white mb-1">Camino de la Ribera Sur</h4>
                        <p className="text-sm text-white/70 font-normal">
                          Acceso directo principal por Camino de la Ribera Sur y calle Tábano.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/5">
                        <span className="text-xs uppercase font-mono font-bold text-[#EB2347] block mb-2">
                          PORTÓN SUR
                        </span>
                        <h4 className="font-bold text-base text-white mb-1">Arana Goicochea (Portón 6)</h4>
                        <p className="text-sm text-white/70 font-normal">
                          Ingreso secundario agilizado para tránsito comercial y de gran porte.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-sm text-white/80 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#EB2347]" />
                      <span>1.500+ Cocheras custodiadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#EB2347]" />
                      <span>Monitoreo por cámaras 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#EB2347]" />
                      <span>Personal de seguridad presente</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: VOUCHERS DE INTERNET WIFI */}
          {/* ========================================================================= */}
          {activeTab === "internet" && (
            <motion.div
              key="internet"
              id="panel-internet"
              role="tabpanel"
              aria-labelledby="tab-internet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                {/* Left Text & Pricing */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="inline-block rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                    RED OFICIAL URK FULL 5G & 6G
                  </span>

                  <h3 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase font-black tracking-tight text-white leading-tight">
                    Navegá a Máxima Velocidad en Todo el Predio
                  </h3>

                  <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                    Conectate a la infraestructura WiFi oficial de Paseo Urkupiña. Adquirí tu tarjeta física de acceso en los puntos de venta habilitados.
                  </p>

                  {/* Price Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-6 rounded-2xl bg-white/5">
                      <span className="text-xs uppercase font-mono font-bold text-white/60 block mb-1">
                        ACCESO POR 1 DÍA
                      </span>
                      <div className="font-display text-4xl font-black text-white">
                        {precios.internet.diario.precio} <span className="text-xs text-white/60 font-semibold">{precios.internet.diario.moneda}</span>
                      </div>
                      <p className="mt-2 text-xs text-white/70">
                        {precios.internet.diario.detalle}
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#EB2347]/15 relative overflow-hidden">
                      <span className="text-xs uppercase font-mono font-bold text-[#EB2347] block mb-1">
                        ACCESO POR 1 MES
                      </span>
                      <div className="font-display text-4xl font-black text-white">
                        {precios.internet.mensual.precio} <span className="text-xs text-white/60 font-semibold">{precios.internet.mensual.moneda}</span>
                      </div>
                      <p className="mt-2 text-xs text-white/70">
                        {precios.internet.mensual.detalle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setIsVoucherModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#EB2347] hover:bg-[#C41A3A] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:scale-105 shadow-lg shadow-[#EB2347]/30"
                    >
                      <Info size={20} />
                      <span>Ver Detalles del Voucher</span>
                    </button>
                  </div>
                </div>

                {/* Right Image Display */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-2xl cursor-pointer group" onClick={() => setIsVoucherModalOpen(true)}>
                    <Image
                      src="/images/wifi-vouchers-cards.png"
                      alt="Tarjetas Voucher WiFi Diario y Mensual Urkupiña"
                      width={1000}
                      height={650}
                      className="w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-3 text-xs text-white/50 text-center font-normal italic">
                    * Imágenes con fines meramente ilustrativos. Los datos exhibidos son de carácter referencial.
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ========================================================================= */}
      {/* VOUCHER DETAILS MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isVoucherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVoucherModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl rounded-[32px] bg-[#0A1428] p-6 sm:p-10 text-white shadow-2xl z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi size={20} className="text-[#EB2347]" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#EB2347]">
                      RED WIFI OFICIAL
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase font-extrabold text-white">
                    Vouchers WiFi Urkupiña
                  </h3>
                </div>

                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-6 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                <div className="relative w-full flex flex-col items-center justify-center">
                  <Image
                    src="/images/wifi-vouchers-cards.png"
                    alt="Vouchers WiFi Urkupiña"
                    width={1000}
                    height={650}
                    className="w-full max-w-2xl h-auto object-contain"
                  />
                  <p className="mt-2 text-xs text-white/40 text-center font-normal italic">
                    * Imágenes ilustrativas. La información y formato exhibido es de carácter referencial.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-2xl bg-white/5">
                    <span className="font-bold text-white block mb-1">Voucher Diario - {precios.internet.diario.precio} {precios.internet.diario.moneda}</span>
                    <p className="text-xs text-white/70">24 Horas de navegación continua en WiFi 5Ghz & 6Ghz.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EB2347]/20">
                    <span className="font-bold text-white block mb-1">Voucher Mensual - {precios.internet.mensual.precio} {precios.internet.mensual.moneda}</span>
                    <p className="text-xs text-white/70">30 Días corridos de acceso 24/7 para locatarios y personal.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-white text-[#102A5C] text-xs font-bold uppercase tracking-wider"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

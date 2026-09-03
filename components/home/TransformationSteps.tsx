"use client";

import { motion } from "framer-motion";
import { QrCode, Laptop, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Conectividad & Códigos QR",
    description: "Cada local físico en el predio de Urkupiña incorpora un código QR único. Los compradores escanean el código para guardar catálogos digitales e iniciar contacto directo por WhatsApp.",
    icon: QrCode
  },
  {
    title: "Catálogos Online Unificados",
    number: "02",
    description: "La mercadería física de los 2.200 fabricantes se digitaliza en un catálogo común. Los mayoristas de todo el país buscan productos y verifican stock en tiempo real.",
    icon: Laptop
  },
  {
    title: "Despacho & Logística Integrada",
    number: "03",
    description: "Coordinación centralizada de envíos federales. Los pedidos se consolidan en el predio y se despachan de forma express a las provincias argentinas.",
    icon: Truck
  }
];

export default function TransformationSteps() {
  return (
    <section id="transformacion" className="section-lg relative overflow-hidden border-b border-[#243A60]/10 scroll-mt-20">

      {/* Dark bg — always dark for consistency */}
      <div className="absolute inset-0" style={{ backgroundColor: "#060A13" }} aria-hidden="true" />
      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
          <polygon points="500,0 500,500 0,0" fill="rgba(235,35,71,0.04)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
          <polygon points="0,500 500,500 0,0" fill="rgba(36,58,96,0.08)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#243A60]/40 bg-[#243A60]/10 px-4 py-2 text-sm text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-[#EB2347] inline-block" />
            Digitalización
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Pasos de la Transformación
          </h2>
          <p className="mt-6 text-lg text-slate-400 leading-relaxed">
            Cómo estamos uniendo la inmensa fuerza productiva de nuestra feria física tradicional con herramientas web de última generación para potenciar las ventas nacionales.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative rounded-3xl border border-[#243A60]/15 overflow-hidden flex flex-col justify-between min-h-[380px]"
              >
                {/* Card image background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: "url('/images/feria-card.jpg')" }}
                />
                {/* Card overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: "linear-gradient(160deg, rgba(8,12,20,0.88) 0%, rgba(36,58,96,0.78) 60%, rgba(8,12,20,0.95) 100%)" }}
                />
                {/* Top hover accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#243A60] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 p-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#243A60]/20 text-white border border-[#243A60]/40 group-hover:scale-110 transition duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-6xl font-black text-[#243A60]/25 dark:text-white/10 group-hover:text-[#243A60]/50 dark:group-hover:text-white/20 transition-colors duration-300 select-none">
                      {step.number}
                    </span>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { enlaceWhatsapp, type DatosDeContacto } from "@/lib/contenido/tipos";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function SiteFooter({ contacto }: { contacto: DatosDeContacto }) {

  return (
    <footer
      id="footer"
      className="relative bg-[#0A1428] text-white scroll-mt-20 overflow-hidden"
      aria-label="Pie de página institucional y sección comercial de Urkupiña"
    >
      {/* Torn / Ripped Paper Top Edge Effect */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mb-1 bg-separator">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 sm:h-14 md:h-16 text-[#0A1428] fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0 60H1440V24C1410 18 1380 32 1350 25C1320 18 1290 5 1260 11C1230 17 1200 30 1170 24C1140 18 1110 6 1080 12C1050 18 1020 32 990 24C960 16 930 4 900 10C870 16 840 30 810 23C780 16 750 5 720 11C690 17 660 31 630 24C600 17 570 4 540 10C510 16 480 30 450 23C420 16 390 5 360 11C330 17 300 31 270 24C240 17 210 4 180 10C150 16 120 30 90 23C60 16 30 5 0 20V60Z" />
        </svg>
      </div>

      {/* Background ambient lighting */}
      <div
        className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#EB2347]/10 blur-[180px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#243A60]/20 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl content-pad z-10 pt-10 pb-12">
        {/* ========================================================================= */}
        {/* TOP CTA SECTION: OPORTUNIDAD COMERCIAL / ¿QUERÉS PUBLICITAR O VENDER CON NOSOTROS? */}
        {/* ========================================================================= */}
        <div className="relative py-8 md:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Dot Matrix Background Texture Extending Outside Grid on Left */}
          <div className="absolute -left-36 top-0 bottom-0 w-80 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px]" />

          {/* Megaphone Red Icon & SVGs Positioned OUTSIDE Site Grid on the Left Margin */}
          <div className="relative lg:absolute lg:-left-24 xl:-left-28 lg:top-1/2 lg:-translate-y-1/2 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center text-[#EB2347] z-20 mb-2 lg:mb-0">
            <Megaphone size={38} className="transform -rotate-12" />
            {/* Radiating sound lines indicator */}

          </div>

          {/* Text Content Directly Aligned with Left Edge of Site Grid */}
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#EB2347] block mb-1">
              OPORTUNIDAD COMERCIAL
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] uppercase leading-tight font-extrabold text-white tracking-tight">
              ¿QUERÉS PUBLICITAR O <span className="text-[#EB2347]">VENDER CON NOSOTROS?</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed max-w-2xl font-normal">
              Sumá tu taller textil a la plataforma institucional digital o reservá espacios publicitarios dentro del predio comercial de mayor afluencia.
            </p>
          </div>

          {/* Action CTA Buttons (Right Side) */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EB2347] hover:bg-[#C41A3A] px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-xl shadow-[#EB2347]/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>PUBLICITAR CON NOSOTROS</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 hover:border-white hover:bg-white/10 px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95"
            >
              <span>REGISTRAR TALLER TEXTIL</span>
              <ArrowRight size={16} />
            </Link>

            {/* Arrow Left Icon Positioned Next to REGISTRAR TALLER TEXTIL Outside Site Grid */}
            <div className="hidden lg:block absolute -right-20 xl:-right-24 top-1/2 -translate-y-1/2 pointer-events-none select-none z-20">
              <Image
                src="/images/icons/arrowleft.png"
                alt=""
                width={80}
                height={80}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEPARATOR DIVIDER LINE */}
        {/* ========================================================================= */}
        <div className="border-t border-white/15 my-10 md:my-14" />

        {/* ========================================================================= */}
        {/* FOOTER MAIN GRID: Responsive Layout (Full width Brand + 2x2 Links on Mobile) */}
        {/* ========================================================================= */}
        <div className="relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-16 md:pb-12">
          {/* Footer bottom texture decoration at bottom-0 */}
          <div className="absolute left-0 right-0 bottom-0 h-10 pointer-events-none select-none opacity-15 z-0">
            <Image
              src="/images/masks/torn-paper.png"
              alt=""
              fill
              // Franja a todo el ancho del contenedor max-w-7xl (1280px)
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-bottom"
            />
          </div>

          {/* Column 1: Brand & Socials (Full width on mobile grid-cols-2) */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1 space-y-4 relative z-10 mb-4 lg:mb-0">
            <Link href="/" className="inline-block focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2 rounded-lg">
              <Image
                src="/assets/logofooter.png"
                alt="Paseo de Compras Urkupiña"
                width={200}
                height={70}
                className="h-14 w-auto object-contain brightness-110"
              />
            </Link>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal max-w-md lg:max-w-none pr-2">
              El paseo de compras textil mayorista más grande del país. Conectamos fabricantes con compradores.
            </p>

            {/* Social Icons Row (Instagram, Facebook, YouTube, TikTok) */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={contacto.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram oficial de Urkupiña"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EB2347] text-white border border-[#EB2347] shadow-md shadow-[#EB2347]/30 transition-all hover:bg-transparent hover:text-white hover:border-white hover:shadow-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
              >
                <InstagramIcon aria-hidden="true" />
              </a>

              <a
                href={contacto.redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook oficial de Urkupiña"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EB2347] text-white border border-[#EB2347] shadow-md shadow-[#EB2347]/30 transition-all hover:bg-transparent hover:text-white hover:border-white hover:shadow-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
              >
                <FacebookIcon aria-hidden="true" />
              </a>

              <a
                href={contacto.redes.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Canal ULIVE Stream de Urkupiña en YouTube"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EB2347] text-white border border-[#EB2347] shadow-md shadow-[#EB2347]/30 transition-all hover:bg-transparent hover:text-white hover:border-white hover:shadow-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
              >
                <YoutubeIcon aria-hidden="true" />
              </a>

              <a
                href="https://www.tiktok.com/@urkupinasa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok oficial de Urkupiña @urkupinasa"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EB2347] text-white border border-[#EB2347] shadow-md shadow-[#EB2347]/30 transition-all hover:bg-transparent hover:text-white hover:border-white hover:shadow-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
              >
                <TiktokIcon aria-hidden="true" />
              </a>
            </div>
          </div>


          {/* Column 2: NOSOTROS */}
          <div className="col-span-1 relative z-10">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white mb-4">
              NOSOTROS
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li>
                <a href="/#historia" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Historia
                </a>
              </li>
              <li>
                <a href="/#impacto" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Impacto
                </a>
              </li>
              <li>
                <a href="/#historia" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Comunidad
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: SERVICIOS */}
          <div className="col-span-1 relative z-10">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white mb-4">
              SERVICIOS
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li>
                <a href="/#streaming" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  En vivo
                </a>
              </li>
              <li>
                <a href="/#servicios-predio" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Rubros
                </a>
              </li>
              <li>
                <a href="/#servicios-predio" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Alquilar
                </a>
              </li>
              <li>
                <a href="/#publicidad" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Publicidad
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: VISITAR */}
          <div className="col-span-1 relative z-10">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white mb-4">
              VISITAR
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li>
                <a href="/#visitar" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Mapa
                </a>
              </li>
              <li>
                <a href="/#visitar" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Horarios
                </a>
              </li>
              <li>
                <a href="/#visitar" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Cómo llegar
                </a>
              </li>
              <li>
                <a href="/#visitar" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Tickets
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: CONTACTO */}
          <div className="col-span-1 relative z-10">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white mb-4">
              CONTACTO
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li>
                <a href="/#contacto" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Formulario
                </a>
              </li>
              <li>
                <a href="/#servicios-predio" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#EB2347]">
                  Estacionar
                </a>
              </li>
              <li>
                <a
                  href={enlaceWhatsapp(contacto.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors block break-words"
                >
                  WhatsApp: {contacto.whatsapp.visible}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contacto.email}`}
                  className="hover:text-white transition-colors block break-all"
                >
                  {contacto.email}
                </a>
              </li>
              <li className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#7DD3FC] block mb-1">
                  Evento Destacado
                </span>
                <Link
                  href="/expo-urku-2026"
                  className="font-display text-base font-extrabold uppercase tracking-wider text-[#1C9FE4] hover:text-[#7DD3FC] transition-colors inline-flex items-center gap-1.5"
                >
                  EXPOURKU 2026
                  <ArrowRight size={14} className="shrink-0" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM COPYRIGHT BAR */}
        {/* ========================================================================= */}
        <div className="relative border-t border-white/15 pt-8 pb-20 md:pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/70 z-10">
          <p className="font-normal leading-relaxed max-w-xl">
            © Paseo de Compras Urkupiña - René Gonzalo Rojas Paz, Ingeniero Budge, Buenos Aires, Argentina.
          </p>
        </div>

      </div>

      {/* Background Watermark Handle anchored to bottom: -149px right: 0 of outer site footer */}
      <div className="absolute right-0 -bottom-[149px] pointer-events-none select-none opacity-15 z-0" style={{ bottom: "-149px" }}>
        <Image
          src="/assets/footer-handle.png"
          alt=""
          width={460}
          height={460}
          className="w-80 sm:w-96 md:w-[480px] h-auto object-contain object-bottom"
        />
      </div>

      {/* Floating WhatsApp Action Widget (Matches Bottom-Right Corner in Image) */}
      <FloatingWhatsApp whatsapp={contacto.whatsapp} />
    </footer>
  );
}


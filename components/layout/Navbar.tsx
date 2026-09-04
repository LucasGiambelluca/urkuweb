"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Store, Car, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const SERVICE_ITEMS = [
  { label: "Alquiler de Puestos", tab: "puestos", href: "#puestos", icon: Store },
  { label: "Estacionamiento", tab: "estacionamiento", href: "#estacionamiento", icon: Car },
  { label: "Vouchers de Internet", tab: "internet", href: "#wifi-vouchers", icon: Wifi },
];

export default function Navbar() {
  const [active, setActive] = useState("Nosotros");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  // ScrollSpy observer to dynamically change active nav underline when scrolling
  useEffect(() => {
    const sections = [
      { id: "historia", label: "Nosotros" },
      { id: "streaming", label: "En vivo" },
      { id: "visitar", label: "Visitar" },
      { id: "servicios-predio", label: "Servicios" },
      { id: "noticias", label: "Noticias" },
      { id: "contacto", label: "Contacto" },
    ];

    const handleScrollSpy = () => {
      setScrolled(window.scrollY > 60);

      const scrollPosition = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActive(sec.label);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // Smooth scroll to section if URL has a hash when navigating back to "/"
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/" && window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  // Bloquea el scroll del fondo mientras el menu movil esta abierto.
  //
  // Solo toca el scroll cuando el menu esta abierto, y al cerrarlo restaura lo
  // que hubiera antes en vez de forzar "unset". El menu no es el unico que
  // bloquea el scroll: el popup de bienvenida tambien, y se monta primero.
  // Con la version anterior, este efecto corria despues con el menu cerrado y
  // le pisaba el bloqueo, asi que la pagina scrolleaba por detras del popup.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const desbordeDelCuerpo = document.body.style.overflow;
    const desbordeDeLaRaiz = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = desbordeDelCuerpo;
      document.documentElement.style.overflow = desbordeDeLaRaiz;
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (label: string, hash: string) => {
    setActive(label);
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);

    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = `/${hash}`;
      }
    }
  };

  const handleServiceClick = (tabId: string, href: string) => {
    setActive("Servicios");
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);

    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        window.dispatchEvent(new CustomEvent("select-service-tab", { detail: tabId }));
        window.location.hash = href;

        const targetElement = document.querySelector("#servicios-predio");
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = `/#servicios-predio`;
      }
    }
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#243A60]/95 dark:bg-[#0B111E]/95 backdrop-blur-xl shadow-xl h-[74px]"
          : "bg-[#243A60]/85 dark:bg-[#0B111E]/85 backdrop-blur-md h-[88px]"
      }`}
    >
      {/* Bottom accent gradient line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#EB2347]/60 to-transparent" />

      <div className="mx-auto flex h-full max-w-7xl items-center justify-between content-pad relative">
        
        {/* Mobile menu trigger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#EB2347]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 flex justify-center lg:justify-start lg:flex-initial">
          <Link href="/" className="group shrink-0">
            <Image
              src="/assets/logonav.png"
              alt="Urkupiña Logo Oficial"
              width={280}
              height={60}
              priority
              className={`transition-all duration-300 ${
                scrolled ? "h-[38px] md:h-[42px] w-auto" : "h-[46px] md:h-[50px] w-auto"
              }`}
            />
          </Link>
        </div>

        {/* Primary Desktop Nav Landmark */}
        <nav aria-label="Principal" className="hidden lg:flex items-center gap-8">
          <a
            href="/#historia"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Nosotros", "#historia");
            }}
            className="group relative font-semibold uppercase tracking-[.06em] text-sm text-white/80 hover:text-white transition-colors rounded-md px-1.5 py-1"
          >
            <span className={active === "Nosotros" ? "text-white" : ""}>Nosotros</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Nosotros" ? "w-full" : "w-0 group-hover:w-full"}`} />
          </a>

          <a
            href="/#streaming"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("En vivo", "#streaming");
            }}
            className="group relative font-semibold uppercase tracking-[.06em] text-sm text-white/80 hover:text-white transition-colors rounded-md px-1.5 py-1"
          >
            <span className={active === "En vivo" ? "text-white" : ""}>En vivo</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "En vivo" ? "w-full" : "w-0 group-hover:w-full"}`} />
          </a>

          <a
            href="/#visitar"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Visitar", "#visitar");
            }}
            className="group relative font-semibold uppercase tracking-[.06em] text-sm text-white/80 hover:text-white transition-colors rounded-md px-1.5 py-1"
          >
            <span className={active === "Visitar" ? "text-white" : ""}>Visitar</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Visitar" ? "w-full" : "w-0 group-hover:w-full"}`} />
          </a>

          {/* SERVICIOS DROPDOWN MENU */}
          <div
            className="relative"
            onMouseEnter={() => setIsServicesDropdownOpen(true)}
            onMouseLeave={() => setIsServicesDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
              aria-expanded={isServicesDropdownOpen}
              className="group relative font-semibold uppercase tracking-[.06em] text-sm text-white/80 hover:text-white transition-colors rounded-md px-1.5 py-1 flex items-center gap-1.5"
            >
              <span className={active === "Servicios" ? "text-white" : ""}>Servicios</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isServicesDropdownOpen ? "rotate-180 text-[#EB2347]" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Servicios" ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>

            {/* Floating Dropdown Panel */}
            <AnimatePresence>
              {isServicesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-[#1B2A49] border border-white/15 p-2 shadow-2xl backdrop-blur-xl z-50"
                >
                  <div className="space-y-1">
                    {SERVICE_ITEMS.map((srv) => {
                      const IconComp = srv.icon;
                      return (
                        <button
                          key={srv.tab}
                          onClick={() => handleServiceClick(srv.tab, srv.href)}
                          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/90 hover:text-white hover:bg-[#EB2347] transition-all text-left"
                        >
                          <IconComp size={18} className="shrink-0" />
                          <span>{srv.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/#noticias"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Noticias", "#noticias");
            }}
            className="group relative font-semibold uppercase tracking-[.06em] text-sm text-white/80 hover:text-white transition-colors rounded-md px-1.5 py-1"
          >
            <span className={active === "Noticias" ? "text-white" : ""}>Noticias</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Noticias" ? "w-full" : "w-0 group-hover:w-full"}`} />
          </a>

          <a
            href="/#contacto"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Contacto", "#contacto");
            }}
            className="group relative font-semibold uppercase tracking-[.06em] text-sm text-white/80 hover:text-white transition-colors rounded-md px-1.5 py-1"
          >
            <span className={active === "Contacto" ? "text-white" : ""}>Contacto</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Contacto" ? "w-full" : "w-0 group-hover:w-full"}`} />
          </a>
        </nav>

        {/* Right side utilities */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <a
            href="/#publicidad"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Publicidad", "#publicidad");
            }}
            className="hidden sm:inline-flex items-center rounded-full bg-[#EB2347] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#C41A3A] hover:scale-105"
          >
            Publicitá
          </a>
        </div>

      </div>

      {/* MOBILE FULL SCREEN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 h-screen w-screen bg-[#243A60] dark:bg-[#0B111E] p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Cerrar menú principal"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-[#EB2347] hover:border-[#EB2347] transition"
              >
                <X size={24} />
              </button>

              <div className="flex justify-center flex-1">
                <Image
                  src="/assets/logonav.png"
                  alt="Urkupiña Logo"
                  width={240}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
              </div>

              <ThemeToggle />
            </div>

            {/* Mobile Nav Links */}
            <nav aria-label="Navegación móvil" className="flex flex-col items-center justify-center gap-2 my-auto text-center py-4">
              <a
                href="/#historia"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Nosotros", "#historia");
                }}
                className="w-full max-w-xs text-xl font-display uppercase tracking-tight py-2 px-6 rounded-full text-white/90 hover:bg-white/10"
              >
                Nosotros
              </a>

              <a
                href="/#streaming"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("En vivo", "#streaming");
                }}
                className="w-full max-w-xs text-xl font-display uppercase tracking-tight py-2 px-6 rounded-full text-white/90 hover:bg-white/10"
              >
                En vivo
              </a>

              <a
                href="/#visitar"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Visitar", "#visitar");
                }}
                className="w-full max-w-xs text-xl font-display uppercase tracking-tight py-2 px-6 rounded-full text-white/90 hover:bg-white/10"
              >
                Visitar
              </a>

              {/* SERVICIOS SUB-LIST IN MOBILE MENU */}
              <div className="w-full max-w-xs my-2 rounded-2xl bg-white/5 p-3 space-y-1">
                <span className="text-xs uppercase font-mono tracking-widest text-[#EB2347] font-bold block text-center mb-1">
                  SERVICIOS DEL PREDIOS
                </span>
                {SERVICE_ITEMS.map((srv) => (
                  <button
                    key={srv.tab}
                    onClick={() => handleServiceClick(srv.tab, srv.href)}
                    className="w-full text-sm font-extrabold uppercase py-2 px-4 rounded-xl text-white hover:bg-[#EB2347] transition text-center"
                  >
                    {srv.label}
                  </button>
                ))}
              </div>

              <a
                href="/#noticias"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Noticias", "#noticias");
                }}
                className="w-full max-w-xs text-xl font-display uppercase tracking-tight py-2 px-6 rounded-full text-white/90 hover:bg-white/10"
              >
                Noticias
              </a>

              <a
                href="/#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Contacto", "#contacto");
                }}
                className="w-full max-w-xs text-xl font-display uppercase tracking-tight py-2 px-6 rounded-full text-white/90 hover:bg-white/10"
              >
                Contacto
              </a>
            </nav>

            {/* Bottom Mobile CTA */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href="/#publicidad"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Publicidad", "#publicidad");
                }}
                className="w-full text-center rounded-full bg-[#EB2347] py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-xl shadow-[#EB2347]/25"
              >
                Publicitá en Urkupiña
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
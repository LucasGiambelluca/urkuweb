"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Store, Car, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import NavbarSearch from "@/components/ui/NavbarSearch";
import { motion, AnimatePresence } from "framer-motion";

const SERVICE_ITEMS = [
  { label: "Alquiler de Puestos", tab: "puestos", href: "#puestos", icon: Store },
  { label: "Estacionamiento", tab: "estacionamiento", href: "#estacionamiento", icon: Car },
  { label: "Vouchers de Internet", tab: "internet", href: "#wifi-vouchers", icon: Wifi },
];

export default function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState("Nosotros");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const isHome = pathname === "/" || pathname === "";
  const isHomeTop = isHome && !scrolled;

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
      setScrolled(window.scrollY > 40);

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

  // Scroll locking for mobile menu
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
        isHomeTop
          ? "h-[88px] bg-gradient-to-b from-[#0B111E]/90 via-[#0B111E]/50 to-transparent border-b-0 shadow-none"
          : isHome
            ? "h-[72px] bg-[#0B111E]/95 shadow-xl backdrop-blur-xl border-b-0"
            : scrolled
              ? "h-[72px] bg-[#0B111E]/95 shadow-xl backdrop-blur-xl border-b border-white/10"
              : "h-[82px] bg-[#0B111E]/90 backdrop-blur-md border-b border-white/10 shadow-md"
      }`}
    >
      {/* Bottom accent gradient line (hidden on Home page) */}
      {!isHome && (
        <div
          className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#EB2347]/60 to-transparent transition-opacity duration-300 opacity-100"
          aria-hidden="true"
        />
      )}

      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile menu trigger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex shrink-0 items-center justify-center lg:justify-start">
          <Link
            href="/"
            className="group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] rounded-lg p-1"
          >
            <Image
              src="/assets/logonav.png"
              alt="Urkupiña Logo Oficial"
              width={220}
              height={50}
              priority
              className={`w-auto transition-all duration-300 ${
                scrolled ? "h-[36px] sm:h-[40px]" : "h-[42px] sm:h-[46px]"
              }`}
            />
          </Link>
        </div>

        {/* Primary Desktop Nav Landmark - guaranteed 1 single line with flex-nowrap and whitespace-nowrap */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-4 xl:gap-7 flex-nowrap">
          <a
            href="/#historia"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Nosotros", "#historia");
            }}
            className="group relative whitespace-nowrap rounded-md px-2 py-1.5 text-xs xl:text-sm font-semibold uppercase tracking-[.06em] text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
          >
            <span className={active === "Nosotros" ? "text-white" : ""}>Nosotros</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Nosotros" ? "w-full" : "w-0 group-hover:w-full"}`} aria-hidden="true" />
          </a>

          <a
            href="/#streaming"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("En vivo", "#streaming");
            }}
            className="group relative whitespace-nowrap rounded-md px-2 py-1.5 text-xs xl:text-sm font-semibold uppercase tracking-[.06em] text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
          >
            <span className={active === "En vivo" ? "text-white" : ""}>En vivo</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "En vivo" ? "w-full" : "w-0 group-hover:w-full"}`} aria-hidden="true" />
          </a>

          <a
            href="/#visitar"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Visitar", "#visitar");
            }}
            className="group relative whitespace-nowrap rounded-md px-2 py-1.5 text-xs xl:text-sm font-semibold uppercase tracking-[.06em] text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
          >
            <span className={active === "Visitar" ? "text-white" : ""}>Visitar</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Visitar" ? "w-full" : "w-0 group-hover:w-full"}`} aria-hidden="true" />
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
              aria-haspopup="true"
              className="group relative flex whitespace-nowrap items-center gap-1.5 rounded-md px-2 py-1.5 text-xs xl:text-sm font-semibold uppercase tracking-[.06em] text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
            >
              <span className={active === "Servicios" ? "text-white" : ""}>Servicios</span>
              <ChevronDown size={15} className={`transition-transform duration-200 ${isServicesDropdownOpen ? "rotate-180 text-[#EB2347]" : ""}`} aria-hidden="true" />
              <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Servicios" ? "w-full" : "w-0 group-hover:w-full"}`} aria-hidden="true" />
            </button>

            {/* Floating Dropdown Panel */}
            <AnimatePresence>
              {isServicesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-white/15 bg-[#0B111E]/95 p-2 shadow-2xl backdrop-blur-2xl z-50"
                >
                  <div className="space-y-1">
                    {SERVICE_ITEMS.map((srv) => {
                      const IconComp = srv.icon;
                      return (
                        <button
                          key={srv.tab}
                          onClick={() => handleServiceClick(srv.tab, srv.href)}
                          className="flex w-full min-h-[44px] items-center gap-3 rounded-xl px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-white/90 transition-all hover:bg-[#EB2347] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          <IconComp size={18} className="shrink-0" aria-hidden="true" />
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
            className="group relative whitespace-nowrap rounded-md px-2 py-1.5 text-xs xl:text-sm font-semibold uppercase tracking-[.06em] text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
          >
            <span className={active === "Noticias" ? "text-white" : ""}>Noticias</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Noticias" ? "w-full" : "w-0 group-hover:w-full"}`} aria-hidden="true" />
          </a>

          <a
            href="/#contacto"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Contacto", "#contacto");
            }}
            className="group relative whitespace-nowrap rounded-md px-2 py-1.5 text-xs xl:text-sm font-semibold uppercase tracking-[.06em] text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
          >
            <span className={active === "Contacto" ? "text-white" : ""}>Contacto</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EB2347] transition-all duration-300 ${active === "Contacto" ? "w-full" : "w-0 group-hover:w-full"}`} aria-hidden="true" />
          </a>
        </nav>

        {/* Right side utilities - Modern Navbar Search */}
        <div className="flex shrink-0 items-center gap-3">
          <NavbarSearch />
          <ThemeToggle />
        </div>

      </div>

      {/* MOBILE FULL SCREEN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación móvil"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex h-screen w-screen flex-col justify-between overflow-y-auto bg-[#0B111E] p-6 text-white lg:hidden"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Cerrar menú principal"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white transition hover:border-[#EB2347] hover:bg-[#EB2347] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={24} />
              </button>

              <div className="flex flex-1 justify-center">
                <Image
                  src="/assets/logonav.png"
                  alt="Urkupiña Logo"
                  width={200}
                  height={45}
                  className="h-9 w-auto object-contain"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <NavbarSearch />
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav aria-label="Navegación móvil principal" className="my-auto flex flex-col items-center justify-center gap-2 text-center py-6">
              <a
                href="/#historia"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Nosotros", "#historia");
                }}
                className="w-full max-w-xs min-h-[48px] flex items-center justify-center rounded-full text-lg font-display uppercase tracking-tight text-white/90 transition hover:bg-white/10"
              >
                Nosotros
              </a>

              <a
                href="/#streaming"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("En vivo", "#streaming");
                }}
                className="w-full max-w-xs min-h-[48px] flex items-center justify-center rounded-full text-lg font-display uppercase tracking-tight text-white/90 transition hover:bg-white/10"
              >
                En vivo
              </a>

              <a
                href="/#visitar"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Visitar", "#visitar");
                }}
                className="w-full max-w-xs min-h-[48px] flex items-center justify-center rounded-full text-lg font-display uppercase tracking-tight text-white/90 transition hover:bg-white/10"
              >
                Visitar
              </a>

              {/* SERVICIOS SUB-LIST IN MOBILE MENU */}
              <div className="my-3 w-full max-w-xs rounded-2xl bg-white/5 p-3 space-y-1">
                <span className="mb-2 block text-center font-mono text-xs font-bold uppercase tracking-widest text-[#EB2347]">
                  SERVICIOS DEL PREDIO
                </span>
                {SERVICE_ITEMS.map((srv) => (
                  <button
                    key={srv.tab}
                    onClick={() => handleServiceClick(srv.tab, srv.href)}
                    className="w-full min-h-[44px] rounded-xl px-4 py-2.5 text-center text-sm font-extrabold uppercase text-white transition hover:bg-[#EB2347]"
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
                className="w-full max-w-xs min-h-[48px] flex items-center justify-center rounded-full text-lg font-display uppercase tracking-tight text-white/90 transition hover:bg-white/10"
              >
                Noticias
              </a>

              <a
                href="/#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("Contacto", "#contacto");
                }}
                className="w-full max-w-xs min-h-[48px] flex items-center justify-center rounded-full text-lg font-display uppercase tracking-tight text-white/90 transition hover:bg-white/10"
              >
                Contacto
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

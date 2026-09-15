"use client";

import { useEffect, useState, useRef, useId } from "react";
import { Search, X, ChevronRight, FileText, MapPin, Store, Car, Wifi, Sparkles, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NOVEDADES_RESPALDO } from "@/lib/contenido/novedades";

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  category: "seccion" | "servicio" | "novedad";
  categoryLabel: string;
  href: string;
  icon: typeof Search;
};

const SEARCH_DATABASE: SearchItem[] = [
  // Secciones
  {
    id: "sec-nosotros",
    title: "Nosotros · Historia de Urkupiña",
    description: "Más de 30 años conectando el mayor polo textil del país",
    category: "seccion",
    categoryLabel: "Sección",
    href: "/#historia",
    icon: MapPin,
  },
  {
    id: "sec-[#streaming]",
    title: "En Vivo · Transmisión del Predio",
    description: "Cámaras en vivo del movimiento comercial del paseo",
    category: "seccion",
    categoryLabel: "Sección",
    href: "/#streaming",
    icon: Sparkles,
  },
  {
    id: "sec-[#visitar]",
    title: "Información para Visitar",
    description: "Horarios, ubicación en Lomas de Zamora y mapa comercial",
    category: "seccion",
    categoryLabel: "Sección",
    href: "/#visitar",
    icon: MapPin,
  },
  {
    id: "sec-[#servicios-predio]",
    title: "Servicios del Predio",
    description: "Infraestructura, puestos, estacionamiento e internet",
    category: "seccion",
    categoryLabel: "Sección",
    href: "/#servicios-predio",
    icon: Store,
  },
  {
    id: "sec-[#noticias]",
    title: "Noticias y Novedades",
    description: "Últimas publicaciones, comunicados y anuncios oficiales",
    category: "seccion",
    categoryLabel: "Sección",
    href: "/#noticias",
    icon: Newspaper,
  },
  {
    id: "sec-[#contacto]",
    title: "Contacto y Consultas",
    description: "Canales oficiales para locatarios, comerciantes y visitantes",
    category: "seccion",
    categoryLabel: "Sección",
    href: "/#contacto",
    icon: FileText,
  },
  {
    id: "sec-expo-urku",
    title: "EXPO URKU 2026 · Ronda de Negocios",
    description: "Ronda de negocios del ecosistema comercial de Urkupiña",
    category: "seccion",
    categoryLabel: "Evento",
    href: "/expo-urku-2026",
    icon: Sparkles,
  },

  // Servicios
  {
    id: "srv-puestos",
    title: "Alquiler de Puestos Comerciales",
    description: "Espacios comerciales para fabricantes y locatarios",
    category: "servicio",
    categoryLabel: "Servicio",
    href: "/#puestos",
    icon: Store,
  },
  {
    id: "srv-estacionamiento",
    title: "Estacionamiento de Colectivos y Autos",
    description: "Estacionamiento vigilado con capacidad para 1.500 vehículos",
    category: "servicio",
    categoryLabel: "Servicio",
    href: "/#estacionamiento",
    icon: Car,
  },
  {
    id: "srv-wifi",
    title: "Vouchers de Internet Wi-Fi",
    description: "Conectividad de alta velocidad en todos los sectores",
    category: "servicio",
    categoryLabel: "Servicio",
    href: "/#wifi-vouchers",
    icon: Wifi,
  },

  // Artículos & Noticias
  ...NOVEDADES_RESPALDO.map((novedad) => ({
    id: `nov-${novedad.id}`,
    title: novedad.title,
    description: novedad.content,
    category: "novedad" as const,
    categoryLabel: "Noticia",
    href: `/#noticias`,
    icon: Newspaper,
  })),
];

export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchModalId = useId();

  // Detect OS for shortcut display (macOS ⌘K vs Windows Ctrl+K)
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Keyboard shortcut listener (⌘K / Ctrl+K / "/")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = query.trim() === ""
    ? SEARCH_DATABASE.slice(0, 7)
    : SEARCH_DATABASE.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(query.toLowerCase())
      );

  // Handle item navigation
  const navigateToItem = (href: string) => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      if (href.startsWith("/#")) {
        const hash = href.substring(1);
        if (window.location.pathname === "/") {
          const target = document.querySelector(hash);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          window.location.href = href;
        }
      } else {
        window.location.href = href;
      }
    }
  };

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      navigateToItem(filteredItems[selectedIndex].href);
    }
  };

  return (
    <>
      {/* Trigger Button in Navbar */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir buscador de secciones y noticias"
        className="group relative flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 text-xs font-semibold uppercase tracking-wider text-white/90 shadow-sm backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347]"
      >
        <Search size={15} className="text-[#7DD3FC] transition-transform group-hover:scale-110" aria-hidden="true" />
        <span className="hidden sm:inline-block">Buscar...</span>
        <kbd className="hidden lg:inline-flex items-center rounded border border-white/20 bg-black/20 px-1.5 py-0.5 text-[10px] font-mono font-normal tracking-tight text-white/70">
          {isMac ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>

      {/* Modern Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              id={searchModalId}
              role="dialog"
              aria-modal="true"
              aria-label="Buscador en Urkupiña"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-[#0B111E] text-white shadow-2xl"
            >
              {/* Top Search Input Bar */}
              <div className="flex items-center border-b border-white/10 px-5 py-4">
                <Search size={20} className="shrink-0 text-[#EB2347]" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Buscar secciones, noticias, puestos o servicios..."
                  className="w-full bg-transparent px-4 text-base text-white placeholder-white/50 focus:outline-none"
                />
                {query ? (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Borrar búsqueda"
                    className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                ) : null}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar buscador"
                  className="ml-2 rounded-xl border border-white/15 p-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <kbd className="font-mono">ESC</kbd>
                </button>
              </div>

              {/* Results Container */}
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-white/60">
                    <p className="text-base font-semibold">No se encontraron resultados para "{query}"</p>
                    <p className="mt-1 text-xs">Probá buscando palabras como "noticias", "puestos", "estacionamiento" o "expo".</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => {
                      const IconComponent = item.icon;
                      const isSelected = index === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateToItem(item.href)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all ${
                            isSelected ? "bg-[#EB2347] text-white shadow-lg" : "hover:bg-white/5 text-white/90"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 overflow-hidden pr-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected ? "bg-white/20 text-white" : "bg-white/10 text-[#7DD3FC]"}`}>
                              <IconComponent size={20} />
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span className="font-display text-sm font-bold uppercase tracking-wide truncate">{item.title}</span>
                                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                                  isSelected ? "bg-black/20 text-white" : "bg-white/10 text-[#7DD3FC]"
                                }`}>
                                  {item.categoryLabel}
                                </span>
                              </div>
                              <p className={`mt-0.5 text-xs truncate ${isSelected ? "text-white/85" : "text-white/60"}`}>{item.description}</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className={`shrink-0 ${isSelected ? "text-white" : "text-white/40"}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-white/10 bg-black/30 px-5 py-3 text-xs text-white/50">
                <div className="flex items-center gap-3">
                  <span><kbd className="rounded border border-white/20 px-1 py-0.5 font-mono text-[10px]">↑</kbd> <kbd className="rounded border border-white/20 px-1 py-0.5 font-mono text-[10px]">↓</kbd> Navegar</span>
                  <span><kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px]">↵</kbd> Abrir</span>
                </div>
                <span>Urkupiña Polo Comercial</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

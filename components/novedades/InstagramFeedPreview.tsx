"use client";

import Image from "next/image";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}


export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: string;
  comments: string;
  url: string;
  date: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "ig-1",
    image: "/images/instagram/post1.jpg",
    caption: "¡Recorré las galerías mayoristas más completas del país! Colecciones de temporada directa de fábrica 🛍️✨ #Urkupiña #ModaMayorista",
    likes: "1.240",
    comments: "84",
    url: "https://www.instagram.com/urkupina.s.a/?hl=es",
    date: "Hace 2 horas",
  },
  {
    id: "ig-2",
    image: "/images/instagram/post2.jpg",
    caption: "Detrás de escena: Talleres textiles asociados trabajando en la nueva moldería industrial de la temporada 🧵🇦🇷",
    likes: "980",
    comments: "52",
    url: "https://www.instagram.com/urkupina.s.a/?hl=es",
    date: "Ayer",
  },
  {
    id: "ig-3",
    image: "/images/instagram/post3.jpg",
    caption: "Showroom de camperas y abrigo urbano. Conocé los puestos destacados con venta mayorista y despacho federal 🚚❄️",
    likes: "2.110",
    comments: "143",
    url: "https://www.instagram.com/urkupina.s.a/?hl=es",
    date: "Hace 3 días",
  },
  {
    id: "ig-4",
    image: "/images/instagram/post4.jpg",
    caption: "Transmisión en vivo desde los pasillos principales con lanzamientos de ofertas exclusivas de fin de semana 🎥🔴 #ULIVEStream",
    likes: "1.560",
    comments: "97",
    url: "https://www.instagram.com/urkupina.s.a/?hl=es",
    date: "Hace 5 días",
  },
];

export default function InstagramFeedPreview() {
  return (
    <section
      aria-label="Últimas publicaciones en Instagram de Urkupiña"
      className="mt-20 pt-16 border-t border-border-subtle"
    >
      {/* Header Banner: Profile Info & Instagram CTA */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#0E1626] border border-border-subtle rounded-[28px] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-5">
          {/* Avatar with Animated Gradient Ring */}
          <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0 shadow-lg">
            <div className="relative h-full w-full rounded-full overflow-hidden bg-white dark:bg-[#0E1626] border-2 border-white dark:border-[#0E1626]">
              <Image
                src="/assets/logourku.png"
                alt="Perfil oficial de Urkupiña en Instagram"
                fill
                className="object-contain p-1.5"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#EB2347]">
                En vivo en Instagram
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
                @urkupina.s.a
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-foreground font-extrabold mt-0.5">
              Seguinos en Redes Sociales
            </h2>

            <p className="text-xs md:text-sm text-muted mt-1 font-medium">
              Publicaciones diarias, tendencias textiles y coberturas en vivo desde el predio.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="shrink-0">
          <a
            href="https://www.instagram.com/urkupina.s.a/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver cuenta oficial de @urkupina.s.a en Instagram"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white px-7 py-3.5 text-xs md:text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <InstagramIcon aria-hidden="true" />
            <span>Ver @urkupina.s.a en Instagram</span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Grid of Instagram Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INSTAGRAM_POSTS.map((post) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver publicación en Instagram: ${post.caption}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-border-subtle bg-white dark:bg-[#0E1626] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
          >
            {/* Image Container with Hover Overlay */}
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              <Image
                src={post.image}
                alt={`Publicación de Instagram Urkupiña: ${post.caption.slice(0, 50)}...`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Instagram Icon Badge on Top Right */}
              <div className="absolute top-3 right-3 z-10 rounded-full bg-black/40 backdrop-blur-md p-2 text-white border border-white/20">
                <InstagramIcon aria-hidden="true" />
              </div>


              {/* Hover Dark Overlay with Metrics */}
              <div
                className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 text-white z-20 backdrop-blur-[2px]"
                aria-hidden="true"
              >
                <div className="flex items-center gap-5 text-sm font-bold">
                  <div className="flex items-center gap-1.5">
                    <Heart size={18} className="fill-rose-500 text-rose-500" />
                    <span>{post.likes}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={18} className="fill-white text-white" />
                    <span>{post.comments}</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                  <span>Ver en Instagram</span>
                  <ExternalLink size={13} />
                </span>
              </div>
            </div>

            {/* Caption & Timestamp */}
            <div className="p-4 flex flex-col justify-between flex-grow">
              <p className="text-xs text-muted leading-relaxed line-clamp-2 font-medium">
                {post.caption}
              </p>

              <div className="mt-3 pt-2 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-semibold text-muted">
                <span>{post.date}</span>
                <span className="text-[#EB2347] font-bold group-hover:underline">
                  @urkupina.s.a ↗
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./(frontend)/globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["400", "700", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Página no encontrada | Urkupiña S.A.",
};

/**
 * Pagina para las direcciones que no existen.
 *
 * Sin esto Next sirve la suya: fondo negro, en ingles, sin marca y sin
 * ninguna forma de volver al sitio. Ahi caen las direcciones mal tipeadas y,
 * hasta que existan las paginas de novedades, tambien cada tarjeta de la home.
 *
 * Lleva su propio <html> y <body> porque el proyecto no tiene layout raiz:
 * cada grupo de rutas trae el suyo, y una ruta que no entra en ninguno se
 * queda sin armazon.
 */
export default function NoEncontrada() {
  return (
    <html lang="es" className={`${barlowCondensed.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#080C14] text-white">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
          <span className="mb-6 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#EB2347]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
              Error 404
            </span>
            <span className="h-[2px] w-12 bg-[#EB2347]" aria-hidden="true" />
          </span>

          <h1 className="font-display text-[clamp(44px,8vw,96px)] uppercase leading-[.9] tracking-[-.05em]">
            No encontramos
            <br />
            esta página
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Puede que la dirección esté mal escrita, o que la página ya no exista.
            Desde el inicio vas a poder llegar a todo.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#EB2347] px-9 py-4 text-base font-semibold text-white shadow-xl shadow-[#EB2347]/25 transition-all hover:scale-105 hover:bg-[#C41A3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
            >
              Ir al inicio
            </Link>

            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-9 py-4 text-base font-semibold text-white transition-all hover:border-[#EB2347] hover:text-[#EB2347] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
            >
              Escribinos
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

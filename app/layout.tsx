import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

// ── Display font: Barlow Condensed ──────────────────────────────────────
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// ── Body font: DM Sans ──────────────────────────────────────────────────
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Urkupiña S.A. | Plataforma Institucional",
  description: "La mayor comunidad mayorista de fabricantes textiles de Sudamérica.",
  openGraph: {
    title: "Urkupiña S.A. | Plataforma Institucional",
    description: "La mayor comunidad mayorista de fabricantes textiles de Sudamérica.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${barlowCondensed.variable} ${dmSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Skip-to-content link (Accessibility Baseline) */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#EB2347] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white font-semibold text-sm"
        >
          Saltar al contenido
        </a>

        <ThemeProvider
          attribute={["class", "data-theme"]}
          defaultTheme="system"
          enableSystem={true}
          storageKey="urk-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
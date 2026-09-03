// styles/tokens.ts
export const tokens = {
  spacing: {
    sectionSm: "section-sm",      // 48px — Tight small sections
    sectionMd: "section-md",      // 80px — Tight sections (stats grid, timeline)
    sectionLg: "section-lg",      // 120px — Standard content sections (Historia, Impacto, Comunidad)
    sectionXl: "section-xl",      // 160px — Hero & closing CTA only
    footerSpacing: "footer-spacing", // sectionLg top (120px), sectionMd bottom (80px)
    contentPad: "content-pad",    // px-4 md:px-8 lg:px-10
  },
  colors: {
    navy: "#273961",
    navyDark: "#1B2A49",
    accent: "#EB2347",
    ink: "#141C2E",
    fg2: "#505B72",
    fg3: "#7C879B",
  },
  radius: {
    frame: "clamp(20px, 2.6vw, 34px)",
    lg: "20px",
    md: "15px",
  },
  glass: {
    light: "bg-white/55 backdrop-blur-xl border border-white/75 shadow-[0_24px_60px_-30px_rgba(24,34,64,0.4)]",
    dark: "dark:bg-white/[0.055] dark:border-white/[0.13] dark:shadow-[0_30px_70px_-34px_rgba(0,0,0,0.8)]",
  }
} as const;

export type Tokens = typeof tokens;

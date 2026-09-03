export const BLOG_CATEGORIES = [
  "Cultura",
  "Eventos",
  "Obras",
  "Deportes",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface CategoryStyle {
  label: BlogCategory;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export const CATEGORY_STYLES: Record<BlogCategory, CategoryStyle> = {
  Cultura: {
    label: "Cultura",
    badgeBg: "bg-purple-500/10 dark:bg-purple-400/15",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-600/30 dark:border-purple-400/30",
    dotColor: "bg-purple-600 dark:bg-purple-400",
  },
  Eventos: {
    label: "Eventos",
    badgeBg: "bg-amber-500/10 dark:bg-amber-400/15",
    badgeText: "text-amber-800 dark:text-amber-300",
    badgeBorder: "border-amber-600/30 dark:border-amber-400/30",
    dotColor: "bg-amber-600 dark:bg-amber-400",
  },
  Obras: {
    label: "Obras",
    badgeBg: "bg-blue-500/10 dark:bg-blue-400/15",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-600/30 dark:border-blue-400/30",
    dotColor: "bg-blue-600 dark:bg-blue-400",
  },
  Deportes: {
    label: "Deportes",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-400/15",
    badgeText: "text-emerald-800 dark:text-emerald-300",
    badgeBorder: "border-emerald-600/30 dark:border-emerald-400/30",
    dotColor: "bg-emerald-600 dark:bg-emerald-400",
  },
};


export const DEFAULT_CATEGORY: BlogCategory = "Cultura";

export function getCategoryStyle(category?: string): CategoryStyle {
  if (category && category in CATEGORY_STYLES) {
    return CATEGORY_STYLES[category as BlogCategory];
  }
  return CATEGORY_STYLES[DEFAULT_CATEGORY];
}

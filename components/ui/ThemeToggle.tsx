"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[34px] h-[34px] rounded-xl bg-white/10 border border-white/20 backdrop-blur-md" />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-[34px] h-[34px] rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/15 transition-all text-white flex items-center justify-center cursor-pointer shadow-sm group shrink-0"
      aria-label="Toggle theme"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <Sun size={17} className="text-yellow-400 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon size={17} className="text-slate-200 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}

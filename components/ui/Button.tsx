"use client";

import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  isDarkBackground?: boolean;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = "primary",
      href,
      isDarkBackground = false,
      target,
      rel,
      children,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles: min-h-[44px], focus-visible ring, transition
    const baseStyles =
      "inline-flex items-center justify-center gap-2 min-h-[44px] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2 active:scale-[0.98] shrink-0 whitespace-nowrap";

    let variantStyles = "";

    switch (variant) {
      case "primary":
        // High-emphasis action
        variantStyles =
          "rounded-full bg-[#EB2347] text-white px-8 py-4 shadow-lg shadow-[#EB2347]/20 hover:bg-[#C41A3A] hover:shadow-xl";
        break;
      case "secondary":
        // Medium-emphasis action
        if (isDarkBackground) {
          variantStyles =
            "rounded-full border border-white/30 bg-white/10 text-white px-8 py-4 backdrop-blur-md hover:bg-white/20 hover:border-white/50";
        } else {
          variantStyles =
            "rounded-full border border-border-subtle bg-white dark:bg-white/10 text-foreground dark:text-white px-8 py-4 hover:bg-gray-50 dark:hover:bg-white/20 shadow-sm";
        }
        break;
      case "tertiary":
        // Low-emphasis / inline action
        variantStyles =
          "rounded-md text-[#EB2347] font-semibold px-2 py-1 hover:underline";
        break;
    }

    const combinedClassName = `${baseStyles} ${variantStyles} ${className}`.trim();

    if (href) {
      const isExternal = href.startsWith("http") || target === "_blank";
      if (isExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target={target || "_blank"}
            rel={rel || "noopener noreferrer"}
            className={combinedClassName}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedClassName}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

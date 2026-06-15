"use client";

import type { ModuleTheme } from "@/lib/module-themes";
import { ComicThemeProvider } from "@/lib/comic-theme-context";
import type { ReactNode } from "react";

interface ComicPageShellProps {
  theme: ModuleTheme;
  children: ReactNode;
  className?: string;
  fullBleed?: boolean;
}

/** Full-page comic wrapper — background image + color grade + readable overlay */
export function ComicPageShell({ theme, children, className = "", fullBleed = false }: ComicPageShellProps) {
  const style = {
    "--comic-bg-image": `url(${theme.bgImage})`,
    "--comic-bg-hue": `${theme.bgHue}deg`,
    "--comic-bg-sat": theme.bgSaturation,
    "--comic-bg-opacity": theme.bgOpacity,
    "--comic-accent": theme.accent,
    "--comic-accent-light": theme.accentLight,
    "--comic-btn-hue": `${theme.bgHue}deg`,
  } as React.CSSProperties;

  return (
    <ComicThemeProvider theme={theme}>
      <div
        className={`comic-page-shell relative ${fullBleed ? "min-h-screen" : "min-h-[calc(100vh-4rem)]"} ${className}`}
        style={style}
      >
        <div className="comic-page-shell__art" aria-hidden />
        <div className="comic-page-shell__overlay" style={{ background: theme.bgOverlay }} aria-hidden />
        <div className="comic-page-shell__dots" style={{ backgroundImage: theme.bgPattern }} aria-hidden />
        <div className="relative z-[1]">{children}</div>
      </div>
    </ComicThemeProvider>
  );
}

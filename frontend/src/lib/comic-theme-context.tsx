"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ModuleTheme } from "@/lib/module-themes";

const ComicThemeContext = createContext<ModuleTheme | null>(null);

export function ComicThemeProvider({ theme, children }: { theme: ModuleTheme; children: ReactNode }) {
  return (
    <ComicThemeContext.Provider value={theme}>
      {children}
    </ComicThemeContext.Provider>
  );
}

export function useComicTheme() {
  return useContext(ComicThemeContext);
}

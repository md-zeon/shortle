"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Palette = "rose-spark" | "indigo-velocity" | "violet-pulse" | "teal-stream" | "emerald-link";

const PALETTE_LABELS: Record<Palette, string> = {
  "rose-spark": "Rose Spark",
  "indigo-velocity": "Indigo Velocity",
  "violet-pulse": "Violet Pulse",
  "teal-stream": "Teal Stream",
  "emerald-link": "Emerald Link",
};

const PALETTE_COLORS: Record<Palette, string> = {
  "rose-spark": "#FB7185",
  "indigo-velocity": "#6366F1",
  "violet-pulse": "#8B5CF6",
  "teal-stream": "#14B8A6",
  "emerald-link": "#10B981",
};

interface PaletteContextType {
  palette: Palette;
  setPalette: (p: Palette) => void;
}

const PaletteContext = createContext<PaletteContextType>({
  palette: "rose-spark",
  setPalette: () => {},
});

export function usePalette() {
  return useContext(PaletteContext);
}

export const PALETTES = Object.keys(PALETTE_LABELS) as Palette[];
export { PALETTE_LABELS, PALETTE_COLORS };
export type { Palette };

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>("rose-spark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("palette") as Palette | null;
    if (stored && PALETTE_LABELS[stored]) {
      setPaletteState(stored);
      document.documentElement.setAttribute("data-palette", stored);
    } else {
      document.documentElement.removeAttribute("data-palette");
    }
    setMounted(true);
  }, []);

  const setPalette = (p: Palette) => {
    setPaletteState(p);
    localStorage.setItem("palette", p);
    if (p === "rose-spark") {
      document.documentElement.removeAttribute("data-palette");
    } else {
      document.documentElement.setAttribute("data-palette", p);
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <PaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </PaletteContext.Provider>
  );
}

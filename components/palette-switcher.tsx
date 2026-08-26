"use client";

import { usePalette, PALETTE_LABELS, PALETTE_COLORS, type Palette } from "./palette-provider";

export function PaletteSwitcher() {
  const { palette, setPalette } = usePalette();

  return (
    <div className="relative group">
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change color palette"
      >
        <div
          className="w-4 h-4 rounded-full transition-all"
          style={{
            backgroundColor: PALETTE_COLORS[palette],
            boxShadow: `0 0 0 2px var(--background), 0 0 0 4px ${PALETTE_COLORS[palette]}`,
          }}
        />
      </button>
      <div className="absolute right-0 top-full mt-2 w-52 py-2 rounded-xl bg-card border border-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Color Palette</p>
        {(
          Object.entries(PALETTE_LABELS) as [Palette, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPalette(key)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
              palette === key
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <div
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: PALETTE_COLORS[key] }}
            />
            <span>{label}</span>
            {palette === key && (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

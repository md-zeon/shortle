"use client";

interface CountryChartProps {
  data: { name: string | null; count: number }[];
  total: number;
}

export function CountryChart({ data, total }: CountryChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-card-border">
        <h3 className="text-sm font-medium text-muted mb-4">Countries</h3>
        <div className="h-[100px] flex items-center justify-center text-sm text-muted">
          No country data yet
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-card-border">
      <h3 className="text-sm font-medium text-muted mb-4">Countries</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.map((country, index) => {
          const percentage = total > 0 ? (country.count / total) * 100 : 0;
          return (
            <div key={index} className="p-3 rounded-lg bg-background">
              <div className="text-sm font-medium mb-1">{country.name || "Unknown"}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-semibold">{country.count}</span>
                <span className="text-xs text-muted">({Math.round(percentage)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

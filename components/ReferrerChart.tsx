"use client";

interface ReferrerChartProps {
  data: { name: string | null; count: number }[];
  total: number;
}

export function ReferrerChart({ data, total }: ReferrerChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-card-border">
        <h3 className="text-sm font-medium text-muted mb-4">Top Referrers</h3>
        <div className="h-[160px] flex items-center justify-center text-sm text-muted">
          No referrer data yet
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-card-border">
      <h3 className="text-sm font-medium text-muted mb-4">Top Referrers</h3>
      <div className="space-y-3">
        {data.map((referrer, index) => {
          const percentage = total > 0 ? (referrer.count / total) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-sm truncate">
                    {referrer.name || "Direct"}
                  </span>
                </div>
                <span className="text-sm font-mono text-muted ml-2">
                  {referrer.count}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-card-border overflow-hidden">
                <div
                  className="h-full bg-accent/60 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

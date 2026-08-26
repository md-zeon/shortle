"use client";

interface ReferrerChartProps {
  data: { name: string | null; count: number }[];
  total: number;
}

export function ReferrerChart({ data, total }: ReferrerChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-card border border-card-border">
        <h3 className="text-sm font-medium text-muted mb-4">Top Referrers</h3>
        <p className="text-sm text-muted text-center py-8">No data yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-card border border-card-border">
      <h3 className="text-sm font-medium text-muted mb-4">Top Referrers</h3>
      <div className="space-y-3">
        {data.map((referrer, index) => {
          const percentage = total > 0 ? (referrer.count / total) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm truncate max-w-[200px]">
                  {referrer.name || "Direct"}
                </span>
                <span className="text-sm font-mono text-muted">
                  {referrer.count}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-card-border overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
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

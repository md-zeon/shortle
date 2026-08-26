"use client";

interface BrowserChartProps {
  data: { name: string | null; count: number }[];
  total: number;
}

const browserStyles: Record<string, { icon: string; color: string }> = {
  Chrome: { icon: "🌐", color: "bg-blue-500/60" },
  Firefox: { icon: "🦊", color: "bg-orange-500/60" },
  Safari: { icon: "🧭", color: "bg-cyan-500/60" },
  Edge: { icon: "📘", color: "bg-indigo-500/60" },
  Opera: { icon: "🔴", color: "bg-red-500/60" },
  "Samsung Browser": { icon: "📱", color: "bg-purple-500/60" },
  "Mobile Safari": { icon: "🧭", color: "bg-cyan-500/60" },
  "Android Browser": { icon: "🤖", color: "bg-green-500/60" },
  Unknown: { icon: "❓", color: "bg-muted-foreground/30" },
};

function getBrowserStyle(name: string | null) {
  if (!name) return browserStyles.Unknown;
  const key = Object.keys(browserStyles).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  return key ? browserStyles[key] : { icon: "🌐", color: "bg-primary/60" };
}

export function BrowserChart({ data, total }: BrowserChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Browsers
        </h3>
        <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">
          No browser data yet
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Browsers
      </h3>
      <div className="space-y-3">
        {data.map((browser, index) => {
          const percentage = total > 0 ? (browser.count / total) * 100 : 0;
          const name = browser.name || "Unknown";
          const style = getBrowserStyle(browser.name);
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm flex-shrink-0">{style.icon}</span>
                  <span className="text-sm truncate">{name}</span>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {browser.count}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground w-9 text-right">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full ${style.color} rounded-full transition-all duration-500`}
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

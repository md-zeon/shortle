"use client";

interface DeviceChartProps {
  data: { name: string | null; count: number }[];
  total: number;
}

const deviceIcons: Record<string, string> = {
  Mobile: "📱",
  Desktop: "🖥️",
  Tablet: "📋",
  Unknown: "❓",
};

export function DeviceChart({ data, total }: DeviceChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-card-border">
        <h3 className="text-sm font-medium text-muted mb-4">Devices</h3>
        <div className="h-[160px] flex items-center justify-center text-sm text-muted">
          No device data yet
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-card-border">
      <h3 className="text-sm font-medium text-muted mb-4">Devices</h3>
      <div className="space-y-3">
        {data.map((device, index) => {
          const percentage = total > 0 ? (device.count / total) * 100 : 0;
          const name = device.name || "Unknown";
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{deviceIcons[name] || "❓"}</span>
                  <span className="text-sm">{name}</span>
                </div>
                <span className="text-sm font-mono text-muted">
                  {Math.round(percentage)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-card-border overflow-hidden">
                <div
                  className="h-full bg-success/60 rounded-full transition-all duration-500"
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

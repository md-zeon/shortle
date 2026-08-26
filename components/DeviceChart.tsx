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
      <div className="p-6 rounded-lg bg-card border border-card-border">
        <h3 className="text-sm font-medium text-muted mb-4">Devices</h3>
        <p className="text-sm text-muted text-center py-8">No data yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-card border border-card-border">
      <h3 className="text-sm font-medium text-muted mb-4">Devices</h3>
      <div className="space-y-3">
        {data.map((device, index) => {
          const percentage = total > 0 ? (device.count / total) * 100 : 0;
          const name = device.name || "Unknown";
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">
                  {deviceIcons[name] || "❓"} {name}
                </span>
                <span className="text-sm text-muted">
                  {Math.round(percentage)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-card-border overflow-hidden">
                <div
                  className="h-full bg-success rounded-full"
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

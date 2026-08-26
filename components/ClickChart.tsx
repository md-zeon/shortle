"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ClickChartProps {
  data: { date: string; clicks: number }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg bg-card border border-border shadow-lg">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-mono font-semibold">{payload[0].value} clicks</p>
    </div>
  );
}

export function ClickChart({ data }: ClickChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Clicks Over Time</h3>
        <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
          No clicks yet
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Clicks Over Time</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--primary)", opacity: 0.06 }} />
            <Bar dataKey="clicks" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

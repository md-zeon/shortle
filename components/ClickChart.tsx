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

export function ClickChart({ data }: ClickChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-card border border-card-border">
        <h3 className="text-sm font-medium text-muted mb-4">Clicks Over Time</h3>
        <p className="text-sm text-muted text-center py-8">No data yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-card border border-card-border">
      <h3 className="text-sm font-medium text-muted mb-4">Clicks Over Time</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
            <XAxis
              dataKey="date"
              stroke="#71717A"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717A"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1E",
                border: "1px solid #2A2A2E",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="clicks" fill="#5542FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

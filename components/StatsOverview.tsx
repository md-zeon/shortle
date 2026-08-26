"use client";

interface StatsOverviewProps {
  totalClicks: number;
  todayClicks: number;
}

export function StatsOverview({ totalClicks, todayClicks }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 rounded-lg bg-card border border-card-border">
        <p className="text-sm text-muted mb-1">Total Clicks</p>
        <p className="text-3xl font-bold font-mono">{totalClicks.toLocaleString()}</p>
      </div>
      <div className="p-6 rounded-lg bg-card border border-card-border">
        <p className="text-sm text-muted mb-1">Today</p>
        <p className="text-3xl font-bold font-mono">{todayClicks.toLocaleString()}</p>
      </div>
    </div>
  );
}

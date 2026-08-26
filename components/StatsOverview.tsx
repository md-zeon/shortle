"use client";

interface StatsOverviewProps {
  totalClicks: number;
  todayClicks: number;
}

export function StatsOverview({ totalClicks, todayClicks }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-5 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Total Clicks</p>
        </div>
        <p className="text-3xl font-bold font-mono tracking-tight">{totalClicks.toLocaleString()}</p>
      </div>
      <div className="p-5 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Today</p>
        </div>
        <p className="text-3xl font-bold font-mono tracking-tight">{todayClicks.toLocaleString()}</p>
      </div>
    </div>
  );
}

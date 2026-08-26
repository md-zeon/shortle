import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { StatsOverview } from "@/components/StatsOverview";
import { ClickChart } from "@/components/ClickChart";
import { ReferrerChart } from "@/components/ReferrerChart";
import { DeviceChart } from "@/components/DeviceChart";
import { CountryChart } from "@/components/CountryChart";
import { formatDate } from "@/lib/utils";

export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const link = await db.link.findUnique({
    where: { id: code },
    select: {
      id: true,
      originalUrl: true,
      customAlias: true,
      createdAt: true,
    },
  });

  if (!link) {
    notFound();
  }

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [totalClicks, todayClicks, referrers, devices, countries, clicks] =
    await Promise.all([
      db.click.count({ where: { linkId: code } }),
      db.click.count({
        where: { linkId: code, clickedAt: { gte: todayStart } },
      }),
      db.click.groupBy({
        by: ["referrer"],
        where: { linkId: code },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      db.click.groupBy({
        by: ["device"],
        where: { linkId: code },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      db.click.groupBy({
        by: ["country"],
        where: { linkId: code },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      db.click.findMany({
        where: {
          linkId: code,
          clickedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: { clickedAt: true },
        orderBy: { clickedAt: "desc" },
      }),
    ]);

  const timelineMap = new Map<string, number>();
  clicks.forEach((click: { clickedAt: Date }) => {
    const date = click.clickedAt.toISOString().split("T")[0];
    timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
  });

  const timeline = Array.from(timelineMap.entries())
    .map(([date, clicks]) => ({ date, clicks }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-[calc(100vh-8.5rem)]">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>

        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="font-mono text-accent">/{link.id}</span>
              </h1>
              <p className="text-sm text-muted">
                Created {formatDate(link.createdAt)}
              </p>
            </div>
          </div>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors font-mono"
          >
            {link.originalUrl}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>

        <div className="space-y-5 animate-slide-up">
          <StatsOverview
            totalClicks={totalClicks}
            todayClicks={todayClicks}
          />

          <ClickChart data={timeline} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReferrerChart data={referrers.map((r: { referrer: string | null; _count: { id: number } }) => ({ name: r.referrer, count: r._count.id }))} total={totalClicks} />
            <DeviceChart data={devices.map((d: { device: string | null; _count: { id: number } }) => ({ name: d.device, count: d._count.id }))} total={totalClicks} />
          </div>

          <CountryChart data={countries.map((c: { country: string | null; _count: { id: number } }) => ({ name: c.country, count: c._count.id }))} total={totalClicks} />
        </div>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { StatsOverview } from "@/components/StatsOverview";
import { ClickChart } from "@/components/ClickChart";
import { ReferrerChart } from "@/components/ReferrerChart";
import { DeviceChart } from "@/components/DeviceChart";
import { CountryChart } from "@/components/CountryChart";

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

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block"
        >
          ← Back to shortener
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Stats for{" "}
            <span className="font-mono text-accent">/{link.id}</span>
          </h1>
          <p className="text-sm text-muted truncate">
            Original: {link.originalUrl}
          </p>
        </div>

        <div className="space-y-6">
          <StatsOverview
            totalClicks={totalClicks}
            todayClicks={todayClicks}
          />

          <ClickChart data={timeline} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReferrerChart data={referrers.map((r: { referrer: string | null; _count: { id: number } }) => ({ name: r.referrer, count: r._count.id }))} total={totalClicks} />
            <DeviceChart data={devices.map((d: { device: string | null; _count: { id: number } }) => ({ name: d.device, count: d._count.id }))} total={totalClicks} />
          </div>

          <CountryChart data={countries.map((c: { country: string | null; _count: { id: number } }) => ({ name: c.country, count: c._count.id }))} total={totalClicks} />
        </div>
      </div>
    </div>
  );
}

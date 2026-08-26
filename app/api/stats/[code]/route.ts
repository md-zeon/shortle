import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
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
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalClicks, todayClicks, referrers, devices, browsers, countries, clicks] =
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
          by: ["browser"],
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
            clickedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
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

    return NextResponse.json({
      link,
      stats: {
        totalClicks,
        todayClicks,
        referrers: referrers.map((r: { referrer: string | null; _count: { id: number } }) => ({ name: r.referrer, count: r._count.id })),
        devices: devices.map((d: { device: string | null; _count: { id: number } }) => ({ name: d.device, count: d._count.id })),
        browsers: browsers.map((b: { browser: string | null; _count: { id: number } }) => ({ name: b.browser, count: b._count.id })),
        countries: countries.map((c: { country: string | null; _count: { id: number } }) => ({
          name: c.country,
          count: c._count.id,
        })),
        timeline,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

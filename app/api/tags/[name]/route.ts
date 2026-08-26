import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    const tag = await db.tag.findUnique({
      where: { name },
      include: {
        links: {
          include: {
            _count: {
              select: { clicks: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    const totalClicks = tag.links.reduce(
      (sum, link) => sum + link._count.clicks,
      0
    );

    return NextResponse.json({
      tag: tag.name,
      links: tag.links.map((link) => ({
        id: link.id,
        originalUrl: link.originalUrl,
        shortUrl: `/${link.id}`,
        clicks: link._count.clicks,
        createdAt: link.createdAt,
      })),
      stats: {
        totalLinks: tag.links.length,
        totalClicks,
      },
    });
  } catch (error) {
    console.error("Error fetching tag stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

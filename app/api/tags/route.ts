import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: {
          select: { links: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      tags: tags.map((tag: { name: string; _count: { links: number } }) => ({
        name: tag.name,
        linkCount: tag._count.links,
      })),
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

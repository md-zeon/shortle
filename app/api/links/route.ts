import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const links = await db.link.findMany({
      select: {
        id: true,
        originalUrl: true,
        customAlias: true,
        createdAt: true,
        tags: {
          select: { id: true, name: true },
        },
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

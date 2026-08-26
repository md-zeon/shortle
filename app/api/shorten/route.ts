import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { isValidUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customAlias, tags } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (customAlias) {
      if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
        return NextResponse.json(
          { error: "Custom alias can only contain letters, numbers, hyphens, and underscores" },
          { status: 400 }
        );
      }

      const existing = await db.link.findUnique({
        where: { customAlias },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Custom alias is already taken" },
          { status: 400 }
        );
      }
    }

    const id = customAlias || nanoid(7);

    const link = await db.link.create({
      data: {
        id,
        originalUrl: url,
        customAlias: customAlias || null,
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
    });

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    return NextResponse.json({
      shortUrl: `${baseUrl}/${link.id}`,
      id: link.id,
    });
  } catch (error) {
    console.error("Error creating short link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

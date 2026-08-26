import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { originalUrl, expiresAt } = body;

    const existing = await db.link.findUnique({
      where: { id: code },
    });

    if (!existing) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (originalUrl) updateData.originalUrl = originalUrl;
    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    await db.link.update({
      where: { id: code },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const existing = await db.link.findUnique({
      where: { id: code },
    });

    if (!existing) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await db.link.delete({
      where: { id: code },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

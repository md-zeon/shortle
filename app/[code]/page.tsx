import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { detectDevice, detectBrowser } from "@/lib/utils";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const link = await db.link.findUnique({
    where: { id: code },
  });

  if (!link) {
    redirect("/");
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    redirect("/");
  }

  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const referrer = headersList.get("referer") || headersList.get("referrer");
  const country =
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    headersList.get("x-country") ||
    null;

  await db.click.create({
    data: {
      linkId: link.id,
      referrer: referrer || null,
      device: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      country: country,
    },
  });

  redirect(link.originalUrl);
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function TagPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const tag = await db.tag.findUnique({
    where: { name },
    include: {
      links: {
        select: {
          id: true,
          originalUrl: true,
          createdAt: true,
          _count: {
            select: { clicks: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  const totalClicks = tag.links.reduce(
    (sum, link) => sum + link._count.clicks,
    0
  );

  return (
    <div className="min-h-[calc(100vh-8.5rem)]">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>

        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-primary">#{tag.name}</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                {tag.links.length} {tag.links.length === 1 ? "link" : "links"} &middot;{" "}
                {totalClicks} {totalClicks === 1 ? "click" : "clicks"}
              </p>
            </div>
          </div>
        </div>

        {tag.links.length > 0 ? (
          <div className="space-y-3 animate-slide-up">
            {tag.links.map((link) => (
              <div key={link.id} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <a
                        href={`/${link.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-mono text-sm font-medium hover:underline"
                      >
                        /{link.id}
                      </a>
                      <span className="text-xs text-muted-foreground">&middot;</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(link.createdAt)}
                      </span>
                    </div>
                    <p
                      className="text-sm text-muted-foreground truncate"
                      title={link.originalUrl}
                    >
                      {link.originalUrl}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-medium">
                        {tag.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-lg font-semibold">
                      {link._count.clicks}
                    </div>
                    <div className="text-xs text-muted-foreground">clicks</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground">No links with this tag yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

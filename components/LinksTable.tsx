"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface LinkItem {
  id: string;
  originalUrl: string;
  customAlias: string | null;
  createdAt: Date;
  _count: {
    clicks: number;
  };
}

interface LinksTableProps {
  links: LinkItem[];
  onDelete: (id: string) => void;
}

function LinkCard({ link, onDelete }: { link: LinkItem; onDelete: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${baseUrl}/${link.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group p-4 rounded-xl bg-card border border-card-border card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-sm text-accent font-medium">/{link.id}</span>
            <span className="text-xs text-muted">&middot;</span>
            <span className="text-xs text-muted">{formatDate(link.createdAt)}</span>
          </div>
          <p className="text-sm text-muted truncate" title={link.originalUrl}>
            {link.originalUrl}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-lg font-semibold">{link._count.clicks}</div>
          <div className="text-xs text-muted">clicks</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-card-border opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-all"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </>
          )}
        </button>
        <Link
          href={`/stats/${link.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
          Stats
        </Link>
        <div className="flex-1" />
        <button
          onClick={() => onDelete(link.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-danger hover:bg-danger/10 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

export function LinksTable({ links, onDelete }: LinksTableProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p>No links yet. Shorten your first URL above!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onDelete={onDelete} />
      ))}
    </div>
  );
}

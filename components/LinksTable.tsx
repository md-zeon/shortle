"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, isValidUrl } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
}

interface LinkItem {
  id: string;
  originalUrl: string;
  customAlias: string | null;
  createdAt: Date;
  tags: Tag[];
  _count: {
    clicks: number;
  };
}

interface LinksTableProps {
  links: LinkItem[];
  onDelete: (id: string) => void;
  onEdit?: (id: string, originalUrl: string) => void;
}

function LinkCard({ link, onDelete, onEdit }: { link: LinkItem; onDelete: (id: string) => void; onEdit?: (id: string, originalUrl: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(link.originalUrl);
  const [editError, setEditError] = useState("");
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shortUrl = `${baseUrl}/${link.id}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(link.id);
  };

  const handleSaveEdit = async () => {
    setEditError("");
    if (!isValidUrl(editUrl)) {
      setEditError("Please enter a valid URL");
      return;
    }
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: editUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update");
        return;
      }
      onEdit?.(link.id, editUrl);
      setEditing(false);
    } catch {
      setEditError("Failed to update");
    }
  };

  return (
    <div className="group p-4 rounded-xl bg-card border border-card-border card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <a
              href={`/${link.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-accent font-medium hover:underline"
              title="Open short link"
            >
              /{link.id}
            </a>
            <span className="text-xs text-muted">&middot;</span>
            <span className="text-xs text-muted">{formatDate(link.createdAt)}</span>
          </div>
          {editing ? (
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => { setEditUrl(e.target.value); setEditError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") { setEditing(false); setEditUrl(link.originalUrl); } }}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-background border border-card-border text-sm text-foreground focus:outline-none focus:border-accent font-mono"
                  autoFocus
                />
                <button onClick={handleSaveEdit} className="px-2.5 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-all">
                  Save
                </button>
                <button onClick={() => { setEditing(false); setEditUrl(link.originalUrl); setEditError(""); }} className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-all">
                  Cancel
                </button>
              </div>
              {editError && <p className="text-xs text-danger mt-1.5">{editError}</p>}
            </div>
          ) : (
            <p className="text-sm text-muted truncate" title={link.originalUrl}>
              {link.originalUrl}
            </p>
          )}
          {link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {link.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[11px] font-medium"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-lg font-semibold">{link._count.clicks}</div>
          <div className="text-xs text-muted">clicks</div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-card-border">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-all"
          title={copied ? "Copied!" : "Copy short URL"}
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
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(!editing); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          Edit
        </button>
        <Link
          href={`/stats/${link.id}`}
          onClick={(e) => e.stopPropagation()}
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
          onClick={handleDelete}
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

export function LinksTable({ links, onDelete, onEdit }: LinksTableProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { UrlInput } from "@/components/UrlInput";
import { ShortenedResult } from "@/components/ShortenedResult";
import { LinksTable } from "@/components/LinksTable";

interface LinkItem {
  id: string;
  originalUrl: string;
  customAlias: string | null;
  createdAt: Date;
  _count: {
    clicks: number;
  };
}

export default function Home() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [shortenedLink, setShortenedLink] = useState<{
    shortUrl: string;
    id: string;
  } | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data.links || []);
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleShorten = async (url: string, customAlias?: string) => {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, customAlias }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to shorten URL");
    }

    setShortenedLink(data);
    fetchLinks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    const res = await fetch(`/api/links/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setLinks(links.filter((link) => link.id !== id));
      if (shortenedLink?.id === id) setShortenedLink(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8.5rem)]">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Shorten, share &{" "}
            <span className="gradient-text">track</span>
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto">
            Paste a long URL. Get a short link. See who clicks.
          </p>
        </div>

        <div className="mb-12 animate-slide-up">
          <UrlInput onSubmit={handleShorten} />
        </div>

        {shortenedLink && (
          <div className="mb-10 animate-scale-in">
            <ShortenedResult
              shortUrl={shortenedLink.shortUrl}
              id={shortenedLink.id}
            />
          </div>
        )}

        {links.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Recent Links</h2>
              <span className="text-sm text-muted font-mono">{links.length} total</span>
            </div>
            <LinksTable links={links} onDelete={handleDelete} />
          </section>
        )}

        {links.length === 0 && !shortenedLink && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-card-border mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <p className="text-muted">No links yet. Paste a URL above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

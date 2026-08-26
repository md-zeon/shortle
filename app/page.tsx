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
      const res = await fetch("/api/tags");
      const data = await res.json();
      const allLinks: LinkItem[] = [];

      for (const tag of data.tags || []) {
        const tagRes = await fetch(`/api/tags/${tag.name}`);
        const tagData = await tagRes.json();
        allLinks.push(...(tagData.links || []));
      }

      setLinks(allLinks);
    } catch {
      // Silently fail - links will be empty
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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-accent">🔗</span> Shortle
          </h1>
          <p className="text-muted">
            Modern URL shortener with analytics
          </p>
        </header>

        <section className="mb-12">
          <UrlInput onSubmit={handleShorten} />
        </section>

        {shortenedLink && (
          <section className="mb-12">
            <ShortenedResult
              shortUrl={shortenedLink.shortUrl}
              id={shortenedLink.id}
            />
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Links</h2>
          <LinksTable links={links} onDelete={handleDelete} />
        </section>
      </div>
    </div>
  );
}

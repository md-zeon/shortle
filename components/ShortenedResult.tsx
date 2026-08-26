"use client";

import { useState } from "react";
import Link from "next/link";

interface ShortenedResultProps {
  shortUrl: string;
  id: string;
}

export function ShortenedResult({ shortUrl, id }: ShortenedResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full p-4 rounded-lg bg-card border border-card-border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted mb-1">Your shortened URL</p>
          <p className="font-mono text-accent truncate">{shortUrl}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-all"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <Link
            href={`/stats/${id}`}
            className="px-4 py-2 rounded-lg border border-card-border text-sm font-medium hover:bg-card transition-all"
          >
            Stats
          </Link>
        </div>
      </div>
    </div>
  );
}

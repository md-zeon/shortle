"use client";

import { useState, useTransition } from "react";
import { isValidUrl } from "@/lib/utils";

interface UrlInputProps {
  onSubmit: (url: string, customAlias?: string) => Promise<void>;
}

export function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    startTransition(async () => {
      await onSubmit(url, customAlias || undefined);
      setUrl("");
      setCustomAlias("");
      setShowCustom(false);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your long URL here..."
          className="flex-1 px-4 py-3 rounded-lg bg-card border border-card-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !url.trim()}
          className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? "Shortening..." : "Shorten"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowCustom(!showCustom)}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        {showCustom ? "Hide custom alias" : "Use custom alias"}
      </button>

      {showCustom && (
        <input
          type="text"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          placeholder="custom-alias"
          className="w-full px-4 py-2 rounded-lg bg-card border border-card-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-mono text-sm"
          disabled={isPending}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}

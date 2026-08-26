"use client";

import { useState, useTransition } from "react";
import { isValidUrl } from "@/lib/utils";

interface UrlInputProps {
  onSubmit: (url: string, customAlias?: string, tags?: string[]) => Promise<void>;
}

export function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
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
      setError("Please enter a valid URL (include https://)");
      return;
    }

    startTransition(async () => {
      try {
        await onSubmit(url, customAlias || undefined, tags.length ? tags : undefined);
        setUrl("");
        setCustomAlias("");
        setShowCustom(false);
        setTags([]);
        setTagInput("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="p-1 rounded-xl bg-card border border-border glow-border">
        <div className="flex items-center gap-2">
          <div className="pl-4 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="Paste your long URL here..."
            className="flex-1 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className="px-6 py-3 mr-1 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Shortening
              </span>
            ) : "Shorten"}
          </button>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showCustom ? "rotate-90" : ""}`}>
              <path d="M9 18l6-6-6-6" />
            </svg>
            {showCustom ? "Hide options" : "Options"}
          </button>
          {url && !error && (
            <span className="text-xs text-muted-foreground">Press Enter to shorten</span>
          )}
        </div>
      </div>

      {showCustom && (
        <div className="mt-3 space-y-3 animate-slide-up">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-card border border-border">
            <span className="pl-4 text-sm text-muted-foreground font-mono">/</span>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
              placeholder="custom-alias"
              className="flex-1 py-2.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-sm"
              disabled={isPending}
            />
          </div>
          <div className="p-3 rounded-xl bg-card border border-border">
            <label className="text-xs text-muted-foreground mb-2 block">Tags</label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-foreground transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 py-1.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-30"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </form>
  );
}

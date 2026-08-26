"use client";

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

export function LinksTable({ links, onDelete }: LinksTableProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p>No links yet. Shorten your first URL above!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border text-left text-sm text-muted">
            <th className="pb-3 font-medium">Short URL</th>
            <th className="pb-3 font-medium">Original URL</th>
            <th className="pb-3 font-medium text-right">Clicks</th>
            <th className="pb-3 font-medium">Created</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr
              key={link.id}
              className="border-b border-card-border last:border-0"
            >
              <td className="py-4">
                <span className="font-mono text-accent">/{link.id}</span>
              </td>
              <td className="py-4">
                <span className="text-sm text-muted truncate max-w-[300px] block">
                  {link.originalUrl}
                </span>
              </td>
              <td className="py-4 text-right">
                <span className="font-mono">{link._count.clicks}</span>
              </td>
              <td className="py-4 text-sm text-muted">
                {formatDate(link.createdAt)}
              </td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/stats/${link.id}`}
                    className="p-2 rounded-lg hover:bg-card transition-all text-muted hover:text-foreground"
                    title="View stats"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3v18h18" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => onDelete(link.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-all text-muted hover:text-red-500"
                    title="Delete link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

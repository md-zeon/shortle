"use client";

import { useState, useEffect, useRef } from "react";

interface QrModalProps {
  url: string;
  onClose: () => void;
}

export function QrModal({ url, onClose }: QrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: { dark: "#EFEFE6", light: "#0A090F" },
      }).then(setQrDataUrl);
    });
  }, [url]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleDownload = async () => {
    setDownloading(true);
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-${url.split("/").pop()}.png`;
    link.click();
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="w-full max-w-sm mx-4 p-6 rounded-2xl bg-card border border-card-border shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold">QR Code</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex justify-center mb-5">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 rounded-xl" />
          ) : (
            <div className="w-64 h-64 rounded-xl bg-background flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-muted" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>
        <p className="text-xs text-muted text-center mb-4 font-mono truncate">{url}</p>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl || downloading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? "Saved" : "Download"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-card-border text-sm font-medium text-muted hover:text-foreground hover:bg-background transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

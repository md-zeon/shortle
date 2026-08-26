import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { PaletteProvider } from "@/components/palette-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { PaletteSwitcher } from "@/components/palette-switcher";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shortle - Modern URL Shortener",
  description:
    "Shorten URLs, track clicks with analytics, and generate QR codes. Free and developer-friendly.",
  openGraph: {
    title: "Shortle - Modern URL Shortener",
    description:
      "Shorten URLs, track clicks with analytics, and generate QR codes.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var palette = localStorage.getItem('palette');
                  if (palette && palette !== 'rose-spark') {
                    document.documentElement.setAttribute('data-palette', palette);
                  }
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <PaletteProvider>
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
              <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
                  <span className="text-primary text-xl">&#128279;</span>
                  <span>Shortle</span>
                </Link>
                <nav className="flex items-center gap-2 text-sm">
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
                  >
                    Shorten
                  </Link>
                  <a
                    href="https://github.com/md-zeon/shortle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
                  >
                    GitHub
                  </a>
                  <div className="w-px h-5 bg-border mx-1" />
                  <PaletteSwitcher />
                  <ThemeToggle />
                </nav>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border py-8 mt-auto">
              <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Shortle. Open source.</p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/md-zeon/shortle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </footer>
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

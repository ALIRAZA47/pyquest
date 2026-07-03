import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Quest — Learn Python, Beautifully",
  description:
    "A gorgeous, beginner-friendly way to learn Python from zero to confident. Interactive lessons, quizzes, and hands-on exercises across 60+ topics.",
  keywords: [
    "Python",
    "learn Python",
    "Python tutorial",
    "Python for beginners",
    "coding",
    "programming course",
  ],
  authors: [{ name: "Quest" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#080a14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

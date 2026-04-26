import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Pokemon Cards",
  description:
    "A curated index of the best competitively relevant Pokemon card for each Gen 1 Pokemon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--page-background)] text-[var(--foreground)]">
        <div className="page-backdrop" aria-hidden="true" />
        <div className="relative flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}

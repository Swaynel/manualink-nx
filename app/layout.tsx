import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppShell from "../components/AppShell";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "ManuaLink",
    template: "%s | ManuaLink",
  },
  description:
    "ManuaLink connects skilled Kenyan workers with employers for manual jobs in construction, farming, cleaning, and more.",
  keywords: [
    "jobs",
    "manual work",
    "Kenya",
    "construction",
    "farming",
    "cleaning",
    "employment",
  ],
  authors: [{ name: "ManuaLink Team" }],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E40AF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

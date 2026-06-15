import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "CampusVerse AI — The AI Operating System for Student Life",
  description: "Unified AI-powered platform for goals, planning, campus intelligence, and smart recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

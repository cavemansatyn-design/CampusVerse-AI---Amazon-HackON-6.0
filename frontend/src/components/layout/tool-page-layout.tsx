"use client";

import type { ModuleId } from "@/lib/module-themes";
import { MODULE_THEMES } from "@/lib/module-themes";
import { ComicPageShell } from "@/components/layout/comic-page-shell";
import { AmazonPanel } from "@/components/recommendations/amazon-panel";
import type { RecProduct } from "@/lib/recommendation-data";

interface ToolPageLayoutProps {
  module: ModuleId;
  title: string;
  subtitle: string;
  recommendations: RecProduct[];
  recTitle?: string;
  children: React.ReactNode;
}

export function ToolPageLayout({ module, title, subtitle, recommendations, recTitle, children }: ToolPageLayoutProps) {
  const theme = MODULE_THEMES[module];

  return (
    <ComicPageShell theme={theme}>
      <div className="space-y-6 p-1">
        <header>
          <div className="caution-bar mb-4" />
          <h1 className="font-display text-5xl uppercase drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)]" style={{ color: theme.accent }}>
            {title}
          </h1>
          <p className="mt-1 max-w-2xl font-body text-lg text-on-surface/90">{subtitle}</p>
        </header>
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-6">{children}</div>
          <AmazonPanel title={recTitle} items={recommendations} />
        </div>
      </div>
    </ComicPageShell>
  );
}

"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicBadge, ComicButton, ComicPanel } from "@/components/ui/comic-panel";
import {
  IconGmail,
  IconWhatsApp,
  IntelFunctionIcon,
  sourceChannelIcon,
} from "@/components/icons/comic-icons";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { INTEL_FUNCTIONS } from "@/lib/intel-content";

export default function IntelligencePage() {
  const { dashboard } = useDashboard();
  const [gmailConnected, setGmailConnected] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [activeFn, setActiveFn] = useState("Summarize");

  const goalTitles = dashboard?.goals.map((g) => g.title) ?? [];
  const recs = useRecommendations("intel", goalTitles, activeFn);
  const activeBlock = INTEL_FUNCTIONS.find((f) => f.id === activeFn) ?? INTEL_FUNCTIONS[0];

  return (
    <ToolPageLayout
      module="intelligence"
      title="Intelligence Hub"
      subtitle="Connect Gmail & WhatsApp — AI summarizes, classifies, prioritizes & alerts"
      recommendations={recs}
      recTitle={`Picks For ${activeFn}`}
    >
      <ComicPanel title="Connect Sources" className="comic-panel-solid">
        <div className="flex flex-wrap gap-4">
          <ComicButton
            variant={gmailConnected ? "primary" : "secondary"}
            className="comic-button-solid bg-white"
            onClick={() => setGmailConnected(!gmailConnected)}
          >
            <IconGmail size={18} />
            {gmailConnected ? "Gmail Connected ✓" : "Connect Gmail"}
          </ComicButton>
          <ComicButton
            variant={whatsappConnected ? "primary" : "secondary"}
            className="comic-button-solid bg-white"
            onClick={() => setWhatsappConnected(!whatsappConnected)}
          >
            <IconWhatsApp size={18} />
            {whatsappConnected ? "WhatsApp Connected ✓" : "Connect WhatsApp"}
          </ComicButton>
        </div>
        <p className="mt-2 font-body text-sm text-on-surface/80">Toggle sources to simulate live inbox ingestion</p>
      </ComicPanel>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {INTEL_FUNCTIONS.map((fn) => (
          <button
            key={fn.id}
            type="button"
            onClick={() => setActiveFn(fn.id)}
            className={`comic-button comic-button-solid intel-fn-btn border-4 border-on-surface p-4 text-center shadow-[4px_4px_0_0_#1a1c1b] transition hover:-translate-y-0.5 ${
              activeFn === fn.id ? "intel-fn-btn--active" : ""
            }`}
          >
            <IntelFunctionIcon id={fn.id} size={30} className="mx-auto mb-2 text-on-surface" />
            <p className="font-mono text-xs font-bold uppercase leading-snug">{fn.id}</p>
          </button>
        ))}
      </div>

      <ComicPanel title={activeBlock.title} className="comic-panel-solid">
        {activeBlock.items.map((entry, i) => (
          <div key={i} className="mb-4 border-b-4 border-surface-container-low pb-4 last:mb-0 last:border-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-on-surface">{sourceChannelIcon(entry.from, 18)}</span>
              <ComicBadge>{entry.tag}</ComicBadge>
              <span className="font-mono text-[10px] font-bold uppercase text-on-surface/70">{entry.from}</span>
            </div>
            <p className="mt-2 font-body text-sm leading-relaxed text-on-surface">{entry.text}</p>
            {activeFn === "Detect Opportunities" && (
              <p className="mt-2 font-mono text-xs font-bold text-tertiary">→ Matched picks queued in panel on the right</p>
            )}
          </div>
        ))}
      </ComicPanel>
    </ToolPageLayout>
  );
}

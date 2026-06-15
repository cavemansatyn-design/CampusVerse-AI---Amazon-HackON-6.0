"use client";

import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicBadge, ComicButton, ComicPanel } from "@/components/ui/comic-panel";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { Users, GraduationCap, Handshake, Wallet, UserPlus } from "lucide-react";

const MOCK_BUDDIES = [
  { name: "Vikram Singh", year: "First Year", match_score: 0.85, shared_goals: ["Learn DSA"], shared_interests: ["Web Development"] },
  { name: "Ananya Krishnan", year: "Second Year", match_score: 0.72, shared_goals: ["Improve CGPA"], shared_interests: ["Gaming"] },
];

const DEBT_LEDGER = [
  { person: "Rahul K.", type: "owe", amount: 250, item: "Shared dinner + cab" },
  { person: "Priya M.", type: "lent", amount: 150, item: "Borrowed calculator deposit" },
  { person: "Block C Group", type: "sharing", amount: 0, item: "Extension board · kettle · tiffin" },
];

const SHARED_BUYS = [
  { item: "Extension Board", split: "4 roommates", cost: "₹40 each" },
  { item: "Energy Snacks", split: "Team of 3", cost: "₹30 each" },
];

export default function NetworkPage() {
  const { dashboard } = useDashboard();
  const recs = useRecommendations("network", dashboard?.goals.map((g) => g.title) ?? []);

  return (
    <ToolPageLayout
      module="network"
      title="Network Intelligence"
      subtitle="Study buddies · mentorship · financial debt ledger · shared buys"
      recommendations={recs}
      recTitle="Share & Save Picks"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <ComicPanel title="Study Buddy Matches">
          <Users className="mb-3 h-6 w-6" />
          {MOCK_BUDDIES.map((b) => (
            <div key={b.name} className="mb-3 border-4 border-on-surface bg-white/80 p-3">
              <div className="flex justify-between">
                <h4 className="font-display text-base uppercase">{b.name}</h4>
                <span className="font-mono text-xs">{Math.round(b.match_score * 100)}%</span>
              </div>
              <p className="font-body text-xs text-outline">{b.year} · {b.shared_goals.join(", ")}</p>
              <ComicButton variant="secondary" className="mt-2 w-full text-xs">
                <UserPlus size={14} className="mr-1 inline" /> Find Similar People
              </ComicButton>
            </div>
          ))}
        </ComicPanel>

        <ComicPanel title="Mentorship">
          <GraduationCap className="mb-3 h-6 w-6" />
          <div className="mb-3 border-4 border-on-surface p-3">
            <h4 className="font-display text-base uppercase">Prof. Sharma</h4>
            <p className="font-body text-sm">Focus: DSA & Algorithms</p>
            <ComicButton variant="secondary" className="mt-2 w-full text-xs">
              <UserPlus size={14} className="mr-1 inline" /> Find Other Mentors
            </ComicButton>
          </div>
          <div className="border-4 border-on-surface bg-tertiary-container p-3">
            <p className="font-body text-sm">Rahul wants a mock interview — matched on placement goals!</p>
            <ComicButton className="mt-2 w-full text-xs">
              <UserPlus size={14} className="mr-1 inline" /> Find Mock Partners
            </ComicButton>
          </div>
        </ComicPanel>

        <ComicPanel title="Project Teams">
          <Handshake className="mb-3 h-6 w-6" />
          <div className="border-4 border-on-surface p-3">
            <h4 className="font-display text-base uppercase">Build Sprint Team</h4>
            <p className="font-body text-sm">Need: React dev, UI/UX designer</p>
            <ComicButton className="mt-2 w-full text-xs">
              <UserPlus size={14} className="mr-1 inline" /> Find Teammates
            </ComicButton>
          </div>
        </ComicPanel>
      </div>

      <ComicPanel title="Financial Debt Ledger">
        <Wallet className="mb-3 h-6 w-6" />
        <div className="grid gap-3 md:grid-cols-3">
          {DEBT_LEDGER.map((d) => (
            <div key={d.person} className="border-4 border-on-surface bg-white/90 p-4">
              <ComicBadge variant={d.type === "owe" ? "alert" : d.type === "lent" ? "success" : "default"}>
                {d.type === "owe" ? "You Owe" : d.type === "lent" ? "They Owe You" : "Sharing"}
              </ComicBadge>
              <h4 className="mt-2 font-display text-base uppercase">{d.person}</h4>
              <p className="font-body text-sm">{d.item}</p>
              {d.amount > 0 && <p className="font-mono text-lg font-bold">₹{d.amount}</p>}
              <ComicButton variant="secondary" className="mt-2 w-full text-xs">
                <UserPlus size={14} className="mr-1 inline" /> Find Split Partners
              </ComicButton>
            </div>
          ))}
        </div>
      </ComicPanel>

      <ComicPanel title="Shared Purchases">
        <div className="grid gap-3 md:grid-cols-2">
          {SHARED_BUYS.map((s) => (
            <div key={s.item} className="border-4 border-on-surface bg-indigo-100 p-4">
              <h4 className="font-display uppercase">{s.item}</h4>
              <p className="font-body text-sm">{s.split} · {s.cost}</p>
              <ComicButton variant="secondary" className="mt-2 text-xs">
                <UserPlus size={14} className="mr-1 inline" /> Find Co-Buyers
              </ComicButton>
            </div>
          ))}
        </div>
      </ComicPanel>
    </ToolPageLayout>
  );
}

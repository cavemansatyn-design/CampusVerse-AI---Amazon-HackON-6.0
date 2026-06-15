"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicButton, ComicPanel } from "@/components/ui/comic-panel";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { API_BASE } from "@/lib/utils";
import { Calendar, Clock, Focus } from "lucide-react";

export default function PlannerPage() {
  const { dashboard } = useDashboard();
  const [plan, setPlan] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/planner/demo/optimize`, { method: "POST" });
        if (res.ok) setPlan(await res.json());
        else throw new Error();
      } catch {
        setPlan({
          daily_plan: ["9:00 AM — DSA Practice (90 min)", "11:00 AM — Classes", "2:00 PM — Project Work", "4:00 PM — Club Meeting", "6:00 PM — Gym / Wellness"],
          weekly_plan: ["Mon/Wed/Fri — Core classes", "Tue — Hackathon prep", "Thu — Study group", "Sat — Deep work block", "Sun — Review & plan"],
          wellness_note: "Burnout risk low. Take a 15-min break every 90 minutes.",
          focus_sessions: [{ duration: 25, task: "DSA — Trees & Graphs" }, { duration: 50, task: "Portfolio project" }],
        });
      }
    }
    load();
  }, []);

  const recs = useRecommendations("planner", dashboard?.goals.map((g) => g.title) ?? []);

  return (
    <ToolPageLayout
      module="planner"
      title="Smart Planner"
      subtitle="Goals + events + deadlines → optimized daily execution"
      recommendations={recs}
    >
      {plan && (
        <>
          <div className="border-4 border-on-surface bg-tertiary-container p-4">
            <p className="font-body text-sm">{plan.wellness_note as string}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ComicPanel title="Today's Plan">
              <Calendar className="mb-3 h-6 w-6" />
              <ul className="space-y-2">
                {(plan.daily_plan as string[])?.map((item, i) => (
                  <li key={i} className="border-l-4 border-blue-400 pl-3 font-body text-sm">{item}</li>
                ))}
              </ul>
            </ComicPanel>

            <ComicPanel title="Weekly Overview">
              <Clock className="mb-3 h-6 w-6" />
              <ul className="space-y-2">
                {(plan.weekly_plan as string[])?.map((item, i) => (
                  <li key={i} className="font-body text-sm">• {item}</li>
                ))}
              </ul>
            </ComicPanel>

            <ComicPanel title="Focus Sessions">
              <Focus className="mb-3 h-6 w-6" />
              <div className="space-y-3">
                {(plan.focus_sessions as { duration: number; task: string }[])?.map((s, i) => (
                  <div key={i} className="border-4 border-on-surface bg-primary-container p-3">
                    <p className="font-mono text-xs uppercase">{s.duration} min pomodoro</p>
                    <p className="font-body text-sm">{s.task}</p>
                  </div>
                ))}
              </div>
              <Link href="/focus">
                <ComicButton className="mt-4 w-full">Start Focus Mode →</ComicButton>
              </Link>
            </ComicPanel>
          </div>
        </>
      )}
    </ToolPageLayout>
  );
}

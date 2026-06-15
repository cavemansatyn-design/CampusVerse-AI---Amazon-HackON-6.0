"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaceCompanion, moodSpeech } from "@/components/companion/FaceCompanion";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicBadge, ComicPanel, ProgressBar, StatCard } from "@/components/ui/comic-panel";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { moodFromProgress } from "@/lib/module-themes";
import { ArrowRight, Bell, Sparkles, Zap } from "lucide-react";

export default function HomeDashboard() {
  const { dashboard, loading } = useDashboard();
  const [goalStreaks, setGoalStreaks] = useState<Record<string, number>>({});
  const [dailyTarget, setDailyTarget] = useState(1);
  const [weeklyTarget, setWeeklyTarget] = useState(7);
  const [monthlyTarget, setMonthlyTarget] = useState(30);

  const goalTitles = dashboard?.goals.map((g) => g.title) ?? [];
  const recs = useRecommendations("home", goalTitles);

  if (loading || !dashboard) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Sparkles className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const { greeting, companions, goals, announcements, analytics, insights } = dashboard;
  const companion = companions[0];
  const avgProgress = goals.length ? goals.reduce((s, g) => s + g.progress, 0) / goals.length : 0;
  const superMood = moodFromProgress(avgProgress, companion?.streak ?? 0);
  const superSpeech = moodSpeech(superMood, Math.round(avgProgress), companion?.streak ?? 0);

  return (
    <ToolPageLayout module="home" title="Command Center" subtitle={greeting} recommendations={recs} recTitle="Picks For Your Goals">
      <ComicPanel title="Notifications">
        <div className="space-y-2">
          {announcements.slice(0, 4).map((ann) => (
            <div key={ann.id} className="flex items-start gap-3 border-b-2 border-surface-container-low pb-2 last:border-0">
              <Bell size={16} className="mt-0.5 shrink-0" />
              <div>
                <ComicBadge variant={ann.priority === "high" ? "alert" : "default"}>{ann.priority}</ComicBadge>
                <p className="font-display text-sm uppercase">{ann.title}</p>
                <p className="font-body text-xs text-outline">{ann.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ComicPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <ComicPanel title="Super Companion — All Goals Combined">
          <div className="flex flex-col items-center py-2">
            <FaceCompanion mood={superMood} size={200} speech={superSpeech} />
            {companion && (
              <p className="mt-2 font-mono text-xs uppercase text-outline">
                Collective mood from {goals.length} goals · {companion.name}
              </p>
            )}
          </div>
        </ComicPanel>

        <ComicPanel title="Streak Monitor">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="border-4 border-on-surface bg-primary-container p-3">
              <p className="font-mono text-[10px] uppercase">Daily</p>
              <p className="font-display text-3xl">{companion?.streak ?? 0}</p>
              <input type="range" min={1} max={7} value={dailyTarget} onChange={(e) => setDailyTarget(+e.target.value)} className="mt-2 w-full" />
              <p className="font-body text-[10px]">target {dailyTarget}d</p>
            </div>
            <div className="border-4 border-on-surface bg-tertiary-container p-3">
              <p className="font-mono text-[10px] uppercase">Weekly</p>
              <p className="font-display text-3xl">{Math.min(weeklyTarget, companion?.streak ?? 0)}</p>
              <input type="range" min={3} max={14} value={weeklyTarget} onChange={(e) => setWeeklyTarget(+e.target.value)} className="mt-2 w-full" />
              <p className="font-body text-[10px]">target {weeklyTarget}d</p>
            </div>
            <div className="border-4 border-on-surface bg-white p-3">
              <p className="font-mono text-[10px] uppercase">Monthly</p>
              <p className="font-display text-3xl">{Math.min(monthlyTarget, (companion?.streak ?? 0) * 2)}</p>
              <input type="range" min={10} max={30} value={monthlyTarget} onChange={(e) => setMonthlyTarget(+e.target.value)} className="mt-2 w-full" />
              <p className="font-body text-[10px]">target {monthlyTarget}d</p>
            </div>
          </div>
          <ProgressBar value={avgProgress} label="Overall goal progress" />
        </ComicPanel>
      </div>

      <ComicPanel title="Active Goals — Each Has Its Own Companion">
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => {
            const mood = moodFromProgress(goal.progress, goalStreaks[goal.id] ?? companion?.streak ?? 0);
            const streak = goalStreaks[goal.id] ?? Math.max(1, Math.floor((companion?.streak ?? 1) / goals.length));
            return (
              <div key={goal.id} className="overflow-hidden border-4 border-on-surface bg-white/90 p-4">
                <h4 className="mb-2 break-words font-display text-base uppercase leading-tight sm:text-lg">
                  {goal.title}
                </h4>
                <ComicBadge>{goal.status}</ComicBadge>
                <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                  <FaceCompanion
                    className="w-full shrink-0 sm:w-auto"
                    mood={mood}
                    size={110}
                    speech={moodSpeech(mood, Math.round(goal.progress), streak)}
                  />
                  <div className="min-w-0 w-full flex-1">
                    <ProgressBar value={goal.progress} label="Progress" />
                    <label className="mt-2 block font-mono text-[10px] uppercase">
                      Goal streak: {streak} days
                      <input
                        type="range"
                        min={0}
                        max={30}
                        value={streak}
                        onChange={(e) => setGoalStreaks((s) => ({ ...s, [goal.id]: +e.target.value }))}
                        className="mt-1 w-full"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link href="/goals" className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase text-tertiary hover:underline">
          Create goal with AI <ArrowRight size={12} />
        </Link>
      </ComicPanel>

      <ComicPanel title="Live Intelligence Feed" tilt={-0.5}>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 border-b-2 border-surface-container-low pb-3 last:border-0">
              <Zap className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <p className="font-body text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </ComicPanel>

      <ComicPanel title="Success Analytics">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard label="Success" value={analytics.student_success_score} />
          <StatCard label="Goals" value={analytics.goal_completion_score} />
          <StatCard label="Engagement" value={analytics.campus_engagement_score} />
          <StatCard label="Productivity" value={analytics.productivity_score} />
          <StatCard label="Sustainability" value={analytics.resource_sustainability_score} />
          <StatCard label="Companion" value={analytics.companion_growth_score} />
        </div>
      </ComicPanel>
    </ToolPageLayout>
  );
}

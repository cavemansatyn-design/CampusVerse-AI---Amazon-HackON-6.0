"use client";

import { useState } from "react";
import { FaceCompanion, moodSpeech } from "@/components/companion/FaceCompanion";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicButton, ComicPanel, ProgressBar } from "@/components/ui/comic-panel";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { moodFromProgress } from "@/lib/module-themes";
import { API_BASE } from "@/lib/utils";
import { Mic, MicOff, Sparkles } from "lucide-react";

const PREMADE_TODAY = ["9:00 — Deep work block (45m)", "14:00 — Skill practice", "18:00 — Log streak + review"];
const PREMADE_WEEKLY = ["Mon/Wed/Fri — core sessions", "Tue/Thu — review + adjust difficulty", "Sat — milestone check", "Sun — rest"];

const PREMADE_GOALS = [
  { title: "Learn DSA from scratch", prompt: "I want to learn DSA from scratch — 90 min daily, budget ₹3000, placement in 6 months" },
  { title: "Start gym & gain weight", prompt: "I am skinny and want to start gym — budget ₹5000, 3 days/week, hostel with no equipment" },
  { title: "Improve CGPA this semester", prompt: "Improve CGPA from 7.2 to 8.5 — focus on math and labs, 2 hours daily study" },
];

export default function GoalsPage() {
  const { dashboard } = useDashboard();
  const [goalText, setGoalText] = useState("");
  const [heading, setHeading] = useState("");
  const [roadmap, setRoadmap] = useState<Record<string, unknown> | null>(null);
  const [weekly, setWeekly] = useState<string[]>(PREMADE_WEEKLY);
  const [daily, setDaily] = useState<string[]>(PREMADE_TODAY);
  const [generating, setGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [listening, setListening] = useState(false);
  const [goalStreaks, setGoalStreaks] = useState<Record<string, number>>({});

  const goalTitles = dashboard?.goals.map((g) => g.title) ?? [];
  const recs = useRecommendations("goals", selectedGoal ? [selectedGoal] : goalTitles);

  function startVoice() {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SR = W.webkitSpeechRecognition || W.SpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    setListening(true);
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: { results: { 0: { 0: { transcript: string } } } }) => {
      const text = e.results[0][0].transcript;
      setGoalText((prev) => (prev ? `${prev} ${text}` : text));
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  }

  async function createGoal() {
    if (!goalText.trim()) return;
    setGenerating(true);
    const title = goalText.length > 48 ? goalText.slice(0, 48) + "…" : goalText;
    setHeading(title);
    setSelectedGoal(title);

    try {
      const res = await fetch(`${API_BASE}/ai/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalText, context: { detail: goalText } }),
      });
      if (res.ok) setRoadmap(await res.json());
      else throw new Error();
    } catch {
      const isGym = /gym|skinny|fitness|weight/i.test(goalText);
      setRoadmap({
        roadmap: [
          { phase: "Foundation", duration: "Week 1-2", tasks: ["Baseline check", "Daily habit", "Track macros"] },
          { phase: "Build", duration: "Week 3-6", tasks: ["Progressive overload", "Weekly review", "Adjust difficulty"] },
          { phase: "Master", duration: "Week 7-8", tasks: ["Hit target", "Celebrate", "Maintain streak"] },
        ],
        milestones: [`Start: ${title}`, "50% checkpoint", "Goal complete"],
        companion_creature: isGym ? "Fitness Companion" : "Explorer Companion",
        schedule_suggestion: "Difficulty adapts to your streak automatically",
      });
    }
    setGenerating(false);
  }

  return (
    <ToolPageLayout
      module="goals"
      title="Goal Engine"
      subtitle="Voice or text → heading → plan → weekly → today's tasks"
      recommendations={recs}
      recTitle={selectedGoal ? `Bundle: ${heading || selectedGoal}` : "Smart Picks (Premium First)"}
    >
      <ComicPanel title="Create Goal With AI">
        <textarea
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder='Example: "I am skinny and want to start gym — budget ₹5000, 3 days/week..."'
          className="mb-3 w-full border-4 border-on-surface bg-white p-4 font-body text-sm"
          rows={4}
        />
        <div className="flex flex-wrap gap-3">
          <ComicButton variant="secondary" onClick={startVoice} className="bg-green-200">
            {listening ? <MicOff size={18} className="mr-2 inline" /> : <Mic size={18} className="mr-2 inline" />}
            {listening ? "Listening…" : "Voice Input"}
          </ComicButton>
          <ComicButton onClick={createGoal} className="bg-green-200">
            <Sparkles size={16} className="mr-2 inline" />
            {generating ? "AI Planning…" : "Generate Full Plan"}
          </ComicButton>
        </div>
      </ComicPanel>

      <ComicPanel title="Quick-Start Goals">
        <div className="grid gap-3 md:grid-cols-3">
          {PREMADE_GOALS.map((g) => (
            <button
              key={g.title}
              type="button"
              onClick={() => {
                setGoalText(g.prompt);
                setSelectedGoal(g.title);
              }}
              className="border-4 border-on-surface bg-white/90 p-4 text-left shadow-[3px_3px_0_0_#1a1c1b] hover:-translate-y-0.5"
            >
              <h4 className="font-display text-sm uppercase">{g.title}</h4>
              <p className="mt-1 font-body text-xs text-outline line-clamp-2">{g.prompt}</p>
            </button>
          ))}
        </div>
      </ComicPanel>

      {heading && (
        <ComicPanel title={`Goal Heading: ${heading}`}>
          <p className="font-body text-sm">Synced across Planner, Focus, Marketplace & Companion</p>
        </ComicPanel>
      )}

      {roadmap && (
        <>
          <ComicPanel title="Overall Roadmap">
            <div className="grid gap-4 md:grid-cols-3">
              {(roadmap.roadmap as { phase: string; duration?: string; tasks: string[] }[])?.map((phase, i) => (
                <div key={i} className="border-4 border-on-surface bg-white/90 p-4">
                  <h3 className="font-display text-lg uppercase">{phase.phase}</h3>
                  {phase.duration && <p className="font-mono text-xs text-outline">{phase.duration}</p>}
                  <ul className="mt-2 space-y-1">
                    {phase.tasks.map((t, j) => (
                      <li key={j} className="font-body text-sm">• {t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ComicPanel>
          <div className="grid gap-4 md:grid-cols-2">
            <ComicPanel title="Weekly Plan">
              <ul className="space-y-2">
                {weekly.map((w, i) => (
                  <li key={i} className="border-l-4 border-green-500 pl-3 font-body text-sm">{w}</li>
                ))}
              </ul>
            </ComicPanel>
            <ComicPanel title="Today's Plan">
              <ul className="space-y-2">
                {daily.map((d, i) => (
                  <li key={i} className="border-l-4 border-green-700 pl-3 font-body text-sm">{d}</li>
                ))}
              </ul>
            </ComicPanel>
          </div>
        </>
      )}

      <ComicPanel title="Your Active Goals">
        <div className="grid gap-4 md:grid-cols-2">
          {dashboard?.goals.map((goal) => {
            const streak = goalStreaks[goal.id] ?? 3;
            const mood = moodFromProgress(goal.progress, streak);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal.title)}
                className="overflow-hidden border-4 border-on-surface bg-white/90 p-4 text-left shadow-[4px_4px_0_0_#1a1c1b]"
              >
                <h3 className="mb-2 break-words font-display text-base uppercase leading-tight sm:text-lg">{goal.title}</h3>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                  <FaceCompanion
                    className="w-full shrink-0 sm:w-auto"
                    mood={mood}
                    size={90}
                    speech={moodSpeech(mood, Math.round(goal.progress), streak)}
                  />
                  <div className="min-w-0 w-full flex-1">
                    <ProgressBar value={goal.progress} label="Progress" />
                    <p className="mt-2 font-mono text-[10px] uppercase">Streak: {streak}d</p>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={streak}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setGoalStreaks((s) => ({ ...s, [goal.id]: +e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ComicPanel>
    </ToolPageLayout>
  );
}

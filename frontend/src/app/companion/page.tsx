"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TamagotchiCompanion } from "@/components/companion/TamagotchiCompanion";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicButton, ComicPanel, ProgressBar } from "@/components/ui/comic-panel";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { moodFromProgress } from "@/lib/module-themes";
import { API_BASE } from "@/lib/utils";
import { Send } from "lucide-react";

const EVOLUTION_STAGES = ["Egg", "Baby", "Explorer", "Master", "Legend"];

export default function CompanionPage() {
  const { dashboard, loading, scenarioId } = useDashboard();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [chatting, setChatting] = useState(false);
  const [sleepScore, setSleepScore] = useState(72);
  const [wellbeing, setWellbeing] = useState(78);
  const [wellbeingStreak, setWellbeingStreak] = useState(5);
  const [chat, setChat] = useState<{ role: "user" | "companion"; text: string }[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/students?demo_only=true&limit=10`)
      .then((r) => r.json())
      .then((students: { id: string; demo_scenario: string }[]) => {
        const match = students.find((s) => s.demo_scenario === scenarioId);
        if (match) setStudentId(match.id);
      })
      .catch(() => null);
  }, [scenarioId]);

  useEffect(() => {
    if (dashboard?.companions[0]) {
      setChat([{ role: "companion", text: `Hey! I'm ${dashboard.companions[0].name}. How's your wellbeing this week?` }]);
    }
  }, [dashboard]);

  const companion = dashboard?.companions[0];
  const goalProgress = dashboard?.goals[0]?.progress ?? 0;
  const mood = moodFromProgress((sleepScore + wellbeing) / 2, wellbeingStreak);
  const goalTitles = dashboard?.goals.map((g) => g.title) ?? [];
  const recs = useRecommendations("companion", goalTitles);

  async function sendMessage() {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage("");
    setChatting(true);
    setChat((c) => [...c, { role: "user", text: userMsg }]);
    setSending(true);

    const stress = /stress|tired|burnout|anxious/i.test(userMsg);
    if (stress) setWellbeing((w) => Math.max(40, w - 5));

    try {
      const chatUrl = studentId ? `${API_BASE}/dashboard/${studentId}/companion/chat` : `${API_BASE}/ai/companion/chat`;
      const res = await fetch(chatUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      if (res.ok) {
        const data = await res.json();
        setChat((c) => [...c, { role: "companion", text: data.reply }]);
        if (stress) {
          setChat((c) => [...c, { role: "companion", text: "I've softened your weekly goals — check Goals for the updated plan." }]);
        }
      } else throw new Error();
    } catch {
      setChat((c) => [...c, { role: "companion", text: `You've got this! ${wellbeingStreak}-day wellbeing streak. Rest if needed — goals can adapt.` }]);
    }
    setSending(false);
    setTimeout(() => setChatting(false), 3000);
  }

  if (loading || !dashboard || !companion) {
    return <p className="font-mono text-sm">Loading companion...</p>;
  }

  const stageIndex = EVOLUTION_STAGES.indexOf(companion.evolution_stage || "Egg");
  const speech = `Sleep ${sleepScore}% · Wellbeing ${wellbeing}% · ${wellbeingStreak}d streak`;

  return (
    <ToolPageLayout
      module="companion"
      title="AI Companion"
      subtitle="Sleep · wellbeing · stress support · goal rebuild"
      recommendations={recs}
      recTitle="Wellbeing Picks"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <ComicPanel title="Your Companion">
          <TamagotchiCompanion
            companion={{ ...companion, goalProgress: (sleepScore + wellbeing + goalProgress) / 3 }}
            showControls
            chatting={chatting}
            moodOverride={mood}
            speech={speech}
            size="lg"
          />
          <div className="mt-4 space-y-3">
            <ProgressBar value={companion.happiness} label="Happiness" />
            <ProgressBar value={sleepScore} label="Sleep score (weekly)" />
            <ProgressBar value={wellbeing} label="Wellbeing index" />
            <label className="block font-mono text-[10px] uppercase">
              Log sleep
              <input type="range" min={40} max={100} value={sleepScore} onChange={(e) => setSleepScore(Number(e.target.value))} className="mt-1 w-full" />
            </label>
            <label className="block font-mono text-[10px] uppercase">
              Wellbeing streak: {wellbeingStreak}d
              <input type="range" min={0} max={30} value={wellbeingStreak} onChange={(e) => setWellbeingStreak(Number(e.target.value))} className="mt-1 w-full" />
            </label>
          </div>
        </ComicPanel>

        <ComicPanel title="Evolution">
          <div className="flex justify-between gap-1">
            {EVOLUTION_STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center">
                <div className={`flex h-12 w-12 items-center justify-center border-4 border-on-surface font-mono text-[9px] ${i <= stageIndex ? "bg-primary-container shadow-[3px_3px_0_0_#1a1c1b]" : "opacity-40"}`}>
                  {i + 1}
                </div>
                <span className="mt-1 font-mono text-[9px] uppercase">{stage}</span>
              </div>
            ))}
          </div>
        </ComicPanel>
      </div>

      <ComicPanel title="Talk To Your Companion">
        <div className="mb-4 max-h-72 space-y-3 overflow-y-auto pr-2">
          {chat.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={msg.role === "user" ? "ml-8" : "mr-8"}>
              <div className={`p-3 ${msg.role === "companion" ? "speech-bubble speech-bubble-tail-left" : "border-4 border-on-surface bg-tertiary-container"}`}>
                <p className="font-body text-sm">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Share stress, wins, or ask for goal adjustments..."
            className="flex-1 border-4 border-on-surface bg-white px-4 py-2 font-body focus:outline-none"
          />
          <ComicButton onClick={sendMessage}><Send size={16} /></ComicButton>
        </div>
        {sending && <p className="mt-2 font-mono text-xs text-outline">Companion thinking...</p>}
      </ComicPanel>
    </ToolPageLayout>
  );
}

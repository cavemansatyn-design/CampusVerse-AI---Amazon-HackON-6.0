"use client";

import { motion } from "framer-motion";
import { FaceCompanion } from "@/components/companion/FaceCompanion";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicButton, ComicPanel } from "@/components/ui/comic-panel";
import { DEMO_SCENARIOS } from "@/lib/demo-data";
import { SCENARIO_MOODS } from "@/lib/module-themes";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { useAppStore } from "@/lib/store";
import { Check, Play } from "lucide-react";
import { useRouter } from "next/navigation";

const MOOD_LABELS: Record<string, string> = {
  focused: "Focused learner",
  calm: "Calm & ready",
  excited: "High energy",
  cozy: "Cozy fresher",
  stressed: "Needs support",
  happy: "Happy",
  welcoming: "Welcoming",
};

export default function DemosPage() {
  const { scenarioId, setScenarioId } = useAppStore();
  const router = useRouter();
  const recs = useRecommendations("general");

  function launchPersona(id: string) {
    setScenarioId(id);
    router.push("/home");
  }

  return (
    <ToolPageLayout
      module="demos"
      title="Student Personas"
      subtitle="Switch between 5 student profiles — recommendations adapt to each one"
      recommendations={recs}
      recTitle="Campus Essentials"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DEMO_SCENARIOS.map((scenario, i) => {
          const active = scenarioId === scenario.id;
          const mood = SCENARIO_MOODS[scenario.id] ?? "happy";
          return (
            <motion.div key={scenario.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <ComicPanel className={`relative ${active ? "ring-4 ring-primary-container" : ""}`} tilt={i % 2 === 0 ? 0.5 : -0.5}>
                {active && (
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center border-4 border-on-surface bg-primary-container">
                    <Check size={16} />
                  </div>
                )}
                <div className="mb-3 flex justify-center">
                  <FaceCompanion mood={mood} size={100} />
                </div>
                <p className="text-center font-mono text-[10px] uppercase">{MOOD_LABELS[mood]}</p>
                <h3 className="mt-1 font-display text-2xl uppercase">{scenario.name}</h3>
                <p className="mt-2 font-body text-sm">{scenario.description}</p>
                <div className="mt-3 border-4 border-on-surface bg-tertiary-container p-2">
                  <p className="font-mono text-xs">{scenario.highlight}</p>
                </div>
                <p className="mt-2 font-mono text-xs">Student: {scenario.student_name}</p>
                <ComicButton className="mt-4 w-full" onClick={() => launchPersona(scenario.id)}>
                  <Play size={14} className="mr-2 inline" />
                  Switch To This Profile
                </ComicButton>
              </ComicPanel>
            </motion.div>
          );
        })}
      </div>
    </ToolPageLayout>
  );
}

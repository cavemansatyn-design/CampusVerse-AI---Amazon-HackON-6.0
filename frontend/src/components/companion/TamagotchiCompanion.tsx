"use client";

import { useState } from "react";
import { FaceCompanion, moodSpeech, type FaceMood } from "./FaceCompanion";
import { moodFromProgress, SCENARIO_MOODS } from "@/lib/module-themes";
import type { CompanionStats } from "./mapCompanionState";

export type { CompanionStats, FaceMood };

interface TamagotchiCompanionProps {
  companion: CompanionStats;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
  chatting?: boolean;
  className?: string;
  moodOverride?: FaceMood;
  speech?: string;
}

const SIZE_MAP = { sm: 120, md: 160, lg: 220 };

export function TamagotchiCompanion({
  companion,
  size = "md",
  showControls = false,
  chatting = false,
  className,
  moodOverride,
  speech,
}: TamagotchiCompanionProps) {
  const [petTick, setPetTick] = useState(0);
  const progress = companion.goalProgress ?? companion.happiness;
  const mood: FaceMood =
    moodOverride ??
    (chatting ? "excited" : moodFromProgress(progress, companion.streak));
  const canvasSize = SIZE_MAP[size];
  const line = speech ?? moodSpeech(mood, Math.round(progress), companion.streak);

  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      <FaceCompanion mood={mood} size={canvasSize} speech={line} />
      <div className="text-center">
        <p className="font-display text-base uppercase">{companion.name}</p>
        <p className="font-mono text-[10px] text-outline">
          {companion.evolution_stage} · Lv.{companion.level} · {companion.streak}d streak
        </p>
      </div>
      {showControls && (
        <div className="flex flex-wrap justify-center gap-2">
          {(["Pet", "Cheer", "Feed"] as const).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setPetTick((t) => t + 1)}
              className="comic-button bg-primary-container px-3 py-1 font-mono text-xs uppercase"
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {petTick > 0 && (
        <p className="font-mono text-[10px] text-tertiary">Companion happy! (+XP)</p>
      )}
    </div>
  );
}

export { SCENARIO_MOODS };

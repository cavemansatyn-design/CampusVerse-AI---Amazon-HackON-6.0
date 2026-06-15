"use client";

import { useEffect, useRef, useState } from "react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicButton, ComicPanel } from "@/components/ui/comic-panel";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { Pause, Play, RotateCcw } from "lucide-react";

const STAGES = ["Seed", "Sprout", "Growing", "Blooming", "Full Tree"];

export default function FocusPage() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recs = useRecommendations("focus");

  const totalSeconds = minutes * 60;
  const elapsed = totalSeconds - secondsLeft;
  const progress = elapsed / totalSeconds;
  const stageIndex = Math.min(4, Math.floor(progress * 5));

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function reset() {
    setRunning(false);
    setSecondsLeft(minutes * 60);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <ToolPageLayout
      module="focus"
      title="Focus Mode"
      subtitle="Your tree grows through 5 stages — preview the journey before you start"
      recommendations={recs}
      recTitle="Focus Gear (Premium First)"
    >
      <ComicPanel title="How Your Tree Grows — All 5 Stages">
        <p className="mb-4 font-body text-sm text-outline">
          Each fifth of your session unlocks the next stage. Finish the full timer to reach a full tree.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {STAGES.map((s, i) => (
            <div key={s} className="flex flex-col items-center border-4 border-on-surface bg-white/90 p-2 shadow-[3px_3px_0_0_#1a1c1b]">
              <FocusTree stage={i} />
              <p className="mt-2 text-center font-mono text-[9px] uppercase">{i + 1}. {s}</p>
              <p className="font-body text-[10px] text-outline">{Math.round(((i + 1) / 5) * 100)}%</p>
            </div>
          ))}
        </div>
      </ComicPanel>

      <ComicPanel title="Adjust Timer">
        <div className="flex flex-wrap items-center gap-4">
          {[15, 25, 45, 60].map((m) => (
            <ComicButton
              key={m}
              variant={minutes === m ? "primary" : "secondary"}
              onClick={() => {
                setMinutes(m);
                setSecondsLeft(m * 60);
                setRunning(false);
              }}
            >
              {m} min
            </ComicButton>
          ))}
          <input
            type="range"
            min={5}
            max={90}
            value={minutes}
            onChange={(e) => {
              const m = Number(e.target.value);
              setMinutes(m);
              setSecondsLeft(m * 60);
              setRunning(false);
            }}
            className="flex-1"
          />
          <span className="font-mono text-sm">{minutes} min custom</span>
        </div>
      </ComicPanel>

      <ComicPanel title="Focus Tree — Live Session">
        <div className="flex flex-col items-center py-8">
          <FocusTree stage={stageIndex} large />
          <p className="mt-4 font-display text-6xl uppercase">{mm}:{ss}</p>
          <p className="font-mono text-sm uppercase text-outline">
            Stage {stageIndex + 1}/5 — {STAGES[stageIndex]}
          </p>
          <div className="mt-6 flex gap-3">
            <ComicButton onClick={() => setRunning(!running)}>
              {running ? <Pause size={16} className="mr-2 inline" /> : <Play size={16} className="mr-2 inline" />}
              {running ? "Pause" : "Start"}
            </ComicButton>
            <ComicButton variant="secondary" onClick={reset}>
              <RotateCcw size={16} className="mr-2 inline" /> Reset
            </ComicButton>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          {STAGES.map((s, i) => (
            <div
              key={s}
              className={`flex-1 border-4 border-on-surface p-2 text-center font-mono text-[10px] uppercase ${
                i <= stageIndex ? "bg-emerald-200 shadow-[2px_2px_0_0_#1a1c1b]" : "bg-white/50 opacity-50"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </ComicPanel>
    </ToolPageLayout>
  );
}

function FocusTree({ stage, large }: { stage: number; large?: boolean }) {
  const h = large ? 280 : 100;
  const w = large ? 280 : 100;
  return (
    <svg width={w} height={h} viewBox="0 0 200 200" className={large ? "border-4 border-on-surface bg-sky-100 shadow-[6px_6px_0_0_#1a1c1b]" : ""}>
      <rect width="200" height="200" fill="#87CEEB" />
      <ellipse cx="100" cy="190" rx="40" ry="8" fill="#8B4513" opacity="0.5" />
      {stage >= 0 && <ellipse cx="100" cy="185" rx="8" ry="6" fill="#8B4513" />}
      {stage >= 1 && <path d="M100 185 Q105 160 100 140" stroke="#228B22" strokeWidth="4" fill="none" />}
      {stage >= 2 && (
        <>
          <path d="M100 185 Q95 130 100 100" stroke="#228B22" strokeWidth="5" fill="none" />
          <ellipse cx="85" cy="150" rx="12" ry="8" fill="#32CD32" />
          <ellipse cx="115" cy="145" rx="12" ry="8" fill="#32CD32" />
        </>
      )}
      {stage >= 3 && (
        <>
          <path d="M100 185 Q100 100 100 60" stroke="#228B22" strokeWidth="6" fill="none" />
          <ellipse cx="75" cy="110" rx="18" ry="12" fill="#32CD32" />
          <ellipse cx="125" cy="100" rx="18" ry="12" fill="#32CD32" />
        </>
      )}
      {stage >= 4 && (
        <>
          <circle cx="100" cy="45" r="28" fill="#228B22" />
          <circle cx="85" cy="40" r="18" fill="#32CD32" />
          <circle cx="115" cy="42" r="18" fill="#32CD32" />
          <circle cx="100" cy="30" r="15" fill="#32CD32" />
        </>
      )}
    </svg>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  FaceCompanion,
  FACE_MOODS,
  landingMoodSpeech,
  type FaceMood,
} from "@/components/companion/FaceCompanion";

const CYCLE_MS = 15000;

export function LandingCompanionDemo() {
  const [mood, setMood] = useState<FaceMood>("welcoming");
  const [speech, setSpeech] = useState(() => landingMoodSpeech("welcoming"));

  useEffect(() => {
    const step = CYCLE_MS / FACE_MOODS.length;
    let index = 0;

    const tick = () => {
      index = (index + 1) % FACE_MOODS.length;
      const next = FACE_MOODS[index];
      setMood(next);
      setSpeech(landingMoodSpeech(next));
    };

    const interval = setInterval(tick, step);
    return () => clearInterval(interval);
  }, []);

  return <FaceCompanion mood={mood} size={240} speech={speech} />;
}

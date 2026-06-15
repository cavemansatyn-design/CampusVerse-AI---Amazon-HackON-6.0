"use client";

import { useEffect, useMemo, useState } from "react";
import { getRecommendationsForModule } from "@/lib/recommendation-data";
import { useAppStore } from "@/lib/store";

export function useRecommendations(
  module: string,
  goalTitles: string[] = [],
  intelFn?: string
) {
  const scenarioId = useAppStore((s) => s.scenarioId) || "first_year";
  const [loadSalt, setLoadSalt] = useState(() => String(Math.random()));

  useEffect(() => {
    setLoadSalt(String(Math.random()));
  }, [scenarioId]);

  return useMemo(
    () => getRecommendationsForModule(module, goalTitles, scenarioId, intelFn, loadSalt),
    [module, goalTitles.join("|"), scenarioId, intelFn, loadSalt]
  );
}

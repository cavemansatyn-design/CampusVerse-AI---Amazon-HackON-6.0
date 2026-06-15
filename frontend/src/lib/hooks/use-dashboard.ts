"use client";

import { useEffect, useState } from "react";
import { getDemoDashboard, type DashboardData } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";
import { API_BASE } from "@/lib/utils";

export function useDashboard() {
  const { scenarioId } = useAppStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const studentsRes = await fetch(`${API_BASE}/students?demo_only=true&limit=10`);
        if (studentsRes.ok) {
          const students = await studentsRes.json();
          const match = students.find((s: { demo_scenario: string }) => s.demo_scenario === scenarioId);
          if (match) {
            const dashRes = await fetch(`${API_BASE}/dashboard/${match.id}`);
            if (dashRes.ok) {
              setDashboard(await dashRes.json());
              setLoading(false);
              return;
            }
          }
        }
      } catch {
        /* demo */
      }
      setDashboard(getDemoDashboard(scenarioId || "first_year"));
      setLoading(false);
    }
    load();
  }, [scenarioId]);

  return { dashboard, loading, scenarioId };
}

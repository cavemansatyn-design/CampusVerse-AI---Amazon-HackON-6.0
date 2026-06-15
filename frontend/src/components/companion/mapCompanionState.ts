/** Maps CampusVerse companion stats → Tamagotchi variant & animation (Barqawiz/Tamagotchi) */

export interface CompanionStats {
  name: string;
  creature_type: string;
  happiness: number;
  level: number;
  xp: number;
  streak: number;
  evolution_stage: string;
  goalProgress?: number;
}

export type TamagotchiVariant = "plant" | "eyes" | "cat";

export type TamagotchiAction =
  | "idle"
  | "happy"
  | "walk"
  | "dance"
  | "jump"
  | "talk"
  | "sleepy"
  | "cute"
  | "surprised"
  | "followMouse";

const EVOLUTION_GROWTH: Record<string, number> = {
  Egg: 0,
  Baby: 1,
  Explorer: 2,
  Master: 3,
  Legend: 3,
};

export function pickVariant(creatureType: string): TamagotchiVariant {
  const t = creatureType.toLowerCase();
  if (t.includes("fitness") || t.includes("hackathon") || t.includes("startup") || t.includes("career")) {
    return "cat";
  }
  if (t.includes("dsa") || t.includes("academic") || t.includes("research") || t.includes("ml")) {
    return "eyes";
  }
  return "plant";
}

/** Plant growth 0–3 from evolution + goal progress */
export function plantGrowthStage(c: CompanionStats): number {
  const stage = EVOLUTION_GROWTH[c.evolution_stage] ?? 0;
  const progress = c.goalProgress ?? 0;
  if (stage === 0 && progress > 20) return 1;
  if (progress > 60 && stage < 3) return Math.max(stage, 2);
  if (progress > 85 || c.evolution_stage === "Legend") return 3;
  return stage;
}

export function pickAction(c: CompanionStats, opts?: { chatting?: boolean; petting?: boolean }): TamagotchiAction {
  if (opts?.chatting) return "talk";
  if (opts?.petting) return "cute";
  if (c.happiness < 45) return "sleepy";
  if (c.streak >= 14 || c.evolution_stage === "Legend") return "dance";
  if (c.streak >= 7 || c.happiness > 85) return "happy";
  if (c.evolution_stage === "Explorer" || c.evolution_stage === "Master") return "walk";
  if (c.level >= 4) return "followMouse";
  return "idle";
}

export function eyesMode(c: CompanionStats, action: TamagotchiAction): string {
  if (action === "talk") return "surprised";
  if (action === "sleepy") return "sleepy";
  if (action === "happy" || action === "dance" || action === "cute") return "surprised";
  if (action === "walk" || action === "followMouse") return "followMouse";
  if (c.happiness < 50) return "bored";
  if (c.evolution_stage === "Explorer" || c.evolution_stage === "Master") return "lookAround";
  return "idle";
}

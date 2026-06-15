/** Contextual recommendations — expensive first, persona-aware, verified images */

import { imgForProduct } from "./product-images";

export type AcquisitionType = "new" | "refurbished" | "used" | "rent" | "share" | "borrow" | "bundle";

export interface RecProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  acquisition: AcquisitionType;
  reason: string;
  score: number;
}

const TIER: Record<AcquisitionType, number> = {
  new: 0,
  bundle: 1,
  refurbished: 2,
  used: 3,
  rent: 4,
  share: 5,
  borrow: 6,
};

function item(
  id: string,
  name: string,
  price: number,
  acquisition: AcquisitionType,
  reason: string,
  score: number
): RecProduct {
  return { id, name, image: imgForProduct(name), price, acquisition, reason, score };
}

const GOAL_SETS: Record<string, RecProduct[]> = {
  dsa: [
    item("d-n1", "Mechanical Keyboard", 4299, "new", "Premium typing for daily practice", 0.91),
    item("d-b1", "DSA Course Bundle", 2499, "bundle", "Book + calculator + markers — save 35%", 0.96),
    item("d-u1", "Laptop Stand", 899, "used", "Ergonomic setup on budget", 0.84),
    item("d-r1", "Study Lamp", 50, "rent", "Late-night problem sessions", 0.78),
    item("d-s1", "Whiteboard Markers", 0, "share", "Split with study group", 0.72),
    item("d-b2", "Scientific Calculator", 0, "borrow", "Free from senior nearby", 0.89),
  ],
  gym: [
    item("g-n1", "Running Shoes", 3499, "new", "Proper support for leg day", 0.93),
    item("g-b1", "Gym Starter Bundle", 1899, "bundle", "Shaker + bands + gloves + shirt — save 40%", 0.97),
    item("g-u1", "Track Pants", 799, "used", "Campus gym outfit", 0.86),
    item("g-r1", "Protein Shaker", 40, "rent", "Weekly gym cycle", 0.8),
    item("g-s1", "Resistance Bands", 0, "share", "Roommate split cost", 0.75),
    item("g-b2", "Gym Gloves", 0, "borrow", "From fitness club locker", 0.88),
  ],
  hackathon: [
    item("h-n1", "USB Hub", 1299, "new", "Multi-device build station", 0.92),
    item("h-b1", "Hackathon Kit Bundle", 1599, "bundle", "Power bank + hub + snacks — save 30%", 0.98),
    item("h-u1", "Webcam", 1499, "used", "Demo day ready", 0.85),
    item("h-r1", "Power Bank", 60, "rent", "48-hour sprint fuel", 0.88),
    item("h-s1", "Energy Snacks", 0, "share", "Team snack pool", 0.7),
    item("h-b2", "Extension Board", 0, "borrow", "Hostel block C", 0.9),
  ],
  placement: [
    item("p-n1", "Formal Blazer", 2999, "new", "Interview day sharp look", 0.94),
    item("p-b1", "Placement Prep Bundle", 2199, "bundle", "Blazer + book + mock session — save 25%", 0.97),
    item("p-u1", "System Design Book", 350, "used", "Within your budget", 0.9),
    item("p-r1", "Mock Interview Session", 200, "rent", "Peer coach slot", 0.87),
    item("p-s1", "Resume Template Pack", 0, "share", "Senior shared folder", 0.72),
    item("p-b2", "Aptitude Book", 0, "borrow", "Placement cell library", 0.85),
  ],
  research: [
    item("r-n1", "Kindle", 4999, "new", "Papers & references portable", 0.91),
    item("r-b1", "Research Kit Bundle", 3299, "bundle", "Kindle + notebook + lamp — save 20%", 0.95),
    item("r-u1", "Lab Notebook", 199, "used", "Lab-ready notes", 0.82),
    item("r-r1", "Laptop Stand", 45, "rent", "Long reading sessions", 0.76),
    item("r-s1", "Reference Papers Bundle", 0, "share", "Lab group archive", 0.7),
    item("r-b2", "Digital Pen", 0, "borrow", "AI lab equipment", 0.84),
  ],
  companion: [
    item("c-n1", "Yoga Mat", 899, "new", "Home recovery sessions", 0.88),
    item("c-b1", "Wellbeing Bundle", 649, "bundle", "Mat + sleep mask + shaker", 0.94),
    item("c-r1", "Sleep Mask", 25, "rent", "Better sleep score", 0.86),
    item("c-s1", "Resistance Bands", 0, "share", "Wellness club pool", 0.7),
    item("c-b2", "Hand Sanitizer Pack", 0, "borrow", "Hostel health kit", 0.65),
  ],
  intel: [
    item("i-n1", "Scientific Calculator", 899, "new", "ML Challenge prep", 0.9),
    item("i-b1", "Competition Prep Bundle", 1299, "bundle", "Calculator + markers + lamp", 0.93),
    item("i-u1", "Arduino Uno", 450, "used", "Robotics workshop tomorrow", 0.87),
    item("i-r1", "Study Lamp", 50, "rent", "Deadline crunch nights", 0.8),
    item("i-b2", "DSA Book", 0, "borrow", "Library reserve", 0.82),
  ],
  network: [
    item("n-n1", "Extension Board", 699, "new", "Room setup upgrade", 0.85),
    item("n-b1", "Hostel Essentials Bundle", 999, "bundle", "Board + tiffin + lamp", 0.92),
    item("n-r1", "Tiffin Box", 30, "rent", "Shared kitchen", 0.78),
    item("n-s1", "Bucket", 0, "share", "Block B split purchase", 0.7),
    item("n-b2", "Bedsheet", 0, "borrow", "Senior in Block A", 0.88),
  ],
  marketplace: [
    item("m-n1", "Backpack", 1899, "new", "Campus carry upgrade", 0.9),
    item("m-b1", "Fresher Starter Bundle", 1499, "bundle", "Backpack + bottle + lamp", 0.95),
    item("m-u1", "Water Bottle", 299, "used", "Eco-friendly pick", 0.82),
    item("m-r1", "Study Lamp", 50, "rent", "Semester rental", 0.78),
    item("m-s1", "Notebook Set", 0, "share", "Bulk buy with floor mates", 0.72),
    item("m-b2", "Scientific Calculator", 0, "borrow", "Most borrowed item", 0.91),
  ],
  focus: [
    item("f-n1", "Headphones", 2499, "new", "Deep work isolation", 0.93),
    item("f-b1", "Focus Flow Bundle", 1799, "bundle", "Headphones + timer + lamp", 0.96),
    item("f-u1", "Pomodoro Timer", 399, "used", "Analog focus cue", 0.8),
    item("f-r1", "Laptop Stand", 40, "rent", "Ergonomic sessions", 0.76),
    item("f-b2", "Webcam Cover", 0, "borrow", "Distraction-free hack", 0.68),
  ],
  general: [
    item("x-n1", "Notebook Set", 399, "new", "Fresh semester stock", 0.8),
    item("x-b1", "Study Starter Bundle", 899, "bundle", "Notebook + lamp + bottle", 0.88),
    item("x-r1", "Study Lamp", 50, "rent", "Night owl sessions", 0.75),
    item("x-s1", "Extension Board", 0, "share", "Roommate split", 0.7),
    item("x-b2", "Scientific Calculator", 0, "borrow", "Campus library", 0.85),
  ],
};

const SCENARIO_BIAS: Record<string, string> = {
  first_year: "dsa",
  placement: "placement",
  hackathon: "hackathon",
  hostel_fresher: "gym",
  research: "research",
};

function matchGoal(goalTitle: string): string {
  const t = goalTitle.toLowerCase();
  if (t.includes("gym") || t.includes("fitness") || t.includes("skinny")) return "gym";
  if (t.includes("dsa") || t.includes("cgpa") || t.includes("learn dsa")) return "dsa";
  if (t.includes("hackathon")) return "hackathon";
  if (t.includes("intern") || t.includes("portfolio") || t.includes("placement")) return "placement";
  if (t.includes("ml") || t.includes("research")) return "research";
  return "general";
}

function dedupeRecs(items: RecProduct[]): RecProduct[] {
  const seen = new Set<string>();
  const out: RecProduct[] = [];
  for (const item of items) {
    const key = item.name.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function sortRecs(items: RecProduct[]): RecProduct[] {
  return [...items].sort((a, b) => {
    const ta = TIER[a.acquisition];
    const tb = TIER[b.acquisition];
    if (ta !== tb) return ta - tb;
    return b.price - a.price;
  });
}

function hashSeed(...parts: string[]): number {
  return parts.join("|").split("").reduce((s, c) => s + c.charCodeAt(0), 0);
}

function shufflePersona(items: RecProduct[], scenarioId: string, salt = ""): RecProduct[] {
  const seed = (scenarioId + salt).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return [...items].sort((a, b) => {
    const ha = (seed + a.id.charCodeAt(0)) % 7;
    const hb = (seed + b.id.charCodeAt(0)) % 7;
    if (TIER[a.acquisition] === TIER[b.acquisition]) return ha - hb;
    return 0;
  });
}

function finalizeRecs(
  pool: RecProduct[],
  scenarioId: string,
  salt: string,
  limit = 6
): RecProduct[] {
  const deduped = dedupeRecs(sortRecs(pool));
  const shuffled = shufflePersona(deduped, scenarioId, salt);
  if (shuffled.length <= limit) return shuffled;
  const offset = hashSeed(scenarioId, salt) % (shuffled.length - limit + 1);
  return shuffled.slice(offset, offset + limit);
}

export function getRecommendationsForGoal(goalTitle: string, scenarioId = "first_year"): RecProduct[] {
  const key = matchGoal(goalTitle);
  const items = GOAL_SETS[key] || GOAL_SETS.general;
  return finalizeRecs(items, scenarioId, `goal:${goalTitle}`);
}

export function getRecommendationsForModule(
  module: string,
  goalTitles: string[] = [],
  scenarioId = "first_year",
  intelFn?: string,
  sessionSalt = "ssr"
): RecProduct[] {
  const bias = SCENARIO_BIAS[scenarioId] || "general";
  const salt = `${sessionSalt}:${module}:${intelFn ?? ""}`;
  let pool: RecProduct[];

  if (module === "goals" && goalTitles[0]) {
    return getRecommendationsForGoal(goalTitles[0], scenarioId);
  }

  if (module === "intel" && intelFn) {
    const base = GOAL_SETS.intel;
    const fnBoost = intelFn.toLowerCase().includes("deadline")
      ? base.filter((i) => i.name.includes("Calculator") || i.name.includes("Lamp"))
      : intelFn.toLowerCase().includes("opportunity")
        ? base.filter((i) => i.acquisition === "new" || i.acquisition === "bundle")
        : base;
    pool = fnBoost.length ? fnBoost : base;
  } else {
    const parts: RecProduct[] = [];
    if (GOAL_SETS[module]) parts.push(...GOAL_SETS[module]);
    if (bias !== module && GOAL_SETS[bias]) parts.push(...GOAL_SETS[bias]);
    for (const title of goalTitles.slice(0, 2)) {
      const key = matchGoal(title);
      if (GOAL_SETS[key]) parts.push(...GOAL_SETS[key]);
    }
    pool = parts.length ? parts : GOAL_SETS.general;
  }

  return finalizeRecs(pool, scenarioId, salt);
}

export const ACQUISITION_LADDER = "Buy New → Bundle Deal → Refurbished → Used → Rent → Share → Borrow Free";

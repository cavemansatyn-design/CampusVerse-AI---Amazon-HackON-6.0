/** Per-module comic-book colour themes + uploaded background art */
export type ModuleId =
  | "home"
  | "companion"
  | "goals"
  | "planner"
  | "focus"
  | "intelligence"
  | "network"
  | "marketplace"
  | "demos"
  | "landing"
  | "login";

export interface ModuleTheme {
  id: ModuleId;
  label: string;
  bg: string;
  bgImage: string;
  bgOverlay: string;
  bgPattern: string;
  bgHue: number;
  bgSaturation: number;
  bgOpacity: number;
  accent: string;
  accentLight: string;
  button: string;
  buttonHover: string;
  panel: string;
  description: string;
}

const BURST = "/bg/comic-burst-yellow.png";
const PANELS = "/bg/comic-panels-bw.png";
const EXPLOSION = "/bg/comic-explosion.png";
const CYBER = "/bg/comic-cyber.png";
const HERO = "/bg/comic-hero.png";

export const MODULE_THEMES: Record<ModuleId, ModuleTheme> = {
  landing: {
    id: "landing",
    label: "CampusVerse AI",
    bg: "linear-gradient(135deg, #fff9e6 0%, #ffe566 40%, #ffd700 100%)",
    bgImage: BURST,
    bgOverlay: "linear-gradient(135deg, rgba(255,249,230,0.38) 0%, rgba(255,215,0,0.28) 50%, rgba(112,93,0,0.1) 100%)",
    bgPattern: "radial-gradient(circle, #705d00 1px, transparent 1px)",
    bgHue: 0,
    bgSaturation: 1.35,
    bgOpacity: 0.62,
    accent: "#705d00",
    accentLight: "#ffd700",
    button: "bg-primary-container hover:bg-yellow-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Welcome — total yellow comic burst",
  },
  login: {
    id: "login",
    label: "Sign In",
    bg: "linear-gradient(160deg, #fff9e6 0%, #ffd700 100%)",
    bgImage: BURST,
    bgOverlay: "linear-gradient(160deg, rgba(255,249,230,0.4) 0%, rgba(255,215,0,0.3) 100%)",
    bgPattern: "radial-gradient(circle, #705d00 1px, transparent 1px)",
    bgHue: 8,
    bgSaturation: 1.3,
    bgOpacity: 0.58,
    accent: "#705d00",
    accentLight: "#ffd700",
    button: "bg-primary-container hover:bg-yellow-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Login portal",
  },
  home: {
    id: "home",
    label: "Command Center",
    bg: "linear-gradient(135deg, #fff9e6 0%, #ffe566 40%, #ffd700 100%)",
    bgImage: BURST,
    bgOverlay: "linear-gradient(135deg, rgba(255,249,230,0.4) 0%, rgba(255,215,0,0.3) 100%)",
    bgPattern: "radial-gradient(circle, #705d00 1px, transparent 1px)",
    bgHue: 0,
    bgSaturation: 1.32,
    bgOpacity: 0.58,
    accent: "#705d00",
    accentLight: "#ffd700",
    button: "bg-primary-container hover:bg-yellow-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Your daily HQ — goals, streaks & super companion",
  },
  companion: {
    id: "companion",
    label: "Companion",
    bg: "linear-gradient(160deg, #fce4ff 0%, #e8d4ff 50%, #c9b8ff 100%)",
    bgImage: HERO,
    bgOverlay: "linear-gradient(160deg, rgba(252,228,255,0.42) 0%, rgba(107,33,168,0.14) 100%)",
    bgPattern: "radial-gradient(circle, #6b21a8 1px, transparent 1px)",
    bgHue: 285,
    bgSaturation: 1.05,
    bgOpacity: 0.52,
    accent: "#6b21a8",
    accentLight: "#e9d5ff",
    button: "bg-purple-200 hover:bg-purple-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Sleep, wellbeing & emotional support",
  },
  goals: {
    id: "goals",
    label: "Goal Engine",
    bg: "linear-gradient(160deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)",
    bgImage: EXPLOSION,
    bgOverlay: "linear-gradient(160deg, rgba(220,252,231,0.42) 0%, rgba(22,101,52,0.12) 100%)",
    bgPattern: "radial-gradient(circle, #166534 1px, transparent 1px)",
    bgHue: 95,
    bgSaturation: 1.1,
    bgOpacity: 0.54,
    accent: "#166534",
    accentLight: "#bbf7d0",
    button: "bg-green-200 hover:bg-green-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "AI roadmaps, weekly & daily plans",
  },
  planner: {
    id: "planner",
    label: "Smart Planner",
    bg: "linear-gradient(160deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
    bgImage: HERO,
    bgOverlay: "linear-gradient(160deg, rgba(219,234,254,0.42) 0%, rgba(30,64,175,0.14) 100%)",
    bgPattern: "radial-gradient(circle, #1e40af 1px, transparent 1px)",
    bgHue: 200,
    bgSaturation: 1,
    bgOpacity: 0.5,
    accent: "#1e40af",
    accentLight: "#bfdbfe",
    button: "bg-blue-200 hover:bg-blue-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Schedule optimized by AI",
  },
  focus: {
    id: "focus",
    label: "Focus Mode",
    bg: "linear-gradient(160deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)",
    bgImage: CYBER,
    bgOverlay: "linear-gradient(160deg, rgba(236,253,245,0.42) 0%, rgba(4,120,87,0.14) 100%)",
    bgPattern: "radial-gradient(circle, #047857 1px, transparent 1px)",
    bgHue: 130,
    bgSaturation: 1,
    bgOpacity: 0.52,
    accent: "#047857",
    accentLight: "#a7f3d0",
    button: "bg-emerald-200 hover:bg-emerald-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Grow your focus tree stage by stage",
  },
  intelligence: {
    id: "intelligence",
    label: "Intel Hub",
    bg: "linear-gradient(160deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
    bgImage: PANELS,
    bgOverlay: "linear-gradient(160deg, rgba(255,247,237,0.72) 0%, rgba(255,237,213,0.58) 50%, rgba(194,65,12,0.08) 100%)",
    bgPattern: "radial-gradient(circle, #c2410c 1px, transparent 1px)",
    bgHue: 28,
    bgSaturation: 0.65,
    bgOpacity: 0.42,
    accent: "#c2410c",
    accentLight: "#fed7aa",
    button: "bg-orange-200 hover:bg-orange-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Gmail, WhatsApp & campus signals",
  },
  network: {
    id: "network",
    label: "Network",
    bg: "linear-gradient(160deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)",
    bgImage: CYBER,
    bgOverlay: "linear-gradient(160deg, rgba(224,231,255,0.42) 0%, rgba(55,48,163,0.14) 100%)",
    bgPattern: "radial-gradient(circle, #3730a3 1px, transparent 1px)",
    bgHue: 245,
    bgSaturation: 1.05,
    bgOpacity: 0.52,
    accent: "#3730a3",
    accentLight: "#c7d2fe",
    button: "bg-indigo-200 hover:bg-indigo-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Friends, debt ledger & sharing",
  },
  marketplace: {
    id: "marketplace",
    label: "Marketplace Engine",
    bg: "linear-gradient(160deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)",
    bgImage: EXPLOSION,
    bgOverlay: "linear-gradient(160deg, rgba(252,231,243,0.42) 0%, rgba(190,24,93,0.14) 100%)",
    bgPattern: "radial-gradient(circle, #be185d 1px, transparent 1px)",
    bgHue: 315,
    bgSaturation: 1.08,
    bgOpacity: 0.52,
    accent: "#be185d",
    accentLight: "#fbcfe8",
    button: "bg-pink-200 hover:bg-pink-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Borrow, rent, bundle & wishlist",
  },
  demos: {
    id: "demos",
    label: "Personas",
    bg: "linear-gradient(160deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)",
    bgImage: PANELS,
    bgOverlay: "linear-gradient(160deg, rgba(243,244,246,0.45) 0%, rgba(55,65,81,0.1) 100%)",
    bgPattern: "radial-gradient(circle, #374151 1px, transparent 1px)",
    bgHue: 0,
    bgSaturation: 0.65,
    bgOpacity: 0.5,
    accent: "#374151",
    accentLight: "#e5e7eb",
    button: "bg-gray-200 hover:bg-gray-300",
    buttonHover: "",
    panel: "bg-white/94",
    description: "Switch between 5 demo personas",
  },
};

export const SCENARIO_MOODS: Record<string, "happy" | "focused" | "excited" | "cozy" | "calm" | "stressed"> = {
  first_year: "focused",
  placement: "calm",
  hackathon: "excited",
  hostel_fresher: "cozy",
  research: "focused",
};

export function moodFromProgress(progress: number, streak: number): "happy" | "focused" | "excited" | "cozy" | "calm" | "stressed" {
  if (streak >= 14) return "excited";
  if (progress >= 70) return "happy";
  if (progress < 25) return "stressed";
  if (progress >= 45) return "focused";
  return "cozy";
}

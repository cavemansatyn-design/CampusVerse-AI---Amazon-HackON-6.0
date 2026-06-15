"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LandingCompanionDemo } from "@/components/companion/LandingCompanionDemo";
import { ComicPageShell } from "@/components/layout/comic-page-shell";
import { ComicButton } from "@/components/ui/comic-panel";
import { MODULE_THEMES } from "@/lib/module-themes";
import {
  Brain, Calendar, Home, Network, ShoppingBag, Sparkles, Target, Timer, ArrowRight,
} from "lucide-react";

const TOOLS = [
  { href: "/home", label: "Command Center", module: "home" as const, icon: Home, desc: "Streaks, goals & super companion" },
  { href: "/companion", label: "Companion", module: "companion" as const, icon: Sparkles, desc: "Sleep, wellbeing & chat" },
  { href: "/goals", label: "Goal Engine", module: "goals" as const, icon: Target, desc: "AI plans — weekly & daily" },
  { href: "/planner", label: "Smart Planner", module: "planner" as const, icon: Calendar, desc: "Optimized schedule" },
  { href: "/focus", label: "Focus Mode", module: "focus" as const, icon: Timer, desc: "Grow your focus tree" },
  { href: "/intelligence", label: "Intel Hub", module: "intelligence" as const, icon: Brain, desc: "Gmail, WhatsApp & alerts" },
  { href: "/network", label: "Network", module: "network" as const, icon: Network, desc: "Friends, debt & sharing" },
  { href: "/marketplace", label: "Marketplace", module: "marketplace" as const, icon: ShoppingBag, desc: "Borrow, lend & bundles" },
];

export default function LandingPage() {
  const theme = MODULE_THEMES.landing;

  return (
    <ComicPageShell theme={theme} fullBleed>
      <div className="caution-bar relative" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
        <Link href="/" className="font-display text-3xl uppercase drop-shadow-[2px_2px_0_#fff]">
          <span className="text-on-surface">Campus</span>
          <span className="text-on-surface">Verse</span>
          <span className="ml-1 text-[#705d00]">AI</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/login"><ComicButton variant="secondary"><span>Sign In</span></ComicButton></Link>
          <Link href="/home">
            <ComicButton><span>Enter App <ArrowRight size={14} className="ml-1 inline" /></span></ComicButton>
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-8 py-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface">Student Life Operating System</p>
          <h1 className="mt-2 font-display text-6xl uppercase leading-none text-on-surface drop-shadow-[3px_3px_0_#fff] md:text-7xl">
            CampusVerse AI
          </h1>
          <p className="mt-2 font-display text-2xl uppercase text-on-surface/80">The AI OS For Student Life</p>
          <p className="mt-6 max-w-lg font-body text-lg text-on-surface/90">
            Goals, companions, intel, network & marketplace — smart picks on every screen, cheapest options last.
          </p>
          <Link href="/login" className="mt-8 inline-block">
            <ComicButton variant="tertiary"><span>Get Started</span></ComicButton>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
          <LandingCompanionDemo />
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-6xl px-8 pb-16">
        <h2 className="mb-6 font-display text-3xl uppercase text-on-surface drop-shadow-[2px_2px_0_#fff]">Your Campus Toolkit</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool, i) => {
            const toolTheme = MODULE_THEMES[tool.module];
            return (
              <motion.div key={tool.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={tool.href}
                  className="comic-panel comic-panel-hover comic-tool-card block h-full p-5"
                  style={{
                    "--comic-bg-image": `url(${toolTheme.bgImage})`,
                    "--comic-bg-hue": `${toolTheme.bgHue}deg`,
                    "--comic-bg-sat": toolTheme.bgSaturation,
                  } as React.CSSProperties}
                >
                  <div
                    className="mb-3 inline-flex border-4 border-on-surface p-3 shadow-[3px_3px_0_0_#1a1c1b]"
                    style={{ backgroundColor: toolTheme.accentLight }}
                  >
                    <tool.icon size={24} style={{ color: toolTheme.accent }} />
                  </div>
                  <h3 className="font-display text-lg uppercase" style={{ color: toolTheme.accent }}>{tool.label}</h3>
                  <p className="mt-1 font-body text-sm text-outline">{tool.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </ComicPageShell>
  );
}

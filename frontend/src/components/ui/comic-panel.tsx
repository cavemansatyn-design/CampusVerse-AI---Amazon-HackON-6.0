"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ComicPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  tilt?: number;
  title?: string;
}

export function ComicPanel({ children, className, hover = true, tilt, title }: ComicPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "comic-panel p-6",
        hover && "comic-panel-hover",
        className
      )}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {title && (
        <div className="mb-4 border-b-4 border-on-surface pb-2">
          <h2 className="font-display text-xl uppercase tracking-wide text-on-surface">{title}</h2>
        </div>
      )}
      {children}
    </motion.div>
  );
}

interface ComicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
  type?: "button" | "submit";
}

export function ComicButton({ children, onClick, variant = "primary", className, type = "button" }: ComicButtonProps) {
  const variants = {
    primary: "bg-primary-container text-on-surface hover:bg-primary-fixed",
    secondary: "bg-white/95 text-on-surface",
    tertiary: "bg-tertiary-container text-tertiary",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn("comic-button px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider", variants[variant], className)}
    >
      <span className="relative z-[1] inline-flex items-center justify-center gap-1">{children}</span>
    </button>
  );
}

export function ComicBadge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "alert" | "success" }) {
  const variants = {
    default: "bg-on-surface text-white",
    alert: "bg-primary-container text-on-surface border-2 border-on-surface",
    success: "bg-tertiary-container text-tertiary border-2 border-on-surface",
  };
  return (
    <span className={cn("inline-block px-2 py-1 font-mono text-xs font-bold uppercase", variants[variant])}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {label && <div className="mb-1 flex justify-between font-mono text-xs"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <div className="h-4 border-4 border-on-surface bg-white">
        <div className="progress-segment h-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatCard({ label, value, unit = "" }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="border-4 border-on-surface bg-white p-4 text-center shadow-[4px_4px_0_0_#1a1c1b]">
      <div className="font-mono text-xs uppercase text-outline">{label}</div>
      <div className="font-display text-3xl text-on-surface">{value}{unit}</div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  Brain, Calendar, Home, LogOut, Network, ShoppingBag, Sparkles, Target, Timer, Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/companion", label: "Companion", icon: Sparkles },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/planner", label: "Planner", icon: Calendar },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/intelligence", label: "Intel Hub", icon: Brain },
  { href: "/network", label: "Network", icon: Network },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/demos", label: "Personas", icon: Zap },
];

const PUBLIC_ROUTES = ["/", "/login"];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppStore();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r-4 border-on-surface bg-surface-container-low">
      <div className="caution-bar" />
      <div className="p-6">
        <Link href="/" className="block">
          <h1 className="font-display text-2xl uppercase leading-none text-on-surface">
            Campus<span className="text-primary">Verse</span> AI
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-outline">AI Operating System</p>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/home" && pathname === "/dashboard");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "mb-1 flex items-center gap-3 border-l-4 px-4 py-3 font-mono text-sm uppercase transition-all",
                active
                  ? "border-primary-container bg-white shadow-[4px_4px_0_0_#1a1c1b] font-bold"
                  : "border-transparent hover:border-outline hover:bg-white/50"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="halftone-bg space-y-2 p-4">
        <div className="border-4 border-on-surface bg-primary-container p-3">
          <p className="font-mono text-[10px] uppercase">Powered by Groq AI</p>
          <p className="font-body text-xs">Smart campus recommendations</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="comic-button flex w-full items-center justify-center gap-2 bg-white px-3 py-2 font-mono text-xs uppercase"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (isPublic) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}

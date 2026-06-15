"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaceCompanion } from "@/components/companion/FaceCompanion";
import { ComicPageShell } from "@/components/layout/comic-page-shell";
import { ComicButton } from "@/components/ui/comic-panel";
import { MODULE_THEMES } from "@/lib/module-themes";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const theme = MODULE_THEMES.login;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(user, pass)) {
      router.push("/home");
    } else {
      setError("Invalid credentials. Please check your student ID and password.");
    }
  }

  return (
    <ComicPageShell theme={theme} fullBleed className="flex items-center justify-center">
      <div className="caution-bar absolute left-0 right-0 top-0" />
      <div className="comic-panel relative mx-4 w-full max-w-md p-8">
        <Link href="/" className="font-display text-2xl uppercase text-on-surface">
          Campus<span className="text-primary">Verse</span> AI
        </Link>
        <p className="mt-1 font-mono text-[10px] uppercase text-outline">Sign in to your campus OS</p>

        <div className="my-6 flex justify-center">
          <FaceCompanion mood="happy" size={140} speech="Welcome back! Ready to grow today?" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs uppercase">Student ID</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Your student ID"
              className="mt-1 w-full border-4 border-on-surface bg-white/90 px-4 py-2 font-body focus:border-tertiary focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase">Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••"
              className="mt-1 w-full border-4 border-on-surface bg-white/90 px-4 py-2 font-body focus:border-tertiary focus:outline-none"
            />
          </div>
          {error && <p className="font-body text-sm text-red-700">{error}</p>}
          <ComicButton type="submit" className="w-full bg-primary-container">
            <span>Sign In</span>
          </ComicButton>
        </form>

        <p className="mt-4 text-center font-body text-sm text-outline">
          New here? <Link href="/" className="text-tertiary underline">Back to home</Link>
        </p>
      </div>
    </ComicPageShell>
  );
}

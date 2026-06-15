"use client";

/**
 * CampusVerse companion — port of Barqawiz/Tamagotchi-main
 * (resource/eyes.js + resource/notion.js) on yellow circle face
 */
import { useEffect, useRef } from "react";

export type FaceMood = "happy" | "focused" | "excited" | "cozy" | "calm" | "stressed" | "welcoming";

export const FACE_MOODS: FaceMood[] = [
  "welcoming",
  "happy",
  "focused",
  "excited",
  "cozy",
  "calm",
  "stressed",
];

interface FaceCompanionProps {
  mood?: FaceMood;
  size?: number;
  speech?: string;
  className?: string;
  showSpeech?: boolean;
}

type FaceAction =
  | "idle"
  | "thinking"
  | "surprised"
  | "sleepy"
  | "bored"
  | "uncertain"
  | "confident"
  | "excited"
  | "satisfaction"
  | "curious";

function moodToAction(mood: FaceMood): FaceAction {
  switch (mood) {
    case "excited":
      return "excited";
    case "happy":
      return "satisfaction";
    case "welcoming":
      return "curious";
    case "focused":
      return "thinking";
    case "calm":
      return "confident";
    case "cozy":
      return "sleepy";
    case "stressed":
      return "uncertain";
    default:
      return "idle";
  }
}

export function FaceCompanion({
  mood = "welcoming",
  size = 200,
  speech,
  className,
  showSpeech = true,
}: FaceCompanionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blinkRef = useRef({
    isBlinking: false,
    blinkProgress: 0,
    blinkPause: 90,
    frame: 0,
    thinkOffset: 0,
    thinkDir: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const action = moodToAction(mood);
    let raf: number;

    const drawCurvedEyebrow = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      lw: number
    ) => {
      ctx.strokeStyle = "#1a1c1b";
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo((startX + endX) / 2, endY - 4, endX, endY);
      ctx.stroke();
    };

    const drawBrows = (cx: number, browY: number, spread: number, r: number) => {
      const lw = Math.max(2.5, r * 0.055);
      const b = blinkRef.current;
      const wave = action === "thinking" ? Math.sin(b.frame * 0.08) * r * 0.06 : 0;

      if (action === "thinking") {
        drawCurvedEyebrow(cx - spread - r * 0.12, browY + wave, cx - spread + r * 0.12, browY - r * 0.14, lw);
        drawCurvedEyebrow(cx + spread - r * 0.12, browY - wave, cx + spread + r * 0.12, browY - r * 0.14, lw);
      } else if (action === "curious") {
        drawCurvedEyebrow(cx - spread - r * 0.1, browY - r * 0.06, cx - spread + r * 0.15, browY - r * 0.16, lw);
        drawCurvedEyebrow(cx + spread - r * 0.15, browY + r * 0.04, cx + spread + r * 0.1, browY + r * 0.02, lw);
      } else if (action === "surprised" || action === "excited") {
        drawCurvedEyebrow(cx - spread - r * 0.1, browY - r * 0.14, cx - spread + r * 0.1, browY - r * 0.2, lw);
        drawCurvedEyebrow(cx + spread - r * 0.1, browY - r * 0.14, cx + spread + r * 0.1, browY - r * 0.2, lw);
      } else if (action === "uncertain" || action === "sleepy" || action === "bored") {
        drawCurvedEyebrow(cx - spread - r * 0.1, browY + r * 0.04, cx - spread + r * 0.1, browY + r * 0.08, lw);
        drawCurvedEyebrow(cx + spread - r * 0.1, browY + r * 0.04, cx + spread + r * 0.1, browY + r * 0.08, lw);
      } else if (action === "confident" || action === "satisfaction") {
        drawCurvedEyebrow(cx - spread - r * 0.1, browY - r * 0.08, cx - spread + r * 0.12, browY - r * 0.14, lw);
        drawCurvedEyebrow(cx + spread - r * 0.12, browY - r * 0.08, cx + spread + r * 0.1, browY - r * 0.14, lw);
      } else {
        drawCurvedEyebrow(cx - spread - r * 0.1, browY, cx - spread + r * 0.12, browY - r * 0.06, lw);
        drawCurvedEyebrow(cx + spread - r * 0.12, browY, cx + spread + r * 0.1, browY - r * 0.06, lw);
      }
    };

    const drawEye = (centerX: number, centerY: number, eyeR: number, eyelidClose: number) => {
      const surprised = action === "excited" || action === "surprised";
      const er = surprised ? eyeR * 1.15 : eyeR;

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#1a1c1b";
      ctx.lineWidth = Math.max(2, er * 0.12);
      ctx.beginPath();
      ctx.arc(centerX, centerY, er, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (action === "sleepy" || action === "bored") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, er, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#ffd700";
        const lidY = action === "sleepy" ? centerY + er * 0.35 : centerY + er * 0.2;
        ctx.beginPath();
        ctx.moveTo(centerX - er, lidY);
        ctx.quadraticCurveTo(centerX, centerY + er * 0.55, centerX + er, lidY);
        ctx.lineTo(centerX + er, centerY + er);
        ctx.lineTo(centerX - er, centerY + er);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#1a1c1b";
        ctx.stroke();
        ctx.restore();
        return;
      }

      if (eyelidClose < 0.85) {
        const pr = er * 0.42;
        ctx.fillStyle = "#1a1c1b";
        ctx.beginPath();
        ctx.arc(centerX, centerY + eyelidClose * 1.5, pr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(centerX - pr * 0.35, centerY - pr * 0.25 + eyelidClose, pr * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }

      if (eyelidClose > 0.05) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, er, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(centerX - er, centerY - er, er * 2, er * eyelidClose * 1.8);
        ctx.strokeStyle = "#1a1c1b";
        ctx.lineWidth = Math.max(2, er * 0.1);
        ctx.beginPath();
        ctx.moveTo(centerX - er, centerY - er + er * eyelidClose * 1.6);
        ctx.lineTo(centerX + er, centerY - er + er * eyelidClose * 1.6);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawMouth = (cx: number, mouthY: number, r: number) => {
      ctx.strokeStyle = "#1a1c1b";
      ctx.lineWidth = Math.max(2.5, r * 0.055);
      ctx.lineCap = "round";
      ctx.beginPath();

      if (action === "satisfaction" || action === "excited") {
        ctx.arc(cx, mouthY - r * 0.05, r * 0.22, 0.15 * Math.PI, 0.85 * Math.PI);
      } else if (action === "uncertain" || action === "sleepy") {
        ctx.arc(cx, mouthY + r * 0.04, r * 0.18, Math.PI, 0);
      } else if (action === "surprised") {
        ctx.arc(cx, mouthY, r * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1c1b";
        ctx.fill();
      } else if (action === "confident" || action === "thinking") {
        ctx.moveTo(cx - r * 0.12, mouthY);
        ctx.lineTo(cx + r * 0.12, mouthY);
      } else if (action === "curious") {
        ctx.arc(cx, mouthY + r * 0.02, r * 0.1, 0.1 * Math.PI, 0.9 * Math.PI);
      } else {
        ctx.arc(cx, mouthY, r * 0.14, 0.05 * Math.PI, 0.95 * Math.PI);
      }
      ctx.stroke();
    };

    const draw = () => {
      blinkRef.current.frame++;
      const blink = blinkRef.current;

      if (!blink.isBlinking) {
        blink.blinkPause--;
        if (blink.blinkPause <= 0) {
          blink.isBlinking = true;
          blink.blinkProgress = 0;
        }
      } else {
        blink.blinkProgress += 0.14;
        if (blink.blinkProgress >= 2) {
          blink.isBlinking = false;
          blink.blinkProgress = 0;
          blink.blinkPause = 90 + Math.floor(Math.random() * 70);
        }
      }

      const eyelidClose = blink.isBlinking
        ? blink.blinkProgress <= 1
          ? blink.blinkProgress
          : 2 - blink.blinkProgress
        : 0;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff9e6";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const bounce = mood === "excited" ? Math.sin(blink.frame * 0.07) * 3 : 0;
      const cy = h / 2 + 4 + bounce;
      const faceR = size * 0.38;

      ctx.fillStyle = "#ffd700";
      ctx.strokeStyle = "#1a1c1b";
      ctx.lineWidth = Math.max(3, size * 0.018);
      ctx.beginPath();
      ctx.arc(cx, cy, faceR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 120, 150, 0.38)";
      ctx.beginPath();
      ctx.ellipse(cx - faceR * 0.42, cy + faceR * 0.12, faceR * 0.13, faceR * 0.07, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + faceR * 0.42, cy + faceR * 0.12, faceR * 0.13, faceR * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();

      const eyeSpread = faceR * 0.36;
      const eyeY = cy - faceR * 0.04;
      const eyeR = faceR * 0.17;
      drawBrows(cx, cy - faceR * 0.34, eyeSpread, faceR);
      drawEye(cx - eyeSpread, eyeY, eyeR, eyelidClose);
      drawEye(cx + eyeSpread, eyeY, eyeR, eyelidClose);
      drawMouth(cx, cy + faceR * 0.28, faceR);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [mood, size]);

  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border-4 border-on-surface bg-[#fff9e6] shadow-[5px_5px_0_0_#1a1c1b]"
        aria-label="CampusVerse Tamagotchi companion"
      />
      {showSpeech && speech && (
        <div className="mt-3 w-full" style={{ maxWidth: Math.min(size * 1.5, 280) }}>
          <div className="speech-bubble speech-bubble-tail-up mx-auto bg-white text-center">
            <p className="font-body text-xs leading-relaxed">{speech}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function landingMoodSpeech(mood: FaceMood): string {
  const lines: Record<FaceMood, string> = {
    welcoming: "Hi! I'm your campus companion — watch my moods!",
    happy: "On a roll? I mirror your good energy.",
    focused: "Deep work mode — eyes on the prize.",
    excited: "Streak unlocked! Let's go!",
    cozy: "Small steps count. I'm here with you.",
    calm: "Steady breaths — we've got time.",
    stressed: "Rough patch? I'll help adjust the plan.",
  };
  return lines[mood];
}

export function moodSpeech(mood: FaceMood, progress: number, streak: number): string {
  if (mood === "stressed") return `${progress}% done — breathe, we adjust the plan together.`;
  if (mood === "excited") return `${streak}-day streak! You're crushing it at ${progress}%!`;
  if (mood === "happy") return `${progress}% complete — keep this energy going!`;
  if (mood === "focused") return `${progress}% — stay locked in, one block at a time.`;
  if (mood === "cozy") return `${progress}% — small steps count. I'm here with you.`;
  if (mood === "welcoming") return `Hi! Let's crush your goals together — ${progress}% so far!`;
  return `${progress}% progress — calm and steady wins.`;
}

/** Alias for Tamagotchi-main naming */
export const TamagotchiFace = FaceCompanion;

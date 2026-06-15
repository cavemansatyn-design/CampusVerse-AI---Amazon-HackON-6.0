"use client";

/** Port of Barqawiz/Tamagotchi plant.js — growth tied to companion progress */
import { useCallback, useEffect, useRef } from "react";

interface PlantCompanionProps {
  growthStage: number;
  action: string;
  happiness: number;
  className?: string;
}

export function PlantCompanion({ growthStage, action, happiness, className }: PlantCompanionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const heartRef = useRef<{ y: number; active: boolean }>({ y: 0, active: false });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = happiness < 45 ? "#1a1a3d" : "#87CEEB";
      ctx.fillRect(0, 0, w, h);

      if (happiness >= 45) {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(50, 50, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(w / 2, h);
      ctx.rotate(Math.sin(angleRef.current) * 0.05);

      const stage = Math.min(3, Math.max(0, growthStage));

      if (stage >= 0) {
        ctx.fillStyle = "#8B4513";
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (stage >= 1) {
        drawStem(ctx, 1);
        drawLeaves(ctx, 1);
      }
      if (stage >= 2) {
        drawStem(ctx, 2);
        drawLeaves(ctx, 2);
      }
      if (stage >= 3) {
        drawStem(ctx, 3);
        drawLeaves(ctx, 3);
        drawFlower(ctx);
      }
      ctx.restore();

      if (action === "cute" && heartRef.current.active) {
        ctx.save();
        ctx.translate(w / 2, heartRef.current.y);
        ctx.fillStyle = "#ff69b4";
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.bezierCurveTo(-25, -35, -50, 0, 0, 30);
        ctx.bezierCurveTo(50, 0, 25, -35, 0, -10);
        ctx.fill();
        ctx.restore();
      }

      if (action === "talk") {
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#1a1c1b";
        ctx.lineWidth = 3;
        ctx.fillRect(w / 2 - 70, 40, 140, 44);
        ctx.strokeRect(w / 2 - 70, 40, 140, 44);
        ctx.fillStyle = "#1a1c1b";
        ctx.font = "14px Hanken Grotesk, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Growing with you!", w / 2, 68);
      }

      if (action === "sleepy") {
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.fillText("Z", w / 2 + 30, h - 120);
      }
    },
    [growthStage, action, happiness]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;

    const loop = () => {
      angleRef.current += 0.02;
      if (heartRef.current.active) {
        heartRef.current.y -= 2;
        if (heartRef.current.y < 50) heartRef.current.active = false;
      }
      draw(ctx, canvas.width, canvas.height);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    if (action === "cute") {
      heartRef.current = { y: canvasRef.current ? canvasRef.current.height / 2 : 200, active: true };
    }
  }, [action]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className={`cursor-pointer border-4 border-on-surface bg-surface-container-low shadow-[4px_4px_0_0_#1a1c1b] ${className ?? ""}`}
      onClick={() => {
        heartRef.current = { y: 160, active: true };
      }}
    />
  );
}

function drawStem(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.strokeStyle = "#228B22";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  if (stage === 1) ctx.bezierCurveTo(0, -20, 10, -40, 0, -60);
  else if (stage === 2) ctx.bezierCurveTo(0, -50, 20, -100, 0, -150);
  else ctx.bezierCurveTo(0, -70, 30, -140, 0, -210);
  ctx.stroke();
}

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#32CD32";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(15, -10, 15, -30, 0, -40);
  ctx.bezierCurveTo(-15, -30, -15, -10, 0, 0);
  ctx.fill();
  ctx.restore();
}

function drawLeaves(ctx: CanvasRenderingContext2D, stage: number) {
  if (stage >= 1) {
    drawLeaf(ctx, -15, -60, 1, -Math.PI / 4);
    drawLeaf(ctx, 15, -80, 1, Math.PI / 4);
  }
  if (stage >= 2) {
    drawLeaf(ctx, -20, -110, 0.8, -Math.PI / 3);
    drawLeaf(ctx, 20, -130, 0.8, Math.PI / 3);
  }
  if (stage >= 3) {
    drawLeaf(ctx, -25, -160, 0.6, -Math.PI / 2.5);
    drawLeaf(ctx, 25, -180, 0.6, Math.PI / 2.5);
  }
}

function drawFlower(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(0, -210);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = "#FF69B4";
    ctx.beginPath();
    ctx.rotate((Math.PI * 2) / 5);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -20);
    ctx.arc(0, -30, 10, 0, Math.PI);
    ctx.lineTo(0, -20);
    ctx.fill();
  }
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

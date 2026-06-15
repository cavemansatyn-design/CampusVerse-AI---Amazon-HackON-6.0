"use client";

/** Port of Barqawiz/Tamagotchi cat.html pixel cat — actions from companion progress */
import { useEffect, useRef } from "react";

const CAT_COLORS = ["#FF9933", "#6699FF", "#FF6699", "#66CC66", "#CC66FF"];

interface CatCompanionProps {
  action: string;
  level: number;
  className?: string;
}

export function CatCompanion({ action, level, className }: CatCompanionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const catRef = useRef(createCatState());

  useEffect(() => {
    catRef.current.setAction(action);
  }, [action]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const color = CAT_COLORS[level % CAT_COLORS.length];
    let raf: number;

    const loop = () => {
      const cat = catRef.current;
      cat.update(w, h);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff9e6";
      ctx.fillRect(0, 0, w, h);
      cat.draw(ctx, color, w, h);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [level]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className={`cursor-pointer border-4 border-on-surface bg-surface-container-low shadow-[4px_4px_0_0_#1a1c1b] ${className ?? ""}`}
      onClick={() => catRef.current.setAction("jump")}
    />
  );
}

function createCatState() {
  return {
    x: 160,
    y: 180,
    scale: 7,
    direction: 1,
    frameIndex: 0,
    frameCounter: 0,
    currentAction: "idle",
    jumpFrame: 0,
    jumpYOffset: 0,
    talkText: "Meow!",
    oneShot: false,
    setAction(action: string) {
      this.currentAction = action;
      this.frameIndex = 0;
      this.frameCounter = 0;
      this.jumpFrame = 0;
      this.oneShot = ["jump", "happy", "dance", "talk", "cute", "sleepy"].includes(action);
      if (action === "talk") this.talkText = "Let's crush those goals!";
    },
    update(w: number, h: number) {
      this.frameCounter++;
      if (this.frameCounter >= 10) {
        this.frameCounter = 0;
        const maxFrames = this.currentAction === "walk" || this.currentAction === "dance" ? 2 : 1;
        this.frameIndex = (this.frameIndex + 1) % maxFrames;
      }

      if (this.currentAction === "jump") {
        const progress = this.jumpFrame / 20;
        this.jumpYOffset = -30 * Math.sin(Math.PI * progress);
        this.jumpFrame++;
        if (this.jumpFrame >= 20) {
          this.jumpYOffset = 0;
          this.setAction("idle");
        }
      }

      if (this.currentAction === "walk") {
        this.x += this.direction * 2;
        if (this.x >= w - 40 || this.x <= 40) this.direction *= -1;
      }

      if (this.oneShot && this.frameCounter === 0 && this.frameIndex === 0 && this.currentAction !== "walk" && this.currentAction !== "idle" && this.currentAction !== "jump") {
        // return to idle after ~2s
      }
    },
    draw(ctx: CanvasRenderingContext2D, color: string, w: number, h: number) {
      if (this.currentAction === "idle" && this.x !== w / 2) {
        this.x += (w / 2 - this.x) * 0.05;
      }

      ctx.save();
      ctx.translate(this.x, this.y + this.jumpYOffset);
      ctx.scale(this.scale, this.scale);
      if (this.currentAction === "dance") ctx.rotate(this.frameIndex === 0 ? -0.15 : 0.15);

      drawCatBase(ctx, color);
      if (this.currentAction === "sleepy") drawClosedEyes(ctx);
      else if (this.currentAction === "happy" || this.currentAction === "cute") {
        drawEyes(ctx);
        drawSmile(ctx);
        if (this.currentAction === "cute") drawHeart(ctx);
      } else {
        drawEyes(ctx, this.frameIndex === 1 && this.currentAction === "idle");
      }
      if (this.currentAction === "walk" || this.currentAction === "dance") drawLegs(ctx, this.frameIndex === 1);
      if (this.currentAction === "sleepy") drawZ(ctx);
      ctx.restore();

      if (this.currentAction === "talk") drawBubble(ctx, this.x, this.y + this.jumpYOffset - 70, this.talkText);
    },
  };
}

function drawCatBase(ctx: CanvasRenderingContext2D, color: string) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 0.3;
  ctx.fillStyle = color;
  ctx.fillRect(-8, -8, 16, 16);
  ctx.strokeRect(-8, -8, 16, 16);
  ctx.beginPath();
  ctx.moveTo(-6, -8);
  ctx.lineTo(-4, -12);
  ctx.lineTo(-2, -8);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6, -8);
  ctx.lineTo(4, -12);
  ctx.lineTo(2, -8);
  ctx.fill();
  ctx.stroke();
}

function drawEyes(ctx: CanvasRenderingContext2D, blink = false) {
  ctx.fillStyle = "#000";
  if (blink) {
    ctx.fillRect(-4, -4, 2, 1);
    ctx.fillRect(2, -4, 2, 1);
  } else {
    ctx.fillRect(-4, -5, 2, 2);
    ctx.fillRect(2, -5, 2, 2);
  }
}

function drawClosedEyes(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#000";
  ctx.fillRect(-4, -3, 2, 1);
  ctx.fillRect(2, -3, 2, 1);
}

function drawSmile(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.arc(0, 2, 2, 0, Math.PI);
  ctx.stroke();
}

function drawLegs(ctx: CanvasRenderingContext2D, alt: boolean) {
  ctx.fillStyle = "#FF9933";
  if (alt) {
    ctx.fillRect(-6, 8, 4, 2);
    ctx.fillRect(2, 8, 4, 2);
  } else {
    ctx.fillRect(-6, 8, 4, 2);
    ctx.fillRect(0, 8, 4, 2);
  }
}

function drawHeart(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(0, -12);
  ctx.fillStyle = "#ff3366";
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.bezierCurveTo(-2, -5, -6, -5, -6, -1);
  ctx.bezierCurveTo(-6, 2, -3, 4, 0, 6);
  ctx.bezierCurveTo(3, 4, 6, 2, 6, -1);
  ctx.bezierCurveTo(6, -5, 2, -5, 0, -2);
  ctx.fill();
  ctx.restore();
}

function drawZ(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#000";
  ctx.font = "3px Arial";
  ctx.fillText("Z", -10, -15);
}

function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  const bw = text.length * 7 + 24;
  ctx.fillRect(x - bw / 2, y - 15, bw, 30);
  ctx.strokeRect(x - bw / 2, y - 15, bw, 30);
  ctx.fillStyle = "#000";
  ctx.font = "11px Hanken Grotesk, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y + 2);
  ctx.restore();
}

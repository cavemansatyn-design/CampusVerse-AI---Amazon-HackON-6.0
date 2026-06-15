"use client";

/** Port of Barqawiz/Tamagotchi eyes.js — mood from companion stats */
import { useEffect, useRef } from "react";

interface EyesCompanionProps {
  mode: string;
  className?: string;
}

export function EyesCompanion({ mode, className }: EyesCompanionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    mouseX: 160,
    mouseY: 160,
    isBlinking: false,
    blinkProgress: 0,
    isSurprised: false,
    isSleepy: false,
    isBored: false,
    isFollowingMouse: false,
    isIdle: true,
    isLookingAround: false,
    lookAngle: 0,
    lookDirection: 1,
    lookPause: false,
    blinkTimer: 0,
  });

  useEffect(() => {
    const s = stateRef.current;
    s.isFollowingMouse = false;
    s.isSurprised = false;
    s.isSleepy = false;
    s.isBored = false;
    s.isIdle = false;
    s.isLookingAround = false;
    s.lookPause = false;

    switch (mode) {
      case "followMouse":
        s.isFollowingMouse = true;
        break;
      case "surprised":
        s.isSurprised = true;
        break;
      case "sleepy":
        s.isSleepy = true;
        break;
      case "bored":
        s.isBored = true;
        break;
      case "lookAround":
        s.isLookingAround = true;
        s.lookAngle = 0;
        break;
      default:
        s.isIdle = true;
    }
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const eyeRadius = 55;
    const irisRadius = 22;
    const pupilRadius = 9;
    const leftX = w / 2 - 90;
    const rightX = w / 2 + 90;
    const centerY = h / 2;
    let raf: number;
    let idleBlinkAt = Date.now() + 3000;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * w;
      stateRef.current.mouseY = ((e.clientY - rect.top) / rect.height) * h;
    };
    canvas.addEventListener("mousemove", onMove);

    const drawEye = (centerX: number) => {
      const s = stateRef.current;
      let er = eyeRadius;
      let ir = irisRadius;
      let pr = pupilRadius;
      if (s.isSurprised) {
        er *= 1.2;
        ir *= 1.2;
        pr *= 1.2;
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, er, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 4;
      ctx.stroke();

      let irisX = centerX;
      let irisY = centerY;
      if (s.isFollowingMouse) {
        let dx = s.mouseX - centerX;
        let dy = s.mouseY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max = er - ir - 5;
        if (dist > max) {
          dx = (dx / dist) * max;
          dy = (dy / dist) * max;
        }
        irisX = centerX + dx;
        irisY = centerY + dy;
      } else if (s.isLookingAround) {
        irisX = centerX + Math.sin(s.lookAngle) * (er - ir - 10);
      } else if (s.isIdle) {
        irisX = centerX + (er - ir - 15) * 0.1;
      }

      ctx.beginPath();
      ctx.arc(irisX, irisY, ir, 0, Math.PI * 2);
      ctx.fillStyle = "#1E90FF";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(irisX, irisY, pr, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(irisX - pr / 2.5, irisY - pr / 2.5, pr / 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      if (s.isBlinking) {
        const amt = s.blinkProgress / 100;
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, er, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#ccc";
        ctx.fillRect(centerX - er, centerY - er, er * 2, er * amt * 2);
        ctx.restore();
      } else if (s.isSleepy) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, er, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(centerX - er, centerY + er / 3);
        ctx.quadraticCurveTo(centerX, centerY + er / 2, centerX + er, centerY + er / 3);
        ctx.lineTo(centerX + er, centerY + er + 1);
        ctx.lineTo(centerX - er, centerY + er + 1);
        ctx.fill();
        ctx.restore();
      } else if (s.isBored) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, er, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(centerX - er, centerY + er / 5);
        ctx.quadraticCurveTo(centerX, centerY + er / 4, centerX + er, centerY + er / 5);
        ctx.lineTo(centerX + er, centerY + er + 1);
        ctx.lineTo(centerX - er, centerY + er + 1);
        ctx.fill();
        ctx.restore();
      }
    };

    const loop = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff9e6";
      ctx.fillRect(0, 0, w, h);

      if (s.isLookingAround && !s.lookPause) {
        s.lookAngle += 0.01 * s.lookDirection;
        if (Math.abs(s.lookAngle) > Math.PI / 4) {
          s.lookPause = true;
          setTimeout(() => {
            s.lookPause = false;
            s.lookDirection *= -1;
          }, 500);
        }
      }

      if (s.isIdle && Date.now() > idleBlinkAt && !s.isBlinking) {
        s.isBlinking = true;
        s.blinkProgress = 0;
      }
      if (s.isBlinking) {
        s.blinkProgress += 8;
        if (s.blinkProgress >= 100) s.blinkProgress = 100;
        if (s.blinkProgress >= 100) {
          s.blinkProgress -= 8;
          if (s.blinkProgress <= 0) {
            s.isBlinking = false;
            idleBlinkAt = Date.now() + 3000 + Math.random() * 2000;
          }
        }
      }

      drawEye(leftX);
      drawEye(rightX);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className={`cursor-crosshair border-4 border-on-surface bg-surface-container-low shadow-[4px_4px_0_0_#1a1c1b] ${className ?? ""}`}
    />
  );
}

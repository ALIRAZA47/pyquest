"use client";

import { useEffect, useRef } from "react";
import { CONFETTI_EVENT, type ConfettiOptions } from "./confetti";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  color: string;
  shape: "rect" | "circle";
  life: number;
}

const COLORS = [
  "#635bf1",
  "#a855f7",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#38bdf8",
  "#ffd43b",
];

export function ConfettiHost() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (opts: ConfettiOptions) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const ox = (opts.x ?? 0.5) * W;
      const oy = (opts.y ?? 0.28) * H;
      const count = opts.count ?? 130;
      for (let i = 0; i < count; i++) {
        const angle = Math.PI * 2 * (i / count) + Math.random();
        const speed = 4 + Math.random() * 9;
        particlesRef.current.push({
          x: ox + (Math.random() - 0.5) * 60,
          y: oy + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed * (0.6 + Math.random()),
          vy: Math.sin(angle) * speed - 4 - Math.random() * 4,
          size: 5 + Math.random() * 7,
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.4,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          shape: Math.random() > 0.5 ? "rect" : "circle",
          life: 1,
        });
      }
      if (!runningRef.current) {
        runningRef.current = true;
        loop();
      }
    };

    const loop = () => {
      const H = window.innerHeight;
      const W = window.innerWidth;
      ctx.clearRect(0, 0, W, H);
      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.28; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life -= 0.006;
        if (p.y > H + 30 || p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (parts.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        runningRef.current = false;
        ctx.clearRect(0, 0, W, H);
      }
    };

    const onFire = (e: Event) => {
      const detail = (e as CustomEvent).detail as ConfettiOptions;
      spawn(detail || {});
    };

    window.addEventListener(CONFETTI_EVENT, onFire);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener(CONFETTI_EVENT, onFire);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

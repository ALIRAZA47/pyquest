"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, PlayIcon, CloseIcon } from "./Icons";

// ---- shared helpers for the algorithm visualizers ----

// Deterministic PRNG (stable across SSR/CSR) so point layouts don't cause
// hydration mismatches.
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useStepper(total: number, speed = 750) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (step > total - 1) setStep(Math.max(0, total - 1));
  }, [total, step]);

  useEffect(() => {
    if (!playing) return;
    if (step >= total - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => Math.min(total - 1, s + 1)), speed);
    return () => clearTimeout(t);
  }, [playing, step, total, speed]);

  return {
    step,
    setStep,
    playing,
    setPlaying,
    next: () => setStep((s) => Math.min(total - 1, s + 1)),
    prev: () => setStep((s) => Math.max(0, s - 1)),
    reset: () => {
      setPlaying(false);
      setStep(0);
    },
    // Smart play/pause: if we're at the end, restart from the beginning.
    toggle: () => {
      if (playing) {
        setPlaying(false);
        return;
      }
      if (step >= total - 1) setStep(0);
      setPlaying(true);
    },
  };
}

export function VizControls({
  step,
  total,
  playing,
  onPrev,
  onNext,
  onPlayToggle,
  onReset,
  label,
}: {
  step: number;
  total: number;
  playing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPlayToggle: () => void;
  onReset: () => void;
  label?: string;
}) {
  const atEnd = step >= total - 1;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 0}
        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition-colors enabled:hover:text-accent disabled:opacity-40"
        aria-label="Previous step"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onPlayToggle}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
      >
        {playing ? <CloseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        {playing ? "Pause" : atEnd ? "Replay" : "Play"}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition-colors enabled:hover:text-accent disabled:opacity-40"
        aria-label="Next step"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        Reset
      </button>
      <span className="ml-auto font-mono text-xs text-faint">
        {label ?? `step ${step + 1} / ${total}`}
      </span>
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-border bg-surface text-muted hover:border-accent/40 hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

// Two class colors used across scatter-plot visualizers.
export const CLASS_A = "#635bf1"; // accent-ish (violet)
export const CLASS_B = "#f59e0b"; // amber
export const CLUSTER_COLORS = ["#635bf1", "#22c55e", "#f59e0b", "#ef4444", "#38bdf8"];

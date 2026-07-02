// Tiny dependency-free confetti. `fireConfetti()` dispatches a window event;
// <ConfettiHost/> listens and animates particles on a full-screen canvas.

export interface ConfettiOptions {
  x?: number; // origin (0..1 of viewport width), defaults to 0.5
  y?: number; // origin (0..1 of viewport height), defaults to 0.28
  count?: number;
}

export const CONFETTI_EVENT = "pyquest:confetti";

export function fireConfetti(opts: ConfettiOptions = {}): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONFETTI_EVENT, { detail: opts }));
}

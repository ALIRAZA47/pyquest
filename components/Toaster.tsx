"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "./ProgressContext";
import { Glyph } from "./glyphs";

const KIND_STYLES: Record<string, string> = {
  xp: "border-accent/40 from-accent/15",
  badge: "border-amber-500/40 from-amber-500/15",
  level: "border-violet-500/40 from-violet-500/15",
};

export function Toaster() {
  const { toasts, dismissToast } = useProgress();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[110] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            type="button"
            onClick={() => dismissToast(t.id)}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-surface bg-gradient-to-br to-transparent p-3.5 text-left shadow-glow backdrop-blur-xl ${
              KIND_STYLES[t.kind] ?? KIND_STYLES.xp
            }`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <Glyph name={t.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold leading-tight text-fg">
                {t.title}
              </span>
              {t.subtitle && (
                <span className="mt-0.5 block text-sm leading-snug text-muted">
                  {t.subtitle}
                </span>
              )}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

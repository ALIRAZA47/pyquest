"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon } from "./Icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-2 text-fg transition-colors hover:border-accent/50 hover:text-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            {isDark ? (
              <MoonIcon className="h-[18px] w-[18px]" />
            ) : (
              <SunIcon className="h-[18px] w-[18px]" />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

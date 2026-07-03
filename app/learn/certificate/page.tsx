"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/components/ProgressContext";
import { ProgressRing } from "@/components/ProgressRing";
import { Glyph } from "@/components/glyphs";
import { TOTAL_LESSONS } from "@/lib/curriculum";
import { ArrowRight } from "@/components/Icons";

const NAME_KEY = "quest:name";
const OLD_NAME_KEY = "pyquest:name"; // migrate from the previous app name

export default function CertificatePage() {
  const { count, xp, level, rankName, badges, ready } = useProgress();
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setName(localStorage.getItem(NAME_KEY) || localStorage.getItem(OLD_NAME_KEY) || "");
    } catch {
      /* ignore */
    }
  }, []);

  const onName = (v: string) => {
    setName(v);
    try {
      localStorage.setItem(NAME_KEY, v);
    } catch {
      /* ignore */
    }
  };

  if (!mounted || !ready) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted">Loading…</div>
    );
  }

  const complete = count >= TOTAL_LESSONS;

  if (!complete) {
    const pct = TOTAL_LESSONS ? count / TOTAL_LESSONS : 0;
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-6 text-center">
        <div>
          <ProgressRing value={pct} size={96} stroke={7}>
            <span className="text-lg font-black text-fg">
              {Math.round(pct * 100)}%
            </span>
          </ProgressRing>
          <h1 className="mt-5 text-2xl font-black tracking-tight">
            Your certificate is waiting 🎓
          </h1>
          <p className="mt-2 text-muted">
            Complete all {TOTAL_LESSONS} lessons to unlock your certificate of
            completion. You've finished {count} so far — {TOTAL_LESSONS - count}{" "}
            to go!
          </p>
          <Link
            href="/learn"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            Keep learning <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-5 flex flex-wrap items-end gap-3 print:hidden">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">
            Your name (appears on the certificate)
          </span>
          <input
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Ada Lovelace"
            className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-fg placeholder:text-faint focus:border-accent/60 focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-gradient-to-br from-accent to-accent-2 px-5 py-2.5 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
        >
          🖨 Print / Save PDF
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/[0.08] via-surface to-accent-2/[0.08] p-8 text-center sm:p-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="relative">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
            <Glyph name="snake" className="h-8 w-8" />
          </div>
          <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Certificate of Completion
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-fg sm:text-3xl">
            Quest · Python 101
          </h1>
          <p className="mt-6 text-sm uppercase tracking-wider text-faint">
            This certifies that
          </p>
          <p className="mt-1 border-b border-border pb-2 text-3xl font-black text-gradient sm:text-4xl">
            {name.trim() || "Your Name"}
          </p>
          <p className="mx-auto mt-6 max-w-md text-muted">
            has successfully completed all{" "}
            <span className="font-semibold text-fg">{TOTAL_LESSONS} lessons</span>{" "}
            of the Quest Python course, reaching{" "}
            <span className="font-semibold text-fg">
              Level {level} · {rankName}
            </span>
            .
          </p>

          <div className="mx-auto mt-7 flex max-w-md flex-wrap justify-center gap-x-8 gap-y-3">
            <div>
              <div className="text-2xl font-black text-fg">{xp}</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">XP</div>
            </div>
            <div>
              <div className="text-2xl font-black text-fg">{TOTAL_LESSONS}</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">
                Lessons
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-fg">{badges.size}</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">
                Badges
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="font-semibold text-fg">{dateStr}</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">
                Date
              </div>
            </div>
            <div className="text-center">
              <div className="font-[cursive] text-lg text-gradient">Quest</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">
                Awarded by
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

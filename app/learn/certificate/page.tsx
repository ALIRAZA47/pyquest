"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/components/ProgressContext";
import { Glyph } from "@/components/glyphs";
import { TOTAL_LESSONS } from "@/lib/curriculum";
import { ArrowLeft, ArrowRight } from "@/components/Icons";

const NAME_KEY = "quest:name";
const OLD_NAME_KEY = "pyquest:name"; // migrate from the previous app name

function hashCode(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).slice(0, 4);
}

export default function CertificatePage() {
  const { count, xp, level, rankName, challengesSolved, ready } = useProgress();
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  if (!mounted || !ready) {
    return <div className="grid min-h-screen place-items-center text-muted">Loading…</div>;
  }

  const complete = count >= TOTAL_LESSONS;

  // ---- Locked state -------------------------------------------------------
  if (!complete) {
    const pct = TOTAL_LESSONS ? Math.round((count / TOTAL_LESSONS) * 100) : 0;
    return (
      <div className="mx-auto grid min-h-screen max-w-md place-items-center px-6 text-center">
        <div>
          <div className="font-display text-6xl font-bold tabular-nums text-fg">{pct}%</div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
            Your certificate is waiting 🎓
          </h1>
          <p className="mt-2 text-muted">
            Complete all {TOTAL_LESSONS} Python lessons to unlock your certificate.
            You've finished {count} so far — {TOTAL_LESSONS - count} to go!
          </p>
          <Link
            href="/learn"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            Keep learning <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ---- Unlocked certificate ----------------------------------------------
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
  const verify = `quest.dev/v/${level}/${hashCode((name || "quest") + TOTAL_LESSONS)}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Action bar */}
      <div className="mb-8 flex items-center justify-center gap-3 print:hidden">
        <Link
          href="/learn/profile"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-accent-text"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
        >
          <Glyph name="download" className="h-4 w-4" /> Download
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent/50"
        >
          <Glyph name="share" className="h-4 w-4" /> {copied ? "Copied!" : "Share"}
        </button>
      </div>

      {/* Name field */}
      <div className="mx-auto mb-6 max-w-sm print:hidden">
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder="Type your name for the certificate"
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-center text-fg placeholder:text-faint focus:border-accent/60 focus:outline-none"
        />
      </div>

      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/[0.08] via-surface to-accent-2/[0.06] p-8 text-center sm:p-14"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="relative">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
            <Glyph name="code" className="h-7 w-7" />
          </div>
          <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-accent-text">
            Certificate of Completion
          </div>
          <p className="mt-6 text-sm text-faint">This certifies that</p>
          <p className="mx-auto mt-2 max-w-md bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text pb-1 font-display text-4xl font-bold text-transparent sm:text-5xl">
            {name.trim() || "Your Name"}
          </p>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted">
            has completed the{" "}
            <span className="font-semibold text-fg">Python course</span> —{" "}
            {TOTAL_LESSONS} lessons and {challengesSolved} challenges — reaching{" "}
            <span className="font-semibold text-fg">
              Level {level} · {rankName}
            </span>{" "}
            with {xp.toLocaleString()} XP.
          </p>

          <div className="mx-auto my-8 grid h-12 w-12 place-items-center rounded-full border border-accent/40 text-accent-text">
            <Glyph name="gradcap" className="h-6 w-6" />
          </div>

          <div className="flex items-end justify-between text-left">
            <div>
              <div className="font-display font-semibold text-fg">{dateStr}</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">Issued</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-faint">{verify}</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">Verify</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

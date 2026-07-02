import type { CalloutVariant } from "@/lib/types";
import { Markdown } from "./Markdown";
import {
  LightbulbIcon,
  WarningIcon,
  InfoIcon,
  BugIcon,
  SparklesIcon,
} from "./Icons";

const STYLES: Record<
  CalloutVariant,
  { icon: typeof InfoIcon; ring: string; bg: string; text: string; label: string }
> = {
  tip: {
    icon: LightbulbIcon,
    ring: "border-emerald-500/30",
    bg: "bg-emerald-500/[0.07]",
    text: "text-emerald-500",
    label: "Tip",
  },
  warning: {
    icon: WarningIcon,
    ring: "border-amber-500/30",
    bg: "bg-amber-500/[0.07]",
    text: "text-amber-500",
    label: "Watch out",
  },
  note: {
    icon: InfoIcon,
    ring: "border-sky-500/30",
    bg: "bg-sky-500/[0.07]",
    text: "text-sky-500",
    label: "Note",
  },
  analogy: {
    icon: SparklesIcon,
    ring: "border-violet-500/30",
    bg: "bg-violet-500/[0.07]",
    text: "text-violet-500",
    label: "Think of it like",
  },
  gotcha: {
    icon: BugIcon,
    ring: "border-rose-500/30",
    bg: "bg-rose-500/[0.07]",
    text: "text-rose-500",
    label: "Common mistake",
  },
};

export function Callout({
  variant,
  title,
  md,
}: {
  variant: CalloutVariant;
  title: string;
  md: string;
}) {
  const s = STYLES[variant] ?? STYLES.note;
  const Icon = s.icon;
  return (
    <div className={`my-6 rounded-2xl border ${s.ring} ${s.bg} p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${s.ring} bg-surface ${s.text}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${s.text}`}
            >
              {s.label}
            </span>
          </div>
          <p className="mt-0.5 font-semibold text-fg">{title}</p>
          <div className="mt-1 text-sm leading-relaxed text-muted [&_p]:my-1.5">
            <Markdown text={md} />
          </div>
        </div>
      </div>
    </div>
  );
}

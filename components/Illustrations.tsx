// Custom, theme-aware SVG illustrations (no external assets). Colors come from
// CSS variables so they adapt to light/dark. Gentle floating via the Tailwind
// `animate-float` utility. These are plain components (no hooks) so they work in
// both server and client components.

type Props = { className?: string };

const star = (x: number, y: number, s: number) =>
  `M${x},${y - s} L${x + s * 0.28},${y - s * 0.28} L${x + s},${y} L${x + s * 0.28},${y + s * 0.28} L${x},${y + s} L${x - s * 0.28},${y + s * 0.28} L${x - s},${y} L${x - s * 0.28},${y - s * 0.28} Z`;

export function WebIllustration({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 420 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="webG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--accent))" />
          <stop offset="1" stopColor="rgb(var(--accent-2))" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="160" rx="190" ry="130" fill="url(#webG)" opacity="0.10" />

      <g className="animate-float" style={{ animationDuration: "6s" }}>
        <rect x="66" y="52" width="288" height="196" rx="16" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="2" />
        <path d="M66 68a16 16 0 0 1 16-16h256a16 16 0 0 1 16 16v18H66z" fill="rgb(var(--surface-2))" />
        <circle cx="88" cy="69" r="4" fill="#ff5f57" />
        <circle cx="104" cy="69" r="4" fill="#febc2e" />
        <circle cx="120" cy="69" r="4" fill="#28c840" />
        <rect x="150" y="63" width="188" height="12" rx="6" fill="rgb(var(--border))" />
        {/* content */}
        <rect x="84" y="104" width="74" height="128" rx="9" fill="url(#webG)" opacity="0.18" />
        <rect x="172" y="104" width="166" height="56" rx="9" fill="url(#webG)" opacity="0.9" />
        <rect x="172" y="176" width="120" height="11" rx="5.5" fill="rgb(var(--muted))" opacity="0.5" />
        <rect x="172" y="196" width="150" height="11" rx="5.5" fill="rgb(var(--muted))" opacity="0.35" />
        <rect x="172" y="216" width="96" height="11" rx="5.5" fill="rgb(var(--muted))" opacity="0.35" />
      </g>

      <g className="animate-float" style={{ animationDuration: "5s", animationDelay: "0.6s" }}>
        <rect x="20" y="82" width="70" height="44" rx="12" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="2" />
        <text x="55" y="112" textAnchor="middle" fontSize="22" fontFamily="ui-monospace, monospace" fontWeight="700" fill="rgb(var(--accent))">{"</>"}</text>
      </g>
      <g className="animate-float" style={{ animationDuration: "7s", animationDelay: "1.1s" }}>
        <rect x="332" y="188" width="66" height="44" rx="12" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="2" />
        <text x="365" y="217" textAnchor="middle" fontSize="20" fontFamily="ui-monospace, monospace" fontWeight="700" fill="rgb(var(--accent-2))">{"{ }"}</text>
      </g>
      <path d={star(360, 70, 9)} fill="rgb(var(--accent-2))" className="animate-float" style={{ animationDuration: "4.5s" }} />
      <circle cx="40" cy="200" r="6" fill="rgb(var(--accent))" opacity="0.6" className="animate-float" style={{ animationDuration: "6.5s", animationDelay: "0.3s" }} />
    </svg>
  );
}

export function AiIllustration({ className = "" }: Props) {
  const nodes = [
    [46, 120],
    [46, 170],
    [96, 100],
    [96, 145],
    [96, 190],
    [146, 145],
  ];
  const edges = [
    [0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [4, 5],
  ];
  return (
    <svg viewBox="0 0 420 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aiG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--accent))" />
          <stop offset="1" stopColor="rgb(var(--accent-2))" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="160" rx="190" ry="130" fill="url(#aiG)" opacity="0.10" />

      {/* neural net */}
      <g className="animate-float" style={{ animationDuration: "8s" }}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="rgb(var(--accent))" strokeWidth="1.5" opacity="0.4" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill="url(#aiG)" />
        ))}
      </g>

      {/* robot head */}
      <g className="animate-float" style={{ animationDuration: "6s", animationDelay: "0.4s" }}>
        <line x1="250" y1="58" x2="250" y2="82" stroke="rgb(var(--accent))" strokeWidth="3" strokeLinecap="round" />
        <circle cx="250" cy="52" r="7" fill="url(#aiG)" />
        <rect x="176" y="80" width="148" height="126" rx="26" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="2" />
        <rect x="162" y="118" width="14" height="42" rx="6" fill="rgb(var(--surface-2))" stroke="rgb(var(--border))" strokeWidth="2" />
        <rect x="324" y="118" width="14" height="42" rx="6" fill="rgb(var(--surface-2))" stroke="rgb(var(--border))" strokeWidth="2" />
        {/* face screen */}
        <rect x="194" y="100" width="112" height="74" rx="16" fill="rgb(var(--code-bg))" />
        <circle cx="224" cy="132" r="9" fill="url(#aiG)" />
        <circle cx="276" cy="132" r="9" fill="url(#aiG)" />
        <path d="M222 152q28 18 56 0" stroke="rgb(var(--accent-2))" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* sparkles */}
      <path d={star(350, 96, 11)} fill="url(#aiG)" className="animate-float" style={{ animationDuration: "5s", animationDelay: "0.2s" }} />
      <path d={star(150, 235, 8)} fill="rgb(var(--accent-2))" className="animate-float" style={{ animationDuration: "6s", animationDelay: "0.9s" }} />
      <circle cx="330" cy="210" r="6" fill="rgb(var(--accent))" opacity="0.6" className="animate-float" style={{ animationDuration: "7s" }} />
    </svg>
  );
}

// Decorative floating shapes for backgrounds (place inside a relative parent).
export function FloatingShapes({ className = "" }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute left-[8%] top-[18%] h-24 w-24 animate-float rounded-3xl bg-accent/10 blur-xl" style={{ animationDuration: "9s" }} />
      <div className="absolute right-[12%] top-[24%] h-16 w-16 animate-float rounded-full bg-accent-2/15 blur-lg" style={{ animationDuration: "7s", animationDelay: "0.6s" }} />
      <div className="absolute bottom-[16%] left-[16%] h-20 w-20 animate-float rounded-full bg-accent-2/10 blur-xl" style={{ animationDuration: "8s", animationDelay: "1s" }} />
      <svg className="absolute right-[8%] bottom-[20%] h-10 w-10 animate-float text-accent/40" style={{ animationDuration: "6s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z" />
      </svg>
      <svg className="absolute left-[42%] top-[10%] h-6 w-6 animate-float text-accent-2/40" style={{ animationDuration: "5.5s", animationDelay: "0.4s" }} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </div>
  );
}

// Small spot illustration for empty states.
export function EmptyIllustration({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="emptyG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--accent))" />
          <stop offset="1" stopColor="rgb(var(--accent-2))" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="130" rx="70" ry="12" fill="rgb(var(--muted))" opacity="0.12" />
      <rect x="52" y="40" width="96" height="72" rx="12" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="2" />
      <rect x="52" y="40" width="96" height="20" rx="12" fill="rgb(var(--surface-2))" />
      <circle cx="118" cy="82" r="20" stroke="url(#emptyG)" strokeWidth="4" fill="none" className="animate-float" style={{ animationDuration: "5s" }} />
      <line x1="132" y1="96" x2="146" y2="112" stroke="url(#emptyG)" strokeWidth="4" strokeLinecap="round" />
      <path d={star(44, 40, 7)} fill="rgb(var(--accent-2))" className="animate-float" style={{ animationDuration: "4s" }} />
    </svg>
  );
}

import type { SVGProps } from "react";

// A cohesive, custom line-icon set for Quest — replaces emojis everywhere.
// Every glyph is a 24×24 stroke icon that inherits `currentColor`, so it
// themes with light/dark and can be tinted with the accent color.

type P = SVGProps<SVGSVGElement>;

function S({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      {children}
    </svg>
  );
}

const dot = (cx: number, cy: number, r = 1) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

// ---- the glyph registry -------------------------------------------------
export const GLYPHS: Record<string, (p: P) => JSX.Element> = {
  // Brand / Python
  snake: (p) => (
    <S {...p}>
      <path d="M7 7a2.5 2.5 0 0 1 2.5-2.5H14a3.5 3.5 0 0 1 0 7h-3.5A3 3 0 0 0 10 17.5h4.5A2.5 2.5 0 0 0 17 15" />
      {dot(8.4, 6.6, 0.8)}
      <path d="M6 7.2 4.4 6.4M6 7.2l-1.6.9" />
    </S>
  ),

  // Getting started
  rocket: (p) => (
    <S {...p}>
      <path d="M12 3c2.8 1.4 4.5 4.2 4.5 7.5 0 2-.7 3.6-1.5 4.8l-6 0C8.2 14.1 7.5 12.5 7.5 10.5 7.5 7.2 9.2 4.4 12 3z" />
      <circle cx="12" cy="9.5" r="1.6" />
      <path d="M9 15.3 6.5 17c-.3 1.4-.2 2.6-.2 2.6s1.2.1 2.6-.2l1.6-1.9M15 15.3l2.5 1.7c.3 1.4.2 2.6.2 2.6s-1.2.1-2.6-.2l-1.6-1.9" />
    </S>
  ),

  // Python basics
  blocks: (p) => (
    <S {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.4" />
      <rect x="13" y="4" width="7" height="7" rx="1.4" />
      <rect x="4" y="13" width="7" height="7" rx="1.4" />
      <rect x="13" y="13" width="7" height="7" rx="1.4" />
    </S>
  ),

  // Operators
  operators: (p) => (
    <S {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M7.5 9h3M9 7.5v3M13.5 8.2h3M13.5 15.8h3M13.5 14h3M7.2 15l2.6 2.6M9.8 15l-2.6 2.6" />
    </S>
  ),

  // Strings
  quote: (p) => (
    <S {...p}>
      <path d="M9 7c-2 0-3.2 1.4-3.2 3.4 0 1.6 1 2.6 2.4 2.6 1.2 0 2-.8 2-1.9 0-1-.7-1.8-1.7-1.8-.2 0-.4 0-.5.1C8.2 8.4 8.9 8 9.7 8z" />
      <path d="M17 7c-2 0-3.2 1.4-3.2 3.4 0 1.6 1 2.6 2.4 2.6 1.2 0 2-.8 2-1.9 0-1-.7-1.8-1.7-1.8-.2 0-.4 0-.5.1.2-1 .9-1.4 1.7-1.4z" />
      <path d="M6 17h9" />
    </S>
  ),

  // Data structures
  layers: (p) => (
    <S {...p}>
      <path d="M12 4 3.5 8.5 12 13l8.5-4.5L12 4z" />
      <path d="M4 12.5 12 17l8-4.5M4 16 12 20.5 20 16" />
    </S>
  ),

  // Control flow
  branch: (p) => (
    <S {...p}>
      <circle cx="6.5" cy="6" r="2" />
      <circle cx="6.5" cy="18" r="2" />
      <circle cx="17.5" cy="6" r="2" />
      <path d="M6.5 8v8M6.5 10c0-2 1.5-4 5-4h4" />
    </S>
  ),

  // Functions
  puzzle: (p) => (
    <S {...p}>
      <path d="M10 5h4v2.2c0 .7.7 1.1 1.3.8.3-.2.7-.3 1.1-.3 1.1 0 2 .9 2 2s-.9 2-2 2c-.4 0-.8-.1-1.1-.3-.6-.3-1.3.1-1.3.8V19h-4v-2.5c0-.7-.7-1.1-1.3-.8-.3.2-.7.3-1.2.3-1.1 0-2-.9-2-2s.9-2 2-2c.5 0 .9.1 1.2.3.6.3 1.3-.1 1.3-.8V5z" />
    </S>
  ),

  // OOP
  columns: (p) => (
    <S {...p}>
      <path d="M3.5 8 12 4l8.5 4M4.5 8v9M9 8v9M15 8v9M19.5 8v9M3 20h18M4 8h16" />
    </S>
  ),

  // Modules / packages / tuples
  box: (p) => (
    <S {...p}>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </S>
  ),

  // Errors
  shield: (p) => (
    <S {...p}>
      <path d="M12 3.5 5.5 6v5c0 4 2.8 7.2 6.5 8.5 3.7-1.3 6.5-4.5 6.5-8.5V6L12 3.5z" />
      <path d="M12 8.5v4M12 15.5v.01" />
    </S>
  ),

  // Files
  folder: (p) => (
    <S {...p}>
      <path d="M3.5 7.5c0-1 .8-1.8 1.8-1.8h3.4l2 2.2h7.9c1 0 1.9.8 1.9 1.8v7.8c0 1-.9 1.8-1.9 1.8H5.4c-1 0-1.9-.8-1.9-1.8V7.5z" />
    </S>
  ),

  // Advanced
  cpu: (p) => (
    <S {...p}>
      <rect x="7" y="7" width="10" height="10" rx="1.6" />
      <rect x="10" y="10" width="4" height="4" rx="0.8" />
      <path d="M10 4v2M14 4v2M10 18v2M14 18v2M4 10h2M4 14h2M18 10h2M18 14h2" />
    </S>
  ),

  // Pythonic / magic
  wand: (p) => (
    <S {...p}>
      <path d="M5 19 15 9M14.5 5.5l.9 1.9 1.9.9-1.9.9-.9 1.9-.9-1.9-1.9-.9 1.9-.9.9-1.9z" />
      <path d="M19 13l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2z" />
    </S>
  ),

  // Next / navigation
  compass: (p) => (
    <S {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2z" />
      {dot(12, 12, 0.6)}
    </S>
  ),

  // ---- ranks ----
  egg: (p) => (
    <S {...p}>
      <path d="M12 3.5c3 0 5.5 4.5 5.5 8.5a5.5 5.5 0 0 1-11 0c0-4 2.5-8.5 5.5-8.5z" />
    </S>
  ),
  sprout: (p) => (
    <S {...p}>
      <path d="M12 20v-7" />
      <path d="M12 13c0-2.5-2-4.5-5-4.5 0 3 2 4.5 5 4.5z" />
      <path d="M12 11c0-2.5 2-4.5 5-4.5 0 3-2 4.5-5 4.5z" />
    </S>
  ),
  book: (p) => (
    <S {...p}>
      <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v13H6.5A1.5 1.5 0 0 0 5 18.5v-13z" />
      <path d="M5 18.5A1.5 1.5 0 0 0 6.5 20H18M9 8h5" />
    </S>
  ),
  laptop: (p) => (
    <S {...p}>
      <rect x="5" y="5.5" width="14" height="9" rx="1.5" />
      <path d="M3 18h18M9.5 9.5 8 11l1.5 1.5M14.5 9.5 16 11l-1.5 1.5" />
    </S>
  ),
  palette: (p) => (
    <S {...p}>
      <path d="M12 3.5A8.5 8.5 0 0 0 3.5 12c0 4 3 6.5 6 6.5 1.4 0 2-1 2-1.8 0-.5-.3-.9-.6-1.3-.3-.4-.5-.7-.5-1.2 0-.8.7-1.2 1.6-1.2H14a5 5 0 0 0 5-5c0-2.8-3-4.5-7-4.5z" />
      {dot(8, 11, 0.9)}
      {dot(11, 8, 0.9)}
      {dot(15, 9.5, 0.9)}
    </S>
  ),
  wizardhat: (p) => (
    <S {...p}>
      <path d="M12 3 7 15h10L12 3z" />
      <path d="M5 18.5c2-1 4.5-1.5 7-1.5s5 .5 7 1.5" />
      <path d="M12 7.5 12.6 9l1.5.6-1.5.6L12 11.7 11.4 10 9.9 9.6 11.4 9 12 7.5z" />
    </S>
  ),
  temple: (p) => (
    <S {...p}>
      <path d="M12 3 4 7h16L12 3z" />
      <path d="M6 7v9M10 7v9M14 7v9M18 7v9M4 20h16M5 16h14" />
    </S>
  ),
  trophy: (p) => (
    <S {...p}>
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4z" />
      <path d="M8 5.5H5.5V7A2.5 2.5 0 0 0 8 9.5M16 5.5h2.5V7A2.5 2.5 0 0 1 16 9.5M10 12.5h4M12 12.5V15M9 20h6M9.5 20c0-1.4 1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" />
    </S>
  ),
  crown: (p) => (
    <S {...p}>
      <path d="M4 8l3 8h10l3-8-4.5 3.5L12 6 8.5 11.5 4 8z" />
      <path d="M6.5 19h11" />
    </S>
  ),

  // ---- badges / misc ----
  flag: (p) => (
    <S {...p}>
      <path d="M6 21V4M6 4h9l-1.5 3L15 10H6" />
    </S>
  ),
  flame: (p) => (
    <S {...p}>
      <path d="M12 3.5c1 2.5 3.5 3.8 3.5 7A3.5 3.5 0 0 1 12 14a2.2 2.2 0 0 1-2.2-2.2c0-1 .5-1.6 1-2.2-2 .3-3.3 2-3.3 4.1A5 5 0 0 0 12.5 18.5 5.5 5.5 0 0 0 18 13c0-4-3.5-6.5-6-9.5z" />
    </S>
  ),
  medal: (p) => (
    <S {...p}>
      <path d="M8 3l2 5M16 3l-2 5" />
      <circle cx="12" cy="14.5" r="5" />
      <path d="m12 12 .8 1.6 1.7.2-1.3 1.2.3 1.7-1.5-.8-1.5.8.3-1.7-1.3-1.2 1.7-.2L12 12z" />
    </S>
  ),
  half: (p) => (
    <S {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none" opacity="0.9" />
    </S>
  ),
  target: (p) => (
    <S {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      {dot(12, 12, 1.4)}
    </S>
  ),
  swords: (p) => (
    <S {...p}>
      <path d="M14 4h4v4l-7 7M6 4h4l7 7M4 15l3 3M6 20l3-3M20 15l-3 3M18 20l-3-3" />
    </S>
  ),
  wrench: (p) => (
    <S {...p}>
      <path d="M15.5 4a4.5 4.5 0 0 0-4 6.6L4.5 17.6a2 2 0 1 0 2.8 2.8l7-7A4.5 4.5 0 0 0 20 8.5l-2.6 2.6-2-2L18 6.5A4.5 4.5 0 0 0 15.5 4z" />
    </S>
  ),
  bolt: (p) => (
    <S {...p}>
      <path d="M13 3 5 13h5l-1 8 8-11h-5l1-7z" />
    </S>
  ),
  star: (p) => (
    <S {...p}>
      <path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1.1 5.3L12 16.3 7.3 18.4l1.1-5.3-3.9-3.6 5.2-.6L12 4z" />
    </S>
  ),
  gem: (p) => (
    <S {...p}>
      <path d="M7 4h10l3.5 5-8.5 11L3.5 9 7 4z" />
      <path d="M3.5 9h17M9 4l-2 5 5 11 5-11-2-5M9 9h6" />
    </S>
  ),
  moon: (p) => (
    <S {...p}>
      <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" />
    </S>
  ),
  sunrise: (p) => (
    <S {...p}>
      <path d="M12 4v3M5.5 6.5l1.5 1.5M18.5 6.5 17 8M3 18h18M6 18a6 6 0 0 1 12 0M8.5 14.5 12 11l3.5 3.5" />
    </S>
  ),

  // ---- lesson concepts ----
  gear: (p) => (
    <S {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.1 1.3M17.7 15.2l2.1 1.3M4.2 16.5l2.1-1.3M17.7 8.8l2.1-1.3" />
    </S>
  ),
  hand: (p) => (
    <S {...p}>
      <path d="M9 11V5.5a1.3 1.3 0 0 1 2.6 0V11M11.6 11V4.5a1.3 1.3 0 0 1 2.6 0V11M14.2 11V6a1.3 1.3 0 0 1 2.6 0v7.5a6 6 0 0 1-6 6c-2 0-3.3-.8-4.4-2.2L6 15c-.6-1-.3-2 .8-2.4.8-.3 1.5.1 2 .8l.7 1" />
    </S>
  ),
  terminal: (p) => (
    <S {...p}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M7 9.5l3 2.5-3 2.5M12.5 15h4" />
    </S>
  ),
  inbox: (p) => (
    <S {...p}>
      <path d="M4 13.5 6.5 6h11L20 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5z" />
      <path d="M4 13.5h4l1.2 2h5.6l1.2-2h4" />
    </S>
  ),
  comment: (p) => (
    <S {...p}>
      <path d="M4.5 6.5A1.5 1.5 0 0 1 6 5h12a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 18 16H9l-4 3.5V16H6a1.5 1.5 0 0 1-1.5-1.5v-8z" />
      <path d="M8 9h8M8 12h5" />
    </S>
  ),
  tag: (p) => (
    <S {...p}>
      <path d="M4 11.5V5.5A1.5 1.5 0 0 1 5.5 4h6l8 8-6 6-9.5-6.5z" />
      {dot(8, 8, 1.1)}
    </S>
  ),
  hash: (p) => (
    <S {...p}>
      <path d="M9 4 7.5 20M16.5 4 15 20M4.5 9h15M3.5 15h15" />
    </S>
  ),
  toggle: (p) => (
    <S {...p}>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <circle cx="16" cy="12" r="2.6" />
    </S>
  ),
  convert: (p) => (
    <S {...p}>
      <path d="M5 8h11l-2.5-2.5M19 16H8l2.5 2.5" />
    </S>
  ),
  keyboard: (p) => (
    <S {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 9.5h.01M11 9.5h.01M15 9.5h.01M17 9.5h.01M7 13h.01M8.5 15.5h7" />
    </S>
  ),
  scale: (p) => (
    <S {...p}>
      <path d="M6 18h12M6 6l-2.5 5h5L6 6zM18 6l-2.5 5h5L18 6zM6 6h12M12 5v13" />
    </S>
  ),
  link: (p) => (
    <S {...p}>
      <path d="M9.5 14.5 14.5 9.5M8 12l-1.5 1.5a3 3 0 0 0 4.2 4.2L12 16M16 12l1.5-1.5a3 3 0 0 0-4.2-4.2L12 8" />
    </S>
  ),
  pencil: (p) => (
    <S {...p}>
      <path d="M14.5 5.5 18.5 9.5 8 20H4v-4L14.5 5.5z" />
      <path d="M13 7 17 11" />
    </S>
  ),
  sort: (p) => (
    <S {...p}>
      <path d="M7 5v14M7 5 4.5 7.5M7 5l2.5 2.5M17 19V5M17 19l-2.5-2.5M17 19l2.5-2.5" />
    </S>
  ),
  scissors: (p) => (
    <S {...p}>
      <circle cx="7" cy="7" r="2.2" />
      <circle cx="7" cy="17" r="2.2" />
      <path d="M8.8 8.5 20 17M8.8 15.5 20 7M11 12l2 1.5" />
    </S>
  ),
  list: (p) => (
    <S {...p}>
      <path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11" />
      {dot(4.5, 6.5, 1.1)}
      {dot(4.5, 12, 1.1)}
      {dot(4.5, 17.5, 1.1)}
    </S>
  ),
  bookopen: (p) => (
    <S {...p}>
      <path d="M12 6.5C10.5 5 8 4.5 5 5v12c3-.5 5.5 0 7 1.5 1.5-1.5 4-2 7-1.5V5c-3-.5-5.5 0-7 1.5z" />
      <path d="M12 6.5v12" />
    </S>
  ),
  loop: (p) => (
    <S {...p}>
      <path d="M5.5 9A7 7 0 0 1 18 7.5l1.5 1.5M18.5 15A7 7 0 0 1 6 16.5L4.5 15" />
      <path d="M19.5 5.5V9H16M4.5 18.5V15H8" />
    </S>
  ),
  stop: (p) => (
    <S {...p}>
      <path d="M8 3.5h8L20.5 8v8L16 20.5H8L3.5 16V8L8 3.5z" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </S>
  ),
  sliders: (p) => (
    <S {...p}>
      <path d="M6 4v5M6 15v5M12 4v3M12 13v7M18 4v9M18 19v1" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="12" cy="10" r="2" />
      <circle cx="18" cy="16" r="2" />
    </S>
  ),
  returnArrow: (p) => (
    <S {...p}>
      <path d="M19 6v4a3 3 0 0 1-3 3H6M6 13l3.5-3.5M6 13l3.5 3.5" />
    </S>
  ),
  lambda: (p) => (
    <S {...p}>
      <path d="M7 19 12.5 8.5M17 19 10.5 6.5c-.3-.6-.8-1-1.6-1H7" />
    </S>
  ),
  binoculars: (p) => (
    <S {...p}>
      <path d="M9 6.5A1.5 1.5 0 0 0 6 6.5L4.5 15a2.5 2.5 0 0 0 5 .5V6.5zM15 6.5A1.5 1.5 0 0 1 18 6.5L19.5 15a2.5 2.5 0 0 1-5 .5V6.5zM9 8h6M9 11h6" />
    </S>
  ),
  spiral: (p) => (
    <S {...p}>
      <path d="M12 12a1.5 1.5 0 1 1 1.5 1.5A3 3 0 0 1 10.5 10 4.5 4.5 0 0 1 15 5.5 6 6 0 0 1 21 11.5 7.5 7.5 0 0 1 13.5 19 9 9 0 0 1 4.5 10" />
    </S>
  ),
  clapper: (p) => (
    <S {...p}>
      <path d="M4 9h16v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18V9z" />
      <path d="M4 9 5 5l14 1-1 3M8.5 5.3 7.5 9M13 5.7 12 9" />
    </S>
  ),
  dna: (p) => (
    <S {...p}>
      <path d="M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8" />
      <path d="M9 6.5h6M8.2 9.5h7.6M8.2 14.5h7.6M9 17.5h6" />
    </S>
  ),
  lock: (p) => (
    <S {...p}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14v2.5" />
    </S>
  ),
  masks: (p) => (
    <S {...p}>
      <path d="M4 5h7v5a3.5 3.5 0 0 1-7 0V5zM6 12c.5 1 1.5 1.5 1.5 1.5M13 8h7v5a3.5 3.5 0 0 1-7 0V8zM15 15c.5 1 1.5 1.5 1.5 1.5" />
    </S>
  ),
  store: (p) => (
    <S {...p}>
      <path d="M4 9.5 5 5h14l1 4.5M4 9.5h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" />
      <path d="M4 9.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0M9.5 19.5V14h5v5.5" />
    </S>
  ),
  download: (p) => (
    <S {...p}>
      <path d="M12 4v10M12 14l-3.5-3.5M12 14l3.5-3.5M5 18.5h14" />
    </S>
  ),
  flask: (p) => (
    <S {...p}>
      <path d="M10 4v5.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9.5V4M9 4h6M7.5 14h9" />
    </S>
  ),
  alert: (p) => (
    <S {...p}>
      <path d="M12 4.5 21 19H3L12 4.5z" />
      <path d="M12 10v4M12 16.5v.01" />
    </S>
  ),
  file: (p) => (
    <S {...p}>
      <path d="M6 3.5h7l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V3.5z" />
      <path d="M13 3.5V9h5M9 13h6M9 16h4" />
    </S>
  ),
  braces: (p) => (
    <S {...p}>
      <path d="M9 4c-2 0-2.5 1-2.5 3S6 12 4.5 12c1.5 0 2 1 2 3s.5 3 2.5 3M15 4c2 0 2.5 1 2.5 3s.5 2 2 2c-1.5 0-2 1-2 3s-.5 3-2.5 3" />
    </S>
  ),
  gift: (p) => (
    <S {...p}>
      <rect x="4.5" y="9" width="15" height="4" rx="1" />
      <path d="M6 13v6.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V13M12 9v12" />
      <path d="M12 9C11 6 9.5 5 8 5S5.5 6.5 7 8c1 1 5 1 5 1zM12 9c1-3 2.5-4 4-4s2.5 1.5 1 3c-1 1-5 1-5 1z" />
    </S>
  ),
  battery: (p) => (
    <S {...p}>
      <rect x="3.5" y="8" width="15" height="8" rx="2" />
      <path d="M20.5 10.5v3" />
      <path d="M11 9.5 8.5 12.5h3L9 15.5" />
    </S>
  ),
  pin: (p) => (
    <S {...p}>
      <path d="M12 21c0-4-4-5.5-4-9a4 4 0 0 1 8 0c0 3.5-4 5-4 9z" />
      <circle cx="12" cy="12" r="1.6" />
    </S>
  ),
  ruler: (p) => (
    <S {...p}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(-45 12 12)" />
      <path d="M8.5 8.5l1.5 1.5M11 6l2 2M13.5 3.5l1.5 1.5" />
    </S>
  ),
  search: (p) => (
    <S {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.8-3.8" />
    </S>
  ),
  globe: (p) => (
    <S {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14 0 17M12 3.5c-2.5 2.5-2.5 14 0 17" />
    </S>
  ),
  gradcap: (p) => (
    <S {...p}>
      <path d="M12 5 3 9l9 4 9-4-9-4z" />
      <path d="M6.5 11v4.5c0 1 2.5 2.5 5.5 2.5s5.5-1.5 5.5-2.5V11M21 9v4.5" />
    </S>
  ),
  code: (p) => (
    <S {...p}>
      <path d="M8.5 8.5 4 12l4.5 3.5M15.5 8.5 20 12l-4.5 3.5M13 5l-2 14" />
    </S>
  ),
  chart: (p) => (
    <S {...p}>
      <path d="M4 4v16h16" />
      <rect x="7" y="12" width="3" height="5" rx="0.5" />
      <rect x="11.5" y="8" width="3" height="9" rx="0.5" />
      <rect x="16" y="5" width="3" height="12" rx="0.5" />
    </S>
  ),
  scatter: (p) => (
    <S {...p}>
      <path d="M4 4v16h16" />
      {dot(8, 15, 1.1)}
      {dot(11, 11, 1.1)}
      {dot(10, 16, 1.1)}
      {dot(15, 9, 1.1)}
      {dot(17, 12, 1.1)}
      {dot(14, 14, 1.1)}
    </S>
  ),
  network: (p) => (
    <S {...p}>
      <path d="M5 12 12 7M5 12 12 17M12 7 19 12M12 17 19 12" />
      {dot(5, 12, 1.6)}
      {dot(12, 7, 1.6)}
      {dot(12, 17, 1.6)}
      {dot(19, 12, 1.6)}
    </S>
  ),
  robot: (p) => (
    <S {...p}>
      <rect x="5" y="7" width="14" height="12" rx="3" />
      <path d="M12 4v3M9.5 4.5v.01" />
      {dot(12, 4, 1)}
      {dot(9.5, 12.5, 1.3)}
      {dot(14.5, 12.5, 1.3)}
      <path d="M9.5 16h5M3.5 11v3M20.5 11v3" />
    </S>
  ),
  browser: (p) => (
    <S {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      {dot(6, 7, 0.7)}
      {dot(8.5, 7, 0.7)}
    </S>
  ),
  brush: (p) => (
    <S {...p}>
      <path d="M9.5 15.5 18.2 6.8a2 2 0 0 0-2.8-2.8L6.7 12.6" />
      <path d="M4 20c1-3.2 2.4-4.2 4-4 1.4.2 2.2 1.4 2 2.8-.2 1.6-2 2.2-6 1.2z" />
    </S>
  ),
  atom: (p) => (
    <S {...p}>
      {dot(12, 12, 1.5)}
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </S>
  ),
  hexagon: (p) => (
    <S {...p}>
      <path d="M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9L12 3z" />
      <path d="M8.5 14.5V9.5l3.5 2 3.5-2v5" />
    </S>
  ),
  image: (p) => (
    <S {...p}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M4 17l5-4 4 3 3-2.5 4 3.5" />
    </S>
  ),
};

export type GlyphName = keyof typeof GLYPHS;

export function Glyph({
  name,
  className,
  ...rest
}: { name: string } & P) {
  const Comp = GLYPHS[name] ?? GLYPHS.code;
  return <Comp className={className} {...rest} />;
}

// ---- mappings -----------------------------------------------------------
export const CATEGORY_ICON: Record<string, string> = {
  "Getting Started": "rocket",
  "Python Basics": "blocks",
  Operators: "operators",
  "Working with Strings": "quote",
  "Data Structures": "layers",
  "Control Flow": "branch",
  Functions: "puzzle",
  "Object-Oriented Programming": "columns",
  "Modules & Packages": "box",
  "Error Handling": "shield",
  "Files & Data": "folder",
  "Advanced Python": "cpu",
  "Writing Pythonic Code": "wand",
  "Where To Go Next": "compass",
  // Machine Learning
  "ML Foundations": "chart",
  "Supervised Learning": "target",
  "Unsupervised Learning": "scatter",
  "Model Quality": "scale",
  "Neural Networks": "network",
  "Putting It Together": "rocket",
  // Artificial Intelligence
  "AI Foundations": "robot",
  "Search & Problem Solving": "compass",
  "Games & Adversarial Search": "branch",
  "Learning Machines": "network",
  "Modern AI": "wand",
  // HTML
  "Getting Started with HTML": "browser",
  "Content & Media": "image",
  "Forms & Semantics": "list",
  // CSS
  "CSS Fundamentals": "brush",
  Layout: "layers",
  "Responsive & Motion": "wand",
  // JavaScript
  "JavaScript Foundations": "bolt",
  "Data & Logic": "hash",
  "The DOM & Events": "network",
  "Asynchronous JavaScript": "loop",
  // TypeScript
  "TypeScript Basics": "tag",
  "Structuring Types": "puzzle",
  "Advanced TypeScript": "cpu",
  // React
  "React Basics": "atom",
  "State & Interaction": "loop",
  Hooks: "pin",
  // Node
  "Node.js Basics": "hexagon",
  "Building a Server": "store",
  "APIs & Async": "network",
};

export const RANK_ICON: Record<string, string> = {
  Hatchling: "egg",
  Novice: "sprout",
  Apprentice: "book",
  Coder: "laptop",
  Pythonista: "snake",
  Artisan: "palette",
  Sorcerer: "wizardhat",
  Architect: "temple",
  Grandmaster: "trophy",
  "Python Legend": "crown",
};

export const BADGE_ICON: Record<string, string> = {
  "first-steps": "flag",
  "getting-warm": "flame",
  "chapter-champion": "medal",
  "halfway-there": "half",
  completionist: "crown",
  "quiz-whiz": "target",
  challenger: "swords",
  tinkerer: "wrench",
  "streak-3": "flame",
  "streak-7": "bolt",
  "xp-500": "star",
  "xp-1500": "gem",
  "night-owl": "moon",
  "early-bird": "sunrise",
};

export const LESSON_ICON: Record<string, string> = {
  "what-is-python": "snake",
  "installing-python": "download",
  "hello-world": "hand",
  "how-python-works": "gear",
  "the-repl": "terminal",
  variables: "inbox",
  comments: "comment",
  "data-types": "tag",
  numbers: "hash",
  "booleans-and-none": "toggle",
  "type-conversion": "convert",
  "input-output": "keyboard",
  "arithmetic-operators": "operators",
  "comparison-operators": "scale",
  "logical-operators": "link",
  "assignment-operators": "pencil",
  "operator-precedence": "sort",
  "strings-basics": "quote",
  "string-methods": "wrench",
  "string-formatting": "palette",
  "string-slicing": "scissors",
  lists: "list",
  tuples: "box",
  sets: "target",
  dictionaries: "bookopen",
  "list-comprehensions": "bolt",
  "if-statements": "branch",
  "for-loops": "loop",
  "while-loops": "loop",
  "break-continue-pass": "stop",
  "match-statements": "branch",
  "defining-functions": "puzzle",
  "function-arguments": "sliders",
  "return-values": "returnArrow",
  "args-kwargs": "sliders",
  "lambda-functions": "lambda",
  "variable-scope": "binoculars",
  recursion: "spiral",
  "classes-and-objects": "columns",
  "the-init-method": "clapper",
  inheritance: "dna",
  encapsulation: "lock",
  polymorphism: "masks",
  "dunder-methods": "wand",
  "modules-and-imports": "box",
  "the-standard-library": "store",
  "pip-and-packages": "download",
  "virtual-environments": "flask",
  exceptions: "shield",
  "raising-and-custom-exceptions": "alert",
  "reading-writing-files": "file",
  "working-with-json": "braces",
  decorators: "gift",
  generators: "battery",
  iterators: "loop",
  "context-managers": "sliders",
  closures: "pin",
  "pep8-and-style": "ruler",
  "type-hints": "tag",
  "builtin-tools": "wrench",
  "regular-expressions": "search",
  "popular-libraries": "globe",
  "your-next-steps": "gradcap",
  // Machine Learning
  "what-is-ml": "chart",
  "types-of-ml": "layers",
  "data-and-features": "hash",
  "linear-regression": "scatter",
  "gradient-descent": "chart",
  "logistic-regression": "toggle",
  "k-nearest-neighbors": "scatter",
  "decision-trees": "branch",
  "k-means-clustering": "scatter",
  "overfitting-underfitting": "scale",
  "evaluating-models": "target",
  "neural-networks-basics": "network",
  "ml-in-practice": "rocket",
  // Artificial Intelligence
  "what-is-ai": "robot",
  "intelligent-agents": "robot",
  "history-of-ai": "book",
  "problem-solving-as-search": "search",
  "bfs-and-dfs": "branch",
  "a-star-search": "compass",
  minimax: "branch",
  "alpha-beta-pruning": "scissors",
  "neural-networks-and-deep-learning": "network",
  "the-perceptron": "network",
  "how-networks-learn": "chart",
  "nlp-and-llms": "comment",
  "computer-vision": "target",
  "ai-ethics-and-future": "shield",
  // HTML
  "what-is-html": "browser",
  "how-the-web-works": "globe",
  "html-document-structure": "file",
  "headings-and-text": "quote",
  "links-and-navigation": "link",
  "images-and-media": "image",
  "forms-and-inputs": "keyboard",
  "semantic-html": "layers",
  // CSS
  "what-is-css": "brush",
  "css-selectors": "target",
  "colors-and-units": "palette",
  "cascade-and-specificity": "layers",
  "the-box-model": "box",
  flexbox: "columns",
  "css-grid": "blocks",
  "responsive-design": "browser",
  "transitions-and-animations": "wand",
  // JavaScript
  "what-is-javascript": "bolt",
  "variables-and-data-types": "inbox",
  "operators-and-expressions": "operators",
  arrays: "list",
  objects: "braces",
  conditionals: "branch",
  loops: "loop",
  "javascript-functions": "puzzle",
  "the-dom": "network",
  "events-and-listeners": "target",
  "promises-and-async": "loop",
  "the-event-loop": "loop",
  // TypeScript
  "what-is-typescript": "tag",
  "basic-types": "tag",
  "typing-functions": "puzzle",
  "interfaces-and-types": "braces",
  "unions-and-narrowing": "branch",
  generics: "cpu",
  "typescript-with-react": "atom",
  // React
  "what-is-react": "atom",
  jsx: "braces",
  "components-and-props": "blocks",
  "state-with-usestate": "loop",
  "handling-events": "target",
  "conditional-rendering": "branch",
  "lists-and-keys": "list",
  "the-useeffect-hook": "pin",
  "custom-hooks": "pin",
  // Node
  "what-is-nodejs": "hexagon",
  "modules-and-npm": "box",
  "the-node-runtime": "loop",
  "the-file-system": "folder",
  "http-server": "store",
  "express-and-routing": "network",
  "building-a-rest-api": "network",
  "async-in-node": "loop",
};

export function categoryGlyph(name: string): string {
  return CATEGORY_ICON[name] ?? "code";
}
export function rankGlyph(name: string): string {
  return RANK_ICON[name] ?? "egg";
}
export function badgeGlyph(id: string): string {
  return BADGE_ICON[id] ?? "star";
}
export function lessonGlyph(slug: string): string {
  return LESSON_ICON[slug] ?? "code";
}

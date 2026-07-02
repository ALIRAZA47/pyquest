import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <div className="text-7xl">🐍</div>
        <h1 className="mt-4 text-3xl font-black tracking-tight">
          <span className="font-mono text-accent">IndexError</span>: page not found
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Python is 0-indexed, but this page is out of range. Let's get you back
          on track.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-border bg-surface px-5 py-2.5 font-semibold text-fg transition-colors hover:border-accent/50"
          >
            Home
          </Link>
          <Link
            href="/learn"
            className="rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-2.5 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            Go to lessons
          </Link>
        </div>
      </div>
    </div>
  );
}

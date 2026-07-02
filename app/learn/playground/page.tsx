"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PyRunner } from "@/components/PyRunner";
import { Glyph } from "@/components/glyphs";
import { SparklesIcon } from "@/components/Icons";

const EXAMPLES: { label: string; code: string }[] = [
  {
    label: "Hello",
    code: 'print("Hello, Python! 🐍")\nname = "friend"\nprint(f"Welcome, {name}!")',
  },
  {
    label: "Loop a triangle",
    code: 'for i in range(1, 6):\n    print("★" * i)',
  },
  {
    label: "A little math",
    code: "import math\n\nradius = 5\narea = math.pi * radius ** 2\nprint(f\"Area of the circle: {area:.2f}\")",
  },
  {
    label: "FizzBuzz",
    code: 'for n in range(1, 16):\n    if n % 15 == 0:\n        print("FizzBuzz")\n    elif n % 3 == 0:\n        print("Fizz")\n    elif n % 5 == 0:\n        print("Buzz")\n    else:\n        print(n)',
  },
  {
    label: "List comprehension",
    code: "squares = [x ** 2 for x in range(1, 9)]\nprint(squares)\nprint(\"Total:\", sum(squares))",
  },
  {
    label: "A tiny class",
    code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} says woof!"\n\nrex = Dog("Rex")\nprint(rex.speak())',
  },
];

export default function PlaygroundPage() {
  const [example, setExample] = useState(EXAMPLES[0]);
  // Remount the runner when the example changes so it reseeds.
  const [seed, setSeed] = useState(0);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent-2/15 text-accent">
            <Glyph name="flask" className="h-6 w-6" />
          </span>
          <h1 className="text-3xl font-black tracking-tight text-fg">Playground</h1>
        </div>
        <p className="mt-2 max-w-xl text-muted">
          A real Python interpreter, right in your browser. Type anything, hit{" "}
          <span className="font-semibold text-fg">Run</span>, and see it execute —
          no setup required.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-faint">
            <SparklesIcon className="h-3.5 w-3.5" /> Try an example
          </span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setExample(ex);
                setSeed((s) => s + 1);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                example.label === ex.label
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:border-accent/40 hover:text-accent"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <PyRunner
          key={seed}
          initialCode={example.code}
          caption="playground.py"
          minRows={8}
        />

        <p className="mt-3 text-sm text-faint">
          Tip: the first run downloads the Python runtime (a few MB, once). After
          that, everything runs instantly.
        </p>
      </motion.div>
    </div>
  );
}

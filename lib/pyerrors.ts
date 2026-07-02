// Turns a raw Python traceback into a friendly, beginner-oriented explanation.
// Used by the live code runner so errors teach instead of intimidate.

export interface FriendlyError {
  type: string;
  title: string;
  explanation: string;
  tip: string;
}

interface Rule {
  match: RegExp;
  title: string;
  explanation: string;
  tip: string;
}

const RULES: Record<string, Rule> = {
  SyntaxError: {
    match: /SyntaxError/,
    title: "Python couldn't understand your code",
    explanation:
      "There's a typo in the structure of the code — often a missing colon `:`, an unclosed bracket/quote, or an `=` where `==` was meant.",
    tip: "Check the line shown for a missing `:` at the end of an `if`/`for`/`def`, or a bracket/quote that isn't closed.",
  },
  IndentationError: {
    match: /IndentationError|TabError/,
    title: "The indentation is off",
    explanation:
      "Python uses indentation (spaces) to group code. A line has too many or too few spaces, or mixes tabs and spaces.",
    tip: "Indent the body of loops, ifs and functions by a consistent 4 spaces.",
  },
  NameError: {
    match: /NameError/,
    title: "A name isn't defined",
    explanation:
      "You used a variable or function name that Python hasn't seen yet — usually a typo, or it's used before it's created.",
    tip: "Check the spelling, and make sure the variable is assigned before you use it.",
  },
  TypeError: {
    match: /TypeError/,
    title: "Wrong type of value",
    explanation:
      "An operation got a value of the wrong type — like adding a number to a string, or calling something that isn't a function.",
    tip: "Convert types explicitly, e.g. `str(number)` or `int(text)`, before combining them.",
  },
  ValueError: {
    match: /ValueError/,
    title: "Right type, wrong value",
    explanation:
      "The type was correct but the value didn't make sense — like `int(\"hello\")`, which can't become a number.",
    tip: "Make sure the value is valid for what you're doing (e.g. the text actually contains a number).",
  },
  IndexError: {
    match: /IndexError/,
    title: "That index is out of range",
    explanation:
      "You asked for a position that doesn't exist. A list of 3 items has indexes 0, 1, 2 — index 3 is too far.",
    tip: "Remember lists start at 0. Use `len(mylist)` to check the size, and `mylist[-1]` for the last item.",
  },
  KeyError: {
    match: /KeyError/,
    title: "That key isn't in the dictionary",
    explanation:
      "You looked up a key that doesn't exist in the dict.",
    tip: "Use `d.get(key)` to safely return `None` instead of crashing, or check `if key in d:` first.",
  },
  ZeroDivisionError: {
    match: /ZeroDivisionError/,
    title: "You divided by zero",
    explanation:
      "Math can't divide a number by zero, so Python stops.",
    tip: "Check the divisor isn't 0 before dividing, e.g. `if b != 0:`.",
  },
  AttributeError: {
    match: /AttributeError/,
    title: "That attribute or method doesn't exist",
    explanation:
      "You called `.something()` on an object that doesn't have it — often a typo or the wrong type of object.",
    tip: "Check the spelling of the method, and confirm the object is the type you expect.",
  },
  ModuleNotFoundError: {
    match: /ModuleNotFoundError|ImportError/,
    title: "That module couldn't be imported",
    explanation:
      "Python couldn't find the module you tried to import. In this in-browser runtime only the standard library is available.",
    tip: "Stick to built-in modules like `math`, `random`, `json`, and `datetime` here.",
  },
  RecursionError: {
    match: /RecursionError/,
    title: "Infinite recursion",
    explanation:
      "A function kept calling itself without ever stopping, so Python hit its limit.",
    tip: "Make sure your recursive function has a base case that returns without calling itself.",
  },
};

export function explainError(raw: string): FriendlyError | null {
  if (!raw) return null;
  const lines = raw.trim().split("\n").filter((l) => l.trim());
  const last = lines[lines.length - 1] ?? raw;

  for (const key of Object.keys(RULES)) {
    const rule = RULES[key];
    if (rule.match.test(raw)) {
      return {
        type: key,
        title: rule.title,
        explanation: rule.explanation,
        tip: rule.tip,
      };
    }
  }
  // Generic fallback if we can spot "SomethingError: message"
  const m = /([A-Za-z_]+Error|Exception):\s*(.*)$/.exec(last);
  if (m) {
    return {
      type: m[1],
      title: `${m[1]}`,
      explanation: m[2] || "Something went wrong while running your code.",
      tip: "Read the last line of the traceback — it usually names the problem.",
    };
  }
  return null;
}

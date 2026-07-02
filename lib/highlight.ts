// A small, dependency-free Python tokenizer used to syntax-highlight code
// blocks. It returns a flat list of tokens; the CodeBlock component renders
// each with a `tok-<type>` class that is themed via CSS variables.

export type TokenType =
  | "keyword"
  | "builtin"
  | "string"
  | "number"
  | "comment"
  | "func"
  | "class"
  | "self"
  | "decorator"
  | "op"
  | "punct"
  | "const"
  | "call"
  | "plain";

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
  "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass",
  "raise", "return", "try", "while", "with", "yield", "match", "case",
]);

const CONSTANTS = new Set(["True", "False", "None", "Ellipsis", "NotImplemented", "__name__"]);

const BUILTINS = new Set([
  "print", "len", "range", "input", "int", "float", "str", "bool", "list",
  "tuple", "dict", "set", "frozenset", "type", "isinstance", "issubclass",
  "abs", "round", "min", "max", "sum", "sorted", "reversed", "enumerate",
  "zip", "map", "filter", "any", "all", "open", "super", "object", "repr",
  "format", "id", "hash", "iter", "next", "hasattr", "getattr", "setattr",
  "delattr", "callable", "dir", "help", "vars", "globals", "locals", "bytes",
  "bytearray", "complex", "divmod", "pow", "chr", "ord", "hex", "oct", "bin",
  "ascii", "slice", "property", "staticmethod", "classmethod", "exec", "eval",
  "Exception", "ValueError", "TypeError", "KeyError", "IndexError",
  "ZeroDivisionError", "FileNotFoundError", "RuntimeError", "StopIteration",
  "AttributeError", "NameError", "ImportError", "OSError", "NotImplementedError",
]);

const OP_CHARS = new Set("+-*/%=<>!&|^~@".split(""));
const PUNCT_CHARS = new Set("()[]{}:;,.".split(""));

function isIdentStart(ch: string): boolean {
  return /[A-Za-z_]/.test(ch);
}
function isIdentPart(ch: string): boolean {
  return /[A-Za-z0-9_]/.test(ch);
}

export function tokenizePython(code: string): Token[] {
  const tokens: Token[] = [];
  const n = code.length;
  let i = 0;

  const push = (type: TokenType, value: string) => {
    tokens.push({ type, value });
  };

  // The value of the previous meaningful token (skipping whitespace/comments),
  // used to classify identifiers by context (e.g. the name after `def`).
  const prevMeaningfulValue = (): string | undefined => {
    for (let t = tokens.length - 1; t >= 0; t--) {
      const tk = tokens[t];
      if (tk.type === "comment") continue;
      if (tk.value.trim() === "") continue;
      return tk.value;
    }
    return undefined;
  };

  const atLineStart = (pos: number): boolean => {
    let j = pos - 1;
    while (j >= 0 && (code[j] === " " || code[j] === "\t")) j--;
    return j < 0 || code[j] === "\n";
  };

  while (i < n) {
    const ch = code[i];

    // Whitespace (kept verbatim so indentation renders)
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      let j = i + 1;
      while (j < n && /[ \t\r\n]/.test(code[j])) j++;
      tokens.push({ type: "plain", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Comment
    if (ch === "#") {
      let j = i + 1;
      while (j < n && code[j] !== "\n") j++;
      push("comment", code.slice(i, j));
      i = j;
      continue;
    }

    // Decorator (@ at the start of a line)
    if (ch === "@" && atLineStart(i)) {
      let j = i + 1;
      while (j < n && (isIdentPart(code[j]) || code[j] === ".")) j++;
      push("decorator", code.slice(i, j));
      i = j;
      continue;
    }

    // Strings (with optional prefixes: r, b, f, u and combinations)
    const prefixMatch = /^(?:[rRbBfFuU]{0,3})?/.exec(code.slice(i, i + 3));
    let pfxLen = 0;
    if (prefixMatch) {
      const pfx = prefixMatch[0];
      // Only treat as string prefix if immediately followed by a quote
      if (pfx.length && (code[i + pfx.length] === '"' || code[i + pfx.length] === "'")) {
        pfxLen = pfx.length;
      }
    }
    const quoteIdx = i + pfxLen;
    if (code[quoteIdx] === '"' || code[quoteIdx] === "'") {
      const q = code[quoteIdx];
      const triple = code.slice(quoteIdx, quoteIdx + 3) === q + q + q;
      const isRaw = /[rR]/.test(code.slice(i, quoteIdx));
      let j = quoteIdx + (triple ? 3 : 1);
      if (triple) {
        while (j < n && code.slice(j, j + 3) !== q + q + q) {
          if (!isRaw && code[j] === "\\") j++;
          j++;
        }
        j = Math.min(n, j + 3);
      } else {
        while (j < n && code[j] !== q && code[j] !== "\n") {
          if (!isRaw && code[j] === "\\") j++;
          j++;
        }
        if (j < n && code[j] === q) j++;
      }
      push("string", code.slice(i, j));
      i = j;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(code[i + 1] || ""))) {
      const rest = code.slice(i);
      const m =
        /^(0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?[jJ]?)/.exec(
          rest
        );
      if (m) {
        push("number", m[0]);
        i += m[0].length;
        continue;
      }
    }

    // Identifiers / keywords
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (j < n && isIdentPart(code[j])) j++;
      const word = code.slice(i, j);
      // Peek ahead to see if this is a call (next non-space char is "(")
      let k = j;
      while (k < n && (code[k] === " " || code[k] === "\t")) k++;
      const isCall = code[k] === "(";
      const prev = prevMeaningfulValue();

      let type: TokenType;
      if (KEYWORDS.has(word)) type = "keyword";
      else if (CONSTANTS.has(word)) type = "const";
      else if (word === "self" || word === "cls") type = "self";
      else if (prev === "def") type = "func";
      else if (prev === "class") type = "class";
      else if (BUILTINS.has(word)) type = "builtin";
      else if (isCall) type = "call";
      else if (/^[A-Z]/.test(word)) type = "class";
      else type = "plain";

      push(type, word);
      i = j;
      continue;
    }

    // Operators
    if (OP_CHARS.has(ch)) {
      let j = i + 1;
      while (j < n && OP_CHARS.has(code[j])) j++;
      push("op", code.slice(i, j));
      i = j;
      continue;
    }

    // Punctuation
    if (PUNCT_CHARS.has(ch)) {
      push("punct", ch);
      i += 1;
      continue;
    }

    // Anything else
    tokens.push({ type: "plain", value: ch });
    i += 1;
  }

  return tokens;
}

import { tokenizePython, type Token } from "./highlight";

// Multi-language tokenizers that reuse the existing `tok-*` token types/colors.
// HTML & CSS tokens are mapped onto the shared palette (e.g. tag → keyword,
// attribute → builtin, property → keyword, value → builtin).

export type { Token };

// ---------------- JavaScript / TypeScript / JSX ----------------
const JS_KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "do", "switch", "case", "break", "continue", "new", "class", "extends",
  "super", "import", "export", "from", "as", "default", "async", "await",
  "yield", "try", "catch", "finally", "throw", "delete", "void", "in", "of",
  "typeof", "instanceof", "interface", "type", "enum", "implements", "public",
  "private", "protected", "readonly", "static", "namespace", "declare",
  "abstract", "keyof", "infer", "satisfies", "get", "set",
]);
const JS_CONSTS = new Set(["true", "false", "null", "undefined", "NaN", "Infinity", "this"]);
const JS_BUILTINS = new Set([
  "console", "document", "window", "Math", "JSON", "Object", "Array", "String",
  "Number", "Boolean", "Promise", "Map", "Set", "Symbol", "Date", "RegExp",
  "Error", "fetch", "setTimeout", "setInterval", "clearTimeout", "clearInterval",
  "require", "module", "exports", "process", "Buffer", "parseInt", "parseFloat",
  "isNaN", "React", "useState", "useEffect", "useRef", "useContext", "useMemo",
  "useCallback",
]);

const isIdStart = (c: string) => /[A-Za-z_$]/.test(c);
const isIdPart = (c: string) => /[A-Za-z0-9_$]/.test(c);
const JS_OPS = new Set("+-*/%=<>!&|^~?:".split(""));
const PUNCT = new Set("()[]{}.,;".split(""));

export function tokenizeJS(code: string): Token[] {
  const out: Token[] = [];
  const n = code.length;
  let i = 0;
  const push = (type: Token["type"], value: string) => out.push({ type, value });
  const prevMeaningful = () => {
    for (let t = out.length - 1; t >= 0; t--) {
      if (out[t].type === "comment" || out[t].value.trim() === "") continue;
      return out[t].value;
    }
    return "";
  };

  while (i < n) {
    const ch = code[i];
    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < n && /\s/.test(code[j])) j++;
      push("plain", code.slice(i, j));
      i = j;
      continue;
    }
    // comments
    if (ch === "/" && code[i + 1] === "/") {
      let j = i + 2;
      while (j < n && code[j] !== "\n") j++;
      push("comment", code.slice(i, j));
      i = j;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(code[j] === "*" && code[j + 1] === "/")) j++;
      j = Math.min(n, j + 2);
      push("comment", code.slice(i, j));
      i = j;
      continue;
    }
    // strings
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      while (j < n && code[j] !== ch) {
        if (code[j] === "\\") j++;
        j++;
      }
      j = Math.min(n, j + 1);
      push("string", code.slice(i, j));
      i = j;
      continue;
    }
    // numbers
    if (/[0-9]/.test(ch)) {
      const m = /^(0[xX][0-9a-fA-F_]+|\d[\d_]*\.?\d*(?:[eE][+-]?\d+)?)/.exec(code.slice(i));
      if (m) {
        push("number", m[0]);
        i += m[0].length;
        continue;
      }
    }
    // JSX tag: < or </ followed by a letter
    if (ch === "<" && (isIdStart(code[i + 1]) || code[i + 1] === "/")) {
      let j = i + 1;
      if (code[j] === "/") j++;
      push("punct", code.slice(i, j));
      i = j;
      let k = i;
      while (k < n && /[A-Za-z0-9._-]/.test(code[k])) k++;
      if (k > i) {
        const name = code.slice(i, k);
        push(/^[A-Z]/.test(name) ? "class" : "keyword", name);
        i = k;
      }
      continue;
    }
    // identifiers
    if (isIdStart(ch)) {
      let j = i + 1;
      while (j < n && isIdPart(code[j])) j++;
      const word = code.slice(i, j);
      let k = j;
      while (k < n && /[ \t]/.test(code[k])) k++;
      const isCall = code[k] === "(";
      const prev = prevMeaningful();
      let type: Token["type"];
      if (JS_KEYWORDS.has(word)) type = "keyword";
      else if (JS_CONSTS.has(word)) type = word === "this" ? "self" : "const";
      else if (prev === "function" || prev === "class") type = "func";
      else if (JS_BUILTINS.has(word)) type = "builtin";
      else if (isCall) type = "call";
      else if (/^[A-Z]/.test(word)) type = "class";
      else type = "plain";
      push(type, word);
      i = j;
      continue;
    }
    if (JS_OPS.has(ch)) {
      let j = i + 1;
      while (j < n && JS_OPS.has(code[j]) && !(code[j] === "/" && (code[j + 1] === "/" || code[j + 1] === "*"))) j++;
      push("op", code.slice(i, j));
      i = j;
      continue;
    }
    if (PUNCT.has(ch)) {
      push("punct", ch);
      i += 1;
      continue;
    }
    push("plain", ch);
    i += 1;
  }
  return out;
}

// ---------------- CSS ----------------
export function tokenizeCSS(code: string): Token[] {
  const out: Token[] = [];
  const n = code.length;
  let i = 0;
  let inBlock = false;
  let inValue = false;
  const push = (type: Token["type"], value: string) => out.push({ type, value });

  while (i < n) {
    const ch = code[i];
    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < n && /\s/.test(code[j])) j++;
      push("plain", code.slice(i, j));
      i = j;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(code[j] === "*" && code[j + 1] === "/")) j++;
      j = Math.min(n, j + 2);
      push("comment", code.slice(i, j));
      i = j;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && code[j] !== ch) {
        if (code[j] === "\\") j++;
        j++;
      }
      j = Math.min(n, j + 1);
      push("string", code.slice(i, j));
      i = j;
      continue;
    }
    if (ch === "{") {
      inBlock = true;
      inValue = false;
      push("punct", ch);
      i++;
      continue;
    }
    if (ch === "}") {
      inBlock = false;
      inValue = false;
      push("punct", ch);
      i++;
      continue;
    }
    if (ch === ":" && inBlock) {
      inValue = true;
      push("punct", ch);
      i++;
      continue;
    }
    if (ch === ";") {
      inValue = false;
      push("punct", ch);
      i++;
      continue;
    }
    if (ch === "#" && inValue) {
      // hex color
      let j = i + 1;
      while (j < n && /[0-9a-fA-F]/.test(code[j])) j++;
      push("number", code.slice(i, j));
      i = j;
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === "-" && /[0-9.]/.test(code[i + 1] || ""))) {
      const m = /^-?\d*\.?\d+(px|em|rem|%|vw|vh|vmin|vmax|s|ms|deg|fr|ch|pt)?/.exec(code.slice(i));
      if (m) {
        push("number", m[0]);
        i += m[0].length;
        continue;
      }
    }
    if (ch === "@") {
      let j = i + 1;
      while (j < n && /[A-Za-z-]/.test(code[j])) j++;
      push("keyword", code.slice(i, j));
      i = j;
      continue;
    }
    if (/[A-Za-z_.#*[\-]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_\-]/.test(code[j])) j++;
      if (j === i) j = i + 1; // punctuation-ish selector char
      const word = code.slice(i, j);
      // property name (in block, not value) → keyword; selector → class; value ident → builtin
      const type: Token["type"] = inValue ? "builtin" : inBlock ? "keyword" : "class";
      push(type, word);
      i = j;
      continue;
    }
    push("punct", ch);
    i++;
  }
  return out;
}

// ---------------- HTML ----------------
export function tokenizeHTML(code: string): Token[] {
  const out: Token[] = [];
  const n = code.length;
  let i = 0;
  const push = (type: Token["type"], value: string) => out.push({ type, value });

  while (i < n) {
    const ch = code[i];
    if (ch === "<" && code[i + 1] === "!" && code.slice(i, i + 4) === "<!--") {
      let j = i + 4;
      while (j < n && code.slice(j, j + 3) !== "-->") j++;
      j = Math.min(n, j + 3);
      push("comment", code.slice(i, j));
      i = j;
      continue;
    }
    if (ch === "<") {
      // opening/closing/doctype tag
      let j = i + 1;
      if (code[j] === "/") j++;
      if (code[j] === "!") j++;
      push("punct", code.slice(i, j));
      i = j;
      // tag name
      let k = i;
      while (k < n && /[A-Za-z0-9-]/.test(code[k])) k++;
      if (k > i) {
        push("keyword", code.slice(i, k));
        i = k;
      }
      // inside the tag until '>'
      while (i < n && code[i] !== ">") {
        const c = code[i];
        if (/\s/.test(c)) {
          let s = i + 1;
          while (s < n && /\s/.test(code[s])) s++;
          push("plain", code.slice(i, s));
          i = s;
        } else if (c === '"' || c === "'") {
          let s = i + 1;
          while (s < n && code[s] !== c) s++;
          s = Math.min(n, s + 1);
          push("string", code.slice(i, s));
          i = s;
        } else if (c === "=" || c === "/") {
          push("op", c);
          i++;
        } else if (/[A-Za-z-]/.test(c)) {
          let s = i;
          while (s < n && /[A-Za-z0-9-]/.test(code[s])) s++;
          push("builtin", code.slice(i, s));
          i = s;
        } else {
          push("plain", c);
          i++;
        }
      }
      if (i < n && code[i] === ">") {
        push("punct", ">");
        i++;
      }
      continue;
    }
    // text content until next '<'
    let j = i;
    while (j < n && code[j] !== "<") j++;
    push("plain", code.slice(i, j));
    i = j;
  }
  return out;
}

// ---------------- dispatcher ----------------
export function tokenizeCode(code: string, lang?: string): Token[] {
  const l = (lang || "").toLowerCase();
  if (l === "js" || l === "javascript" || l === "ts" || l === "typescript" ||
      l === "jsx" || l === "tsx" || l === "react" || l === "node") {
    return tokenizeJS(code);
  }
  if (l === "css" || l === "scss") return tokenizeCSS(code);
  if (l === "html" || l === "xml" || l === "markup") return tokenizeHTML(code);
  if (l === "py" || l === "python" || l === "") return tokenizePython(code);
  // bash/json/other → plain-ish via JS tokenizer (handles strings/numbers/comments okay)
  if (l === "json") return tokenizeJS(code);
  return tokenizePython(code);
}

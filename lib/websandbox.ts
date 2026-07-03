// In-browser runner for the web courses (HTML / CSS / JS / TS / React).
//
// Everything runs inside a sandboxed <iframe> with `sandbox="allow-scripts"`
// and WITHOUT `allow-same-origin`, so learner code gets an opaque origin and
// can never read the parent DOM, localStorage ("quest:game:v1") or cookies.
// The iframe talks back to the app only through postMessage.
//
// - html  → the code is the document (live visual preview)
// - css   → the CSS is applied to an auto-generated demo DOM built from its
//           own selectors, so grid/flex/spacing rules actually show something
// - js    → run as-is; console.* is captured and streamed to an output panel
// - ts    → TypeScript types are stripped (Babel, lazy-loaded) then run like JS
// - react → JSX/TS is transpiled, a component is auto-mounted for a live preview
//
// Node is intentionally NOT runnable in the browser (require/fs/http/process).

export type WebRunMode = "html" | "css" | "js" | "ts" | "react";

const LANG_TO_MODE: Record<string, WebRunMode> = {
  html: "html",
  css: "css",
  js: "js",
  javascript: "js",
  ts: "ts",
  typescript: "ts",
  jsx: "react",
  tsx: "react",
  react: "react",
};

/** Returns the sandbox mode for a code language, or null if it can't run. */
export function webRunMode(lang: string | undefined): WebRunMode | null {
  if (!lang) return null;
  return LANG_TO_MODE[lang.toLowerCase()] ?? null;
}

/** Modes that render a visual preview pane. */
export function hasPreview(mode: WebRunMode): boolean {
  return mode === "html" || mode === "css" || mode === "react";
}

/** Modes that stream console output to a text panel. */
export function hasConsole(mode: WebRunMode): boolean {
  return mode === "js" || mode === "ts" || mode === "react";
}

// ---------------------------------------------------------------------------
// Lazy transpiler (Babel standalone), mirroring the Pyodide loader pattern.
// Only fetched the first time a TS or React block is run.
// ---------------------------------------------------------------------------

const BABEL_CDN = "https://cdn.jsdelivr.net/npm/@babel/standalone@7.24.7/babel.min.js";
const REACT_CDN = "https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js";
const REACT_DOM_CDN = "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js";

interface BabelStandalone {
  transform: (
    code: string,
    opts: { presets?: unknown[]; filename?: string }
  ) => { code: string | null };
}

declare global {
  interface Window {
    Babel?: BabelStandalone;
  }
}

let babelPromise: Promise<BabelStandalone> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load the code compiler."));
    document.head.appendChild(s);
  });
}

export function needsCompiler(mode: WebRunMode): boolean {
  return mode === "ts" || mode === "react";
}

async function loadBabel(): Promise<BabelStandalone> {
  if (babelPromise) return babelPromise;
  babelPromise = (async () => {
    await injectScript(BABEL_CDN);
    if (!window.Babel) throw new Error("Code compiler unavailable.");
    return window.Babel;
  })();
  return babelPromise;
}

/** True once Babel has been requested (so the UI can skip the "compiling" note). */
export function isCompilerReady(): boolean {
  return babelPromise !== null;
}

// ---------------------------------------------------------------------------
// Source transforms
// ---------------------------------------------------------------------------

// Strip ES module syntax that can't run in a plain <script> global scope.
function stripModuleSyntax(code: string): string {
  return code
    // `import X from '...'` / `import {a,b} from '...'` / `import '...'`
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?[^\n]*$/gm, "")
    .replace(/^\s*import\s+['"][^'"]+['"];?[^\n]*$/gm, "")
    // `export default X;` → `X;`  /  `export default function`/`class` → keep decl
    .replace(/^\s*export\s+default\s+(?=function|class)/gm, "")
    .replace(/^\s*export\s+default\s+/gm, "")
    // `export const/function/class ...` → drop the `export` keyword
    .replace(/^\s*export\s+(?=(const|let|var|function|class)\b)/gm, "");
}

// Pick the most likely top-level React component to auto-render: the last
// Capitalized function/const declaration in the source.
function detectComponent(code: string): string | null {
  const re = /(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/g;
  let m: RegExpExecArray | null;
  let last: string | null = null;
  while ((m = re.exec(code))) last = m[1];
  return last;
}

export interface TranspileResult {
  code: string;
  component?: string | null;
  error?: string;
}

/** Transpile TS / React source to runnable JS. JS is returned unchanged. */
export async function transpile(
  raw: string,
  mode: WebRunMode
): Promise<TranspileResult> {
  if (mode === "js" || mode === "html" || mode === "css") return { code: raw };

  const stripped = mode === "react" ? stripModuleSyntax(raw) : raw;
  const component = mode === "react" ? detectComponent(stripped) : null;

  try {
    const Babel = await loadBabel();
    const presets: unknown[] =
      mode === "react"
        ? [["typescript", { isTSX: true, allExtensions: true }], "react"]
        : [["typescript", { allowDeclareFields: true }]];
    const out = Babel.transform(stripped, {
      presets,
      filename: mode === "react" ? "lesson.tsx" : "lesson.ts",
    });
    return { code: out.code ?? "", component };
  } catch (e) {
    return { code: "", component, error: e instanceof Error ? e.message : String(e) };
  }
}

// ---------------------------------------------------------------------------
// Demo-DOM generation for CSS previews
// ---------------------------------------------------------------------------

const CSS_BASELINE = `
  *{box-sizing:border-box}
  html,body{margin:0}
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:18px;color:#1a1a2e;background:#fff;line-height:1.5}
  .q-label{font:600 10px system-ui;letter-spacing:.08em;text-transform:uppercase;color:#9aa0b4;margin:18px 0 6px}
  .q-label:first-child{margin-top:0}
  /* Give auto-generated demo children a visible fill so layout is obvious. */
  .q-demo>*{background:#e0e7ff;color:#3730a3;border-radius:8px;padding:14px;font:600 14px system-ui;display:flex;align-items:center;justify-content:center;min-height:46px;border:1px solid #c7d2fe}
`;

// Extract class names and a few common element selectors from CSS so we can
// synthesise a representative document for the preview.
function cssTargets(css: string): { classes: string[]; tags: string[] } {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@[^{]+\{[\s\S]*?\}/g, " ");
  const classes = new Set<string>();
  const tags = new Set<string>();
  const COMMON = new Set([
    "h1", "h2", "h3", "p", "a", "button", "ul", "ol", "li", "img", "input",
    "label", "section", "article", "header", "footer", "nav", "span", "div",
  ]);
  const selRe = /([^{}]+)\{/g;
  let m: RegExpExecArray | null;
  while ((m = selRe.exec(clean))) {
    const sel = m[1];
    let cm: RegExpExecArray | null;
    const classRe = /\.([A-Za-z_][\w-]*)/g;
    while ((cm = classRe.exec(sel))) classes.add(cm[1]);
    for (const part of sel.split(",")) {
      const t = part.trim().match(/^([a-z][a-z0-9]*)/);
      if (t && COMMON.has(t[1])) tags.add(t[1]);
    }
  }
  return { classes: [...classes].slice(0, 8), tags: [...tags].slice(0, 6) };
}

function tagDemo(tag: string): string {
  switch (tag) {
    case "h1": return "<h1>Heading level 1</h1>";
    case "h2": return "<h2>Heading level 2</h2>";
    case "h3": return "<h3>Heading level 3</h3>";
    case "p": return "<p>A paragraph of demo text to show how it is styled.</p>";
    case "a": return '<a href="#">A demo link</a>';
    case "button": return "<button>Button</button>";
    case "img": return '<div class="q-img" style="width:120px;height:80px;background:#c7d2fe;border-radius:8px"></div>';
    case "input": return '<input placeholder="Type here" />';
    case "label": return "<label>A field label</label>";
    case "ul": return "<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>";
    case "ol": return "<ol><li>Step one</li><li>Step two</li></ol>";
    case "li": return "<ul><li>List item</li></ul>";
    case "nav": return "<nav>Home · About · Contact</nav>";
    default: return `<${tag}>Demo ${tag}</${tag}>`;
  }
}

function cssDemoBody(css: string): string {
  const { classes, tags } = cssTargets(css);
  const parts: string[] = [];
  for (const c of classes) {
    // Container with four numbered boxes so grid/flex layouts are visible.
    parts.push(
      `<div class="q-label">.${c}</div>` +
        `<div class="${c} q-demo"><div>1</div><div>2</div><div>3</div><div>4</div></div>`
    );
  }
  for (const t of tags) {
    parts.push(`<div class="q-label">&lt;${t}&gt;</div>${tagDemo(t)}`);
  }
  if (!parts.length) {
    parts.push(
      `<div class="q-label">Preview</div>` +
        `<div class="q-demo"><div>1</div><div>2</div><div>3</div></div>` +
        `<h1>Heading</h1><p>Some paragraph text.</p>`
    );
  }
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Document builder
// ---------------------------------------------------------------------------

const RUN_TOKEN = "%%RUN%%";

// Injected into every executable doc: mirrors console.* out to the parent and
// reports completion / errors. `%%RUN%%` is replaced with the current run id.
const CONSOLE_SHIM = `
<script>
(function(){
  var RUN="${RUN_TOKEN}";
  function ser(a){
    try{
      if(typeof a==="string") return a;
      if(a instanceof Error) return (a.stack||a.message);
      if(typeof a==="function") return a.toString();
      if(a===undefined) return "undefined";
      if(a===null) return "null";
      if(typeof a==="object") return JSON.stringify(a,function(k,v){
        return typeof v==="function" ? "[Function]" : (typeof v==="undefined" ? null : v);
      },2);
      return String(a);
    }catch(e){ return String(a); }
  }
  function send(type,level,args){
    try{ parent.postMessage({source:"quest-sandbox",run:RUN,type:type,level:level,
      text:[].map.call(args,ser).join(" ")},"*"); }catch(e){}
  }
  ["log","info","warn","error","debug"].forEach(function(m){
    var orig=console[m]?console[m].bind(console):function(){};
    console[m]=function(){ send("log",m,arguments); orig.apply(console,arguments); };
  });
  window.addEventListener("error",function(e){ send("error","error",[e.message]); });
  window.addEventListener("unhandledrejection",function(e){ send("error","error",[String(e.reason)]); });
  window.__done=function(){ send("done","",[]); };
})();
<\/script>`;

function esc(code: string): string {
  // Prevent a stray `</script>` in user code from breaking out of the tag.
  return code.replace(/<\/script/gi, "<\\/script");
}

export interface BuildDocOptions {
  mode: WebRunMode;
  /** Original source (used for html/css). */
  source: string;
  /** Transpiled JS (used for js/ts/react). */
  compiled?: string;
  /** Detected component name for react auto-mount. */
  component?: string | null;
  runId: string;
}

/** Builds the full HTML document to load into the sandbox iframe. */
export function buildPreviewDoc(opts: BuildDocOptions): string {
  const { mode, source, compiled, component, runId } = opts;
  const shim = CONSOLE_SHIM.replace(RUN_TOKEN, runId);

  if (mode === "html") {
    const body = source.trim();
    // If it's already a full document, inject the shim; otherwise wrap it.
    if (/<html[\s>]/i.test(body)) {
      const withShim = body.includes("</body>")
        ? body.replace("</body>", `${shim}\n<script>window.__done&&window.__done()<\/script></body>`)
        : body + shim;
      return withShim;
    }
    return `<!doctype html><html><head><meta charset="utf-8">
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:18px;color:#1a1a2e;background:#fff;line-height:1.5;margin:0}</style>
</head><body>
${body}
${shim}
<script>window.__done&&window.__done()<\/script>
</body></html>`;
  }

  if (mode === "css") {
    return `<!doctype html><html><head><meta charset="utf-8">
<style>${CSS_BASELINE}</style>
<style>\n${source}\n</style>
</head><body>
${cssDemoBody(source)}
${shim}
<script>window.__done&&window.__done()<\/script>
</body></html>`;
  }

  if (mode === "react") {
    const mount = component
      ? `try{
          var __el=React.createElement(${component});
          var __root=document.getElementById("root");
          if(ReactDOM.createRoot){ ReactDOM.createRoot(__root).render(__el); }
          else { ReactDOM.render(__el,__root); }
        }catch(e){ console.error(e && (e.stack||e.message) || String(e)); }`
      : `document.getElementById("root").innerHTML='<p style="color:#9aa0b4;font:14px system-ui">No component to render — check the console for output.</p>';`;
    return `<!doctype html><html><head><meta charset="utf-8">
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:18px;color:#1a1a2e;background:#fff;line-height:1.5;margin:0}</style>
${shim}
<script src="${REACT_CDN}"><\/script>
<script src="${REACT_DOM_CDN}"><\/script>
</head><body>
<div id="root"></div>
<script>
try {
  var { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext, Fragment } = React;
${esc(compiled ?? "")}
} catch (e) { console.error(e && (e.stack||e.message) || String(e)); }
${mount}
window.__done && window.__done();
<\/script>
</body></html>`;
  }

  // js / ts: run in an invisible doc, stream console output.
  return `<!doctype html><html><head><meta charset="utf-8">
${shim}
</head><body>
<script>
try {
${esc(compiled ?? source)}
} catch (e) { console.error(e && (e.stack||e.message) || String(e)); }
window.__done && window.__done();
<\/script>
</body></html>`;
}

// Lazily loads Pyodide (Python compiled to WebAssembly) from a CDN the first
// time the user runs code, then reuses the same interpreter for every run.
// This is what powers the live "edit & run real Python" playground.

const PYODIDE_VERSION = "0.26.4";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodidePromise: Promise<PyodideInterface> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load the Python runtime."));
    document.head.appendChild(s);
  });
}

export function isPyodideReady(): boolean {
  return pyodidePromise !== null;
}

export async function loadPyodideOnce(): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    await injectScript(CDN + "pyodide.js");
    if (!window.loadPyodide) throw new Error("Python runtime unavailable.");
    return window.loadPyodide({ indexURL: CDN });
  })();
  return pyodidePromise;
}

export interface RunResult {
  output: string;
  error?: string;
}

export async function runPython(code: string): Promise<RunResult> {
  const py = await loadPyodideOnce();
  let buffer = "";
  const append = (s: string) => {
    buffer += s + "\n";
  };
  py.setStdout({ batched: append });
  py.setStderr({ batched: append });
  try {
    await py.runPythonAsync(code);
    return { output: buffer };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { output: buffer, error: message };
  }
}

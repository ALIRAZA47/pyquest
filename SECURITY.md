# Security Policy

## Reporting a vulnerability

If you discover a security issue, please **do not open a public issue**. Instead, email **ali.khan@gentling.ai** with:

- a description of the issue and its impact,
- steps to reproduce, and
- any relevant logs, screenshots, or proof-of-concept.

You'll receive an acknowledgement, and we'll work with you on a fix and disclosure timeline.

## Scope & threat model

Quest is a fully static, client-only app with **no backend, no accounts, and no server-side data**. The most relevant surface is the in-browser code execution:

- **Python / ML / AI** run in [Pyodide](https://pyodide.org/) (WebAssembly), sandboxed by the browser's WASM boundary.
- **Web courses** run learner code inside an `<iframe sandbox="allow-scripts">` **without** `allow-same-origin`, so it has an opaque origin and cannot read the parent page, `localStorage`, or cookies. Parent↔iframe communication is limited to `postMessage`.

Reports about sandbox escapes, ways for lesson/learner code to reach the parent context or exfiltrate data, or dependency vulnerabilities are especially appreciated.

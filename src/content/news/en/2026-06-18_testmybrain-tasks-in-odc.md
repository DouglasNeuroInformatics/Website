---
title: 'Running TestMyBrain Tasks in Open Data Capture'
extendedTitle: 'Running TestMyBrain Tasks in Open Data Capture: Bringing Decade Old Legacy Code to a Modern ES Module Runtime'
description: 'We brought the legacy TestMyBrain cognitive tasks into Open Data Capture by enabling our modern ES-module instrument runtime to execute non-strict mode, globally scoped scripts and serve its assets from a service worker.'
authors:
  - joshua-unrau
type: article
---

[Open Data Capture](https://opendatacapture.org) (ODC) ships a modern environment for authoring and running arbitrary cognitive tests. Instruments are written as standard ES modules, compiled in the browser, and executed in a sandboxed iframe. The [TestMyBrain](https://testmybrain.org) (formerly ManyBrains) tasks, by contrast, are battle-tested research instruments whose implementations are roughly fifteen years old. They are built on libraries like jQuery (v1), first released in 2006, and they were written for a web of a different era. Two assumptions in particular get in the way.

First, the code runs in **non-strict mode**. Modern JavaScript modules are always strict, but these scripts predate that and rely on behaviour strict mode forbids — for example, assigning to a variable that was never declared (`stimulusCount = 0`) silently creates a global in non-strict mode, but throws a `ReferenceError` under strict mode; likewise the scripts assume that every `<script>` on the page shares one mutable global namespace, with jQuery registering `$` on `window` and the task code reading it back later. Run as part of a strict ES module, this code simply will not execute.

Second, the tasks load their images and audio the way most websites do: with paths like `<img src="images/stimulus.png">`, resolved by a web server that serves a directory of files sitting next to the HTML. An ODC instrument is a single self-contained bundle running in an iframe — there is no server and no folder behind those paths, so every such request would 404.

We deliberately did **not** want to rewrite the tasks to fix these issues. They are untyped, intricate, and hard to debug, and they have been validated in published research exactly as written; the safest course was to leave them untouched and instead adapt the runtime around them. 

## How Interactive Instruments Run in ODC

At a high level, an interactive instrument is an ES module that exports a `content` object. Custom bundler tooling (built on `esbuild`) compiles the author's source — TypeScript/JSX, CSS, HTML fragments, images — into a single self-contained string: an immediately-invoked async function expression (IIFE) that returns the instrument. That string is then evaluated inside a sandboxed iframe, which renders the task and reports results back to the host application by dispatching `CustomEvent` — most importantly a `done` event carrying the participant's data.

Bare module imports are resolved at runtime against a curated set of packages vendored into the runtime rather than fetched from a registry.

The parts of the `content` object that matter for the rest of this post are:

```ts
content: {
  render: (done) => void | Promise<void>, // entry point; calls done(data) when finished
  html?: string,                           // markup injected into the iframe
  staticAssets?: { [path: string]: string }, // virtual files (images, audio) keyed by request path
  __injectHead?: { scripts?: readonly string[]; style?: string } // legacy scripts + CSS to inject
}
```

`staticAssets` and `__injectHead` are the two fields we added to support the legacy tasks. The iframe's `bootstrap.js` is what consumes them; everything below is about how they get populated at build time and replayed at runtime.

## Problem 1: Legacy Scripts Need Non-Strict Mode and the Global Scope

As noted above, the bundle ODC generates is an ES module, and ES modules are always strict. The TestMyBrain code needs the opposite: non-strict execution in a shared global scope, where jQuery defines `$`/`jQuery` on `window`, plugins extend that global, and the task code reads it. Compiling these files into the strict module graph is a non-starter.

The fix is a dedicated **legacy script** path that deliberately keeps these files *out* of the module graph and instead replays them the way a period-correct page would have: as classic `<script>` tags, in order, in the global scope, in non-strict mode.

A legacy dependency is imported with a `?legacy` query suffix, e.g. `import './jquery-1.12.4.js?legacy'`. The bundler plugin intercepts these in an `onLoad` handler:

```ts
build.onLoad({ filter: /.+\?legacy$/, namespace: 'bundle' }, (args) => {
  const input = resolveInput(/(.+)\?legacy$/.exec(args.path)![1]!, options.inputs);
  // ...error if unresolved...
  legacyScripts.set(args.path, input.content as string);
  return { contents: input.content, loader: 'empty' };
});
```

The crucial detail is `loader: 'empty'`: the legacy file contributes **nothing** to the JavaScript bundle. The import statement becomes a no-op marker whose only purpose is to record a dependency edge so that esbuild visits the file and preserves its position in the graph. The raw, untouched source is squirreled away in a `legacyScripts` map.

In the plugin's `onEnd` hook we walk `metafile.inputs` — which lists modules in resolution order — and collect the stashed sources in that same order:

```ts
build.onEnd((result) => {
  result.legacyScripts = [];
  Object.keys(result.metafile!.inputs).forEach((path) => {
    const script = legacyScripts.get(path.replace('bundle:', ''));
    if (script) result.legacyScripts!.push(script);
  });
});
```

Order matters: jQuery must be defined before the plugins that extend it, which must run before the task code that uses them. Threading the scripts through the module graph and reading back the resolution order gives us deterministic, dependency-correct sequencing for free.

Finally, the bundler base64-encodes each legacy script and freezes it onto the instrument under `content.__injectHead.scripts`:

```ts
const scripts = output.legacyScripts?.length
  ? `[${output.legacyScripts.map((c) => `"${encodeUnicodeToBase64(c)}"`).join(', ')}]`
  : undefined;
// ...
Object.defineProperty(__exports.content, '__injectHead', {
  value: Object.freeze({ scripts, style }),
  writable: false
});
```

(We base64-encode because the scripts are interpolated into a generated source string; encoding sidesteps every quoting, newline, and Unicode hazard.)

At runtime, `bootstrap.js` decodes each script and injects it as a real classic script element:

```js
const scripts = instrument.content.__injectHead?.scripts;
scripts?.forEach((encodedScript) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = decodeBase64ToUnicode(encodedScript);
  document.head.appendChild(script);
});
```

A `<script>` element created this way executes in the iframe's **global scope** and in **non-strict mode** — exactly the environment the code was written for. jQuery attaches `$`/`jQuery` to the iframe's `window`, plugins extend it, and the task code finds everything where it expects to. The modern ES-module instrument and the legacy globals now share one document without either having to be rewritten.

The ordering inside `bootstrap.js` is also deliberate: injected CSS first, then the instrument's `html` fragment, then the legacy scripts, then `render()`. The HTML must exist before the scripts run so that jQuery's `$(document).ready` handlers and DOM lookups find their targets.

## Problem 2: Assets That Assume a Real Web Server

The second problem is asset loading. As described at the outset, the legacy HTML and JavaScript reference images and audio by server-relative paths, and they build many of those paths dynamically at runtime (string concatenation, jQuery preloaders, CSS `url(...)`). That rules out statically rewriting the URLs — the only robust way to make unmodified code believe it is talking to a server is to actually answer its HTTP requests. So we virtualize the server with a **service worker**.

At bundle time, asset files (`png`, `jpg`, `jpeg`, `svg`, `webp`, `mp3`, `mp4`) are loaded by esbuild's `dataurl` loader, producing base64 data URLs. These are collected into the instrument's `content.staticAssets` map, keyed by request path (e.g. `/images/stimulus.png`).

At runtime, when `bootstrap.js` sees `staticAssets`, it registers the service worker scoped to the iframe, waits for it to take control, and hands over the asset map through a `MessageChannel`, waiting for an acknowledgement before continuing:

```js
if (instrument.content.staticAssets) {
  await navigator.serviceWorker.register('./worker.js', { scope: './' });
  const registration = await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) {
    await new Promise((resolve) =>
      navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })
    );
  }
  const { port1, port2 } = new MessageChannel();
  await new Promise((resolve) => {
    port1.onmessage = (event) => {
      if (event.data?.type === 'STATIC_ASSETS_READY') resolve(undefined);
    };
    registration.active?.postMessage(
      { staticAssets: instrument.content.staticAssets, type: 'STATIC_ASSETS' },
      [port2]
    );
  });
}
```

Waiting for the worker to actually control the page — and for it to confirm receipt of the assets — before injecting any HTML or scripts is essential. Otherwise the first image requests would race the worker's activation and fall through to the network as 404s.

The worker (`worker.js`) keeps the asset map in memory and intercepts `fetch` events within its scope. When a requested path matches a known asset, it decodes the data URL into a real `Response` with the correct `Content-Type`:

```js
worker.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  let pathname = url.pathname;
  // normalize the iframe runtime prefix so 'images/x.png' and '/images/x.png' collapse to one key
  if (pathname.startsWith('/runtime/v1/@opendatacapture/runtime-internal/interactive')) {
    pathname = pathname.replace('/runtime/v1/@opendatacapture/runtime-internal/interactive', '');
  }
  if (staticAssets.has(pathname)) {
    event.respondWith(dataUrlToResponse(staticAssets.get(pathname)));
  }
});
```

`dataUrlToResponse` handles both base64 image data URLs (decoded to a `Uint8Array`) and plain-text data URLs. Because the iframe is served from a deep runtime path, a relative request like `images/stimulus.png` resolves against that path; normalizing the prefix away means both relative and absolute references land on the same key. From the legacy code's point of view, nothing has changed: it asks the "server" for `images/stimulus.png` over HTTP and gets back a genuine image response — except the server is a service worker answering from assets that were baked into the bundle.

## Putting It Together

With these two mechanisms in place, the end-to-end flow for a legacy TestMyBrain task is:

1. The author writes a thin modern ES-module instrument that imports its legacy dependencies with `?legacy` and bundles its images as static assets.
2. The bundler emits a single string: a modern module for the instrument shell, the ordered legacy scripts base64-encoded on `__injectHead`, and the assets on `staticAssets`.
3. The iframe evaluates the bundle, registers and primes the service worker, injects styles, HTML, and the legacy scripts (non-strict mode, global scope, correct order), then calls `render()`.
4. jQuery 1 and the task code run exactly as they did fifteen years ago; their image and audio requests are transparently served from memory by the worker.
5. When the participant finishes, the task calls `done(data)`, which crosses the iframe boundary as a `CustomEvent` and is captured, validated, and stored by ODC.

The result is that decades-old, widely-validated cognitive tasks run unmodified inside a modern, module-based, sandboxed runtime — with no legacy server, no global build step, and no changes to the original task code. It was, as anyone who has tried to revive fifteen-year-old front-end code can attest, considerably more involved than it sounds.

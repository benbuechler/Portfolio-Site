import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

// Exercise the actual early head scripts, including their order. Using the
// template source avoids a separate copy of the security-sensitive logic.
const layout = readFileSync(new URL("../layouts/BaseLayout.astro", import.meta.url), "utf8");
const scripts = [...layout.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter(([, attributes]) => /data-(giscus-session-cleanup|umami-loader|clarity-loader)/.test(attributes))
  .map(([, attributes, source]) => ({ attributes, source }));

function browser(url: string, options: {
  storage?: boolean;
  history?: boolean;
  readyState?: "loading" | "interactive" | "complete";
} = {}) {
  const location = { href: url };
  const state = { restored: true };
  const stored = new Map<string, string>();
  const trackerRequests: { src: string; url: string; dataset: Record<string, string> }[] = [];
  let historyCalls = 0;
  const history = {
    state,
    replaceState(nextState: unknown, title: string, nextUrl: string) {
      historyCalls++;
      assert.equal(nextState, state);
      assert.equal(title, "");
      if (options.history) throw new Error("History is unavailable");
      location.href = nextUrl;
    },
  };
  const insert = (script: { src: string; dataset: Record<string, string> }) => {
    trackerRequests.push({ src: script.src, url: location.href, dataset: script.dataset });
  };
  const window = { location, history };
  const documentEvents = new EventTarget();
  const document = {
    readyState: options.readyState ?? "complete",
    addEventListener: documentEvents.addEventListener.bind(documentEvents),
    head: { appendChild: insert },
    createElement: () => ({ src: "", dataset: {} }),
    getElementsByTagName: () => [{ parentNode: { insertBefore: insert } }],
  };
  const localStorage = {
    setItem(key: string, value: string) {
      if (options.storage) throw new Error("Storage is unavailable");
      stored.set(key, value);
    },
  };
  const finishParsing = () => {
    document.readyState = "interactive";
    documentEvents.dispatchEvent(new Event("DOMContentLoaded"));
  };
  const context = createContext({ window, document, localStorage, URL });
  for (const { source } of scripts) runInContext(source, context);
  return { location, stored, trackerRequests, historyCalls, finishParsing };
}

test("Giscus callback cleanup runs before every analytics loader", () => {
  assert.equal(scripts.length, 3);
  assert.match(scripts[0].attributes, /data-giscus-session-cleanup/);
  assert.match(scripts[1].attributes, /data-umami-loader/);
  assert.match(scripts[2].attributes, /data-clarity-loader/);
  assert.ok(layout.indexOf("data-giscus-session-cleanup") < layout.indexOf("https://cloud.umami.is/script.js"));
  assert.ok(layout.indexOf("data-giscus-session-cleanup") < layout.indexOf("https://www.clarity.ms/tag/"));
});

test("callback session is saved and removed before trackers see the URL", () => {
  const result = browser("https://portfolio.example/projects/voron?ref=article&giscus=example-session#comments");
  assert.equal(result.stored.get("giscus-session"), JSON.stringify("example-session"));
  assert.equal(result.location.href, "https://portfolio.example/projects/voron?ref=article#comments");
  assert.equal(result.historyCalls, 1);
  assert.equal(result.trackerRequests.length, 2);
  assert.ok(result.trackerRequests.every(({ url }) => !new URL(url).searchParams.has("giscus")));
  const umami = result.trackerRequests.find(({ src }) => src === "https://cloud.umami.is/script.js");
  assert.equal(umami?.dataset.excludeSearch, "true");
});

test("empty and duplicate callback parameters are still removed", () => {
  const result = browser("https://portfolio.example/projects/voron?giscus=&giscus=ignored&ref=article#comments");
  assert.equal(result.location.href, "https://portfolio.example/projects/voron?ref=article#comments");
  assert.equal(result.stored.size, 0);
  assert.equal(result.trackerRequests.length, 2);
});

test("blocked storage does not leave the session in the recorded URL", () => {
  const result = browser("https://portfolio.example/projects/voron?giscus=example-session#comments", { storage: true });
  assert.equal(result.stored.size, 0);
  assert.equal(result.location.href, "https://portfolio.example/projects/voron#comments");
  assert.equal(result.trackerRequests.length, 2);
  assert.ok(result.trackerRequests.every(({ url }) => !new URL(url).searchParams.has("giscus")));
});

test("both trackers stay unloaded if sensitive URL cleanup fails", () => {
  const result = browser("https://portfolio.example/projects/voron?giscus=example-session#comments", { history: true });
  assert.equal(result.historyCalls, 1);
  assert.equal(result.trackerRequests.length, 0);
});

test("ordinary pages retain their URL and load both trackers", () => {
  const url = "https://portfolio.example/projects/voron?ref=article#comments";
  const result = browser(url);
  assert.equal(result.location.href, url);
  assert.equal(result.historyCalls, 0);
  assert.equal(result.stored.size, 0);
  assert.equal(result.trackerRequests.length, 2);
});

test("Umami waits for parsing to finish and loads only once", () => {
  const result = browser("https://portfolio.example/projects/voron?giscus=example-session#comments", { readyState: "loading" });
  assert.equal(result.trackerRequests.length, 1);
  assert.ok(result.trackerRequests[0].src.startsWith("https://www.clarity.ms/tag/"));
  result.finishParsing();
  assert.equal(result.trackerRequests.length, 2);
  const umami = result.trackerRequests.find(({ src }) => src === "https://cloud.umami.is/script.js");
  assert.equal(umami?.url, "https://portfolio.example/projects/voron#comments");
  assert.equal(umami?.dataset.excludeSearch, "true");
  result.finishParsing();
  assert.equal(result.trackerRequests.length, 2);
});

test("sensitive URL cleanup failure also prevents queued tracker loading", () => {
  const result = browser("https://portfolio.example/projects/voron?giscus=example-session", { readyState: "loading", history: true });
  result.finishParsing();
  assert.equal(result.trackerRequests.length, 0);
});

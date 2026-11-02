import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { initLinkTracking, trackEvent } from "./analytics.ts";

// The tracker needs only ancestry, attributes, and document events. These small
// stand-ins let Node exercise it without a browser or another test dependency.
class TestElement {
  parent: TestElement | undefined;
  dataset: Record<string, string> = {};
  attributes: Record<string, string> = {};
  textContent = "";
  href: string | undefined;

  constructor(parent?: TestElement) {
    this.parent = parent;
  }

  closest(selector: string): TestElement | null {
    if (selector === "a[href]" && this.href !== undefined) return this;
    if (selector === "[data-analytics-location]" && this.dataset.analyticsLocation !== undefined) return this;
    return this.parent?.closest(selector) ?? null;
  }

  getAttribute(name: string) { return this.attributes[name] ?? null; }
  hasAttribute(name: string) { return name in this.attributes; }
}

class TestDocument extends EventTarget {
  ids = new Map<string, TestElement>();
  getElementById(id: string) { return this.ids.get(id) ?? null; }
}

function browser(t: TestContext) {
  const calls: { name: string; data: Record<string, string | number | boolean> }[] = [];
  const document = new TestDocument();
  const window = {
    location: new URL("https://portfolio.example/projects/voron?ref=private#private"),
    umami: undefined as undefined | { track: (name: string, data: Record<string, string | number | boolean>) => void | Promise<unknown> },
  };
  window.umami = { track: (name, data) => { calls.push({ name, data }); } };

  for (const [key, value] of Object.entries({ window, document, Element: TestElement })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, key, original);
      else Reflect.deleteProperty(globalThis, key);
    });
  }

  const link = (href: string, text = "Read more", parent?: TestElement) => {
    const element = new TestElement(parent);
    element.href = href;
    element.textContent = text;
    return element;
  };
  const click = (target: unknown, options: { type?: string; button?: number; canceled?: boolean; ctrlKey?: boolean; metaKey?: boolean } = {}) => {
    const event = new Event(options.type ?? "click", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "target", { value: target });
    Object.assign(event, { button: options.button ?? 0, ctrlKey: options.ctrlKey ?? false, metaKey: options.metaKey ?? false });
    if (options.canceled) event.preventDefault();
    document.dispatchEvent(event);
    return event;
  };
  return { window, document, calls, link, click };
}

test("custom events add the source pathname without query strings or fragments", (t) => {
  const { calls } = browser(t);
  trackEvent("theme-change", { theme: "dark", page: "incorrect", open: true });
  assert.deepEqual(calls, [{
    name: "theme-change",
    data: { theme: "dark", page: "/projects/voron", open: true },
  }]);
});

test("missing or failing analytics never interrupts the action", async (t) => {
  const { window, calls } = browser(t);
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: undefined });
  assert.doesNotThrow(() => trackEvent("server-render"));
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: window });
  window.umami = undefined;
  assert.doesNotThrow(() => trackEvent("blocked"));
  window.umami = { track: () => { throw new Error("blocked"); } };
  assert.doesNotThrow(() => trackEvent("throwing"));
  window.umami = { track: () => Promise.reject(new Error("network failed")) };
  trackEvent("rejected");
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(calls, []);
});

test("nested clicks use explicit metadata and an ancestor's location", (t) => {
  const { calls, link, click } = browser(t);
  initLinkTracking();
  const section = new TestElement();
  section.dataset.analyticsLocation = "projects-grid";
  const anchor = link("/projects/voron", "A long card summary", section);
  anchor.dataset.analyticsEvent = "project-click";
  anchor.dataset.analyticsLabel = "Voron 2.4";
  const event = click(new TestElement(anchor));
  assert.equal(event.defaultPrevented, false, "tracking preserves the native action");
  assert.deepEqual(calls, [{ name: "project-click", data: {
    page: "/projects/voron", location: "projects-grid", label: "Voron 2.4",
    destination: "/projects/voron", type: "internal",
  } }]);
});

test("link destinations omit queries, fragments, credentials, and contact addresses", (t) => {
  const { calls, link, click } = browser(t);
  initLinkTracking();
  const cases = [
    ["/contact?token=secret#private", "link-click", "/contact", "internal"],
    ["https://name:password@external.example/story?token=secret#private", "outbound-click", "https://external.example/story", "external"],
    ["mailto:private@example.com?subject=secret", "link-click", "mailto:", "email"],
    ["tel:+15555550123", "link-click", "tel:", "phone"],
  ];
  for (const [href, name, destination, type] of cases) {
    click(link(href));
    const recorded = calls.at(-1)!;
    assert.equal(recorded.name, name);
    assert.equal(recorded.data.destination, destination);
    assert.equal(recorded.data.type, type);
  }
  const download = link("/resume.pdf?token=secret");
  download.attributes.download = "";
  click(download);
  assert.equal(calls.at(-1)!.data.type, "download");
  assert.equal(calls.at(-1)!.data.destination, "/resume.pdf");
});

test("accessible labels take precedence over long card text", (t) => {
  const { calls, document, link, click } = browser(t);
  initLinkTracking();
  const heading = new TestElement();
  heading.textContent = "Project title";
  document.ids.set("project-title", heading);
  const anchor = link("/projects/voron", "Project title and an entire summary");
  anchor.attributes["aria-labelledby"] = "project-title missing-id";
  click(anchor);
  assert.equal(calls.at(-1)!.data.label, "Project title");
  anchor.attributes["aria-label"] = "  Open\n project  ";
  click(anchor);
  assert.equal(calls.at(-1)!.data.label, "Open project");
  anchor.dataset.analyticsLabel = "A".repeat(250);
  click(anchor);
  assert.equal(String(calls.at(-1)!.data.label).length, 200);
});

test("ordinary Markdown links receive fallback tracking", (t) => {
  const { calls, link, click } = browser(t);
  initLinkTracking();
  click(link("../experience", "Read the story"));
  assert.deepEqual(calls, [{ name: "link-click", data: {
    page: "/projects/voron", location: "content", label: "Read the story",
    destination: "/experience", type: "internal",
  } }]);
});

test("canceled clicks, context menus, nonlinks, and unsupported protocols are ignored", (t) => {
  const { calls, link, click } = browser(t);
  initLinkTracking();
  click(link("/contact"), { canceled: true });
  click(link("/contact"), { button: 2 });
  click(link("/contact"), { type: "auxclick", button: 2 });
  click(new TestElement());
  click({});
  click(link("javascript:void(0)"));
  click(link("data:text/plain,secret"));
  click(link("https://[invalid-host"));
  assert.deepEqual(calls, []);
});

test("synthetic, modified, and middle-button navigation are each recorded once", (t) => {
  const { calls, link, click } = browser(t);
  initLinkTracking();
  const anchor = link("/contact");
  const event = click(anchor);
  assert.equal(event.isTrusted, false, "map-dot navigation dispatches synthetic clicks");
  click(anchor, { ctrlKey: true });
  click(anchor, { metaKey: true });
  click(anchor, { button: 1 });
  assert.equal(calls.length, 3, "middle button does not also count as a primary click");
  click(anchor, { type: "auxclick", button: 1 });
  assert.equal(calls.length, 4);
});

test("initialization is idempotent for each document", (t) => {
  const { calls, link, click } = browser(t);
  initLinkTracking();
  initLinkTracking();
  click(link("/contact"));
  assert.equal(calls.length, 1);
});

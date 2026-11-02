type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (name: string, data: EventData) => Promise<unknown> | void;
    };
  }
}

// Use Umami's JavaScript API so tracking never replaces a link's native action
// or stops the site's own event handlers. Blocked analytics must remain harmless.
export function trackEvent(name: string, data: EventData = {}) {
  if (typeof window === "undefined") return;
  try {
    const request = window.umami?.track(name, { ...data, page: window.location.pathname });
    if (request) void Promise.resolve(request).catch(() => {});
  } catch {}
}

const trackedDocuments = new WeakSet<Document>();

// Delegation also covers links added later in Markdown or dynamic components.
// Buttons with changing state are tracked by their own action handlers instead.
export function initLinkTracking() {
  if (trackedDocuments.has(document)) return;
  trackedDocuments.add(document);

  const trackLink = (event: MouseEvent) => {
    // Gallery opens and canceled map drags have their own handling. Middle-click
    // is delivered as auxclick; right-click only opens a context menu.
    if (event.defaultPrevented || (event.type === "auxclick" ? event.button !== 1 : event.button !== 0)) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;

    let url: URL;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return;
    }
    const external = url.origin !== window.location.origin;
    let destination: string;
    let type: string;
    if (url.protocol === "http:" || url.protocol === "https:") {
      // Omit query strings, fragments, and URL credentials from custom events.
      destination = external ? `${url.origin}${url.pathname}` : url.pathname;
      type = link.hasAttribute("download") ? "download" : external ? "external" : "internal";
    } else if (url.protocol === "mailto:" || url.protocol === "tel:") {
      destination = url.protocol;
      type = url.protocol === "mailto:" ? "email" : "phone";
    } else {
      return;
    }

    const labelledBy = link.getAttribute("aria-labelledby")?.split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? "").join(" ");
    const label = (link.dataset.analyticsLabel || link.getAttribute("aria-label") || labelledBy || link.textContent || "Link")
      .replace(/\s+/g, " ").trim().slice(0, 200);

    trackEvent(link.dataset.analyticsEvent || (external && type === "external" ? "outbound-click" : "link-click"), {
      location: link.closest<HTMLElement>("[data-analytics-location]")?.dataset.analyticsLocation || "content",
      label,
      destination,
      type,
    });
  };

  // Bubble phase lets map drag cancellation and modal handling finish first.
  // Synthetic map-dot clicks deliberately reach this same listener once.
  document.addEventListener("click", trackLink);
  document.addEventListener("auxclick", trackLink);
}

export interface SitePage {
  href: string;
  label: string;
}

/** Discover file-based pages without importing or rendering their components. */
export function getSitePages(pageFiles: string[], base = "/"): SitePage[] {
  const pages = new Map<string, SitePage>();
  const basePath = base.replace(/\/$/, "");

  for (const file of pageFiles) {
    const relativePath = file.replace(/^\/src\/pages\//, "");
    if (!/\.(astro|md|mdx|html)$/.test(relativePath)) continue;

    const segments = relativePath.replace(/\.(astro|md|mdx|html)$/, "").split("/");
    // Dynamic routes need resolved URLs, not a link containing `[slug]`.
    if (segments.some((segment) => /^[_.]/.test(segment) || /[\[\]]/.test(segment))) {
      continue;
    }

    if (segments.at(-1) === "index") segments.pop();
    if (["404", "500"].includes(segments.at(-1) ?? "")) continue;

    const path = segments.map((segment) => encodeURIComponent(segment)).join("/");
    const href = `${basePath}/${path}`;
    const label = segments.length
      ? segments
          .map((segment) =>
            segment
              .replace(/[-_]+/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
          )
          .join(" / ")
      : "Home";

    pages.set(href, { href, label });
  }

  return [...pages.values()].sort((a, b) => {
    if (a.href === `${basePath}/`) return -1;
    if (b.href === `${basePath}/`) return 1;
    return a.href.localeCompare(b.href, "en");
  });
}

// Only file names are needed. `?raw` avoids importing page components recursively.
// New static pages are picked up by Vite in development and on the next build.
// For generated/dynamic pages, supply their resolved URLs separately when added.
const pageFiles = import.meta.glob("/src/pages/**/*.{astro,md,mdx,html}", {
  query: "?raw",
  import: "default",
});

export const sitePages = getSitePages(Object.keys(pageFiles), import.meta.env.BASE_URL);

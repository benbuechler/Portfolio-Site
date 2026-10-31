// An exported interface describes an object's shape for TypeScript and other files.
// It catches mistakes while editing; it does not create an object at runtime.
export interface SitePage {
  // href is the destination URL; label is the human-readable link text.
  href: string;
  label: string;
}

/** Discover file-based pages without importing or rendering their components. */
// string[] means an array of strings. base defaults to "/" when omitted.
// The : SitePage[] after the parameters describes the function's returned value.
export function getSitePages(pageFiles: string[], base = "/"): SitePage[] {
  // A Map stores key/value pairs. Using the URL as a key also removes duplicates:
  // calling .set() for an existing URL replaces its value instead of adding a row.
  const pages = new Map<string, SitePage>();
  // /.../ is a regular expression (a text-matching pattern). Here \/ matches a
  // literal slash and $ means the end, so only the final slash is removed.
  const basePath = base.replace(/\/$/, "");

  // for...of processes each filename. const prevents reassigning this iteration's
  // variable; methods may still create new strings from it.
  for (const file of pageFiles) {
    // ^ means the beginning of the string; remove the source-folder prefix.
    const relativePath = file.replace(/^\/src\/pages\//, "");
    // .test() returns a boolean. ! reverses it; continue skips this iteration.
    // The alternatives in (...) accept any one of these page file extensions.
    if (!/\.(astro|md|mdx|html)$/.test(relativePath)) continue;

    // Remove the extension, then split the remaining path into folder/name parts.
    const segments = relativePath.replace(/\.(astro|md|mdx|html)$/, "").split("/");
    // Dynamic routes need resolved URLs, not a link containing `[slug]`.
    // .some() asks whether ANY segment passes its callback (the arrow function).
    // [_.] matches an underscore or dot; [\[\]] matches either square bracket.
    if (segments.some((segment) => /^[_.]/.test(segment) || /[\[\]]/.test(segment))) {
      continue;
    }

    // .at(-1) reads the final item. index.astro represents its folder's URL,
    // so .pop() removes "index" rather than including it in the destination.
    if (segments.at(-1) === "index") segments.pop();
    // ?? supplies a fallback only for null/undefined (such as an empty array).
    // Error pages should not appear as ordinary navigation destinations.
    if (["404", "500"].includes(segments.at(-1) ?? "")) continue;

    // .map() creates a new array; .join() combines it into one string.
    // Encoding each part escapes characters such as spaces safely for a URL.
    const path = segments.map((segment) => encodeURIComponent(segment)).join("/");
    // Backticks form a template literal: ${...} inserts an expression's value.
    const href = `${basePath}/${path}`;
    // condition ? valueIfTrue : valueIfFalse is the ternary operator.
    // An empty segments array represents the home page; other paths become titles.
    const label = segments.length
      ? segments
          .map((segment) =>
            segment
              // + matches one or more separators; g replaces ALL matches.
              .replace(/[-_]+/g, " ")
              // \b marks a word boundary and \w matches a word character.
              // The callback capitalizes each matched first letter.
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
          )
          .join(" / ")
      : "Home";

    // { href, label } is shorthand for { href: href, label: label }.
    pages.set(href, { href, label });
  }

  // .values() produces the stored page objects; ... spreads them into an array.
  // A sort callback returns a negative value for "a first", positive for "b first".
  return [...pages.values()].sort((a, b) => {
    // === compares without converting types. Always place Home before other pages.
    if (a.href === `${basePath}/`) return -1;
    if (b.href === `${basePath}/`) return 1;
    // localeCompare compares strings using English ordering rules.
    return a.href.localeCompare(b.href, "en");
  });
}

// Only file names are needed. `?raw` avoids importing page components recursively.
// New static pages are picked up by Vite in development and on the next build.
// For generated/dynamic pages, supply their resolved URLs separately when added.
// import.meta.glob is provided by Vite (Astro's build tooling), not plain JS.
// ** searches nested folders; {astro,md,mdx,html} accepts several extensions.
// Without eager: true, its object values are functions that load files on demand.
// Here those functions are never called: only their filename keys are used.
const pageFiles = import.meta.glob("/src/pages/**/*.{astro,md,mdx,html}", {
  query: "?raw",
  import: "default",
});

// Object.keys extracts the glob object's filenames. BASE_URL is Astro's configured
// deployment base path, so links also work when hosted under a subdirectory.
// index.astro passes this exported list into PageCloud as its pages prop.
export const sitePages = getSitePages(Object.keys(pageFiles), import.meta.env.BASE_URL);

// A type-only import helps TypeScript check values; it is erased from compiled JS.
// MarkdownInstance is Astro's description of an imported Markdown page module.
import type { MarkdownInstance } from "astro";
import type { GalleryMetadata } from "./gallery";

// Frontmatter is the YAML metadata between --- lines at the top of a .md file.
// This interface tells the editor which fields each experience is expected to have.
export interface ExperienceFrontmatter extends GalleryMetadata {
  title: string;
  summary: string;
  category: string;
  period: string;
  // ? makes this field optional; reading it can produce a string or undefined.
  organization?: string;
  // Omit or set true for a linked story; false shows only the timeline card.
  hasStory?: boolean;
  // Comments appear on published stories when Giscus is configured.
  comments?: boolean;
  // Keep this identifier unchanged if the article's URL changes later.
  commentId?: string;
  // A number sorts numerically, unlike text such as "1", "10", "2".
  sortOrder: number;
}

// extends reuses every field above, then adds the destination URL for the timeline.
export interface Experience extends ExperienceFrontmatter {
  href: string;
}

// Each Markdown page supplies both its timeline preview and its full write-up.
// Use sortOrder to arrange milestones without inventing dates for undated entries.
// Vite's glob searches matching files at build time. <...> supplies a generic
// type argument: each imported module is a MarkdownInstance with our metadata.
// eager: true imports the modules immediately so their frontmatter is available.
const pages = import.meta.glob<MarkdownInstance<ExperienceFrontmatter>>(
  "/src/pages/experience/*.md",
  { eager: true },
);

// This exported array is shared with the timeline. Experience[] means every item
// must have the fields described by the Experience interface.
export const experiences: Experience[] = Object.entries(pages)
  // Object.entries gives [key, value] pairs. [file, page] destructures each pair
  // into named variables. flatMap merges the arrays returned by the callback:
  // [] excludes a file; [anExperience] includes one entry.
  .flatMap(([file, page]) => {
    // split separates path parts; at(-1) selects the filename. ?? supplies a
    // fallback if there is no last item. It does not replace an existing "".
    const filename = file.split("/").at(-1) ?? "";
    // || means "or". Skip missing URLs, private names starting with _ or .,
    // and dynamic filenames such as [slug].md that need resolved destinations.
    if (!page.url || /^[_.]/.test(filename) || /[\[\]]/.test(filename)) return [];

    // Object destructuring copies these property values into local variables.
    const { title, summary, category, period, organization, sortOrder, hasStory = true } = page.frontmatter;
    // YAML booleans use true/false without quotes. Reject accidental strings.
    if (typeof hasStory !== "boolean") {
      throw new Error(`Experience "${filename}" needs hasStory to be true or false without quotes.`);
    }
    // Property shorthand uses each variable's name as its object key.
    return [{ href: page.url, title, summary, category, period, organization, sortOrder, hasStory }];
  })
  // A negative difference puts a before b; a positive difference puts b first.
  // If the difference is 0 (falsy), || falls back to alphabetical title order.
  .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "en"));

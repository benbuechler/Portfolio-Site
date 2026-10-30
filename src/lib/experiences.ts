import type { MarkdownInstance } from "astro";

export interface ExperienceFrontmatter {
  title: string;
  summary: string;
  category: string;
  period: string;
  organization?: string;
  sortOrder: number;
}

export interface Experience extends ExperienceFrontmatter {
  href: string;
}

// Each Markdown page supplies both its timeline preview and its full write-up.
// Use sortOrder to arrange milestones without inventing dates for undated entries.
const pages = import.meta.glob<MarkdownInstance<ExperienceFrontmatter>>(
  "/src/pages/experience/*.md",
  { eager: true },
);

export const experiences: Experience[] = Object.entries(pages)
  .flatMap(([file, page]) => {
    const filename = file.split("/").at(-1) ?? "";
    if (!page.url || /^[_.]/.test(filename) || /[\[\]]/.test(filename)) return [];

    const { title, summary, category, period, organization, sortOrder } = page.frontmatter;
    return [{ href: page.url, title, summary, category, period, organization, sortOrder }];
  })
  .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "en"));

// Shared types and date formatting for the blog index and individual entries.
// This module does not import Markdown pages, so layouts can safely reuse it.

// These fields come from the YAML frontmatter at the top of each blog .md file.
export interface BlogFrontmatter {
  title: string;
  summary: string;
  // Keep dates quoted in Markdown, using "YYYY-MM-DD" (for example "2026-10-31").
  date: string;
  // ? makes tags optional. string[] means an array of strings.
  tags?: string[];
}

// The index adds the page's URL to its metadata so each preview can link to it.
export interface BlogPost extends BlogFrontmatter {
  href: string;
}

// Turn a date-only string into a readable label while keeping the same day in
// every time zone. The HTML <time> element still receives the original string.
export function formatBlogDate(value: string): string {
  // The regular expression requires four year digits, two month digits, and
  // two day digits. The anchors ^ and $ require the entire string to match.
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Blog dates must be quoted strings in "YYYY-MM-DD" format.');
  }

  // T00:00:00Z sets midnight in UTC. Explicit UTC formatting below prevents
  // a visitor west of UTC from seeing the previous calendar day.
  const date = new Date(`${value}T00:00:00Z`);
  // Reject impossible dates too: JavaScript can roll February 30 into March.
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid blog date: "${value}". Use a real calendar date.`);
  }

  // Intl supplies locale-aware month names and punctuation without a library.
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

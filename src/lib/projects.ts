// Shared metadata for project cards and their individual Markdown pages.
// Files in public/ are served from the site root: omit "public" from image URLs.
export interface ProjectFrontmatter {
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  // Optional technology labels and manual ordering (smaller numbers first).
  tools?: string[];
  sortOrder?: number;
}

// The hub adds a destination and supplies defaults for the optional fields.
export interface ProjectPreview extends ProjectFrontmatter {
  href: string;
  tools: string[];
  sortOrder: number;
}

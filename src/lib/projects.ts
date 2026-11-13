// Shared metadata for project cards and their individual Markdown pages.
import { getGalleryImages } from "./gallery";
import type { GalleryImage, GalleryMetadata } from "./gallery";
export type ProjectImage = GalleryImage;

export interface ProjectModel {
  // A GLB or glTF file in public/models/, served from the site root.
  src: string;
  alt: string;
}

export interface ProjectFrontmatter extends GalleryMetadata {
  title: string;
  summary: string;
  // Optional display date, such as "October 2026" or "2025–2026".
  // A single string uses string; string[] would describe a list of dates.
  date?: string;
  // Optional technology labels and manual ordering (smaller numbers first).
  tools?: string[];
  sortOrder?: number;
  // The viewer appears once this local model file has been added.
  model?: ProjectModel | null;
  // Comments are enabled when Giscus is configured; false disables this article.
  comments?: boolean;
  // Keep this identifier unchanged if the article's URL changes later.
  commentId?: string;
}

// The hub adds a destination and supplies defaults for the optional fields.
export interface ProjectPreview extends ProjectFrontmatter {
  href: string;
  tools: string[];
  sortOrder: number;
}

// Reuse one gallery definition for the layout and the hub's metadata checks.
// The card's image remains independent; gallery-only projects can omit a cover.
export function getProjectImages(project: ProjectFrontmatter): ProjectImage[] {
  return getGalleryImages(project, `Project "${project.title}"`);
}

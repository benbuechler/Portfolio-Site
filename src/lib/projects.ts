// Shared metadata for project cards and their individual Markdown pages.
// Files in public/ are served from the site root: omit "public" from image URLs.
export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectFrontmatter {
  title: string;
  summary: string;
  // Covers are optional. A blank YAML image field is parsed as null.
  image?: string | null;
  // Required when a non-empty image path is supplied.
  imageAlt?: string;
  // Extra photos appear after the cover in the full project's gallery.
  gallery?: ProjectImage[] | null;
  // Optional display date, such as "October 2026" or "2025–2026".
  // A single string uses string; string[] would describe a list of dates.
  date?: string;
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

// Reuse one gallery definition for the layout and the hub's metadata checks.
// The card's image remains independent; gallery-only projects can omit a cover.
export function getProjectImages(project: ProjectFrontmatter): ProjectImage[] {
  const label = `Project "${project.title}"`;
  if (project.image != null && typeof project.image !== "string") {
    throw new Error(`${label} needs image to be a local path, blank, or omitted.`);
  }
  const cover = project.image?.trim();
  const gallery = project.gallery ?? [];
  if (!Array.isArray(gallery)) {
    throw new Error(`${label} needs gallery to be a YAML list of photos with src and alt.`);
  }

  const entries: unknown[] = cover
    ? [{ src: cover, alt: project.imageAlt }, ...gallery]
    : gallery;
  const seen = new Set<string>();
  return entries.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${label} photo ${index + 1} needs src and alt fields.`);
    }
    const { src, alt, caption } = entry as Record<string, unknown>;
    if (typeof src !== "string" || !/^\/(?!\/)/.test(src.trim())) {
      throw new Error(`${label} photo ${index + 1} needs a local src starting with /, such as /images/projects/my-photo.jpg.`);
    }
    if (typeof alt !== "string" || !alt.trim()) {
      throw new Error(`${label} photo ${index + 1} needs descriptive alt text (imageAlt for the cover).`);
    }
    if (caption !== undefined && typeof caption !== "string") {
      throw new Error(`${label} photo ${index + 1} needs caption to be a string or omitted.`);
    }
    return { src: src.trim(), alt: alt.trim(), caption: caption?.trim() || undefined };
  }).filter(({ src }) => {
    // Keep the cover once if it is also listed among the extra gallery photos.
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

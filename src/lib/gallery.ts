// Shared photo metadata for project and experience stories.
// Files in public/ are served from the site root: omit "public" from URLs.
export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryMetadata {
  // A cover is optional and appears first. Blank YAML fields become null.
  image?: string | null;
  imageAlt?: string;
  gallery?: GalleryImage[] | null;
}

/** Validate optional photos, place the cover first, and remove duplicate paths. */
export function getGalleryImages(metadata: GalleryMetadata, label: string): GalleryImage[] {
  if (metadata.image != null && typeof metadata.image !== "string") {
    throw new Error(`${label} needs image to be a local path, blank, or omitted.`);
  }
  const cover = metadata.image?.trim();
  const gallery = metadata.gallery ?? [];
  if (!Array.isArray(gallery)) {
    throw new Error(`${label} needs gallery to be a YAML list of photos with src and alt.`);
  }

  const entries: unknown[] = cover
    ? [{ src: cover, alt: metadata.imageAlt }, ...gallery]
    : gallery;
  const seen = new Set<string>();
  return entries.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${label} photo ${index + 1} needs src and alt fields.`);
    }
    const { src, alt, caption } = entry as Record<string, unknown>;
    if (typeof src !== "string" || !/^\/(?!\/)/.test(src.trim())) {
      throw new Error(`${label} photo ${index + 1} needs a local src starting with /, such as /images/my-photo.jpg.`);
    }
    if (typeof alt !== "string" || !alt.trim()) {
      throw new Error(`${label} photo ${index + 1} needs descriptive alt text (imageAlt for the cover).`);
    }
    if (caption !== undefined && typeof caption !== "string") {
      throw new Error(`${label} photo ${index + 1} needs caption to be a string or omitted.`);
    }
    return { src: src.trim(), alt: alt.trim(), caption: caption?.trim() || undefined };
  }).filter(({ src }) => {
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

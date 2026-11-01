// Edit this file whenever you want to feature a different page on the home page.
// Keeping the content here means you can change the highlight without touching
// the component's HTML or CSS in components/PageHighlight.astro.

// An interface describes the fields TypeScript expects on the highlight object.
// Title, summary, and destination are required; the label text is optional.
export interface HomeHighlight {
  title: string;
  summary: string;
  href: string;
  category?: string;
  linkLabel?: string;
}

// export lets index.astro import this object. The : HomeHighlight annotation
// helps the editor catch missing fields or values of the wrong type.
export const homeHighlight: HomeHighlight = {
  title: "The turning point of my life",
  summary:
    "The story behind my path to engineering, and how I got to where I am today.",
  // Use any page's public URL, without src/pages/ or a .md/.astro extension.
  // Examples: /projects/voron, /experience/engineering-studies, or /contact.
  href: "/experience/engineering-studies",
  category: "Personal story",
  // Optional: the default is "Read the page". Choose wording for this feature.
  linkLabel: "Read the story",
};

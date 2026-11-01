// Edit this file whenever you want to feature a different page on the home page.
// Keeping the content here means you can change the highlight without touching
// the component's HTML or CSS in components/PageHighlight.astro.

// An interface describes the fields TypeScript expects on the highlight object.
// Each field is a string, and all four are required.
export interface HomeHighlight {
  title: string;
  summary: string;
  href: string;
  category: string;
}

// export lets index.astro import this object. The : HomeHighlight annotation
// helps the editor catch missing fields or values of the wrong type.
export const homeHighlight: HomeHighlight = {
  title: "Building this portfolio",
  summary:
    "The story behind this site: building an explorable network of experiences, experimenting with Astro, and learning along the way.",
  // href is the page's URL, rather than its src/pages/ filename.
  href: "/projects/personal-portfolio",
  category: "Personal project",
};

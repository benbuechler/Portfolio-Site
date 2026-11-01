# Ben's portfolio: a guide to the code

This Astro portfolio has a home page, projects, a blog, contact information, and
experience stories. Source comments explain the HTML, CSS, JavaScript,
TypeScript, and Astro features used throughout the project.

## A useful reading order

1. Start with [the home page](src/pages/index.astro) to see components put together.
2. Read [Header](src/components/Header.astro) for basic HTML and scoped CSS.
3. Read [BaseLayout](src/layouts/BaseLayout.astro) for the shared HTML document,
   props, slots, navigation, and browser scripts.
4. Read [the global stylesheet](src/styles/global.css) for variables, themes,
   Flexbox, Grid, responsive rules, and interactive selectors.
5. Read [Contact](src/pages/contact.astro) and [Projects](src/pages/projects.astro)
   for arrays, objects, `.map()`, and conditional rendering.
6. Follow [experience data](src/lib/experiences.ts) into
   [ExperienceTimeline](src/components/ExperienceTimeline.astro), then open
   [a Markdown story](src/pages/experience/engineering-studies.md) and
   [ExperienceLayout](src/layouts/ExperienceLayout.astro).
7. Finish with [page discovery](src/lib/site-pages.ts),
   [page-cloud maths](src/lib/page-cloud.ts), and
   [PageCloud](src/components/PageCloud.astro). These combine earlier ideas
   with 3D coordinates, canvas drawing, custom elements, and pointer events.
8. Read [the page-cloud tests](src/lib/page-cloud.test.ts) to see how assertions
   check the hierarchy and screen positions across rotations and viewport sizes.

## Changing the home-page highlight

Edit [home-highlight.ts](src/lib/home-highlight.ts) to choose the page you are
currently working on. Set its `title`, `summary`, `category`, and `href` (the
page URL, such as `/experience/building-this-portfolio`). The
[PageHighlight component](src/components/PageHighlight.astro) renders that
content below the home-page introduction. You choose this feature manually;
changing another file does not automatically replace it.

## Adding projects

The `/projects` hub displays a picture, title, and summary for each project.
Each card opens that project's own page, using the same Markdown approach as
the blog and experience stories.

1. Copy [the project template](src/pages/projects/_template.md) to a new `.md`
   file in the same folder, for example `my-project.md`.
2. Set `title`, `summary`, `image`, and `imageAlt` in the YAML frontmatter.
   Put the picture in `public/images/projects/` and use its public URL, such as
   `/images/projects/my-project.jpg`. `imageAlt` describes the picture.
3. Optionally add `tools` labels and a numeric `sortOrder`. Smaller numbers
   appear first; omitted values default to `0`, with titles breaking ties.
4. Keep the `layout` value and replace the Markdown body with your write-up.
   Use `##` for sections; the layout supplies the title and cover picture.
5. Save. `/projects/my-project`, its hub card, and its home-page map node are
   discovered automatically. Keep filenames prefixed with `_` while drafting
   to exclude them from all three places.

[The portfolio project](src/pages/projects/personal-portfolio.md) is the first
entry. [ProjectLayout](src/layouts/ProjectLayout.astro) styles the detail pages;
[projects.astro](src/pages/projects.astro) discovers and displays their cards.
The hub uses three columns on large screens, two on medium screens, and one
on phones. Covers are cropped to a consistent 8:5 ratio.

## Showing an experience without a story

Add this YAML field to an experience file in `src/pages/experience/` when you
only want its summary displayed on the timeline:

```yaml
hasStory: false
```

The entry stays on the timeline, with its title, period, and summary, but its
card is not clickable and “Read the story” is hidden. Omit the field or set
`hasStory: true` to keep the story link. The
[experience template](src/pages/experience/_template.md) includes this option.

## Writing blog entries

The blog lives at `/blog`. Each entry is a Markdown file in `src/pages/blog/`,
using the same file-based approach as the experience stories.

1. Copy [the entry template](src/pages/blog/_template.md) to a new file in the
   same folder, for example `my-first-project.md`.
2. Set `title`, `summary`, and `date` in its YAML frontmatter. Keep the date
   quoted in `"YYYY-MM-DD"` format, such as `"2026-10-31"`. `tags` is optional.
3. Keep the `layout` value unchanged so your entry uses the shared blog layout.
4. Replace the Markdown below the second `---` line with your writing. Use `##`
   for section headings; the layout supplies the page's main heading.
5. Save the file. It appears at `/blog/my-first-project`, on the blog index,
   and in the home-page cloud. The index sorts entries by date, newest first.

Keep a filename prefixed with `_` while drafting (for example `_my-first-project.md`).
Astro excludes those files from page routes, and the blog index and page cloud
exclude them too. Remove the prefix when you want the entry included in the site.
The template itself stays excluded. Dates control ordering, not scheduled publishing.

[The starter entry](src/pages/blog/starting-this-blog.md) is ready to edit.
[BlogLayout](src/layouts/BlogLayout.astro) styles individual entries,
[blog.astro](src/pages/blog.astro) builds the index, and
[blog.ts](src/lib/blog.ts) shares their types and date formatting.

## How a page reaches the browser

Astro builds this project into static HTML, CSS, and JavaScript in `dist/`.
The filename under `src/pages/` determines the URL: `index.astro` becomes `/`,
`contact.astro` becomes `/contact`, and
`experience/business-degree.md` becomes `/experience/business-degree`.

Most `.astro` files have these parts:

```astro
---
// Frontmatter: prepare data while Astro builds this static site.
const greeting: string = "Hello";
---

<!-- Template: HTML with expressions that insert prepared values. -->
<h1>{greeting}</h1>

<script>
  // Browser code: this bundled module runs after the HTML is parsed.
  console.log("The page is ready");
</script>

<style>
  /* Scoped CSS: styles this component's own h1 elements. */
  h1 { color: blue; }
</style>
```

The `string` annotation is TypeScript: it helps the editor check your code.
Types are removed before JavaScript runs. Frontmatter cannot access the
visitor's `document`, `window`, or `localStorage`; those browser APIs are used
by this site's scripts.

The `---` block in a `.md` file has a different purpose: it contains YAML
metadata such as `title` and `sortOrder`. Its body is Markdown that Astro turns
into HTML. This project discovers those files with `import.meta.glob()`;
it does not currently define an Astro content collection.

`BaseLayout` imports `global.css`, supplies the document and navigation, and
places each page's content into `<slot />`. Props are named inputs such as
`title="Home"`; slots hold the markup between component tags.

See Astro's official guides to
[components and slots](https://docs.astro.build/en/basics/astro-components/),
[routing](https://docs.astro.build/en/guides/routing/), and
[styles](https://docs.astro.build/en/guides/styling/).

## Recurring syntax

| Syntax | Meaning here |
| --- | --- |
| `const value = ...` | Declare a binding that cannot be reassigned. An object or array it refers to can still be modified. |
| `let value = ...` | Declare a variable that will be reassigned, such as a rotation angle. |
| `interface Name { ... }` | Describe the properties TypeScript expects on an object. |
| `property?: string` | The property is optional; reading it can also produce `undefined`. |
| `({ title, href })` | Destructure an object into local variables with those names. |
| `(item) => ...` | An arrow function, often passed to an array method or event listener. |
| `items.map(...)` | Transform each item into a result, often a block of markup. |
| `condition ? a : b` | Choose one expression based on a condition. |
| `condition && markup` | Render the markup when the condition is truthy. |
| `value ?? fallback` | Use the fallback only for `null` or `undefined`. |
| `element?.method()` | Call the method only if the element is not `null` or `undefined`. |
| `...values` | Spread entries into an array, object, or function's arguments, depending on context. |
| `addEventListener(...)` | Run a callback when a browser event occurs. |
| `data-*` | Custom HTML attributes that scripts read through `dataset`. |

HTML describes structure and meaning; CSS describes presentation. Classes such
as `content-card` connect the two. In `border-radius: var(--border-radius)`,
`border-radius` rounds corners and `var()` reads the custom property
`--border-radius`, defined as `12px` in `global.css`.

Global styles apply throughout the document. Component `<style>` blocks are
scoped to the component's markup; `:global(...)` opts a selector out of that
scoping. Theme switching overrides colour variables on `<html>` so components
can share the same rules in both themes.

The site follows the visitor's system theme until they choose a mode with the
sun/moon button. A moon offers dark mode while the site is light; a sun offers
light mode while it is dark. The tooltip describes the same action.
Explicit choices are saved in `localStorage`
for later pages and visits. Without a saved choice, system theme changes are
also applied while the page is open; CSS supplies the system default without JS.

## Files outside `src/`

| File or folder | Purpose |
| --- | --- |
| `public/favicon.svg` | Vector browser-tab icon, copied to the build as a static asset. |
| `astro.config.mjs` | Astro settings; enables the React and MDX integrations. |
| `tsconfig.json` | TypeScript/editor settings, inherited from Astro's strict preset. |
| `wrangler.jsonc` | Cloudflare configuration for serving the built `dist/` assets. |
| `.vscode/` | Recommended editor extension and a development launch configuration. |
| `.gitignore` | Patterns telling Git which generated or local files to ignore. |
| `AGENTS.md` | Instructions for coding agents, including background server commands. |
| `node_modules/` | Installed dependencies, maintained by their authors. |
| `.astro/` | Astro-generated local files and type declarations. |
| `dist/` | Generated production output, recreated by the build. |

Configuration files that support comments are annotated directly. Generated
files and installed dependencies are left for their tools to manage.

### Why `package.json` has no comments

`package.json` uses strict JSON, which does not allow comments. Its fields mean:

| Field | Meaning in this project |
| --- | --- |
| `name` | Package name; currently an empty string. |
| `type: "module"` | Treat `.js` files as ES modules, using `import` and `export`. |
| `version` | This project's package version, currently `0.0.1`. |
| `engines.node` | Declared Node.js version range: `>=22.23.4`. |
| `scripts` | Terminal command shortcuts, invoked with `npm run <name>`. |
| `dependencies` | Astro, React/MDX integrations, React, and supporting packages. |
| `devDependencies` | Development tooling; this project lists Wrangler for Cloudflare. |
| `allowScripts` | Package-manager configuration naming dependency versions allowed to run installation scripts when supported by that manager. |

`@types/react` and `@types/react-dom` supply editor/type declarations. React and
MDX support are installed, while the current source uses Astro components and
ordinary Markdown. A leading `^` in these nonzero-major dependency versions
allows compatible updates within that major version.

## Commands

Run these from the project folder. Install dependencies if needed with
`npm install`, using a Node.js version satisfying `engines.node`.

| Command | Purpose |
| --- | --- |
| `npm run dev -- --background` | Start the background development server, as required by `AGENTS.md`. |
| `npm run astro -- dev status` | Check the background server's status. |
| `npm run astro -- dev logs` | Read its output. |
| `npm run astro -- dev stop` | Stop it. |
| `npm run build` | Compile the production site into `dist/`. |
| `npm run preview` | Preview an existing production build locally. |
| `node --test src/lib/page-cloud.test.ts` | Run the geometry tests with Node's built-in test runner and TypeScript stripping. |

The production build checks that Astro can compile and render the site; it is
not a substitute for a full TypeScript type check.

To explore, change one value at a time: adjust `--border-radius`, edit a heading,
or change a story's `sortOrder`. Follow the comments to see which components
read that value and where its effect appears.

# Ben's portfolio: a guide to the code

This Astro portfolio has a home page, projects, contact information, and
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

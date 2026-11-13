# Ben's portfolio: a guide to the code

This Astro portfolio has a home page, project stories and updates, contact
information, and experience stories. Source comments explain the HTML, CSS, JavaScript,
TypeScript, and Astro features used throughout the project.

## Search engine metadata

The production URL is `https://benbuechler.ca`, configured as `site` in
[astro.config.mjs](astro.config.mjs). [Seo](src/components/Seo.astro), included
by BaseLayout, generates each page's canonical URL, title, description, social
sharing metadata, and JSON-LD for the site, author, page, and breadcrumbs.
Use a specific `title` and `description` when adding a regular page; Markdown
stories use their `title` and `summary`. Project photos supply social previews
when they use a supported raster format; other pages use the shared
1200 × 630 [preview image](public/images/social-card.png), with its editable
[SVG source](public/images/social-card.svg).

The sitemap integration generates `/sitemap-index.xml` and `/sitemap-0.xml`
at build time. [robots.txt](src/pages/robots.txt.ts) points crawlers to the
index. The sitemap reads the rendered robots metadata to omit `noindex`
pages. Experience entries with `hasStory: false` receive `noindex, follow`,
keeping unfinished stories out of the sitemap while their timeline summaries
remain visible. Set `hasStory: true` when a story is ready to be indexed.
The 404 page is also excluded. New published pages are included automatically.

Cloudflare's `drop-trailing-slash` setting matches the canonical URLs and
existing navigation. [The redirect rules](public/_redirects) also send the
former `/blog` URL to `/projects` with an HTTP 301 response.

The Google verification file belongs in `public/`, and Astro copies it to the
site root without changing its contents. The exact `.html` URL is internally
rewritten to the identical `.txt` copy, avoiding Cloudflare's HTML URL redirect.
Keep both verification files and the rewrite after verification. After
deploying, complete verification in Google Search Console, submit
`https://benbuechler.ca/sitemap-index.xml` under **Sitemaps**, and use
**URL inspection** to request indexing of the home page. Google controls when
pages are crawled and indexed; see its
[sitemap submission guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#addsitemap).

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

Edit [home-highlight.ts](src/lib/home-highlight.ts) to feature any page: an
experience story, a project, or a regular page. Set `title`, `summary`, and
`href`. The title and summary are your own preview text; they do not have to
match the destination page's metadata. `category` is optional and is hidden
when omitted. Set `linkLabel`, such as `"Read the story"`, to customize the
link text; it defaults to `"Read the page"`.

Use the visitor-facing URL for `href`, without `src/pages/` or the `.astro` or
`.md` extension:

| Source file | `href` |
| --- | --- |
| `src/pages/experience/engineering-studies.md` | `/experience/engineering-studies` |
| `src/pages/projects/voron.md` | `/projects/voron` |
| `src/pages/contact.astro` | `/contact` |

The [PageHighlight component](src/components/PageHighlight.astro) renders this
content below the home-page introduction. You choose the feature and its preview
text manually; changing another page does not automatically replace them.

## Umami analytics

[BaseLayout](src/layouts/BaseLayout.astro) loads the existing Umami Cloud tracker
on every page. Pageviews are automatic; [analytics.ts](src/lib/analytics.ts) uses
[Umami's JavaScript API](https://docs.umami.is/docs/tracker-functions) for actions.
After deploying these changes, find actions under **Events** in Umami and inspect
their **Properties** to compare destinations, placements, and controls.

| Event | Interaction |
| --- | --- |
| `navigation-click` | Header navigation or home logo. |
| `cta-click` | Homepage View Projects / Contact Me buttons. |
| `featured-page-click` | Homepage featured story. |
| `project-click` / `experience-click` | Project grid or linked timeline card. |
| `contact-click` | LinkedIn, GitHub, Email, or YouTube contact link. |
| `return-click` | Top/bottom links back to the projects or experience hub. |
| `map-navigate` | Map label or canvas dot opening a page. |
| `map-rotate` / `map-reset` | Rotation buttons, keyboard controls, or a completed drag. |
| `map-motion-change` | Explicit pause/resume of automatic rotation. |
| `gallery-open` / `gallery-next` / `gallery-previous` / `gallery-close` | Photo viewer actions, including keyboard and backdrop dismissal. |
| `model-open` / `model-close` | Expanded 3D viewer actions, including keyboard and backdrop dismissal. |
| `gallery-image-click` | Direct photo link when opening a separate tab or using the fallback viewer. |
| `menu-toggle` / `theme-change` | Menu open/close button or a deliberate theme choice. |
| `skip-to-content` | Keyboard skip link. |
| `link-click` / `outbound-click` | Other links, including future Markdown links. |

Every event includes `page` (the source pathname). Link events also include
`label`, `destination`, `location`, and `type`; contact labels identify the
platform. Top/bottom return links have distinct locations. Map events include
input method and direction where applicable, and gallery events include the
one-based `photo` number and `total`. State changes include `theme`, `open`, or
`paused`. Initial setup, system preference changes, and automatic map movement
do not emit action events.

New links are tracked automatically. Give a link a custom event/placement with
these attributes; `data-analytics-location` can also go on a containing element:

```html
<a href="/projects" data-analytics-event="cta-click"
   data-analytics-location="home-hero" data-analytics-label="View Projects">
  View Projects
</a>
```

Use these `data-analytics-*` attributes instead of `data-umami-event` to avoid
double counting. For a new interactive control, call `trackEvent()` after the
action succeeds. Keep names under Umami's 50-character limit and send only
non-sensitive action metadata. Custom destination properties omit query strings,
fragments, credentials, and email/phone addresses. Tracking never waits before
navigation, and unavailable or blocked Umami calls do not stop site controls.

Run `node --test src/lib/analytics.test.ts` for the analytics regression checks.

## Security and public source

The Giscus repository/category IDs, Umami website ID, Clarity project ID, and
Google verification file are public configuration. They do not grant access to
your accounts. Keep actual API keys, passwords, private keys, and deployment
tokens out of source code and all `PUBLIC_*` environment variables.
[.gitignore](.gitignore) excludes local environment files, Cloudflare secrets and
state, AWS credentials, and common private-key formats. Example environment
files must contain only public values or placeholders. Ignore rules do not
remove files from existing Git history.

[BaseLayout](src/layouts/BaseLayout.astro) removes Giscus sign-in callback
sessions from the URL before loading analytics. Umami also excludes query
strings. Analytics stays disabled on a callback if its sensitive URL cannot be
cleared. The site still trusts the third-party Giscus, Umami, and Clarity scripts
it loads; avoid adding scripts from untrusted sources.

Cloudflare reads [public/_headers](public/_headers) from the static build to
block framing of this site, disable MIME sniffing, limit referrers, deny unused
device permissions, and restrict base URLs, plugins, and form destinations.
These headers take effect after deployment. The content policy is a baseline;
it does not restrict script sources. If hosting changes to server-rendered
responses, set equivalent headers in that server.

[Dependabot](.github/dependabot.yml) requests weekly npm dependency updates once
the configuration reaches GitHub's default branch. Review those pull requests
and run `npm audit`, `npm run build`, and `node --test src/lib/*.test.ts` when
updating dependencies. Check GitHub's Security tab for secret-scanning and
dependency alerts; repository push protection and account two-factor
authentication are settings managed on GitHub.

Giscus only requires its Discussions repository to be public. The site's source
can remain private if comments use a separate public repository.

## Article comments with Giscus

[Comments](src/components/Comments.astro) embeds [Giscus](https://giscus.app/) below
project articles and published experience stories. Giscus is free and stores
comments in GitHub Discussions while the articles remain static. Readers sign in
with GitHub to comment; there is no separate guest display-name or email form.

The component includes the public configuration for
`benbuechler/Portfolio-Site`, using its **Q&A** discussion category. A normal
`npm run build` includes this configuration; no environment variables are
required for the current repository or its Cloudflare deployment.

Comments are enabled by default for projects and experience entries with
`hasStory: true`. Add `comments: false` to an article's YAML frontmatter to opt
out. The embed loads its iframe lazily and follows the site's light/dark theme.
Moderate comments through the repository's GitHub Discussions.

By default, articles use Giscus's **pathname** mapping with `data-strict="0"`,
matching the configured embed. Set an optional `commentId` to use **specific
term** mapping instead. Before renaming an article with existing comments, set
`commentId` to its original Giscus term, normally the old path without its leading
slash, such as `commentId: projects/voron`. Keep that term stable to retain the
thread across future URL changes.

To use a different repository, enable Discussions on a public repository,
install the [Giscus GitHub App](https://github.com/apps/giscus), and choose a
category in the [Giscus configurator](https://giscus.app/). A separate public
comments repository also works if the site's source should remain private.
Copy [.env.example](.env.example) to `.env` and replace all four public values
with the configurator's generated script attributes:

| Environment variable | Generated script attribute |
| --- | --- |
| `PUBLIC_GISCUS_REPO` | `data-repo` |
| `PUBLIC_GISCUS_REPO_ID` | `data-repo-id` |
| `PUBLIC_GISCUS_CATEGORY` | `data-category` |
| `PUBLIC_GISCUS_CATEGORY_ID` | `data-category-id` |

These optional overrides need no GitHub token or other secret. Explicitly
setting any value to blank hides the comments section. Restart the development
server after changing `.env`. For production overrides, set the variables in the
Cloudflare **build environment**, then rebuild and deploy; runtime variables
alone cannot change generated static HTML.

## Home-page map motion

The node map gently drifts while idle, easing toward a new random direction
every few seconds. Both sideways rotation and tilt change over time.
Clicking, keyboard focus, and dragging pause the drift; it resumes after a short
idle delay, even while the mouse remains over the map. Hovering alone keeps it
moving. Off-screen maps and hidden browser tabs stop animating.
Use the pause/play icon beside the arrow controls to stop or resume it. Automatic
motion starts disabled when the system requests reduced motion, with the option
to resume explicitly. The `driftSpeed` value in
[PageCloud](src/components/PageCloud.astro) controls its speed.

## Adding projects

The `/projects` hub displays a title, summary, and optional picture for each project.
Each card opens that project's own page, using the same Markdown approach as
the experience stories. Project pages hold both the build story and ongoing notes.

1. Copy [the project template](src/pages/projects/_template.md) to a new `.md`
   file in the same folder, for example `my-project.md`.
2. Set the required `title` and `summary` in the YAML frontmatter.
   To add a cover, put the picture in `public/images/projects/` and set `image`
   to its public URL, such as `/images/projects/my-project.jpg`. A non-empty
   `image` requires an `imageAlt` description. Remove or comment out `image`,
   leave `image:` blank, or use `image: ""` for no cover, with no placeholder.
3. Optionally add a `gallery` list for extra photos. Each item needs `src` (a
   public image URL) and `alt`, with an optional `caption`; the template includes
   commented examples. The cover appears first, followed by the gallery items.
   Gallery-only projects show photos on the detail page and a text-only hub card.
   With neither a cover nor gallery, the project page is text-only.
4. Optionally add a single quoted `date`, such as `date: "October 2026"`.
   It appears as written on both the card and the project page; ranges such as
   `"2025–2026"` or `"Ongoing"` also work. Omit `date` to hide it.
   You can also add `tools` labels and a numeric `sortOrder`. Smaller numbers
   appear first; `sortOrder` defaults to `0`, with titles breaking ties.
   The display date does not affect this order.
5. Keep the `layout` value and replace the Markdown body with your write-up.
   Use `##` for sections; the layout supplies the title and optional photo gallery.
6. Save. `/projects/my-project`, its hub card, and its home-page map node are
   discovered automatically. Keep filenames prefixed with `_` while drafting
   to exclude them from all three places.

[The portfolio project](src/pages/projects/personal-portfolio.md) is the first
entry. [ProjectLayout](src/layouts/ProjectLayout.astro) styles the detail pages;
[projects.astro](src/pages/projects.astro) discovers and displays their cards.
The hub uses three columns on large screens, two on medium screens, and one
on phones. Hub covers are cropped to a consistent 8:5 ratio. Project pages have
a compact media sidebar on desktop; the text uses the available width and flows
below the sidebar. On phones, the small model preview and swipeable photos stack
above the story. Click a model or photo to open its larger viewer. Section links
below the introduction jump directly to the story, model, or photos. Both viewers
support Escape, a close button, and backdrop dismissal. The photo viewer also
supports Previous/Next and left/right arrow keys.

## Interactive 3D project models

[ProjectModelViewer](src/components/ProjectModelViewer.astro) uses Google's
[`<model-viewer>`](https://modelviewer.dev/) with mouse, touch, and keyboard
camera controls in both the small preview and the expanded dialog. Use the
separate **Expand** button to open the larger view; closing it returns the model
to the sidebar and restores keyboard focus. The same
viewer moves between both sizes, so there is only one model instance. The dialog
fits phone and landscape screens and follows the site's theme.
The viewer library loads from a pinned jsDelivr URL only on pages with a model;
the model itself loads lazily against a plain background with a loading message.

The Voron page is already configured: add your printer model as
`public/models/voron/voron.glb`, then refresh the development page or rebuild
for production. Until that file exists, the viewer stays hidden and the page
continues to show its photos.

For another project, put its model under `public/models/` and add this to its
Markdown frontmatter:

```yaml
model:
  src: /models/my-project/model.glb
  alt: "An interactive 3D model of the assembled project."
```

Use a `.glb` export when possible: it can package the geometry, materials, and
textures in one file. `.gltf` also works; keep its referenced buffers and textures
beside it using the paths in the file. CAD formats such as STEP and STL need to
be converted to GLB or glTF first. Test the export in the
[model-viewer editor](https://modelviewer.dev/editor/) to check its appearance.
For a large CAD assembly, simplify the geometry before exporting so it loads
comfortably on phones. The existing photo gallery remains available below the
viewer, including when the model fails to load.

## Adding photos to an experience

Experience stories support the same optional photo fields as projects. Add them
to the YAML frontmatter of a file in `src/pages/experience/`; the
[experience template](src/pages/experience/_template.md) has commented examples.
Put photos in `public/images/experience/` and use their public paths:

```yaml
image: /images/experience/example.jpg
imageAlt: "A description of the main photo."
gallery:
  - src: /images/experience/another-photo.jpg
    alt: "A description of another photo."
    caption: "An optional caption."
```

Replace the example paths with your own files. The optional `image` appears
first, followed by the `gallery` list. Each photo needs descriptive alt text;
captions are optional. You can use `gallery` without an `image`, or omit both
for a text-only story. Blank `image:` and `gallery:` fields also work.

Photos appear in a right sidebar on desktop and stack below the heading on
smaller screens. Click a photo to expand it; use Previous/Next or the left/right
arrow keys to browse, and Escape to close the viewer. No sidebar is rendered
when there are no photos.

## Showing an experience without a story

Add this YAML field to an experience file in `src/pages/experience/` when you
only want its summary displayed on the timeline:

```yaml
hasStory: false
```

The entry stays on the timeline, with its title, period, and summary, but its
card is not clickable and “Read the story” is hidden. Its node also stays visible
in the home-page map without opening a page when clicked or tapped. Omit the
field or set `hasStory: true` to enable the timeline and node links. The
[experience template](src/pages/experience/_template.md) includes this option.

## Writing project updates

Keep build stories, experiments, and progress notes together in the relevant
file under `src/pages/projects/`. A project can start as a short note and grow
as the work develops; photos, dates, and tools are optional.

For an ongoing project, add a `## Progress updates` section and use a dated
`###` heading for each update, newest first. The project template includes an
example. These are ordinary Markdown sections on the same project page, so
the URL stays the same as you add updates. Update the summary when useful;
the frontmatter date is display text and does not automatically track edits.

The former `/blog` address redirects to `/projects`.

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
| `astro.config.mjs` | Astro settings, production URL, React/MDX integrations, and sitemap generation. |
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

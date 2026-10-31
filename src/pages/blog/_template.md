---
# COPY THIS FILE to a new .md file in this same folder to start an entry.
# Example: my-first-project.md becomes /blog/my-first-project.
# A leading underscore keeps this template (or a draft) out of the built site.
layout: ../../layouts/BlogLayout.astro
# The layout turns this into the main h1 heading automatically.
title: "Your entry title"
# A brief summary is shown on the index and used for the page description.
summary: "One or two sentences introducing what this entry is about."
# Replace this with the entry's date. Keep the quotes and YYYY-MM-DD format.
date: "2026-10-31"
# Optional: remove the entire tags list if you do not need labels for this entry.
tags:
  - Learning
---

<!-- Write Markdown below the frontmatter. ## makes a section heading; blank
     lines separate paragraphs. This template demonstrates common formatting. -->

## What I’m working on

Introduce the idea, project, or lesson you want to share.

## What I learned

<!-- **text** makes bold text, and *text* adds emphasis. -->
Describe the **important details** and anything that *surprised you*.

<!-- Dashes create bullet points; backticks mark short pieces of code. -->
- A useful discovery.
- A challenge and how you approached it.
- A small code detail, such as `const`, that helped something click.

<!-- Three backticks create a code block. The language name adds highlighting. -->
```js
const message = "A small example worth remembering";
console.log(message);
```

## What’s next

Finish with the next question or idea you want to explore.

<!-- Links use [visible text](destination). Relative site URLs start with /. -->
Explore more of [my projects](/projects).

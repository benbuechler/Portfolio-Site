---
# This opening block is YAML frontmatter (data), unlike the JavaScript/TypeScript
# frontmatter in .astro files. # introduces a YAML comment; --- ends the block.
# The path selects the Astro layout that wraps this Markdown's generated HTML.
layout: ../../layouts/ExperienceLayout.astro
# These fields are read by ExperienceLayout and by lib/experiences.ts.
title: Building this portfolio
# A short preview for the timeline and the page's metadata description.
summary: Creating a home for my projects, experience, and professional connections.
# The category badge and human-readable period are separate from sorting.
category: Personal project
period: Ongoing
# Smaller numbers appear first. This controls ordering without requiring dates.
sortOrder: 20
---

<!-- This file becomes /experience/building-this-portfolio because it is inside
     src/pages/experience/. The YAML above supplies data; everything below is
     Markdown content rendered into ExperienceLayout's slot. These HTML comments
     are notes for reading the source, rather than visible page text. -->

<!-- ## creates an h2; the layout supplies the page's h1 from the title field. -->
## The idea

<!-- Plain text becomes a paragraph. A blank line begins a new paragraph; a
     single line break inside one paragraph normally remains part of that text. -->
I wanted a place to introduce myself and share my work in electrical engineering.
The goal is to make it easy to get an overview, then explore the experiences and projects that interest you.

<!-- Another h2 starts the next section of this same story. -->
## The site so far

This portfolio is built with Astro. It includes light and dark themes, a background
network with a node for each page, and a timeline that links to individual experience stories.

<!-- These sections are page content, not additional URLs or timeline entries. -->
## Growing with my work

As I add pages and write-ups, the portfolio will become a fuller picture of what I’m working on.
You can follow the timeline for an overview or choose an individual story for more detail.

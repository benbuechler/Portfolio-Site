---
layout: ../../layouts/ProjectLayout.astro
title: "Personal portfolio site"
summary: "A growing home for my projects and experience, with an interactive 3D map connecting every page."
image: "/images/projects/portfolio.svg"
imageAlt: "Illustration of the portfolio’s connected page nodes in a blue 3D network."
tools:
  - Astro
  - TypeScript
  - Canvas
sortOrder: 10
---

## The idea

I wanted a space that could grow alongside my studies, projects, and interests.
The starting point was an explorable network: each page is a node, with connections
that reflect how the different parts of the site fit together.

## How it works

The site uses Astro to build static pages. The home page discovers the site’s
pages and arranges them into an interactive 3D network, drawn with Canvas.
Dragging rotates the map, while ordinary links let visitors open each page.
Keyboard controls and rotation buttons provide other ways to explore it.

The rest of the site brings together project write-ups, an experience timeline,
a blog, and contact information. Markdown files keep the writing separate from
the layouts, so adding a project or entry also adds it to its hub and the home-page map.

## What I’m learning

Building this site has been a way to experiment with web development and turn
an idea into something I can use. AI tools have helped with the more complex
components, while I continue to shape the content, explore the code, and work
through the details of how the site behaves on different devices.

## What’s next

Keep adding projects and notes as my work develops, and refine the site as I
learn what makes it easier to explore.

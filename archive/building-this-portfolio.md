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

I’ve always wanted a place to introduce myself, share my work, and document the things I learn along the way. I've tried building that space on different platforms over the years, but nothing ever quite captured what I envisioned. So this time, I decided to build it from the ground up.

I wanted to create something that could grow and evolve alongside me, reflecting my experiences, interests, and ideas as they develop. That's where the inspiration for this website began: the concept of an explorable brain, where every neuron represents a different part of who I am. Each connection tells a story, and as I continue to learn and explore, the network grows with me.

## The site so far

This portfolio was built using Astro. I'm by no means a front-end developer, nor do I claim to be. I fully acknowledge and embrace the fact that many of the more complex components of this website were created with the help of AI tools. For me, the goal wasn't to prove that I could write every line of code myself, but to take an idea I had envisioned and bring it to life. Along the way, I've been able to experiment, solve problems, and learn more about web development than I would have otherwise.

## Growing with my work

As I add pages and write-ups, the portfolio will become a fuller picture of what I’m working on.
You can follow the timeline for an overview or choose an individual story for more detail.

---
# YAML frontmatter stores metadata as key: value pairs. # comments are ignored.
# The relative layout path is resolved from this Markdown file's directory.
layout: ../../layouts/ExperienceLayout.astro
# The layout renders this title as h1; the timeline also uses it for the link.
title: Electrical engineering studies
# Used as the timeline preview and the detail page's metadata description.
summary: My ongoing studies in electrical engineering, driven by an interest in technology and innovation.
# These strings describe the entry; the period is displayed rather than parsed.
category: Education
period: Ongoing
# A number, rather than quoted text: smaller sortOrder values appear earlier.
sortOrder: 10
---

<!-- Astro makes this file a page at /experience/engineering-studies.
     lib/experiences.ts reads its metadata for the overview timeline. An optional
     organization field could also be added above; it is omitted in this entry. -->

<!-- ## is a level-two heading. ExperienceLayout already supplies the h1. -->
## The starting point

<!-- Ordinary Markdown text becomes HTML paragraphs inside the layout's slot. -->
I’m an electrical engineering student with a passion for technology and innovation.
This portfolio is a place to share my projects, skills, and experiences as I continue learning.

<!-- Blank lines separate blocks; another ## begins a new section of the story. -->
## More to come

I’ll share more about my studies and the work behind them here as the portfolio grows.
